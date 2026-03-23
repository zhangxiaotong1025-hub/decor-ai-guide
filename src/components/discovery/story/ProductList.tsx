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
      {products.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0"
        >
          {/* Product thumbnail */}
          {p.image ? (
            <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{getCategoryEmoji(p.category)}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground">{p.category}</span>
            <p className="text-sm text-foreground truncate">{p.name}</p>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <span className="font-mono-data text-sm font-semibold text-foreground block">
              ¥{p.ourPrice.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground line-through font-mono-data">
              {p.brandPrice.toLocaleString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Total savings */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mt-4 flex items-center justify-between py-4 px-4 bg-saving/5 border border-saving/10 rounded-2xl"
    >
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-saving" />
        <div>
          <span className="text-sm font-medium text-foreground">总共省下</span>
          <p className="text-[10px] text-muted-foreground">品牌店要 ¥{brandTotal.toLocaleString()}</p>
        </div>
      </div>
      <span className="font-mono-data text-xl font-bold text-saving">
        ¥{totalSaved.toLocaleString()}
      </span>
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
