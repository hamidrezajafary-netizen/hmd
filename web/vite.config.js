import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sandbox preview: the proxy reaches the dev server through a hostname that
// changes whenever the environment is recreated, so allow the sandbox domain
// wildcard and the public origin. Only applied in preview mode ("1").
const isPreview = process.env.BASE44_PREVIEW_MODE === '1';
const allowedHosts = [];

if (isPreview) {
  const extra = process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS;
  if (extra) allowedHosts.push(...extra.split(',').filter(Boolean));
  if (process.env.BASE44_SANDBOX_HOST_DOMAIN) {
    allowedHosts.push(`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`);
  }
  if (process.env.BASE44_PUBLIC_HOST_SUFFIX) {
    allowedHosts.push(`3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}`);
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    // Bind mounts on Linux do not always emit inotify events.
    watch: { usePolling: true, interval: 300 },
    ...(allowedHosts.length > 0 ? { allowedHosts } : {}),
    proxy: {
      '/api': {
        target: 'http://api:4000',
        changeOrigin: true,
      },
    },
  },
});
