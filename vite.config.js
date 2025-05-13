import { defineConfig } from 'vite'
import path from 'path'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    root: path.resolve(__dirname, 'frontend'),
    base: '/Github_Blog/',
    publicDir: path.resolve(__dirname, 'frontend'),
    define: {
    'process.env': env
  },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      assetsInclude: ['**/*'],
      copyPublicDir: true,
    }
  }
})