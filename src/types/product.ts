/** 拼团类型：成品优惠拼团 vs 定制生产拼团 */
export type GroupBuyType = "standard" | "custom";

export interface GroupBuyInfo {
  type: GroupBuyType;
  current: number;
  target: number;
  currentPrice: number;
  targetPrice: number;
  estimatedTime: string;
  explanation?: string;
  status?: string;
}

export interface ProductGalleryImage {
  src: string;
  alt: string;
  caption?: string;
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
  brandPrice: number;
  factory: {
    location: string;
    name: string;
    certifications: string[];
  };
  lifeReasons: string[];
  groupBuy: GroupBuyInfo;
  /** 主视觉大图 */
  heroImage?: string;
  /** 材质微距图 */
  textureImage?: string;
  /** 生活方式图 */
  lifestyleImage?: string;
  /** 工厂实景图 */
  factoryImage?: string;
  /** 空间布局图 */
  spaceImage?: string;
  /** 图片画廊 */
  gallery?: ProductGalleryImage[];
  unit?: string;
  unitPrice?: number;
  brandUnitPrice?: number;
}
