import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import type { DesignSolution } from "@/types/chat";

interface SolutionSheetProps {
  solution: DesignSolution;
  isOpen: boolean;
  onClose: () => void;
  onModify: () => void;
}

const TABS = [
  { key: "visual", icon: "🖼️", label: "效果" },
  { key: "space", icon: "📐", label: "空间" },
  { key: "atmosphere", icon: "✨", label: "氛围" },
  { key: "scenarios", icon: "🎬", label: "场景" },
  { key: "products", icon: "🛋️", label: "选品" },
  { key: "cost", icon: "💰", label: "预算" },
];

const SolutionSheet = ({ solution, isOpen, onClose, onModify }: SolutionSheetProps) => {
  const [activeTab, setActiveTab] = useState("visual");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = useCallback((key: string) => {
    setActiveTab(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Scroll spy
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const top = container.scrollTop + 60;
      for (const tab of [...TABS].reverse()) {
        const el = sectionRefs.current[tab.key];
        if (el && el.offsetTop <= top) {
          setActiveTab(tab.key);
          break;
        }
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const handleModify = () => {
    setIsFullScreen(false);
    onModify();
  };

  const setSectionRef = useCallback((key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isFullScreen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-40"
              onClick={() => setIsFullScreen(false)}
            />
          )}

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`fixed left-0 right-0 z-50 bg-background rounded-t-[16px] shadow-float flex flex-col ${
              isFullScreen ? "top-[env(safe-area-inset-top,0px)] bottom-[56px]" : "bottom-[56px]"
            }`}
            style={{ maxHeight: isFullScreen ? undefined : "60dvh" }}
          >
            {/* Header */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 bg-muted-foreground/20 rounded-full" />
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs font-semibold truncate">方案A：{solution.name}</h2>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 bg-accent/10 text-accent rounded-button font-mono">AI 推荐</span>
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 hover:bg-secondary rounded-button transition-colors">
                  {isFullScreen ? <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" /> : <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-button transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Sticky Tabs */}
              <div className="flex gap-0.5 px-3 pb-2 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => scrollToSection(tab.key)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
              {/* === VISUAL === */}
              <div ref={setSectionRef("visual")} className="px-3 pt-2 pb-4">
                <div className="relative rounded-outer overflow-hidden">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={solution.renderImages[activeImage]}
                    alt="效果图"
                    className={`w-full object-cover ${isFullScreen ? "h-56" : "h-44"}`}
                  />
                  {/* Annotations */}
                  {solution.annotations.map((ann, i) => (
                    <div key={i} className="absolute group cursor-pointer" style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}>
                      <div className="w-5 h-5 rounded-full bg-primary/80 border-2 border-primary-foreground shadow-elevated flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10">
                        <div className="bg-foreground text-background text-[10px] px-2.5 py-1.5 rounded-inner whitespace-nowrap shadow-float">
                          <div className="font-semibold">{ann.label}</div>
                          <div className="text-background/70 text-[9px]">{ann.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Image switcher */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {["正面", "侧面", "俯视"].map((label, i) => (
                      <button
                        key={label}
                        onClick={() => setActiveImage(i)}
                        className={`text-[10px] px-3 py-1 rounded-full backdrop-blur-md transition-colors ${
                          i === activeImage ? "bg-primary text-primary-foreground" : "bg-foreground/30 text-primary-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Concept banner */}
                <div className="mt-3 p-3 rounded-outer bg-secondary/60">
                  <p className="text-[11px] font-semibold text-foreground mb-1">🎨 {solution.concept}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{solution.designThinking.concept}</p>
                </div>
              </div>

              {/* === SPACE === */}
              <div ref={setSectionRef("space")} className="px-3 pb-4">
                <SectionTitle icon="📐" title="空间分析" />
                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <MetricCard value="25㎡" label="总面积" color="primary" />
                  <MetricCard value="18㎡" label="可用面积" color="accent" />
                  <MetricCard value="2.8m" label="层高" color="primary" />
                </div>
                {/* Ratio bar */}
                <div className="mb-3">
                  <p className="text-[9px] text-muted-foreground mb-1.5 font-medium">空间布局比例</p>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div className="bg-primary/80 flex items-center justify-center" style={{ width: "60%" }}>
                      <span className="text-[8px] text-primary-foreground font-semibold">沙发区 60%</span>
                    </div>
                    <div className="bg-accent/70 flex items-center justify-center" style={{ width: "30%" }}>
                      <span className="text-[8px] text-accent-foreground font-semibold">电视区 30%</span>
                    </div>
                    <div className="bg-muted-foreground/30 flex items-center justify-center" style={{ width: "10%" }}>
                      <span className="text-[7px] text-foreground">10%</span>
                    </div>
                  </div>
                </div>
                {/* Opportunities & Challenges */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-accent/5 border border-accent/20 rounded-inner p-2.5">
                    <p className="text-[9px] font-semibold text-accent mb-1.5">✅ 机会</p>
                    {solution.spaceUnderstanding.opportunities.map((o, i) => (
                      <div key={i} className="flex items-start gap-1 mb-1">
                        <span className="text-accent text-[8px] mt-0.5">●</span>
                        <span className="text-[9px] text-muted-foreground leading-snug">{o}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-destructive/5 border border-destructive/20 rounded-inner p-2.5">
                    <p className="text-[9px] font-semibold text-destructive mb-1.5">⚠️ 挑战</p>
                    {solution.spaceUnderstanding.challenges.map((c, i) => (
                      <div key={i} className="flex items-start gap-1 mb-1">
                        <span className="text-destructive text-[8px] mt-0.5">●</span>
                        <span className="text-[9px] text-muted-foreground leading-snug">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Circulation visual */}
                <div className="mt-3 flex gap-2">
                  {[
                    { width: "1.2m", label: "主动线", desc: "入户→阳台" },
                    { width: "0.8m", label: "次动线", desc: "沙发→厨房" },
                    { width: "∞", label: "视线动线", desc: "无遮挡" },
                  ].map((line, i) => (
                    <div key={i} className="flex-1 bg-secondary rounded-inner p-2 text-center">
                      <span className="font-mono-data text-sm font-bold text-primary block">{line.width}</span>
                      <span className="text-[9px] font-semibold text-foreground block">{line.label}</span>
                      <span className="text-[8px] text-muted-foreground">{line.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* === ATMOSPHERE === */}
              <div ref={setSectionRef("atmosphere")} className="px-3 pb-4">
                <SectionTitle icon="✨" title="氛围设计" />
                {/* Color palette */}
                <div className="mb-3">
                  <p className="text-[9px] text-muted-foreground mb-2 font-medium">色彩方案</p>
                  <div className="flex gap-2">
                    {[
                      { bg: "36 30% 78%", label: "浅木色", pct: "40%" },
                      { bg: "0 0% 91%", label: "灰白色", pct: "40%" },
                      { bg: "140 40% 55%", label: "点缀绿", pct: "20%" },
                    ].map((c, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div
                          className="w-full aspect-square rounded-outer shadow-layered mb-1.5"
                          style={{ backgroundColor: `hsl(${c.bg})` }}
                        />
                        <span className="text-[9px] font-medium text-foreground block">{c.label}</span>
                        <span className="text-[8px] text-muted-foreground">{c.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Materials */}
                <div className="mb-3">
                  <p className="text-[9px] text-muted-foreground mb-2 font-medium">材质搭配</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { emoji: "🪵", name: "木质", feel: "温暖" },
                      { emoji: "🧶", name: "布艺", feel: "柔软" },
                      { emoji: "⚙️", name: "金属", feel: "精致" },
                      { emoji: "🌿", name: "绿植", feel: "生机" },
                    ].map((m, i) => (
                      <div key={i} className="flex-shrink-0 w-16 bg-secondary rounded-inner p-2 text-center">
                        <span className="text-lg block mb-0.5">{m.emoji}</span>
                        <span className="text-[9px] font-semibold text-foreground block">{m.name}</span>
                        <span className="text-[8px] text-muted-foreground">{m.feel}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Lighting scenes */}
                <div>
                  <p className="text-[9px] text-muted-foreground mb-2 font-medium">灯光场景</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: "☀️", name: "日间明亮", temp: "4000K", desc: "主灯50%+自然光" },
                      { icon: "🎬", name: "观影氛围", temp: "3000K", desc: "落地灯30%" },
                      { icon: "📖", name: "阅读护眼", temp: "4000K", desc: "主灯100%" },
                      { icon: "🌙", name: "夜间休闲", temp: "3000K", desc: "主灯30%+落地灯50%" },
                    ].map((s, i) => (
                      <div key={i} className="bg-secondary/60 rounded-inner p-2.5 flex items-center gap-2">
                        <span className="text-lg">{s.icon}</span>
                        <div>
                          <span className="text-[10px] font-semibold text-foreground block">{s.name}</span>
                          <span className="text-[8px] text-muted-foreground">{s.temp} · {s.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* === SCENARIOS === */}
              <div ref={setSectionRef("scenarios")} className="px-3 pb-4">
                <SectionTitle icon="🎬" title="生活场景" />
                <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory">
                  {solution.lifeScenarios.map((s, i) => (
                    <div key={i} className="flex-shrink-0 w-[70%] snap-center bg-card shadow-layered rounded-outer p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{s.name.split(" ")[0]}</span>
                        <div>
                          <span className="text-[11px] font-semibold text-foreground block">{s.name.split(" ").slice(1).join(" ")}</span>
                          <span className="text-[9px] text-muted-foreground">{s.description}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {s.design.split("\n").filter(Boolean).map((line, j) => (
                          <p key={j} className="text-[9px] text-muted-foreground leading-snug">{line.trim()}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* === PRODUCTS === */}
              <div ref={setSectionRef("products")} className="px-3 pb-4">
                <SectionTitle icon="🛋️" title="选品方案" subtitle={`${solution.productSelection.items.length}件`} />
                <div className="space-y-2">
                  {solution.productSelection.items.map((item, i) => (
                    <ProductVisualCard key={i} item={item} />
                  ))}
                </div>
              </div>

              {/* === COST === */}
              <div ref={setSectionRef("cost")} className="px-3 pb-4">
                <SectionTitle icon="💰" title="预算分析" />
                {/* Total */}
                <div className="bg-primary/5 border border-primary/20 rounded-outer p-3 mb-3 text-center">
                  <span className="text-[9px] text-muted-foreground block mb-0.5">方案总价</span>
                  <span className="font-mono-data text-2xl font-bold text-primary">¥{solution.costOptimization.current.toLocaleString()}</span>
                </div>
                {/* Budget breakdown bar */}
                <div className="mb-3">
                  <p className="text-[9px] text-muted-foreground mb-1.5 font-medium">费用构成</p>
                  <div className="flex h-5 rounded-full overflow-hidden mb-1.5">
                    {solution.productSelection.items.map((item, i) => {
                      const pct = (item.price / solution.costOptimization.current) * 100;
                      const colors = ["bg-primary/80", "bg-accent/70", "bg-primary/50", "bg-accent/40", "bg-muted-foreground/30"];
                      return (
                        <div key={i} className={`${colors[i % colors.length]} flex items-center justify-center`} style={{ width: `${pct}%` }}>
                          {pct > 12 && <span className="text-[7px] text-primary-foreground font-medium truncate px-0.5">{Math.round(pct)}%</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {solution.productSelection.items.map((item, i) => {
                      const colors = ["text-primary", "text-accent", "text-primary/70", "text-accent/70", "text-muted-foreground"];
                      return (
                        <span key={i} className={`text-[8px] ${colors[i % colors.length]} font-medium`}>
                          ● {item.category.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, "")} ¥{item.price.toLocaleString()}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {/* Save & Upgrade cards */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-accent/5 border border-accent/20 rounded-inner p-2.5">
                    <p className="text-[9px] font-semibold text-accent mb-1">📉 可节省</p>
                    {solution.costOptimization.canSave.map((s, i) => (
                      <div key={i} className="mb-1.5 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-medium text-foreground">{s.item}</span>
                          <span className="font-mono-data text-[9px] text-accent font-semibold">-¥{s.savings.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-inner p-2.5">
                    <p className="text-[9px] font-semibold text-primary mb-1">📈 可升级</p>
                    {solution.costOptimization.canUpgrade.map((u, i) => (
                      <div key={i} className="mb-1.5 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-medium text-foreground">{u.item}</span>
                          <span className="font-mono-data text-[9px] text-primary font-semibold">+¥{u.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Recommendation */}
                <div className="bg-secondary rounded-inner p-3">
                  <p className="text-[9px] font-semibold text-foreground mb-1">💡 专业建议</p>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">{solution.costOptimization.recommendation}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="px-3 pb-6">
                <div className="flex gap-2">
                  <button onClick={onClose} className="flex-1 py-2.5 bg-primary text-primary-foreground text-[11px] font-semibold rounded-button">
                    选择此方案
                  </button>
                  <button onClick={handleModify} className="flex-1 py-2.5 bg-secondary text-secondary-foreground text-[11px] font-semibold rounded-button">
                    对话修改
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

/* ─── Sub-components ─── */

const SectionTitle = ({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) => (
  <div className="flex items-center gap-1.5 mb-2.5">
    <span className="text-sm">{icon}</span>
    <span className="text-[11px] font-semibold text-foreground">{title}</span>
    {subtitle && <span className="text-[9px] text-muted-foreground ml-auto">({subtitle})</span>}
  </div>
);

const MetricCard = ({ value, label, color }: { value: string; label: string; color: string }) => (
  <div className={`bg-${color}/5 border border-${color}/20 rounded-inner p-2 text-center`}>
    <span className={`font-mono-data text-base font-bold text-${color} block`}>{value}</span>
    <span className="text-[8px] text-muted-foreground">{label}</span>
  </div>
);

const ProductVisualCard = ({ item }: { item: { category: string; name: string; brand: string; price: number; brief: string; why: string; material: string; color: string; performance: string; style: string } }) => {
  const [showWhy, setShowWhy] = useState(false);
  return (
    <div className="bg-card shadow-layered rounded-outer p-3">
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{item.category.split(" ")[0]}</span>
          <div>
            <span className="text-[11px] font-semibold text-foreground">{item.name}</span>
            <span className="text-[9px] text-muted-foreground block">{item.brand} · {item.brief}</span>
          </div>
        </div>
        <span className="font-mono-data text-[12px] font-bold text-primary">¥{item.price.toLocaleString()}</span>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {[item.material, item.color, item.performance, item.style].map((tag) => (
          <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-secondary rounded-full text-muted-foreground">{tag}</span>
        ))}
      </div>
      <button onClick={() => setShowWhy(!showWhy)} className="text-[9px] text-primary font-medium">
        {showWhy ? "收起" : "为什么选这个？ →"}
      </button>
      <AnimatePresence>
        {showWhy && (
          <motion.p
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="text-[9px] text-muted-foreground leading-relaxed mt-1.5 overflow-hidden"
          >
            {item.why}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionSheet;
