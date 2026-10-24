import { siteConfig } from '@/content/config';

export default function Footer() {
  return (
    <footer
      className="relative z-10 py-8 px-[5vw] mt-[30vh]"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="font-display text-white mb-3"
          style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          {siteConfig.title}
        </h2>

        <p
          className="font-display text-white/60"
          style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', fontWeight: 300, lineHeight: 1.8, letterSpacing: '0.05em' }}
        >
          {siteConfig.footerQuote}
        </p>

        <p className="font-mono text-white/30 mt-3" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>
          {siteConfig.copyright}
        </p>
      </div>
    </footer>
  );
}
