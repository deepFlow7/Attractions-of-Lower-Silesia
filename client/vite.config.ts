import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /*proxy: {
        '/api': {
            target:"https://boxwood-builder-429215-k7.ue.r.appspot.com",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
        }  
    },*/
  },
  build: {
    outDir: 'build',
  }
})
