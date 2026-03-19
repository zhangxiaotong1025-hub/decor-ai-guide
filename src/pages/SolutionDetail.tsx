import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { mockDesignSolution } from "@/data/mockDesignSolution";

const SolutionDetail = () => {
  const navigate = useNavigate();
  const solution = mockDesignSolution;
  const [activeImage, setActiveImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["concept"]));

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isOpen = (key: string) => expandedSections.has(key);

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold">方案A：{solution.name}</h1>
          <span className="text-[10px] text-muted-foreground">专家设计方案详情</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-button font-mono">
          AI 推荐
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image gallery */}
        <div className="relative">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={solution.renderImages[activeImage]}
            alt="效果图"
            className="w-full h-56 object-cover"
          />
          {/* Annotations */}
          {solution.annotations.map((ann, i) => (
            <div
              key={i}
              className="absolute group cursor-pointer"
              style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}
            >
              <div className="w-5 h-5 rounded-full bg-primary/80 border-2 border-primary-foreground shadow-elevated flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10">
                <div className="bg-foreground text-background text-[10px] px-2.5 py-1.5 rounded-inner shadow-float min-w-[120px]">
                  <div className="font-semibold mb-0.5">{ann.label}</div>
                  <div className="text-background/70">{ann.description}</div>
                </div>
              </div>
            </div>
          ))}
          {/* Image tabs */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {["正面视角", "侧面视角", "俯视布局"].map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveImage(i)}
                className={`text-[10px] px-2.5 py-1 rounded-button backdrop-blur-sm transition-colors ${
                  i === activeImage
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/30 text-primary-foreground hover:bg-foreground/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {/* Section 1: Design concept */}
          <CollapsibleSection
            icon="🎨"
            label="CONCEPT"
            title="设计理念"
            isOpen={isOpen("concept")}
            onToggle={() => toggleSection("concept")}
          >
            <p className="text-xs leading-pretty text-muted-foreground">
              {solution.designThinking.concept}
            </p>
          </CollapsibleSection>

          {/* Section 2: Space understanding */}
          <CollapsibleSection
            icon="🏠"
            label="SPACE"
            title="空间理解"
            isOpen={isOpen("space")}
            onToggle={() => toggleSection("space")}
          >
            <p className="text-xs leading-pretty text-muted-foreground mb-3">
              {solution.spaceUnderstanding.analysis}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-accent font-semibold block mb-1">✅ 机会点</span>
                {solution.spaceUnderstanding.opportunities.map((o) => (
                  <p key={o} className="text-[11px] text-muted-foreground mb-1">• {o}</p>
                ))}
              </div>
              <div>
                <span className="text-[10px] text-destructive font-semibold block mb-1">⚠️ 挑战</span>
                {solution.spaceUnderstanding.challenges.map((c) => (
                  <p key={c} className="text-[11px] text-muted-foreground mb-1">• {c}</p>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Section 3: Layout design */}
          <CollapsibleSection
            icon="📐"
            label="LAYOUT"
            title="布局构思"
            isOpen={isOpen("layout")}
            onToggle={() => toggleSection("layout")}
          >
            <div className="space-y-3">
              <SubSection title="黄金比例布局" content={solution.designThinking.layout.principle} />
              <SubSection title="三条动线设计" content={solution.designThinking.layout.circulation} />
              <SubSection title="功能分区" content={solution.designThinking.layout.zoning} />
            </div>
          </CollapsibleSection>

          {/* Section 4: Atmosphere */}
          <CollapsibleSection
            icon="✨"
            label="ATMOSPHERE"
            title="氛围营造"
            isOpen={isOpen("atmosphere")}
            onToggle={() => toggleSection("atmosphere")}
          >
            <div className="space-y-3">
              <SubSection title="💡 灯光设计" content={solution.designThinking.atmosphere.lighting} />
              <SubSection title="🎨 色彩心理" content={solution.designThinking.atmosphere.color} />
              <SubSection title="🧶 材质质感" content={solution.designThinking.atmosphere.texture} />
            </div>
            {/* Color palette */}
            <div className="flex gap-2 mt-3">
              {[
                { color: "#D4C5A9", label: "浅木色 40%" },
                { color: "#E8E8E8", label: "灰白色 40%" },
                { color: "#7FB285", label: "绿色 20%" },
              ].map((c) => (
                <div key={c.color} className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-button shadow-layered"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-[10px] text-muted-foreground">{c.label}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Section 5: Life scenarios */}
          <CollapsibleSection
            icon="🎬"
            label="SCENARIOS"
            title="生活场景"
            isOpen={isOpen("scenarios")}
            onToggle={() => toggleSection("scenarios")}
          >
            <div className="space-y-2.5">
              {solution.lifeScenarios.map((s) => (
                <div key={s.name} className="bg-secondary/50 rounded-inner p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{s.name}</span>
                    <span className="text-[10px] text-muted-foreground">{s.description}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground whitespace-pre-line leading-relaxed">
                    {s.design}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Section 6: Product selection */}
          <CollapsibleSection
            icon="🛋️"
            label="PRODUCTS"
            title="选品逻辑"
            isOpen={isOpen("products")}
            onToggle={() => toggleSection("products")}
          >
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
              {solution.productSelection.principle}
            </p>
            <div className="space-y-2.5">
              {solution.productSelection.items.map((item) => (
                <ProductItem key={item.category} item={item} />
              ))}
            </div>
          </CollapsibleSection>

          {/* Section 7: Cost optimization */}
          <CollapsibleSection
            icon="💰"
            label="COST"
            title="价格与建议"
            isOpen={isOpen("cost")}
            onToggle={() => toggleSection("cost")}
          >
            {/* Current price */}
            <div className="text-center py-3 mb-3 bg-secondary/50 rounded-inner">
              <span className="text-[10px] text-muted-foreground block">当前方案总价</span>
              <span className="font-mono-data text-xl font-semibold text-primary">
                ¥{solution.costOptimization.current.toLocaleString()}
              </span>
            </div>

            {/* Can save */}
            <div className="mb-3">
              <span className="text-[10px] text-accent font-semibold block mb-1.5">📉 可节省方案</span>
              {solution.costOptimization.canSave.map((s) => (
                <div key={s.item} className="bg-secondary/30 rounded-inner p-2.5 mb-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium">{s.item}</span>
                    <span className="text-[10px] text-accent font-mono">省 ¥{s.savings.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{s.tradeoff}</p>
                </div>
              ))}
            </div>

            {/* Can upgrade */}
            <div className="mb-3">
              <span className="text-[10px] text-primary font-semibold block mb-1.5">📈 可升级方案</span>
              {solution.costOptimization.canUpgrade.map((u) => (
                <div key={u.item} className="bg-secondary/30 rounded-inner p-2.5 mb-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium">{u.item}</span>
                    <span className="text-[10px] text-primary font-mono">+¥{u.cost.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{u.benefit}</p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="bg-primary/5 border border-primary/20 rounded-inner p-3">
              <span className="text-[10px] text-primary font-semibold block mb-1">💡 专业建议</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {solution.costOptimization.recommendation}
              </p>
            </div>
          </CollapsibleSection>

          {/* Product list summary */}
          <CollapsibleSection
            icon="📦"
            label="ITEMS"
            title={`商品清单（${solution.productSelection.items.length} 件）`}
            isOpen={isOpen("items")}
            onToggle={() => toggleSection("items")}
          >
            <div className="space-y-1.5">
              {solution.productSelection.items.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{item.category.slice(0, 2)}</span>
                    <div>
                      <span className="text-[11px] font-medium block">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground">{item.brand} · {item.brief}</span>
                    </div>
                  </div>
                  <span className="font-mono-data text-xs font-semibold text-primary">
                    ¥{item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs font-semibold">总计</span>
              <span className="font-mono-data text-sm font-semibold text-primary">
                ¥{solution.productSelection.items.reduce((s, i) => s + i.price, 0).toLocaleString()}
              </span>
            </div>
          </CollapsibleSection>
        </div>

        {/* Bottom spacer */}
        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-card px-4 py-3 flex gap-2">
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-button"
        >
          选择此方案
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-2.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-button"
        >
          进入修改对话
        </button>
      </div>
    </div>
  );
};

/* Collapsible section wrapper */
const CollapsibleSection = ({
  icon,
  label,
  title,
  isOpen,
  onToggle,
  children,
}: {
  icon: string;
  label: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-card shadow-layered rounded-outer overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-4 py-3 text-left"
    >
      <span className="text-sm">{icon}</span>
      <span className="text-label text-muted-foreground font-mono">{label}</span>
      <span className="text-xs font-semibold flex-1">{title}</span>
      {isOpen ? (
        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      )}
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
          <div className="px-4 pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* Sub section */
const SubSection = ({ title, content }: { title: string; content: string }) => (
  <div>
    <span className="text-[11px] font-semibold block mb-1">{title}</span>
    <p className="text-[11px] text-muted-foreground leading-pretty">{content}</p>
  </div>
);

/* Product item with expandable "why" */
const ProductItem = ({
  item,
}: {
  item: {
    category: string;
    name: string;
    price: number;
    why: string;
    material: string;
    color: string;
    performance: string;
    style: string;
  };
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-secondary/30 rounded-inner p-3">
      <div className="flex items-start justify-between mb-1.5">
        <span className="text-xs font-semibold">{item.category}</span>
        <span className="font-mono-data text-xs font-semibold text-primary">
          ¥{item.price.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {[item.material, item.color, item.performance, item.style].map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-secondary rounded-button text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[10px] text-primary font-medium"
      >
        {expanded ? "收起" : "为什么选这个？ >"}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] text-muted-foreground leading-pretty mt-1.5 overflow-hidden"
          >
            {item.why}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionDetail;
