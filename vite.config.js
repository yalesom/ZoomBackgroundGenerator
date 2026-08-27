import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The app is served from a sub-path in production (see Dockerfile.prod).
// Override with VITE_BASE=/ to serve it from the domain root instead.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/zoombackgroundgenerator/',
  plugins: [react()],
  server: { host: true, port: 3000 },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.test.{js,jsx}'],
  },
});
