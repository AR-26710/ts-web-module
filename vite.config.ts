import { defineConfig } from 'vite';
import { resolve } from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig(({ command }) => ({
  base: './',
  build: command === 'build' ? {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...fs.readdirSync(resolve(__dirname, 'examples'))
            .filter(file => file.endsWith('.html'))
            .reduce((entries, file) => {
              entries[`examples/${file.replace('.html', '')}`] = resolve(__dirname, 'examples', file);
              return entries;
            }, {})
      },
      output: {
        inlineDynamicImports: false
      }
    },
    lib: {
      entry: 'src/ts-web-module.ts',
      name: 'TsWebModule',
      formats: ['es'],
      fileName: (format) => `ts-web-module-${process.env.VERSION}.${format}.js`
    }
  } : undefined
}));