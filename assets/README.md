# Assets Directory

This directory contains static assets for the app.

## Required Assets

You need to add the following assets to this directory:

1. **icon.png** - App icon (1024x1024px)
   - Used as the main app icon for iOS and Android

2. **splash.png** - Splash screen image
   - Recommended size: 1242x2436px (iPhone X)
   - Background color: #1a1a1a (dark theme)

3. **adaptive-icon.png** - Android adaptive icon foreground (1024x1024px)
   - Used for Android adaptive icons
   - Background color: #1a1a1a

4. **favicon.png** - Web favicon (48x48px or larger)

## Generating Assets

You can use tools like:

- [Expo Asset Generator](https://www.npmjs.com/package/@expo/asset-generator)
- [App Icon Generator](https://www.appicon.co/)
- Or create them manually using design tools

## Temporary Solution

For development, Expo will use default placeholders if these files are missing. However, you should add proper assets before building for production.
