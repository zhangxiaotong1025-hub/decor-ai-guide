import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Shield, Factory, Award, Truck, Users, Zap, Box, Eye, Sparkles, ArrowDown, Ruler, Layers, Palette, Grid3X3 } from "lucide-react";
import type { DesignSolution } from "@/types/chat";
import { mockProducts } from "@/data/mockProducts";
import type { ProductItem } from "@/types/product";
import sceneMorning from "@/assets/scene-morning.jpg";
import sceneNight from "@/assets/scene-night.jpg";
import fabricMacro from "@/assets/fabric-macro.jpg";
import floorplanImg from "@/assets/floorplan-layout.png";
import render1 from "@/assets/design-render-1.jpg";
import render2 from "@/assets/design-render-2.jpg";
import render3 from "@/assets/design-render-3.jpg";
import ergonomicImg from "@/assets/ergonomic-diagram.jpg";
import proportionImg from "@/assets/proportion-analysis.jpg";
import moodboardImg from "@/assets/moodboard-materials.jpg";

interface SolutionSheetProps {
  solution: DesignSolution;
  isOpen: boolean;
  bottomInset?: number;
  onClose: () => void;
  onModify: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onOpen3DEditor?: () => void;
}

const TABS = [
  { key: "immerse", label: "方案感受" },
  { key: "why", label: "专业设计" },
  { key: "items", label: "商品清单" },
  { key: "save", label: "拼团省钱" },
];

type SceneMode = "morning" | "night";

const SolutionSheet = ({ solution, isOpen, bottomInset = 0, onClose, onModify, onSelectProduct, onOpen3DEditor }: SolutionSheetProps) => {
  const [activeTab, setActiveTab] = useState("immerse");
  const [sceneMode, setSceneMode] = useState<SceneMode>("morning");
  const [activeRender, setActiveRender] = useState(0);
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
  const renderImages = [render1, render2, render3];

  const totalPrice = mockProducts.reduce((s, p) => s + p.price, 0);
  const totalBrandPrice = mockProducts.reduce((s, p) => s + p.brandPrice, 0);
  const totalGroupBuyPrice = mockProducts.reduce((s, p) => s + p.groupBuy.targetPrice, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 bg-foreground/20 z-[65]"
            style={{ bottom: bottomInset }}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed left-0 right-0 z-[70] bg-background flex flex-col top-[env(safe-area-inset-top,0px)] rounded-t-[20px]"
            style={{
              bottom: bottomInset,
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

              {/* ═══════════════════════════════════════════════
                  ✨ 第一层：沉浸式空间感受 — 这就是你未来的家
                  ═══════════════════════════════════════════════ */}
              <div ref={ref("immerse")}>
                {/* Scene hero - full immersion */}
                <div className="relative overflow-hidden">
                  <button
                    onClick={onOpen3DEditor}
                    className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg backdrop-blur-md bg-foreground/70 text-background text-[10px] font-medium border border-foreground/10 hover:bg-foreground/90 transition-all"
                  >
                    <Box className="w-3.5 h-3.5" />
                    进入 3D 漫游
                  </button>

                  <motion.img
                    key={sceneMode}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    src={sceneImages[sceneMode]}
                    alt="你未来的家"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                  {/* Scene mode switches */}
                  <div className="absolute bottom-20 left-5 flex gap-2">
                    {([
                      { key: "morning" as SceneMode, icon: "☀️", label: "晨光模式" },
                      { key: "night" as SceneMode, icon: "🌙", label: "夜读模式" },
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

                  {/* Emotional overlay text */}
                  <div className="absolute bottom-6 left-5 right-5">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-lg font-medium text-foreground tracking-wide"
                    >
                      {sceneMode === "morning" ? "推开窗，阳光洒满客厅" : "关上灯，整个世界安静下来"}
                    </motion.p>
                  </div>
                </div>

                {/* ── 专属设计信 ── */}
                <div className="px-6 mt-2">
                  <div className="mb-6">
                    <p className="font-serif text-sm text-muted-foreground italic mb-3 tracking-wide">致 渴望呼吸感的你：</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      你说<span className="underline decoration-primary/40 underline-offset-4 font-medium">每天下班回家感到疲惫</span>，
                      想要一个能<span className="underline decoration-primary/40 underline-offset-4 font-medium">彻底放松</span>的角落。
                    </p>
                    <p className="text-sm text-foreground leading-relaxed mt-2">
                      我用大面积的燕麦色和低矮重心的设计，在 25㎡ 里给你留出了无限的心理余地。
                    </p>
                  </div>

                  {/* Multi-angle renders - horizontal scroll */}
                  <div className="mb-6">
                    <p className="text-[10px] text-muted-foreground/60 tracking-wider uppercase mb-3">多角度效果图</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                      {renderImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveRender(i)}
                          className={`flex-shrink-0 w-[70%] rounded-xl overflow-hidden snap-start transition-all ${
                            activeRender === i ? "ring-2 ring-primary/30" : "opacity-70"
                          }`}
                        >
                          <img src={img} alt={`效果图 ${i + 1}`} className="w-full h-40 object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Life scenarios - emotional connection */}
                  <div className="mb-6">
                    <p className="text-[10px] text-muted-foreground/60 tracking-wider uppercase mb-3">想象你的日常</p>
                    <div className="grid grid-cols-2 gap-2">
                      {solution.lifeScenarios.slice(0, 4).map((scene, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08 }}
                          className="bg-secondary/20 rounded-xl p-3"
                        >
                          <p className="text-sm font-medium text-foreground mb-1">{scene.name}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{scene.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════
                  🧐 第二层：专业设计 — 让你看懂为什么这样设计
                  ═══════════════════════════════════════════════ */}
              <div ref={ref("why")}>
                <SectionLabel>专业设计，每一处都有依据</SectionLabel>

                {/* Design concept */}
                <div className="px-6 mb-6">
                  <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">设计理念</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      "Less is More" — 不追求填满空间，而是追求空间的呼吸感。通过精心的留白、合理的比例，营造一个真正用来生活的家。
                    </p>
                  </div>
                </div>

                {/* ── 1. 空间比例解析 ── */}
                <div className="px-6 mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <Grid3X3 className="w-3.5 h-3.5 text-primary/60" />
                    <h3 className="text-sm font-medium text-foreground">空间比例解析</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-4">黄金比例分区，每一寸都有数学依据</p>

                  <div className="rounded-2xl overflow-hidden border border-border/20 mb-3">
                    <img src={proportionImg} alt="空间比例分析图" className="w-full" loading="lazy" width={1024} height={1024} />
                  </div>

                  {/* Proportion data cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { pct: "60%", zone: "会客区", size: "15㎡", desc: "沙发+茶几" },
                      { pct: "30%", zone: "视听区", size: "7.5㎡", desc: "电视+电视柜" },
                      { pct: "10%", zone: "动线区", size: "2.5㎡", desc: "留白通行" },
                    ].map((z, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-secondary/20 rounded-xl p-2.5 text-center"
                      >
                        <span className="font-mono text-lg font-bold text-primary block">{z.pct}</span>
                        <span className="text-[11px] font-medium text-foreground block">{z.zone}</span>
                        <span className="text-[10px] text-muted-foreground">{z.size} · {z.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── 2. 人体工学尺寸 ── */}
                <div className="px-6 mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="w-3.5 h-3.5 text-primary/60" />
                    <h3 className="text-sm font-medium text-foreground">人体工学尺寸</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-4">每个尺寸都基于国标人体工学数据，不是拍脑袋</p>

                  <div className="rounded-2xl overflow-hidden border border-border/20 mb-3">
                    <img src={ergonomicImg} alt="人体工学示意图" className="w-full" loading="lazy" width={1024} height={1024} />
                  </div>

                  <div className="space-y-2">
                    {[
                      { dim: "沙发坐高 42cm", standard: "GB/T 3326", why: "膝盖自然弯曲90°，久坐不压迫血管" },
                      { dim: "茶几高度 45cm", standard: "人机工程学", why: "坐姿手臂自然下垂可触及，拿杯无需弯腰" },
                      { dim: "观影距 2.8m", standard: "THX 标准", why: "55寸电视最佳沉浸距，视角恰好 30°" },
                      { dim: "电视中心 110cm", standard: "SMPTE 推荐", why: "坐姿平视线高度，颈椎零负担" },
                    ].map((e, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        className="flex gap-3 py-2.5 px-3 bg-secondary/10 rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-medium text-foreground">{e.dim}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-primary/8 text-primary/70 rounded font-mono">{e.standard}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{e.why}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── 3. 动线设计 ── */}
                <div className="px-6 mb-8">
                  <h3 className="text-sm font-medium text-foreground mb-1">动线设计</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">三条动线，让你在家里的每一步都是顺的</p>

                  {/* Floorplan with interactive overlay */}
                  <div className="relative rounded-2xl overflow-hidden border border-border/20 mb-4">
                    <img src={floorplanImg} alt="空间布局图" className="w-full" loading="lazy" />
                    {solution.annotations.map((anno, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                        className="absolute group"
                        style={{ left: `${anno.position.x}%`, top: `${anno.position.y}%` }}
                      >
                        <div className="relative">
                          <div className="w-5 h-5 rounded-full bg-primary/80 flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-background" />
                          </div>
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-foreground/90 text-background px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <p className="text-[10px] font-medium">{anno.label}</p>
                            <p className="text-[9px] opacity-80">{anno.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {[
                      { path: "入户 → 沙发 → 阳台", width: "1.2m", note: "主动线，推婴儿车也没问题", emoji: "🚶" },
                      { path: "沙发 → 厨房", width: "0.8m", note: "拿杯水不用绕路", emoji: "☕" },
                      { path: "沙发 → 电视", width: "2.8m", note: "55寸最佳观影距离", emoji: "📺" },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 py-3 px-4 bg-secondary/20 rounded-xl"
                      >
                        <span className="text-lg">{c.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-medium text-foreground">{c.path}</span>
                            <span className="font-mono text-[11px] text-primary font-medium">{c.width}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground/70">{c.note}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── 4. 三层照明系统 ── */}
                <div className="px-6 mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-3.5 h-3.5 text-primary/60" />
                    <h3 className="text-sm font-medium text-foreground">三层照明系统</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3">不是炫技，是让你一键切换到最放松的状态</p>
                  <div className="flex gap-2">
                    {[
                      { layer: "基础照明", temp: "4000K", desc: "自然光，看书不累", color: "hsl(var(--primary))" },
                      { layer: "氛围照明", temp: "3000K", desc: "暖光，下班后放松", color: "hsl(36 80% 60%)" },
                      { layer: "重点照明", temp: "可调", desc: "突出装饰，提升质感", color: "hsl(30 20% 70%)" },
                    ].map((l, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-1 rounded-xl p-3 border border-border/20"
                        style={{ background: `linear-gradient(180deg, ${l.color}08 0%, transparent 100%)` }}
                      >
                        <div className="w-6 h-6 rounded-full mb-2 mx-auto" style={{ background: l.color, boxShadow: `0 0 12px ${l.color}60` }} />
                        <p className="text-[10px] font-medium text-foreground text-center">{l.layer}</p>
                        <p className="text-[9px] text-muted-foreground text-center mt-0.5">{l.temp}</p>
                        <p className="text-[9px] text-muted-foreground/70 text-center">{l.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Scene lighting preview */}
                  <div className="mt-3 bg-secondary/10 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground mb-2">💡 场景模拟：回家后的 3 分钟</p>
                    <div className="space-y-1.5">
                      {[
                        { time: "开门", action: "全部灯光自动开启 → 4000K 自然白光", opacity: 1 },
                        { time: "换鞋坐下", action: "主灯调暗 50%，落地灯开启暖光", opacity: 0.7 },
                        { time: "放松模式", action: "主灯关闭，只留 3000K 氛围灯", opacity: 0.4 },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" style={{ opacity: s.opacity }} />
                          <span className="text-[10px] text-muted-foreground/60 w-12 flex-shrink-0">{s.time}</span>
                          <span className="text-[10px] text-foreground">{s.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── 5. 色彩心理学 ── */}
                <div className="px-6 mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <Palette className="w-3.5 h-3.5 text-primary/60" />
                    <h3 className="text-sm font-medium text-foreground">色彩心理学</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3">每种颜色的比例都经过计算，让你下班后的压力一点点卸掉</p>
                  <div className="flex h-16 rounded-2xl overflow-hidden mb-3">
                    <div className="flex-[4] relative" style={{ backgroundColor: "hsl(36 28% 78%)" }}>
                      <span className="absolute bottom-2 left-3 text-[9px] font-light" style={{ color: "hsl(36 28% 40%)" }}>燕麦色 · 40%</span>
                    </div>
                    <div className="flex-[4] relative" style={{ backgroundColor: "hsl(30 20% 88%)" }}>
                      <span className="absolute bottom-2 left-3 text-[9px] font-light" style={{ color: "hsl(30 20% 50%)" }}>奶白色 · 40%</span>
                    </div>
                    <div className="flex-[2] relative" style={{ backgroundColor: "hsl(150 30% 35%)" }}>
                      <span className="absolute bottom-2 left-2 text-[9px] font-light text-background/80">绿植 · 20%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { color: "燕麦色 40%", role: "主色调", effect: "温暖安全感，降低皮质醇（压力激素）水平" },
                      { color: "奶白色 40%", role: "辅助色", effect: "视觉扩容，25㎡ 看起来像 30㎡" },
                      { color: "绿植 20%", role: "点缀色", effect: "自然生命力，缓解视觉疲劳、提升专注力" },
                    ].map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px]">
                        <span className="text-muted-foreground/50 w-20 flex-shrink-0">{c.color}</span>
                        <span className="text-foreground">{c.effect}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 6. 材料板 Mood Board ── */}
                <div className="px-6 mb-8">
                  <h3 className="text-sm font-medium text-foreground mb-1">材料板 Mood Board</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">5 种材质的碰撞 — 每一种都不是随便选的</p>

                  <div className="rounded-2xl overflow-hidden mb-3">
                    <img src={moodboardImg} alt="材料板" className="w-full" loading="lazy" width={800} height={512} />
                  </div>

                  <div className="space-y-2">
                    {[
                      { material: "白橡木", where: "茶几 · 电视柜 · 地板", why: "温润手感，北欧风灵魂材质，视觉降温" },
                      { material: "科技布", where: "沙发 · 抱枕", why: "纳米防污、透气亲肤，比真皮好打理 10 倍" },
                      { material: "钢化玻璃", where: "茶几台面", why: "8mm 厚度，承重 50kg，通透感放大空间" },
                      { material: "拉丝铝合金", where: "灯具 · 五金件", why: "精致细节，不指纹残留，10 年不氧化" },
                      { material: "鲜植绿叶", where: "龟背竹 · 窗台绿植", why: "天然空气净化器，每片叶子都是装饰品" },
                    ].map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-secondary/10 rounded-xl px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[12px] font-medium text-foreground">{m.material}</span>
                          <span className="text-[9px] text-muted-foreground/50">→ {m.where}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{m.why}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── 7. 材质微距 ── */}
                <div className="px-6 mb-8">
                  <h3 className="text-sm font-medium text-foreground mb-1">肉眼可见的质感</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">不只是"科技布"三个字 —— 看看水滴在面料上滚落</p>
                  <div className="rounded-2xl overflow-hidden">
                    <img src={fabricMacro} alt="科技布微距特写" className="w-full h-44 object-cover" loading="lazy" />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    纳米级防抓防污科技布 · 水滴滚落不留痕 · 养猫家庭的救星
                  </p>
                </div>

                {/* ── 8. 收纳容量规划 ── */}
                <div className="px-6 mb-8">
                  <h3 className="text-sm font-medium text-foreground mb-1">收纳容量规划</h3>
                  <p className="text-[11px] text-muted-foreground mb-3">看不见的整洁，才是真正的高级感</p>

                  <div className="space-y-2">
                    {[
                      { zone: "电视柜", capacity: "120L", items: "遥控器 × 3 + 路由器 + 游戏机 + 线材", type: "隐藏式" },
                      { zone: "茶几下层", capacity: "40L", items: "杂志 × 10 + 果盘 + 纸巾盒", type: "开放式" },
                      { zone: "沙发底部", capacity: "80L", items: "换季毯子 × 2 + 抱枕收纳", type: "翻盖式" },
                    ].map((s, i) => (
                      <div key={i} className="bg-secondary/10 rounded-xl px-3 py-2.5">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[12px] font-medium text-foreground">{s.zone}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] px-1.5 py-0.5 bg-primary/8 text-primary/70 rounded">{s.type}</span>
                            <span className="font-mono text-[11px] text-primary font-medium">{s.capacity}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">装得下：{s.items}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
                    总收纳容量 240L · 客厅零散物品全部"消失"
                  </p>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════
                  🛋️ 第三层：商品清单 — 买的明明白白
                  ═══════════════════════════════════════════════ */}
              <div ref={ref("items")}>
                <SectionLabel>每一件都帮你挑明白了</SectionLabel>

                {/* Price transparency summary */}
                <div className="px-6 mb-5">
                  <div className="bg-accent/[0.04] border border-accent/15 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs font-medium text-accent">价格全透明</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs text-muted-foreground line-through">品牌总价 ¥{totalBrandPrice.toLocaleString()}</span>
                      <ArrowDown className="w-3 h-3 text-accent" />
                      <span className="font-mono text-lg font-medium text-foreground">¥{totalPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-accent mt-1">
                      去掉品牌溢价，直接对接同源工厂，已帮你省 ¥{(totalBrandPrice - totalPrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Product cards with anchor images */}
                <div className="px-6 space-y-3">
                  {mockProducts.map((product, i) => (
                    <ProductAnchorCard key={product.id} product={product} index={i} onSelect={onSelectProduct} />
                  ))}
                </div>
              </div>

              {/* ═══════════════════════════════════════════════
                  ⚡ 第四层：拼团再省 — 最后的跷板
                  ═══════════════════════════════════════════════ */}
              <div ref={ref("save")} className="mt-2">
                <SectionLabel>拼团再省一笔，最后的底价</SectionLabel>

                <div className="px-6 mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    同样的品质，一群人买就是比一个人买便宜。<br />
                    <span className="text-foreground font-medium">先占位锁价，成团后再决定。</span>
                  </p>

                  {/* Group buy savings visualization */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-primary/[0.03] border border-primary/15 rounded-2xl p-5 mb-4"
                  >
                    <div className="text-center mb-4">
                      <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">拼团后全套底价</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-sm text-muted-foreground line-through">¥{totalPrice.toLocaleString()}</span>
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="font-mono text-3xl font-bold text-primary"
                        >
                          ¥{totalGroupBuyPrice.toLocaleString()}
                        </motion.span>
                      </div>
                      <p className="text-xs text-primary mt-1 font-medium">
                        再省 ¥{(totalPrice - totalGroupBuyPrice).toLocaleString()}
                      </p>
                    </div>

                    {/* Per-item group buy status */}
                    <div className="space-y-2.5">
                      {mockProducts.map((product) => {
                        const progress = (product.groupBuy.current / product.groupBuy.target) * 100;
                        const isCustom = product.groupBuy.type === "custom";
                        return (
                          <div key={product.id} className="bg-background/60 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-medium text-foreground">{product.name}</span>
                              <div className="flex items-center gap-1">
                                {isCustom ? <Zap className="w-3 h-3 text-primary" /> : <Users className="w-3 h-3 text-primary" />}
                                <span className="text-[10px] text-primary">
                                  {product.groupBuy.current}/{product.groupBuy.target}{isCustom ? "㎡" : "人"}
                                </span>
                              </div>
                            </div>
                            <div className="relative h-1 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${progress}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[9px] text-muted-foreground">{product.groupBuy.estimatedTime}</span>
                              <span className="text-[10px] text-accent font-medium">
                                底价 ¥{product.groupBuy.targetPrice.toLocaleString()}{isCustom ? `/${product.unit}` : ""}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* Trust guarantees */}
                <div className="px-6 mb-6">
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-3">安心保障</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Factory, text: "头部品牌同源大厂" },
                      { icon: Shield, text: "弄虚作假，全额免单" },
                      { icon: Truck, text: "送装一体，带走垃圾" },
                      { icon: Award, text: "365天只换不修" },
                    ].map((g, i) => (
                      <div key={i} className="flex items-center gap-2 py-2.5 px-3 bg-secondary/10 rounded-xl">
                        <g.icon className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                        <span className="text-[11px] text-foreground">{g.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget flexibility */}
                <div className="px-6 mb-6">
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 border border-accent/15 rounded-xl">
                      <span className="text-[10px] font-medium text-accent block mb-1">预算紧一点？</span>
                      {solution.costOptimization.canSave.slice(0, 1).map((s, i) => (
                        <div key={i}>
                          <span className="text-[11px] text-foreground">{s.item}</span>
                          <span className="font-mono text-[11px] text-accent ml-1">-¥{s.savings.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 p-3 border border-primary/15 rounded-xl">
                      <span className="text-[10px] font-medium text-primary block mb-1">想再好一点？</span>
                      {solution.costOptimization.canUpgrade.slice(0, 1).map((u, i) => (
                        <div key={i}>
                          <span className="text-[11px] text-foreground">{u.item}</span>
                          <span className="font-mono text-[11px] text-primary ml-1">+¥{u.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-8">
                  <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3.5 bg-foreground text-background text-sm font-medium rounded-xl tracking-wide">
                      ⚡ 一键锁定这套方案
                    </button>
                    <button onClick={() => { onModify(); }} className="flex-[0.5] py-3.5 border border-border text-foreground text-sm rounded-xl tracking-wide">
                      💬 微调
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    先占位锁价 · 0 成本 · 成团后再决定
                  </p>
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 mb-5 mt-2">
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-[0.5px] bg-border/30" />
      <div className="w-1 h-1 rounded-full bg-border/40" />
      <div className="flex-1 h-[0.5px] bg-border/30" />
    </div>
    <h2 className="font-serif text-base text-foreground font-normal tracking-wide">{children}</h2>
  </div>
);

/** 商品锚点卡片 — 带产品图，点击进入详情 */
const ProductAnchorCard = ({ product, index, onSelect }: { product: ProductItem; index: number; onSelect: (product: ProductItem) => void }) => {
  const heroImg = product.heroImage || product.textureImage;
  const savingPct = Math.round(((product.brandPrice - product.price) / product.brandPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => onSelect(product)}
      className="bg-secondary/10 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex">
        {/* Product anchor image */}
        {heroImg && (
          <div className="w-28 h-28 flex-shrink-0">
            <img src={heroImg} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] text-muted-foreground">{product.category}</span>
            </div>
            <h3 className="text-[13px] font-medium text-foreground leading-snug">{product.name}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{product.why.slice(0, 30)}...</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-sm font-medium text-foreground">
                ¥{product.price.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground line-through">
                ¥{product.brandPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/10 text-accent font-medium">
              省{savingPct}%
            </span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex items-center pr-3">
          <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
        </div>
      </div>

      {/* Factory origin - subtle */}
      <div className="px-3 pb-2.5 flex items-center gap-1.5">
        <Factory className="w-2.5 h-2.5 text-muted-foreground/40" />
        <span className="text-[9px] text-muted-foreground/60">{product.factory.location} · {product.factory.name}</span>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">
          {product.groupBuy.current}/{product.groupBuy.target}{product.groupBuy.type === "custom" ? "㎡ 拼团中" : "人 拼团中"}
        </span>
      </div>
    </motion.div>
  );
};

export default SolutionSheet;
