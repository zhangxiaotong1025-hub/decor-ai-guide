import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import type { DesignSolution } from "@/types/chat";
import textureWood from "@/assets/texture-wood.jpg";
import textureFabric from "@/assets/texture-fabric.jpg";
import textureMetal from "@/assets/texture-metal.jpg";
import texturePlant from "@/assets/texture-plant.jpg";
import floorplanImg from "@/assets/floorplan-layout.png";

interface SolutionSheetProps {
  solution: DesignSolution;
  isOpen: boolean;
  onClose: () => void;
  onModify: () => void;
}

const TABS = [
  { key: "hero", label: "总览" },
  { key: "mood", label: "氛围" },
  { key: "space", label: "空间" },
  { key: "scenes", label: "场景" },
  { key: "curation", label: "选品" },
  { key: "invest", label: "投资" },
];

const SolutionSheet = ({ solution, isOpen, onClose, onModify }: SolutionSheetProps) => {
  const [activeTab, setActiveTab] = useState("hero");
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
      const top = container.scrollTop + 80;
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

  const ref = useCallback((key: string) => (el: HTMLDivElement | null) => {
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
            className={`fixed left-0 right-0 z-50 bg-background flex flex-col ${
              isFullScreen
                ? "top-[env(safe-area-inset-top,0px)] bottom-[56px] rounded-t-[20px]"
                : "bottom-[56px] rounded-t-[20px]"
            }`}
            style={{
              maxHeight: isFullScreen ? undefined : "65dvh",
              boxShadow: "0 -4px 40px rgba(0,0,0,0.08), 0 -1px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* Minimal header */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-[3px] bg-muted-foreground/15 rounded-full" />
              </div>
              <div className="flex items-center px-5 py-1">
                <div className="flex-1">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-light">Design Proposal</span>
                </div>
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 hover:bg-secondary rounded-full transition-colors">
                  {isFullScreen ? <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" /> : <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-full transition-colors ml-0.5">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Tab bar - minimal underline style */}
              <div className="flex px-5 gap-4 border-b border-border/50">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => scrollToSection(tab.key)}
                    className="relative pb-2.5"
                  >
                    <span className={`text-[10px] tracking-wide transition-colors ${
                      activeTab === tab.key ? "text-foreground font-medium" : "text-muted-foreground font-light"
                    }`}>
                      {tab.label}
                    </span>
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-foreground rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable proposal content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">

              {/* ════ HERO ════ */}
              <div ref={ref("hero")}>
                <div className="relative">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    src={solution.renderImages[activeImage]}
                    alt="效果图"
                    className={`w-full object-cover ${isFullScreen ? "h-64" : "h-48"}`}
                  />
                  {/* Annotations */}
                  {solution.annotations.map((ann, i) => (
                    <div key={i} className="absolute group cursor-pointer" style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}>
                      <div className="w-[18px] h-[18px] rounded-full border border-primary-foreground/80 bg-primary/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-[5px] h-[5px] rounded-full bg-primary-foreground" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-foreground/90 backdrop-blur-sm text-background text-[9px] px-3 py-1.5 rounded-lg whitespace-nowrap">
                          <div className="font-medium">{ann.label}</div>
                          <div className="text-background/60 text-[8px]">{ann.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Elegant gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  {/* Image selector */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                    {["正面", "侧面", "俯视"].map((label, i) => (
                      <button
                        key={label}
                        onClick={() => setActiveImage(i)}
                        className={`text-[9px] px-3 py-1 rounded-full backdrop-blur-md transition-all ${
                          i === activeImage
                            ? "bg-primary-foreground/90 text-foreground"
                            : "bg-primary-foreground/20 text-primary-foreground/80"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {/* Title overlay on gradient */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                    <h2 className="font-serif text-xl font-normal text-foreground tracking-tight leading-tight">
                      {solution.name}
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-light mt-0.5 tracking-wide">
                      Less is More · 自然呼吸
                    </p>
                  </div>
                </div>

                {/* Concept quote */}
                <div className="px-5 py-5">
                  <div className="border-l-[1.5px] border-primary/40 pl-4">
                    <p className="text-[11px] text-muted-foreground leading-[1.8] font-light italic">
                      "{solution.designThinking.concept}"
                    </p>
                  </div>
                </div>
              </div>

              {/* ════ MOOD BOARD ════ */}
              <div ref={ref("mood")} className="px-5 pb-8">
                <ProposalLabel text="MOOD BOARD" />
                <h3 className="font-serif text-sm text-foreground mb-4">氛围与材质</h3>

                {/* Color palette - large swatches */}
                <div className="flex gap-3 mb-5">
                  {[
                    { bg: "36 30% 78%", name: "浅木色", note: "温暖·自然", pct: 40 },
                    { bg: "0 0% 91%", name: "灰白色", note: "明亮·宁静", pct: 40 },
                    { bg: "140 40% 55%", name: "点缀绿", note: "生机·活力", pct: 20 },
                  ].map((c, i) => (
                    <div key={i} className="flex-1">
                      <div
                        className="w-full aspect-[3/4] rounded-lg mb-2"
                        style={{ backgroundColor: `hsl(${c.bg})` }}
                      />
                      <span className="text-[10px] font-medium text-foreground block">{c.name}</span>
                      <span className="text-[8px] text-muted-foreground">{c.note} · {c.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Material board */}
                <div className="flex gap-3 mb-5">
                  {[
                    { emoji: "🪵", name: "实木", use: "茶几·电视柜" },
                    { emoji: "🧶", name: "布艺", use: "沙发·抱枕" },
                    { emoji: "⚙️", name: "金属", use: "灯具·装饰" },
                    { emoji: "🌿", name: "绿植", use: "龟背竹·琴叶榕" },
                  ].map((m, i) => (
                    <div key={i} className="flex-1 text-center">
                      <div className="w-full aspect-square rounded-full bg-secondary/80 flex items-center justify-center mb-1.5">
                        <span className="text-xl">{m.emoji}</span>
                      </div>
                      <span className="text-[9px] font-medium text-foreground block">{m.name}</span>
                      <span className="text-[8px] text-muted-foreground leading-tight block">{m.use}</span>
                    </div>
                  ))}
                </div>

                {/* Lighting scenes as minimal cards */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "☀️", name: "日间", config: "4000K · 主灯50%" },
                    { icon: "🎬", name: "观影", config: "3000K · 落地灯30%" },
                    { icon: "📖", name: "阅读", config: "4000K · 主灯100%" },
                    { icon: "🌙", name: "夜间", config: "3000K · 柔和混合" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2.5 px-3 bg-secondary/40 rounded-lg">
                      <span className="text-base">{s.icon}</span>
                      <div>
                        <span className="text-[10px] font-medium text-foreground block">{s.name}</span>
                        <span className="text-[8px] text-muted-foreground">{s.config}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ════ SPACE ════ */}
              <div ref={ref("space")} className="px-5 pb-8">
                <ProposalLabel text="SPATIAL ANALYSIS" />
                <h3 className="font-serif text-sm text-foreground mb-4">空间规划</h3>

                {/* Key metrics - large editorial numbers */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { value: "25", unit: "㎡", label: "总面积" },
                    { value: "18", unit: "㎡", label: "可用面积" },
                    { value: "2.8", unit: "m", label: "层高" },
                  ].map((m, i) => (
                    <div key={i} className="text-center py-3 border border-border/50 rounded-lg">
                      <div className="flex items-baseline justify-center">
                        <span className="font-mono-data text-2xl font-light text-foreground">{m.value}</span>
                        <span className="text-[9px] text-muted-foreground ml-0.5">{m.unit}</span>
                      </div>
                      <span className="text-[8px] text-muted-foreground tracking-wide">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Layout ratio - elegant bar */}
                <div className="mb-5">
                  <span className="text-[9px] text-muted-foreground tracking-wide block mb-2">布局比例</span>
                  <div className="flex h-8 rounded-lg overflow-hidden gap-[2px]">
                    <div className="bg-primary/70 flex items-center justify-center rounded-l-lg" style={{ width: "60%" }}>
                      <span className="text-[8px] text-primary-foreground font-medium">沙发区 60%</span>
                    </div>
                    <div className="bg-accent/60 flex items-center justify-center" style={{ width: "30%" }}>
                      <span className="text-[8px] text-accent-foreground font-medium">电视区 30%</span>
                    </div>
                    <div className="bg-muted flex items-center justify-center rounded-r-lg" style={{ width: "10%" }} />
                  </div>
                </div>

                {/* Circulation - editorial metric cards */}
                <div className="flex gap-2 mb-5">
                  {[
                    { val: "1.2m", label: "主动线", path: "入户 → 阳台" },
                    { val: "0.8m", label: "次动线", path: "沙发 → 厨房" },
                    { val: "∞", label: "视线", path: "无遮挡" },
                  ].map((c, i) => (
                    <div key={i} className="flex-1 text-center py-3 bg-secondary/40 rounded-lg">
                      <span className="font-mono-data text-lg font-light text-primary block">{c.val}</span>
                      <span className="text-[9px] font-medium text-foreground block mt-0.5">{c.label}</span>
                      <span className="text-[7px] text-muted-foreground">{c.path}</span>
                    </div>
                  ))}
                </div>

                {/* Opportunities + Challenges - clean two-column */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[8px] tracking-wider text-accent font-medium block mb-2">OPPORTUNITIES</span>
                    {solution.spaceUnderstanding.opportunities.map((o, i) => (
                      <div key={i} className="flex items-start gap-1.5 mb-2">
                        <div className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        <span className="text-[9px] text-muted-foreground leading-snug">{o}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="text-[8px] tracking-wider text-destructive/70 font-medium block mb-2">CHALLENGES</span>
                    {solution.spaceUnderstanding.challenges.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 mb-2">
                        <div className="w-1 h-1 rounded-full bg-destructive/50 mt-1.5 flex-shrink-0" />
                        <span className="text-[9px] text-muted-foreground leading-snug">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ════ SCENES ════ */}
              <div ref={ref("scenes")} className="pb-8">
                <div className="px-5">
                  <ProposalLabel text="LIVING SCENARIOS" />
                  <h3 className="font-serif text-sm text-foreground mb-4">生活场景</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory">
                  {solution.lifeScenarios.map((s, i) => (
                    <div key={i} className="flex-shrink-0 w-[72%] snap-center">
                      {/* Large icon */}
                      <div className="w-full aspect-[16/9] bg-secondary/50 rounded-lg flex flex-col items-center justify-center mb-2.5">
                        <span className="text-4xl mb-1">{s.name.split(" ")[0]}</span>
                        <span className="text-[11px] font-medium text-foreground">{s.name.split(" ").slice(1).join(" ")}</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">{s.description}</span>
                      </div>
                      {/* Design points */}
                      <div className="space-y-1">
                        {s.design.split("\n").filter(Boolean).map((line, j) => (
                          <p key={j} className="text-[9px] text-muted-foreground leading-snug pl-2 border-l border-border/50">{line.trim()}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ════ CURATION ════ */}
              <div ref={ref("curation")} className="px-5 pb-8">
                <ProposalLabel text="CURATED SELECTION" />
                <h3 className="font-serif text-sm text-foreground mb-1">精选方案</h3>
                <p className="text-[9px] text-muted-foreground mb-4 font-light">{solution.productSelection.principle}</p>

                <div className="space-y-3">
                  {solution.productSelection.items.map((item, i) => (
                    <CurationCard key={i} item={item} />
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-baseline justify-between">
                  <span className="text-[10px] text-muted-foreground tracking-wide">合计</span>
                  <span className="font-mono-data text-lg font-light text-foreground">
                    ¥{solution.productSelection.items.reduce((s, i) => s + i.price, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ════ INVESTMENT ════ */}
              <div ref={ref("invest")} className="px-5 pb-8">
                <ProposalLabel text="INVESTMENT" />
                <h3 className="font-serif text-sm text-foreground mb-4">预算建议</h3>

                {/* Hero price */}
                <div className="text-center py-6 mb-5 border border-border/50 rounded-lg">
                  <span className="text-[9px] text-muted-foreground tracking-wider block mb-1">TOTAL INVESTMENT</span>
                  <span className="font-mono-data text-3xl font-light text-foreground">
                    ¥{solution.costOptimization.current.toLocaleString()}
                  </span>
                </div>

                {/* Budget breakdown - clean bar */}
                <div className="mb-5">
                  <span className="text-[9px] text-muted-foreground tracking-wide block mb-2">费用构成</span>
                  <div className="flex h-3 rounded-full overflow-hidden gap-[1px] mb-2">
                    {solution.productSelection.items.map((item, i) => {
                      const pct = (item.price / solution.costOptimization.current) * 100;
                      const opacities = ["opacity-90", "opacity-70", "opacity-50", "opacity-35", "opacity-20"];
                      return (
                        <div key={i} className={`bg-primary ${opacities[i]} rounded-sm`} style={{ width: `${pct}%` }} />
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {solution.productSelection.items.map((item, i) => (
                      <span key={i} className="text-[8px] text-muted-foreground">
                        <span className="inline-block w-1.5 h-1.5 rounded-sm bg-primary mr-1" style={{ opacity: 1 - i * 0.17 }} />
                        {item.category.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, "")} ¥{item.price.toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flexible range */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="py-3 px-3 border border-accent/30 rounded-lg">
                    <span className="text-[8px] tracking-wider text-accent font-medium block mb-2">CAN SAVE</span>
                    {solution.costOptimization.canSave.map((s, i) => (
                      <div key={i} className="flex items-center justify-between mb-1.5 last:mb-0">
                        <span className="text-[9px] text-foreground">{s.item}</span>
                        <span className="font-mono-data text-[9px] text-accent">-¥{s.savings.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="py-3 px-3 border border-primary/30 rounded-lg">
                    <span className="text-[8px] tracking-wider text-primary font-medium block mb-2">CAN UPGRADE</span>
                    {solution.costOptimization.canUpgrade.map((u, i) => (
                      <div key={i} className="flex items-center justify-between mb-1.5 last:mb-0">
                        <span className="text-[9px] text-foreground">{u.item}</span>
                        <span className="font-mono-data text-[9px] text-primary">+¥{u.cost.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="border-l-[1.5px] border-primary/40 pl-4 py-1">
                  <span className="text-[8px] tracking-wider text-primary font-medium block mb-1">RECOMMENDATION</span>
                  <p className="text-[9px] text-muted-foreground leading-relaxed font-light">
                    {solution.costOptimization.recommendation}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-8">
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 py-3 bg-foreground text-background text-[11px] font-medium rounded-lg tracking-wide">
                    选择此方案
                  </button>
                  <button onClick={() => { setIsFullScreen(false); onModify(); }} className="flex-1 py-3 border border-border text-foreground text-[11px] font-medium rounded-lg tracking-wide">
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

const ProposalLabel = ({ text }: { text: string }) => (
  <span className="text-[8px] tracking-[0.2em] uppercase text-muted-foreground/60 font-mono block mb-1">{text}</span>
);

const CurationCard = ({ item }: { item: { category: string; name: string; brand: string; price: number; brief: string; why: string; material: string; color: string; performance: string; style: string } }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg p-3.5">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{item.category.split(" ")[0]}</span>
          <div>
            <span className="text-[11px] font-medium text-foreground block">{item.name}</span>
            <span className="text-[9px] text-muted-foreground font-light">{item.brand}</span>
          </div>
        </div>
        <span className="font-mono-data text-[13px] font-light text-foreground">¥{item.price.toLocaleString()}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {[item.material, item.color, item.performance, item.style].map((tag) => (
          <span key={tag} className="text-[8px] px-2 py-[3px] border border-border/50 rounded-full text-muted-foreground font-light">{tag}</span>
        ))}
      </div>

      <p className="text-[9px] text-muted-foreground font-light mb-1.5">{item.brief}</p>

      <button onClick={() => setOpen(!open)} className="text-[9px] text-primary/80 font-light tracking-wide">
        {open ? "收起" : "设计师选品理由 →"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-[9px] text-muted-foreground leading-relaxed mt-2 pl-3 border-l border-primary/30 font-light italic">
              {item.why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionSheet;
