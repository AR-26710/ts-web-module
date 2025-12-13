export const BILIBILI_VIDEO_STYLES = `
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
