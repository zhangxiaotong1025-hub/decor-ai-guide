import { motion } from "framer-motion";
import heroBlueprint from "@/assets/hero-blueprint.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Blueprint background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBlueprint}
          alt="Blueprint background"
          className="w-full h-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="container relative z-10 py-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="text-label text-primary mb-4 block font-mono">
              HOME COPILOT · 家装智能操作系统
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl md:text-6xl font-semibold tracking-display leading-tight mb-6"
          >
            用精确数据，
            <br />
            <span className="text-primary">终结装修焦虑</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-lg text-muted-foreground leading-pretty max-w-xl mb-10"
          >
            从需求分析到施工验收，AI 全周期驱动。将模糊的审美意向转化为可执行的物料清单与施工计划。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex gap-3"
          >
            <a
              href="#demo"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-button shadow-layered hover:shadow-elevated transition-shadow duration-250"
            >
              开始体验
            </a>
            <a
              href="#features"
              className="inline-flex items-center px-6 py-3 bg-card text-foreground text-sm font-medium rounded-button shadow-layered hover:shadow-elevated transition-shadow duration-250"
            >
              了解更多
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex gap-12"
          >
            {[
              { value: "5", unit: "大 Agent", label: "全周期覆盖" },
              { value: "92%", unit: "", label: "需求识别准确率" },
              { value: "< 3", unit: "轮对话", label: "完成需求分析" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold font-mono-data tracking-display">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.unit}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
