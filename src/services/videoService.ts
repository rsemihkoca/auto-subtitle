import { fal } from '@fal-ai/client';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

// Configure fal client with API key
// For production, use expo-secure-store or a backend proxy
const FAL_KEY = process.env.EXPO_PUBLIC_FAL_KEY || '';
const PROXY_URL = process.env.EXPO_PUBLIC_PROXY_URL || '';

if (FAL_KEY && !PROXY_URL) {
  fal.config({
    credentials: FAL_KEY,
  });
}

export interface ProcessVideoResponse {
  video: {
    url: string;
    file_name: string;
    file_size: number;
    content_type: string;
  };
  transcription: string;
  subtitle_count: number;
}

export const uploadVideo = async (uri: string): Promise<string> => {
  try {
    if (!FAL_KEY && !PROXY_URL) {
      throw new Error('FAL API key or proxy URL is not configured. Please set EXPO_PUBLIC_FAL_KEY or EXPO_PUBLIC_PROXY_URL in your environment.');
    }

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const fileName = fileInfo.uri.split('/').pop() || 'video.mp4';

    // If using proxy, upload through proxy
    if (PROXY_URL) {
      // For proxy, we'll need to upload directly to fal.ai storage
      // This is a simplified approach - in production, you might want to add a dedicated upload endpoint
      const dataUri = `data:video/mp4;base64,${base64}`;
      
      // Use fal client with proxy configuration
      const url = await fal.storage.upload(dataUri, {
        fileName,
        contentType: 'video/mp4',
      });
      return url;
    }

    // Direct upload using fal client
    const dataUri = `data:video/mp4;base64,${base64}`;
    const url = await fal.storage.upload(dataUri, {
      fileName,
      contentType: 'video/mp4',
    });

    return url;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video. Please try again.');
  }
};

export const processVideoUrl = async (videoUrl: string): Promise<ProcessVideoResponse> => {
  try {
    if (!FAL_KEY && !PROXY_URL) {
      throw new Error('FAL API key or proxy URL is not configured. Please set EXPO_PUBLIC_FAL_KEY or EXPO_PUBLIC_PROXY_URL in your environment.');
    }

    // If using proxy, make request through proxy
    if (PROXY_URL) {
      const targetUrl = 'https://fal.run/fal-ai/workflow-utilities/auto-subtitle';
      
      const response = await axios.post(
        `${PROXY_URL}/api/fal/proxy`,
        {
          video_url: videoUrl,
        },
        {
          headers: {
            'x-fal-target-url': targetUrl,
            'Content-Type': 'application/json',
          },
        }
      );

      // The proxy returns the request_id, we need to poll for results
      const requestId = response.data.request_id;
      
      // Poll for result
      let result: ProcessVideoResponse | null = null;
      let attempts = 0;
      const maxAttempts = 60;

      while (!result && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        try {
          const statusResponse = await axios.get(
            `${PROXY_URL}/api/fal/proxy`,
            {
              headers: {
                'x-fal-target-url': `${targetUrl}/queue/${requestId}`,
              },
            }
          );

          if (statusResponse.data.status === 'COMPLETED') {
            result = statusResponse.data.result;
            break;
          } else if (statusResponse.data.status === 'FAILED') {
            throw new Error('Video processing failed. Please try again.');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            attempts++;
            continue;
          }
          throw error;
        }

        attempts++;
      }

      if (!result) {
        throw new Error('Video processing timed out. Please try again.');
      }

      return result;
    }

    // Use fal client subscribe method which handles queueing and polling automatically
    const result = await fal.subscribe('fal-ai/workflow-utilities/auto-subtitle', {
      input: {
        video_url: videoUrl,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Processing video...', update.logs?.map((log) => log.message));
        }
      },
    });

    return result.data as ProcessVideoResponse;
  } catch (error) {
    console.error('Error processing video:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('credentials')) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      throw error;
    }
    throw new Error('Failed to process video. Please try again.');
  }
};

