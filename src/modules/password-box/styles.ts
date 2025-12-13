export const PASSWORD_BOX_STYLES = `
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
