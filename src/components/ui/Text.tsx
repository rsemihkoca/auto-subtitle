import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  bold?: boolean;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body', 
  bold = false,
  style,
  ...props 
}) => {
  const variantStyles = {
    title: styles.title,
    subtitle: styles.subtitle,
    body: styles.body,
    caption: styles.caption,
  };

  return (
    <RNText
      style={[
        variantStyles[variant],
        bold && styles.bold,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  bold: {
    fontWeight: 'bold',
  },
});

