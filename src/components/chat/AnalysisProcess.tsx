import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

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

  const isCollapsed = collapsed && !expanded;

  return (
    <div className="bg-card shadow-layered rounded-outer mb-3 overflow-hidden transition-all duration-500 ease-in-out">
      {/* Header - always visible */}
      <div
        className={`px-4 py-3 flex items-center gap-2 ${isCollapsed ? "cursor-pointer" : ""}`}
        onClick={isCollapsed ? () => setExpanded(true) : undefined}
      >
        <span className={`text-xs ${done ? "text-accent" : "text-primary"}`}>
          {done ? "✓" : "⏳"}
        </span>
        <span className="text-[11px] font-medium text-foreground">
          {done ? "需求分析完成" : "需求分析中"}
        </span>
        {!done && (
          <span className="text-[10px] text-muted-foreground font-mono animate-pulse">
            {STEPS[currentStep]?.name}...
          </span>
        )}

        {/* Progress dots */}
        <div className="ml-auto flex items-center gap-1">
          {isCollapsed && (
            <span className="text-[10px] text-muted-foreground/50 mr-1">展开 ›</span>
          )}
          {collapsed && expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              className="text-[10px] text-muted-foreground mr-1"
            >
              收起 ‹
            </button>
          )}
          <div className="flex gap-0.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i < currentStep || done
                    ? "bg-accent"
                    : i === currentStep
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Collapsible body */}
      <div
        className="transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: isCollapsed ? "0px" : "600px",
          opacity: isCollapsed ? 0 : 1,
        }}
      >
        {/* Collapsed summary tags - shown briefly during collapse transition */}
        {collapsed && !expanded && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {STEPS.map((step) => (
              <span key={step.name} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-button text-muted-foreground">
                {step.icon} {step.result.split("：")[1]?.split("、").slice(0, 2).join("、") || step.result}
              </span>
            ))}
          </div>
        )}

        {/* Step list */}
        {!isCollapsed && (
          <div className="px-4 pb-3 space-y-1">
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
                      <p className="text-[11px] text-muted-foreground mt-0.5">{step.result}</p>
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
        )}
      </div>
    </div>
  );
};

export default AnalysisProcess;
