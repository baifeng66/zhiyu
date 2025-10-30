import crypto from 'crypto';

// 简单的UUID v4生成器
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 生成基于内容的确定性短UUID（8位）
export function generateShortUUID(content?: string): string {
  if (content) {
    // 基于内容生成hash，确保相同内容生成相同UUID
    const hash = crypto.createHash('md5').update(content).digest('hex');
    return hash.substring(0, 8);
  }
  // 如果没有内容，使用时间戳作为后备方案（仅在开发时）
  return Date.now().toString(36).substring(0, 8);
}