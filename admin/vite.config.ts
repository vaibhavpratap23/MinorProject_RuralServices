import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.ADMIN_PORT) || 5174,
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
