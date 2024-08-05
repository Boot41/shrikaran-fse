import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['tracking']
  },
  build: {
    outDir: "dist",
    assetsDir: "static",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "static/main.js",
        chunkFileNames: "static/[name].js",
        assetFileNames: "static/[name].[ext]",
      },
    },
  },
})
