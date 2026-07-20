/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins:[tsconfigPaths()],
  test: {
   
    globals: true, 
    environment: 'jsdom',
    // Targets your test files
    include: ['src/**/*.{test,spec}.{ts,tsx}'], 
  },
});
