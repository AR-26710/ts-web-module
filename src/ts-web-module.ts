interface ModuleConfig {
  moduleMap: { [key: string]: () => Promise<any> };
  customElements: string[];
}

class ModuleLoader {
  private static loadedModules = new Set<string>();
  private static loadingModules = new Map<string, Promise<void>>();
  private static moduleConfig: ModuleConfig | null = null;
  private static configLoadPromise: Promise<void> | null = null;

  // 初始化配置
  private static async initConfig(): Promise<void> {
    if (this.configLoadPromise) return this.configLoadPromise;

    this.configLoadPromise = this.loadConfig();
    await this.configLoadPromise;
  }

  // 加载模块配置
  private static async loadConfig(): Promise<void> {
    try {
      const config = await import('./ts-web-module-config');
      this.moduleConfig = {
        moduleMap: config.moduleMap,
        customElements: config.customElements,
      };
    } catch (error) {
      console.error('加载模块配置失败:', error);
      throw new Error(`模块配置加载失败: ${error}`);
    }
  }

  // 获取模块映射
  public static getModuleMap(): ModuleConfig['moduleMap'] | null {
    return this.moduleConfig?.moduleMap ?? null;
  }

  // 获取自定义元素列表
  public static getCustomElements(): string[] | null {
    return this.moduleConfig?.customElements ?? null;
  }

  // 按标签名加载模块
  public static async loadModule(tagName: string): Promise<void> {
    if (this.loadedModules.has(tagName)) return;

    if (this.loadingModules.has(tagName)) {
      return this.loadingModules.get(tagName)!;
    }

    await this.initConfig();
    if (!this.moduleConfig?.moduleMap) {
      console.warn('模块配置未加载');
      return;
    }

    const moduleLoader = this.moduleConfig.moduleMap[tagName];
    if (!moduleLoader) {
      console.warn(`未找到模块 ${tagName}`);
      return;
    }

    const loadPromise = moduleLoader()
      .then(() => {
        this.loadedModules.add(tagName);
        this.loadingModules.delete(tagName);
        console.log(`模块 ${tagName} 加载成功`);
      })
      .catch((error) => {
        this.loadingModules.delete(tagName);
        console.error(`加载模块 ${tagName} 失败：`, error);
        throw error;
      });

    this.loadingModules.set(tagName, loadPromise);
    return loadPromise;
  }

  // 扫描 DOM 并加载所需模块
  public static async scanAndLoad(): Promise<void> {
    await this.initConfig();
    if (!this.moduleConfig?.customElements) {
      console.warn('未找到自定义元素配置');
      return;
    }

    const elementsToLoad = Array.from(
      new Set(
        this.moduleConfig.customElements.filter(
          (tag) =>
            document.getElementsByTagName(tag).length > 0 &&
            !this.loadedModules.has(tag)
        )
      )
    );

    if (elementsToLoad.length > 0) {
      console.log(`找到 ${elementsToLoad.length} 个需要加载的模块：`, elementsToLoad);
      await Promise.all(elementsToLoad.map((tag) => this.loadModule(tag)));
    }
  }
}

// 观察 DOM 变化以动态加载模块
const observer = new MutationObserver((mutations) => {
  const newElements = new Set<string>();
  const moduleMap = ModuleLoader.getModuleMap();
  const customElements = ModuleLoader.getCustomElements();

  if (!moduleMap || !customElements) {
    console.warn('模块配置未加载，延迟进行 DOM 扫描');
    setTimeout(() => ModuleLoader.scanAndLoad().catch(console.error), 100);
    return;
  }

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      if (moduleMap[tagName]) {
        newElements.add(tagName);
      }

      element.querySelectorAll(customElements.join(',')).forEach((child) => {
        newElements.add(child.tagName.toLowerCase());
      });
    });
  });

  if (newElements.size > 0) {
    console.log(`发现 ${newElements.size} 个新组件:`, Array.from(newElements));
    newElements.forEach((tagName) => {
      ModuleLoader.loadModule(tagName).catch(console.error);
    });
  }
});

// 启动 DOM 观察
observer.observe(document.body, { childList: true, subtree: true });

// 页面加载后扫描 DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ModuleLoader.scanAndLoad().catch(console.error);
  });
} else {
  ModuleLoader.scanAndLoad().catch(console.error);
}

// 暴露全局
(window as any).TsWebModule = {
  ModuleLoader,
  loadModule: (tagName: string) => ModuleLoader.loadModule(tagName),
};