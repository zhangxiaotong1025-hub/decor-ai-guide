import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, LayoutGrid, Sparkles, MessageCircle } from "lucide-react";
import SceneStoryCard from "@/components/discovery/SceneStoryCard";
import DiscoveryFeed from "@/components/discovery/DiscoveryFeed";
import SceneStorySheet from "@/components/discovery/SceneStorySheet";
import { mockSceneStories, storyCategories, type SceneStory } from "@/data/mockSceneStories";

interface DiscoverOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (prompt: string) => void;
  onFillPrompt?: (prompt: string) => void;
}

const DiscoverOverlay = ({ isOpen, onClose, onStartChat, onFillPrompt }: DiscoverOverlayProps) => {
  const [selectedStory, setSelectedStory] = useState<SceneStory | null>(null);
  const [storySheetOpen, setStorySheetOpen] = useState(false);
  const [showFullList, setShowFullList] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelectStory = useCallback((story: SceneStory) => {
    setSelectedStory(story);
    setStorySheetOpen(true);
  }, []);

  const handleStartChat = useCallback(
    (prompt: string) => {
      setStorySheetOpen(false);
      setTimeout(() => {
        onClose();
        onStartChat(prompt);
      }, 200);
    },
    [onClose, onStartChat]
  );

  const handleViewAll = useCallback(() => {
    setShowFullList(true);
    // 切换后滚到顶部
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), 50);
  }, []);

  const handleBack = useCallback(() => {
    if (showFullList) {
      setShowFullList(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), 50);
    } else {
      onClose();
    }
  }, [showFullList, onClose]);

  const filtered = activeCategory === "all"
    ? mockSceneStories
    : mockSceneStories.filter((s) => s.category === activeCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-0 z-[90] bg-background flex flex-col"
        >
          {/* Header - 始终固定 */}
          <header className="flex-shrink-0 px-3 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-[18px] h-[18px]" />
              </motion.button>
              <h1 className="flex-1 text-sm font-semibold text-center">
                {showFullList ? "全部灵感方案" : "灵感发现"}
              </h1>
              {!showFullList ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleViewAll}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                >
                  <LayoutGrid className="w-[18px] h-[18px]" />
                </motion.button>
              ) : (
                <div className="w-8" />
              )}
            </div>
          </header>

          {/* 全列表模式：sticky AI入口 + 筛选条 */}
          {showFullList && (
            <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border">
              <div className="max-w-2xl mx-auto px-4">
                {/* AI 快捷入口 */}
                <div className="flex gap-2 pt-3 pb-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStartChat("我想装修，帮我出个方案")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-elevated"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI 出方案
                  </motion.button>
                  <button
                    onClick={() => handleStartChat("我随便看看，还没想好要什么风格")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    先聊聊
                  </button>
                </div>

                {/* 分类筛选条 */}
                <div className="pb-3 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2">
                    {storyCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors ${
                          activeCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 滚动区域 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <AnimatePresence mode="wait">
                {showFullList ? (
                  <motion.div
                    key={`full-${activeCategory}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {filtered.map((story, i) => (
                      <SceneStoryCard key={story.id} story={story} index={i} onTap={handleSelectStory} />
                    ))}
                    {filtered.length === 0 && (
                      <div className="py-12 text-center">
                        <p className="text-sm text-muted-foreground">该分类暂无方案，换一个看看？</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="featured"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DiscoveryFeed
                      onStartChat={handleStartChat}
                      onSelectStory={handleSelectStory}
                      limit={4}
                      onViewAll={handleViewAll}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <SceneStorySheet
            story={selectedStory}
            isOpen={storySheetOpen}
            bottomInset={0}
            onClose={() => setStorySheetOpen(false)}
            onStartChat={handleStartChat}
            onFillPrompt={(prompt) => {
              setStorySheetOpen(false);
              setTimeout(() => {
                onClose();
                onFillPrompt?.(prompt);
              }, 200);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscoverOverlay;
