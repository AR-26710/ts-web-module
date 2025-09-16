import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 读取特殊情况配置文件
const specialCasePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'special-case.json');
let specialCaseConfig = { moduleFileMap: {}, tagNameMap: {} };

try {
  const specialCaseContent = fs.readFileSync(specialCasePath, 'utf-8');
  specialCaseConfig = JSON.parse(specialCaseContent);
  console.log('已加载特殊情况配置:', specialCaseConfig);
} catch (error) {
  console.warn('无法加载特殊情况配置文件，使用默认配置:', error.message);
}

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
  // 从配置文件中获取特殊情况映射，如果没有则使用默认值
  const fileName = specialCaseConfig.moduleFileMap[name] || name;
  return { moduleName: name, fileName: fileName };
});

// 生成ts-web-module中的moduleMap配置
const moduleMapEntries = moduleNames.map(name => {
  // 从配置文件中获取标签名映射，如果没有则使用模块名
  const tagName = specialCaseConfig.tagNameMap[name] || name;
  return `    '${tagName}': () => import('./modules/${name}')`;
}).join(',\n');

// 生成ts-web-module中的customElements配置
const customElementsEntries = moduleNames.map(name => {
  // 从配置文件中获取标签名映射，如果没有则使用模块名
  const tagName = specialCaseConfig.tagNameMap[name] || name;
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