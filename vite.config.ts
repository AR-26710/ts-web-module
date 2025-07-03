import { defineConfig } from 'vite';
import { resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config();

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
      fileName: (format) => `ts-web-module-${process.env.VERSION}.${format}.js`
    }
  } : undefined
}));