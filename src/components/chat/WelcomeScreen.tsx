import { Flame, Shield, Ruler, Users } from "lucide-react";

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

const TICKER_ITEMS = [
  { text: "实木床架 工厂价¥1,280", tag: "省67%", type: "deal" as const },
  { text: "「北欧客厅」拼团 还差2人成团", tag: "拼团中", type: "group" as const },
  { text: "定制衣柜 9人已拼 底价¥680/㎡", tag: "即将成团", type: "group" as const },
  { text: "乳胶床垫 品牌价¥4,999 → ¥1,450", tag: "价格脱水", type: "deal" as const },
  { text: "岩板餐桌 工厂直发 ¥2,180", tag: "省¥3,800", type: "deal" as const },
  { text: "「日式卧室」方案 12人正在拼", tag: "热拼中", type: "group" as const },
];

interface WelcomeScreenProps {
  onFillPrompt: (text: string) => void;
  onOpenDiscover: () => void;
}

const WelcomeScreen = ({ onFillPrompt, onOpenDiscover }: WelcomeScreenProps) => (
  <div className="flex flex-col items-center pt-8 pb-6">
    {/* Logo */}
    <div className="flex items-center gap-2 mb-1">
      <div className="w-8 h-8 rounded-inner bg-primary flex items-center justify-center">
        <Ruler className="w-4 h-4 text-primary-foreground" />
      </div>
      <span className="text-lg font-semibold tracking-display">Home Copilot</span>
    </div>

    {/* Tagline */}
    <p className="text-xs text-muted-foreground mb-5">
      专业设计 · 明白消费 · 拼团更省
    </p>

    {/* Value props - 三个核心价值 */}
    <div className="w-full grid grid-cols-3 gap-2 mb-5 px-1">
      <div className="flex flex-col items-center gap-1.5 py-2.5 rounded-lg bg-primary/5 border border-primary/10">
        <Ruler className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-medium text-foreground/80">AI 专业设计</span>
      </div>
      <div className="flex flex-col items-center gap-1.5 py-2.5 rounded-lg bg-saving/5 border border-saving/10">
        <Shield className="w-3.5 h-3.5 text-saving" />
        <span className="text-[10px] font-medium text-foreground/80">工厂价直购</span>
      </div>
      <div className="flex flex-col items-center gap-1.5 py-2.5 rounded-lg bg-gold/5 border border-gold/10">
        <Users className="w-3.5 h-3.5 text-gold" />
        <span className="text-[10px] font-medium text-foreground/80">拼团再省</span>
      </div>
    </div>

    {/* Electronic billboard - 滚动广告牌 */}
    <div className="w-full mb-6 overflow-hidden rounded-lg border border-border bg-secondary/30">
      <div className="flex animate-marquee w-max">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
          >
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${
                item.type === "group"
                  ? "bg-gold/10 text-gold"
                  : "bg-saving/10 text-saving"
              }`}
            >
              {item.tag}
            </span>
            <span className="text-[11px] text-foreground/70 whitespace-nowrap">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Section label */}
    <p className="text-xs text-muted-foreground mb-3 self-start">
      告诉我你想要的家 👇
    </p>

    {/* Quick prompts */}
    <div className="w-full space-y-2 mb-6">
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
