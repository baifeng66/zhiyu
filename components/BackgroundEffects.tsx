import { useEffect, useState } from 'react';

type Mode = 'none' | 'maple' | 'ocean' | 'snow';

function getInitialMode(): Mode {
  if (typeof window === 'undefined') return 'none';
  const enabled = localStorage.getItem('bgEffectEnabled');
  if (enabled !== 'true') return 'none';
  const saved = localStorage.getItem('bgEffectMode') as Mode | null;
  return saved || 'maple';
}

export default function BackgroundEffects() {
  const [mode, setMode] = useState<Mode>('none');

  useEffect(() => {
    setMode(getInitialMode());
    const onChange = () => setMode(getInitialMode());
    window.addEventListener('storage', onChange);
    window.addEventListener('bg-effect-changed', onChange as EventListener);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('bg-effect-changed', onChange as EventListener);
    };
  }, []);

  if (mode === 'none') return null;

  return (
    <div className="bg-effects" aria-hidden>
      {/* 启用时混合随机掉落三种效果 */}
      <div className="bg-snow">
        {Array.from({ length: 10 }).map((_, i) => {
          const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${12 + Math.random() * 8}s`,
            animationDelay: `${Math.random() * 3}s`,
            fontSize: `${9 + Math.random() * 4}px`,
          };
          return <span key={`s-${i}`} className="snowflake" style={style}>❄</span>;
        })}
      </div>
      <div className="bg-leaves">
        {Array.from({ length: 6 }).map((_, i) => {
          const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${13 + Math.random() * 9}s`,
            animationDelay: `${Math.random() * 2.5}s`,
            width: `${9 + Math.random() * 5}px`,
            height: `${6 + Math.random() * 4}px`,
          };
          return <span key={`l-${i}`} className="leafflake" style={style} />;
        })}
      </div>
      <div className="bg-drops">
        {Array.from({ length: 8 }).map((_, i) => {
          const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${11 + Math.random() * 7}s`,
            animationDelay: `${Math.random() * 2.2}s`,
            width: `${5 + Math.random() * 1.5}px`,
            height: `${9 + Math.random() * 3}px`,
          };
          return <span key={`d-${i}`} className="raindrop" style={style} />;
        })}
      </div>
    </div>
  );
}
