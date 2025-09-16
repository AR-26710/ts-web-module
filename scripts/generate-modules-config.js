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

// 配置文件路径
const specialCasePath = path.join(path.dirname(__filename), 'special-case.json');
const viteConfigPath = path.join(projectRoot, 'src', 'modules-config.ts');
const tsWebModuleConfigPath = path.join(projectRoot, 'src', 'ts-web-module-config.ts');

/**
 * 加载特殊情况配置文件
 * @returns {Object} 配置对象
 */
function loadSpecialCaseConfig() {
  const defaultConfig = { moduleFileMap: {}, tagNameMap: {} };
  
  try {
    if (!fs.existsSync(specialCasePath)) {
      console.warn('特殊情况配置文件不存在，使用默认配置');
      return defaultConfig;
    }
    
    const specialCaseContent = fs.readFileSync(specialCasePath, 'utf-8');
    const config = JSON.parse(specialCaseContent);
    
    // 验证配置结构
    if (!config.moduleFileMap || !config.tagNameMap) {
      console.warn('特殊情况配置文件格式不正确，使用默认配置');
      return defaultConfig;
    }
    
    console.log('已加载特殊情况配置');
    return config;
  } catch (error) {
    console.warn('无法加载特殊情况配置文件，使用默认配置:', error.message);
    return defaultConfig;
  }
}

/**
 * 获取模块文件列表
 * @returns {string[]} 模块文件名数组
 */
function getModuleFiles() {
  try {
    const files = fs.readdirSync(modulesDir);
    return files.filter(file => 
      file.endsWith('.ts') && 
      file !== 'index.ts' &&
      !file.includes('.test.') && // 排除测试文件
      !file.includes('.spec.')    // 排除测试文件
    );
  } catch (error) {
    console.error('无法读取模块目录:', error.message);
    process.exit(1);
  }
}

/**
 * 生成Vite配置内容
 * @param {string[]} moduleNames 模块名数组
 * @param {Object} specialCaseConfig 特殊配置
 * @returns {string} 生成的配置内容
 */
function generateViteConfig(moduleNames, specialCaseConfig) {
  const viteModules = moduleNames.map(name => `  '${name}'`);
  
  const viteModuleFiles = moduleNames.map(name => {
    const fileName = specialCaseConfig.moduleFileMap[name] || name;
    return `  '${name}': '${fileName}'`;
  });
  
  return `// 此文件由脚本自动生成，请勿手动修改
export const modules = [
${viteModules.join(',\n')}
];

// 用于Vite构建配置的模块文件映射
export const moduleFileMap: { [key: string]: string } = {
${viteModuleFiles.join(',\n')}
};
`;
}

/**
 * 生成ts-web-module配置内容
 * @param {string[]} moduleNames 模块名数组
 * @param {Object} specialCaseConfig 特殊配置
 * @returns {string} 生成的配置内容
 */
function generateTsWebModuleConfig(moduleNames, specialCaseConfig) {
  const moduleMapEntries = moduleNames.map(name => {
    const tagName = specialCaseConfig.tagNameMap[name] || name;
    return `    '${tagName}': () => import('./modules/${name}')`;
  });
  
  const customElementsEntries = moduleNames.map(name => {
    const tagName = specialCaseConfig.tagNameMap[name] || name;
    return `      '${tagName}'`;
  });
  
  return `// 此文件由脚本自动生成，请勿手动修改
export const moduleMap = {
${moduleMapEntries.join(',\n')}
};

export const customElements = [
${customElementsEntries.join(',\n')}
];`;
}

/**
 * 写入配置文件
 * @param {string} filePath 文件路径
 * @param {string} content 文件内容
 */
function writeConfigFile(filePath, content) {
  try {
    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    console.log('已生成配置文件:', filePath);
  } catch (error) {
    console.error('无法写入配置文件:', filePath, error.message);
    process.exit(1);
  }
}

/**
 * 主函数
 */
function main() {
  console.log('开始生成模块配置...');
  
  // 加载特殊情况配置
  const specialCaseConfig = loadSpecialCaseConfig();
  
  // 获取模块文件
  const moduleFiles = getModuleFiles();
  
  // 提取模块名称（去除文件扩展名）
  const moduleNames = moduleFiles.map(file => path.basename(file, '.ts'));
  
  console.log('发现模块:', moduleNames);
  
  if (moduleNames.length === 0) {
    console.warn('未找到任何模块文件');
  }
  
  // 生成配置内容
  const viteConfigContent = generateViteConfig(moduleNames, specialCaseConfig);
  const tsWebModuleConfigContent = generateTsWebModuleConfig(moduleNames, specialCaseConfig);
  
  // 写入配置文件
  writeConfigFile(viteConfigPath, viteConfigContent);
  writeConfigFile(tsWebModuleConfigPath, tsWebModuleConfigContent);
  
  console.log('模块配置生成完成！');
}

// 执行主函数
main();