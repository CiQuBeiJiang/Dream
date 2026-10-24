import { useRef, useEffect } from 'react';
import { siteConfig } from '@/content/config';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const subtitleLineRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainTitleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(
        subtitleLineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out', delay: 0.8 }
      );
      gsap.fromTo(
        scrollLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1.5, ease: 'power2.inOut',
          repeat: -1, yoyo: true, transformOrigin: 'top',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center z-10">
      <div className="ml-[10vw]">
        <h1
          ref={mainTitleRef}
          className="font-display text-white opacity-0"
          style={{
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontWeight: 200,
            letterSpacing: '0.1em',
            lineHeight: 1.1,
            textShadow: '0 0 30px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.08)',
          }}
        >
          {siteConfig.title}
        </h1>
      </div>

      <div ref={subtitleLineRef} className="absolute bottom-32 left-[10vw] opacity-0">
        <p
          className="font-body text-white/50"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 400, lineHeight: 1.6, letterSpacing: '0.02em' }}
        >
          {siteConfig.heroSubtitle}
        </p>
      </div>

      <div className="absolute right-[5vw] bottom-1/4 flex flex-col items-center gap-3">
        <span
          className="font-mono text-white/50"
          style={{ fontSize: '10px', letterSpacing: '0.15em', writingMode: 'vertical-rl' }}
        >
          {siteConfig.scrollHint}
        </span>
        <div
          ref={scrollLineRef}
          className="w-[1px] bg-white/30"
          style={{ height: '40px', transformOrigin: 'top' }}
        />
      </div>
    </section>
  );
}
