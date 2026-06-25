// AI Coding
/**
 * @file vite.config.ts
 * @description Cấu hình Vite 6 + React + Tailwind v4; path alias 5 lớp (domain/ui/app/core/data); Vitest (jsdom).
 */
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const resolvePath = (relativePath: string): string =>
  fileURLToPath(new URL(relativePath, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      domain: resolvePath('./src/domain'),
      ui: resolvePath('./src/ui'),
      app: resolvePath('./src/app'),
      core: resolvePath('./src/core'),
      data: resolvePath('./src/data'),
    },
  },
  worker: { format: 'es' },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
  },
})
