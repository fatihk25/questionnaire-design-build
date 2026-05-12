/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./resources/js/__tests__/setup.ts'],
    include: ['resources/js/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
