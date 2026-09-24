export const lightTheme = {
  background: '#F7F8FA',     // Elevated light gray
  surface: '#FFFFFF',        // Pure white cards
  card: '#FFFFFF',
  primary: '#4E31E8',        // Deep Indigo (from our profile UI)
  primaryLight: '#F0EEFC',   // Subtle primary background for tags/buttons
  text: '#111111',           // Near black
  textSecondary: '#888888',
  textTertiary: '#BDBDBD',
  border: '#EAEAEA',
  danger: '#FF4B4B',
  success: '#4CAF50',
  warning: '#F5A623',
  info: '#007AFF',
  
  // Strict semantic shadows for React Native
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#4E31E8',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    }
  }
};

export const darkTheme = {
  background: '#0F0F11',
  surface: '#1A1A1E',
  card: '#1A1A1E',
  primary: '#5B40F6',
  primaryLight: '#2A2445',
  text: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
  border: '#2C2C30',
  danger: '#FF5C5C',
  success: '#59C75D',
  warning: '#F7B746',
  info: '#218CFF',
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#5B40F6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    }
  }
};

export type Theme = typeof lightTheme;
