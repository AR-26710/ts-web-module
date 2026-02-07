import {defineConfig} from 'vite';
import {resolve} from 'path';
import dotenv from 'dotenv';
import copy from 'rollup-plugin-copy';
import * as fs from 'fs';

dotenv.config();

// 动态导入模块配置
import {modules, moduleFileMap} from './src/modules-config';

function copyDistToDocs() {
    return {
        name: 'copy-dist-to-docs',
        writeBundle() {
            const distDir = resolve(__dirname, 'dist');
            const targetDir = resolve(__dirname, 'docs/.vitepress/dist/src');

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, {recursive: true});
            }

            function copyDirectory(src: string, dest: string) {
                const files = fs.readdirSync(src);
                files.forEach(file => {
                    const srcPath = resolve(src, file);
                    const destPath = resolve(dest, file);
                    if (fs.statSync(srcPath).isDirectory()) {
                        if (!fs.existsSync(destPath)) {
                            fs.mkdirSync(destPath, {recursive: true});
                        }
                        copyDirectory(srcPath, destPath);
                    } else {
                        fs.copyFileSync(srcPath, destPath);
                    }
                });
            }

            copyDirectory(distDir, targetDir);
        }
    };
}

export default defineConfig(({mode}) => {
    const isProduction = mode === 'production';
    const version = process.env.VERSION;
    const copyToDocs = process.env.COPY_TO_DOCS === 'true';

    return {
        base: './',
        build: {
            outDir: 'dist',
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'src/ts-web-module.ts'),
                    ...modules.reduce((entries: { [key: string]: string }, module) => {
                        const fileName = moduleFileMap[module] || module;
                        entries[`modules/${module}`] = resolve(__dirname, `src/modules/${fileName}/index.ts`);
                        return entries;
                    }, {})
                },
                output: {
                    format: 'es',
                    entryFileNames: (chunkInfo) => {
                        return isProduction
                            ? `${chunkInfo.name}-${version}.[format].min.js`
                            : `${chunkInfo.name}-${version}.[format].js`;
                    },
                    chunkFileNames: isProduction
                        ? `[name]-${version}.[format].min.js`
                        : `[name]-${version}.[format].js`,
                    inlineDynamicImports: false
                },
                plugins: [
                    copy({
                        targets: [
                            {src: 'examples/**/*', dest: 'dist/examples'}
                        ],
                        hook: 'closeBundle'
                    }),
                    ...(copyToDocs ? [copyDistToDocs()] : [])
                ]
            },
            emptyOutDir: true,
            minify: isProduction ? 'terser' : false
        }
    };
});