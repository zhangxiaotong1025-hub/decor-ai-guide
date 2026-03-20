import { useState, useRef, useCallback, useEffect, lazy, Suspense, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Palette, RotateCcw, Eye, EyeOff,
  Sun, Moon, SlidersHorizontal, ChevronDown, Sparkles,
  LayoutGrid, Paintbrush, Box, ArrowLeftRight, Check
} from "lucide-react";

const RoomViewer3D = lazy(() => import("./RoomViewer3D"));

interface ThreeDEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface SceneState {
  lighting: "morning" | "night" | "studio";
  sofaMaterial: "fabric" | "leather" | "linen";
  sofaColor: string;
  showAnnotations: boolean;
  autoRotate: boolean;
  cameraPreset: "overview" | "sofa-close" | "tv-area" | "window";
  layoutStyle: "standard" | "open" | "cozy";
  designStyle: "modern-minimal" | "japanese-wabi" | "nordic-warm";
}

type EditorMode = "layout" | "style" | "item" | "spec";

/* ─── Mode definitions ─── */
const MODES: { key: EditorMode; icon: typeof LayoutGrid; label: string; desc: string }[] = [
  { key: "layout", icon: LayoutGrid, label: "空间布局", desc: "AI 智能布局规划" },
  { key: "style", icon: Paintbrush, label: "风格设计", desc: "整体风格定义" },
  { key: "item", icon: Box, label: "单品精调", desc: "选中家具细调" },
  { key: "spec", icon: ArrowLeftRight, label: "规格切换", desc: "材质 / 尺寸 / SKU" },
];

/* ─── Layout options ─── */
const LAYOUT_OPTIONS: { key: SceneState["layoutStyle"]; label: string; desc: string }[] = [
  { key: "standard", label: "标准布局", desc: "经典客厅动线，1.2m主通道" },
  { key: "open", label: "开放式", desc: "最大化空间感，通透大气" },
  { key: "cozy", label: "围合式", desc: "家具围合，温馨对话区" },
];

/* ─── Design style options ─── */
const STYLE_OPTIONS: { key: SceneState["designStyle"]; label: string; desc: string; preview: string }[] = [
  { key: "modern-minimal", label: "现代极简", desc: "Less is more", preview: "#f0ebe4" },
  { key: "japanese-wabi", label: "日式侘寂", desc: "自然素朴之美", preview: "#e6ddd0" },
  { key: "nordic-warm", label: "北欧暖调", desc: "明亮温暖舒适", preview: "#f2ece4" },
];

/* ─── Material (sofa) options ─── */
const MATERIAL_OPTIONS = [
  { key: "fabric" as const, label: "科技布", color: "#c9bfb0", desc: "防污耐磨 · 好打理" },
  { key: "leather" as const, label: "头层牛皮", color: "#8b7355", desc: "越用越有味道" },
  { key: "linen" as const, label: "棉麻混纺", color: "#d4cbb8", desc: "自然亲肤透气" },
];

/* ─── Sofa color options ─── */
const SOFA_COLORS = [
  { label: "燕麦", color: "#c9bfb0" },
  { label: "奶咖", color: "#b8a690" },
  { label: "灰蓝", color: "#8a9aaa" },
  { label: "墨绿", color: "#6a7a68" },
  { label: "焦糖", color: "#a0785a" },
  { label: "烟紫", color: "#9a8a9e" },
];

/* ─── Spec / SKU options ─── */
const SPEC_OPTIONS = [
  { category: "沙发尺寸", options: ["双人位 (1.8m)", "三人位 (2.2m)", "L型 (2.8m)"], active: 2 },
  { category: "茶几规格", options: ["圆形 Ø80cm", "长方形 120×60cm", "椭圆形 100×55cm"], active: 1 },
  { category: "灯具色温", options: ["暖白 3000K", "自然光 4000K", "冷白 5000K"], active: 0 },
];

/* ─── Mock AI responses ─── */
const MOCK_RESPONSES: Record<string, { content: string; stateChange?: Partial<SceneState> }> = {
  "切换到晨光模式": { content: "☀️ 晨光模式 — 阳光从右侧洒入，暖色温映衬出最柔和的家。", stateChange: { lighting: "morning" } },
  "切换到夜间氛围": { content: "🌙 夜间模式 — 落地灯营造出温暖的琥珀色调，这是你最放松的时刻。", stateChange: { lighting: "night" } },
  "展示模式": { content: "🎬 展示模式 — 均匀白光，最适合审视材质细节。", stateChange: { lighting: "studio" } },
  "显示标注": { content: "🏷️ 已开启价格标注", stateChange: { showAnnotations: true } },
  "隐藏标注": { content: "已隐藏标注，享受纯净空间视觉", stateChange: { showAnnotations: false } },
  "重置视角": { content: "👁️ 已重置到全景俯瞰", stateChange: { autoRotate: true, cameraPreset: "overview" } },
};

const getDefaultResponse = (text: string): { content: string; stateChange?: Partial<SceneState> } => {
  if (text.includes("布局") || text.includes("动线")) {
    return { content: "正在分析空间动线...\n\n我建议采用围合式布局，让沙发和茶几形成温馨的对话区，主动线保持 1.2m 以上。\n\n已在左侧面板提供三种布局方案供你选择。" };
  }
  if (text.includes("风格") || text.includes("日式") || text.includes("北欧")) {
    return { content: "风格切换会影响整体色温、材质搭配和空间氛围。你可以在「风格设计」面板中预览对比三种方案。" };
  }
  return { content: `收到 👍 正在处理「${text}」...\n\n接入 AI 后，我可以理解更复杂的指令，比如「窗边加一个阅读角」。` };
};

const ThreeDEditor = ({ isOpen, onClose }: ThreeDEditorProps) => {
  const [messages, setMessages] = useState<EditorMessage[]>([
    {
      id: "welcome", role: "assistant",
      content: "欢迎进入 3D 空间设计 ✨\n\n选择左侧的编辑模式，或直接对话调整场景。",
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<EditorMode>("layout");
  const [showModePanel, setShowModePanel] = useState(true);
  const [sceneState, setSceneState] = useState<SceneState>({
    lighting: "morning",
    sofaMaterial: "fabric",
    sofaColor: "#c9bfb0",
    showAnnotations: true,
    autoRotate: true,
    cameraPreset: "overview",
    layoutStyle: "standard",
    designStyle: "modern-minimal",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const addBotMessage = useCallback((content: string, stateChange?: Partial<SceneState>) => {
    setIsTyping(true);
    setTimeout(() => {
      if (stateChange) setSceneState((prev) => ({ ...prev, ...stateChange }));
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content, timestamp: Date.now() }]);
      setIsTyping(false);
    }, 500);
  }, []);

  const processCommand = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text, timestamp: Date.now() }]);
    const resp = MOCK_RESPONSES[text] || getDefaultResponse(text);
    addBotMessage(resp.content, resp.stateChange);
  }, [addBotMessage]);

  const handleSend = useCallback(() => {
    const t = inputText.trim();
    if (!t || isTyping) return;
    setInputText("");
    setChatExpanded(true);
    processCommand(t);
  }, [inputText, isTyping, processCommand]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* ─── Layout change ─── */
  const handleLayoutChange = useCallback((key: SceneState["layoutStyle"]) => {
    const opt = LAYOUT_OPTIONS.find((o) => o.key === key)!;
    setSceneState((s) => ({ ...s, layoutStyle: key }));
    addBotMessage(`✅ 已切换为「${opt.label}」— ${opt.desc}`, { layoutStyle: key });
  }, [addBotMessage]);

  /* ─── Style change ─── */
  const handleStyleChange = useCallback((key: SceneState["designStyle"]) => {
    const opt = STYLE_OPTIONS.find((o) => o.key === key)!;
    const colorMap: Record<string, string> = { "modern-minimal": "#c9bfb0", "japanese-wabi": "#b8a488", "nordic-warm": "#c4b8a0" };
    setSceneState((s) => ({ ...s, designStyle: key, sofaColor: colorMap[key] || s.sofaColor }));
    addBotMessage(`🎨 已应用「${opt.label}」风格 — ${opt.desc}\n\n色温、材质氛围已整体调整。`, { designStyle: key });
  }, [addBotMessage]);

  /* ─── Material change ─── */
  const handleMaterialChange = useCallback((mat: typeof MATERIAL_OPTIONS[number]) => {
    setSceneState((s) => ({ ...s, sofaMaterial: mat.key, sofaColor: mat.color }));
    addBotMessage(`🛋️ 沙发材质 → **${mat.label}**\n${mat.desc}`, { sofaMaterial: mat.key, sofaColor: mat.color });
  }, [addBotMessage]);

  /* ─── Color change ─── */
  const handleColorChange = useCallback((c: typeof SOFA_COLORS[number]) => {
    setSceneState((s) => ({ ...s, sofaColor: c.color }));
    addBotMessage(`已切换为「${c.label}」色`, { sofaColor: c.color });
  }, [addBotMessage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col"
        style={{ background: "linear-gradient(180deg, #f8f6f3 0%, #efebe6 100%)" }}
      >
        {/* ── Top bar ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-card/80 backdrop-blur-md border-b border-border/20">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-foreground tracking-wide">3D 空间设计</span>
            <div className="flex items-center gap-1 ml-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => { setActiveMode(m.key); setShowModePanel(true); }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                    activeMode === m.key
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground/70 hover:bg-foreground/5"
                  }`}
                >
                  <m.icon className="w-3 h-3" />
                  <span className="hidden min-[420px]:inline">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowModePanel(!showModePanel)}
              className="p-2 hover:bg-secondary/60 rounded-full transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-secondary/60 rounded-full transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* ── 3D Canvas + Side Panel ── */}
        <div className="flex-1 relative overflow-hidden flex">
          {/* Mode panel (overlay on mobile) */}
          <AnimatePresence>
            {showModePanel && (
              <motion.div
                initial={{ x: -260, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -260, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="absolute left-0 top-0 bottom-0 z-20 w-[240px] bg-card/90 backdrop-blur-xl border-r border-border/20 overflow-y-auto"
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">{MODES.find((m) => m.key === activeMode)?.label}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{MODES.find((m) => m.key === activeMode)?.desc}</p>
                    </div>
                    <button onClick={() => setShowModePanel(false)} className="p-1 hover:bg-secondary/50 rounded transition-colors">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>

                  {/* ── Layout mode ── */}
                  {activeMode === "layout" && (
                    <div className="space-y-2">
                      {LAYOUT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleLayoutChange(opt.key)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                            sceneState.layoutStyle === opt.key
                              ? "border-foreground/20 bg-foreground/5"
                              : "border-transparent hover:bg-secondary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-foreground">{opt.label}</span>
                            {sceneState.layoutStyle === opt.key && <Check className="w-3 h-3 text-foreground/60" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                      <div className="mt-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-medium text-primary">AI 布局建议</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          基于 15㎡ 客厅，建议采用「开放式」布局，可最大化采光面并保持 1.4m 主动线宽度。
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── Style mode ── */}
                  {activeMode === "style" && (
                    <div className="space-y-2">
                      {STYLE_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleStyleChange(opt.key)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                            sceneState.designStyle === opt.key
                              ? "border-foreground/20 bg-foreground/5"
                              : "border-transparent hover:bg-secondary/40"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg" style={{ background: opt.preview }} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-medium text-foreground">{opt.label}</span>
                                {sceneState.designStyle === opt.key && <Check className="w-3 h-3 text-foreground/60" />}
                              </div>
                              <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                      {/* Lighting quick toggle */}
                      <div className="mt-3">
                        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">氛围灯光</p>
                        <div className="flex gap-1.5">
                          {([
                            { key: "morning" as const, icon: Sun, label: "晨光" },
                            { key: "night" as const, icon: Moon, label: "夜间" },
                            { key: "studio" as const, icon: Eye, label: "展示" },
                          ]).map((l) => (
                            <button
                              key={l.key}
                              onClick={() => {
                                setSceneState((s) => ({ ...s, lighting: l.key }));
                                addBotMessage(`灯光 → ${l.label}`, { lighting: l.key });
                              }}
                              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                                sceneState.lighting === l.key
                                  ? "bg-foreground/10 text-foreground"
                                  : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                              }`}
                            >
                              <l.icon className="w-3 h-3" />
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Item mode ── */}
                  {activeMode === "item" && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">沙发材质</p>
                        <div className="space-y-1.5">
                          {MATERIAL_OPTIONS.map((mat) => (
                            <button
                              key={mat.key}
                              onClick={() => handleMaterialChange(mat)}
                              className={`w-full flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                                sceneState.sofaMaterial === mat.key
                                  ? "border-foreground/20 bg-foreground/5"
                                  : "border-transparent hover:bg-secondary/40"
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full border border-foreground/10 flex-shrink-0" style={{ backgroundColor: mat.color }} />
                              <div className="text-left">
                                <span className="text-[11px] font-medium text-foreground">{mat.label}</span>
                                <p className="text-[10px] text-muted-foreground">{mat.desc}</p>
                              </div>
                              {sceneState.sofaMaterial === mat.key && <Check className="w-3 h-3 text-foreground/60 ml-auto" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">沙发配色</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {SOFA_COLORS.map((c) => (
                            <button
                              key={c.label}
                              onClick={() => handleColorChange(c)}
                              className={`flex flex-col items-center gap-1 py-2 rounded-xl border transition-all ${
                                sceneState.sofaColor === c.color
                                  ? "border-foreground/20 bg-foreground/5"
                                  : "border-transparent hover:bg-secondary/30"
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full border border-foreground/10" style={{ backgroundColor: c.color }} />
                              <span className="text-[10px] text-muted-foreground">{c.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Spec mode ── */}
                  {activeMode === "spec" && (
                    <div className="space-y-3">
                      {SPEC_OPTIONS.map((spec) => (
                        <div key={spec.category}>
                          <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">{spec.category}</p>
                          <div className="space-y-1">
                            {spec.options.map((opt, i) => (
                              <button
                                key={opt}
                                onClick={() => addBotMessage(`✅ ${spec.category} → ${opt}`)}
                                className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] transition-all ${
                                  i === spec.active
                                    ? "bg-foreground/8 text-foreground font-medium border border-foreground/15"
                                    : "text-muted-foreground hover:bg-secondary/40 border border-transparent"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  {opt}
                                  {i === spec.active && <Check className="w-3 h-3 text-foreground/50" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/30">
                        <p className="text-[10px] text-amber-800/70 leading-relaxed">
                          💡 切换规格会实时更新预算方案。当前组合总价 ¥12,680
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Canvas */}
          <div className="flex-1 relative">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #f8f6f3 0%, #efebe6 100%)" }}>
                  <div className="text-center">
                    <motion.div animate={{ rotateY: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-3xl mb-3">🏠</motion.div>
                    <p className="text-xs text-muted-foreground">正在加载 3D 场景...</p>
                  </div>
                </div>
              }
            >
              <RoomViewer3D className="w-full h-full" sceneState={sceneState} onSceneStateChange={setSceneState} />
            </Suspense>

            {/* Floating controls */}
            {!chatExpanded && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="px-2.5 py-1.5 rounded-lg bg-white/60 backdrop-blur-md text-[10px] text-foreground/60 shadow-sm">
                  拖动旋转 · 捏合缩放
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      const next = !sceneState.showAnnotations;
                      setSceneState((s) => ({ ...s, showAnnotations: next }));
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-white/60 backdrop-blur-md text-foreground/70 shadow-sm hover:bg-white/80 transition-all"
                  >
                    {sceneState.showAnnotations ? <EyeOff className="w-3 h-3 inline mr-1" /> : <Eye className="w-3 h-3 inline mr-1" />}
                    标注
                  </button>
                  <button
                    onClick={() => setSceneState((s) => ({ ...s, autoRotate: true }))}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-white/60 backdrop-blur-md text-foreground/70 shadow-sm hover:bg-white/80 transition-all"
                  >
                    <RotateCcw className="w-3 h-3 inline mr-1" />
                    漫游
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Chat Agent (bottom) ── */}
        <motion.div
          animate={{ height: chatExpanded ? "45%" : "auto" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="flex-shrink-0 bg-card/90 backdrop-blur-md border-t border-border/20 flex flex-col"
          style={{ maxHeight: "55dvh" }}
        >
          <button
            onClick={() => setChatExpanded(!chatExpanded)}
            className="flex items-center justify-between px-4 py-2 hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[11px] font-medium text-foreground">3D 设计 Agent</span>
              {!chatExpanded && messages.length > 1 && (
                <span className="text-[10px] text-muted-foreground ml-1 truncate max-w-[180px]">
                  · {messages[messages.length - 1].content.slice(0, 25)}...
                </span>
              )}
            </div>
            <motion.div animate={{ rotate: chatExpanded ? 180 : 0 }}>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.div>
          </button>

          {chatExpanded && (
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-2.5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-[11px] leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                      : "bg-secondary/40 text-foreground rounded-2xl rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/40"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <div className="flex-shrink-0 px-4 py-2 border-t border-border/15 pb-safe">
            <div className="flex items-end gap-2 bg-secondary/30 rounded-xl p-1.5">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setChatExpanded(true)}
                placeholder="描述你想要的空间效果..."
                rows={1}
                className="flex-1 bg-transparent text-[11px] resize-none outline-none placeholder:text-muted-foreground/40 max-h-20 py-1.5 px-2 leading-relaxed"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !inputText.trim()}
                className="flex-shrink-0 p-1.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-20 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThreeDEditor;
