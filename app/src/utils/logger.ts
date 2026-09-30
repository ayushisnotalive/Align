/**
 * Centralized logging utility for Align.
 * 
 * Prevents disruptive React Native / Expo LogBox RedBoxes & YellowBoxes
 * for handled errors, background queries, and expected network states,
 * while preserving clean, informative logs in Metro terminal.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface ErrorLogOptions {
  /** If true, explicitly triggers React Native's LogBox RedBox overlay (default: false) */
  redbox?: boolean;
  context?: Record<string, any>;
}

class Logger {
  private formatTag(tag: string): string {
    return `[${tag}]`;
  }

  debug(tag: string, message: string, ...args: any[]): void {
    if (__DEV__) {
      console.log(`${this.formatTag(tag)} 🔍 ${message}`, ...args);
    }
  }

  info(tag: string, message: string, ...args: any[]): void {
    if (__DEV__) {
      console.log(`${this.formatTag(tag)} ℹ️ ${message}`, ...args);
    }
  }

  warn(tag: string, message: string, ...args: any[]): void {
    if (__DEV__) {
      // Use console.log in DEV to output cleanly to Metro terminal without popping LogBox warning banner
      console.log(`${this.formatTag(tag)} ⚠️ ${message}`, ...args);
    }
  }

  error(tag: string, message: string, error?: unknown, options?: ErrorLogOptions): void {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;

    if (__DEV__) {
      if (options?.redbox) {
        console.error(`${this.formatTag(tag)} ❌ ${message}`, error, options?.context || {});
      } else {
        // Output to terminal without triggering Expo / React Native full-screen Redbox overlay
        console.log(`${this.formatTag(tag)} ❌ ${message}`, errorDetails || '', options?.context || '');
      }
    }
  }
}

export const logger = new Logger();
