import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AnalysisStep = {
  name: string;
  icon: string;
  status: "pending" | "analyzing" | "completed";
  result: string;
};

type AnalysisResult = {
  space: { type: string; area: string; shape: string; features: string[] };
  style: { primary: string; colors: string[]; mood: string };
  budget: { range: string; flexibility: string };
  priority: string[];
  lifestyle: { type: string; habits: string[] };
};

const ANALYSIS_STEPS: AnalysisStep[] = [
  { name: "文本理解", icon: "📝", status: "pending", result: "关键词：客厅、25㎡、温馨、舒服" },
  { name: "图片分析", icon: "🖼️", status: "pending", result: "风格：北欧简约、原木色系" },
  { name: "空间分析", icon: "📐", status: "pending", result: "面积：25㎡、长方形、采光好" },
  { name: "需求推断", icon: "🎯", status: "pending", result: "核心：舒适度优先，预算 2-2.5万" },
  { name: "需求整合", icon: "✓", status: "pending", result: "已生成完整需求分析" },
];

const MOCK_RESULT: AnalysisResult = {
  space: { type: "客厅", area: "25㎡", shape: "长方形", features: ["采光好", "客餐一体"] },
  style: { primary: "北欧简约", colors: ["浅木色", "灰白色", "米色"], mood: "温馨放松" },
  budget: { range: "2-2.5万", flexibility: "中等弹性" },
  priority: ["舒适度", "实用性", "美观度"],
  lifestyle: { type: "居家型", habits: ["看电视", "窝沙发", "阅读"] },
};

const DemoChat = () => {
  const [phase, setPhase] = useState<"input" | "analyzing" | "result">("input");
  const [steps, setSteps] = useState(ANALYSIS_STEPS);
  const [currentStep, setCurrentStep] = useState(0);

  const startAnalysis = () => {
    setPhase("analyzing");
    setCurrentStep(0);
  };

  useEffect(() => {
    if (phase !== "analyzing") return;
    if (currentStep >= steps.length) {
      setTimeout(() => setPhase("result"), 600);
      return;
    }

    // Set current step to analyzing
    setSteps((prev) =>
      prev.map((s, i) => (i === currentStep ? { ...s, status: "analyzing" } : s))
    );

    const timer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((s, i) => (i === currentStep ? { ...s, status: "completed" } : s))
      );
      setCurrentStep((c) => c + 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [phase, currentStep, steps.length]);

  const reset = () => {
    setPhase("input");
    setSteps(ANALYSIS_STEPS.map((s) => ({ ...s, status: "pending" as const })));
    setCurrentStep(0);
  };

  return (
    <section id="demo" className="py-24 bg-secondary/30">
      <div className="container">
        <div className="mb-12">
          <span className="text-label text-primary mb-3 block font-mono">LIVE DEMO</span>
          <h2 className="text-3xl font-semibold tracking-display mb-4">需求分析演示</h2>
          <p className="text-sm text-muted-foreground max-w-lg leading-pretty">
            一次输入，AI 智能解析。体验从自然语言到结构化需求的转化过程。
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card shadow-elevated rounded-outer overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-line" />
                <span className="text-label text-muted-foreground font-mono">需求理解 AGENT</span>
              </div>
              {phase !== "input" && (
                <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  重新开始
                </button>
              )}
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {phase === "input" && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-sm text-muted-foreground mb-4">告诉我您的想法，我来帮您实现</p>
                    <div className="bg-secondary/50 rounded-inner p-4 mb-4">
                      <p className="text-sm leading-pretty">
                        我想装修客厅，25平左右，喜欢温馨一点的感觉，不要太冷淡。预算2万多吧，主要是想舒服一点，平时喜欢窝在沙发上看电视。
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-xs text-muted-foreground">📷 已上传 3 张参考图</span>
                      <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-button font-mono">已就绪</span>
                    </div>
                    <button
                      onClick={startAnalysis}
                      className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-button shadow-layered hover:shadow-elevated transition-all duration-250"
                    >
                      开始分析
                    </button>
                  </motion.div>
                )}

                {phase === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-sm font-medium mb-4">🔍 正在分析您的需求...</p>
                    <div className="space-y-3">
                      {steps.map((step, i) => (
                        <motion.div
                          key={step.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-sm mt-0.5 flex-shrink-0">{step.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{step.name}</span>
                              {step.status === "analyzing" && (
                                <span className="text-xs text-primary font-mono animate-pulse">分析中...</span>
                              )}
                              {step.status === "completed" && (
                                <span className="text-xs text-accent font-mono">✓ 完成</span>
                              )}
                            </div>
                            {step.status === "completed" && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="text-xs text-muted-foreground mt-0.5"
                              >
                                {step.result}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {phase === "result" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-accent">✨</span>
                      <span className="text-sm font-semibold">需求分析完成</span>
                    </div>

                    <div className="space-y-3">
                      <ResultCard
                        icon="🏠"
                        label="SPACE"
                        title="空间信息"
                        content={`${MOCK_RESULT.space.type} · ${MOCK_RESULT.space.area} · ${MOCK_RESULT.space.shape}`}
                        tags={MOCK_RESULT.space.features}
                      />
                      <ResultCard
                        icon="🎨"
                        label="STYLE"
                        title="风格偏好"
                        content={`${MOCK_RESULT.style.primary} · ${MOCK_RESULT.style.mood}`}
                        tags={MOCK_RESULT.style.colors}
                      />
                      <ResultCard
                        icon="💰"
                        label="BUDGET"
                        title="预算范围"
                        content={MOCK_RESULT.budget.range}
                        tags={[MOCK_RESULT.budget.flexibility]}
                      />
                      <ResultCard
                        icon="🎯"
                        label="PRIORITY"
                        title="核心诉求"
                        content=""
                        tags={MOCK_RESULT.priority.map((p, i) => `${i + 1}. ${p}`)}
                      />
                      <ResultCard
                        icon="🛋️"
                        label="LIFESTYLE"
                        title="生活方式"
                        content={MOCK_RESULT.lifestyle.type}
                        tags={MOCK_RESULT.lifestyle.habits}
                      />
                    </div>

                    {/* Confidence bar */}
                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">置信度</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                      <span className="font-mono-data text-xs font-semibold">92%</span>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-button shadow-layered">
                        确认无误，开始设计
                      </button>
                      <button className="flex-1 py-2.5 bg-card text-foreground text-xs font-medium rounded-button shadow-layered">
                        有地方需要调整
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ResultCard = ({
  icon,
  label,
  title,
  content,
  tags,
}: {
  icon: string;
  label: string;
  title: string;
  content: string;
  tags: string[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-3 bg-secondary/50 rounded-inner"
  >
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-sm">{icon}</span>
      <span className="text-label text-muted-foreground font-mono">{label}</span>
    </div>
    <h4 className="text-xs font-semibold mb-1">{title}</h4>
    {content && <p className="text-xs text-muted-foreground">{content}</p>}
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((tag) => (
        <span key={tag} className="text-[10px] px-2 py-0.5 bg-card rounded-button text-muted-foreground shadow-layered">
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

export default DemoChat;
