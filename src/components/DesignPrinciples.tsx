import { motion } from "framer-motion";

const principles = [
  {
    label: "01",
    title: "专业分工",
    desc: "每个 Agent 专注自己的领域，用最合适的形式表达。需求分析用对话，方案展示用视觉，决策支持用数据对比。",
  },
  {
    label: "02",
    title: "信息聚焦",
    desc: "只展示当前阶段最重要的信息。渐进式披露细节，避免信息过载，让决策更清晰。",
  },
  {
    label: "03",
    title: "精确驱动",
    desc: "拒绝模糊描述。每一个推荐都关联精确的尺寸、材质参数与实时价格，用数据建立信任。",
  },
  {
    label: "04",
    title: "状态延续",
    desc: "基于最近结果持续优化，而非重新开始。您的每一次反馈都会被记住并融入下一轮迭代。",
  },
];

const DesignPrinciples = () => {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mb-16">
          <span className="text-label text-primary mb-3 block font-mono">DESIGN PRINCIPLES</span>
          <h2 className="text-3xl font-semibold tracking-display mb-4">设计原则</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {principles.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="p-6 bg-card shadow-layered rounded-outer group hover:shadow-elevated transition-shadow duration-250"
            >
              <span className="font-mono-data text-3xl font-semibold text-primary/20 group-hover:text-primary/40 transition-colors">
                {p.label}
              </span>
              <h3 className="text-base font-semibold mt-3 mb-2">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-pretty">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesignPrinciples;
