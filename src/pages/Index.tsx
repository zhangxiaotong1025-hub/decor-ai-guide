import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatTopBar from "@/components/layout/ChatTopBar";
import SidebarDrawer from "@/components/layout/SidebarDrawer";
import DiscoverOverlay from "@/components/layout/DiscoverOverlay";
import ChatInput, { type ChatInputHandle } from "@/components/chat/ChatInput";
import MessageBubble from "@/components/chat/MessageBubble";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import AnalysisProcess from "@/components/chat/AnalysisProcess";
import AnalysisResult from "@/components/chat/AnalysisResult";
import DesignSolutionCard from "@/components/chat/DesignSolutionCard";
import SolutionSheet from "@/components/chat/SolutionSheet";
import ProductDetailCard from "@/components/chat/ProductDetailCard";
import QuickActionBar, { type QuickActionType } from "@/components/chat/QuickActionBar";
import AgentPanel from "@/components/chat/AgentPanel";
import BudgetAgent from "@/components/chat/BudgetAgent";
import GroupBuyPanel from "@/components/groupbuy/GroupBuyPanel";
import { mockDesignSolution } from "@/data/mockDesignSolution";
import type { ChatMessage } from "@/types/chat";
import type { ProductItem } from "@/types/product";

const ThreeDEditor = lazy(() =>
  import("@/components/3d/ThreeDEditor").catch(() => ({
    default: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
        <p className="text-muted-foreground">3D 编辑器加载失败，请刷新重试</p>
      </div>
    ),
  }))
);

const MOCK_DELAY = 800;
const DEFAULT_CHAT_INPUT_HEIGHT = 92;

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<"welcome" | "chat">("welcome");
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showDesignSolution, setShowDesignSolution] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<QuickActionType>(null);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [groupBuyOpen, setGroupBuyOpen] = useState(false);
  const [hasActiveGroupBuy, setHasActiveGroupBuy] = useState(false);
  const [threeDEditorOpen, setThreeDEditorOpen] = useState(false);
  const [chatInputHeight, setChatInputHeight] = useState(DEFAULT_CHAT_INPUT_HEIGHT);

  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(true);
  const [projectTitle, setProjectTitle] = useState<string | undefined>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ChatInputHandle>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showAnalysis, analysisComplete, showDesignSolution, scrollToBottom]);

  useEffect(() => {
    const node = inputContainerRef.current;
    if (!node) return;
    const updateHeight = () => {
      const nextHeight = Math.ceil(node.getBoundingClientRect().height);
      if (nextHeight > 0) setChatInputHeight(nextHeight);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const addAssistantMessage = useCallback(
    (msg: Omit<ChatMessage, "id" | "role" | "timestamp">) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { ...msg, id: crypto.randomUUID(), role: "assistant", timestamp: Date.now() },
        ]);
      }, MOCK_DELAY);
    },
    []
  );

  const handleAnalysisComplete = useCallback(() => {
    setAnalysisComplete(true);
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "方案出来了！👇 和你情况相似的 847 人已经照着装好了，看看适不适合你——",
            timestamp: Date.now(),
          },
        ]);
        setTimeout(() => setShowDesignSolution(true), 400);
      }, MOCK_DELAY);
    }, 800);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setPhase("welcome");
    setIsTyping(false);
    setShowAnalysis(false);
    setAnalysisComplete(false);
    setShowDesignSolution(false);
    setSheetOpen(false);
    setSelectedProduct(null);
    setProductDetailOpen(false);
    setActiveAction(null);
    setBudgetOpen(false);
    setGroupBuyOpen(false);
    setHasActiveGroupBuy(false);
    setThreeDEditorOpen(false);
    setProjectTitle(undefined);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      if (phase === "welcome") {
        setPhase("chat");
        setProjectTitle("新设计方案");
      }

      if (messages.length === 0) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "收到！这个需求太多人问了 🔥 让我马上帮你规划一下——",
              timestamp: Date.now(),
            },
          ]);
          setTimeout(() => setShowAnalysis(true), 400);
        }, MOCK_DELAY);
      } else {
        addAssistantMessage({
          content: "收到，我马上调整！改完给你看效果——",
        });
      }
    },
    [messages, phase, addAssistantMessage]
  );

  const handleViewDetail = useCallback(() => setSheetOpen(true), []);

  const handleModify = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
      addAssistantMessage({
        content: "想改哪里？随便说！比如：\n\n• 「沙发换个颜色」\n• 「预算再压一压」\n• 「风格再温馨一点」\n\n改多少次都行，直到你满意为止 😊",
      });
    }, 300);
  }, [addAssistantMessage]);

  const handleSelectProduct = useCallback((product: ProductItem) => {
    setSelectedProduct(product);
    setProductDetailOpen(true);
  }, []);

  const handleQuickAction = useCallback((type: QuickActionType) => {
    if (type === "budget") { setBudgetOpen(true); return; }
    if (type === "groupbuy") { setGroupBuyOpen(true); return; }
    setActiveAction(type);
  }, []);

  const handleOpenSolutionFromAgent = useCallback(() => {
    setActiveAction(null);
    setSheetOpen(true);
  }, []);

  const handleOpen3DEditor = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setThreeDEditorOpen(true), 300);
  }, []);

  const handleSelectProject = useCallback((id: string) => {
    // For now just show mock — later load real project data
    resetChat();
    setPhase("chat");
    setProjectTitle(id === "proj-1" ? "北欧风客厅方案" : id === "proj-2" ? "日式卧室改造" : "工业风Loft");
    addAssistantMessage({ content: "欢迎回来！上次我们讨论到了这个方案，还需要什么调整吗？" });
  }, [resetChat, addAssistantMessage]);

  const handleDiscoverStartChat = useCallback((prompt: string) => {
    resetChat();
    setDiscoverOpen(false);
    setTimeout(() => handleSend(prompt), 200);
  }, [resetChat, handleSend]);

  const handleDiscoverFillPrompt = useCallback((prompt: string) => {
    resetChat();
    setDiscoverOpen(false);
    setTimeout(() => inputRef.current?.fillText(prompt), 200);
  }, [resetChat]);

  const showQuickActions = showDesignSolution && !sheetOpen && !productDetailOpen && !activeAction && !budgetOpen && !groupBuyOpen && !threeDEditorOpen;

  return (
    <div className="h-dvh flex flex-col bg-background">
      <ChatTopBar
        onMenuOpen={() => setSidebarOpen(true)}
        onNewProject={resetChat}
        onOpenDiscover={() => setDiscoverOpen(true)}
        projectTitle={phase === "chat" ? projectTitle : undefined}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 pb-2">
          <AnimatePresence mode="popLayout">
            {phase === "welcome" && messages.length === 0 && (
              <WelcomeScreen onFillPrompt={(text) => inputRef.current?.fillText(text)} onOpenDiscover={() => setDiscoverOpen(true)} />
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {showAnalysis && (
              <motion.div key="analysis" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <AnalysisProcess onComplete={handleAnalysisComplete} collapsed={showDesignSolution} />
                {analysisComplete && <AnalysisResult collapsed={showDesignSolution} />}
              </motion.div>
            )}

            {showDesignSolution && (
              <motion.div key="design-solution" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <DesignSolutionCard solution={mockDesignSolution} onViewDetail={handleViewDetail} onModify={handleModify} />
              </motion.div>
            )}

            {isTyping && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 px-4 py-3 mb-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">正在帮你出方案，马上好...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showQuickActions && (
        <QuickActionBar onAction={handleQuickAction} activeAction={activeAction} hasActiveGroupBuy={hasActiveGroupBuy} />
      )}

      <AgentPanel activeAction={activeAction} bottomInset={chatInputHeight} onClose={() => setActiveAction(null)} onOpenSolution={handleOpenSolutionFromAgent} onOpenBudget={() => { setActiveAction(null); setBudgetOpen(true); }} />
      <BudgetAgent isOpen={budgetOpen} bottomInset={chatInputHeight} onClose={() => setBudgetOpen(false)} />
      <GroupBuyPanel isOpen={groupBuyOpen} bottomInset={chatInputHeight} onClose={() => setGroupBuyOpen(false)} />

      <SolutionSheet solution={mockDesignSolution} isOpen={sheetOpen} bottomInset={chatInputHeight} onClose={() => setSheetOpen(false)} onModify={handleModify} onSelectProduct={handleSelectProduct} onOpen3DEditor={handleOpen3DEditor} />

      <Suspense fallback={null}>
        <ThreeDEditor isOpen={threeDEditorOpen} onClose={() => setThreeDEditorOpen(false)} />
      </Suspense>

      <ProductDetailCard
        product={selectedProduct}
        isOpen={productDetailOpen}
        bottomInset={chatInputHeight}
        onClose={() => setProductDetailOpen(false)}
        onReserve={(product) => {
          setHasActiveGroupBuy(true);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: `好，${product.name}的价格先帮你留住了 👍\n\n当前进度：**8 / 10 人**\n大概还差 2 人\n\n我这边会继续帮你凑人，有进展第一时间告诉你。你可以在「拼团助手」里随时查看。`,
                timestamp: Date.now(),
              },
            ]);
          }, 1500);
        }}
      />

      <div ref={inputContainerRef} className="relative z-[60]">
        <ChatInput ref={inputRef} onSend={handleSend} disabled={isTyping} />
      </div>

      {/* Sidebar drawer */}
      <SidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewProject={resetChat}
        onSelectProject={handleSelectProject}
        onOpenDiscover={() => setDiscoverOpen(true)}
        onOpenGroupBuy={() => { setSidebarOpen(false); setGroupBuyOpen(true); }}
        activeProjectId={undefined}
      />

      {/* Discover overlay */}
      <DiscoverOverlay
        isOpen={discoverOpen}
        onClose={() => setDiscoverOpen(false)}
        onStartChat={handleDiscoverStartChat}
        onFillPrompt={handleDiscoverFillPrompt}
      />
    </div>
  );
};

export default Index;
