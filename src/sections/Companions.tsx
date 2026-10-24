import { useRef, useEffect, useState } from 'react';
import { chapters } from '@/content/config';
import { Play, Pause } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BASE_LAYOUTS = [
  { size: 216, rotate: -4, mt: 0,  scrub: 0.4  },
  { size: 250, rotate:  3, mt: 41, scrub: 0.55 },
  { size: 216, rotate: -2, mt: 14, scrub: 0.7  },
  { size: 181, rotate:  5, mt: 55, scrub: 0.85 },
];

// 根据章节数量自动生成布局，超出预设时循环复用并调整参数
function buildLayout(count: number) {
  return Array.from({ length: count }, (_, i) => {
    if (i < BASE_LAYOUTS.length) return BASE_LAYOUTS[i];
    const base = BASE_LAYOUTS[i % BASE_LAYOUTS.length];
    return {
      size: Math.max(160, base.size - Math.floor(i / BASE_LAYOUTS.length) * 16),
      rotate: base.rotate * (i % 2 === 0 ? 1 : -1),
      mt: (base.mt + i * 8) % 70,
      scrub: Math.min(1.2, base.scrub + i * 0.1),
    };
  });
}

const LAYOUT = buildLayout(chapters.length);

// 白色卡片上的强调色：章节色太浅时（如月白色）换成可读的深灰蓝
function readableOnWhite(hex: string) {
  const m = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map(i => parseInt(m.slice(i, i + 2), 16));
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.7 ? '#6b7a90' : hex;
}

const BOTTOM_H = 104;
const FLIP_SECONDS = 0.65;
const FLIP_HALF = FLIP_SECONDS / 2;

type ActiveAudio = { audio: HTMLAudioElement; stop: () => void };

function VoiceButton({ src, color, activeRef }: {
  src: string;
  color: string;
  activeRef: React.MutableRefObject<ActiveAudio | null>;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (!a || !canPlay) return;

    if (playing) {
      a.pause();
      setPlaying(false);
      activeRef.current = null;
    } else {
      if (activeRef.current && activeRef.current.audio !== a) {
        activeRef.current.stop();
      }
      a.currentTime = 0;
      a.play().then(() => {
        setPlaying(true);
        activeRef.current = { audio: a, stop: () => { a.pause(); setPlaying(false); } };
      }).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5" onClick={e => e.stopPropagation()}>
      <audio ref={audioRef} src={src}
        onCanPlay={() => setCanPlay(true)}
        onEnded={() => { setPlaying(false); activeRef.current = null; }} />
      <button
        onClick={toggle}
        disabled={!canPlay}
        className="relative flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: '44px', height: '44px',
          background: canPlay
            ? `radial-gradient(circle, ${color}44 0%, ${color}18 60%, transparent 100%)`
            : 'rgba(0,0,0,0.04)',
          border: `1.5px solid ${canPlay ? color + 'bb' : 'rgba(0,0,0,0.1)'}`,
          color: canPlay ? '#444' : '#ccc',
          cursor: canPlay ? 'pointer' : 'default',
          boxShadow: playing ? `0 0 16px ${color}88, 0 0 32px ${color}33` : canPlay ? `0 4px 12px ${color}33` : 'none',
        }}
        onMouseEnter={e => { if (canPlay) (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
      >
        {playing && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping"
              style={{ background: `${color}22`, animationDuration: '1.4s' }} />
            <span className="absolute rounded-full animate-ping"
              style={{ inset: '-6px', background: `${color}11`, animationDuration: '1.8s', animationDelay: '0.3s' }} />
          </>
        )}
        {playing ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
      </button>
    </div>
  );
}

export default function Companions() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>(() => chapters.map(() => false));
  const [hovered, setHovered] = useState<number | null>(null);
  const activeAudioRef = useRef<ActiveAudio | null>(null);

  const toggleFlip = (i: number) =>
    setFlipped(prev => prev.map((v, idx) => (idx === i ? !v : v)));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.15, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        const layout = LAYOUT[i] ?? LAYOUT[LAYOUT.length - 1];
        gsap.to(el, {
          y: -(20 + i * 10), ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: layout.scrub,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 px-[5vw] py-24 lg:py-32">
      <div className="text-center mb-10 xl:mb-16">
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          月亮里的遗物
        </h2>
        <p className="font-body text-white/75 mt-3" style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
          点击卡片翻面<span className="xl:hidden"> · 左右滑动查看全部</span>
        </p>
      </div>

      {/* 窄屏时四张卡放不下，改成横向滑动；宽屏时居中排开 */}
      <div className="no-scrollbar flex flex-nowrap justify-start xl:justify-center items-start gap-3 overflow-x-auto xl:overflow-visible snap-x snap-mandatory -mx-[5vw] px-[5vw] py-10 xl:mx-0 xl:px-0 xl:py-0">
        {chapters.map((chapter, i) => {
          const char = chapter.character;
          const layout = LAYOUT[i] ?? LAYOUT[LAYOUT.length - 1];
          const cardW = layout.size + 24;
          const cardH = 12 + layout.size * 1.15 + BOTTOM_H;

          return (
            <div
              key={chapter.id}
              ref={el => { cardsRef.current[i] = el; }}
              className="opacity-0 flex-shrink-0 snap-center"
              style={{ marginTop: `${layout.mt}px` }}
            >
              <div
                style={{
                  width: `${cardW}px`,
                  height: `${cardH}px`,
                  perspective: '900px',
                  transform: hovered === i && !flipped[i]
                    ? 'scale(1.06) rotate(0deg)'
                    : `rotate(${layout.rotate}deg)`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  style={{
                    position: 'relative', width: '100%', height: '100%',
                    transformStyle: 'preserve-3d',
                    transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: `transform ${FLIP_SECONDS}s cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                >
                  {/* Front */}
                  <div
                    onClick={() => toggleFlip(i)}
                    style={{
                      position: 'absolute', inset: 0,
                      backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                      // 部分浏览器（尤其 Safari）里图片层不遵守 backface-visibility，
                      // 翻到一半时直接隐藏正面，背面就不会透出镜像的照片
                      visibility: flipped[i] ? 'hidden' : 'visible',
                      transition: `visibility 0s linear ${FLIP_HALF}s`,
                      background: '#fff', borderRadius: '4px',
                      boxShadow: hovered === i ? '0 16px 48px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.28)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    }}
                  >
                    <div
                      className="relative flex items-center justify-center flex-shrink-0"
                      style={{
                        margin: '12px 12px 0',
                        height: `${layout.size * 1.15}px`,
                        background: char.visualGradient,
                        overflow: 'hidden',
                      }}
                    >
                      <div className="absolute inset-0"
                        style={{ background: `radial-gradient(circle at 60% 35%, ${chapter.color}22 0%, transparent 65%)` }} />
                      <span className="relative select-none"
                        style={{ fontSize: `${layout.size * 0.28}px`, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))', zIndex: 0 }}>
                        {char.emoji}
                      </span>
                      <img
                        src={char.image}
                        alt={char.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        style={{ zIndex: 1 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                        style={{ background: 'rgba(0,0,0,0.16)', opacity: 0, zIndex: 2 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                      >
                        <span className="font-mono text-white" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                          点击翻面
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-3 pt-1"
                      style={{ height: `${BOTTOM_H}px`, justifyContent: 'center', gap: '10px', paddingBottom: '12px' }}>
                      <div className="text-center">
                        <p className="font-display"
                          style={{ fontSize: '0.92rem', color: '#222', letterSpacing: '0.05em', fontWeight: 400 }}>
                          {char.name}
                        </p>
                        <p className="font-mono mt-1"
                          style={{ fontSize: '0.58rem', color: readableOnWhite(chapter.color), letterSpacing: '0.08em' }}>
                          {char.role}
                        </p>
                      </div>
                      {char.audio && <VoiceButton src={char.audio} color={chapter.color} activeRef={activeAudioRef} />}
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    onClick={() => toggleFlip(i)}
                    style={{
                      position: 'absolute', inset: 0,
                      backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      visibility: flipped[i] ? 'visible' : 'hidden',
                      transition: `visibility 0s linear ${FLIP_HALF}s`,
                      background: '#fff', borderRadius: '4px',
                      boxShadow: hovered === i ? '0 16px 48px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.28)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      padding: '14px', overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      height: '3px', borderRadius: '2px', flexShrink: 0,
                      background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}44)`,
                      marginBottom: '10px',
                    }} />
                    <p className="font-display flex-shrink-0"
                      style={{ fontSize: '0.88rem', color: '#222', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      {char.name}
                      <span className="font-mono ml-2"
                        style={{ fontSize: '0.55rem', color: readableOnWhite(chapter.color), letterSpacing: '0.08em' }}>
                        {char.role}
                      </span>
                    </p>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p className="font-display"
                        style={{ fontSize: '0.8rem', lineHeight: 1.7, color: '#333', letterSpacing: '0.03em' }}>
                        {char.desc}
                      </p>
                      <p className="font-body"
                        style={{ fontSize: '0.72rem', lineHeight: 1.85, color: '#666', letterSpacing: '0.03em' }}>
                        {char.detail}
                      </p>
                      <p className="font-body"
                        style={{
                          marginTop: 'auto', fontSize: '0.72rem', lineHeight: 1.85, color: '#555',
                          letterSpacing: '0.03em', fontStyle: 'italic',
                          borderLeft: `2px solid ${readableOnWhite(chapter.color)}`, paddingLeft: '8px',
                        }}>
                        「{char.intro}」
                      </p>
                    </div>
                    <p className="font-mono text-center flex-shrink-0 mt-2"
                      style={{ fontSize: '10px', color: '#bbb', letterSpacing: '0.08em' }}>
                      ← 点击返回
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
