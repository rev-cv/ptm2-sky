import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@comps':  path.resolve(__dirname, './src/components'),
      '@utils':  path.resolve(__dirname, './src/utils'),
      '@asset':  path.resolve(__dirname, './src/assets'),
      '@mytype': path.resolve(__dirname, './src/types'),
      '@frames': path.resolve(__dirname, './src/frames'),
      '@pages':  path.resolve(__dirname, './src/pages')
    },
  },
})
