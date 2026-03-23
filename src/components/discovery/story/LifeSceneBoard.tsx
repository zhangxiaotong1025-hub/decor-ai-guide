import { motion } from "framer-motion";
import type { LifeScene } from "@/data/mockSceneStories";

interface LifeSceneBoardProps {
  scenes: LifeScene[];
}

const LifeSceneBoard = ({ scenes }: LifeSceneBoardProps) => (
  <div className="px-6 pb-8">
    <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
      住进去的一天
    </h3>

    <div className="space-y-3">
      {scenes.map((scene, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <img src={scene.src} alt={scene.caption} className="w-full h-[240px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <span className="text-[10px] text-primary-foreground/70 font-medium uppercase tracking-wider">
              {scene.time}
            </span>
            <p className="text-sm text-primary-foreground font-medium leading-relaxed mt-0.5 drop-shadow-sm">
              {scene.caption}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default LifeSceneBoard;
