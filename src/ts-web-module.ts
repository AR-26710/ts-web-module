// 动态加载管理器
class ModuleLoader {
  private static loadedModules = new Set<string>();
  private static loadingModules = new Map<string, Promise<void>>();

  // 动态导入模块映射表
  private static moduleMap: { [key: string]: () => Promise<any> } | null = null;
  
  // 动态导入自定义元素列表
  private static customElements: string[] | null = null;
  
  // 配置加载状态
  private static configLoaded = false;
  private static configLoadPromise: Promise<void> | null = null;
  
  // 初始化模块配置
  private static async init() {
    // 确保只加载一次配置
    if (this.configLoadPromise) {
      return this.configLoadPromise;
    }
    
    this.configLoadPromise = this.loadConfig().then(() => {
      this.configLoaded = true;
    });
    
    return this.configLoadPromise;
  }
  
  // 加载模块配置
  private static async loadConfig() {
    try {
      // 动态导入模块配置
      const config = await import('./ts-web-module-config');
      this.moduleMap = config.moduleMap;
      this.customElements = config.customElements;
    } catch (error) {
      console.error('模块配置加载失败:', error);
      throw error;
    }
  }
  
  // 获取模块映射表
  public static getModuleMap() {
    return this.moduleMap;
  }
  
  // 获取自定义元素列表
  public static getCustomElements() {
    return this.customElements;
  }
  
  // 在类构造时初始化
  static {
    this.init();
  }

  // 根据元素标签名加载对应模块
  static async loadModule(tagName: string): Promise<void> {
    // 如果已经加载过，直接返回
    if (this.loadedModules.has(tagName)) {
      return;
    }

    // 如果正在加载中，返回对应的 Promise
    if (this.loadingModules.has(tagName)) {
      return this.loadingModules.get(tagName);
    }

    // 确保配置已加载
    if (!this.configLoaded) {
      // 等待配置加载完成
      if (this.configLoadPromise) {
        await this.configLoadPromise;
      } else {
        // 如果配置加载还未开始，先初始化
        await this.init();
        if (this.configLoadPromise) {
          await this.configLoadPromise;
        }
      }
      
      // 再次检查配置是否加载成功
      if (!this.moduleMap) {
        console.warn(`模块配置加载失败`);
        return;
      }
    }

    // 查找对应的模块加载函数
    if (!this.moduleMap) {
      console.warn(`模块配置尚未加载完成`);
      return;
    }
    
    const moduleLoader = this.moduleMap[tagName];
    if (!moduleLoader) {
      console.warn(`未找到标签 ${tagName} 对应的模块`);
      return;
    }

    // 开始加载模块
    const loadPromise = moduleLoader()
      .then(() => {
        this.loadedModules.add(tagName);
        this.loadingModules.delete(tagName);
        console.log(`模块 ${tagName} 加载成功`);
      })
      .catch(error => {
        this.loadingModules.delete(tagName);
        console.error(`模块 ${tagName} 加载失败:`, error);
        throw error;
      });

    this.loadingModules.set(tagName, loadPromise);
    return loadPromise;
  }

  // 扫描 DOM 并加载所需模块
  static async scanAndLoad(): Promise<void> {
    // 确保配置已加载
    if (!this.configLoaded) {
      // 等待配置加载完成
      if (this.configLoadPromise) {
        await this.configLoadPromise;
      } else {
        // 如果配置加载还未开始，先初始化
        await this.init();
        if (this.configLoadPromise) {
          await this.configLoadPromise;
        }
      }
      
      // 再次检查配置是否加载成功
      if (!this.customElements) {
        console.warn('模块配置加载失败');
        return;
      }
    }

    const elementsToLoad: string[] = [];

    // 扫描当前 DOM
    if (this.customElements) {
      this.customElements.forEach(tagName => {
        const elements = document.getElementsByTagName(tagName);
        if (elements.length > 0 && !this.loadedModules.has(tagName)) {
          elementsToLoad.push(tagName);
        }
      });
    }

    // 并行加载所有需要的模块
    if (elementsToLoad.length > 0) {
      console.log(`发现 ${elementsToLoad.length} 个需要加载的模块:`, elementsToLoad);
      await Promise.all(elementsToLoad.map(tag => this.loadModule(tag)));
    }
  }
}

// 监听 DOM 变化，动态加载新出现的组件
const observer = new MutationObserver((mutations) => {
  const newElements = new Set<string>();

  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        // 检查配置是否已加载
        const moduleMap = ModuleLoader.getModuleMap();
        const customElements = ModuleLoader.getCustomElements();
        
        if (!moduleMap || !customElements) {
          // 如果配置未加载完成，延迟处理
          setTimeout(() => {
            // 重新获取配置
            const moduleMap = ModuleLoader.getModuleMap();
            const customElements = ModuleLoader.getCustomElements();
            
            if (!moduleMap || !customElements) {
              console.warn('模块配置尚未加载完成');
              return;
            }
            
            // 检查元素本身
            const tagName = element.tagName.toLowerCase();
            if (moduleMap[tagName]) {
              newElements.add(tagName);
            }

            // 检查子元素
            element.querySelectorAll(
              customElements.join(',')
            ).forEach(child => {
              newElements.add(child.tagName.toLowerCase());
            });
            
            // 加载新发现的组件
            if (newElements.size > 0) {
              console.log(`发现 ${newElements.size} 个新组件:`, Array.from(newElements));
              newElements.forEach(tagName => {
                ModuleLoader.loadModule(tagName).catch(console.error);
              });
            }
          }, 100);
          return;
        }
        
        // 检查元素本身
        const tagName = element.tagName.toLowerCase();
        if (moduleMap[tagName]) {
          newElements.add(tagName);
        }

        // 检查子元素
        element.querySelectorAll(
          customElements.join(',')
        ).forEach(child => {
          newElements.add(child.tagName.toLowerCase());
        });
      }
    });
  });

  // 加载新发现的组件
  if (newElements.size > 0) {
    console.log(`发现 ${newElements.size} 个新组件:`, Array.from(newElements));
    newElements.forEach(tagName => {
      ModuleLoader.loadModule(tagName).catch(console.error);
    });
  }
});

// 启动 DOM 监听
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 页面加载完成后扫描一次
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ModuleLoader.scanAndLoad().catch(console.error);
  });
} else {
  // 如果已经加载完成，立即扫描
  ModuleLoader.scanAndLoad().catch(console.error);
}

// 导出全局对象供外部使用
(window as any).TsWebModule = {
  ModuleLoader,
  loadModule: (tagName: string) => ModuleLoader.loadModule(tagName)
};
