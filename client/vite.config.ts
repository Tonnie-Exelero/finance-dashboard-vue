import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/abstracts/_variables.scss";
          @import "@/styles/abstracts/_mixins.scss";
          @import "@/styles/abstracts/_functions.scss";
        `
      }
    }
  },
  server: {
    port: 3000
  }
});