import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '#blokkli/types': path.resolve(__dirname, '../../node_modules/@blokkli/editor/dist/types'),
      '@blokkli': path.resolve(__dirname, '../../node_modules/@blokkli/editor'),
    },
  },
});
