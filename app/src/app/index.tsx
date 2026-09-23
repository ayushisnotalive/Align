import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { lightTheme } from '../theme/colors';

export default function Splash() {
  const { session, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const checkProfileAndRoute = async () => {
      if (session) {
        // Fetch profile to see if it's complete
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_complete')
          .eq('id', session.user.id)
          .single();

        if (session.user.email === 'theayushchakraborty@gmail.com') {
          router.replace('/admin' as any);
        } else if (data && data.profile_complete) {
          router.replace('/(tabs)/discover' as any); 
        } else {
          router.replace('/(onboarding)/step1-profile' as any);
        }
      } else {
        router.replace('/(auth)/login');
      }
    };

    checkProfileAndRoute();
  }, [session, initialized]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={lightTheme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
