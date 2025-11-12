import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@components/Header";
import { UploadSection } from "@components/UploadSection";
import { Text } from "@components/ui/Text";
import { AnimatedScreen } from "@components/AnimatedScreen";
import {
  uploadVideo,
  processVideoUrl,
  ProcessVideoResponse,
} from "@services/videoService";
import { VideoResultScreen } from "./VideoResultScreen";
import { VideoPlayerScreen } from "./VideoPlayerScreen";

export const VideoUploadScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessVideoResponse | null>(null);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [selectedVideoType, setSelectedVideoType] = useState<"file" | "url">(
    "file"
  );

  const handleFileSelected = (uri: string) => {
    // Set selected video URI and show player screen
    setSelectedVideoUri(uri);
    setSelectedVideoType("file");
  };

  const handleUrlSubmit = (url: string) => {
    if (!url.trim()) {
      Alert.alert("Error", "Please enter a valid video URL");
      return;
    }

    // Set selected video URI and show player screen
    setSelectedVideoUri(url);
    setSelectedVideoType("url");
  };

  const handleBackFromPlayer = () => {
    setSelectedVideoUri(null);
  };

  const handleProcessVideo = async () => {
    if (!selectedVideoUri) return;

    setLoading(true);
    try {
      let videoUrl: string;

      if (selectedVideoType === "file") {
        // Upload the file first, then process it
        videoUrl = await uploadVideo(selectedVideoUri);
      } else {
        // Use the URL directly
        videoUrl = selectedVideoUri;
      }

      const processedResult = await processVideoUrl(videoUrl);
      setResult(processedResult);
      setSelectedVideoUri(null); // Clear selected video when processing starts
    } catch (error) {
      console.error("Error processing video:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to process video"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  if (result) {
    return (
      <AnimatedScreen type="fade" direction="forward">
        <VideoResultScreen result={result} onBack={handleBack} />
      </AnimatedScreen>
    );
  }

  if (selectedVideoUri) {
    return (
      <AnimatedScreen type="slide" direction="forward">
        <VideoPlayerScreen
          videoUri={selectedVideoUri}
          onBack={handleBackFromPlayer}
          onProcess={handleProcessVideo}
          loading={loading}
        />
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen type="fade" direction="backward">
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Header credits={250} />

          <View style={styles.content}>
            <Text variant="title" style={styles.title}>
              Add Your Video
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
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
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
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  uploadSectionContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
