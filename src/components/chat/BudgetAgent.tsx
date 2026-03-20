import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, TrendingDown, TrendingUp,
  BarChart3, Sparkles, Info, ArrowUpDown,
  CheckCircle2, Lightbulb, AlertTriangle, PiggyBank,
} from "lucide-react";
import { mockDesignSolution } from "@/data/mockDesignSolution";
import { generateBudgetIntelligence, type BudgetCategory, type BudgetIntelligence } from "@/data/budgetIntelligence";

interface BudgetAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = "overview" | "category-detail" | "tier-compare";

const BudgetAgent = ({ isOpen, onClose }: BudgetAgentProps) => {
  const [data] = useState<BudgetIntelligence>(() => generateBudgetIntelligence(mockDesignSolution));
  const [view, setView] = useState<ViewState>("overview");
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [selectedTier, setSelectedTier] = useState(1); // 0=省心 1=平衡 2=品质

  if (!isOpen) return null;

  const handleCategoryClick = (cat: BudgetCategory) => {
    setSelectedCategory(cat);
    setView("category-detail");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-[60] bg-background flex flex-col"
      >
        {/* Header */}
        <Header
          onClose={onClose}
          view={view}
          onBack={() => setView("overview")}
          categoryName={selectedCategory?.name}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait">
            {view === "overview" && (
              <OverviewView
                key="overview"
                data={data}
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
                onCategoryClick={handleCategoryClick}
              />
            )}
            {view === "category-detail" && selectedCategory && (
              <CategoryDetailView
                key="category-detail"
                category={selectedCategory}
                totalBudget={data.totalBudget}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Header ─── */
const Header = ({
  onClose,
  view,
  onBack,
  categoryName,
}: {
  onClose: () => void;
  view: ViewState;
  onBack: () => void;
  categoryName?: string;
}) => (
  <div className="flex-shrink-0 border-b border-border">
    <div className="flex items-center justify-between px-4 h-12">
      {view !== "overview" ? (
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-primary">
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>返回</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">预算报价</span>
        </div>
      )}
      {view === "category-detail" && categoryName && (
        <span className="text-sm font-medium text-foreground">{categoryName}</span>
      )}
      <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  </div>
);

/* ─── Overview ─── */
const OverviewView = ({
  data,
  selectedTier,
  onSelectTier,
  onCategoryClick,
}: {
  data: BudgetIntelligence;
  selectedTier: number;
  onSelectTier: (i: number) => void;
  onCategoryClick: (cat: BudgetCategory) => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  >
    {/* AI Summary — the "one sentence that matters" */}
    <div className="px-4 pt-4 pb-3">
      <div className="flex items-start gap-2.5 rounded-xl bg-primary/[0.04] border border-primary/10 p-3.5">
        <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-foreground leading-relaxed">{data.summary}</p>
      </div>
    </div>

    {/* Tier selector */}
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">选择预算档位</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {data.tiers.map((tier, i) => (
          <button
            key={tier.label}
            onClick={() => onSelectTier(i)}
            className={`relative rounded-xl p-3 text-left border transition-all ${
              selectedTier === i
                ? "border-primary/30 bg-primary/[0.04] shadow-sm"
                : "border-border bg-card hover:border-border/80"
            }`}
          >
            {selectedTier === i && (
              <motion.div
                layoutId="tier-indicator"
                className="absolute top-2 right-2"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              </motion.div>
            )}
            <p className="text-[10px] text-muted-foreground mb-1">{tier.label}</p>
            <p className={`font-mono text-base font-bold tracking-display ${
              selectedTier === i ? "text-primary" : "text-foreground"
            }`}>
              ¥{tier.total.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{tier.desc}</p>
          </button>
        ))}
      </div>
    </div>

    {/* Category breakdown — tap to see detail */}
    <div className="px-4 pb-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-medium text-muted-foreground">预算去向</span>
        <span className="text-[10px] text-muted-foreground">点击查看为什么</span>
      </div>

      {/* Visual bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
        {data.categories.map((cat, i) => {
          const pct = (cat.allocated / data.totalBudget) * 100;
          const colors = [
            "bg-primary", "bg-primary/70", "bg-primary/50", "bg-primary/35", "bg-primary/20",
          ];
          return (
            <motion.div
              key={cat.id}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: "easeOut" }}
              className={`${colors[i]} ${i === 0 ? "rounded-l-full" : ""} ${i === data.categories.length - 1 ? "rounded-r-full" : ""}`}
            />
          );
        })}
      </div>

      {/* Category list */}
      <div className="space-y-1.5">
        {data.categories.map((cat) => {
          const pct = Math.round((cat.allocated / data.totalBudget) * 100);
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/40 transition-colors group"
            >
              <span className="text-base">{cat.icon}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{cat.name}</span>
                  <span className="font-mono text-sm text-foreground">¥{cat.allocated.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-primary/40 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">{pct}%</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            </button>
          );
        })}
      </div>
    </div>

    {/* Insights — progressive, not all at once */}
    <div className="px-4 pt-2 pb-6">
      <div className="flex items-center gap-2 mb-2.5">
        <Lightbulb className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">帮你想到的</span>
      </div>
      <div className="space-y-2">
        {data.insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} delay={i * 0.08} />
        ))}
      </div>
    </div>
  </motion.div>
);

/* ─── Insight Card ─── */
const InsightCard = ({
  insight,
  delay,
}: {
  insight: { title: string; content: string; type: "save" | "tip" | "warn" };
  delay: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const iconMap = {
    save: <PiggyBank className="w-3.5 h-3.5 text-accent" />,
    tip: <Info className="w-3.5 h-3.5 text-primary" />,
    warn: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
  };
  const borderMap = {
    save: "border-accent/15",
    tip: "border-primary/15",
    warn: "border-destructive/15",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left rounded-xl border ${borderMap[insight.type]} p-3 transition-colors hover:bg-secondary/20`}
      >
        <div className="flex items-center gap-2">
          {iconMap[insight.type]}
          <span className="text-xs font-medium text-foreground flex-1">{insight.title}</span>
          <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 8 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="text-[12px] text-muted-foreground leading-relaxed overflow-hidden"
            >
              {insight.content}
            </motion.p>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

/* ─── Category Detail ─── */
const CategoryDetailView = ({
  category,
  totalBudget,
}: {
  category: BudgetCategory;
  totalBudget: number;
}) => {
  const pct = Math.round((category.allocated / totalBudget) * 100);
  const [min, max] = category.marketRange;
  // Position on market range bar
  const positionPct = Math.min(100, Math.max(0, ((category.allocated - min) / (max - min)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="px-4 pt-4 pb-8"
    >
      {/* Hero */}
      <div className="text-center mb-5">
        <span className="text-3xl mb-2 block">{category.icon}</span>
        <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
        <p className="font-mono text-2xl font-bold text-foreground mt-1">¥{category.allocated.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-0.5">占总预算 {pct}%</p>
      </div>

      {/* Why this price */}
      <div className="rounded-xl bg-secondary/30 border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">这个价格怎么来的</span>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">{category.whyThisPrice}</p>
      </div>

      {/* Market position */}
      <div className="rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">行业价格区间</span>
        </div>

        <div className="relative mb-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent/40 via-primary/40 to-destructive/30 rounded-full"
              style={{ width: "100%" }}
            />
          </div>
          {/* Current position marker */}
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: `${positionPct}%` }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          >
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-sm" />
          </motion.div>
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>¥{min.toLocaleString()}</span>
          <span className="text-primary font-semibold">当前 ¥{category.allocated.toLocaleString()}</span>
          <span>¥{max.toLocaleString()}</span>
        </div>
      </div>

      {/* Adjustment options */}
      <div className="space-y-3">
        {category.downgrade && (
          <div className="rounded-xl border border-accent/20 bg-accent/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-foreground">省钱方案</span>
              <span className="font-mono text-xs font-bold text-accent ml-auto">
                ¥{category.downgrade.price.toLocaleString()}
              </span>
            </div>
            <p className="text-[12px] text-foreground mb-1">{category.downgrade.desc}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              ⚠️ {category.downgrade.tradeoff}
            </p>
            <div className="mt-2.5 pt-2 border-t border-accent/10">
              <span className="text-[11px] text-accent font-medium">
                可省 ¥{(category.allocated - category.downgrade.price).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {category.upgrade && (
          <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">升级方案</span>
              <span className="font-mono text-xs font-bold text-primary ml-auto">
                ¥{category.upgrade.price.toLocaleString()}
              </span>
            </div>
            <p className="text-[12px] text-foreground mb-1">{category.upgrade.desc}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              ✨ {category.upgrade.benefit}
            </p>
            <div className="mt-2.5 pt-2 border-t border-primary/10">
              <span className="text-[11px] text-primary font-medium">
                需加 ¥{(category.upgrade.price - category.allocated).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BudgetAgent;
