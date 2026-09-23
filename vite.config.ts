import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const projectDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/',
          name: 'Aviation Safety Summit 2026',
          short_name: 'AviaSafety26',
          description: 'Aviation Safety Summit 2026 — Official Protocol Precedence, Assigned Addresses, Live Programme & Compendium.',
          theme_color: '#0A192F',
          background_color: '#0A192F',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          categories: ['business', 'events', 'travel'],
          shortcuts: [
            {
              name: 'Hierarchy & Speeches',
              short_name: 'Hierarchy',
              description: 'Official Protocol Order of Precedence & Assigned Addresses',
              url: '/#protocol-hierarchy',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Summit Programme',
              short_name: 'Programme',
              description: 'Interactive Summit Timetable & Technical Masterclasses',
              url: '/#programme',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Official Dignitaries',
              short_name: 'Dignitaries',
              description: 'Sovereign Leaders, Regulators & Governors',
              url: '/#dignitaries',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Register Delegate Pass',
              short_name: 'Register',
              description: 'Summit Badge Verification & Instant Registration',
              url: '/#register',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            }
          ],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 6291456,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Curated official dignitary and church portraits from external web archives
              urlPattern: /^https:\/\/(?:upload\.wikimedia\.org|.*\.gov\.ng|.*\.org|.*\.com)\/.*\.(?:png|jpg|jpeg|svg|webp)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'summit-remote-images-cache',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Local API data and JSON state updates
              urlPattern: /\/data\/.*\.json|\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'summit-api-data-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      {
        name: 'silence-vite-hmr-noise',
        apply: 'serve' as const,
        enforce: 'post' as const,
        transform(code: string, id: string) {
          if (id.includes('client.mjs') || id.includes('@vite/client')) {
            return {
              code: code
                .replace(/console\.error\(`\[vite\] failed to connect to websocket[\s\S]*?`\);/g, '/* silenced */')
                .replace(/console\.error\(\s*`\[vite\] failed to connect to websocket[\s\S]*?`\s*\);/g, '/* silenced */')
                .replace(/console\.debug\("\[vite\] connecting\.\.\."\);/g, '/* silenced */')
                .replace(/console\.debug\(`\[vite\] connected\.`\);/g, '/* silenced */')
                .replace(/error:\s*\(err\)\s*=>\s*console\.error\("\[vite\]",\s*err\)/g, 'error: () => {}')
                .replace(/debug:\s*\(\.\.\.msg\)\s*=>\s*console\.debug\("\[vite\]",\s*\.\.\.msg\)/g, 'debug: () => {}')
                .replace(/console\.info\(\s*"\[vite\] Direct websocket connection fallback[\s\S]*?"\s*\);/g, '/* silenced */')
                .replace(/throw e;/g, 'return;'),
              map: null,
            };
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(projectDir, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
