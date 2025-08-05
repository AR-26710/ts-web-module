import { defineConfig } from 'vite';
import { resolve } from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import terser from '@rollup/plugin-terser';

dotenv.config();

const modules = [
  'bilibili-embed',
  'resource-link',
  'text-box',
  'cloud-drive',
  'progress-box',
  'tabs',
  'perspective-view',
  'gallery',
  'gallery-no-shadow'
];

export default defineConfig(({ command, mode }) => ({
  base: './',
  build: command === 'build' ? {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // 主入口文件
        main: resolve(__dirname, 'index.html'),
        // 主模块打包
        'ts-web-module': resolve(__dirname, 'src/ts-web-module.ts'),
        // 单独模块打包
        ...modules.reduce((entries, module) => {
          entries[`modules/${module}`] = resolve(__dirname, `src/modules/${module}.ts`);
          return entries;
        }, {}),
        // 示例页面
        ...fs.readdirSync(resolve(__dirname, 'examples'))
            .filter(file => file.endsWith('.html'))
            .reduce((entries, file) => {
              entries[`examples/${file.replace('.html', '')}`] = resolve(__dirname, 'examples', file);
              return entries;
            }, {})
      },
      output: {
        format: 'es',
        entryFileNames: mode === 'production' 
          ? `[name]-${process.env.VERSION}.[format].min.js` 
          : `[name]-${process.env.VERSION}.[format].js`,
        chunkFileNames: mode === 'production' 
          ? `[name]-${process.env.VERSION}.[format].min.js` 
          : `[name]-${process.env.VERSION}.[format].js`,
        inlineDynamicImports: false,
        plugins: mode === 'production' ? [terser()] : []
      }
    },
    lib: {
      entry: 'src/ts-web-module.ts',
      name: 'TsWebModule',
      formats: ['es'],
      fileName: (format) => mode === 'production' 
        ? `ts-web-module-${process.env.VERSION}.${format}.min.js` 
        : `ts-web-module-${process.env.VERSION}.${format}.js`
    },
    // 清除dist目录
    emptyOutDir: true,
    // 根据模式决定是否压缩
    minify: mode === 'production' ? 'terser' : false
  } : undefined
}));