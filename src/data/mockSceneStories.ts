import sceneNordic from "@/assets/scene-nordic-living.jpg";
import sceneJapanese from "@/assets/scene-japanese-studio.jpg";
import sceneIndustrial from "@/assets/scene-industrial-loft.jpg";
import sceneFrench from "@/assets/scene-french-cream.jpg";

export interface SceneStory {
  id: string;
  /** 效果图 */
  heroImage: string;
  /** 人设标签 */
  persona: string;
  /** 一句话故事钩子 */
  hook: string;
  /** 空间类型 */
  roomType: string;
  /** 面积 */
  area: string;
  /** 风格标签 */
  styleTags: string[];
  /** 品牌店总价 */
  brandTotal: number;
  /** 我们的落地价 */
  ourTotal: number;
  /** 参与人数（社交证明） */
  joinedCount: number;
  /** 方案包含的商品数 */
  itemCount: number;
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
  },
];
