import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Maximize2, Minimize2, ChevronRight, Shield, Factory, Award, Truck } from "lucide-react";
import type { DesignSolution } from "@/types/chat";
import sceneMorning from "@/assets/scene-morning.jpg";
import sceneNight from "@/assets/scene-night.jpg";
import fabricMacro from "@/assets/fabric-macro.jpg";
import floorplanImg from "@/assets/floorplan-layout.png";

interface SolutionSheetProps {
  solution: DesignSolution;
  isOpen: boolean;
  onClose: () => void;
  onModify: () => void;
}

const TABS = [
  { key: "immerse", label: "沉浸" },
  { key: "why", label: "设计" },
  { key: "items", label: "空间解构" },
  { key: "trust", label: "保障" },
];

type SceneMode = "morning" | "night";

const SolutionSheet = ({ solution, isOpen, onClose, onModify }: SolutionSheetProps) => {
  const [activeTab, setActiveTab] = useState("immerse");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sceneMode, setSceneMode] = useState<SceneMode>("morning");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = useCallback((key: string) => {
    setActiveTab(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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

  const sceneImages: Record<SceneMode, string> = { morning: sceneMorning, night: sceneNight };

  const totalPrice = solution.productSelection.items.reduce((s, i) => s + i.price, 0);

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
            {/* Header */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-[3px] bg-muted-foreground/15 rounded-full" />
              </div>
              <div className="flex items-center px-5 py-1">
                <div className="flex-1">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60 font-light">专属生活提案</span>
                </div>
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 hover:bg-secondary rounded-full transition-colors">
                  {isFullScreen ? <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" /> : <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-full transition-colors ml-0.5">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex px-5 gap-5 border-b border-border/40">
                {TABS.map((tab) => (
                  <button key={tab.key} onClick={() => scrollToSection(tab.key)} className="relative pb-2.5">
                    <span className={`text-[10px] tracking-wide transition-colors ${
                      activeTab === tab.key ? "text-foreground font-medium" : "text-muted-foreground/60 font-light"
                    }`}>
                      {tab.label}
                    </span>
                    {activeTab === tab.key && (
                      <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-foreground rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">

              {/* ═══════════════════════════════════════════════════
                  💥 第一层：情感暴击 — 沉浸式场景 + 专属设计信
                  ═══════════════════════════════════════════════════ */}
              <div ref={ref("immerse")}>
                {/* Cinematic Hero */}
                <div className="relative overflow-hidden">
                  <motion.img
                    key={sceneMode}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    src={sceneImages[sceneMode]}
                    alt="你未来的家"
                    className={`w-full object-cover ${isFullScreen ? "h-80" : "h-56"}`}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

                  {/* Scene mode switches */}
                  <div className="absolute bottom-16 left-5 flex gap-2">
                    {([
                      { key: "morning" as SceneMode, icon: "☀️", label: "晨光" },
                      { key: "night" as SceneMode, icon: "🌙", label: "夜读" },
                    ]).map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setSceneMode(s.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] backdrop-blur-md transition-all ${
                          sceneMode === s.key
                            ? "bg-foreground/80 text-background font-medium"
                            : "bg-background/30 text-foreground/80 font-light"
                        }`}
                      >
                        <span>{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── 专属设计信 ── */}
                <div className="px-6 -mt-4 relative z-10">
                  <div className="mb-8">
                    <p className="font-serif text-[15px] text-foreground/40 italic mb-3 tracking-wide">致 渴望呼吸感的你：</p>
                    <p className="text-[13px] text-foreground leading-[2.2] font-light">
                      你说<span className="underline decoration-primary/30 underline-offset-4 font-normal">每天下班回家感到疲惫</span>，预算 2 万，想要一个能
                      <span className="underline decoration-primary/30 underline-offset-4 font-normal">彻底放松</span>的角落。
                    </p>
                    <p className="text-[13px] text-foreground leading-[2.2] font-light mt-3">
                      我为你去掉了多余的繁杂，用大面积的燕麦色和低矮重心的设计，在 25㎡ 的物理空间里，为你延展出无限的心理余地。
                    </p>
                    <p className="text-[11px] text-muted-foreground/50 font-light mt-5 tracking-wide">
                      —— 你的专属 AI 生活设计师
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════
                  🧐 第二层：设计理念 — 动线 + 色彩心理 + 材质叙事
                  ═══════════════════════════════════════════════════ */}
              <div ref={ref("why")}>
                <SectionLabel>为什么这是最适合你的方案</SectionLabel>

                {/* 空间动线 */}
                <div className="px-6 mb-8">
                  <h3 className="text-[13px] font-medium text-foreground mb-2">空间动线</h3>
                  <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-4">
                    抛弃了传统笨重的茶几，采用不规则小岛岩板，<br />
                    为你每晚的瑜伽垫留出了完美的 2㎡ 专属地带。
                  </p>

                  {/* Floorplan */}
                  <div className="rounded-2xl overflow-hidden border border-border/20 mb-4">
                    <img src={floorplanImg} alt="空间动线图" className="w-full" />
                  </div>

                  {/* Circulation cards */}
                  <div className="space-y-2">
                    {[
                      { path: "入户 → 沙发 → 阳台", width: "1.2m", note: "一路畅通，推婴儿车也没问题" },
                      { path: "沙发 → 厨房", width: "0.8m", note: "拿杯水不用绕路" },
                      { path: "沙发 → 电视", width: "2.8m", note: "55寸的最佳观影距离" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-3 py-3 px-4 bg-secondary/20 rounded-xl">
                        <span className="font-mono text-[13px] font-light text-foreground w-12 flex-shrink-0">{c.width}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-medium text-foreground block">{c.path}</span>
                          <span className="text-[9px] text-muted-foreground/70 font-light">{c.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 色彩心理学 */}
                <div className="px-6 mb-8">
                  <h3 className="text-[13px] font-medium text-foreground mb-2">治愈系色彩</h3>
                  <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-3">
                    配色不只是为了好看，<br />而是让你下班后的心理压力一点点卸掉。
                  </p>

                  {/* Moodboard color bar */}
                  <div className="flex h-14 rounded-2xl overflow-hidden mb-3">
                    <div className="flex-[4] relative" style={{ backgroundColor: "hsl(36 28% 78%)" }}>
                      <span className="absolute bottom-2 left-3 text-[9px] font-light" style={{ color: "hsl(36 28% 40%)" }}>燕麦色 · 平静温和</span>
                    </div>
                    <div className="flex-[4] relative" style={{ backgroundColor: "hsl(30 20% 88%)" }}>
                      <span className="absolute bottom-2 left-3 text-[9px] font-light" style={{ color: "hsl(30 20% 50%)" }}>奶白 · 透气舒展</span>
                    </div>
                    <div className="flex-[2] relative" style={{ backgroundColor: "hsl(25 40% 42%)" }}>
                      <span className="absolute bottom-2 left-2 text-[9px] font-light text-background/80">胡桃木 · 温度</span>
                    </div>
                  </div>
                </div>

                {/* 微观材质叙事 */}
                <div className="px-6 mb-8">
                  <h3 className="text-[13px] font-medium text-foreground mb-2">肉眼可见的质感</h3>
                  <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-4">
                    不只是写"科技布"三个字——<br />看看水滴在面料上滚落，不留一点痕迹。
                  </p>

                  {/* Fabric macro hero */}
                  <div className="rounded-2xl overflow-hidden mb-3">
                    <img src={fabricMacro} alt="科技布微距特写" className="w-full h-48 object-cover" />
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 font-light text-center">
                    纳米级防抓防污科技布 · 水滴滚落不留痕 · 养猫家庭的救星
                  </p>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════
                  🛋️ 第三层：空间解构 — 构成理想生活的物品
                  ═══════════════════════════════════════════════════ */}
              <div ref={ref("items")}>
                <SectionLabel>构成理想生活的 {solution.productSelection.items.length} 件物品</SectionLabel>

                <div className="px-6 space-y-6">
                  {solution.productSelection.items.map((item, i) => (
                    <ImmersiveProductCard key={i} item={item} index={i} />
                  ))}
                </div>

                {/* Total + group buy hint */}
                <div className="px-6 mt-8 mb-4">
                  <div className="bg-secondary/20 rounded-2xl p-5 text-center">
                    <span className="text-[10px] text-muted-foreground/60 block mb-1">全套直供价</span>
                    <span className="font-mono text-3xl font-light text-foreground">
                      ¥{totalPrice.toLocaleString()}
                    </span>
                    <div className="mt-3 pt-3 border-t border-border/20">
                      <p className="text-[10px] text-muted-foreground/50 font-light leading-relaxed">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent/60 mr-1 animate-pulse" />
                        系统正在为你寻找第 3 位热爱这种风格的同路人...
                        <br />凑满 10 人可再省 ¥1,300
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════
                  🛡️ 第四层：信任保障 + 行动
                  ═══════════════════════════════════════════════════ */}
              <div ref={ref("trust")} className="px-6 pb-8">
                <SectionLabel>让你安心的生活保障</SectionLabel>

                <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-5">
                  我们不造家具，<br />我们只是世界级工厂与你之间的桥梁。
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: Factory, text: "100% 头部品牌同源大厂发货" },
                    { icon: Shield, text: "材质弄虚作假，平台全额免单" },
                    { icon: Truck, text: "送装一体，拆包摆放，带走垃圾" },
                    { icon: Award, text: "365天只换不修，三年质保" },
                  ].map((g, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 px-4 bg-secondary/15 rounded-xl">
                      <g.icon className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                      <span className="text-[11px] text-foreground font-light">{g.text}</span>
                    </div>
                  ))}
                </div>

                {/* Budget flexibility */}
                <div className="space-y-3 mb-8">
                  <div className="p-4 border border-accent/15 rounded-2xl">
                    <span className="text-[10px] font-medium text-accent block mb-2">预算紧一点？</span>
                    {solution.costOptimization.canSave.map((s, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-foreground font-light">{s.item}</span>
                          <span className="font-mono text-[11px] text-accent">-¥{s.savings.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 font-light mt-0.5 leading-relaxed">{s.tradeoff}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border border-primary/15 rounded-2xl">
                    <span className="text-[10px] font-medium text-primary block mb-2">想再好一点？</span>
                    {solution.costOptimization.canUpgrade.map((u, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-foreground font-light">{u.item}</span>
                          <span className="font-mono text-[11px] text-primary">+¥{u.cost.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 font-light mt-0.5 leading-relaxed">{u.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real talk */}
                <div className="bg-secondary/10 rounded-xl p-3.5 mb-8">
                  <p className="text-[10px] text-muted-foreground/60 leading-[1.8] font-light">
                    💡 {solution.costOptimization.recommendation}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 py-3.5 bg-foreground text-background text-[12px] font-medium rounded-xl tracking-wide">
                    ⚡ 一键拿下这套生活
                  </button>
                  <button onClick={() => { setIsFullScreen(false); onModify(); }} className="flex-[0.6] py-3.5 border border-border text-foreground text-[12px] font-light rounded-xl tracking-wide">
                    💬 微调一下
                  </button>
                </div>
                <p className="text-[9px] text-muted-foreground/40 text-center mt-2.5">
                  全套 ¥{totalPrice.toLocaleString()} · 预计拼团后可再省 ¥1,300
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ─── Sub-components ─── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 mb-5 mt-2">
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-[0.5px] bg-border/30" />
      <div className="w-1 h-1 rounded-full bg-border/40" />
      <div className="flex-1 h-[0.5px] bg-border/30" />
    </div>
    <h2 className="font-serif text-[15px] text-foreground font-normal tracking-wide">{children}</h2>
  </div>
);

const ImmersiveProductCard = ({ item, index }: {
  item: { category: string; name: string; brand: string; price: number; brief: string; why: string; material: string; color: string; performance: string; style: string };
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  // Simulated brand comparison prices
  const brandPrice = Math.round(item.price * 2.5);
  const brandMarkup = Math.round(brandPrice * 0.4);
  const dealerMarkup = Math.round(brandPrice * 0.33);
  const factoryCost = brandPrice - brandMarkup - dealerMarkup;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-secondary/10 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] text-muted-foreground/50 font-light">{index + 1}.</span>
          <span className="text-[14px] font-medium text-foreground">{item.name}</span>
        </div>
        <p className="text-[11px] text-muted-foreground/70 font-light leading-relaxed mt-1">
          {item.why.split("；")[0].split("。")[0]}。
        </p>
      </div>

      {/* Reason — life-oriented, not spec-oriented */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {[item.material, item.color, item.style].filter(Boolean).map((tag) => (
            <span key={tag} className="text-[8px] px-2 py-[3px] bg-background/60 rounded-full text-muted-foreground/60 font-light">{tag}</span>
          ))}
        </div>
      </div>

      {/* Expand for price deconstruction */}
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-2.5 border-t border-border/10 flex items-center justify-between">
        <span className="text-[10px] text-primary/70 font-light">
          {expanded ? "收起详情" : "看看这个价格到底值不值 →"}
        </span>
        <span className="font-mono text-[14px] text-foreground font-light">¥{item.price.toLocaleString()}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/10">
              {/* Factory sourcing */}
              <div className="py-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="w-3.5 h-3.5 text-muted-foreground/40" />
                  <span className="text-[10px] font-medium text-foreground">制造大揭秘</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-light leading-relaxed">
                  来自广东佛山 · 顾家/芝华士同源代工厂
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[8px] px-2 py-1 bg-accent/10 text-accent rounded-full">SGS 耐磨 10 万次</span>
                  <span className="text-[8px] px-2 py-1 bg-accent/10 text-accent rounded-full">E0 级母婴环保</span>
                </div>
              </div>

              {/* Price deconstruction */}
              <div className="bg-background/50 rounded-xl p-3">
                <span className="text-[9px] text-muted-foreground/50 block mb-2">价格解构</span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground/50 font-light line-through">品牌门店价</span>
                    <span className="text-[10px] text-muted-foreground/40 font-mono line-through">¥{brandPrice.toLocaleString()}</span>
                  </div>
                  {/* Breakdown bar */}
                  <div className="flex h-5 rounded-lg overflow-hidden gap-[1px] my-2">
                    <div className="flex-[40] bg-destructive/20 flex items-center justify-center">
                      <span className="text-[7px] text-destructive/60">品牌溢价 ¥{(brandMarkup / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex-[33] bg-destructive/10 flex items-center justify-center">
                      <span className="text-[7px] text-destructive/40">经销商 ¥{(dealerMarkup / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex-[27] bg-accent/15 flex items-center justify-center">
                      <span className="text-[7px] text-accent/70">出厂 ¥{(factoryCost / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-foreground font-medium">直供底价</span>
                    <span className="text-[14px] text-foreground font-mono font-medium">¥{item.price.toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] text-accent/60 font-light">为你省下 ¥{(brandPrice - item.price).toLocaleString()} 的中间环节费用</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SolutionSheet;
