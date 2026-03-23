import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import type { SceneStory } from "@/data/mockSceneStories";

interface SceneStoryCardProps {
  story: SceneStory;
  index: number;
  onTap: (story: SceneStory) => void;
}

const SceneStoryCard = ({ story, index, onTap }: SceneStoryCardProps) => {
  const saved = story.brandTotal - story.ourTotal;
  const savedPct = Math.round((saved / story.brandTotal) * 100);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.12, duration: 0.5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onTap(story)}
      className="w-full text-left rounded-outer overflow-hidden bg-card shadow-layered group"
    >
      {/* Hero image with overlay */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={story.heroImage}
          alt={story.hook}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

        {/* Persona tag - top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-button bg-primary-foreground/90 text-foreground backdrop-blur-sm">
            {story.persona}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-button bg-foreground/40 text-primary-foreground backdrop-blur-sm">
            {story.area} {story.roomType}
          </span>
        </div>

        {/* Price shock - bottom */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-sm font-semibold text-primary-foreground leading-snug mb-2 drop-shadow-sm">
            {story.hook}
          </h3>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-mono-data text-xl font-bold text-primary-foreground">
                ¥{story.ourTotal.toLocaleString()}
              </span>
              <span className="text-xs text-primary-foreground/60 line-through font-mono-data">
                ¥{story.brandTotal.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-button bg-shock/90 text-primary-foreground">
              省 {savedPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Style tags */}
          <div className="flex gap-1">
            {story.styleTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-button bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Social proof */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="font-mono-data">{story.joinedCount.toLocaleString()}</span>
            <span>人看过</span>
          </div>
        </div>

        {/* CTA hint */}
        <div className="flex items-center gap-0.5 text-[10px] font-medium text-primary">
          <span>看方案</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.button>
  );
};

export default SceneStoryCard;
