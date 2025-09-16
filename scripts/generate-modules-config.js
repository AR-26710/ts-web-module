import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 模块目录
const modulesDir = path.join(projectRoot, 'src', 'modules');

// 读取模块目录下的所有文件
const moduleFiles = fs.readdirSync(modulesDir).filter(file => file.endsWith('.ts') && file !== 'index.ts');

// 提取模块名称（去除文件扩展名）
const moduleNames = moduleFiles.map(file => path.basename(file, '.ts'));

console.log('发现模块:', moduleNames);

// 生成Vite配置中的模块列表
const viteModules = moduleNames.map(name => {
  return name;
});

// 生成Vite配置中实际的文件名映射
const viteModuleFiles = moduleNames.map(name => {
  // 处理特殊情况：tabs-box -> tabs-box
  if (name === 'tabs-box') return { moduleName: 'tabs-box', fileName: name };
  // 处理特殊情况：bilibili-video -> bilibili-video
  if (name === 'bilibili-video') return { moduleName: 'bilibili-video', fileName: name };
  // 处理特殊情况：gallery-box -> gallery-box
  if (name === 'gallery-box') return { moduleName: 'gallery-box', fileName: name };
  // 其他情况直接使用模块名
  return { moduleName: name, fileName: name };
});

// 生成ts-web-module中的moduleMap配置
const moduleMapEntries = moduleNames.map(name => {
  // 处理映射关系
  let tagName = name;
  // tabs-box 映射为 tabs-box
  if (name === 'tabs-box') tagName = 'tabs-box';
  // bilibili-video 映射为 bilibili-video
  else if (name === 'bilibili-video') tagName = 'bilibili-video';
  // gallery-box 映射为 gallery-box
  else if (name === 'gallery-box') tagName = 'gallery-box';
  // 其他情况保持一致
  
  return `    '${tagName}': () => import('./modules/${name}')`;
}).join(',\n');

// 生成ts-web-module中的customElements配置
const customElementsEntries = moduleNames.map(name => {
  // 处理映射关系
  let tagName = name;
  // tabs-box 映射为 tabs-box
  if (name === 'tabs-box') tagName = 'tabs-box';
  // bilibili-video 映射为 bilibili-video
  else if (name === 'bilibili-video') tagName = 'bilibili-video';
  // gallery-box 映射为 gallery-box
  else if (name === 'gallery-box') tagName = 'gallery-box';
  // 其他情况保持一致
  
  return `      '${tagName}'`;
}).join(',\n');

// 生成Vite配置文件内容
const viteConfigContent = `// 此文件由脚本自动生成，请勿手动修改
export const modules = [
${viteModules.map(module => `  '${module}'`).join(',\n')}
];

// 用于Vite构建配置的模块文件映射
export const moduleFileMap: { [key: string]: string } = {
${viteModuleFiles.map(item => `  '${item.moduleName}': '${item.fileName}'`).join(',\n')}
};
`;

// 生成ts-web-module配置内容
const tsWebModuleConfigContent = `// 此文件由脚本自动生成，请勿手动修改
export const moduleMap = {
${moduleMapEntries}
  };

export const customElements = [
${customElementsEntries}
    ];`;

// 写入Vite配置文件
const viteConfigPath = path.join(projectRoot, 'src', 'modules-config.ts');
fs.writeFileSync(viteConfigPath, viteConfigContent);
console.log('已生成模块配置文件:', viteConfigPath);

// 写入ts-web-module配置文件
const tsWebModuleConfigPath = path.join(projectRoot, 'src', 'ts-web-module-config.ts');
fs.writeFileSync(tsWebModuleConfigPath, tsWebModuleConfigContent);
console.log('已生成ts-web-module配置文件:', tsWebModuleConfigPath);

console.log('模块配置生成完成！');