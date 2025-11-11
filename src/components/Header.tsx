import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from './ui/Text';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  credits?: number;
  avatarUri?: string;
}

export const Header: React.FC<HeaderProps> = ({ credits = 250, avatarUri }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#3B82F6', '#3B82F6']}
          style={styles.logoIcon}
        >
          <Text style={styles.logoText}>cc</Text>
        </LinearGradient>
        <Text style={styles.logoTitle} bold>AutoSub</Text>
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.creditsContainer}>
          <View style={styles.coinStack}>
            <View style={[styles.coin, styles.coin1]} />
            <View style={[styles.coin, styles.coin2]} />
            <View style={[styles.coin, styles.coin3]} />
          </View>
          <Text style={styles.creditsText}>{credits}</Text>
        </View>

        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  coinStack: {
    position: 'relative',
    width: 24,
    height: 16,
  },
  coin: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  coin1: {
    left: 0,
    zIndex: 3,
  },
  coin2: {
    left: 4,
    zIndex: 2,
    opacity: 0.8,
  },
  coin3: {
    left: 8,
    zIndex: 1,
    opacity: 0.6,
  },
  creditsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

