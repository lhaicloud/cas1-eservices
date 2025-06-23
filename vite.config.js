import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  base: './', // ✅ Add this line
  plugins: [vue()],
  server: {
    host: true,
    port: 8000,
    allowedHosts: ["crucial-whale-dear.ngrok-free.app","raccoon-one-mustang.ngrok-free.app", "eservices.casureco1.com"],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    define: {
      'process.env': process.env
    }
  },
  build: {
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
        compress: {
            drop_console: true, // Remove console logs
            drop_debugger: true,
        },
    },
    chunkSizeWarningLimit: 500, // Adjust chunk size limit
  },
});
