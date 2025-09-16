/**
 * 单个网盘链接组件
 * 使用示例：<cloud-drive type="百度网盘" url="#" password="bn6f"></cloud-drive>
 */
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

  private getDriveIcon(type: string): string {
    // 根据网盘类型返回不同的SVG图标
    const icons: Record<string, string> = {
      '默认图标': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
    };
    return icons[type] || icons['默认图标'];
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }
      .cd-drive-container {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        transition: all 0.2s ease;
        margin: 6px 0;
      }
      .cd-drive-container:hover {
        background-color: #f5f5f5;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .cd-drive-icon {
        flex: 0 0 24px;
        margin-right: 12px;
        color: #3498db;
      }
      .cd-drive-info {
        flex: 1;
      }
      .cd-drive-title {
        font-weight: 500;
        margin-bottom: 4px;
        color: #2c3e50;
        max-width: 90px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cd-drive-meta {
        font-size: 0.85rem;
        color: #7f8c8d;
      }
      .cd-drive-password {
        margin-left: 8px;
        padding: 2px 6px;
        background-color: #ecf0f1;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
      }
      .cd-download-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        margin-left: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
        white-space: nowrap;
        text-decoration: none;
      }
      .cd-download-btn:hover {
        background-color: #c0392b;
      }
    `;

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