// 动态加载管理器
class ModuleLoader {
  private static loadedModules = new Set<string>();
  private static loadingModules = new Map<string, Promise<void>>();

  // 模块映射表 - 更新路径以匹配新的构建输出结构
  private static moduleMap = {
    'bilibili-video': () => import('./modules/bilibili-video'),
    'resource-link': () => import('./modules/resource-link'),
    'text-box': () => import('./modules/text-box'),
    'cloud-drive': () => import('./modules/cloud-drive'),
    'progress-box': () => import('./modules/progress-box'),
    'tabs-box': () => import('./modules/tabs-box'),
    'perspective-view': () => import('./modules/perspective-view'),
    'gallery-box': () => import('./modules/gallery-box'),
    'gallery-no-shadow': () => import('./modules/gallery-no-shadow')
  };

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

    // 查找对应的模块加载函数
    const moduleLoader = this.moduleMap[tagName as keyof typeof this.moduleMap];
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
    const customElements = [
      'bilibili-video',
      'resource-link', 
      'text-box',
      'cloud-drive',
      'progress-box',
      'tabs-box',
      'perspective-view',
      'gallery-box',
      'gallery-no-shadow'
    ];

    const elementsToLoad: string[] = [];

    // 扫描当前 DOM
    customElements.forEach(tagName => {
      const elements = document.getElementsByTagName(tagName);
      if (elements.length > 0 && !this.loadedModules.has(tagName)) {
        elementsToLoad.push(tagName);
      }
    });

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
        
        // 检查元素本身
        const tagName = element.tagName.toLowerCase();
        if (ModuleLoader['moduleMap'][tagName as keyof typeof ModuleLoader['moduleMap']]) {
          newElements.add(tagName);
        }

        // 检查子元素
        element.querySelectorAll(
          Object.keys(ModuleLoader['moduleMap']).join(',')
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
