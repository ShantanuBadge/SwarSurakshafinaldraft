import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isActive, isAiVoice, audioDataArray }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      phase += isActive ? 0.06 : 0.015;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw 3 layered organic waves
      const waves = [
        {
          color: isAiVoice ? 'rgba(244, 63, 94, 0.45)' : 'rgba(99, 102, 241, 0.45)',
          freq: 0.025,
          amp: isActive ? 24 : 6,
          speed: 1.0,
          lineWidth: 2
        },
        {
          color: isAiVoice ? 'rgba(251, 113, 133, 0.7)' : 'rgba(56, 189, 248, 0.7)',
          freq: 0.038,
          amp: isActive ? 18 : 4,
          speed: -1.3,
          lineWidth: 2.5
        },
        {
          color: isAiVoice ? 'rgba(225, 29, 72, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          freq: 0.05,
          amp: isActive ? 12 : 2,
          speed: 1.8,
          lineWidth: 3
        }
      ];

      waves.forEach(w => {
        ctx.beginPath();
        ctx.lineWidth = w.lineWidth;
        ctx.strokeStyle = w.color;
        ctx.shadowBlur = isActive ? 12 : 0;
        ctx.shadowColor = w.color;

        for (let x = 0; x < width; x += 3) {
          // Calculate curve
          const rawY = Math.sin(x * w.freq + phase * w.speed) * w.amp;
          // Add micro jitter if active
          const jitterVal = (isActive && !isAiVoice) ? (Math.random() - 0.5) * 4 : 0;
          const y = centerY + rawY + jitterVal;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, isAiVoice]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '110px', background: 'rgba(10, 14, 26, 0.65)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      <canvas
        ref={canvasRef}
        width={720}
        height={110}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {!isActive && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.85rem' }}>
          Audio waveform idle • Speak into mic or play audio to begin detection
        </div>
      )}
    </div>
  );
}
