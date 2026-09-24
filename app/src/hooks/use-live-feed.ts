import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export type LiveUser = {
  user_id: string;
  name: string;
  goal_code: string;
  type_codes: string[];
  expires_at: string;
  lat: number;
  lng: number;
  city_id: number;
};

export type UseLiveFeedReturn = {
  feed: LiveUser[];
  isLive: boolean;
  liveExpiresAt: Date | null;
  liveCountdown: string;
  loading: boolean;
  error: string | null;
  fetchFeed: (lat?: number, lng?: number, radiusKm?: number) => Promise<void>;
  goLive: (goalCode: string, typeCodes?: string[]) => Promise<{ error: string | null }>;
  stopLive: () => Promise<void>;
  sendHeartbeat: () => Promise<void>;
};

const POLLING_INTERVAL_MS = 20000; // 20 seconds
const HEARTBEAT_INTERVAL_MS = 60000; // 60 seconds
const REALTIME_CHANNEL_NAME = 'live_feed_changes';

export function useLiveFeed(): UseLiveFeedReturn {
  const [feed, setFeed] = useState<LiveUser[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [liveExpiresAt, setLiveExpiresAt] = useState<Date | null>(null);
  const [liveCountdown, setLiveCountdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  const fetchFeed = useCallback(async (lat?: number, lng?: number, radiusKm: number = 50) => {
    try {
      setError(null);
      // Passing null to lat/lng will make the backend skip distance filtering
      const { data, error: rpcError } = await supabase.rpc('get_live_feed', { 
        p_lat: lat ?? null,
        p_lng: lng ?? null,
        p_radius_km: radiusKm 
      });
      
      if (rpcError) throw rpcError;
      setFeed(data || []);
    } catch (err) {
      console.error('Error fetching live feed:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch live feed');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendHeartbeat = useCallback(async () => {
    try {
      const { error: rpcError } = await supabase.rpc('heartbeat');
      if (rpcError) {
        console.error('Heartbeat error:', rpcError);
        // Don't throw - heartbeat failures shouldn't crash the UI
      }
    } catch (err) {
      console.error('Heartbeat error:', err);
    }
  }, []);

  const goLive = useCallback(async (goalCode: string, typeCodes: string[] = []): Promise<{ error: string | null }> => {
    try {
      setError(null);
      const { error: rpcError } = await supabase.rpc('go_live', {
        p_goal_code: goalCode,
        p_type_codes: typeCodes,
      });

      if (rpcError) throw rpcError;

      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
      setLiveExpiresAt(expiresAt);
      setIsLive(true);

      // Start heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

      // Refresh feed to include self-status check
      await fetchFeed();

      return { error: null };
    } catch (err) {
      console.error('Error going live:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to go live';
      setError(errorMsg);
      return { error: errorMsg };
    }
  }, [sendHeartbeat, fetchFeed]);

  const stopLive = useCallback(async () => {
    try {
      setError(null);
      const { error: rpcError } = await supabase.rpc('stop_live');
      
      if (rpcError) throw rpcError;

      setIsLive(false);
      setLiveExpiresAt(null);
      setLiveCountdown('');

      // Stop heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      // Refresh feed
      await fetchFeed();
    } catch (err) {
      console.error('Error stopping live:', err);
      setError(err instanceof Error ? err.message : 'Failed to stop live');
    }
  }, [fetchFeed]);

  // Update countdown timer
  const updateCountdown = useCallback(() => {
    if (!liveExpiresAt) {
      setLiveCountdown('');
      return;
    }

    const now = new Date();
    const diff = liveExpiresAt.getTime() - now.getTime();

    if (diff <= 0) {
      setLiveCountdown('Expired');
      // Auto-stop when expired
      stopLive();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      setLiveCountdown(`${hours}h ${minutes}m`);
    } else {
      setLiveCountdown(`${minutes}m`);
    }
  }, [liveExpiresAt, stopLive]);

  // Handle app state changes (pause/resume heartbeat)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - resume heartbeat if live
        if (isLive && !heartbeatIntervalRef.current) {
          sendHeartbeat(); // Send immediate heartbeat
          heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
        }
      } else if (nextAppState.match(/inactive|background/) && appStateRef.current === 'active') {
        // App went to background - pause heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isLive, sendHeartbeat]);

  // Start polling and countdown on mount
  useEffect(() => {
    fetchFeed();

    // Start 20s polling fallback (without specific coordinates, just gets everything or ignores filter)
    pollingIntervalRef.current = setInterval(() => fetchFeed(), POLLING_INTERVAL_MS);

    // Start countdown timer
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    // Set up Realtime subscription for live feed changes
    // Using broadcast channel since live_presence has no RLS SELECT policy for clients
    realtimeChannelRef.current = supabase
      .channel(REALTIME_CHANNEL_NAME)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_presence',
        },
        (payload) => {
          // Re-fetch feed when any change occurs
          fetchFeed();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime subscription active for live_presence');
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('Realtime subscription error - falling back to polling only');
        }
      });

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [fetchFeed, updateCountdown]);

  // Update countdown when expiresAt changes
  useEffect(() => {
    updateCountdown();
  }, [liveExpiresAt, updateCountdown]);

  return {
    feed,
    isLive,
    liveExpiresAt,
    liveCountdown,
    loading,
    error,
    fetchFeed,
    goLive,
    stopLive,
    sendHeartbeat,
  };
}
