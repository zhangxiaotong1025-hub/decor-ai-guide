import type { DesignSolution } from "@/types/chat";

/* ─── Budget Intelligence Data ─── */

export interface SpaceProfile {
  area: number;
  rooms: string;
  lifestyle: string[];
  budgetRange: [number, number];
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
  pct: number;
  description: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  recommendedPct: number;
  allocated: number;
  marketRange: [number, number];
  whyThisPrice: string;
  /** 成本构成明细 */
  costBreakdown: CostBreakdownItem[];
  downgrade?: { price: number; desc: string; tradeoff: string };
  upgrade?: { price: number; desc: string; benefit: string };
}

/** 全案大类拆分：硬装 / 软装 / 人工 / 设计 */
export interface MajorCostSection {
  id: string;
  name: string;
  icon: string;
  amount: number;
  pct: number;
  items: { label: string; amount: number; note: string }[];
  aiNote: string;
}

export interface PriceInsight {
  title: string;
  content: string;
  type: "save" | "tip" | "warn";
}

export interface BudgetIntelligence {
  spaceProfile: SpaceProfile;
  totalBudget: number;
  /** 大类拆分 */
  majorSections: MajorCostSection[];
  /** 单品品类 */
  categories: BudgetCategory[];
  insights: PriceInsight[];
  tiers: {
    label: string;
    total: number;
    desc: string;
    changes: string[];
  }[];
  summary: string;
}

/** 根据方案生成预算智能数据 */
export function generateBudgetIntelligence(sol: DesignSolution): BudgetIntelligence {
  const items = sol.productSelection.items;
  const total = sol.costOptimization.current;

  // ─── Major Cost Sections ───
  const softFurnishTotal = 12800;
  const hardFurnishTotal = 5600;
  const laborTotal = 2800;
  const designTotal = 800;

  const majorSections: MajorCostSection[] = [
    {
      id: "soft",
      name: "软装",
      icon: "🛋️",
      amount: softFurnishTotal,
      pct: Math.round((softFurnishTotal / total) * 100),
      items: [
        { label: "沙发", amount: 4580, note: "科技布三人位，高回弹海绵" },
        { label: "茶几", amount: 1680, note: "白橡木 + 钢化玻璃，1.2m" },
        { label: "灯具组合", amount: 2340, note: "主灯+落地灯+射灯三层照明" },
        { label: "软装配饰", amount: 3500, note: "地毯、抱枕、绿植、挂画" },
        { label: "窗帘", amount: 700, note: "遮光棉麻，2.8m层高" },
      ],
      aiNote: "软装占比 58% 是 25㎡ 客厅的合理水平。核心件（沙发+灯具）占了软装的 54%，这两样每天都用，值得投入。",
    },
    {
      id: "hard",
      name: "硬装",
      icon: "🧱",
      amount: hardFurnishTotal,
      pct: Math.round((hardFurnishTotal / total) * 100),
      items: [
        { label: "电视柜（含安装）", amount: 2380, note: "悬浮式，E0 环保板材" },
        { label: "墙面处理", amount: 1800, note: "乳胶漆局部翻新，含找平" },
        { label: "踢脚线", amount: 620, note: "PVC 仿木纹，25㎡周长" },
        { label: "开关面板更换", amount: 800, note: "全屋 12 个点位，无边框款" },
      ],
      aiNote: "硬装控制在总价的 26%，因为你是在已有基础上改造。如果是毛坯，硬装通常要占 40-50%。",
    },
    {
      id: "labor",
      name: "人工",
      icon: "👷",
      amount: laborTotal,
      pct: Math.round((laborTotal / total) * 100),
      items: [
        { label: "家具配送安装", amount: 800, note: "沙发+茶几+电视柜上门" },
        { label: "灯具安装", amount: 450, note: "含走线隐藏处理" },
        { label: "墙面施工", amount: 1200, note: "铲除+找平+刷漆，2 天工期" },
        { label: "保洁", amount: 350, note: "施工后深度保洁一次" },
      ],
      aiNote: "人工费 ¥2,800 在一线城市属于中等水平。墙面施工是大头，如果墙面不动可以省掉 ¥1,200。",
    },
    {
      id: "design",
      name: "设计服务",
      icon: "✏️",
      amount: designTotal,
      pct: Math.round((designTotal / total) * 100),
      items: [
        { label: "AI 方案生成", amount: 0, note: "已包含，无额外费用" },
        { label: "设计师复核", amount: 500, note: "专业设计师审核 AI 方案" },
        { label: "施工图输出", amount: 300, note: "含水电点位 + 家具定位图" },
      ],
      aiNote: "设计费只占 3.7%，因为 AI 承担了大部分方案工作。传统设计公司这部分通常要 ¥3,000-8,000。",
    },
  ];

  // ─── Per-item categories (with cost breakdown) ───
  const categories: BudgetCategory[] = [
    {
      id: "sofa",
      name: "沙发",
      icon: "🛋️",
      recommendedPct: 20,
      allocated: items.find(i => i.category.includes("沙发"))?.price ?? 4580,
      marketRange: [3000, 12000],
      whyThisPrice: "25㎡客厅适合2.8m三人位，科技布面料在这个尺寸的合理区间是 ¥3,500-5,500。高回弹海绵密度45kg/m³，比普通款（35kg）贵约 ¥600，但久坐体验差别很大。",
      costBreakdown: [
        { label: "框架结构", amount: 980, pct: 21, description: "实木框架+蛇形弹簧" },
        { label: "填充物", amount: 1260, pct: 28, description: "45kg/m³高回弹海绵+羽丝绒" },
        { label: "面料", amount: 860, pct: 19, description: "科技布 3.2m 用量" },
        { label: "生产制造", amount: 580, pct: 13, description: "工厂加工+品控" },
        { label: "物流安装", amount: 400, pct: 9, description: "干线+末端配送+上门安装" },
        { label: "品牌/渠道", amount: 500, pct: 10, description: "品牌运营+平台费用" },
      ],
      downgrade: { price: 3200, desc: "普通海绵 + 普通布艺", tradeoff: "坐感偏硬，2-3年后可能塌陷" },
      upgrade: { price: 6280, desc: "真皮面料 + 高密度海绵", benefit: "质感明显提升，使用寿命10年+" },
    },
    {
      id: "table",
      name: "茶几",
      icon: "🪑",
      recommendedPct: 8,
      allocated: items.find(i => i.category.includes("茶几"))?.price ?? 1680,
      marketRange: [800, 4000],
      whyThisPrice: "白橡木框架+钢化玻璃，1.2m尺寸行业价 ¥1,200-2,200。圆角设计安全，和沙发2.8m配1.2m是黄金比例。",
      costBreakdown: [
        { label: "木材", amount: 620, pct: 37, description: "白橡木框架用材" },
        { label: "玻璃台面", amount: 280, pct: 17, description: "8mm 钢化玻璃" },
        { label: "五金配件", amount: 180, pct: 11, description: "连接件+脚垫" },
        { label: "加工制造", amount: 320, pct: 19, description: "CNC+打磨+喷漆" },
        { label: "物流", amount: 280, pct: 16, description: "包装+配送" },
      ],
      downgrade: { price: 980, desc: "颗粒板 + 贴皮", tradeoff: "质感会差，承重低，但功能完全够用" },
    },
    {
      id: "tv",
      name: "电视柜",
      icon: "📺",
      recommendedPct: 12,
      allocated: items.find(i => i.category.includes("电视柜"))?.price ?? 2380,
      marketRange: [1500, 6000],
      whyThisPrice: "悬浮式设计比落地款贵约 ¥400，但显轻盈且方便扫地机器人。1.8m配3m电视墙比例舒服，E0级环保板材是底线。",
      costBreakdown: [
        { label: "板材", amount: 780, pct: 33, description: "E0 级实木颗粒板" },
        { label: "五金", amount: 420, pct: 18, description: "隐藏式挂件+铰链+滑轨" },
        { label: "加工", amount: 480, pct: 20, description: "封边+钻孔+组装" },
        { label: "安装", amount: 380, pct: 16, description: "墙面打孔+水平校准+挂装" },
        { label: "渠道", amount: 320, pct: 13, description: "品牌+售后保障" },
      ],
      downgrade: { price: 1760, desc: "落地款 + 颗粒板", tradeoff: "质感差些，寿命短2-3年" },
      upgrade: { price: 3800, desc: "实木 + 隐藏式走线", benefit: "整体品质感明显提升" },
    },
    {
      id: "lighting",
      name: "灯具",
      icon: "💡",
      recommendedPct: 10,
      allocated: items.find(i => i.category.includes("灯具"))?.price ?? 2340,
      marketRange: [1000, 5000],
      whyThisPrice: "25㎡需要3000-4000流明。三层照明（主灯+落地灯+射灯）比单一主灯贵 ¥800-1200，但氛围感完全不同。4000K自然光护眼是刚需。",
      costBreakdown: [
        { label: "主灯", amount: 980, pct: 42, description: "LED 吸顶灯 36W 无极调光" },
        { label: "落地灯", amount: 680, pct: 29, description: "阅读灯，可调角度" },
        { label: "射灯组", amount: 480, pct: 21, description: "轨道射灯 ×3" },
        { label: "安装", amount: 200, pct: 8, description: "接线+固定" },
      ],
      upgrade: { price: 3800, desc: "智能照明系统", benefit: "语音/手机控制，场景一键切换" },
    },
    {
      id: "decor",
      name: "软装配饰",
      icon: "🌿",
      recommendedPct: 15,
      allocated: items.find(i => i.category.includes("软装"))?.price ?? 3500,
      marketRange: [2000, 8000],
      whyThisPrice: "地毯（¥800-1500）、抱枕组（¥300-600）、绿植（¥200-500）、挂画（¥400-800）。这个价位保证品质感，但可以后期慢慢添置。",
      costBreakdown: [
        { label: "地毯", amount: 1200, pct: 34, description: "1.6×2.3m 仿羊毛短绒" },
        { label: "抱枕组", amount: 480, pct: 14, description: "4 只装，棉麻混纺" },
        { label: "绿植", amount: 380, pct: 11, description: "琴叶榕+龟背竹+花盆" },
        { label: "挂画", amount: 680, pct: 19, description: "装饰画 ×2，含装裱" },
        { label: "其他", amount: 760, pct: 22, description: "收纳盒、香薰、摆件等" },
      ],
      downgrade: { price: 2500, desc: "先买基础款，后期慢慢加", tradeoff: "初期效果没那么完整，但省下来的钱可以后面补" },
    },
  ];

  const insights: PriceInsight[] = [
    {
      title: "你这个面积，这个预算够用",
      content: "25㎡客厅全屋家具+基础硬装，行业合理区间在 ¥1.5万-3万。你当前 ¥2.18万在中间偏上位置，品质和预算的平衡点选得不错。",
      type: "tip",
    },
    {
      title: "硬装能省则省，软装别凑合",
      content: "你的硬装需求不大（墙面翻新为主），控制在 26% 很合理。软装是每天都看得到摸得到的，特别是沙发和灯具，建议不要在这两个地方省。",
      type: "tip",
    },
    {
      title: "人工费可以谈",
      content: "家具配送安装 ¥800 是标价，很多商家满额免安装费。建议在同一家买沙发+茶几+电视柜，安装费大概率能减免 ¥400-600。",
      type: "save",
    },
    {
      title: "墙面不动能省 ¥1,200",
      content: "如果现有墙面状态还行（无起皮、无明显色差），可以跳过墙面翻新，直接省掉材料费+人工 ¥1,200。这笔钱够升级沙发面料了。",
      type: "save",
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
    majorSections,
    categories,
    insights,
    tiers: [
      {
        label: "省心版",
        total: total - 2600,
        desc: "满足基本需求，核心品质不打折",
        changes: ["软装基础款", "电视柜降档", "跳过墙面翻新"],
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
        changes: ["沙发升真皮", "灯具升智能", "实木电视柜"],
      },
    ],
    summary: `你的25㎡客厅，¥${total.toLocaleString()} 包含软装 ¥12,800 + 硬装 ¥5,600 + 人工 ¥2,800 + 设计 ¥800。软装是大头占 58%，因为你是在已有基础上改造，硬装需求不大。沙发和灯具建议不要省——每天都用，体验差距大。`,
  };
}
