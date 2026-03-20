import { useState, useRef, useCallback, useEffect, lazy, Suspense, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Lightbulb, Palette, Move, RotateCcw, Eye, EyeOff,
  Sun, Moon, SlidersHorizontal, MessageSquare, ChevronDown, Sparkles
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
}

const QUICK_COMMANDS = [
  { icon: Sun, label: "晨光模式", command: "切换到晨光模式" },
  { icon: Moon, label: "夜间模式", command: "切换到夜间氛围" },
  { icon: Palette, label: "换沙发材质", command: "沙发换成真皮材质" },
  { icon: Move, label: "重新布局", command: "帮我优化一下家具布局" },
  { icon: Eye, label: "显示标注", command: "显示所有价格标注" },
  { icon: RotateCcw, label: "重置视角", command: "回到俯瞰全景" },
];

const MATERIAL_OPTIONS = [
  { key: "fabric", label: "科技布", color: "#c9bfb0", desc: "防污耐磨" },
  { key: "leather", label: "头层牛皮", color: "#8b7355", desc: "质感高级" },
  { key: "linen", label: "棉麻混纺", color: "#d4cbb8", desc: "自然透气" },
] as const;

const MOCK_RESPONSES: Record<string, { content: string; stateChange?: Partial<SceneState> }> = {
  "切换到晨光模式": {
    content: "已切换到晨光模式 ☀️\n\n阳光从右侧窗户洒入，暖色温光线让燕麦色沙发呈现最温暖的一面。这个时间段适合瑜伽和早餐。",
    stateChange: { lighting: "morning" },
  },
  "切换到夜间氛围": {
    content: "已切换到夜间模式 🌙\n\n落地灯提供柔和的间接照明，整个空间笼罩在温暖的琥珀色调中。这是你下班后最放松的状态。",
    stateChange: { lighting: "night" },
  },
  "沙发换成真皮材质": {
    content: "好的，已将沙发切换为**头层牛皮**材质 🛋️\n\n意大利进口头层牛皮，触感柔软细腻，随使用时间会形成独特包浆。价格会从 ¥4,280 调整到 ¥6,980。\n\n需要我更新预算方案吗？",
    stateChange: { sofaMaterial: "leather", sofaColor: "#8b7355" },
  },
  "显示所有价格标注": {
    content: "已开启全部价格标注 🏷️\n\n你可以看到每件家具的拼团价格。点击任意标注可以直接跳转到商品详情。",
    stateChange: { showAnnotations: true },
  },
  "回到俯瞰全景": {
    content: "已重置到俯瞰视角 👁️\n\n你可以拖动旋转查看各个角度，双指捏合缩放。",
    stateChange: { autoRotate: true, cameraPreset: "overview" },
  },
  "帮我优化一下家具布局": {
    content: "正在分析空间动线... ✨\n\n建议调整：\n1. 茶几向左移 20cm，让沙发到阳台的主动线更宽敞（1.2m → 1.4m）\n2. 落地灯移到沙发右侧，阅读时光线更均匀\n\n已在场景中标注了优化后的位置，你觉得如何？",
  },
};

const getDefaultResponse = (text: string): { content: string; stateChange?: Partial<SceneState> } => {
  if (text.includes("颜色") || text.includes("色")) {
    return { content: "你想换什么颜色呢？我支持调整沙发、茶几、地毯的色系。\n\n比如说：「沙发换成灰蓝色」或「地毯换成深色」" };
  }
  if (text.includes("灯") || text.includes("光")) {
    return { content: "好的，我可以调整灯光氛围。目前支持三种模式：\n\n☀️ **晨光** — 自然暖光\n🌙 **夜读** — 柔和间接光\n🎬 **展示** — 均匀白光\n\n你想切到哪个？", stateChange: { lighting: "studio" } };
  }
  return { content: `收到你的想法 👍\n\n我正在处理「${text}」，请稍等...\n\n在正式接入 AI 后，我可以理解更复杂的空间编辑指令，比如「把电视柜换成悬浮式的」或「加一个读书角在窗边」。` };
};

const ThreeDEditor = ({ isOpen, onClose }: ThreeDEditorProps) => {
  const [messages, setMessages] = useState<EditorMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "欢迎进入 3D 空间编辑 ✨\n\n你可以通过对话来调整场景，比如：\n• 「换个夜间灯光」\n• 「沙发换成真皮的」\n• 「拉近看看茶几」\n\n或者使用下方的快捷操作。",
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [sceneState, setSceneState] = useState<SceneState>({
    lighting: "morning",
    sofaMaterial: "fabric",
    sofaColor: "#c9bfb0",
    showAnnotations: true,
    autoRotate: true,
    cameraPreset: "overview",
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const processCommand = useCallback((text: string) => {
    const userMsg: EditorMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = MOCK_RESPONSES[text] || getDefaultResponse(text);
      if (response.stateChange) {
        setSceneState((prev) => ({ ...prev, ...response.stateChange }));
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.content,
          timestamp: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;
    setInputText("");
    setChatExpanded(true);
    processCommand(trimmed);
  }, [inputText, isTyping, processCommand]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickCommand = useCallback((cmd: string) => {
    setChatExpanded(true);
    processCommand(cmd);
  }, [processCommand]);

  const handleMaterialChange = useCallback((mat: typeof MATERIAL_OPTIONS[number]) => {
    setSceneState((prev) => ({ ...prev, sofaMaterial: mat.key, sofaColor: mat.color }));
    setChatExpanded(true);
    const userMsg: EditorMessage = {
      id: crypto.randomUUID(), role: "user",
      content: `沙发换成${mat.label}`, timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: "assistant",
        content: `已切换为 **${mat.label}** 材质 🛋️\n\n${mat.desc}，你可以旋转查看不同角度的效果。`,
        timestamp: Date.now(),
      }]);
      setIsTyping(false);
    }, 600);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background flex flex-col"
      >
        {/* ── Top bar ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-card/90 backdrop-blur-sm border-b border-border/30 safe-area-top">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-foreground">3D 空间编辑</span>
            <span className="text-[10px] text-muted-foreground/60 ml-1">
              {sceneState.lighting === "morning" ? "☀️ 晨光" : sceneState.lighting === "night" ? "🌙 夜间" : "🎬 展示"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowToolbar(!showToolbar)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* ── 3D Canvas ── */}
        <div className="flex-1 relative overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                <div className="text-center">
                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-4xl mb-3"
                  >
                    🏠
                  </motion.div>
                  <p className="text-sm text-muted-foreground">正在加载 3D 场景...</p>
                </div>
              </div>
            }
          >
            <RoomViewer3D
              className="w-full h-full"
              sceneState={sceneState}
              onSceneStateChange={setSceneState}
            />
          </Suspense>

          {/* ── Quick toolbar (floating, top area) ── */}
          <AnimatePresence>
            {showToolbar && !chatExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-3 left-3 right-3"
              >
                {/* Material selector */}
                <div className="flex gap-1.5 mb-2">
                  {MATERIAL_OPTIONS.map((mat) => (
                    <button
                      key={mat.key}
                      onClick={() => handleMaterialChange(mat)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium backdrop-blur-md transition-all ${
                        sceneState.sofaMaterial === mat.key
                          ? "bg-foreground/80 text-background"
                          : "bg-background/60 text-foreground/70 hover:bg-background/80"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-foreground/10"
                        style={{ backgroundColor: mat.color }}
                      />
                      {mat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Floating hint when chat collapsed ── */}
          {!chatExpanded && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="px-2.5 py-1.5 rounded-lg bg-background/60 backdrop-blur-md text-[10px] text-foreground/70">
                手指拖动旋转 · 捏合缩放
              </div>
              <button
                onClick={() => setSceneState((s) => ({ ...s, showAnnotations: !s.showAnnotations }))}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium backdrop-blur-md transition-all ${
                  sceneState.showAnnotations
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-background/60 text-foreground/80"
                }`}
              >
                {sceneState.showAnnotations ? "🏷️ 隐藏标注" : "🏷️ 显示标注"}
              </button>
            </div>
          )}
        </div>

        {/* ── Chat Agent panel (bottom) ── */}
        <motion.div
          animate={{ height: chatExpanded ? "55%" : "auto" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="flex-shrink-0 bg-card border-t border-border/30 flex flex-col"
          style={{ maxHeight: "60dvh" }}
        >
          {/* Chat header / collapse toggle */}
          <button
            onClick={() => setChatExpanded(!chatExpanded)}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">3D 设计 Agent</span>
              {!chatExpanded && messages.length > 1 && (
                <span className="text-[10px] text-muted-foreground">
                  · {messages[messages.length - 1].content.slice(0, 20)}...
                </span>
              )}
            </div>
            <motion.div animate={{ rotate: chatExpanded ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>

          {/* Quick action chips (always visible) */}
          {!chatExpanded && (
            <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => handleQuickCommand(cmd.command)}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-secondary/50 rounded-lg text-[10px] text-foreground/80 hover:bg-secondary transition-colors"
                >
                  <cmd.icon className="w-3 h-3" />
                  {cmd.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages area */}
          {chatExpanded && (
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                        : "bg-secondary/50 text-foreground rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-muted-foreground/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">正在调整场景...</span>
                </div>
              )}

              {/* Quick commands in chat */}
              <div className="flex gap-1.5 flex-wrap pt-1">
                {QUICK_COMMANDS.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => handleQuickCommand(cmd.command)}
                    className="flex items-center gap-1 px-2 py-1 bg-secondary/40 rounded-md text-[10px] text-foreground/70 hover:bg-secondary transition-colors"
                  >
                    <cmd.icon className="w-2.5 h-2.5" />
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="flex-shrink-0 px-4 py-2.5 border-t border-border/20 pb-safe">
            <div className="flex items-end gap-2 bg-secondary/40 rounded-xl p-1.5">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setChatExpanded(true)}
                placeholder="告诉我你想怎么改..."
                rows={1}
                className="flex-1 bg-transparent text-xs resize-none outline-none placeholder:text-muted-foreground/50 max-h-20 py-1.5 px-2 leading-relaxed"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !inputText.trim()}
                className="flex-shrink-0 p-1.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-30 transition-opacity"
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
