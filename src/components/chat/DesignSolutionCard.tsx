import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DesignSolution } from "@/types/chat";

interface DesignSolutionCardProps {
  solution: DesignSolution;
  onViewDetail: () => void;
  onModify: () => void;
}

const DesignSolutionCard = ({ solution, onViewDetail, onModify }: DesignSolutionCardProps) => {
  const [revealed, setRevealed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 300);
    const t2 = setTimeout(() => setShowContent(true), 900);
    const t3 = setTimeout(() => setShowActions(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const brandTotal = 38600;
  const ourTotal = solution.costOptimization.current;
  const savedPercent = Math.round(((brandTotal - ourTotal) / brandTotal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card shadow-layered rounded-outer overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm"
        >
          🎨
        </motion.span>
        <span className="text-xs font-semibold">方案A：{solution.name}</span>
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="ml-auto text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-button font-mono"
        >
          AI 推荐
        </motion.span>
      </div>

      {/* Render image with curtain reveal */}
      <button onClick={onViewDetail} className="relative w-full text-left overflow-hidden">
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={revealed ? { clipPath: "inset(0 0 0% 0)" } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        >
          <img
            src={solution.renderImages[0]}
            alt={`${solution.name}效果图`}
            className="w-full h-48 object-cover"
          />
        </motion.div>

        <AnimatePresence>
          {revealed &&
            solution.annotations.map((ann, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.0 + i * 0.2, type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
                style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}
              >
                <div className="w-4 h-4 rounded-full bg-primary/80 border-2 border-primary-foreground shadow-elevated flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent flex items-end justify-center pb-3">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-[10px] text-primary-foreground bg-foreground/40 backdrop-blur-sm px-2.5 py-1 rounded-button"
          >
            点击查看完整方案 ↗
          </motion.span>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Design concept - one punchy line */}
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs leading-relaxed text-foreground/80"
              >
                {solution.designThinking.concept.slice(0, 60)}...
              </motion.p>

              {/* Professional highlights - the star of the card */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "📐", label: "布局", value: "黄金比例" },
                  { icon: "🎯", label: "动线", value: "3条设计" },
                  { icon: "💡", label: "照明", value: "3层系统" },
                ].map((h, i) => (
                  <motion.div
                    key={h.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-secondary/50 rounded-inner p-2 text-center"
                  >
                    <span className="text-sm block">{h.icon}</span>
                    <span className="text-[10px] text-muted-foreground block">{h.label}</span>
                    <span className="text-[11px] font-medium">{h.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Life scenarios */}
              <div>
                <span className="text-[10px] text-muted-foreground block mb-1.5">适配你的生活场景</span>
                <div className="flex flex-wrap gap-1">
                  {solution.lifeScenarios.map((s, i) => (
                    <motion.span
                      key={s.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-button"
                    >
                      {s.name}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Price footer - subtle, not pushy */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-3 border-t border-border flex items-center justify-between"
              >
                <span className="text-[10px] text-muted-foreground">
                  含 {solution.productSelection.items.length} 件精选商品
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-base font-bold text-foreground">
                    ¥{ourTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-saving font-medium">
                    比品牌省{savedPercent}%
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="px-4 pb-4 flex gap-2"
          >
            <button
              onClick={onViewDetail}
              className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-button active:scale-[0.97] transition-transform"
            >
              查看完整方案
            </button>
            <button
              onClick={onModify}
              className="flex-1 py-2.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-button active:scale-[0.97] transition-transform"
            >
              帮我调一调
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DesignSolutionCard;
