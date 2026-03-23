import { Sparkles, Compass, Flame, Users } from "lucide-react";

const QUICK_PROMPTS = [
  {
    emoji: "🔥",
    text: "下班回家只想瘫着，帮我弄个舒服的小客厅，沙发要能躺",
    heat: "1,203 人也这么想",
    hot: true,
  },
  {
    emoji: "🐱",
    text: "和猫住，15㎡卧室，要有猫跳台的位置，别太贵",
    heat: "847 人同款需求",
  },
  {
    emoji: "👶",
    text: "宝宝快会爬了，客厅想改成安全又好玩的亲子空间",
    heat: "923 位家长选过",
  },
  {
    emoji: "🍳",
    text: "租的房子厨房太小，想花最少的钱让做饭不那么憋屈",
    heat: "534 人改造成功",
  },
];

interface WelcomeScreenProps {
  onFillPrompt: (text: string) => void;
  onOpenDiscover: () => void;
}

const WelcomeScreen = ({ onFillPrompt, onOpenDiscover }: WelcomeScreenProps) => (
  <div className="flex flex-col items-center pt-10 pb-6">
    <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center mb-4">
      <Sparkles className="w-7 h-7 text-background" />
    </div>

    <h2 className="text-lg font-semibold tracking-display mb-1">
      你想住什么样的家？
    </h2>
    <p className="text-xs text-muted-foreground mb-2">
      说一句话就行，AI 帮你从零开始设计
    </p>

    {/* Live urgency banner */}
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-shock/5 rounded-full mb-6">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-shock opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-shock" />
      </span>
      <span className="text-[10px] text-shock font-medium">
        今天已有 47 人开始设计方案，平均省下 ¥58,200
      </span>
    </div>

    <div className="w-full space-y-2 mb-6">
      <p className="text-[10px] text-muted-foreground font-medium px-1 mb-1">
        他们都这么说的 👇 点一下就能开始
      </p>
      {QUICK_PROMPTS.map((prompt, i) => (
        <button
          key={i}
          onClick={() => onFillPrompt(prompt.text)}
          className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border transition-colors text-left ${
            prompt.hot
              ? "border-shock/20 bg-shock/3 hover:bg-shock/6"
              : "border-border hover:bg-secondary/50"
          }`}
        >
          <span className="text-lg flex-shrink-0 mt-0.5">{prompt.emoji}</span>
          <div className="flex-1 min-w-0">
            <span className="text-[13px] leading-snug text-foreground/80 block">{prompt.text}</span>
            <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {prompt.heat}
            </span>
          </div>
          {prompt.hot && (
            <span className="flex-shrink-0 mt-0.5">
              <Flame className="w-3.5 h-3.5 text-shock" />
            </span>
          )}
        </button>
      ))}
    </div>

    <button
      onClick={onOpenDiscover}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-primary text-sm font-medium"
    >
      <Compass className="w-4 h-4" />
      先看看别人怎么住的 · 省 71% 起
    </button>

    <p className="text-[10px] text-muted-foreground/50 mt-4">
      3 分钟出方案 · 不满意随时改 · 不花一分冤枉钱
    </p>
  </div>
);

export default WelcomeScreen;
