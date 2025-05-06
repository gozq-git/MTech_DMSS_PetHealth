import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true,
        strictPort: true,
        port: 5173,
        watch: {
            usePolling: true,
        },
        allowedHosts: ['pethealthplatform-uat.azurewebsites.net'],
        headers: {
            "Strict-Transport-Security": "max-age=86400; includeSubDomains",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",}   
    },
    define: {
        'import.meta.env': process.env
    },
    plugins: [react()],
})
