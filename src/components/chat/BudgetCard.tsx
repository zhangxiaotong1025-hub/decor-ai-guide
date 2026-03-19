import { motion } from "framer-motion";
import type { BudgetSummary } from "@/types/chat";

interface BudgetCardProps {
  budget: BudgetSummary;
}

const BudgetCard = ({ budget }: BudgetCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card shadow-layered rounded-outer overflow-hidden"
  >
    <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
      <span className="text-label text-muted-foreground font-mono">BUDGET OVERVIEW</span>
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-button font-mono ${
          budget.status === "within"
            ? "bg-accent/10 text-accent"
            : "bg-destructive/10 text-destructive"
        }`}
      >
        {budget.status === "within" ? "预算内 ✓" : "超出预算"}
      </span>
    </div>

    <div className="p-4">
      <div className="text-center mb-4">
        <span className="text-[10px] text-muted-foreground">预估总价</span>
        <div className="font-mono-data text-2xl font-semibold tracking-display">{budget.total}</div>
      </div>

      <div className="space-y-2">
        {budget.breakdown.map((item) => (
          <div key={item.item} className="flex items-center gap-2">
            <span className="text-[11px] w-16 flex-shrink-0">{item.item}</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.pct}%` }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-primary/70 rounded-full"
              />
            </div>
            <span className="font-mono-data text-[10px] text-muted-foreground w-14 text-right">
              {item.cost}
            </span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default BudgetCard;
