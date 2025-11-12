# AutoSub - Video Subtitle Generator

An Expo React Native app that automatically generates professional subtitles for videos using AI.

## Features

- 📹 Upload videos from device or paste video URLs
- 🤖 AI-powered automatic subtitle generation
- 🎨 Professional subtitle styling with karaoke-style highlighting
- 💳 Credit-based system
- 🌙 Dark theme UI

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your FAL API configuration:
   - Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   - Add your FAL API key or proxy URL:

   ```
   # Option 1: Direct API key (not recommended for production)
   EXPO_PUBLIC_FAL_KEY=your_fal_api_key_here

   # Option 2: Proxy URL (recommended - keeps API key secure)
   EXPO_PUBLIC_PROXY_URL=https://your-proxy-url.com
   ```

   **Note:** For production, use a proxy server to keep your API key secure. See the `fal-ai-express-proxy` project for an example.

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Project Structure

```
src/
  ├── components/        # Reusable UI components
  │   ├── ui/            # Basic UI components (Button, Text)
  │   ├── Header.tsx     # App header with logo and credits
  │   └── UploadSection.tsx  # Video upload component
  ├── screens/           # Screen components
  │   └── VideoUploadScreen.tsx  # Main upload screen
  └── services/          # API services
      └── videoService.ts  # Video processing service
```

## API Integration

The app uses the fal.ai auto-subtitle API. Make sure you have:

1. A valid FAL API key
2. Sufficient credits in your account
3. Network access to fal.ai endpoints

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## Environment Variables

- `EXPO_PUBLIC_FAL_KEY`: Your FAL API key (required if not using proxy)
- `EXPO_PUBLIC_PROXY_URL`: Your proxy server URL (recommended for production)

**Security Note:** Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

## License

MIT
