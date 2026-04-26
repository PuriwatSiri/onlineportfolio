import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { 
    port: 5173, 
    open: true,
    proxy: {
      '/api': {
        target: 'https://onlineportfolio-4i6c.onrender.com',
        changeOrigin: true
      }
    }
  },
  preview: { port: 5174 },
})
