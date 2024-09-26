import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-router-dom'], // Låt React Router vara extern
      output: {
        globals: {
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    }
  }
});
