import { motion } from "framer-motion";
import { Palette, Wallet, MessageSquare, Sparkles } from "lucide-react";

export type QuickActionType = "design" | "budget" | "consult" | null;

interface QuickActionBarProps {
  onAction: (type: QuickActionType) => void;
  activeAction: QuickActionType;
}

const actions = [
  { type: "design" as const, icon: Palette, label: "方案设计" },
  { type: "budget" as const, icon: Wallet, label: "预算管理" },
  { type: "consult" as const, icon: Sparkles, label: "智能咨询" },
];

const QuickActionBar = ({ onAction, activeAction }: QuickActionBarProps) => (
  <div className="flex gap-2 px-4 py-2">
    {actions.map((action, i) => {
      const isActive = activeAction === action.type;
      return (
        <motion.button
          key={action.type}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onAction(isActive ? null : action.type)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all ${
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
          }`}
        >
          <action.icon className="w-3.5 h-3.5" />
          <span>{action.label}</span>
        </motion.button>
      );
    })}
  </div>
);

export default QuickActionBar;
