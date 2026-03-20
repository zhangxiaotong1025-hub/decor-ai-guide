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
  { key: "feel", label: "感觉" },
  { key: "understand", label: "懂你" },
  { key: "pro", label: "专业" },
  { key: "picks", label: "选品" },
  { key: "invest", label: "预算" },
];

const SolutionSheet = ({ solution, isOpen, onClose, onModify }: SolutionSheetProps) => {
  const [activeTab, setActiveTab] = useState("feel");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
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
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-light">为你定制的方案</span>
                </div>
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1.5 hover:bg-secondary rounded-full transition-colors">
                  {isFullScreen ? <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" /> : <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-full transition-colors ml-0.5">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex px-5 gap-4 border-b border-border/50">
                {TABS.map((tab) => (
                  <button key={tab.key} onClick={() => scrollToSection(tab.key)} className="relative pb-2.5">
                    <span className={`text-[10px] tracking-wide transition-colors ${
                      activeTab === tab.key ? "text-foreground font-medium" : "text-muted-foreground font-light"
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

              {/* ═══════════════════════════════════════════
                  🟥 第一层：打感觉 — 让用户一眼觉得"这套挺对的"
                  ═══════════════════════════════════════════ */}
              <div ref={ref("feel")}>
                {/* Hero image - 像真实能住的家 */}
                <div className="relative">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    src={solution.renderImages[activeImage]}
                    alt="你未来的家"
                    className={`w-full object-cover ${isFullScreen ? "h-72" : "h-52"}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent" />

                  {/* Image dots */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {solution.renderImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === activeImage ? "bg-primary-foreground w-4" : "bg-primary-foreground/40"
                        }`}
                      />
                    ))}
                  </div>

                  {/* 生活化标题 — 不讲风格，讲感受 */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                    <h2 className="font-serif text-lg font-normal text-foreground leading-snug">
                      一个待着很舒服、不会乱的客厅
                    </h2>
                    <p className="text-[11px] text-muted-foreground/80 font-light mt-1">
                      适合每天回家能放松下来的那种空间
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                  🟧 第二层：你懂我 — 建立信任，不是模板
                  ═══════════════════════════════════════════ */}
              <div ref={ref("understand")} className="px-5 py-6">
                <div className="space-y-4">
                  {/* 像人在说话，不是说明书 */}
                  <div className="bg-secondary/30 rounded-2xl p-4">
                    <p className="text-[12px] text-foreground leading-[2] font-light">
                      你这个空间大概 <span className="font-medium">25㎡</span>，
                      客餐一体的格局，实际能用的大约 18㎡。
                    </p>
                    <p className="text-[12px] text-foreground leading-[2] font-light mt-2">
                      说实话，如果东西稍微多一点，就会显得乱，
                      <br />而且待久了会有点压抑。
                    </p>
                    <div className="mt-4 pt-3 border-t border-border/30">
                      <p className="text-[12px] text-foreground leading-[2] font-light">
                        所以这套方案，我优先做了两件事：
                      </p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">✓</span>
                          <span className="text-[12px] text-foreground font-light">让空间看起来更干净</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">✓</span>
                          <span className="text-[12px] text-foreground font-light">让你日常待着更轻松</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 色彩不讲"北欧"，讲感受 */}
                  <div>
                    <p className="text-[11px] text-muted-foreground leading-[1.9] font-light">
                      整体用了浅色 + 木色，不是为了好看，
                      <br />而是让空间更放松，待久一点也不会累。
                    </p>

                    {/* 色彩条 — 极简 */}
                    <div className="flex h-10 rounded-xl overflow-hidden mt-3 mb-2">
                      <div className="flex-[4]" style={{ backgroundColor: "hsl(36 30% 78%)" }} />
                      <div className="flex-[4]" style={{ backgroundColor: "hsl(0 0% 93%)" }} />
                      <div className="flex-[2]" style={{ backgroundColor: "hsl(140 40% 55%)" }} />
                    </div>
                    <div className="flex text-[9px] text-muted-foreground font-light">
                      <span className="flex-[4]">浅木色 · 温暖放松</span>
                      <span className="flex-[4]">灰白 · 干净透气</span>
                      <span className="flex-[2]">绿 · 提神</span>
                    </div>
                  </div>

                  {/* 材质 — 触感叙事 */}
                  <div>
                    <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-3">
                      不同的材质搭在一起，<br />是为了让你每次碰到、坐上去，都觉得舒服。
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { img: textureWood, name: "木质", feel: "温暖踏实" },
                        { img: textureFabric, name: "布艺", feel: "柔软放松" },
                        { img: textureMetal, name: "金属", feel: "一点精致" },
                        { img: texturePlant, name: "绿植", feel: "活的气息" },
                      ].map((m, i) => (
                        <div key={i}>
                          <div className="w-full aspect-square rounded-xl overflow-hidden mb-1.5">
                            <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-medium text-foreground block">{m.name}</span>
                          <span className="text-[8px] text-muted-foreground">{m.feel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                  🟨 第三层：专业性 — 让人相信这不是拍脑袋
                  ═══════════════════════════════════════════ */}
              <div ref={ref("pro")} className="px-5 pb-8">
                <SectionDivider />

                {/* 1. 空间动线 — 最有说服力 */}
                <div className="mb-6">
                  <h3 className="text-[13px] font-medium text-foreground mb-2">走起来不会挤</h3>
                  <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-3">
                    我帮你把主要动线留出来了：
                    <br />从门口进来 → 沙发 → 阳台，是顺的，不会被家具挡住。
                    <br />日常走动不会绕，也不会挤。
                  </p>

                  {/* 户型图 */}
                  <div className="rounded-xl overflow-hidden border border-border/30 mb-3">
                    <img src={floorplanImg} alt="动线规划" className="w-full" />
                  </div>

                  {/* 动线卡片 — 翻译成生活影响 */}
                  <div className="space-y-2">
                    {[
                      { width: "1.2m", label: "主通道", desc: "从门口到阳台，一路畅通", note: "推婴儿车、轮椅都没问题" },
                      { width: "0.8m", label: "去厨房", desc: "沙发到厨房，方便拿东西", note: "不用绕路" },
                      { width: "—", label: "看电视", desc: "沙发正对电视，中间没遮挡", note: "2.8米，55寸的最佳距离" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5 px-3 bg-secondary/20 rounded-xl">
                        <div className="text-center flex-shrink-0 w-10">
                          <span className="font-mono text-sm font-light text-foreground">{c.width}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-medium text-foreground">{c.desc}</span>
                          <span className="text-[9px] text-muted-foreground block">{c.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 收纳逻辑 — 生活感 */}
                <div className="mb-6">
                  <h3 className="text-[13px] font-medium text-foreground mb-2">不容易乱</h3>
                  <p className="text-[11px] text-muted-foreground leading-[1.9] font-light">
                    电视柜选了带收纳的，日常零碎可以直接收进去。
                    <br />茶几下面也有一层，遥控器、杂志有地方放。
                    <br />空间会更干净，不容易乱。
                  </p>
                </div>

                {/* 3. 灯光 — 讲感受不讲参数 */}
                <div className="mb-6">
                  <h3 className="text-[13px] font-medium text-foreground mb-2">灯光可以换心情</h3>
                  <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-3">
                    设了三层灯，不同时候开不同的，感觉完全不一样。
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { scene: "白天工作", feel: "明亮但不刺眼", gradient: "from-amber-50/60 to-white" },
                      { scene: "晚上看电影", feel: "暗一点，不反光", gradient: "from-amber-100/60 to-orange-50/40" },
                      { scene: "睡前放松", feel: "暖暖的，很安心", gradient: "from-orange-100/60 to-amber-50/40" },
                      { scene: "朋友来了", feel: "全开，亮堂温馨", gradient: "from-yellow-50/60 to-white" },
                    ].map((s, i) => (
                      <div key={i} className="relative overflow-hidden rounded-xl border border-border/20">
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
                        <div className="relative p-3">
                          <span className="text-[11px] font-medium text-foreground block">{s.scene}</span>
                          <span className="text-[9px] text-muted-foreground font-light">{s.feel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 留一句"不完美"的真实感 */}
                <div className="bg-secondary/20 rounded-xl p-3.5">
                  <p className="text-[10px] text-muted-foreground leading-[1.8] font-light">
                    💡 如果你更喜欢亮一点的氛围，落地灯可以换成色温更高的款，随时跟我说。
                  </p>
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                  🟩 第四层：选品 — 每一个都有"为什么是它"
                  ═══════════════════════════════════════════ */}
              <div ref={ref("picks")} className="px-5 pb-8">
                <SectionDivider />
                <p className="text-[11px] text-muted-foreground leading-[1.9] font-light mb-4">
                  每一件都不是随便选的，
                  <br />是根据你的空间和生活方式，一件件匹配出来的。
                </p>

                <div className="space-y-4">
                  {solution.productSelection.items.map((item, i) => (
                    <PersuasionProductCard key={i} item={item} />
                  ))}
                </div>

                {/* 合计 */}
                <div className="mt-5 pt-3 border-t border-border/30 flex items-baseline justify-between">
                  <span className="text-[11px] text-muted-foreground">全部加起来</span>
                  <span className="font-mono text-lg font-light text-foreground">
                    ¥{solution.productSelection.items.reduce((s, i) => s + i.price, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                  🟦 第五层 + 🟪 第六层：预算 + 行动
                  ═══════════════════════════════════════════ */}
              <div ref={ref("invest")} className="px-5 pb-8">
                <SectionDivider />

                {/* 总价 */}
                <div className="text-center py-5 mb-4 bg-secondary/20 rounded-xl">
                  <span className="text-[10px] text-muted-foreground block mb-1">这套方案总共</span>
                  <span className="font-mono text-3xl font-light text-foreground">
                    ¥{solution.costOptimization.current.toLocaleString()}
                  </span>
                </div>

                {/* 费用构成 */}
                <div className="mb-5">
                  <div className="flex h-2.5 rounded-full overflow-hidden gap-[1px] mb-2">
                    {solution.productSelection.items.map((item, i) => {
                      const pct = (item.price / solution.costOptimization.current) * 100;
                      const opacities = ["opacity-90", "opacity-70", "opacity-50", "opacity-35", "opacity-20"];
                      return <div key={i} className={`bg-primary ${opacities[i]} rounded-sm`} style={{ width: `${pct}%` }} />;
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

                {/* 弹性空间 — 说人话 */}
                <div className="space-y-3 mb-5">
                  <div className="p-3.5 border border-accent/20 rounded-xl">
                    <span className="text-[10px] font-medium text-accent block mb-2">如果预算紧一点</span>
                    {solution.costOptimization.canSave.map((s, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-foreground">{s.item}</span>
                          <span className="font-mono text-[11px] text-accent">能省 ¥{s.savings.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground font-light mt-0.5 leading-relaxed">{s.tradeoff}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 border border-primary/20 rounded-xl">
                    <span className="text-[10px] font-medium text-primary block mb-2">如果想再好一点</span>
                    {solution.costOptimization.canUpgrade.map((u, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-foreground">{u.item}</span>
                          <span className="font-mono text-[11px] text-primary">+¥{u.cost.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground font-light mt-0.5 leading-relaxed">{u.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 建议 */}
                <div className="bg-secondary/20 rounded-xl p-3.5 mb-6">
                  <p className="text-[11px] text-muted-foreground leading-[1.8] font-light">
                    {solution.costOptimization.recommendation}
                  </p>
                </div>

                {/* 社交暗示 — 轻，不套路 */}
                <div className="text-center mb-4">
                  <p className="text-[10px] text-muted-foreground/60 font-light">
                    刚好这几件最近选的人挺多，一起买可能会便宜一点
                  </p>
                </div>

                {/* CTA — 轻行动，不是"购买" */}
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 py-3.5 bg-foreground text-background text-[12px] font-medium rounded-xl tracking-wide">
                    这套我先用着
                  </button>
                  <button onClick={() => { setIsFullScreen(false); onModify(); }} className="flex-1 py-3.5 border border-border text-foreground text-[12px] font-light rounded-xl tracking-wide">
                    我想改改
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

const SectionDivider = () => (
  <div className="flex items-center gap-3 mb-5">
    <div className="flex-1 h-[0.5px] bg-border/40" />
    <div className="w-1 h-1 rounded-full bg-border/60" />
    <div className="flex-1 h-[0.5px] bg-border/40" />
  </div>
);

const PersuasionProductCard = ({ item }: {
  item: { category: string; name: string; brand: string; price: number; brief: string; why: string; material: string; color: string; performance: string; style: string };
}) => {
  const [open, setOpen] = useState(false);

  // 把"why"翻译成更口语化的结构
  return (
    <div className="bg-secondary/15 rounded-xl p-4">
      {/* 头部 */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{item.category.split(" ")[0]}</span>
          <div>
            <span className="text-[12px] font-medium text-foreground">{item.name}</span>
            <span className="text-[9px] text-muted-foreground font-light block">{item.brand} · {item.brief}</span>
          </div>
        </div>
        <span className="font-mono text-[14px] font-light text-foreground flex-shrink-0">¥{item.price.toLocaleString()}</span>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5 my-2.5">
        {[item.material, item.color, item.performance].filter(Boolean).map((tag) => (
          <span key={tag} className="text-[8px] px-2 py-[3px] bg-background/60 rounded-full text-muted-foreground font-light">{tag}</span>
        ))}
      </div>

      {/* 选品理由 — "为什么是它" */}
      <button onClick={() => setOpen(!open)} className="text-[10px] text-primary/80 font-light">
        {open ? "收起理由" : "为什么选它 →"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 pt-2.5 border-t border-border/20">
              <p className="text-[11px] text-muted-foreground leading-[1.9] font-light">
                {item.why}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionSheet;
