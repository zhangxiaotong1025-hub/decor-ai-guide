import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage }: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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

  const handleEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="px-6 pb-8">
      <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
        改造前后
      </h3>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative w-full h-[220px] rounded-2xl overflow-hidden select-none touch-none cursor-ew-resize"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* After (full) */}
        <img src={afterImage} alt="改造后" className="absolute inset-0 w-full h-full object-cover" />

        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img
            src={beforeImage}
            alt="改造前"
            className="absolute inset-0 h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw' }}
          />
        </div>

        {/* Divider line */}
        <div className="absolute top-0 bottom-0 w-[2px] bg-primary-foreground/90 shadow-sm" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-foreground/90 shadow-elevated flex items-center justify-center">
            <span className="text-foreground text-[10px] font-bold">⟷</span>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 text-[10px] font-semibold text-primary-foreground bg-foreground/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
          改造前
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-semibold text-primary-foreground bg-saving/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
          改造后
        </span>
      </motion.div>
    </div>
  );
};

export default BeforeAfterSlider;
