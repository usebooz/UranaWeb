import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';

/**
 * Vite configuration for UranaWeb React application.
 * Configured for Telegram Web App deployment with TypeScript path mapping and HTTPS support.
 * 
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/UranaWeb/',
  
  // CSS configuration with modern SCSS API
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  
  plugins: [
    // React plugin with SWC compiler for fast builds
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    
    // TypeScript path mapping support (allows @/ imports)
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    
    // HTTPS certificate generation for local development
    // Required for Telegram Web App testing on localhost
    // https://www.npmjs.com/package/vite-plugin-mkcert
    process.env.HTTPS && mkcert(),
  ],
  
  // Build configuration targeting modern JavaScript
  build: {
    target: 'esnext',
  },
  
  // Public directory for static assets
  publicDir: './public',
  
  // Development server configuration
  server: {
    // Enable network access for testing on mobile devices
    host: true,
  },
});

