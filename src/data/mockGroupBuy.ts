import type { GroupBuyPool, UserGroupBuy, GroupBuyEvent, CustomGroupBuyInfo } from "@/types/groupBuy";
import { mockProducts } from "./mockProducts";

const now = Date.now();
const hour = 3600000;
const day = 86400000;

/* ─── Standard product group buy (沙发) ─── */
const sofaEvents: GroupBuyEvent[] = [
  { id: "e1", type: "join", message: "用户 A*** 加入了拼单", timestamp: now - 6 * hour, timeAgo: "6小时前" },
  { id: "e2", type: "join", message: "用户 L*** 加入了拼单", timestamp: now - 4 * hour, timeAgo: "4小时前" },
  { id: "e3", type: "join", message: "又有 3 人加入", timestamp: now - 2 * hour, timeAgo: "2小时前" },
  { id: "e4", type: "almost", message: "还差 2 人即将成团！", timestamp: now - 30 * 60000, timeAgo: "30分钟前" },
];

const sofaPool: GroupBuyPool = {
  id: "pool-sofa-001",
  productId: "sofa-001",
  product: mockProducts[0],
  type: "standard",
  status: "recruiting",
  currentCount: 8,
  targetCount: 10,
  priceRange: [7900, 8100],
  soloPrice: 8999,
  createdAt: now - 2 * day,
  estimatedTime: "预计 1-2 天成团",
  timeline: sofaEvents,
};

/* ─── Custom product group buy (电视柜) ─── */
const tvEvents: GroupBuyEvent[] = [
  { id: "ce1", type: "join", message: "用户 W*** 提交了定制方案", timestamp: now - 3 * day, timeAgo: "3天前" },
  { id: "ce2", type: "join", message: "用户 Z*** 提交了同材质方案", timestamp: now - 2 * day, timeAgo: "2天前" },
  { id: "ce3", type: "custom_confirm", message: "已有 3 户确认方案", timestamp: now - 1 * day, timeAgo: "1天前" },
  { id: "ce4", type: "join", message: "用户 C*** 加入，累计面积 18.5㎡", timestamp: now - 5 * hour, timeAgo: "5小时前" },
];

const tvPool: GroupBuyPool = {
  id: "pool-tv-001",
  productId: "tv-001",
  product: mockProducts.length > 1 ? mockProducts[1] : mockProducts[0],
  type: "custom",
  status: "recruiting",
  currentCount: 5,
  targetCount: 8,
  priceRange: [1800, 2200],
  soloPrice: 2880,
  createdAt: now - 4 * day,
  estimatedTime: "预计 3-5 天达标",
  timeline: tvEvents,
};

/* ─── A "formed" pool demo (已成团) ─── */
const formedEvents: GroupBuyEvent[] = [
  ...sofaEvents,
  { id: "e5", type: "join", message: "第 10 人加入！", timestamp: now - 15 * 60000, timeAgo: "15分钟前" },
  { id: "e6", type: "formed", message: "🎉 已成团！最终价格已锁定", timestamp: now - 10 * 60000, timeAgo: "10分钟前" },
  { id: "e7", type: "price_locked", message: "成团价 ¥7,980 已确认", timestamp: now - 10 * 60000, timeAgo: "10分钟前" },
];

const sofaPoolFormed: GroupBuyPool = {
  ...sofaPool,
  id: "pool-sofa-formed",
  status: "formed",
  currentCount: 10,
  finalPrice: 7980,
  timeline: formedEvents,
};

/* ─── User's active group buys ─── */
export const mockUserGroupBuys: UserGroupBuy[] = [
  {
    poolId: "pool-sofa-001",
    pool: sofaPool,
    userState: "reserved",
    reservedAt: now - 3 * hour,
  },
  {
    poolId: "pool-tv-001",
    pool: tvPool,
    userState: "reserved",
    reservedAt: now - 1 * day,
    designConfirmed: false,
  },
];

/** 已成团的示例（用于演示成团确认流程） */
export const mockFormedGroupBuy: UserGroupBuy = {
  poolId: "pool-sofa-formed",
  pool: sofaPoolFormed,
  userState: "pending_pay",
  reservedAt: now - 3 * hour,
};

export const mockCustomGroupBuyInfo: CustomGroupBuyInfo = {
  totalArea: 18.5,
  householdCount: 5,
  materialSaving: 380,
  steps: [
    { label: "户型适配", status: "done", description: "AI 已匹配你的 25㎡ 客厅" },
    { label: "方案确认", status: "current", description: "确认尺寸、材质、颜色" },
    { label: "聚合生产", status: "pending", description: "达到 8 户后统一排产" },
  ],
};

export const mockAllPools: GroupBuyPool[] = [sofaPool, tvPool, sofaPoolFormed];
