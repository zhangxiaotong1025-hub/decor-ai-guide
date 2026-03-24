import { TrendingDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { StoryProduct } from "@/data/mockSceneStories";

interface ProductListProps {
  products: StoryProduct[];
  totalSaved: number;
  brandTotal: number;
}

const ProductList = ({ products, totalSaved, brandTotal }: ProductListProps) => {
  const navigate = useNavigate();

  return (
    <div className="px-5 pb-8">
      <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
        方案清单 · {products.length} 件
      </h3>

      <div className="space-y-1.5">
        {products.map((p, i) => {
          const itemSaved = p.brandPrice - p.ourPrice;
          const isClickable = !!p.productId;
          return (
            <div
              key={i}
              onClick={() => isClickable && navigate(`/product/${p.productId}`)}
              className={`flex items-center gap-3 py-2.5 px-2 rounded-xl transition-colors ${
                isClickable ? "cursor-pointer active:bg-secondary/40 hover:bg-secondary/20" : ""
              }`}
            >
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{getCategoryEmoji(p.category)}</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-muted-foreground">{p.category}</span>
                <p className="text-sm text-foreground font-medium truncate">{p.name}</p>
                <span className="text-[10px] text-saving font-medium">省 ¥{itemSaved.toLocaleString()}</span>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="font-mono-data text-sm font-bold text-foreground block">
                  ¥{p.ourPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground line-through font-mono-data">
                  {p.brandPrice.toLocaleString()}
                </span>
              </div>

              {isClickable && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between py-4 px-4 bg-saving/5 border border-saving/10 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-saving/10 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-saving" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">总共省下</span>
            <p className="text-[10px] text-muted-foreground">品牌店要 ¥{brandTotal.toLocaleString()}</p>
          </div>
        </div>
        <span className="font-mono-data text-xl font-bold text-saving">
          ¥{totalSaved.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    '沙发': '🛋️', '茶几': '☕', '电视柜': '📺', '灯具': '💡',
    '软装': '🎨', '餐桌': '🍽️', '床': '🛏️', '椅': '🪑',
    '桌': '🖥️', '收纳': '📦', '柜': '🗄️', '床垫': '😴',
    '床品': '🌙', '墙面': '🧱', '地板': '🪵', '花架': '🌿',
    '浴缸': '🛁', '花洒': '🚿', '镜柜': '🪞', '五金': '🔧',
    '床帘': '🪟', '台面': '🔲', '橱柜': '🏠', '桌几': '🪑',
  };
  return map[category] || '📦';
}

export default ProductList;
