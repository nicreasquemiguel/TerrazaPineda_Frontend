import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    assetsInclude: ['**/*.HEIC'],
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true,
    allowedHosts: [
      '4840-2806-2f0-5541-fd43-44cd-b650-bcca-7175.ngrok-free.app',
      'ef1f11e14889.ngrok-free.app',
      '5adfa9f2ac15.ngrok-free.app',
      '5adfa9f2ac15.ngrok-free.app',
      'a344c9c907da.ngrok-free.app'
    ],
    proxy: {
      '/terraza/api': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://0.0.0.0:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  }
}) 