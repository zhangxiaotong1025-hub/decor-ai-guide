import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { name: "文本理解", icon: "📝", result: "关键词：客厅、25㎡、温馨、舒服、看电视", duration: 500 },
  { name: "图片分析", icon: "🖼️", result: "风格：北欧简约、原木色系", duration: 1200 },
  { name: "空间分析", icon: "📐", result: "面积：25㎡、长方形、采光好", duration: 900 },
  { name: "需求推断", icon: "🎯", result: "核心：舒适度优先，预算 2-2.5万", duration: 1400 },
  { name: "需求整合", icon: "✓", result: "已生成完整需求分析", duration: 600 },
];

interface AnalysisProcessProps {
  onComplete: () => void;
  collapsed?: boolean;
}

const AnalysisProcess = ({ onComplete, collapsed = false }: AnalysisProcessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const advance = useCallback(() => {
    setCurrentStep((c) => {
      const next = c + 1;
      if (next >= STEPS.length) {
        setDone(true);
        onComplete();
        return c;
      }
      return next;
    });
  }, [onComplete]);

  useEffect(() => {
    if (done || currentStep >= STEPS.length) return;
    const timer = setTimeout(advance, STEPS[currentStep].duration);
    return () => clearTimeout(timer);
  }, [currentStep, done, advance]);

  // Collapsed state: show summary with key info, tappable to expand
  if (collapsed && !expanded) {
    return (
      <motion.div
        layout="position"
        onClick={() => setExpanded(true)}
        className="bg-card shadow-layered rounded-outer px-4 py-3 mb-3 cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-accent text-xs">✓</span>
          <span className="text-[11px] font-medium text-foreground">需求分析完成</span>
          <span className="text-[10px] text-muted-foreground/50 ml-auto">点击展开 ›</span>
        </div>
        {/* Key results summary */}
        <div className="flex flex-wrap gap-1.5">
          {STEPS.map((step) => (
            <span key={step.name} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-button text-muted-foreground">
              {step.icon} {step.result.split("：")[1]?.split("、").slice(0, 2).join("、") || step.result}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  // Full view (running or expanded from collapsed)
  return (
    <motion.div layout className="bg-card shadow-layered rounded-outer p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-label text-primary font-mono">ANALYSIS</span>
        {!done && (
          <span className="text-[10px] text-muted-foreground font-mono animate-pulse">
            {STEPS[currentStep]?.name}...
          </span>
        )}
        {done && <span className="text-[10px] text-accent font-mono">完成</span>}
        {/* Collapse button when expanded from collapsed */}
        {collapsed && expanded && (
          <button onClick={() => setExpanded(false)} className="ml-auto text-[10px] text-muted-foreground">
            收起 ‹
          </button>
        )}
        {/* Progress dots when running */}
        {!collapsed && (
          <div className="ml-auto flex gap-0.5">
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                animate={{
                  backgroundColor:
                    i < currentStep || done
                      ? "hsl(var(--accent))"
                      : i === currentStep
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  scale: i === currentStep && !done ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        {STEPS.map((step, i) => {
          const status = i < currentStep || done ? "done" : i === currentStep ? "active" : "pending";
          return (
            <motion.div
              key={step.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: collapsed ? 0 : i * 0.05 }}
              className="flex items-start gap-2.5"
            >
              <span className="text-xs mt-0.5 flex-shrink-0 w-4 text-center">
                {status === "done" ? (
                  <span className="text-accent">✓</span>
                ) : status === "active" ? (
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
                    {step.icon}
                  </motion.span>
                ) : (
                  <span className="text-muted-foreground/30">○</span>
                )}
              </span>
              <div className="flex-1 min-w-0 pb-1">
                <span className={`text-xs font-medium ${status === "pending" ? "text-muted-foreground/40" : "text-foreground"}`}>
                  {step.name}
                </span>
                {status === "done" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[11px] text-muted-foreground mt-0.5"
                  >
                    {step.result}
                  </motion.p>
                )}
                {status === "active" && (
                  <motion.div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary/60 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: step.duration / 1000, ease: "easeInOut" }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AnalysisProcess;
