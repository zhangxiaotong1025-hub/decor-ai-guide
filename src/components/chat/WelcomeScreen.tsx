import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";

const QUICK_PROMPTS = [
  { emoji: "🏠", text: "25㎡客厅，预算3万，北欧风" },
  { emoji: "🛏️", text: "主卧改造，想要日式原木风" },
  { emoji: "👶", text: "儿童房设计，安全环保优先" },
  { emoji: "🍳", text: "开放式厨房，6㎡，现代简约" },
];

interface WelcomeScreenProps {
  onStartChat: (text: string) => void;
  onOpenDiscover: () => void;
}

const WelcomeScreen = ({ onStartChat, onOpenDiscover }: WelcomeScreenProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center pt-12 pb-6"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center mb-4"
    >
      <Sparkles className="w-7 h-7 text-background" />
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="text-lg font-semibold tracking-display mb-1"
    >
      你的 AI 家装设计师
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xs text-muted-foreground mb-8"
    >
      告诉我你的需求，秒出专属方案
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="w-full space-y-2 mb-6"
    >
      {QUICK_PROMPTS.map((prompt, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartChat(prompt.text)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-left"
        >
          <span className="text-lg">{prompt.emoji}</span>
          <span className="text-sm">{prompt.text}</span>
        </motion.button>
      ))}
    </motion.div>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpenDiscover}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-primary text-sm font-medium"
    >
      <Compass className="w-4 h-4" />
      看看别人的家，找找灵感
    </motion.button>
  </motion.div>
);

export default WelcomeScreen;
