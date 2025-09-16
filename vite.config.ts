import { defineConfig } from 'vite';
import { resolve } from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

dotenv.config();

// 动态导入模块配置
import { modules, moduleFileMap } from './src/modules-config';

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
        // 组件模块单独打包到 modules 文件夹
        ...modules.reduce((entries, module) => {
          // 使用正确的文件名
          const fileName = moduleFileMap[module] || module;
          entries[`modules/${module}`] = resolve(__dirname, `src/modules/${fileName}.ts`);
          return entries;
        }, {})
      },
      output: {
        format: 'es',
        entryFileNames: (chunkInfo) => {
          // 如果 chunk 名称包含 modules/，则放入 modules 文件夹
          if (chunkInfo.name.includes('modules/')) {
            return mode === 'production'
              ? `[name]-${process.env.VERSION}.[format].min.js`
              : `[name]-${process.env.VERSION}.[format].js`;
          }
          // 其他文件保持原命名规则
          return mode === 'production'
            ? `[name]-${process.env.VERSION}.[format].min.js`
            : `[name]-${process.env.VERSION}.[format].js`;
        },
        chunkFileNames: mode === 'production'
          ? `[name]-${process.env.VERSION}.[format].min.js`
          : `[name]-${process.env.VERSION}.[format].js`,
        inlineDynamicImports: false,
        plugins: mode === 'production' ? [terser()] : []
      },
      plugins: [
        copy({
          targets: [
            { src: 'examples/**/*', dest: 'dist/examples' }
          ],
          hook: 'closeBundle' // 在构建结束后执行复制操作
        })
      ]
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