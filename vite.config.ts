import { defineConfig } from 'vite';
import { resolve } from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import terser from '@rollup/plugin-terser';

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
            }, {}),
        ...fs.readdirSync(resolve(__dirname, 'src/modules'))
            .filter(file => file.endsWith('.ts'))
            .reduce((entries, file) => {
              entries[`modules/${file.replace('.ts', '')}`] = resolve(__dirname, 'src/modules', file);
              return entries;
            }, {})
      },
      output: [
        {
          format: 'es',
          entryFileNames: `[name]-${process.env.VERSION}.[format].js`,
          inlineDynamicImports: false
        },
        {
          format: 'es',
          entryFileNames: `[name]-${process.env.VERSION}.[format].min.js`,
          plugins: [terser()],
          inlineDynamicImports: false
        }
      ]
    },
    lib: {
      entry: 'src/ts-web-module.ts',
      name: 'TsWebModule',
      formats: ['es'],
      fileName: (format) => `ts-web-module-${process.env.VERSION}.${format}.js`
    }
  } : undefined
}));