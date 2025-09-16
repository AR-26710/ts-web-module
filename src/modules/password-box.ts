/**
 * 密码验证框组件
 * 使用示例：
 * <password-box pw="12345" title="请输入密码查看内容">
 *   <p>这是需要密码才能查看的隐藏内容</p>
 *   <img src="secret-image.jpg" alt="隐藏图片">
 * </password-box>
 */
class PasswordBoxElement extends HTMLElement {
  static get observedAttributes() {
    return ['pw', 'title', 'tip', 'placeholder', 'error'];
  }

  private readonly shadow: ShadowRoot;
  private passwordInput: HTMLInputElement | null = null;
  private submitButton: HTMLButtonElement | null = null;
  private errorMessage: HTMLDivElement | null = null;
  private contentWrapper: HTMLDivElement | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    this.cacheElements();
  }

  connectedCallback() {
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // 如果密码改变且已解锁，重新锁定
    if (name === 'pw' && this.isUnlocked) {
      this.lockContent();
    }
    
    // 更新标题、提示文本、占位符或错误文本
    if ((name === 'title' || name === 'tip' || name === 'placeholder' || name === 'error') && oldValue !== newValue) {
      this.updateTextContent();
    }
  }

  private cacheElements() {
    this.passwordInput = this.shadow.querySelector('.pb-password-input') as HTMLInputElement;
    this.submitButton = this.shadow.querySelector('.pb-submit-btn') as HTMLButtonElement;
    this.errorMessage = this.shadow.querySelector('.pb-error-message') as HTMLDivElement;
    this.contentWrapper = this.shadow.querySelector('.pb-content-wrapper') as HTMLDivElement;
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        margin: 16px 0;
        font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      .pb-container {
        border-radius: 12px;
        padding: 24px;
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .pb-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
      }

      .pb-container.locked {
        background-color: #fff9e6;
        border: 1px solid #ffeaa7;
      }

      .pb-container.unlocked {
        border: 1px solid #a8e6a1;
      }

      .pb-password-section {
        text-align: center;
        margin-bottom: 20px;
      }

      .pb-title {
        font-size: 20px;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .pb-lock-icon {
        font-size: 24px;
      }

      .pb-input-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 300px;
        margin: 0 auto;
      }

      .pb-password-input {
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 16px;
        width: 100%;
        transition: all 0.3s ease;
        box-sizing: border-box;
      }

      .pb-password-input:focus {
        outline: none;
        border-color: #4361ee;
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
      }

      .pb-password-input.error {
        border-color: #e53e3e;
        animation: shake 0.5s ease;
      }

      .pb-submit-btn {
        padding: 12px 20px;
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .pb-submit-btn:hover {
        background: linear-gradient(135deg, #3a56d4, #320a8c);
        box-shadow: 0 4px 10px rgba(67, 97, 238, 0.4);
        transform: translateY(-2px);
      }

      .pb-submit-btn:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(67, 97, 238, 0.3);
      }

      .pb-submit-btn:disabled {
        background: #a0aec0;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .pb-error-message {
        color: #e53e3e;
        font-size: 14px;
        margin: 8px auto 0;
        display: none;
        background-color: #fef2f2;
        padding: 8px 12px;
        border-radius: 6px;
        max-width: 300px;
        box-sizing: border-box;
      }

      .pb-error-message.show {
        display: block;
        animation: fadeIn 0.3s ease;
      }

      .pb-content-wrapper {
        display: none;
        animation: fadeIn 0.5s ease;
      }

      .pb-content-wrapper.show {
        display: block;
      }

      .pb-hint {
        font-size: 14px;
        color: #718096;
        margin: 12px auto 0;
        padding: 8px 12px;
        background-color: #f7fafc;
        border-radius: 6px;
        max-width: 300px;
        box-sizing: border-box;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
      }

      /* 响应式设计 */
      @media (max-width: 480px) {
        .pb-container {
          padding: 20px 16px;
        }
        
        .pb-title {
          font-size: 18px;
        }
        
        .pb-input-group {
          max-width: 100%;
        }
      }
    `;

    const container = document.createElement('div');
    container.className = 'pb-container locked';
    
    // 获取自定义属性或使用默认值
    const title = this.getAttribute('title') || '请输入密码查看内容';
    const hint = this.getAttribute('tip') || '';
    const placeholder = this.getAttribute('placeholder') || '请输入密码';
    const errorText = this.getAttribute('error') || '密码错误，请重试';
    
    container.innerHTML = `
      <div class="pb-password-section">
        <div class="pb-title">
          <span class="pb-lock-icon">🔒</span>
          <span class="pb-title-text">${title}</span>
        </div>
        <div class="pb-input-group">
          <input type="password" class="pb-password-input" placeholder="${placeholder}">
          <button class="pb-submit-btn">
            <span>验证密码</span>
          </button>
        </div>
        <div class="pb-error-message">${errorText}</div>
        ${hint ? `<div class="pb-hint">${hint}</div>` : ''}
      </div>
      <div class="pb-content-wrapper">
        <slot></slot>
      </div>
    `;

    this.shadow.append(style, container);
  }

  private addEventListeners() {
    this.submitButton?.addEventListener('click', this.handleSubmit.bind(this));
    this.passwordInput?.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  private removeEventListeners() {
    this.submitButton?.removeEventListener('click', this.handleSubmit.bind(this));
    this.passwordInput?.removeEventListener('keypress', this.handleKeyPress.bind(this));
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  private handleSubmit() {
    const inputPassword = this.passwordInput?.value || '';
    const correctPassword = this.getAttribute('pw') || '';

    // 添加加载状态
    if (this.submitButton) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = '<span>验证中...</span>';
    }

    // 模拟验证延迟，提升用户体验
    setTimeout(() => {
      if (inputPassword === correctPassword) {
        this.unlockContent();
      } else {
        this.showError();
      }
      
      // 恢复按钮状态
      if (this.submitButton) {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = '<span>验证密码</span>';
      }
    }, 600);
  }

  private updateTextContent() {
    if (!this.isUnlocked) {
      // 更新标题
      const titleElement = this.shadow.querySelector('.pb-title-text') as HTMLElement;
      const title = this.getAttribute('title') || '请输入密码查看内容';
      if (titleElement) {
        titleElement.textContent = title;
      }
      
      // 更新提示文本
      const hintElement = this.shadow.querySelector('.pb-hint') as HTMLElement;
      const hint = this.getAttribute('tip') || '';
      if (hintElement) {
        if (hint) {
          hintElement.textContent = hint;
          hintElement.style.display = 'block';
        } else {
          hintElement.style.display = 'none';
        }
      } else if (hint) {
        // 如果之前没有提示文本但现在有，需要添加
        const passwordSection = this.shadow.querySelector('.pb-password-section');
        const hintDiv = document.createElement('div');
        hintDiv.className = 'pb-hint';
        hintDiv.textContent = hint;
        passwordSection?.appendChild(hintDiv);
      }
      
      // 更新密码输入框占位符
      const placeholder = this.getAttribute('placeholder') || '请输入密码';
      if (this.passwordInput) {
        this.passwordInput.placeholder = placeholder;
      }
      
      // 更新错误提示文本
      const errorText = this.getAttribute('error') || '密码错误，请重试';
      if (this.errorMessage) {
        this.errorMessage.textContent = errorText;
      }
    } else {
      // 更新解锁后的标题
      const titleElement = this.shadow.querySelector('.pb-title-text') as HTMLElement;
      const title = this.getAttribute('title') || '请输入密码查看内容';
      if (titleElement) {
        titleElement.textContent = title;
      }
    }
  }

  private unlockContent() {
    this.isUnlocked = true;
    const container = this.shadow.querySelector('.pb-container') as HTMLElement;
    const contentWrapper = this.contentWrapper as HTMLElement;
    const passwordSection = this.shadow.querySelector('.pb-password-section') as HTMLElement;

    // 更新UI状态
    container.classList.remove('locked');
    container.classList.add('unlocked');
    contentWrapper.classList.add('show');
    
    // 隐藏密码输入区域
    passwordSection.style.display = 'none';
    
    // 隐藏错误信息
    this.hideError();

    // 触发自定义事件
    this.dispatchEvent(new CustomEvent('password-correct', {
      detail: { unlocked: true },
      bubbles: true
    }));
  }

  private lockContent() {
    this.isUnlocked = false;
    const container = this.shadow.querySelector('.pb-container') as HTMLElement;
    const contentWrapper = this.contentWrapper as HTMLElement;
    const passwordSection = this.shadow.querySelector('.pb-password-section') as HTMLElement;

    // 重置UI状态
    container.classList.remove('unlocked');
    container.classList.add('locked');
    contentWrapper.classList.remove('show');
    
    // 显示密码输入区域
    passwordSection.style.display = 'block';
    
    // 清空输入框
    if (this.passwordInput) {
      this.passwordInput.value = '';
    }
    
    // 更新文本内容
    this.updateTextContent();
  }

  private showError() {
    const errorMessage = this.errorMessage as HTMLElement;
    errorMessage.classList.add('show');
    
    // 输入框错误状态
    const passwordInput = this.passwordInput as HTMLInputElement;
    passwordInput.classList.add('error');
    
    setTimeout(() => {
      passwordInput.classList.remove('error');
    }, 500);

    // 3秒后自动隐藏错误信息
    setTimeout(() => {
      this.hideError();
    }, 3000);
  }

  private hideError() {
    const errorMessage = this.errorMessage as HTMLElement;
    errorMessage.classList.remove('show');
  }

  // 公共方法：手动解锁
  public unlock(password: string): boolean {
    const correctPassword = this.getAttribute('pw') || '';
    if (password === correctPassword) {
      this.unlockContent();
      return true;
    }
    return false;
  }

  // 公共方法：重新锁定
  public lock(): void {
    this.lockContent();
  }

  // 公共方法：检查是否已解锁
  public get isContentUnlocked(): boolean {
    return this.isUnlocked;
  }
}

customElements.define('password-box', PasswordBoxElement);

// 导出模块标识
export const PASSWORD_BOX_MODULE = 'password-box';