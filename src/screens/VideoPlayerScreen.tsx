import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer, VideoPlayer as ExpoVideoPlayer, StatusChangeEventPayload } from 'expo-video';
import { Header } from '@components/Header';
import { Text } from '@components/ui/Text';

interface VideoPlayerScreenProps {
  videoUri: string;
  onBack: () => void;
  onProcess?: () => void;
  loading?: boolean;
}

export const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  videoUri,
  onBack,
  onProcess,
  loading = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const player = useVideoPlayer(videoUri, (player: ExpoVideoPlayer) => {
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header credits={250} />
      
      <View style={styles.videoContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <View style={styles.closeIconContainer}>
                <Text style={styles.closeIconText}>✕</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>

      {onProcess && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.processButton, loading && styles.processButtonDisabled]}
            onPress={onProcess}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.processButtonText}>Process Video</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
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
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  closeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#9333EA',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  actionContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  processButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processButtonDisabled: {
    opacity: 0.6,
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

