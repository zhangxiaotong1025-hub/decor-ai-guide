/** 拼团类型：成品优惠拼团 vs 定制生产拼团 */
export type GroupBuyType = "standard" | "custom";

export interface GroupBuyInfo {
  type: GroupBuyType;
  /** 当前参与人数（成品）或拼单量（定制，单位㎡） */
  current: number;
  /** 目标人数/拼单量 */
  target: number;
  /** 当前已解锁价格 */
  currentPrice: number;
  /** 满员底价 */
  targetPrice: number;
  /** 预计达成时间描述 */
  estimatedTime: string;
  /** 定制拼团：解释为什么定制也能拼 */
  explanation?: string;
  /** 定制拼团：状态描述 */
  status?: string;
}

export interface ProductItem {
  id: string;
  category: string;
  name: string;
  brand: string;
  price: number;
  brief: string;
  why: string;
  material: string;
  color: string;
  performance: string;
  storage: string;
  texture: string;
  style: string;
  /** 品牌门店参考价 */
  brandPrice: number;
  /** 代工厂信息 */
  factory: {
    location: string;
    name: string;
    certifications: string[];
  };
  /** 选择这件商品的生活理由（面向消费者的人话） */
  lifeReasons: string[];
  /** 拼团信息 */
  groupBuy: GroupBuyInfo;
  /** 商品特写图 */
  heroImage?: string;
  /** 定制商品：单位 */
  unit?: string;
  /** 定制商品：单价（如 ¥/㎡） */
  unitPrice?: number;
  /** 定制商品：品牌单价 */
  brandUnitPrice?: number;
}
