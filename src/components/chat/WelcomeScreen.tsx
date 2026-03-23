import { Flame } from "lucide-react";

const QUICK_PROMPTS = [
  {
    emoji: "🔥",
    text: "下班回家只想瘫着，帮我弄个舒服的小客厅",
    hot: true,
  },
  {
    emoji: "🐱",
    text: "和猫住，15㎡卧室，要有猫跳台的位置",
  },
  {
    emoji: "👶",
    text: "客厅改成安全又好玩的亲子空间",
  },
  {
    emoji: "🍳",
    text: "租房厨房太小，花最少的钱改造",
  },
];

interface WelcomeScreenProps {
  onFillPrompt: (text: string) => void;
  onOpenDiscover: () => void;
}

const WelcomeScreen = ({ onFillPrompt, onOpenDiscover }: WelcomeScreenProps) => (
  <div className="flex flex-col items-center pt-12 pb-6">
    <h2 className="text-xl font-semibold tracking-tight mb-1">
      你想住什么样的家？
    </h2>
    <p className="text-xs text-muted-foreground mb-8">
      说一句话，3 分钟出方案
    </p>

    <div className="w-full space-y-2 mb-8">
      {QUICK_PROMPTS.map((prompt, i) => (
        <button
          key={i}
          onClick={() => onFillPrompt(prompt.text)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors text-left ${
            prompt.hot
              ? "border-shock/25 bg-shock/5 hover:bg-shock/10"
              : "border-border hover:bg-secondary/50"
          }`}
        >
          <span className="text-base flex-shrink-0">{prompt.emoji}</span>
          <span className="text-[13px] leading-snug text-foreground/90 flex-1">{prompt.text}</span>
          {prompt.hot && <Flame className="w-3.5 h-3.5 text-shock flex-shrink-0" />}
        </button>
      ))}
    </div>

    <button
      onClick={onOpenDiscover}
      className="text-xs text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30 hover:text-foreground transition-colors"
    >
      先看看别人怎么装的
    </button>
  </div>
);

export default WelcomeScreen;
