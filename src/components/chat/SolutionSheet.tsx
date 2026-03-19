import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X, Maximize2, Minimize2 } from "lucide-react";
import type { DesignSolution } from "@/types/chat";

interface SolutionSheetProps {
  solution: DesignSolution;
  isOpen: boolean;
  onClose: () => void;
  onModify: () => void;
}

const SolutionSheet = ({ solution, isOpen, onClose, onModify }: SolutionSheetProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["concept"]));
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isExpanded = (key: string) => expandedSections.has(key);

  const handleModify = () => {
    setIsFullScreen(false);
    onModify();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only in fullscreen */}
          {isFullScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-40"
              onClick={() => setIsFullScreen(false)}
            />
          )}

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`fixed left-0 right-0 z-50 bg-background rounded-t-[16px] shadow-float flex flex-col ${
              isFullScreen ? "top-[env(safe-area-inset-top,0px)] bottom-[56px]" : "bottom-[56px]"
            }`}
            style={{
              maxHeight: isFullScreen ? undefined : "55dvh",
            }}
          >
            {/* Drag handle + header */}
            <div className="flex-shrink-0">
              {/* Drag indicator */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-muted-foreground/20 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <span className="text-sm">🎨</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs font-semibold truncate">方案A：{solution.name}</h2>
                  <span className="text-[10px] text-muted-foreground">专家设计方案</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-button font-mono">
                  AI 推荐
                </span>
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 hover:bg-secondary rounded-button transition-colors"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-secondary rounded-button transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Image gallery */}
              <div className="relative">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={solution.renderImages[activeImage]}
                  alt="效果图"
                  className={`w-full object-cover ${isFullScreen ? "h-52" : "h-36"}`}
                />
                {/* Annotations */}
                {solution.annotations.map((ann, i) => (
                  <div
                    key={i}
                    className="absolute group cursor-pointer"
                    style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}
                  >
                    <div className="w-4 h-4 rounded-full bg-primary/80 border-2 border-primary-foreground shadow-elevated flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                      <div className="bg-foreground text-background text-[10px] px-2 py-1 rounded-button whitespace-nowrap shadow-float">
                        <div className="font-semibold">{ann.label}</div>
                        <div className="text-background/70 text-[9px]">{ann.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Image tabs */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {["正面", "侧面", "俯视"].map((label, i) => (
                    <button
                      key={label}
                      onClick={() => setActiveImage(i)}
                      className={`text-[9px] px-2 py-0.5 rounded-button backdrop-blur-sm transition-colors ${
                        i === activeImage
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/30 text-primary-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="px-3 py-3 space-y-2">
                {/* Concept */}
                <Section
                  icon="🎨" label="CONCEPT" title="设计理念"
                  isOpen={isExpanded("concept")} onToggle={() => toggleSection("concept")}
                >
                  <p className="text-[11px] leading-pretty text-muted-foreground">
                    {solution.designThinking.concept}
                  </p>
                </Section>

                {/* Space */}
                <Section
                  icon="🏠" label="SPACE" title="空间理解"
                  isOpen={isExpanded("space")} onToggle={() => toggleSection("space")}
                >
                  <p className="text-[11px] leading-pretty text-muted-foreground mb-2">
                    {solution.spaceUnderstanding.analysis}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] text-accent font-semibold block mb-1">✅ 机会点</span>
                      {solution.spaceUnderstanding.opportunities.map((o) => (
                        <p key={o} className="text-[10px] text-muted-foreground mb-0.5">• {o}</p>
                      ))}
                    </div>
                    <div>
                      <span className="text-[9px] text-destructive font-semibold block mb-1">⚠️ 挑战</span>
                      {solution.spaceUnderstanding.challenges.map((c) => (
                        <p key={c} className="text-[10px] text-muted-foreground mb-0.5">• {c}</p>
                      ))}
                    </div>
                  </div>
                </Section>

                {/* Layout */}
                <Section
                  icon="📐" label="LAYOUT" title="布局构思"
                  isOpen={isExpanded("layout")} onToggle={() => toggleSection("layout")}
                >
                  <div className="space-y-2">
                    <Sub title="黄金比例布局" text={solution.designThinking.layout.principle} />
                    <Sub title="三条动线设计" text={solution.designThinking.layout.circulation} />
                    <Sub title="功能分区" text={solution.designThinking.layout.zoning} />
                  </div>
                </Section>

                {/* Atmosphere */}
                <Section
                  icon="✨" label="ATMOSPHERE" title="氛围营造"
                  isOpen={isExpanded("atmosphere")} onToggle={() => toggleSection("atmosphere")}
                >
                  <div className="space-y-2">
                    <Sub title="💡 灯光设计" text={solution.designThinking.atmosphere.lighting} />
                    <Sub title="🎨 色彩心理" text={solution.designThinking.atmosphere.color} />
                    <Sub title="🧶 材质质感" text={solution.designThinking.atmosphere.texture} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[
                      { bg: "#D4C5A9", t: "浅木色" },
                      { bg: "#E8E8E8", t: "灰白色" },
                      { bg: "#7FB285", t: "绿色" },
                    ].map((c) => (
                      <div key={c.bg} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm shadow-layered" style={{ backgroundColor: c.bg }} />
                        <span className="text-[9px] text-muted-foreground">{c.t}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Scenarios */}
                <Section
                  icon="🎬" label="SCENARIOS" title="生活场景"
                  isOpen={isExpanded("scenarios")} onToggle={() => toggleSection("scenarios")}
                >
                  <div className="space-y-1.5">
                    {solution.lifeScenarios.map((s) => (
                      <div key={s.name} className="bg-secondary/50 rounded-inner p-2.5">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold">{s.name}</span>
                          <span className="text-[9px] text-muted-foreground">{s.description}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground whitespace-pre-line leading-relaxed">
                          {s.design}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Products */}
                <Section
                  icon="🛋️" label="PRODUCTS" title="选品逻辑"
                  isOpen={isExpanded("products")} onToggle={() => toggleSection("products")}
                >
                  <p className="text-[10px] text-muted-foreground mb-2">{solution.productSelection.principle}</p>
                  <div className="space-y-2">
                    {solution.productSelection.items.map((item) => (
                      <ProductItem key={item.category} item={item} />
                    ))}
                  </div>
                </Section>

                {/* Cost */}
                <Section
                  icon="💰" label="COST" title="价格与建议"
                  isOpen={isExpanded("cost")} onToggle={() => toggleSection("cost")}
                >
                  <div className="text-center py-2 mb-2 bg-secondary/50 rounded-inner">
                    <span className="text-[9px] text-muted-foreground block">当前方案总价</span>
                    <span className="font-mono-data text-lg font-semibold text-primary">
                      ¥{solution.costOptimization.current.toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-[9px] text-accent font-semibold block mb-1">📉 可节省</span>
                    {solution.costOptimization.canSave.map((s) => (
                      <div key={s.item} className="bg-secondary/30 rounded-inner p-2 mb-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-medium">{s.item}</span>
                          <span className="text-[9px] text-accent font-mono">省 ¥{s.savings.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">{s.tradeoff}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mb-2">
                    <span className="text-[9px] text-primary font-semibold block mb-1">📈 可升级</span>
                    {solution.costOptimization.canUpgrade.map((u) => (
                      <div key={u.item} className="bg-secondary/30 rounded-inner p-2 mb-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-medium">{u.item}</span>
                          <span className="text-[9px] text-primary font-mono">+¥{u.cost.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-relaxed">{u.benefit}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-inner p-2.5">
                    <span className="text-[9px] text-primary font-semibold block mb-0.5">💡 专业建议</span>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {solution.costOptimization.recommendation}
                    </p>
                  </div>
                </Section>

                {/* Product list */}
                <Section
                  icon="📦" label="ITEMS" title={`商品清单（${solution.productSelection.items.length} 件）`}
                  isOpen={isExpanded("items")} onToggle={() => toggleSection("items")}
                >
                  <div className="space-y-1">
                    {solution.productSelection.items.map((item) => (
                      <div key={item.category} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px]">{item.category.slice(0, 2)}</span>
                          <div>
                            <span className="text-[10px] font-medium block">{item.name}</span>
                            <span className="text-[9px] text-muted-foreground">{item.brand} · {item.brief}</span>
                          </div>
                        </div>
                        <span className="font-mono-data text-[11px] font-semibold text-primary">
                          ¥{item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] font-semibold">总计</span>
                    <span className="font-mono-data text-xs font-semibold text-primary">
                      ¥{solution.productSelection.items.reduce((s, i) => s + i.price, 0).toLocaleString()}
                    </span>
                  </div>
                </Section>

                {/* CTA buttons */}
                <div className="flex gap-2 pt-2 pb-4">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 bg-primary text-primary-foreground text-[11px] font-medium rounded-button"
                  >
                    选择此方案
                  </button>
                  <button
                    onClick={handleModify}
                    className="flex-1 py-2 bg-secondary text-secondary-foreground text-[11px] font-medium rounded-button"
                  >
                    对话修改方案
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* Collapsible section */
const Section = ({
  icon, label, title, isOpen, onToggle, children,
}: {
  icon: string; label: string; title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) => (
  <div className="bg-card shadow-layered rounded-outer overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center gap-1.5 px-3 py-2.5 text-left">
      <span className="text-xs">{icon}</span>
      <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground font-mono">{label}</span>
      <span className="text-[11px] font-semibold flex-1">{title}</span>
      {isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-3 pb-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Sub = ({ title, text }: { title: string; text: string }) => (
  <div>
    <span className="text-[10px] font-semibold block mb-0.5">{title}</span>
    <p className="text-[10px] text-muted-foreground leading-pretty">{text}</p>
  </div>
);

const ProductItem = ({ item }: { item: { category: string; name: string; price: number; why: string; material: string; color: string; performance: string; style: string } }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-secondary/30 rounded-inner p-2.5">
      <div className="flex items-start justify-between mb-1">
        <span className="text-[11px] font-semibold">{item.category}</span>
        <span className="font-mono-data text-[11px] font-semibold text-primary">¥{item.price.toLocaleString()}</span>
      </div>
      <div className="flex flex-wrap gap-0.5 mb-1.5">
        {[item.material, item.color, item.performance, item.style].map((tag) => (
          <span key={tag} className="text-[8px] px-1 py-0.5 bg-secondary rounded-button text-muted-foreground">{tag}</span>
        ))}
      </div>
      <button onClick={() => setExpanded(!expanded)} className="text-[9px] text-primary font-medium">
        {expanded ? "收起" : "为什么选这个？ >"}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[9px] text-muted-foreground leading-pretty mt-1 overflow-hidden"
          >
            {item.why}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionSheet;
