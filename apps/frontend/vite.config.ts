import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    target: "es2022"
  },
  plugins: [react(),commonjs()],
  resolve: {
    alias: {
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
