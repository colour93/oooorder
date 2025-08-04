import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv';
import { tanstackRouter } from '@tanstack/router-plugin/vite'


dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
    routesDirectory: path.resolve(__dirname, './src/pages')
  }), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 25935,
    host: '::',
    proxy: {
      '/api': {
        target: process.env.SERVER_ENDPOINT || 'http://localhost:25936',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
