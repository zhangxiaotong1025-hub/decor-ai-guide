import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { getProductById } from "@/data/mockProducts";
import StandardProductDetail from "@/components/product/StandardProductDetail";
import CustomProductDetail from "@/components/product/CustomProductDetail";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || "");

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">商品不存在</p>
          <button onClick={() => navigate(-1)} className="text-primary text-sm">← 返回</button>
        </div>
      </div>
    );
  }

  const isCustom = product.groupBuy.type === "custom";

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/30 z-20 relative">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm font-medium text-foreground">
          {isCustom ? "定制方案" : "商品详情"}
        </span>
        <button className="p-1.5 -mr-1.5 hover:bg-secondary rounded-full transition-colors">
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {isCustom ? (
          <CustomProductDetail product={product} />
        ) : (
          <StandardProductDetail product={product} />
        )}
        {/* Spacer for bottom bar */}
        <div className="h-24" />
      </div>

      {/* Bottom CTA */}
      <div className="flex-shrink-0 bg-background/90 backdrop-blur-md border-t border-border/30 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button className="w-full py-3.5 bg-foreground text-background text-sm font-medium rounded-xl">
          {isCustom
            ? "先按这个思路做一版我的"
            : `这个价格先帮我留一下 · ¥${product.groupBuy.currentPrice.toLocaleString()}`
          }
        </button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {isCustom
            ? "方案可以继续改，细节可以慢慢确认"
            : "成团后再决定要不要买，不会直接扣钱"
          }
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
