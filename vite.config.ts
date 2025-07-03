import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  build: command === 'build' ? {
    outDir: 'dist',
    lib: {
      entry: 'src/ts-web-module.ts',
      name: 'TsWebModule',
      formats: ['es', 'umd'],
      fileName: (format) => `ts-web-module-1.0.1.${format}.js`
    }
  } : undefined
}));