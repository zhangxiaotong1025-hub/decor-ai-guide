import { motion } from "framer-motion";
import type { LifeScene } from "@/data/mockSceneStories";

interface LifeSceneBoardProps {
  scenes: LifeScene[];
}

const timeGradients: Record<string, string> = {
  "清晨": "from-amber-500/20 via-transparent to-transparent",
  "上午": "from-yellow-400/15 via-transparent to-transparent",
  "下午": "from-orange-400/10 via-transparent to-transparent",
  "下班后": "from-indigo-500/20 via-transparent to-transparent",
  "傍晚": "from-purple-500/15 via-transparent to-transparent",
  "晚上": "from-blue-900/25 via-transparent to-transparent",
  "周末": "from-rose-400/15 via-transparent to-transparent",
  "周末早晨": "from-amber-400/15 via-transparent to-transparent",
};

const LifeSceneBoard = ({ scenes }: LifeSceneBoardProps) => (
  <div className="pb-8">
    <h3 className="px-6 text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
      住进去的一天
    </h3>

    <div className="space-y-4 px-4">
      {scenes.map((scene, i) => {
        const gradient = timeGradients[scene.time] || "from-foreground/20 via-transparent to-transparent";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.2, duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden h-[280px]"
          >
            {/* Image with subtle scale on scroll into view */}
            <motion.img
              src={scene.src}
              alt={scene.caption}
              className="absolute inset-[-5%] w-[110%] h-[110%] object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1.0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Time-of-day tint */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
            {/* Bottom gradient for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.3 }}
              >
                <span className="inline-block text-[10px] text-primary-foreground/80 font-medium uppercase tracking-[0.2em] mb-1 px-2 py-0.5 bg-primary-foreground/10 backdrop-blur-sm rounded-full">
                  {scene.time}
                </span>
                <p className="text-[15px] text-primary-foreground font-medium leading-relaxed drop-shadow-md">
                  {scene.caption}
                </p>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default LifeSceneBoard;
