import { useState, useEffect } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface CodeCopyProps {
  code: string;
  className?: string;
}

export default function CodeCopy({ code, className = '' }: CodeCopyProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 确保组件已挂载（避免hydration错误）
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    if (!mounted) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      // 2秒后重置状态
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);

      // 降级方案：使用传统方法复制
      try {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const result = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (result) {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        }
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      className={`code-copy-btn ${className}`}
      onClick={handleCopy}
      aria-label={copied ? "已复制" : "复制代码"}
      title={copied ? "已复制到剪贴板" : "复制到剪贴板"}
    >
      {copied ? (
        <FaCheck className="copy-icon copied" />
      ) : (
        <FaCopy className="copy-icon" />
      )}
      <span className="copy-text">
        {copied ? '已复制' : '复制'}
      </span>
    </button>
  );
}