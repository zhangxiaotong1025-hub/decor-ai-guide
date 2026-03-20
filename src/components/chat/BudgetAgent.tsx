import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronDown, ChevronUp, TrendingDown, TrendingUp,
  Shield, Factory, Zap, Eye, BarChart3, CircleDollarSign,
  CheckCircle2, AlertTriangle, ArrowRight, Sparkles,
} from "lucide-react";
import { mockDesignSolution } from "@/data/mockDesignSolution";

interface BudgetAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

/* ─── price breakdown per item ─── */
const priceBreakdowns: Record<string, { factory: number; material: number; labor: number; brand: number; channel: number }> = {
  "🛋️ 沙发": { factory: 1280, material: 1400, labor: 600, brand: 600, channel: 400 },
  "🪑 茶几": { factory: 480, material: 620, labor: 280, brand: 180, channel: 120 },
  "📺 电视柜": { factory: 640, material: 860, labor: 460, brand: 360, channel: 240 },
  "💡 灯具组合": { factory: 520, material: 680, labor: 400, brand: 420, channel: 280 },
  "🌿 软装配饰": { factory: 800, material: 1200, labor: 500, brand: 600, channel: 400 },
};

const BudgetAgent = ({ isOpen, onClose }: BudgetAgentProps) => {
  const sol = mockDesignSolution;
  const items = sol.productSelection.items;
  const total = sol.costOptimization.current;
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showSaveDetail, setShowSaveDetail] = useState(false);

  // Computed
  const totalBrandTax = Object.values(priceBreakdowns).reduce((s, b) => s + b.brand + b.channel, 0);
  const c2mTotal = total - totalBrandTax;
  const savePercent = Math.round((totalBrandTax / total) * 100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background flex flex-col"
      >
        {/* ─── Header ─── */}
        <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground tracking-display">AI 智能报价</h2>
                <p className="text-[10px] text-muted-foreground font-mono">COST INTELLIGENCE ENGINE</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Stats */}
          <motion.div {...fadeUp} className="px-4 pt-5 pb-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent border border-primary/10 p-4">
              {/* Scanning line effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse-line" style={{ top: "30%" }} />
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-primary font-mono uppercase tracking-widest">Real-time Analysis</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">方案总价</p>
                  <p className="font-mono text-lg font-bold text-foreground tracking-display">¥{total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">品牌溢价</p>
                  <p className="font-mono text-lg font-bold text-destructive tracking-display">¥{totalBrandTax.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">C2M 底价</p>
                  <p className="font-mono text-lg font-bold text-accent tracking-display">¥{c2mTotal.toLocaleString()}</p>
                </div>
              </div>

              {/* Save bar */}
              <div className="mt-3 pt-3 border-t border-primary/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground">智商税剥离进度</span>
                  <span className="font-mono text-xs font-semibold text-accent">{savePercent}% 已识别</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${savePercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Per-item Breakdown ─── */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">逐项价格透视</span>
              <span className="text-[10px] text-muted-foreground font-mono ml-auto">{items.length} ITEMS</span>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const breakdown = priceBreakdowns[item.category];
                const isExpanded = expandedItem === item.category;
                const brandTax = breakdown ? breakdown.brand + breakdown.channel : 0;
                const c2mPrice = item.price - brandTax;

                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.06 }}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : item.category)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.category}</span>
                          <span className="text-xs text-muted-foreground">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-xs text-muted-foreground line-through">¥{item.price.toLocaleString()}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                          <span className="font-mono text-xs font-semibold text-accent">¥{c2mPrice.toLocaleString()}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-mono">-{Math.round((brandTax / item.price) * 100)}%</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && breakdown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-1 border-t border-border/50">
                            {/* Stacked bar */}
                            <div className="flex h-3 rounded-full overflow-hidden mb-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(breakdown.factory / item.price) * 100}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-primary/70"
                                title="出厂成本"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(breakdown.material / item.price) * 100}%` }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="bg-primary/50"
                                title="材料成本"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(breakdown.labor / item.price) * 100}%` }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-primary/30"
                                title="人工成本"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(breakdown.brand / item.price) * 100}%` }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                                className="bg-destructive/50"
                                title="品牌溢价"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(breakdown.channel / item.price) * 100}%` }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-destructive/30"
                                title="渠道费用"
                              />
                            </div>

                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
                              {[
                                { label: "出厂成本", value: breakdown.factory, color: "bg-primary/70" },
                                { label: "材料成本", value: breakdown.material, color: "bg-primary/50" },
                                { label: "人工成本", value: breakdown.labor, color: "bg-primary/30" },
                                { label: "品牌溢价", value: breakdown.brand, color: "bg-destructive/50", warn: true },
                                { label: "渠道费用", value: breakdown.channel, color: "bg-destructive/30", warn: true },
                              ].map((row) => (
                                <div key={row.label} className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-sm ${row.color} flex-shrink-0`} />
                                  <span className={`text-[11px] ${row.warn ? "text-destructive" : "text-muted-foreground"}`}>{row.label}</span>
                                  <span className={`font-mono text-[11px] ml-auto ${row.warn ? "text-destructive font-semibold" : "text-foreground"}`}>
                                    ¥{row.value.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Source */}
                            <div className="mt-2.5 pt-2 border-t border-border/30 flex items-center gap-1.5">
                              <Factory className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">{item.brand} · 佛山同源代工厂直供</span>
                              <Shield className="w-3 h-3 text-accent ml-auto" />
                              <span className="text-[10px] text-accent">品质验证</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ─── Optimization Recommendations ─── */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="px-4 pb-4">
            <button
              onClick={() => setShowSaveDetail(!showSaveDetail)}
              className="w-full flex items-center justify-between mb-3"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-foreground">省钱方案</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-accent font-semibold">
                  最多省 ¥{sol.costOptimization.canSave.reduce((s, i) => s + i.savings, 0).toLocaleString()}
                </span>
                {showSaveDetail ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>
            </button>

            <AnimatePresence>
              {showSaveDetail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2"
                >
                  {sol.costOptimization.canSave.map((s, i) => (
                    <div key={i} className="rounded-xl border border-accent/20 bg-accent/[0.03] p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <TrendingDown className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs font-medium text-foreground">{s.item}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-accent">-¥{s.savings.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{s.tradeoff}</p>
                    </div>
                  ))}

                  <div className="h-px bg-border my-2" />

                  {sol.costOptimization.canUpgrade.map((u, i) => (
                    <div key={i} className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium text-foreground">{u.item}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary">+¥{u.cost.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{u.benefit}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── AI Summary ─── */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} className="px-4 pb-6">
            <div className="rounded-xl bg-secondary/40 border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">AI 报价建议</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{sol.costOptimization.recommendation}</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "极简版", price: `¥${(total - 1800).toLocaleString()}`, desc: "满足基本需求" },
                  { label: "推荐版", price: `¥${total.toLocaleString()}`, desc: "最佳性价比", active: true },
                  { label: "品质版", price: `¥${(total + 3500).toLocaleString()}`, desc: "全面升级体验" },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className={`rounded-lg p-2.5 text-center border transition-colors ${
                      tier.active
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card hover:bg-secondary/30"
                    }`}
                  >
                    <p className="text-[10px] text-muted-foreground">{tier.label}</p>
                    <p className={`font-mono text-sm font-bold ${tier.active ? "text-primary" : "text-foreground"}`}>{tier.price}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{tier.desc}</p>
                    {tier.active && <CheckCircle2 className="w-3 h-3 text-primary mx-auto mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── Trust Signals ─── */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }} className="px-4 pb-8">
            <div className="flex items-center gap-4 justify-center">
              {[
                { icon: Shield, text: "品质保障" },
                { icon: Factory, text: "工厂直供" },
                { icon: CircleDollarSign, text: "价格透明" },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-1">
                  <t.icon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{t.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Bottom CTA ─── */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] text-muted-foreground">C2M 底价</span>
                <span className="font-mono text-lg font-bold text-accent">¥{c2mTotal.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                比品牌店省 <span className="text-accent font-semibold">¥{totalBrandTax.toLocaleString()}</span>
              </p>
            </div>
            <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
              按此方案报价
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BudgetAgent;
