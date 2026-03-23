import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedPriceProps {
  value: number;
  delay?: number;
  className?: string;
}

const AnimatedPrice = ({ value, delay = 0, className }: AnimatedPriceProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay, value]);

  useEffect(() => {
    if (!started) return;

    const duration = 1200;
    const startTime = performance.now();
    const startVal = Math.round(value * 0.6); // start from 60% for dramatic effect

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, value]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: started ? 1 : 0 }}
    >
      ¥{displayValue.toLocaleString()}
    </motion.span>
  );
};

export default AnimatedPrice;
