import { useState, useEffect } from 'react';

const quotes = [
  "代码如诗，技术如画，在这个数字世界里创造美好。",
  "世界我曾来过，也终究离去。但在离开之前，我想留下些什么。",
  "在二进制的海洋中，我们寻找确定性的灯塔。",
  "每一个bug都是一次成长的机会，每一次debug都是一次修行。",
  "技术的意义不在于复杂，而在于解决问题。",
  "代码是写给机器的，也是写给人心的。",
  "在算法的迷宫中，我们探索最优的路径。",
  "好的代码是自文档化的，就像好的诗歌自会解释自己。",
  "编程不是科学，而是艺术和手艺的结合。",
  "简洁是复杂的最高境界。",
  "在技术的道路上，永远保持初学者的好奇心。",
  "代码是思想的载体，也是灵魂的延伸。",
  "最好的代码是看不到的代码，它默默工作，无影无踪。",
  "技术终将过时，但创造美好的心永不褪色。",
  "在0和1的世界里，我们找到了表达无限的可能。",
  "代码不在于长度，而在于表达的精准和优雅。",
  "技术只是工具，真正重要的是我们用它创造什么。",
  "每一次重构都是一次新生，每一次优化都是一次进化。",
  "编程教会我们思考，也教会我们面对不完美。",
  "在代码的世界里，我们既是创造者也是守护者。"
];

export default function DailyQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // 根据日期选择固定的名言，确保同一天显示相同的内容
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % quotes.length;
    setQuote(quotes[index]);
  }, []);

  if (!quote) return null;

  return <span className="footer-quote-text">{quote}</span>;
}