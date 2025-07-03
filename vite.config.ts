import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  base: './',
  build: command === 'build' ? {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    lib: {
      entry: 'src/ts-web-module.ts',
      name: 'TsWebModule',
      formats: ['es', 'umd'],
      fileName: (format) => `ts-web-module-1.0.1.${format}.js`
    }
  } : undefined
}));