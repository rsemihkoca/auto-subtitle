import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import * as DocumentPicker from 'expo-document-picker';

interface UploadSectionProps {
  onFileSelected: (uri: string) => void;
  onUrlSubmit: (url: string) => void;
  loading?: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onFileSelected,
  onUrlSubmit,
  loading = false,
}) => {
  const [videoUrl, setVideoUrl] = useState('');

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
    }
  };

  const handleUrlSubmit = () => {
    if (videoUrl.trim()) {
      onUrlSubmit(videoUrl.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadArea}>
        <LinearGradient
          colors={['#9333EA', '#14B8A6']}
          style={styles.uploadIconContainer}
        >
          <View style={styles.uploadIconInner}>
            <Text style={styles.uploadIconText}>↑</Text>
          </View>
        </LinearGradient>

        <Text style={styles.uploadTitle} bold>
          Upload Your Video
        </Text>

        <Text style={styles.uploadDescription}>
          Drag & drop or click to browse
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Choose File"
            onPress={handleChooseFile}
            loading={loading}
            disabled={loading}
          />
        </View>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OR</Text>
          <View style={styles.separatorLine} />
        </View>

        <TextInput
          style={styles.urlInput}
          placeholder="Paste video URL here"
          placeholderTextColor="#888888"
          value={videoUrl}
          onChangeText={setVideoUrl}
          onSubmitEditing={handleUrlSubmit}
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadIconInner: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 200,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
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
  },
});

