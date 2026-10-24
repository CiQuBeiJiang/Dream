import { useRef, useCallback, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function TimeSlider() {
  const { sliderValue, setSliderValue } = useApp();
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderValue(x / rect.width);
    },
    [setSliderValue]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDragging.current = true;
      updateFromClientX(e.clientX);
    },
    [updateFromClientX]
  );

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      updateFromClientX(e.clientX);
    };
    const handleUp = () => { isDragging.current = false; };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [updateFromClientX]);

  const pct = sliderValue * 100;

  const ticks = [
    { pos: 0, label: '遗忘' },
    { pos: 0.5, label: '寻找' },
    { pos: 1, label: '记起' },
  ];

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center select-none"
      style={{ width: 'min(600px, 80vw)' }}
    >
      <div
        ref={trackRef}
        className="relative w-full cursor-pointer"
        style={{ height: '36px' }}
        onPointerDown={handlePointerDown}
      >
        {/* Tick marks */}
        <div className="absolute top-[15px] left-0 w-full pointer-events-none">
          {ticks.map(({ pos, label }) => (
            <div
              key={pos}
              className="absolute top-0"
              style={{ left: `${pos * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div className="mx-auto" style={{ width: '1px', height: '8px', background: 'rgba(255,255,255,0.3)' }} />
              <span
                className="font-mono block text-center mt-2"
                style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Rail */}
        <div
          className="absolute top-[15px] left-0 w-full pointer-events-none"
          style={{ height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '1px' }}
        />

        {/* Fill */}
        <div
          className="absolute top-[15px] left-0 pointer-events-none"
          style={{
            width: `${pct}%`,
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.8))',
            borderRadius: '1px',
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${pct}%`, transform: `translate(-50%, -50%)` }}
        >
          <div
            className="rounded-full"
            style={{
              width: '16px',
              height: '16px',
              background: '#ffffff',
              boxShadow: '0 0 8px rgba(255,255,255,0.3)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
