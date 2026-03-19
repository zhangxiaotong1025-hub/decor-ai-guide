import { motion } from "framer-motion";

const quickStarters = [
  {
    icon: "🛋️",
    label: "客厅装修",
    text: "我想装修客厅，25平左右，喜欢温馨一点的感觉，预算2万多，平时喜欢窝在沙发上看电视",
  },
  {
    icon: "🍳",
    label: "厨房改造",
    text: "厨房想重新装修，8平米，希望动线合理，预算3万，经常做饭",
  },
  {
    icon: "🛏️",
    label: "卧室设计",
    text: "主卧15平，想要简约舒适的风格，预算1.5万，需要充足的收纳空间",
  },
];

interface WelcomeScreenProps {
  onQuickStart: (text: string) => void;
}

const WelcomeScreen = ({ onQuickStart }: WelcomeScreenProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-12"
  >
    <div className="w-14 h-14 rounded-outer bg-primary/10 flex items-center justify-center mb-5">
      <span className="text-2xl">📐</span>
    </div>
    <h2 className="text-lg font-semibold tracking-display mb-2">你好，我是你的家装助手</h2>
    <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed mb-8">
      告诉我你想装修哪个空间、有什么偏好和预算，我来为你生成专业方案。
    </p>

    <div className="w-full space-y-2.5">
      <span className="text-label text-muted-foreground font-mono block mb-2">快速开始</span>
      {quickStarters.map((item) => (
        <motion.button
          key={item.label}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onQuickStart(item.text)}
          className="w-full text-left p-3.5 bg-card shadow-layered rounded-inner hover:shadow-elevated transition-shadow duration-200 flex items-start gap-3"
        >
          <span className="text-lg flex-shrink-0">{item.icon}</span>
          <div>
            <span className="text-sm font-medium block">{item.label}</span>
            <span className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">
              {item.text}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

export default WelcomeScreen;
