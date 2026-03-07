import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: [],
        injectionPoint: undefined,
      },
      injectRegister: 'auto',
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
