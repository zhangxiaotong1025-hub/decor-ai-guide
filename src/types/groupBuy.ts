import type { ProductItem } from "./product";

/* ─── Group Buy Pool ─── */

export type GroupBuyPoolStatus =
  | "recruiting"    // 招募中
  | "almost"        // 即将成团
  | "formed"        // 已成团，待用户确认
  | "confirmed"     // 用户已确认付款
  | "producing"     // 生产/备货中
  | "shipping"      // 发货中
  | "completed"     // 已完成
  | "failed";       // 成团失败

export type UserGroupBuyState =
  | "browsing"      // 浏览中
  | "reserved"      // 已占位
  | "pending_pay"   // 已成团待付款
  | "paid"          // 已付款
  | "fulfilled";    // 已履约

export interface GroupBuyPool {
  id: string;
  productId: string;
  product: ProductItem;
  type: "standard" | "custom";
  status: GroupBuyPoolStatus;
  /** 当前人数 */
  currentCount: number;
  /** 目标人数 */
  targetCount: number;
  /** 预计价格区间 */
  priceRange: [number, number];
  /** 成团锁定价（成团后才有） */
  finalPrice?: number;
  /** 单独购买价 */
  soloPrice: number;
  /** 创建时间 */
  createdAt: number;
  /** 预计成团剩余时间描述 */
  estimatedTime: string;
  /** 最近动态 */
  timeline: GroupBuyEvent[];
}

export interface GroupBuyEvent {
  id: string;
  type: "join" | "almost" | "formed" | "price_locked" | "shipped" | "custom_confirm";
  message: string;
  timestamp: number;
  /** 距现在多久 */
  timeAgo: string;
}

/** 用户参与的团购记录 */
export interface UserGroupBuy {
  poolId: string;
  pool: GroupBuyPool;
  userState: UserGroupBuyState;
  reservedAt: number;
  /** 定制商品：方案是否已确认 */
  designConfirmed?: boolean;
  /** 定制商品：意向金 */
  depositPaid?: boolean;
}

/** 定制团购的额外信息 */
export interface CustomGroupBuyInfo {
  /** 合并面积（㎡） */
  totalArea: number;
  /** 参与户数 */
  householdCount: number;
  /** 同材质合并节省 */
  materialSaving: number;
  steps: {
    label: string;
    status: "done" | "current" | "pending";
    description: string;
  }[];
}
