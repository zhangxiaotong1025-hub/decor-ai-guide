import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";
import SceneStoryCard from "./SceneStoryCard";
import { mockSceneStories, type SceneStory } from "@/data/mockSceneStories";

interface DiscoveryFeedProps {
  onStartChat: (text: string) => void;
  onSelectStory: (story: SceneStory) => void;
}

const DiscoveryFeed = ({ onStartChat, onSelectStory }: DiscoveryFeedProps) => {
  const handleStoryTap = (story: SceneStory) => {
    onSelectStory(story);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-6"
    >
      {/* Hero tagline */}
      <div className="px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-base font-semibold tracking-display mb-1">
            别人家花了多少钱？
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            看看和你一样的人，怎么用更少的钱住得更好
          </p>
        </motion.div>

        {/* Live activity pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mt-3"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saving/8 border border-saving/15">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saving opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-saving" />
            </span>
            <span className="text-[11px] font-medium text-saving">
              今日 <span className="font-mono-data font-bold">3,128</span> 人找到了更低的价格
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scene Story Cards */}
      <div className="px-4 space-y-4">
        {mockSceneStories.map((story, i) => (
          <SceneStoryCard
            key={story.id}
            story={story}
            index={i}
            onTap={handleStoryTap}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="px-4 mt-6"
      >
        <div className="relative">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartChat("我想装修，帮我出个方案")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-elevated"
          >
            <Sparkles className="w-4 h-4" />
            输入你的户型，AI 秒出专属方案
          </motion.button>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            告诉 AI 你的面积和预算，看看你能省多少
          </p>
        </div>

        {/* OR divider + quick chat */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground">或者</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={() => onStartChat("我随便看看，还没想好要什么风格")}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          还没想好？先跟 AI 聊聊
        </button>
      </motion.div>
    </motion.div>
  );
};

export default DiscoveryFeed;
