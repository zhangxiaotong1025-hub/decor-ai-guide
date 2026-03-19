import { motion } from "framer-motion";
import type { DesignSolution } from "@/types/chat";

interface DesignSolutionCardProps {
  solution: DesignSolution;
  onViewDetail: () => void;
  onModify: () => void;
}

const DesignSolutionCard = ({ solution, onViewDetail, onModify }: DesignSolutionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card shadow-layered rounded-outer overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm">🎨</span>
          <span className="text-xs font-semibold">方案A：{solution.name}</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-button font-mono">
            AI 推荐
          </span>
        </div>
      </div>

      {/* Render image - tappable */}
      <button onClick={onViewDetail} className="relative w-full text-left">
        <img
          src={solution.renderImages[0]}
          alt={`${solution.name}效果图`}
          className="w-full h-44 object-cover"
        />
        {/* Annotations overlay */}
        {solution.annotations.map((ann, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            className="absolute"
            style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}
          >
            <div className="w-4 h-4 rounded-full bg-primary/80 border-2 border-primary-foreground shadow-elevated flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            </div>
          </motion.div>
        ))}
        {/* Tap hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent flex items-end justify-center pb-3">
          <span className="text-[10px] text-primary-foreground bg-foreground/40 backdrop-blur-sm px-2.5 py-1 rounded-button">
            点击查看完整方案 ↗
          </span>
        </div>
      </button>

      {/* Design concept summary */}
      <div className="p-4 space-y-3">
        {/* Concept */}
        <div>
          <span className="text-label text-primary font-mono block mb-1">CONCEPT</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {solution.designThinking.concept.slice(0, 80)}...
          </p>
        </div>

        {/* Key highlights */}
        <div className="grid grid-cols-3 gap-2">
          <Highlight icon="📐" label="布局" value="黄金比例" />
          <Highlight icon="🎯" label="动线" value="3条设计" />
          <Highlight icon="💡" label="照明" value="3层系统" />
        </div>

        {/* Life scenarios */}
        <div>
          <span className="text-label text-muted-foreground font-mono block mb-1.5">生活场景</span>
          <div className="flex flex-wrap gap-1">
            {solution.lifeScenarios.map((s) => (
              <span
                key={s.name}
                className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-button"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Product summary */}
        <div className="flex items-center justify-between py-2 border-t border-b border-border">
          <div>
            <span className="text-[10px] text-muted-foreground">含 {solution.productSelection.items.length} 件精选商品</span>
          </div>
          <div className="text-right">
            <span className="font-mono-data text-sm font-semibold text-primary">
              ¥{solution.costOptimization.current.toLocaleString()}
            </span>
            <span className="text-[10px] text-accent ml-1">预算内 ✓</span>
          </div>
        </div>

        {/* Cost optimization hint */}
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span>💡 可降至 ¥{(solution.costOptimization.current - solution.costOptimization.canSave.reduce((s, i) => s + i.savings, 0)).toLocaleString()}</span>
          <span>·</span>
          <span>可升至 ¥{(solution.costOptimization.current + solution.costOptimization.canUpgrade.reduce((s, i) => s + i.cost, 0)).toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={onViewDetail}
          className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-button"
        >
          查看完整方案
        </button>
        <button
          onClick={onModify}
          className="flex-1 py-2.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-button"
        >
          对话修改方案
        </button>
      </div>
    </motion.div>
  );
};

const Highlight = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="bg-secondary/50 rounded-inner p-2 text-center">
    <span className="text-sm block">{icon}</span>
    <span className="text-[10px] text-muted-foreground block">{label}</span>
    <span className="text-[11px] font-medium">{value}</span>
  </div>
);

export default DesignSolutionCard;
