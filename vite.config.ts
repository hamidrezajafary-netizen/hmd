import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Sandbox-only dev-server overrides, gated on `BASE44_PREVIEW_MODE === '1'`.
 * Unset (or any other value) keeps stock Vite behaviour: no host allowlist extension,
 * no HMR client override. Nothing in the app itself reads the flag.
 */
const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // The preview proxy forwards the request with the sandbox host, so that host must be allowed.
    allowedHosts:
      previewMode && sandboxHostDomain
        ? ['.' + sandboxHostDomain, 'localhost', '127.0.0.1']
        : undefined,
    // The preview is served over https on port 443; without this the HMR socket points at :5173.
    hmr: previewMode ? { protocol: 'wss', clientPort: 443 } : undefined,
  },
});
