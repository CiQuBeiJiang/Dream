import { useRef, useEffect } from 'react';
import { protagonist } from '@/content/config';
import AudioPlayer from './AudioPlayer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  if (!protagonist.show) return null;
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        polaroidRef.current,
        { opacity: 0, x: -60, rotation: -8 },
        {
          opacity: 1, x: 0, rotation: -3,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
      gsap.to(polaroidRef.current, {
        y: -80, rotation: 3, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
      gsap.to(panelRef.current, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] z-10 flex items-center px-[5vw] py-24 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full max-w-7xl mx-auto">
        {/* Polaroid */}
        <div className="flex justify-center">
          <div ref={polaroidRef} className="polaroid opacity-0" style={{ transform: 'rotate(-3deg)' }}>
            <div
              className="overflow-hidden relative flex items-center justify-center"
              style={{ width: '280px', height: '350px', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 40%, #e8d5f5 100%)' }}
            >
              <span className="absolute select-none pointer-events-none" style={{ fontSize: '80px', zIndex: 0 }}>🌙</span>
              <img
                src={protagonist.image}
                alt={protagonist.imageLabel}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                style={{ zIndex: 1 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <p className="text-center mt-4" style={{ fontSize: '0.85rem', color: '#333' }}>
              {protagonist.imageLabel}
            </p>
          </div>
        </div>

        {/* Glass panel */}
        <div ref={panelRef} className="glass-panel glass-panel-librarian p-6 lg:p-8 opacity-0">
          <h2
            className="font-display text-white mb-6"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, letterSpacing: '0.1em' }}
          >
            {protagonist.sectionTitle}
          </h2>

          <p
            className="font-body text-white/80"
            style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', lineHeight: 1.9, letterSpacing: '0.04em' }}
          >
            {protagonist.intro}
          </p>

          <AudioPlayer src={protagonist.audio} color="#FAD0C4" large />
        </div>
      </div>
    </section>
  );
}
