/**
 * 单个网盘链接组件
 * 使用示例：<cloud-drive type="百度网盘" url="#" password="bn6f"></cloud-drive>
 */
import { CLOUD_DRIVE_STYLES } from './styles';
import type { CloudDriveType } from './types';

class CloudDriveElement extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'url', 'password', 'title'];
  }

  private readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.updateContent();
  }

  attributeChangedCallback() {
    this.updateContent();
  }

  private fallbackCopyText(text: string, element: Element): void {
    const originalText = element.textContent;
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    try {
      // 选择并复制文本
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      
      if (successful) {
        element.textContent = '提取码已复制';
        setTimeout(() => {
          element.textContent = originalText;
        }, 2000);
      } else {
        console.warn('复制失败，请手动复制提取码');
        // 显示提示让用户手动复制
        element.textContent = '请手动复制';
        setTimeout(() => {
          element.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('复制失败:', err);
      element.textContent = '复制失败';
      setTimeout(() => {
        element.textContent = originalText;
      }, 2000);
    } finally {
      // 清理临时元素
      document.body.removeChild(textArea);
    }
  }

  private getDriveIcon(type: CloudDriveType): string {
    // 根据网盘类型返回不同的SVG图标
    const icons: Record<string, string> = {
      '默认图标': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
    };
    return icons[type] || icons['默认图标'];
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = CLOUD_DRIVE_STYLES;

    const container = document.createElement('div');
    container.className = 'cd-drive-container';

    this.shadow.append(style, container);
  }

  private updateContent() {
    const container = this.shadow.querySelector('.cd-drive-container')!;
    const type = this.getAttribute('type') || '默认网盘';
    const url = this.getAttribute('url') || '#';
    const password = this.getAttribute('password') || '';
    const title = this.getAttribute('title') || '默认标题';

    container.innerHTML = `
      <div class="cd-drive-icon">${this.getDriveIcon(type)}</div>
      <div class="cd-drive-info">
        <div class="cd-drive-title" title="${title}">${title}</div>
        <div class="cd-drive-meta">
          来源: ${type}
          ${password ? `<span class="cd-drive-password" data-password="${password}" title="点击复制提取码">提取码: ${password}</span>` : ''}
        </div>
      </div>
      <a href="${url}" class="cd-download-btn" target="_blank">下载</a>
    `;

    const passwordElement = container.querySelector('.cd-drive-password');
    if (passwordElement) {
      passwordElement.addEventListener('click', () => {
        const password = (passwordElement as HTMLElement).dataset.password;
        if (password) {
          // 检查 clipboard API 是否可用
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(password).then(() => {
              const originalText = passwordElement.textContent;
              passwordElement.textContent = '提取码已复制';
              setTimeout(() => {
                passwordElement.textContent = originalText;
              }, 2000);
            }).catch(err => {
              console.error('复制提取码失败:', err);
              this.fallbackCopyText(password, passwordElement);
            });
          } else {
            // 使用降级方案
            this.fallbackCopyText(password, passwordElement);
          }
        }
      });
    }
  }
}

customElements.define('cloud-drive', CloudDriveElement);

// 导出模块标识
export const CLOUD_DRIVE_MODULE = 'cloud-drive';
