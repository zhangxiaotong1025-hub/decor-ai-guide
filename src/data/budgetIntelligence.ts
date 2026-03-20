import type { DesignSolution } from "@/types/chat";

/* ─── Budget Intelligence Data ─── */

export interface SpaceProfile {
  area: number;        // ㎡
  rooms: string;       // e.g. "客厅"
  lifestyle: string[]; // e.g. ["养猫", "常在家办公"]
  budgetRange: [number, number]; // [min, max]
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  /** 占总预算的合理比例 */
  recommendedPct: number;
  /** 当前方案分配金额 */
  allocated: number;
  /** 行业均价区间 */
  marketRange: [number, number];
  /** 为什么值这个价 */
  whyThisPrice: string;
  /** 降档选项 */
  downgrade?: { price: number; desc: string; tradeoff: string };
  /** 升档选项 */
  upgrade?: { price: number; desc: string; benefit: string };
}

export interface PriceInsight {
  title: string;
  content: string;
  type: "save" | "tip" | "warn";
}

export interface BudgetIntelligence {
  spaceProfile: SpaceProfile;
  totalBudget: number;
  categories: BudgetCategory[];
  insights: PriceInsight[];
  /** 三档方案 */
  tiers: {
    label: string;
    total: number;
    desc: string;
    changes: string[];
  }[];
  /** AI 的一句话总结 */
  summary: string;
}

/** 根据方案生成预算智能数据 */
export function generateBudgetIntelligence(sol: DesignSolution): BudgetIntelligence {
  const items = sol.productSelection.items;
  const total = sol.costOptimization.current;

  const categories: BudgetCategory[] = [
    {
      id: "sofa",
      name: "沙发",
      icon: "🛋️",
      recommendedPct: 20,
      allocated: items.find(i => i.category.includes("沙发"))?.price ?? 0,
      marketRange: [3000, 12000],
      whyThisPrice: "25㎡客厅适合2.8m三人位，科技布面料在这个尺寸的合理区间是 ¥3,500-5,500。我们选了中等偏上的配置——高回弹海绵密度45kg/m³，比普通款（35kg）贵约 ¥600，但久坐体验差别很大。",
      downgrade: { price: 3200, desc: "普通海绵 + 普通布艺", tradeoff: "坐感偏硬，2-3年后可能塌陷" },
      upgrade: { price: 6280, desc: "真皮面料 + 高密度海绵", benefit: "质感明显提升，使用寿命10年+" },
    },
    {
      id: "table",
      name: "茶几",
      icon: "🪑",
      recommendedPct: 8,
      allocated: items.find(i => i.category.includes("茶几"))?.price ?? 0,
      marketRange: [800, 4000],
      whyThisPrice: "茶几是功能件不是主角。白橡木框架 + 钢化玻璃这个配置，1.2m尺寸行业价在 ¥1,200-2,200。选这款主要因为圆角设计安全，和沙发2.8m配1.2m是黄金比例。",
      downgrade: { price: 980, desc: "颗粒板 + 贴皮", tradeoff: "质感会差，承重低，但功能完全够用" },
    },
    {
      id: "tv",
      name: "电视柜",
      icon: "📺",
      recommendedPct: 12,
      allocated: items.find(i => i.category.includes("电视柜"))?.price ?? 0,
      marketRange: [1500, 6000],
      whyThisPrice: "电视柜是视觉焦点。悬浮式设计比落地款贵约 ¥400，但显轻盈且方便扫地机器人。1.8m配3m电视墙比例很舒服，E0级环保板材是底线标准。",
      downgrade: { price: 1760, desc: "落地款 + 颗粒板", tradeoff: "质感差些，寿命短2-3年" },
      upgrade: { price: 3800, desc: "实木 + 隐藏式走线", benefit: "整体品质感明显提升" },
    },
    {
      id: "lighting",
      name: "灯具",
      icon: "💡",
      recommendedPct: 10,
      allocated: items.find(i => i.category.includes("灯具"))?.price ?? 0,
      marketRange: [1000, 5000],
      whyThisPrice: "25㎡需要3000-4000流明照明。三层照明（主灯+落地灯+射灯）比单一主灯贵 ¥800-1200，但氛围感完全不同。4000K自然光护眼是刚需，可调光是加分项。",
      upgrade: { price: 3800, desc: "智能照明系统", benefit: "语音/手机控制，场景一键切换" },
    },
    {
      id: "decor",
      name: "软装配饰",
      icon: "🌿",
      recommendedPct: 15,
      allocated: items.find(i => i.category.includes("软装"))?.price ?? 0,
      marketRange: [2000, 8000],
      whyThisPrice: "软装是最灵活的预算区。地毯（¥800-1500）、抱枕组（¥300-600）、绿植（¥200-500）、挂画（¥400-800）。这个价位能保证品质感，但可以后期慢慢添置。",
      downgrade: { price: 2500, desc: "先买基础款，后期慢慢加", tradeoff: "初期效果没那么完整，但省下来的钱可以后面补" },
    },
  ];

  const insights: PriceInsight[] = [
    {
      title: "你这个面积，这个预算够用",
      content: "25㎡客厅全屋家具，行业合理区间在 ¥1.5万-3万。你当前 ¥2.18万在中间偏上位置，品质和预算的平衡点选得不错。",
      type: "tip",
    },
    {
      title: "软装可以分批买",
      content: "软装配饰占了 ¥3,500，但这块最适合后期添置。先买沙发和茶几等核心件，软装可以住进去之后慢慢搭。能立省 ¥1,000。",
      type: "save",
    },
    {
      title: "沙发是花钱最值的地方",
      content: "每天至少坐3-4小时，好沙发和差沙发的日均使用成本差不到1块钱，但体验差距很大。这个位置建议不要省。",
      type: "tip",
    },
    {
      title: "注意灯具的隐性成本",
      content: "便宜灯具省了买的钱，但频闪伤眼、色温不对影响氛围。4000K无频闪是底线，这个不能妥协。",
      type: "warn",
    },
  ];

  return {
    spaceProfile: {
      area: 25,
      rooms: "客厅",
      lifestyle: ["看电影", "朋友聚会", "偶尔阅读"],
      budgetRange: [15000, 25000],
    },
    totalBudget: total,
    categories,
    insights,
    tiers: [
      {
        label: "省心版",
        total: total - 1800,
        desc: "满足基本需求，核心品质不打折",
        changes: ["软装基础款", "电视柜降档", "其他不变"],
      },
      {
        label: "平衡版",
        total,
        desc: "当前方案，品质和预算的最优解",
        changes: ["当前配置"],
      },
      {
        label: "品质版",
        total: total + 3500,
        desc: "核心件全面升级，长期更划算",
        changes: ["沙发升真皮", "灯具升智能", "其他不变"],
      },
    ],
    summary: `你的25㎡客厅，¥${total.toLocaleString()} 的预算分配是合理的。沙发和灯具建议不要省——这两个每天都用，体验差距大。软装可以后期慢慢加。如果预算紧张，优先保核心件品质，配饰后面补。`,
  };
}
