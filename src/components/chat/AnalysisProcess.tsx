import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STEPS = [
  { name: "文本理解", icon: "📝", result: "关键词：客厅、25㎡、温馨、舒服、看电视" },
  { name: "图片分析", icon: "🖼️", result: "风格：北欧简约、原木色系" },
  { name: "空间分析", icon: "📐", result: "面积：25㎡、长方形、采光好" },
  { name: "需求推断", icon: "🎯", result: "核心：舒适度优先，预算 2-2.5万" },
  { name: "需求整合", icon: "✓", result: "已生成完整需求分析" },
];

interface AnalysisProcessProps {
  onComplete: () => void;
}

const AnalysisProcess = ({ onComplete }: AnalysisProcessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (currentStep >= STEPS.length) {
      setDone(true);
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCurrentStep((c) => c + 1), 650);
    return () => clearTimeout(timer);
  }, [currentStep, done, onComplete]);

  return (
    <div className="bg-card shadow-layered rounded-outer p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-label text-primary font-mono">ANALYSIS</span>
        {!done && (
          <span className="text-[10px] text-muted-foreground font-mono animate-pulse">处理中...</span>
        )}
        {done && <span className="text-[10px] text-accent font-mono">完成</span>}
      </div>
      <div className="space-y-2">
        {STEPS.map((step, i) => {
          const status = i < currentStep ? "done" : i === currentStep && !done ? "active" : "pending";
          return (
            <motion.div
              key={step.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
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
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-medium ${
                    status === "pending" ? "text-muted-foreground/40" : "text-foreground"
                  }`}
                >
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisProcess;
