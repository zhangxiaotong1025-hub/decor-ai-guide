import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";

const QUICK_PROMPTS = [
  { emoji: "☕", text: "下班回家只想瘫着，帮我弄个舒服的小客厅，沙发要能躺" },
  { emoji: "🐱", text: "和猫住，15㎡卧室，要有猫跳台的位置，别太贵" },
  { emoji: "👶", text: "宝宝快会爬了，客厅想改成安全又好玩的亲子空间" },
  { emoji: "🍳", text: "租的房子厨房太小，想花最少的钱让做饭不那么憋屈" },
];

interface WelcomeScreenProps {
  onFillPrompt: (text: string) => void;
  onOpenDiscover: () => void;
}

const WelcomeScreen = ({ onFillPrompt, onOpenDiscover }: WelcomeScreenProps) => (
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
      说说你理想中家的样子
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xs text-muted-foreground mb-8"
    >
      随便聊，也可以传张户型图或照片
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="w-full space-y-2 mb-6"
    >
      <p className="text-[10px] text-muted-foreground font-medium px-1 mb-1">试试这样说 👇</p>
      {QUICK_PROMPTS.map((prompt, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.98 }}
          onClick={() => onFillPrompt(prompt.text)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-secondary/50 active:bg-secondary transition-colors text-left"
        >
          <span className="text-lg flex-shrink-0">{prompt.emoji}</span>
          <span className="text-[13px] leading-snug text-foreground/80">{prompt.text}</span>
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
      没想法？看看别人怎么住的
    </motion.button>
  </motion.div>
);

export default WelcomeScreen;
