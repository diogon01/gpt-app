import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path';
import tailwind from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwind()],                   // 👈 aqui
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    proxy: {
      // Redirects API calls to backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});