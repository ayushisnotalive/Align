import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { lightTheme } from '../../theme/colors';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption';
  weight?: '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  style,
  variant = 'body',
  weight,
  color,
  align = 'left',
  ...props
}) => {
  return (
    <Text
      style={[
        styles[variant],
        weight && { fontWeight: weight },
        color && { color },
        { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 34,
    fontWeight: '900',
    color: lightTheme.text,
    letterSpacing: -0.8,
  },
  h2: {
    fontSize: 28,
    fontWeight: '800',
    color: lightTheme.text,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 22,
    fontWeight: '700',
    color: lightTheme.text,
    letterSpacing: -0.3,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: lightTheme.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: lightTheme.text,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: lightTheme.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: lightTheme.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
