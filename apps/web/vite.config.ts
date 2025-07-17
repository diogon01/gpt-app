import tailwind from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue(), tailwind()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  preview: {
    host: '0.0.0.0', // 👈 necessário para funcionar no Docker
    port: 4173       // 👈 mesma porta que o Vite usa por padrão no preview
  }
});
