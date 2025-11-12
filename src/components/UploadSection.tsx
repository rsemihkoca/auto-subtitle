import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface UploadSectionProps {
  onFileSelected: (uri: string) => void;
  onUrlSubmit: (url: string) => void;
  loading?: boolean;
}

type UploadMethod = 'gallery' | 'file' | 'url';

export const UploadSection: React.FC<UploadSectionProps> = ({
  onFileSelected,
  onUrlSubmit,
  loading = false,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [activeMethod, setActiveMethod] = useState<UploadMethod>('gallery');

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your gallery to select videos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 3600, // 1 hour max
      });

      if (!result.canceled && result.assets[0]) {
        onFileSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert('Error', 'Failed to select video from gallery');
    }
  };

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        onFileSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to select video file');
    }
  };

  const handleUrlSubmit = () => {
    if (videoUrl.trim()) {
      onUrlSubmit(videoUrl.trim());
    } else {
      Alert.alert('Error', 'Please enter a valid video URL');
    }
  };

  const renderMethodSelector = () => (
    <View style={styles.methodSelector}>
      <TouchableOpacity
        style={[
          styles.methodButton,
          activeMethod === 'gallery' && styles.methodButtonActive,
        ]}
        onPress={() => setActiveMethod('gallery')}
        disabled={loading}
      >
        <Text
          style={[
            styles.methodButtonText,
            activeMethod === 'gallery' && styles.methodButtonTextActive,
          ]}
        >
          📷 Gallery
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodButton,
          activeMethod === 'file' && styles.methodButtonActive,
        ]}
        onPress={() => setActiveMethod('file')}
        disabled={loading}
      >
        <Text
          style={[
            styles.methodButtonText,
            activeMethod === 'file' && styles.methodButtonTextActive,
          ]}
        >
          📁 File
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodButton,
          activeMethod === 'url' && styles.methodButtonActive,
        ]}
        onPress={() => setActiveMethod('url')}
        disabled={loading}
      >
        <Text
          style={[
            styles.methodButtonText,
            activeMethod === 'url' && styles.methodButtonTextActive,
          ]}
        >
          🔗 URL
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeMethod) {
      case 'gallery':
        return (
          <View style={styles.methodContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.methodIcon}>📷</Text>
            </View>
            <Text style={styles.methodTitle} bold>
              Select from Gallery
            </Text>
            <Text style={styles.methodDescription}>
              Choose a video from your device gallery
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Open Gallery"
                onPress={handleChooseFromGallery}
                loading={loading}
                disabled={loading}
              />
            </View>
          </View>
        );

      case 'file':
        return (
          <View style={styles.methodContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.methodIcon}>📁</Text>
            </View>
            <Text style={styles.methodTitle} bold>
              Upload Video File
            </Text>
            <Text style={styles.methodDescription}>
              Browse and select a video file from your device
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Choose File"
                onPress={handleChooseFile}
                loading={loading}
                disabled={loading}
              />
            </View>
          </View>
        );

      case 'url':
        return (
          <View style={styles.methodContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.methodIcon}>🔗</Text>
            </View>
            <Text style={styles.methodTitle} bold>
              Enter Video URL
            </Text>
            <Text style={styles.methodDescription}>
              Paste a direct link to your video
            </Text>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com/video.mp4"
              placeholderTextColor="#888888"
              value={videoUrl}
              onChangeText={setVideoUrl}
              onSubmitEditing={handleUrlSubmit}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Process URL"
                onPress={handleUrlSubmit}
                loading={loading}
                disabled={loading || !videoUrl.trim()}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadArea}>
        {renderMethodSelector()}
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#1f1f1f',
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 5,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  methodButtonActive: {
    backgroundColor: '#9333EA',
  },
  methodButtonText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '600',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  methodContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  methodIcon: {
    fontSize: 40,
  },
  methodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  methodDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 250,
  },
  urlInput: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 16,
  },
});

