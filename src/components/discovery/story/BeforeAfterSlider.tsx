import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage }: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(70); // Start showing mostly "before"
  const [hasHinted, setHasHinted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  // Auto-animate hint when first visible
  useEffect(() => {
    if (!isInView || hasHinted) return;
    setHasHinted(true);

    const steps = [
      { pos: 70, delay: 400 },
      { pos: 25, delay: 800 },  // Slide to reveal "after"
      { pos: 50, delay: 600 },  // Settle in middle
    ];

    let totalDelay = 0;
    const timers: number[] = [];
    steps.forEach(({ pos, delay }) => {
      totalDelay += delay;
      timers.push(window.setTimeout(() => setPosition(pos), totalDelay));
    });

    return () => timers.forEach(clearTimeout);
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
    <div className="px-6 pb-8">
      <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
        改造前后
      </h3>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[240px] rounded-2xl overflow-hidden select-none touch-none cursor-ew-resize shadow-elevated"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* After (full background) */}
        <img src={afterImage} alt="改造后" className="absolute inset-0 w-full h-full object-cover" />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%`, transition: isDragging.current ? 'none' : 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <img
            src={beforeImage}
            alt="改造前"
            className="absolute inset-0 h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw' }}
          />
          {/* Desaturated tint on before */}
          <div className="absolute inset-0 bg-foreground/5 mix-blend-saturation" />
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary-foreground shadow-sm"
          style={{
            left: `${position}%`,
            transform: 'translateX(-50%)',
            transition: isDragging.current ? 'none' : 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-foreground shadow-float flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8L1 5.5M4 8L1 10.5M4 8H12M12 8L15 5.5M12 8L15 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70" />
            </svg>
          </div>
        </div>

        {/* Labels with animation */}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-3 left-3 text-[10px] font-semibold text-primary-foreground bg-foreground/50 backdrop-blur-sm px-2.5 py-1 rounded-full"
        >
          改造前
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-3 right-3 text-[10px] font-semibold text-primary-foreground bg-saving/80 backdrop-blur-sm px-2.5 py-1 rounded-full"
        >
          改造后 ✨
        </motion.span>
      </motion.div>
    </div>
  );
};

export default BeforeAfterSlider;
