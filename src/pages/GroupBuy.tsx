import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Package, TrendingDown, ChevronRight, ShoppingBag } from "lucide-react";

interface GroupBuyItem {
  id: string;
  productName: string;
  image: string;
  originalPrice: number;
  groupPrice: number;
  current: number;
  target: number;
  endsIn: string;
  status: "active" | "formed" | "expired";
}

const MOCK_GROUP_BUYS: GroupBuyItem[] = [
  {
    id: "gb-1",
    productName: "北欧实木餐桌 1.4m",
    image: "/src/assets/scene-nordic-living.jpg",
    originalPrice: 4299,
    groupPrice: 1899,
    current: 8,
    target: 10,
    endsIn: "23:45:12",
    status: "active",
  },
  {
    id: "gb-2",
    productName: "日式原木书架",
    image: "/src/assets/scene-japanese-studio.jpg",
    originalPrice: 2680,
    groupPrice: 1280,
    current: 10,
    target: 10,
    endsIn: "-",
    status: "formed",
  },
];

const GroupBuy = () => {
  return (
    <div className="h-full flex flex-col">
      <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-base font-semibold tracking-display">拼团中心</h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-saving/10 border border-saving/20">
            <TrendingDown className="w-3 h-3 text-saving" />
            <span className="text-[10px] font-mono-data text-saving font-semibold">已省 ¥6,800</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {/* Summary banner */}
          <div className="flex gap-3 p-3 rounded-2xl bg-gradient-to-r from-primary/5 to-saving/5 border border-primary/10">
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-foreground">2</p>
              <p className="text-[10px] text-muted-foreground">进行中</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-saving">1</p>
              <p className="text-[10px] text-muted-foreground">已成团</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-foreground">¥6,800</p>
              <p className="text-[10px] text-muted-foreground">累计节省</p>
            </div>
          </div>

          {/* Group buy list */}
          {MOCK_GROUP_BUYS.map((item, i) => {
            const progress = (item.current / item.target) * 100;
            const savings = item.originalPrice - item.groupPrice;
            const formed = item.status === "formed";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-2xl bg-card border border-border/50 shadow-layered"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{item.productName}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-shock">¥{item.groupPrice.toLocaleString()}</span>
                      <span className="text-[11px] text-muted-foreground line-through">¥{item.originalPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-saving font-medium">省¥{savings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3 inline mr-0.5" />
                      {item.current}/{item.target} 人
                    </span>
                    {formed ? (
                      <span className="text-[10px] text-saving font-semibold flex items-center gap-0.5">
                        <Package className="w-3 h-3" /> 已成团
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {item.endsIn}
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className={`h-full rounded-full ${formed ? "bg-saving" : "bg-primary"}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Empty CTA */}
          {MOCK_GROUP_BUYS.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">还没有拼团</p>
              <p className="text-xs text-muted-foreground">在设计方案中选择商品即可发起拼团</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupBuy;
