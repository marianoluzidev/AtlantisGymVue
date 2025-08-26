import path from 'path';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www');

export default async () => {
  return {
    plugins: [
      vue({
        template: { compilerOptions: { isCustomElement: (tag) => tag.includes('swiper-') } }
      }),
      VitePWA({
        registerType: 'autoUpdate',
        // NO precachear HTML
        workbox: {
          globPatterns: ['**/*.{js,css,png,jpg,jpeg,svg,webp,ico,woff,woff2,ttf,eot}'],
          // Navegaciones SPA -> no cachear index.html
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkOnly'
            }
          ],
          skipWaiting: true,
          clientsClaim: true
        },
        // usa los íconos/manifest de /public (ya los tenés)
      }),
    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: { treeshake: false },
    },
    resolve: { alias: { '@': SRC_DIR } },
    server: { host: true },
  };
}
