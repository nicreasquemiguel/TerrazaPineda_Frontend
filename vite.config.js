import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    assetsInclude: ['**/*.HEIC'],
  plugins: [vue()],
  define: {
    global: 'globalThis',
  },
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true, // Allow external connections
    allowedHosts: [
      'terrazapineda.com',
      'www.terrazapineda.com'
    ],
    proxy: {
      '/terraza/api': {
        target: 'https://api.terrazapineda.com/',
        changeOrigin: true,
        secure: true,
      },
      '/auth': {
        target: 'https://api.terrazapineda.com/',
        changeOrigin: true,
        secure: true,
      },
      '/api': {
        target: 'https://api.terrazapineda.com/',
        changeOrigin: true,
        secure: true,
      },
    },
  }
}) 