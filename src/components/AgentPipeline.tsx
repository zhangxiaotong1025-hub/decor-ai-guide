import { motion } from "framer-motion";

const agents = [
  {
    id: 1,
    label: "DEMAND ANALYSIS",
    name: "需求理解 Agent",
    form: "对话式",
    desc: "多模态输入，启发式提问，AI 智能解析您的装修需求",
    icon: "📝",
  },
  {
    id: 2,
    label: "DESIGN ENGINE",
    name: "设计方案 Agent",
    form: "视觉+专业解说",
    desc: "3D 效果图展示，专业设计阐述，空间分析与动线规划",
    icon: "📐",
  },
  {
    id: 3,
    label: "DECISION SUPPORT",
    name: "决策助手 Agent",
    form: "结构化对比",
    desc: "方案对比表格，价格分析，优劣势总结助您决策",
    icon: "⚖️",
  },
  {
    id: 4,
    label: "PURCHASE GUIDE",
    name: "购物助手 Agent",
    form: "引导式对话",
    desc: "消除顾虑，发现团购机会，精准匹配供应商",
    icon: "🛒",
  },
  {
    id: 5,
    label: "SERVICE MANAGER",
    name: "服务管家 Agent",
    form: "主动推送",
    desc: "订单跟踪，物流提醒，施工节点验收提醒",
    icon: "🔧",
  },
];

const AgentPipeline = () => {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="mb-16">
          <span className="text-label text-primary mb-3 block font-mono">AGENT SYSTEM</span>
          <h2 className="text-3xl font-semibold tracking-display mb-4">五大 Agent 协同工作</h2>
          <p className="text-sm text-muted-foreground max-w-lg leading-pretty">
            每个 Agent 专注自己的领域，用最合适的形式表达。从需求理解到售后服务，覆盖装修全生命周期。
          </p>
        </div>

        <div className="grid gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -2 }}
              className="relative p-5 bg-card shadow-layered rounded-outer border-l-4 border-primary flex items-start gap-5 group hover:shadow-elevated transition-shadow duration-250"
            >
              <div className="text-2xl flex-shrink-0 mt-0.5">{agent.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-label text-muted-foreground font-mono">{agent.label}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground rounded-button font-mono">
                    {agent.form}
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-1">{agent.name}</h3>
                <p className="text-xs text-muted-foreground leading-pretty">{agent.desc}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <span className="font-mono-data text-2xl font-semibold text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                  {String(agent.id).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentPipeline;
