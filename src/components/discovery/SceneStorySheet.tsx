import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Sparkles, Factory, TrendingDown, Zap, Gift } from "lucide-react";
import type { SceneStory } from "@/data/mockSceneStories";

interface SceneStorySheetProps {
  story: SceneStory | null;
  isOpen: boolean;
  bottomInset?: number;
  onClose: () => void;
  onStartChat: (prompt: string) => void;
  /** 填入输入框而非直接发送 */
  onFillPrompt?: (prompt: string) => void;
}

const SceneStorySheet = ({ story, isOpen, bottomInset = 0, onClose, onStartChat, onFillPrompt }: SceneStorySheetProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ top: 0 });
      setScrolled(false);
    }
  }, [isOpen, story?.id]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrolled(scrollRef.current.scrollTop > 50);
    }
  }, []);

  const handleCustomize = useCallback((prompt: string) => {
    onClose();
    setTimeout(() => {
      if (onFillPrompt) {
        onFillPrompt(prompt);
      } else {
        onStartChat(prompt);
      }
    }, 300);
  }, [onClose, onFillPrompt, onStartChat]);

  if (!story) return null;

  const saved = story.brandTotal - story.ourTotal;
  const savedPct = Math.round((saved / story.brandTotal) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 bg-foreground/20 z-[65]"
            style={{ bottom: bottomInset }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed left-0 right-0 z-[70] bg-background flex flex-col top-[env(safe-area-inset-top,0px)] rounded-t-[20px]"
            style={{
              bottom: bottomInset,
              boxShadow: "0 -4px 40px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 relative z-10">
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-[3px] bg-muted-foreground/15 rounded-full" />
              </div>
              <div className="flex items-center px-5 py-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: scrolled ? 1 : 0 }}
                  className="text-xs font-medium text-foreground truncate flex-1"
                >
                  {story.persona}的家
                </motion.span>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overscroll-contain"
            >
              {/* ═══ Hero image ═══ */}
              <div className="relative">
                <img
                  src={story.heroImage}
                  alt={story.hook}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                {/* Price shock overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-button bg-primary-foreground/90 text-foreground font-medium">
                      {story.persona}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-button bg-foreground/40 text-primary-foreground backdrop-blur-sm">
                      {story.area} {story.roomType}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground leading-snug mb-3">
                    {story.hook}
                  </h2>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-data text-2xl font-bold text-foreground">
                      ¥{story.ourTotal.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground line-through font-mono-data">
                      ¥{story.brandTotal.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-button bg-shock/90 text-primary-foreground">
                      省 {savedPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* ═══ 第一层：故事共鸣 ═══ */}
              <div className="px-5 pt-5 pb-6">
                <SectionTitle emoji="📖" title="TA 的故事" />
                <p className="text-sm text-foreground leading-relaxed mt-3">
                  {story.backstory}
                </p>
                <div className="mt-4 px-4 py-3 bg-shock/5 border border-shock/10 rounded-xl">
                  <p className="text-xs text-shock font-medium">
                    💢 {story.painPoint}
                  </p>
                </div>
              </div>

              {/* ═══ 第二层：方案亮点 ═══ */}
              <div className="px-5 pb-6">
                <SectionTitle emoji="✨" title="方案怎么解决的" />
                <div className="mt-3 space-y-2.5">
                  {story.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2.5 py-2.5 px-3.5 bg-secondary/30 rounded-xl"
                    >
                      <span className="text-sm mt-0.5">✓</span>
                      <span className="text-sm text-foreground leading-relaxed">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ═══ 第三层：省钱明细 ═══ */}
              <div className="px-5 pb-6">
                <SectionTitle emoji="💰" title="每一分钱花在哪" />
                <div className="mt-3 space-y-2">
                  {story.products.map((p, i) => {
                    const itemSaved = p.brandPrice - p.ourPrice;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center justify-between py-3 px-4 bg-secondary/15 rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground">{p.category}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{p.name}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono-data text-sm font-semibold text-foreground">
                              ¥{p.ourPrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-muted-foreground line-through font-mono-data">
                              ¥{p.brandPrice.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[10px] text-saving font-medium">
                            省 ¥{itemSaved.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Total savings banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="mt-4 p-4 bg-saving/8 border border-saving/15 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-saving" />
                      <span className="text-sm font-medium text-foreground">总共省下</span>
                    </div>
                    <span className="font-mono-data text-xl font-bold text-saving">
                      ¥{saved.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    同样的品质，品牌店要 ¥{story.brandTotal.toLocaleString()}，我们直接工厂拿货
                  </p>
                </motion.div>
              </div>

              {/* ═══ 第四层：社交证明 ═══ */}
              <div className="px-5 pb-8">
                <SectionTitle emoji="🔥" title="和你一样的人都在行动" />

                <div className="mt-3 flex items-center gap-3 py-3 px-4 bg-secondary/15 rounded-xl">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{story.socialProof}</span>
                </div>

                <div className="mt-2 flex items-center gap-3 py-3 px-4 bg-secondary/15 rounded-xl">
                  <Factory className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">全部来自品牌同源代工厂，品质一模一样</span>
                </div>

                <div className="mt-4 p-4 bg-shock/5 border border-shock/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shock opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-shock" />
                    </span>
                    <span className="text-xs font-medium text-shock">拼团进行中</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    同款方案还有 <span className="font-mono-data font-bold text-shock">3</span> 个拼团坑位，满员后价格可能上调
                  </p>
                </div>

                <p className="text-center text-[10px] text-muted-foreground mt-6">
                  AI 会根据你的面积和预算，生成你的专属方案
                </p>
              </div>
            </div>

            {/* ═══ 底部固定 CTA ═══ */}
            <div className="flex-shrink-0 px-5 py-3 border-t border-border bg-background/95 backdrop-blur-sm">
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleCustomize(`我喜欢${story.persona}这套方案的风格，但我的情况不太一样，帮我调整一下`)}
                  className="flex-1 flex items-center justify-center gap-1 py-3 border border-border text-foreground text-xs font-medium rounded-xl hover:bg-secondary transition-colors"
                >
                  改改再用
                  <ChevronRight className="w-3 h-3" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCustomize(story.chatPrompt)}
                  className="flex-[1.5] flex items-center justify-center gap-1.5 py-3 bg-foreground text-background text-xs font-semibold rounded-xl shadow-elevated"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  开始定制我的方案
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SectionTitle = ({ emoji, title }: { emoji: string; title: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm">{emoji}</span>
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
);

export default SceneStorySheet;
