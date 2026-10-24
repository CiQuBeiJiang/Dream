import { useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { chapters, siteConfig } from '@/content/config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AudioPlayer from './AudioPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function Seasons() {
  const { setChapter, setVideoSrc } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        onLeaveBack: () => setVideoSrc(siteConfig.introVideo),
      });

      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const chapter = chapters[i];

        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter:     () => { setChapter(chapter.id); setVideoSrc(chapter.video); },
          onEnterBack: () => { setChapter(chapter.id); setVideoSrc(chapter.video); },
        });

        const panel = el.querySelector('.season-panel');
        if (panel) {
          gsap.fromTo(panel,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 1, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none none' },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setChapter, setVideoSrc]);

  return (
    <section ref={sectionRef} className="relative z-10">
      <div className="text-center px-[5vw] py-24 lg:py-32">
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          四章故事
        </h2>
      </div>

      {chapters.map((chapter, i) => (
        <div
          key={chapter.id}
          ref={(el) => { chapterRefs.current[i] = el; }}
          className={`relative min-h-[100dvh] flex items-center justify-center px-[5vw] ${chapter.panelAlign === 'left' ? 'lg:justify-start' : chapter.panelAlign === 'right' ? 'lg:justify-end' : ''}`}
        >
          <div
            className={`season-panel glass-panel glass-panel-${chapter.id} relative max-w-2xl lg:max-w-xl w-full p-8 lg:p-12 opacity-0`}
            style={{ borderLeft: `3px solid ${chapter.color}`, background: chapter.glassBg }}
          >
            <p
              className="font-mono text-white/50 mb-2"
              style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}
            >
              {chapter.title.split(' · ')[0]}
            </p>
            <h3
              className="font-display text-white mb-6"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', fontWeight: 300, letterSpacing: '0.12em' }}
            >
              {chapter.title.split(' · ').slice(1).join(' · ')}
            </h3>

            <div
              className="font-body text-white/85 space-y-4"
              style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)', lineHeight: 2, letterSpacing: '0.04em' }}
            >
              {chapter.story.map((para, j) => <p key={j}>{para}</p>)}
            </div>

            <AudioPlayer src={chapter.audio} color={chapter.color} />
          </div>
        </div>
      ))}
    </section>
  );
}
