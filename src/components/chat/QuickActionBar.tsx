import { motion } from "framer-motion";
import { Palette, Wallet, Sparkles, Users } from "lucide-react";

export type QuickActionType = "design" | "budget" | "consult" | "groupbuy" | null;

interface QuickActionBarProps {
  onAction: (type: QuickActionType) => void;
  activeAction: QuickActionType;
  /** 是否有进行中的拼单 */
  hasActiveGroupBuy?: boolean;
}

const baseActions = [
  { type: "design" as const, icon: Palette, label: "方案设计" },
  { type: "budget" as const, icon: Wallet, label: "预算管理" },
  { type: "consult" as const, icon: Sparkles, label: "智能咨询" },
];

const groupBuyAction = { type: "groupbuy" as const, icon: Users, label: "拼单助手" };

const QuickActionBar = ({ onAction, activeAction, hasActiveGroupBuy }: QuickActionBarProps) => {
  const actions = hasActiveGroupBuy ? [...baseActions, groupBuyAction] : baseActions;

  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto">
      {actions.map((action, i) => {
        const isActive = activeAction === action.type;
        const isGroupBuy = action.type === "groupbuy";
        return (
          <motion.button
            key={action.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onAction(isActive ? null : action.type)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : isGroupBuy
                  ? "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
            }`}
          >
            <action.icon className="w-3.5 h-3.5" />
            <span>{action.label}</span>
            {isGroupBuy && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActionBar;
