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
      'process.env': env,
      'import.meta.env.VITE_GH_CLIENT_ID': JSON.stringify(env.VITE_GH_CLIENT_ID),
      'import.meta.env.VITE_GH_CLIENT_SECRET': JSON.stringify(env.VITE_GH_CLIENT_SECRET)
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      assetsInclude: ['**/*'],
      copyPublicDir: true,
    }
  }
})