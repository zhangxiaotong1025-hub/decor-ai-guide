import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import type { StoryProduct } from "@/data/mockSceneStories";

interface ProductListProps {
  products: StoryProduct[];
  totalSaved: number;
  brandTotal: number;
}

const ProductList = ({ products, totalSaved, brandTotal }: ProductListProps) => (
  <div className="px-6 pb-8">
    <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
      方案清单 · {products.length} 件
    </h3>

    <div className="space-y-2">
      {products.map((p, i) => {
        const itemSaved = p.brandPrice - p.ourPrice;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-secondary/30 transition-colors"
          >
            {/* Product thumbnail with hover effect */}
            {p.image ? (
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-layered"
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </motion.div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{getCategoryEmoji(p.category)}</span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-muted-foreground">{p.category}</span>
              <p className="text-sm text-foreground font-medium truncate">{p.name}</p>
              <span className="text-[10px] text-saving font-medium">省 ¥{itemSaved.toLocaleString()}</span>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <span className="font-mono-data text-sm font-bold text-foreground block">
                ¥{p.ourPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground line-through font-mono-data">
                {p.brandPrice.toLocaleString()}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Total savings — dramatic */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300 }}
      className="mt-4 relative overflow-hidden py-5 px-5 bg-saving/8 border border-saving/15 rounded-2xl"
    >
      {/* Subtle shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-saving/5 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-saving/15 flex items-center justify-center">
            <TrendingDown className="w-4.5 h-4.5 text-saving" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">总共省下</span>
            <p className="text-[10px] text-muted-foreground">品牌店要 ¥{brandTotal.toLocaleString()}</p>
          </div>
        </div>
        <span className="font-mono-data text-2xl font-bold text-saving">
          ¥{totalSaved.toLocaleString()}
        </span>
      </div>
    </motion.div>
  </div>
);

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    '沙发': '🛋️', '茶几': '☕', '电视柜': '📺', '灯具': '💡',
    '软装': '🎨', '餐桌': '🍽️', '床': '🛏️', '椅': '🪑',
    '桌': '🖥️', '收纳': '📦', '柜': '🗄️', '床垫': '😴',
    '床品': '🌙', '墙面': '🧱', '地板': '🪵', '花架': '🌿',
    '浴缸': '🛁', '花洒': '🚿', '镜柜': '🪞', '五金': '🔧',
    '床帘': '🪟', '台面': '🔲', '橱柜': '🏠',
  };
  return map[category] || '📦';
}

export default ProductList;
