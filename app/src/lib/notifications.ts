import { Platform } from 'react-native';
import { supabase } from './supabase';
import { logger } from '../utils/logger';

export async function registerForPushNotificationsAsync(userId: string) {
  logger.info('Push', 'Push notifications are disabled in Expo Go for SDK 53+. Skipping registration.');
  return null;
}
