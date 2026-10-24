import { siteConfig } from '@/content/config';

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[5vw] h-20"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="font-display text-white"
          style={{ fontSize: '1.1rem', fontWeight: 300, letterSpacing: '0.2em' }}
        >
          {siteConfig.title}
        </div>
        <span
          className="hidden sm:block font-display-en text-white/60"
          style={{ fontSize: '0.7rem', fontWeight: 200 }}
        >
          {siteConfig.titleSub}
        </span>
      </div>
    </nav>
  );
}
