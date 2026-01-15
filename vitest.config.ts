import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './packages/shared/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './apps/web/src/test/setup.ts',
  },
});

