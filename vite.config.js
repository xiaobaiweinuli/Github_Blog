import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  base: '/Github_Blog/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  define: {
    'process.env': {
      ADMIN_USERNAME: JSON.stringify(process.env.ADMIN_USERNAME),
      ADMIN_SECRET: JSON.stringify(process.env.ADMIN_SECRET)
    }
  }
})
