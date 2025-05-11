import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  base: '/Github_Blog/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})