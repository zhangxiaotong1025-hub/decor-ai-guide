import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import MessageBubble from "@/components/chat/MessageBubble";
import AnalysisProcess from "@/components/chat/AnalysisProcess";
import AnalysisResult from "@/components/chat/AnalysisResult";
import QuickOptions from "@/components/chat/QuickOptions";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import type { ChatMessage } from "@/types/chat";

const MOCK_DELAY = 800;

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<"welcome" | "chat">("welcome");
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showAnalysis, analysisComplete, scrollToBottom]);

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

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      if (phase === "welcome") setPhase("chat");

      // Simulate AI response flow
      if (messages.length === 0) {
        // First message → start analysis
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
      } else if (analysisComplete && !messages.some((m) => m.type === "product")) {
        // After analysis confirmed → product recommendations
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content:
                "根据您的客厅开间（约5m），建议选择长度不超过 2.8m 的直排沙发，以预留 1.2m 的通行动线。已为您筛选以下符合需求的方案：",
              timestamp: Date.now(),
              type: "product",
              products: [
                {
                  name: "科技布三人位沙发",
                  spec: "2.8m × 0.95m × 0.85m",
                  material: "科技布 · 高回弹海绵 45kg/m³",
                  price: "¥4,280",
                  tag: "舒适优选",
                },
                {
                  name: "实木圆角茶几",
                  spec: "1.2m × 0.6m × 0.45m",
                  material: "白橡木框架 · 钢化玻璃台面",
                  price: "¥1,680",
                  tag: "比例适配",
                },
                {
                  name: "悬浮式电视柜",
                  spec: "1.8m × 0.4m × 0.35m",
                  material: "实木贴皮 · E0级环保",
                  price: "¥2,560",
                  tag: "轻盈现代",
                },
              ],
            },
          ]);
          // After products, show budget summary
          setTimeout(() => {
            addAssistantMessage({
              content: "",
              type: "budget",
              budget: {
                total: "¥21,820",
                breakdown: [
                  { item: "沙发", cost: "¥4,280", pct: 20 },
                  { item: "茶几", cost: "¥1,680", pct: 8 },
                  { item: "电视柜", cost: "¥2,560", pct: 12 },
                  { item: "灯具", cost: "¥2,300", pct: 11 },
                  { item: "软装配饰", cost: "¥3,500", pct: 16 },
                  { item: "施工费用", cost: "¥7,500", pct: 34 },
                ],
                status: "within",
              },
            });
          }, 1200);
        }, MOCK_DELAY);
      } else {
        addAssistantMessage({
          content:
            "好的，我已记录您的反馈。如果需要调整方案或有其他问题，随时告诉我。",
        });
      }
    },
    [messages, phase, analysisComplete, addAssistantMessage]
  );

  const handleAnalysisComplete = useCallback(() => {
    setAnalysisComplete(true);
  }, []);

  const handleConfirmAnalysis = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: "确认无误，开始设计", timestamp: Date.now() },
    ]);
    handleSend("确认无误，开始设计");
  }, [handleSend]);

  const handleAdjustAnalysis = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: "有些地方需要调整", timestamp: Date.now() },
    ]);
    addAssistantMessage({
      content: "没问题，请告诉我哪些地方需要调整？比如预算、风格偏好、空间用途等。",
    });
  }, [addAssistantMessage]);

  const handleQuickOption = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend]
  );

  return (
    <div className="h-dvh flex flex-col bg-background">
      <ChatHeader />

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <AnimatePresence mode="popLayout">
            {phase === "welcome" && messages.length === 0 && (
              <WelcomeScreen onQuickStart={handleSend} />
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {showAnalysis && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <AnalysisProcess onComplete={handleAnalysisComplete} />
                {analysisComplete && (
                  <AnalysisResult
                    onConfirm={handleConfirmAnalysis}
                    onAdjust={handleAdjustAnalysis}
                  />
                )}
              </motion.div>
            )}

            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-4 py-3 mb-4"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">正在思考...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick options */}
      {analysisComplete &&
        !messages.some((m) => m.type === "product") && (
          <QuickOptions
            options={["确认无误，开始设计", "预算调高一点", "换个风格看看"]}
            onSelect={handleQuickOption}
          />
        )}

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

export default Index;
