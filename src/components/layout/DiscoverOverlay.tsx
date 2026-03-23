import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import DiscoveryFeed from "@/components/discovery/DiscoveryFeed";
import SceneStorySheet from "@/components/discovery/SceneStorySheet";
import type { SceneStory } from "@/data/mockSceneStories";

interface DiscoverOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (prompt: string) => void;
}

const DiscoverOverlay = ({ isOpen, onClose, onStartChat }: DiscoverOverlayProps) => {
  const [selectedStory, setSelectedStory] = useState<SceneStory | null>(null);
  const [storySheetOpen, setStorySheetOpen] = useState(false);
  const [showFullList, setShowFullList] = useState(false);

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
  }, []);

  const handleBack = useCallback(() => {
    if (showFullList) {
      setShowFullList(false);
    } else {
      onClose();
    }
  }, [showFullList, onClose]);

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
          {/* Header */}
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

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <AnimatePresence mode="wait">
                {showFullList ? (
                  <motion.div
                    key="full-list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <DiscoveryFeed
                      onStartChat={handleStartChat}
                      onSelectStory={handleSelectStory}
                      showCategories
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="featured"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
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
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscoverOverlay;
