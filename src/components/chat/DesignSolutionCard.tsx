import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingDown, Zap } from "lucide-react";
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

  const brandTotal = 38600; // mock: 品牌店总价
  const ourTotal = solution.costOptimization.current;
  const savedTotal = brandTotal - ourTotal;
  const savedPercent = Math.round((savedTotal / brandTotal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card shadow-layered rounded-outer overflow-hidden"
    >
      {/* Header - personal & warm */}
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🎨</span>
          <span className="text-xs font-semibold">{solution.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-button font-medium">
            AI 推荐
          </span>
        </div>
        {/* Live viewers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-1 text-[10px] text-muted-foreground"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saving opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-saving" />
          </span>
          <span>23人在看</span>
        </motion.div>
      </div>

      {/* Render image */}
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

        {/* Annotations */}
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
              {/* Price comparison - the core hook */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-inner bg-saving/5 border border-saving/15 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-saving" />
                    <span className="text-[11px] font-semibold text-saving">价格脱水</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground line-through">
                    品牌店总价 ¥{brandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-foreground">
                    ¥{ourTotal.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-saving">
                    省 {savedPercent}%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {solution.productSelection.items.length} 件商品，同款同质，工厂直发
                </p>
              </motion.div>

              {/* Product mini-ticker - social proof + urgency */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-1.5"
              >
                {solution.productSelection.items.slice(0, 2).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-inner bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm flex-shrink-0">{item.category.slice(0, 2)}</span>
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium block truncate">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.brief.slice(0, 20)}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[11px] font-mono font-semibold block">¥{item.price.toLocaleString()}</span>
                      <div className="flex items-center gap-0.5 text-gold">
                        <Users className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-medium">{8 + i * 3}人拼</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Group-buy nudge */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-inner bg-gold/5 border border-gold/15"
              >
                <Zap className="w-3 h-3 text-gold flex-shrink-0" />
                <span className="text-[10px] text-foreground/80">
                  加入拼团还能再省 <span className="font-semibold text-gold">¥{(savedTotal * 0.15).toFixed(0)}</span>，当前 3 个商品接近成团
                </span>
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
              看完整方案和底价
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
