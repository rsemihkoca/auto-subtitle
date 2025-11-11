import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/Header';
import { UploadSection } from '@components/UploadSection';
import { Text } from '@components/ui/Text';
import { uploadVideo, processVideoUrl, ProcessVideoResponse } from '@services/videoService';
import { VideoResultScreen } from './VideoResultScreen';

export const VideoUploadScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessVideoResponse | null>(null);

  const handleFileSelected = async (uri: string) => {
    setLoading(true);
    try {
      // First upload the file, then process it
      const videoUrl = await uploadVideo(uri);
      const processedResult = await processVideoUrl(videoUrl);
      setResult(processedResult);
    } catch (error) {
      console.error('Error processing file:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to process video'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a valid video URL');
      return;
    }

    setLoading(true);
    try {
      const processedResult = await processVideoUrl(url);
      setResult(processedResult);
    } catch (error) {
      console.error('Error processing URL:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to process video'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  if (result) {
    return <VideoResultScreen result={result} onBack={handleBack} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header credits={250} />

        <View style={styles.content}>
          <Text variant="title" style={styles.title}>
            Add Subtitles to Your Videos
          </Text>

          <Text variant="body" style={styles.description}>
            Upload your video and let AI generate professional subtitles instantly
          </Text>

          <View style={styles.uploadSectionContainer}>
            <UploadSection
              onFileSelected={handleFileSelected}
              onUrlSubmit={handleUrlSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  uploadSectionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

