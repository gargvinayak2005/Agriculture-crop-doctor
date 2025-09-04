import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Agriculture-crop-doctor/',
  server: {
    port: 4000,
    host: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Make environment variables available to the client
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
    'import.meta.env.VITE_API_HEALTH_URL': JSON.stringify(process.env.VITE_API_HEALTH_URL),
  },
});
