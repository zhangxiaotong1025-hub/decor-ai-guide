import type { LifeScene } from "@/data/mockSceneStories";

interface LifeSceneBoardProps {
  scenes: LifeScene[];
}

const LifeSceneBoard = ({ scenes }: LifeSceneBoardProps) => (
  <div className="pb-8">
    <h3 className="px-5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
      住进去的一天
    </h3>

    <div className="space-y-3 px-5">
      {scenes.map((scene, i) => (
        <div key={i} className="relative rounded-2xl overflow-hidden h-[260px]">
          <img src={scene.src} alt={scene.caption} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <span className="inline-block text-[10px] text-primary-foreground/70 font-medium uppercase tracking-wider mb-0.5">
              {scene.time}
            </span>
            <p className="text-sm text-primary-foreground font-medium leading-relaxed">
              {scene.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LifeSceneBoard;
