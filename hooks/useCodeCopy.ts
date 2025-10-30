import { useEffect } from 'react';
import CodeCopy from '../components/CodeCopy';

interface HookOptions {
  containerClass?: string;
  buttonPosition?: 'top-right' | 'top-left';
  showText?: boolean;
}

export default function useCodeCopy(options: HookOptions = {}) {
  const {
    containerClass = 'post-content',
    buttonPosition = 'top-right',
    showText = true
  } = options;

  useEffect(() => {
    // 为所有代码块添加复制按钮
    const addCopyButtons = () => {
      const container = document.querySelector(`.${containerClass}`);
      if (!container) return;

      const codeBlocks = container.querySelectorAll('pre[class*="language-"]');

      codeBlocks.forEach((pre) => {
        // 避免重复添加
        if (pre.querySelector('.code-copy-btn')) return;

        const code = pre.querySelector('code');
        if (!code) return;

        // 获取代码内容
        const codeText = code.textContent || '';

        // 创建复制按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = `code-copy-container ${buttonPosition}`;

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.setAttribute('aria-label', '复制代码');
        copyButton.setAttribute('title', '复制到剪贴板');

        // 添加图标文字
        const icon = document.createElement('span');
        icon.textContent = '📋';
        icon.style.fontSize = '12px';
        copyButton.appendChild(icon);

        // 添加文字（可选）
        if (showText) {
          const text = document.createElement('span');
          text.className = 'copy-text';
          text.textContent = '复制';
          copyButton.appendChild(text);
        }

        // 添加点击事件
        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(codeText);

            // 更新按钮状态
            icon.textContent = '✅';
            if (showText) {
              copyButton.querySelector('.copy-text')!.textContent = '已复制';
            }
            copyButton.classList.add('copied');

            // 2秒后恢复
            setTimeout(() => {
              icon.textContent = '📋';
              if (showText) {
                copyButton.querySelector('.copy-text')!.textContent = '复制';
              }
              copyButton.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        });

        buttonContainer.appendChild(copyButton);
        (pre as HTMLElement).style.position = 'relative';
        pre.appendChild(buttonContainer);
      });
    };

    // 初始添加
    addCopyButtons();

    // 创建MutationObserver来监听DOM变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          addCopyButtons();
        }
      });
    });

    // 观察容器变化
    const container = document.querySelector(`.${containerClass}`);
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [containerClass, buttonPosition, showText]);
}