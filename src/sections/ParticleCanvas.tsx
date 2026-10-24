import { useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  phase: number;
  pulseSpeed: number;
  color: string;
  frequency: number;
}

type ChapterId = 'blank-book' | 'borrowed-names' | 'clocktower' | 'last-book';

function createParticles(chapterId: string, width: number, height: number): Particle[] {
  const countByChapter: Record<ChapterId, number> = {
    'blank-book': 54,
    'borrowed-names': 44,
    clocktower: 64,
    'last-book': 72,
  };
  const count = countByChapter[chapterId as ChapterId] ?? 48;
  const isSlowDust = chapterId === 'last-book';

  return Array.from({ length: count }, () => {
    const palette = chapterId === 'blank-book'
      ? ['#F4F0E8', '#DDE7F2', '#9AAEC4']
      : chapterId === 'borrowed-names'
        ? ['#8F7CEC', '#B8AFFF', '#F5C86A']
        : chapterId === 'clocktower'
          ? ['#D6A84F', '#F0D48A', '#8D6334']
          : ['#F0EEE7', '#D8D8E5', '#A8B1C4'];

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: chapterId === 'blank-book'
        ? 4 + Math.random() * 7
        : 1.5 + Math.random() * (isSlowDust ? 2.5 : 3.5),
      speedX: chapterId === 'borrowed-names'
        ? (Math.random() - 0.5) * 0.35
        : (Math.random() - 0.5) * (isSlowDust ? 0.15 : 0.45),
      speedY: chapterId === 'blank-book'
        ? 0.25 + Math.random() * 0.5
        : isSlowDust ? 0.08 + Math.random() * 0.2 : 0.15 + Math.random() * 0.6,
      opacity: 0.24 + Math.random() * 0.48,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * (chapterId === 'clocktower' ? 0.045 : 0.025),
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 1.2 + Math.random() * 2.2,
      color: palette[Math.floor(Math.random() * palette.length)],
      frequency: 0.0005 + Math.random() * 0.0015,
    };
  });
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, chapterId: string, time: number) {
  ctx.save();
  ctx.globalAlpha = p.opacity;

  switch (chapterId as ChapterId) {
    case 'blank-book': {
      // Floating page fragments with a faint printed line.
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.55, -p.size, p.size * 1.1, p.size * 1.7);
      ctx.globalAlpha = p.opacity * 0.45;
      ctx.strokeStyle = '#6F8195';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.35, -p.size * 0.25);
      ctx.lineTo(p.size * 0.3, -p.size * 0.25);
      ctx.moveTo(-p.size * 0.35, p.size * 0.05);
      ctx.lineTo(p.size * 0.15, p.size * 0.05);
      ctx.stroke();
      break;
    }
    case 'borrowed-names': {
      // Short glowing name fragments, like dashes left in the air.
      const pulse = Math.sin(time * 0.001 * p.pulseSpeed + p.phase) * 0.5 + 0.5;
      ctx.globalAlpha = p.opacity * (0.45 + pulse * 0.55);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 5;
      ctx.shadowColor = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * 0.35);
      ctx.beginPath();
      ctx.roundRect(-p.size * 1.8, -p.size * 0.35, p.size * 3.6, p.size * 0.7, p.size * 0.35);
      ctx.fill();
      break;
    }
    case 'clocktower': {
      // Gold dust with occasional gear-like rings.
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 3;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.size > 3) {
        ctx.globalAlpha = p.opacity * 0.55;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 'last-book': {
      // Sparse, slow moon dust.
      const pulse = Math.sin(time * 0.0008 + p.phase) * 0.5 + 0.5;
      ctx.globalAlpha = p.opacity * (0.45 + pulse * 0.35);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 2;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

function updateParticle(p: Particle, chapterId: string, width: number, height: number, time: number) {
  const isSlowDust = chapterId === 'last-book';
  p.x += p.speedX + Math.sin(time * p.frequency + p.phase) * (isSlowDust ? 0.08 : 0.35);
  p.y += p.speedY;
  p.rotation += p.rotationSpeed;

  const margin = chapterId === 'blank-book' ? 24 : 12;
  if (p.y > height + margin) {
    p.y = -margin;
    p.x = Math.random() * width;
  }
  if (p.x > width + margin) p.x = -margin;
  if (p.x < -margin) p.x = width + margin;
}

export default function ParticleCanvas() {
  const { currentChapter } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const chapterRef = useRef<string>(currentChapter.id);
  const animRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = createParticles(currentChapter.id, width, height);
    chapterRef.current = currentChapter.id;
  }, [currentChapter.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (chapterRef.current !== currentChapter.id) {
        initParticles(canvas.width, canvas.height);
      }

      for (const particle of particlesRef.current) {
        updateParticle(particle, currentChapter.id, canvas.width, canvas.height, time);
        drawParticle(ctx, particle, currentChapter.id, time);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [currentChapter.id, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2] w-full h-full pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
}
