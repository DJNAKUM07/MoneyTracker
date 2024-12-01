import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'  // Ensure this is pointing to 'dist'
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://moneytracker-backend.onrender.com',  // Adjust this based on your backend URL
        changeOrigin: true,
      },
    },
  },
});
