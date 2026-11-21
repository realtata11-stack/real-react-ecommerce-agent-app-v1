import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    env: { VITE_API_BASE_URL: 'https://dummyjson.com' },
    setupFiles: ['./src/setupTests.ts'],
  },
})
