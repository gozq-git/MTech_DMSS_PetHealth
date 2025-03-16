import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    watch:{
      usePolling: true,
    },
    allowedHosts: ['pethealthplatform-uat.azurewebsites.net']
  },
  plugins: [react()],
})
