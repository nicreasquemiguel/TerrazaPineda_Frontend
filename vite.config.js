import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    assetsInclude: ['**/*.HEIC'],
  plugins: [vue()],
  define: {
    global: 'globalThis',
  },
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
        target: 'http://54.144.65.30:8000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://54.144.65.30:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://54.144.65.30:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  }
}) 