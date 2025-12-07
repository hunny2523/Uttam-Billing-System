# PWA Deployment Guide

## Required for Production

To deploy the PWA properly, ensure:

### 1. HTTPS Required ⚠️

- PWA **requires HTTPS** to function
- Service workers only work on secure connections
- Ensure your deployment supports HTTPS

### 2. Proper Headers

Set these HTTP headers on your server:

```
Cache-Control: public, max-age=31536000, immutable  (for /assets/*)
Cache-Control: no-cache                             (for index.html, manifest.json)
Content-Type: application/manifest+json             (for manifest.json)
```

### 3. Service Worker Configuration

The service worker (`sw.js`) is auto-generated during build. Configuration:

- **API caching**: Network-first approach (5-minute cache)
- **Asset caching**: Cache-first approach (24-hour cache)
- **Update checking**: Every 60 seconds

### 4. Testing Before Deploy

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Then visit: http://localhost:4173
# Test on phone using: https://your-domain.com
```

### 5. Chrome DevTools Testing

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check:
   - **Manifest** - Should show app details
   - **Service Workers** - Should show registered SW
   - **Cache Storage** - Should show cached files

### 6. Android Installation Verification

After deploying to production:

1. Open app in Chrome on Android
2. Tap menu (⋮) → Should show "Install app"
3. If not showing:
   - Check HTTPS is enabled
   - Check manifest.json is being served
   - Clear browser cache and reload

### 7. Continuous Deployment

For auto-update functionality:

1. Build your app: `npm run build`
2. Deploy `dist/` folder to your server
3. Service worker checks for updates every 60 seconds
4. Users see notification when update available

### 8. Handling Browser Cache

The PWA caches content aggressively. If users report stale content:

1. Update version in code
2. Users can force-refresh (Ctrl+Shift+R)
3. Or clear app data through phone settings

### 9. Analytics & Monitoring

Track PWA health:

```javascript
// In your analytics:
- Check Service Worker registration success
- Monitor install prompts
- Track offline usage
- Monitor update installations
```

### 10. Common Issues & Fixes

**Issue**: App not installable

- Solution: Check HTTPS is enabled
- Solution: Verify manifest.json is accessible

**Issue**: Offline doesn't work

- Solution: Ensure site was loaded once online
- Solution: Check Service Worker is registered

**Issue**: Stale content showing

- Solution: Hard-refresh (Cmd/Ctrl + Shift + R)
- Solution: Clear app cache from settings

## Deployment Checklist

- [ ] HTTPS enabled on production server
- [ ] Proper cache headers configured
- [ ] manifest.json accessible
- [ ] Service worker registers successfully
- [ ] Icons are served correctly
- [ ] Test on Android Chrome
- [ ] Test on iOS Safari
- [ ] Test offline functionality
- [ ] Test install/add to home screen
- [ ] Monitor error logs for SW failures

## Production URLs

After deployment, the app will be installable at:

- **Android**: https://your-domain.com
- **iOS**: https://your-domain.com

Users can then add it to their home screen!
