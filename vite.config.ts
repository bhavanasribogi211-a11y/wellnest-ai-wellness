import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/n8n-webhook': {
          target: 'https://bhavana21.app.n8n.cloud',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/n8n-webhook/, '/webhook/b634992d-9383-4493-a980-a84db05a68d4/chat'),
        },
        '/api/n8n-webhook-test': {
          target: 'https://bhavana21.app.n8n.cloud',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/n8n-webhook-test/, '/webhook-test/b634992d-9383-4493-a980-a84db05a68d4/chat'),
        },
      },
    },
  };
});
