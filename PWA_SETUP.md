# PWA Setup - Installation Guide

The Billing App is now a Progressive Web App (PWA) that can be installed on phones and used offline!

## Features

✅ **Install on Phone** - Add to home screen on Android and iOS  
✅ **Offline Support** - Works without internet connection  
✅ **App-like Experience** - Runs in standalone mode (no browser UI)  
✅ **Auto Updates** - Automatically checks for updates  
✅ **Fast Loading** - Cached assets load instantly

## Installation Instructions

### Android Phones

1. Open the app in Chrome or Edge browser
2. Tap the menu (⋮) in the top-right corner
3. Select **"Install app"** or **"Add to Home screen"**
4. Tap **"Install"** to confirm
5. The app will appear on your home screen

### iPhone/iPad

1. Open the app in Safari browser
2. Tap the **Share** button (arrow up icon)
3. Scroll down and tap **"Add to Home Screen"**
4. Enter a name (or use the default)
5. Tap **"Add"** in the top-right corner
6. The app will appear on your home screen

## Offline Usage

- **Cached pages** - Home, billing, and search pages work offline
- **API requests** - Billing data is cached for offline access
- **Automatic sync** - Changes sync when you reconnect
- **Network detection** - App shows status when offline

## Features

### Caching Strategy

- **Static assets** - Cached on first load, used immediately
- **API calls** - Network-first approach (always try fresh data)
- **Fallback** - Shows cached data if network is unavailable

### Service Worker

- Automatically installed and updated
- Runs in the background
- Handles offline functionality
- No manual setup required

## Troubleshooting

### App not installing?

- Clear browser cache and cookies
- Ensure you're using HTTPS (required for PWA)
- Try a different browser (Chrome works best)

### Not working offline?

- Ensure the app has been fully loaded at least once online
- Check that you have storage space available
- Clear old cache: Settings → Apps → Clear Cache

### Update not showing?

- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Close the app completely and reopen
- Updates check every minute automatically

## Development

To regenerate icons:

```bash
npm run generate-icons
```

To test PWA locally:

```bash
npm run build
npm run preview
```

Then visit `http://localhost:4173` (HTTPS required for full PWA features)

## Technical Details

- **Manifest**: `public/manifest.json`
- **Service Worker**: `public/sw.js`
- **Icons**: `public/icon-*.png`
- **Build Plugin**: `vite-plugin-pwa`

For more info on PWA: https://web.dev/progressive-web-apps/
