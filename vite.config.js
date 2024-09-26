import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-router-dom', 'bootstrap/dist/css/bootstrap.min.css'],
      output: {
        globals: {
          'react-router-dom': 'ReactRouterDOM',
          'bootstrap/dist/css/bootstrap.min.css': 'BootstrapCSS'
        }
      }
    }
  }
})
