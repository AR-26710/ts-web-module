export const CLOUD_DRIVE_STYLES = `
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
