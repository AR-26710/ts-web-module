const fs = require('fs');
const path = require('path');
const Terser = require('terser');

// 读取.env文件并提取版本号
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const versionMatch = envContent.match(/VERSION=([^\n]+)/);
if (!versionMatch) {
  throw new Error('在 .env 文件中找不到 VERSION');
}
const version = versionMatch[1];

// 重命名文件
const oldFilePath = path.resolve(__dirname, '../dist/ts-web-module.js');
const newFilePath = path.resolve(__dirname, `../dist/ts-web-module-${version}.js`);
const minFilePath = path.resolve(__dirname, `../dist/ts-web-module-${version}.min.js`);

fs.renameSync(oldFilePath, newFilePath);
console.log(`已重命名为：${newFilePath}`);

// 生成min.js文件
const code = fs.readFileSync(newFilePath, 'utf8');
Terser.minify(code).then(result => {
  fs.writeFileSync(minFilePath, result.code, 'utf8');
  console.log(`已生成minified版本：${minFilePath}`);
}).catch(err => {
  console.error('压缩代码时出错:', err);
});

// 删除旧版本文件
const distDir = path.dirname(newFilePath);
const files = fs.readdirSync(distDir);
const currentFileName = path.basename(newFilePath);

files.forEach(file => {
  if (file.startsWith('ts-web-module-') && file.endsWith('.js') && file !== currentFileName) {
    const oldFile = path.join(distDir, file);
    fs.unlinkSync(oldFile);
    console.log(`已删除的旧版本：${oldFile}`);
  }
});

// 更新index.html中的引用路径
const indexHtmlPath = path.resolve(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
const newScriptSrc = `./ts-web-module-${version}.js`;
const minScriptSrc = `dist/ts-web-module-${version}.min.js`;
indexContent = indexContent.replace(/src=".\/ts-web-module-[\d.]+.js"/, `src="${newScriptSrc}"`);
fs.writeFileSync(indexHtmlPath, indexContent, 'utf8');
console.log(`更新了index.html脚本引用：${newScriptSrc}`);