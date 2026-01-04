import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set to '/repo-name/' (e.g., '/character-card-creator/')
  // For custom domain or root: set to '/'
  base: '/character-card-creator/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
