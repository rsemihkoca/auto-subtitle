import React from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@components/Header";
import { Text } from "@components/ui/Text";
import { Button } from "@components/ui/Button";
import { ProcessVideoResponse } from "@services/videoService";

interface VideoResultScreenProps {
  result: ProcessVideoResponse;
  onBack: () => void;
}

export const VideoResultScreen: React.FC<VideoResultScreenProps> = ({
  result,
  onBack,
}) => {
  const handleDownload = async () => {
    try {
      await Linking.openURL(result.video.url);
    } catch (error) {
      console.error("Error opening video URL:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header credits={250} />

        <View style={styles.content}>
          <Text variant="title" style={styles.title}>
            Video Processed Successfully!
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>File Name:</Text>
              <Text style={styles.infoValue}>{result.video.file_name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>File Size:</Text>
              <Text style={styles.infoValue}>
                {(result.video.file_size / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Subtitle Segments:</Text>
              <Text style={styles.infoValue}>{result.subtitle_count}</Text>
            </View>
          </View>

          {result.transcription && (
            <View style={styles.transcriptionContainer}>
              <Text style={styles.transcriptionTitle} bold>
                Transcription:
              </Text>
              <Text style={styles.transcriptionText}>
                {result.transcription}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Download Video"
              onPress={handleDownload}
              variant="primary"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Process Another Video"
              onPress={onBack}
              variant="secondary"
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 32,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  infoValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  transcriptionContainer: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  transcriptionTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  transcriptionText: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingBottom: 32,
  },
  buttonSpacer: {
    height: 12,
  },
});
