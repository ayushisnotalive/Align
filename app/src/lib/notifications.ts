import { Platform } from 'react-native';
import { supabase } from './supabase';

export async function registerForPushNotificationsAsync(userId: string) {
  console.log('Push notifications are disabled in Expo Go for SDK 53+. Skipping registration.');
  return null;
}
