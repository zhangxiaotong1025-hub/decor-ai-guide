import sceneNordic from "@/assets/scene-nordic-living.jpg";
import sceneJapanese from "@/assets/scene-japanese-studio.jpg";
import sceneIndustrial from "@/assets/scene-industrial-loft.jpg";
import sceneFrench from "@/assets/scene-french-cream.jpg";

export interface StoryProduct {
  name: string;
  category: string;
  ourPrice: number;
  brandPrice: number;
}

export interface SceneStory {
  id: string;
  heroImage: string;
  persona: string;
  hook: string;
  roomType: string;
  area: string;
  styleTags: string[];
  brandTotal: number;
  ourTotal: number;
  joinedCount: number;
  itemCount: number;
  /** 人设背景故事 */
  backstory: string;
  /** 痛点 */
  painPoint: string;
  /** 设计亮点 */
  highlights: string[];
  /** 方案里的商品清单（简化版） */
  products: StoryProduct[];
  /** 对话入口 prompt */
  chatPrompt: string;
  /** 社交证明文案 */
  socialProof: string;
}

export const mockSceneStories: SceneStory[] = [
  {
    id: "story-nordic",
    heroImage: sceneNordic,
    persona: "养猫独居女生",
    hook: "月薪 8K，2.3 万搞定全屋，猫也满意",
    roomType: "客厅",
    area: "25㎡",
    styleTags: ["北欧温馨", "防猫抓", "小户型"],
    brandTotal: 82000,
    ourTotal: 23800,
    joinedCount: 847,
    itemCount: 5,
    backstory: "在杭州做运营的小鹿，月薪 8K，养了一只英短。搬进新租的房子，客厅空荡荡，网上看了一圈品牌店，沙发动辄一两万，还不防猫抓。",
    painPoint: "品牌店一套客厅要 8 万多，月薪 8K 根本不敢想",
    highlights: [
      "纳米防猫抓科技布沙发，猫随便挠",
      "不规则茶几留出瑜伽空间",
      "三层照明，下班一键切换放松模式",
    ],
    products: [
      { name: "悬浮云朵沙发", category: "沙发", ourPrice: 8999, brandPrice: 15000 },
      { name: "岩板不规则茶几", category: "茶几", ourPrice: 1680, brandPrice: 4200 },
      { name: "悬浮电视柜", category: "电视柜", ourPrice: 2560, brandPrice: 6000 },
      { name: "三层照明套装", category: "灯具", ourPrice: 2300, brandPrice: 5500 },
      { name: "软装搭配套装", category: "软装", ourPrice: 3500, brandPrice: 7000 },
    ],
    chatPrompt: "我想装修客厅，25平左右，养了一只猫，喜欢温馨一点的感觉，预算2万多",
    socialProof: "847 人照着这个方案装了家",
  },
  {
    id: "story-french",
    heroImage: sceneFrench,
    persona: "新婚小夫妻",
    hook: "婚房不想将就，3.8 万住出 15 万的感觉",
    roomType: "客厅 + 餐厅",
    area: "35㎡",
    styleTags: ["法式奶油", "高级感", "两居室"],
    brandTotal: 150000,
    ourTotal: 38000,
    joinedCount: 632,
    itemCount: 8,
    backstory: "小宇和阿暖刚领证，在成都买了套两居室。婚房想要法式奶油风，去家居城逛了一圈，一套沙发标价 3 万起，两个人的预算加一起也撑不住。",
    painPoint: "婚房想要高级感，品牌店一套客厅 15 万，两个人月供已经很紧",
    highlights: [
      "进口丝绒质感沙发，触感媲美大牌",
      "法式弧形餐桌，仪式感满分",
      "水晶吊灯 + 壁灯组合，ins 风氛围拉满",
    ],
    products: [
      { name: "法式弧形沙发", category: "沙发", ourPrice: 12800, brandPrice: 35000 },
      { name: "大理石餐桌", category: "餐桌", ourPrice: 5600, brandPrice: 18000 },
      { name: "水晶吊灯组合", category: "灯具", ourPrice: 4800, brandPrice: 15000 },
      { name: "丝绒窗帘套装", category: "软装", ourPrice: 3200, brandPrice: 8000 },
    ],
    chatPrompt: "我们刚结婚，客厅加餐厅大概35平，想要法式奶油风的感觉，预算4万左右",
    socialProof: "632 对新人选了这套方案",
  },
  {
    id: "story-japanese",
    heroImage: sceneJapanese,
    persona: "996 程序员",
    hook: "18㎡ 出租屋改造，下班终于有家的感觉",
    roomType: "一居室",
    area: "18㎡",
    styleTags: ["日式侘寂", "极简", "出租屋"],
    brandTotal: 35000,
    ourTotal: 12800,
    joinedCount: 1203,
    itemCount: 4,
    backstory: "阿泽在深圳做后端开发，996 是常态。18㎡ 的出租屋里只有房东留的旧床和破桌子，每天回家感觉不像家，像是个临时睡觉的地方。",
    painPoint: "出租屋不想花太多钱，但又不想每天在毫无生活感的房间里待着",
    highlights: [
      "榻榻米升降桌，工作/吃饭/休息三合一",
      "暖光纸灯笼，一盏灯改变整个氛围",
      "收纳系统让 18㎡ 住出 30㎡ 的感觉",
    ],
    products: [
      { name: "榻榻米升降桌", category: "桌几", ourPrice: 3200, brandPrice: 9000 },
      { name: "日式纸灯组合", category: "灯具", ourPrice: 1800, brandPrice: 5500 },
      { name: "收纳柜系统", category: "收纳", ourPrice: 4600, brandPrice: 12000 },
      { name: "棉麻软装套装", category: "软装", ourPrice: 2400, brandPrice: 6500 },
    ],
    chatPrompt: "出租屋18平想改造一下，喜欢日式简约风，预算控制在1.5万以内",
    socialProof: "1,203 个打工人改造了出租屋",
  },
  {
    id: "story-industrial",
    heroImage: sceneIndustrial,
    persona: "自由摄影师",
    hook: "工作室兼客厅，2.8 万打造酷感空间",
    roomType: "工作室",
    area: "30㎡",
    styleTags: ["工业风", "复古", "大空间"],
    brandTotal: 95000,
    ourTotal: 28000,
    joinedCount: 456,
    itemCount: 6,
    backstory: "老陈是个自由摄影师，工作室就是家，家就是工作室。想要一个既能拍照当背景、又能窝着看片的空间，但设计公司报价 10 万起步。",
    painPoint: "设计公司报价 10 万，自己又不懂搭配，担心工业风做出来像毛坯房",
    highlights: [
      "真皮沙发 + 做旧铁艺书架，拍照自带滤镜",
      "轨道射灯系统，拍摄打光一步到位",
      "水泥质感地毯，踩上去却很柔软",
    ],
    products: [
      { name: "复古真皮沙发", category: "沙发", ourPrice: 9800, brandPrice: 28000 },
      { name: "铁艺置物架", category: "收纳", ourPrice: 3600, brandPrice: 12000 },
      { name: "轨道射灯系统", category: "灯具", ourPrice: 4200, brandPrice: 15000 },
      { name: "水泥纹地毯", category: "软装", ourPrice: 2800, brandPrice: 8000 },
    ],
    chatPrompt: "我是自由职业，想把30平的空间改成工作室兼客厅，喜欢工业风，3万预算",
    socialProof: "456 位创意人选了这套方案",
  },
];
