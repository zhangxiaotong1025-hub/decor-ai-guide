import { motion } from "framer-motion";
import { Zap, MessageCircle } from "lucide-react";
import PriceFlipCard from "./PriceFlipCard";
import { mockProducts } from "@/data/mockProducts";
import type { ProductItem } from "@/types/product";

interface DiscoveryFeedProps {
  onStartChat: (text: string) => void;
  onSelectProduct: (product: ProductItem) => void;
}

const totalBrandPrice = mockProducts.reduce((s, p) => s + p.brandPrice, 0);
const totalFactoryPrice = mockProducts.reduce((s, p) => s + p.price, 0);
const totalSaved = totalBrandPrice - totalFactoryPrice;

const DiscoveryFeed = ({ onStartChat, onSelectProduct }: DiscoveryFeedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-6"
    >
      {/* Hero Section - Price Shock */}
      <div className="relative px-4 pt-6 pb-5 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-base font-semibold tracking-display mb-1.5">
            同样的品质，为什么要多花
            <span className="text-shock font-mono-data font-bold"> ¥{totalSaved.toLocaleString()}</span>
            ？
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            点击卡片，揭开品牌溢价背后的工厂真实价格
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-4 mt-4"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-shock/8 border border-shock/15">
            <Zap className="w-3 h-3 text-shock" />
            <span className="text-[11px] font-medium text-shock">
              今日已有 <span className="font-mono-data font-bold">2,847</span> 人看穿价格
            </span>
          </div>
        </motion.div>
      </div>

      {/* Product Cards Feed */}
      <div className="px-4 space-y-4">
        {mockProducts.map((product, i) => (
          <PriceFlipCard
            key={product.id}
            product={product}
            onTap={onSelectProduct}
            delay={0.1 + i * 0.08}
          />
        ))}
      </div>

      {/* Bottom CTA - Enter Chat */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-4 mt-6"
      >
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartChat("我想装修客厅，25平左右，喜欢温馨一点的感觉，预算2万多")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-elevated"
        >
          <MessageCircle className="w-4 h-4" />
          让 AI 帮我定制专属方案
        </motion.button>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          告诉 AI 你的空间和预算，获取更低的定制报价
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DiscoveryFeed;
