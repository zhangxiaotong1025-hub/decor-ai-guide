import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingDown, TrendingUp, Palette, Sparkles } from "lucide-react";
import type { QuickActionType } from "./QuickActionBar";
import { mockDesignSolution } from "@/data/mockDesignSolution";

interface AgentPanelProps {
  activeAction: QuickActionType;
  onClose: () => void;
  onOpenSolution: () => void;
}

const AgentPanel = ({ activeAction, onClose, onOpenSolution }: AgentPanelProps) => (
  <AnimatePresence>
    {activeAction && (
      <motion.div
        key={activeAction}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-x-0 bottom-[56px] z-[55] bg-card rounded-t-[20px] max-h-[50dvh] flex flex-col"
        style={{
          boxShadow: "0 -4px 30px rgba(0,0,0,0.06), 0 -1px 4px rgba(0,0,0,0.03)",
        }}
      >
        {/* Drag handle + header */}
        <div className="flex-shrink-0">
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-[3px] bg-muted-foreground/15 rounded-full" />
          </div>
          <div className="flex items-center justify-between px-5 pb-3">
            <span className="text-sm font-medium text-foreground">
              {activeAction === "design" && "🎨 方案设计"}
              {activeAction === "budget" && "💰 预算管理"}
              {activeAction === "consult" && "✨ 智能咨询"}
            </span>
            <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-full transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {activeAction === "design" && <DesignPanel onOpenSolution={onOpenSolution} />}
          {activeAction === "budget" && <BudgetPanel />}
          {activeAction === "consult" && <ConsultPanel />}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const DesignPanel = ({ onOpenSolution }: { onOpenSolution: () => void }) => (
  <div className="space-y-3">
    <p className="text-sm text-muted-foreground leading-relaxed">
      已为你生成 1 套专属方案，基于你的户型和生活习惯打造。
    </p>
    <button
      onClick={onOpenSolution}
      className="w-full flex items-center justify-between bg-secondary/40 rounded-xl p-4 hover:bg-secondary/60 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Palette className="w-5 h-5 text-primary" />
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">{mockDesignSolution.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mockDesignSolution.productSelection.items.length} 件商品 · ¥{mockDesignSolution.costOptimization.current.toLocaleString()}
          </p>
        </div>
      </div>
      <span className="text-xs text-primary">查看 →</span>
    </button>
    <div className="grid grid-cols-2 gap-2">
      {["换个风格试试", "调整空间布局"].map((text) => (
        <button key={text} className="bg-secondary/30 text-xs text-foreground rounded-xl py-3 px-3 hover:bg-secondary/50 transition-colors">
          {text}
        </button>
      ))}
    </div>
  </div>
);

const BudgetPanel = () => {
  const sol = mockDesignSolution;
  const total = sol.costOptimization.current;
  const canSaveTotal = sol.costOptimization.canSave.reduce((s, i) => s + i.savings, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">当前方案总价</span>
        <span className="font-mono text-xl font-semibold text-foreground">¥{total.toLocaleString()}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <TrendingDown className="w-4 h-4 text-accent" />
          <span className="text-foreground">可以省</span>
          <span className="ml-auto font-mono text-accent">-¥{canSaveTotal.toLocaleString()}</span>
        </div>
        {sol.costOptimization.canSave.map((s, i) => (
          <div key={i} className="bg-secondary/30 rounded-lg p-3">
            <div className="flex justify-between text-xs">
              <span className="text-foreground">{s.item}</span>
              <span className="text-accent font-mono">-¥{s.savings.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{s.tradeoff}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-foreground">可以升级</span>
        </div>
        {sol.costOptimization.canUpgrade.map((u, i) => (
          <div key={i} className="bg-secondary/30 rounded-lg p-3">
            <div className="flex justify-between text-xs">
              <span className="text-foreground">{u.item}</span>
              <span className="text-primary font-mono">+¥{u.cost.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{u.benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConsultPanel = () => (
  <div className="space-y-3">
    <p className="text-sm text-muted-foreground leading-relaxed">
      有任何关于装修的问题，随时问我。比如：
    </p>
    {[
      "这个沙发适合养猫家庭吗？",
      "定制柜子一般要多久？",
      "科技布和真皮怎么选？",
      "预算 2 万够不够？",
    ].map((q) => (
      <button
        key={q}
        className="w-full text-left bg-secondary/30 rounded-xl px-4 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors"
      >
        {q}
      </button>
    ))}
  </div>
);

export default AgentPanel;
