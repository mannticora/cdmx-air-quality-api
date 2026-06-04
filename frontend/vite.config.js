import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/measurements': 'https://cdmx-air-quality-api-production.up.railway.app',
      '/stats': 'https://cdmx-air-quality-api-production.up.railway.app',
    }
  }
})
