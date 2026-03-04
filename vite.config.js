import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Plugin to inject environment variables into HTML
function htmlEnvPlugin() {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      const businessName = process.env.VITE_BUSINESS_NAME || 'Uttam Masala';
      const businessFullName = process.env.VITE_BUSINESS_FULL_NAME || 'Uttam Masala';
      const description = `Browse our complete product catalog and current prices - ${businessFullName}`;
      const title = `${businessFullName} - Price List`;

      // Get the site URL from environment or use a default
      const siteUrl = process.env.VITE_SITE_URL || 'https://uttam-masala-price-list.netlify.app';

      // Determine which logo to use
      const isCPSpices = businessName.toLowerCase().includes('cp spices');
      const logoPath = isCPSpices ? '/cp-spices.png' : '/uttam-masala.png';
      const logoUrl = `${siteUrl}${logoPath}`;

      return html
        .replace(/<meta name="apple-mobile-web-app-title" content="[^"]*"/, `<meta name="apple-mobile-web-app-title" content="${businessFullName}"`)
        .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`)
        .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${siteUrl}"`)
        .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`)
        .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`)
        .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${logoUrl}"`)
        .replace(/<meta property="twitter:url" content="[^"]*"/, `<meta property="twitter:url" content="${siteUrl}"`)
        .replace(/<meta property="twitter:title" content="[^"]*"/, `<meta property="twitter:title" content="${title}"`)
        .replace(/<meta property="twitter:description" content="[^"]*"/, `<meta property="twitter:description" content="${description}"`)
        .replace(/<meta property="twitter:image" content="[^"]*"/, `<meta property="twitter:image" content="${logoUrl}"`)
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    htmlEnvPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,txt,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
            },
          },
          {
            urlPattern: /^https:\/\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'https-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Uttam Masala Billing System',
        short_name: 'Uttam Masala',
        description: 'Efficient billing and item management application for Uttam Masala',
        theme_color: '#1f2937',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/screenshot-1.png',
            sizes: '540x720',
            type: 'image/png',
          },
          {
            src: '/screenshot-2.png',
            sizes: '540x720',
            type: 'image/png',
          },
        ],
        categories: ['business', 'productivity'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
