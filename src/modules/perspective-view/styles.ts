export const PERSPECTIVE_VIEW_STYLES = `
  .pv-container1 {
    position: relative;
    height: 40vh;
    margin: 8px 0;
    border: 1px solid #ccc;
  }
  .pv-image1, .pv-image2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
  .pv-image1 {
    z-index: 2;
    clip-path: circle(0 at 0 0);
  }
  .pv-image2 {
    z-index: 1;
  }
  .pv-control-panel {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    background: rgba(255, 255, 255, 0.8);
    padding: 8px 16px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pv-radius-slider {
    width: 150px;
    cursor: pointer;
  }
  .pv-radius-value {
    font-size: 14px;
    color: #333;
    min-width: 40px;
    text-align: center;
  }
`;
