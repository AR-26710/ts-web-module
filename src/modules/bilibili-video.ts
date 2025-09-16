/**
 * Bilibili 视频嵌入组件
 * 使用示例：<bilibili-video bvid="BV1xx411x7xx" autoplay muted></bilibili-video>
 */
class BilibiliEmbed extends HTMLElement {
  private static readonly STYLES = `
    .bilibili-video-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 56.25%; /* 16:9 宽高比 */
    }
    .bilibili-video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .error-message {
      color: red;
      padding: 10px;
      font-family: Arial, sans-serif;
    }
  `;

  static get observedAttributes() {
    return ['bvid', 'autoplay', 'muted'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // 清理资源（如事件监听器）
    const iframe = this.shadowRoot?.querySelector('iframe');
    if (iframe) {
      iframe.src = ''; // 停止视频加载
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    const bvid = this.getAttribute('bvid');
    if (!bvid) {
      this.shadowRoot.innerHTML = `
        <style>${BilibiliEmbed.STYLES}</style>
        <div class="error-message">错误：缺少 bvid 属性</div>
      `;
      return;
    }

    // 默认不自动播放，默认不静音
    const autoplay = this.hasAttribute('autoplay') ? '1' : '0';
    const muted = this.hasAttribute('muted') ? '1' : '0';

    const params = new URLSearchParams({ bvid, autoplay });
    if (muted === '1') params.append('muted', '1');

    const iframeSrc = `https://player.bilibili.com/player.html?${params.toString()}`;

    this.shadowRoot.innerHTML = `
      <style>${BilibiliEmbed.STYLES}</style>
      <div class="bilibili-video-wrapper">
        <iframe src="${iframeSrc}" frameborder="0" allow="autoplay; fullscreen; encrypted-media"></iframe>
      </div>
    `;
  }
}

customElements.define('bilibili-video', BilibiliEmbed);

// 导出模块标识
export const BILIBILI_EMBED_MODULE = 'bilibili-video';