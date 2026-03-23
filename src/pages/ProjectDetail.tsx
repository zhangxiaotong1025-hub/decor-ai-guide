import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ChatInput, { type ChatInputHandle } from "@/components/chat/ChatInput";
import MessageBubble from "@/components/chat/MessageBubble";
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

const ProjectDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPrompt = (location.state as { initialPrompt?: string })?.initialPrompt;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ChatInputHandle>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

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

  // Auto-send initial prompt from navigation state
  useEffect(() => {
    if (initialPrompt && !hasSentInitial.current) {
      hasSentInitial.current = true;
      setTimeout(() => handleSend(initialPrompt), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            content: "需求分析完成！我已为您生成了一套专业设计方案，以专家设计师的视角为您量身打造：",
            timestamp: Date.now(),
          },
        ]);
        setTimeout(() => setShowDesignSolution(true), 400);
      }, MOCK_DELAY);
    }, 800);
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

      if (messages.length === 0) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: "好的，我来分析一下您的需求。请稍等片刻...",
              timestamp: Date.now(),
            },
          ]);
          setTimeout(() => setShowAnalysis(true), 400);
        }, MOCK_DELAY);
      } else {
        addAssistantMessage({
          content: "好的，我已记录您的反馈。如果需要调整方案或有其他问题，随时告诉我。",
        });
      }
    },
    [messages, addAssistantMessage]
  );

  const handleViewDetail = useCallback(() => setSheetOpen(true), []);

  const handleModify = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
      addAssistantMessage({
        content: "请告诉我您想调整方案的哪些方面？比如：\n• 更换沙发材质或颜色\n• 调整预算分配\n• 修改风格方向\n• 增减某件商品\n我会实时更新方案。",
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

  const showQuickActions = showDesignSolution && !sheetOpen && !productDetailOpen && !activeAction && !budgetOpen && !groupBuyOpen && !threeDEditorOpen;

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Project header with back button */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">AI 设计助手</h1>
            <span className="text-[10px] text-saving font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-saving inline-block animate-pulse" />
              正在帮你省钱
            </span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 pb-2">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {showAnalysis && (
              <motion.div key="analysis" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <AnalysisProcess onComplete={handleAnalysisComplete} />
                {analysisComplete && <AnalysisResult />}
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
                <span className="text-xs text-muted-foreground ml-1">正在设计方案...</span>
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
    </div>
  );
};

export default ProjectDetail;
