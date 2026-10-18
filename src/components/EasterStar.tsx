'use client';

export default function EasterStar() {
  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        top: '15%',
        left: '-1px',
        width: '0.5px',
        height: '0.5px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.6)',
        animation: 'starDrift 60s linear infinite',
        opacity: 0.04,
      }}
    />
  );
}
