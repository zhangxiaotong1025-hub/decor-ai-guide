import { useState, useRef, useCallback, useEffect, lazy, Suspense, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Eye, EyeOff, Sun, Moon, Check,
  LayoutGrid, Paintbrush, Box, ArrowLeftRight,
  Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Undo2, Redo2, Camera, Share2, MoreHorizontal,
  Wand2, ShoppingCart, Heart, BookImage, Star,
  Map, Move3d, Ruler, Video, Grid3x3,
  Home, Mic, MicOff, Plus, Image as ImageIcon
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

/* ─── View modes (bottom bar) ─── */
type ViewMode = "roam" | "grid" | "full";

/* ─── More menu items ─── */
const MORE_MENU_ITEMS = [
  { key: "ai-design", icon: Wand2, label: "智能设计" },
  { key: "product-list", icon: ShoppingCart, label: "商品清单" },
  { key: "interest", icon: Heart, label: "加入意向" },
  { key: "album", icon: BookImage, label: "相册" },
  { key: "favorite", icon: Star, label: "收藏" },
  { key: "divider1", icon: null, label: "" },
  { key: "nav-map", icon: Map, label: "导航地图", toggle: true },
  { key: "position-handle", icon: Move3d, label: "位置手柄", toggle: true },
  { key: "baseline", icon: Ruler, label: "水平基准线", toggle: true },
];

/* ─── Edit panel modes ─── */
type EditPanelMode = "layout" | "style" | "item" | "spec";

const EDIT_MODES: { key: EditPanelMode; icon: typeof LayoutGrid; label: string }[] = [
  { key: "layout", icon: LayoutGrid, label: "空间布局" },
  { key: "style", icon: Paintbrush, label: "风格设计" },
  { key: "item", icon: Box, label: "单品精调" },
  { key: "spec", icon: ArrowLeftRight, label: "规格切换" },
];

/* ─── Data ─── */
const LAYOUT_OPTIONS: { key: SceneState["layoutStyle"]; label: string; desc: string }[] = [
  { key: "standard", label: "标准布局", desc: "经典客厅动线，1.2m主通道" },
  { key: "open", label: "开放式", desc: "最大化空间感，通透大气" },
  { key: "cozy", label: "围合式", desc: "家具围合，温馨对话区" },
];

const STYLE_OPTIONS: { key: SceneState["designStyle"]; label: string; desc: string; preview: string }[] = [
  { key: "modern-minimal", label: "现代极简", desc: "Less is more", preview: "#f0ebe4" },
  { key: "japanese-wabi", label: "日式侘寂", desc: "自然素朴之美", preview: "#e6ddd0" },
  { key: "nordic-warm", label: "北欧暖调", desc: "明亮温暖舒适", preview: "#f2ece4" },
];

const MATERIAL_OPTIONS = [
  { key: "fabric" as const, label: "科技布", color: "#c9bfb0", desc: "防污耐磨" },
  { key: "leather" as const, label: "头层牛皮", color: "#8b7355", desc: "越用越有味道" },
  { key: "linen" as const, label: "棉麻混纺", color: "#d4cbb8", desc: "自然亲肤" },
];

const SOFA_COLORS = [
  { label: "燕麦", color: "#c9bfb0" },
  { label: "奶咖", color: "#b8a690" },
  { label: "灰蓝", color: "#8a9aaa" },
  { label: "墨绿", color: "#6a7a68" },
  { label: "焦糖", color: "#a0785a" },
  { label: "烟紫", color: "#9a8a9e" },
];

const SPEC_OPTIONS = [
  { category: "沙发尺寸", options: ["双人位 (1.8m)", "三人位 (2.2m)", "L型 (2.8m)"], active: 2 },
  { category: "茶几规格", options: ["圆形 Ø80cm", "长方形 120×60cm", "椭圆形 100×55cm"], active: 1 },
  { category: "灯具色温", options: ["暖白 3000K", "自然光 4000K", "冷白 5000K"], active: 0 },
];

/* ─── Mock AI ─── */
const MOCK_RESPONSES: Record<string, { content: string; stateChange?: Partial<SceneState> }> = {
  "切换到晨光模式": { content: "☀️ 晨光模式", stateChange: { lighting: "morning" } },
  "切换到夜间氛围": { content: "🌙 夜间模式", stateChange: { lighting: "night" } },
  "显示标注": { content: "🏷️ 已开启标注", stateChange: { showAnnotations: true } },
  "隐藏标注": { content: "已隐藏标注", stateChange: { showAnnotations: false } },
  "重置视角": { content: "👁️ 已重置到全景", stateChange: { autoRotate: true, cameraPreset: "overview" } },
};

const getDefaultResponse = (text: string): { content: string; stateChange?: Partial<SceneState> } => {
  if (text.includes("布局")) return { content: "建议采用围合式布局，主动线保持 1.2m 以上。" };
  if (text.includes("风格")) return { content: "可在「功能栏」中切换风格预览。" };
  return { content: `收到 👍 正在处理「${text}」...` };
};

/* ═══════════════════════════════════════════
   Main ThreeDEditor Component
   ═══════════════════════════════════════════ */
const ThreeDEditor = ({ isOpen, onClose }: ThreeDEditorProps) => {
  const [messages, setMessages] = useState<EditorMessage[]>([
    { id: "welcome", role: "assistant", content: "欢迎进入 3D 空间设计 ✨\n选择底部模式或直接对话调整场景。", timestamp: Date.now() },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("roam");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editPanelMode, setEditPanelMode] = useState<EditPanelMode>("layout");
  const [showCameraControl, setShowCameraControl] = useState(false);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({ "nav-map": true, "baseline": true });
  const [isRecording, setIsRecording] = useState(false);
  const [sceneState, setSceneState] = useState<SceneState>({
    lighting: "morning", sofaMaterial: "fabric", sofaColor: "#c9bfb0",
    showAnnotations: true, autoRotate: true, cameraPreset: "overview",
    layoutStyle: "standard", designStyle: "modern-minimal",
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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleLayoutChange = useCallback((key: SceneState["layoutStyle"]) => {
    const opt = LAYOUT_OPTIONS.find((o) => o.key === key)!;
    setSceneState((s) => ({ ...s, layoutStyle: key }));
    addBotMessage(`✅「${opt.label}」— ${opt.desc}`, { layoutStyle: key });
  }, [addBotMessage]);

  const handleStyleChange = useCallback((key: SceneState["designStyle"]) => {
    const opt = STYLE_OPTIONS.find((o) => o.key === key)!;
    const colorMap: Record<string, string> = { "modern-minimal": "#c9bfb0", "japanese-wabi": "#b8a488", "nordic-warm": "#c4b8a0" };
    setSceneState((s) => ({ ...s, designStyle: key, sofaColor: colorMap[key] || s.sofaColor }));
    addBotMessage(`🎨「${opt.label}」— ${opt.desc}`, { designStyle: key });
  }, [addBotMessage]);

  const handleMaterialChange = useCallback((mat: typeof MATERIAL_OPTIONS[number]) => {
    setSceneState((s) => ({ ...s, sofaMaterial: mat.key, sofaColor: mat.color }));
    addBotMessage(`🛋️ ${mat.label} · ${mat.desc}`, { sofaMaterial: mat.key, sofaColor: mat.color });
  }, [addBotMessage]);

  const handleColorChange = useCallback((c: typeof SOFA_COLORS[number]) => {
    setSceneState((s) => ({ ...s, sofaColor: c.color }));
  }, []);

  const toggleMenuItem = useCallback((key: string) => {
    setToggleStates((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleMoreAction = useCallback((key: string) => {
    setShowMoreMenu(false);
    if (key === "ai-design") { setShowEditPanel(true); setEditPanelMode("style"); }
    else if (key === "product-list") { setShowEditPanel(true); setEditPanelMode("spec"); }
    else addBotMessage(`已打开「${MORE_MENU_ITEMS.find((i) => i.key === key)?.label}」`);
  }, [addBotMessage]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      setInputText((p) => p + (p ? " " : "") + "沙发换成灰蓝色");
    } else {
      setIsRecording(true);
      setTimeout(() => setIsRecording(false), 8000);
    }
  }, [isRecording]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col"
        style={{ background: "#1a1a1a" }}
      >

        {/* ═══ TOP TOOLBAR ═══ */}
        <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 safe-area-top" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)" }}>
          {/* Left group */}
          <div className="flex items-center gap-1">
            {[
              { icon: X, action: onClose, label: "关闭" },
              { icon: Camera, action: () => addBotMessage("📸 已截取当前视角"), label: "截图" },
              { icon: Undo2, action: () => {}, label: "撤销" },
              { icon: Redo2, action: () => {}, label: "重做" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <btn.icon className="w-[18px] h-[18px]" />
              </button>
            ))}
          </div>

          {/* Right group */}
          <div className="flex items-center gap-1">
            {[
              { icon: Share2, action: () => addBotMessage("🔗 已生成分享链接"), label: "分享" },
              { icon: ImageIcon, action: () => addBotMessage("🖥️ 正在生成效果图..."), label: "效果图" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <btn.icon className="w-[18px] h-[18px]" />
              </button>
            ))}
            {/* More menu trigger */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`p-2.5 rounded-full transition-all active:scale-95 ${showMoreMenu ? "text-white bg-white/15" : "text-white/70 hover:text-white hover:bg-white/10"}`}
              >
                <MoreHorizontal className="w-[18px] h-[18px]" />
              </button>

              {/* More menu dropdown */}
              <AnimatePresence>
                {showMoreMenu && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-30"
                      onClick={() => setShowMoreMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      className="absolute right-0 top-full mt-1 z-40 w-48 py-1.5 rounded-xl bg-card shadow-2xl border border-border/30"
                    >
                      {/* Scheme name */}
                      <div className="px-3 py-2 border-b border-border/20">
                        <p className="text-[11px] text-muted-foreground truncate">方案名称XXXXX...</p>
                      </div>
                      {MORE_MENU_ITEMS.map((item) => {
                        if (item.icon === null) return <div key={item.key} className="my-1 border-t border-border/20" />;
                        return (
                          <button
                            key={item.key}
                            onClick={() => item.toggle ? toggleMenuItem(item.key) : handleMoreAction(item.key)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-secondary/40 transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="flex-1 text-[12px] text-foreground">{item.label}</span>
                            {item.toggle && toggleStates[item.key] && <Check className="w-3.5 h-3.5 text-foreground/60" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ═══ 3D CANVAS ═══ */}
        <div className="flex-1 relative overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-black/50">
                <motion.div animate={{ rotateY: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-3xl">🏠</motion.div>
              </div>
            }
          >
            <RoomViewer3D className="w-full h-full" sceneState={sceneState} onSceneStateChange={setSceneState} />
          </Suspense>

          {/* ── Edit panel (slide from bottom-left) ── */}
          <AnimatePresence>
            {showEditPanel && (
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="absolute left-0 top-0 bottom-0 z-20 w-[250px] flex flex-col"
                style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)" }}
              >
                {/* Panel header */}
                <div className="flex items-center justify-between px-3 pt-3 pb-2">
                  <div className="flex items-center gap-1">
                    {EDIT_MODES.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setEditPanelMode(m.key)}
                        className={`p-1.5 rounded-lg transition-all ${
                          editPanelMode === m.key ? "bg-foreground/10 text-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowEditPanel(false)} className="p-1.5 hover:bg-foreground/5 rounded-lg transition-colors">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="px-3 pb-2">
                  <h3 className="text-[11px] font-semibold text-foreground">{EDIT_MODES.find((m) => m.key === editPanelMode)?.label}</h3>
                </div>

                {/* Panel content */}
                <div className="flex-1 overflow-y-auto px-3 pb-3">
                  {editPanelMode === "layout" && (
                    <div className="space-y-1.5">
                      {LAYOUT_OPTIONS.map((opt) => (
                        <button key={opt.key} onClick={() => handleLayoutChange(opt.key)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all ${sceneState.layoutStyle === opt.key ? "border-foreground/20 bg-foreground/5" : "border-transparent hover:bg-secondary/30"}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-foreground">{opt.label}</span>
                            {sceneState.layoutStyle === opt.key && <Check className="w-3 h-3 text-foreground/50" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                      <div className="mt-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-medium text-primary">AI 布局建议</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          建议「开放式」，最大化采光面，1.4m 主动线。
                        </p>
                      </div>
                    </div>
                  )}

                  {editPanelMode === "style" && (
                    <div className="space-y-1.5">
                      {STYLE_OPTIONS.map((opt) => (
                        <button key={opt.key} onClick={() => handleStyleChange(opt.key)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all ${sceneState.designStyle === opt.key ? "border-foreground/20 bg-foreground/5" : "border-transparent hover:bg-secondary/30"}`}>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-lg flex-shrink-0" style={{ background: opt.preview }} />
                            <div>
                              <span className="text-[11px] font-medium text-foreground">{opt.label}</span>
                              <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                            </div>
                            {sceneState.designStyle === opt.key && <Check className="w-3 h-3 text-foreground/50 ml-auto" />}
                          </div>
                        </button>
                      ))}
                      <div className="mt-2">
                        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">氛围灯光</p>
                        <div className="flex gap-1.5">
                          {([
                            { key: "morning" as const, icon: Sun, label: "晨光" },
                            { key: "night" as const, icon: Moon, label: "夜间" },
                            { key: "studio" as const, icon: Eye, label: "展示" },
                          ]).map((l) => (
                            <button key={l.key}
                              onClick={() => setSceneState((s) => ({ ...s, lighting: l.key }))}
                              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                                sceneState.lighting === l.key ? "bg-foreground/10 text-foreground" : "bg-secondary/40 text-muted-foreground"
                              }`}>
                              <l.icon className="w-3 h-3" />{l.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {editPanelMode === "item" && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">沙发材质</p>
                        <div className="space-y-1">
                          {MATERIAL_OPTIONS.map((mat) => (
                            <button key={mat.key} onClick={() => handleMaterialChange(mat)}
                              className={`w-full flex items-center gap-2 p-2 rounded-xl border transition-all ${sceneState.sofaMaterial === mat.key ? "border-foreground/20 bg-foreground/5" : "border-transparent hover:bg-secondary/30"}`}>
                              <span className="w-4 h-4 rounded-full flex-shrink-0 border border-foreground/10" style={{ backgroundColor: mat.color }} />
                              <div className="text-left flex-1">
                                <span className="text-[11px] font-medium text-foreground">{mat.label}</span>
                                <p className="text-[9px] text-muted-foreground">{mat.desc}</p>
                              </div>
                              {sceneState.sofaMaterial === mat.key && <Check className="w-3 h-3 text-foreground/50" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">配色</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {SOFA_COLORS.map((c) => (
                            <button key={c.label} onClick={() => handleColorChange(c)}
                              className={`flex flex-col items-center gap-1 py-1.5 rounded-xl border transition-all ${sceneState.sofaColor === c.color ? "border-foreground/20 bg-foreground/5" : "border-transparent hover:bg-secondary/20"}`}>
                              <span className="w-4 h-4 rounded-full border border-foreground/10" style={{ backgroundColor: c.color }} />
                              <span className="text-[9px] text-muted-foreground">{c.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {editPanelMode === "spec" && (
                    <div className="space-y-2.5">
                      {SPEC_OPTIONS.map((spec) => (
                        <div key={spec.category}>
                          <p className="text-[10px] text-muted-foreground mb-1 font-medium">{spec.category}</p>
                          <div className="space-y-0.5">
                            {spec.options.map((opt, i) => (
                              <button key={opt} onClick={() => addBotMessage(`✅ ${spec.category} → ${opt}`)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${i === spec.active ? "bg-foreground/8 text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/30"}`}>
                                <div className="flex items-center justify-between">{opt}{i === spec.active && <Check className="w-3 h-3 text-foreground/50" />}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Camera joystick controls (right side) ── */}
          <AnimatePresence>
            {showCameraControl && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-3 bottom-20 z-20 flex gap-3"
              >
                {/* 镜头升降 */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-white/50 mb-0.5">镜头升降</span>
                  <button className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/60 active:scale-95 transition-all">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/60 active:scale-95 transition-all">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                {/* 镜头平移 */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] text-white/50 mb-0.5">镜头平移</span>
                  <button className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/60 active:scale-95 transition-all">
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <div className="flex gap-0.5">
                    <button className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/60 active:scale-95 transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/60 active:scale-95 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/60 active:scale-95 transition-all">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ BOTTOM BAR ═══ */}
        <div className="flex-shrink-0" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
          {/* View mode tabs + action buttons */}
          <div className="flex items-center justify-between px-3 py-2">
            {/* Left: view modes */}
            <div className="flex items-center gap-0.5 bg-white/8 rounded-xl p-0.5">
              {([
                { key: "roam" as ViewMode, label: "漫游" },
                { key: "grid" as ViewMode, icon: Grid3x3, label: "" },
                { key: "full" as ViewMode, label: "全屋" },
              ]).map((vm) => (
                <button
                  key={vm.key}
                  onClick={() => setViewMode(vm.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    viewMode === vm.key ? "bg-white/20 text-white" : "text-white/50 hover:text-white/70"
                  }`}
                >
                  {vm.icon && <vm.icon className="w-3.5 h-3.5" />}
                  {vm.label}
                </button>
              ))}
            </div>

            {/* Right: camera + AI agent */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowCameraControl(!showCameraControl)}
                className={`p-2.5 rounded-full transition-all active:scale-95 ${
                  showCameraControl ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Video className="w-[18px] h-[18px]" />
              </button>
              <button
                onClick={() => { setChatExpanded(!chatExpanded); setShowEditPanel(false); }}
                className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all active:scale-95 ${
                  chatExpanded ? "bg-primary text-primary-foreground" : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-medium">AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ AI CHAT PANEL (slides up from bottom bar) ═══ */}
        <AnimatePresence>
          {chatExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "45dvh", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="flex-shrink-0 flex flex-col overflow-hidden"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)" }}
            >
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-medium text-white">3D 设计 Agent</span>
                </div>
                {/* Edit panel toggle */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setShowEditPanel(!showEditPanel); }}
                    className="px-2 py-1 rounded-lg text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    功能面板
                  </button>
                  <button onClick={() => setChatExpanded(false)} className="p-1 text-white/40 hover:text-white transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 text-[11px] leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                        : "bg-white/10 text-white/90 rounded-2xl rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-1 h-1 rounded-full bg-white/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex-shrink-0 px-4 py-2 border-t border-white/10 pb-safe">
                <div className="flex items-end gap-1.5 bg-white/10 rounded-xl p-1.5">
                  <button
                    onClick={() => setShowEditPanel(!showEditPanel)}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${showEditPanel ? "bg-white/15 text-white rotate-45" : "text-white/50 hover:text-white"}`}
                  >
                    <Plus className="w-4 h-4 transition-transform" />
                  </button>
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="描述你想要的空间效果..."
                    rows={1}
                    className="flex-1 bg-transparent text-[11px] text-white resize-none outline-none placeholder:text-white/30 max-h-20 py-1.5 px-1 leading-relaxed"
                  />
                  <button
                    onClick={toggleRecording}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${isRecording ? "bg-red-500/30 text-red-400" : "text-white/50 hover:text-white"}`}
                  >
                    {isRecording ? (
                      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                        <MicOff className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isTyping || !inputText.trim()}
                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${inputText.trim() && !isTyping ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/20"}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThreeDEditor;
