import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; 

console.log('✅ vite.config.js is loaded');

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ //  PWA 설정
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: '가계로그',
        short_name: '가계로그',
        description: '나의 소비를 기록하는 따뜻한 모바일 웹서비스',
        theme_color: '#FFFDF7',
        background_color: '#FFFDF7',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
