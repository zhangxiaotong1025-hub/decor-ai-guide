import { motion } from "framer-motion";

const RESULT = {
  space: { type: "客厅", area: "25㎡", shape: "长方形", features: ["采光好", "客餐一体"] },
  style: { primary: "北欧简约", colors: ["#F5F1E8", "#E8E8E8", "#F0EBE0"], mood: "温馨放松" },
  budget: { range: "2-2.5万", flexibility: "中等弹性" },
  priority: [
    { label: "舒适度", value: 95 },
    { label: "实用性", value: 80 },
    { label: "美观度", value: 75 },
  ],
  lifestyle: "居家型 · 高频使用 · 看电视、窝沙发",
};

const AnalysisResult = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-card shadow-layered rounded-outer overflow-hidden"
  >
    <div className="px-4 py-2.5 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-accent text-sm">✨</span>
        <span className="text-xs font-semibold">我理解您的需求是：</span>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <InfoRow icon="🏠" label="SPACE">
        <span className="text-xs">
          {RESULT.space.type} · {RESULT.space.area} · {RESULT.space.shape}
        </span>
        <div className="flex gap-1 mt-1">
          {RESULT.space.features.map((f) => (
            <Tag key={f}>{f}</Tag>
          ))}
        </div>
      </InfoRow>

      <InfoRow icon="🎨" label="STYLE">
        <span className="text-xs">
          {RESULT.style.primary} · {RESULT.style.mood}
        </span>
        <div className="flex gap-1.5 mt-1.5">
          {RESULT.style.colors.map((c) => (
            <div
              key={c}
              className="w-5 h-5 rounded-button shadow-layered"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </InfoRow>

      <InfoRow icon="💰" label="BUDGET">
        <span className="font-mono-data text-sm font-semibold">{RESULT.budget.range}</span>
        <span className="text-[10px] text-muted-foreground ml-2">{RESULT.budget.flexibility}</span>
      </InfoRow>

      <InfoRow icon="🎯" label="PRIORITY">
        <div className="space-y-1.5 w-full">
          {RESULT.priority.map((p) => (
            <div key={p.label} className="flex items-center gap-2">
              <span className="text-[11px] w-12 flex-shrink-0">{p.label}</span>
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.value}%` }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <span className="font-mono-data text-[10px] text-muted-foreground w-7 text-right">
                {p.value}
              </span>
            </div>
          ))}
        </div>
      </InfoRow>

      <InfoRow icon="🛋️" label="LIFE">
        <span className="text-xs">{RESULT.lifestyle}</span>
      </InfoRow>
    </div>

    {/* Confidence */}
    <div className="px-4 pb-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">置信度</span>
        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "92%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full bg-accent rounded-full"
          />
        </div>
        <span className="font-mono-data text-[10px] font-semibold text-accent">92%</span>
      </div>
    </div>

    {/* Auto-proceeding hint */}
    <div className="px-4 pb-3">
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-primary"
        />
        <span className="text-[10px] text-muted-foreground">正在根据分析结果生成设计方案...</span>
      </div>
    </div>
  </motion.div>
);

const InfoRow = ({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-2.5">
    <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
    <div className="flex-1 min-w-0">
      <span className="text-label text-muted-foreground font-mono block mb-1">{label}</span>
      {children}
    </div>
  </div>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-button text-muted-foreground">
    {children}
  </span>
);

export default AnalysisResult;
