/**
 * Analytics and Crash Reporting Service (Generic Placeholder)
 * 
 * Future-proofing: When you are ready to integrate a real SDK (e.g., Sentry, PostHog, or Firebase),
 * you can initialize the SDK in this file and map these generic functions to the SDK's native methods.
 * 
 * For example:
 * import * as Sentry from '@sentry/react-native';
 * Sentry.init({ dsn: 'YOUR_DSN' });
 */

class AnalyticsService {
  /**
   * Tracks a custom event in the app.
   * @param eventName The name of the event (e.g., 'user_signed_up', 'swiped_right')
   * @param properties Additional context (ensure NO PII is included)
   */
  trackEvent(eventName: string, properties?: Record<string, any>) {
    // Scaffold: Map to PostHog.capture() or FirebaseAnalytics.logEvent()
    console.log(`[Analytics] Tracked Event: ${eventName}`, properties || {});
  }

  /**
   * Sets the user ID for analytics tracking.
   * Should be called after successful login/registration.
   * @param userId The UUID of the user. Do not pass emails or names.
   */
  identifyUser(userId: string) {
    // Scaffold: Map to PostHog.identify() or Sentry.setUser()
    console.log(`[Analytics] Identified User: ${userId}`);
  }

  /**
   * Clears the current user's session from analytics.
   * Should be called on logout or account deletion.
   */
  resetUser() {
    // Scaffold: Map to PostHog.reset() or Sentry.setUser(null)
    console.log(`[Analytics] Reset User`);
  }

  /**
   * Logs a non-fatal error or exception for crash reporting.
   * @param error The error object
   * @param context Additional context where the error occurred
   */
  logError(error: Error, context?: Record<string, any>) {
    // Scaffold: Map to Sentry.captureException()
    console.error(`[Crashlytics] Error logged: ${error.message}`, context || {});
  }
}

export const Analytics = new AnalyticsService();
