import { useState, useRef, useCallback, useEffect } from "react";
import { useInView } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage }: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(65);
  const [hasHinted, setHasHinted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  // Auto-hint: slide from before to after on first view
  useEffect(() => {
    if (!isInView || hasHinted) return;
    setHasHinted(true);

    const t1 = setTimeout(() => setPosition(25), 500);
    const t2 = setTimeout(() => setPosition(45), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView, hasHinted]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleStart = useCallback((clientX: number) => {
    isDragging.current = true;
    updatePosition(clientX);
  }, [updatePosition]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    updatePosition(clientX);
  }, [updatePosition]);

  const handleEnd = useCallback(() => { isDragging.current = false; }, []);

  return (
    <div className="px-5 pb-8">
      <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
        改造前后
      </h3>

      <div
        ref={containerRef}
        className="relative w-full h-[220px] rounded-2xl overflow-hidden select-none touch-none cursor-ew-resize"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <img src={afterImage} alt="改造后" className="absolute inset-0 w-full h-full object-cover" />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%`, transition: isDragging.current ? 'none' : 'width 0.5s ease-out' }}
        >
          <img
            src={beforeImage}
            alt="改造前"
            className="absolute inset-0 h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw' }}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary-foreground/90"
          style={{
            left: `${position}%`,
            transform: 'translateX(-50%)',
            transition: isDragging.current ? 'none' : 'left 0.5s ease-out',
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-foreground shadow-elevated flex items-center justify-center">
            <span className="text-foreground text-[10px] font-bold">⟷</span>
          </div>
        </div>

        <span className="absolute top-3 left-3 text-[10px] font-semibold text-primary-foreground bg-foreground/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
          改造前
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-semibold text-primary-foreground bg-saving/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
          改造后
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
