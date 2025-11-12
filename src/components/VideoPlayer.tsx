import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { VideoView, useVideoPlayer, VideoPlayer as ExpoVideoPlayer, StatusChangeEventPayload } from 'expo-video';
import { Text } from './ui/Text';

interface VideoPlayerProps {
  uri: string;
  onRemove?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri, onRemove }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const player = useVideoPlayer(uri, (player: ExpoVideoPlayer) => {
    player.loop = false;
  });

  useEffect(() => {
    const subscription = player.addListener('statusChange', ({ status, error: playerError }: StatusChangeEventPayload) => {
      if (status === 'readyToPlay') {
        setIsLoading(false);
      } else if (status === 'error' || playerError) {
        setError('Video playback error');
        setIsLoading(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        {onRemove && (
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#9333EA" />
        </View>
      )}
      {onRemove && !isLoading && (
        <TouchableOpacity
          style={styles.removeButtonOverlay}
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <View style={styles.removeIconContainer}>
            <Text style={styles.removeIconText}>✕</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000000',
    position: 'relative',
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 12,
    textAlign: 'center',
  },
  removeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#9333EA',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  removeButtonOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  removeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

