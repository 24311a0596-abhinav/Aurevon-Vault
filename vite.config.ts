import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: externalizing Firebase leaves bare imports in the browser bundle, which
// won't resolve without an import map/CDN. It is opt-in: EXTERNALIZE_FIREBASE=1.
const external = process.env.EXTERNALIZE_FIREBASE
  ? ['firebase/app', 'firebase/auth', 'firebase/firestore']
  : [];

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: { external }, // Rolldown-Vite
    rollupOptions: { external },   // Vite 5 / Rollup
  },
});
