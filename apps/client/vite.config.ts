import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    silent: true,
    globals: true,
    environment: 'jsdom',
    reporters: ['verbose'],
    setupFiles: ['src/vitest-setup.ts'],
  },
  server: {
    port: 5173,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5173',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       '@dnd-kit': [
    //         '@dnd-kit/core',
    //         '@dnd-kit/modifiers',
    //         '@dnd-kit/sortable',
    //         '@dnd-kit/utilities',
    //       ],
    //       '@radix-ui': [
    //         '@radix-ui/react-accordion',
    //         '@radix-ui/react-alert-dialog',
    //         '@radix-ui/react-checkbox',
    //         '@radix-ui/react-dialog',
    //         '@radix-ui/react-dropdown-menu',
    //         '@radix-ui/react-label',
    //         '@radix-ui/react-popover',
    //         '@radix-ui/react-radio-group',
    //         '@radix-ui/react-select',
    //         '@radix-ui/react-separator',
    //         '@radix-ui/react-slider',
    //         '@radix-ui/react-slot',
    //         '@radix-ui/react-tabs',
    //         '@radix-ui/react-tooltip',
    //         '@radix-ui/themes',
    //       ],
    //       miscellaneous: [
    //         'axios',
    //         'class-variance-authority',
    //         'clsx',
    //         'cmdk',
    //         'lodash',
    //         'next-themes',
    //         'obscenity',
    //         'react-responsive',
    //         'react-router-dom',
    //         'recharts',
    //         'shadcn-dropzone',
    //         'sonner',
    //         'tailwind-merge',
    //         'tailwindcss-animate',
    //         'zod',
    //         'zustand',
    //       ],
    //     },
    //   },
    // },
  },
})
