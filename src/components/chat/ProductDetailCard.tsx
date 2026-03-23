import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, Users, Zap } from "lucide-react";
import type { ProductItem } from "@/types/product";
import StandardProductDetail from "@/components/product/StandardProductDetail";
import CustomProductDetail from "@/components/product/CustomProductDetail";

interface ProductDetailCardProps {
  product: ProductItem | null;
  isOpen: boolean;
  bottomInset?: number;
  onClose: () => void;
  onReserve?: (product: ProductItem) => void;
}

const ProductDetailCard = ({ product, isOpen, bottomInset = 0, onClose, onReserve }: ProductDetailCardProps) => {
  const [reserved, setReserved] = useState(false);

  const isCustom = product ? product.groupBuy.type === "custom" : false;
  const remaining = product ? product.groupBuy.target - product.groupBuy.current : 0;

  const handleReserve = () => {
    setReserved(true);
    onReserve?.(product!);
    setTimeout(() => {
      setReserved(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-x-0 top-0 z-[70] bg-background flex flex-col"
          style={{
            bottom: bottomInset,
            boxShadow: "0 -4px 40px rgba(0,0,0,0.12), 0 -1px 6px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border/30">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1.5 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="text-xs font-medium text-foreground">
              {isCustom ? "定制方案" : "商品详情"}
            </span>
            <div className="w-7" />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {isCustom ? (
              <CustomProductDetail product={product} />
            ) : (
              <StandardProductDetail product={product} />
            )}
            <div className="h-36" />
          </div>

          {/* Bottom CTA — conversion-optimized */}
          <div className="flex-shrink-0 bg-background/95 backdrop-blur-md border-t border-border/30">
            {/* Urgency micro-bar */}
            {!reserved && (
              <div className="flex items-center justify-center gap-2 py-1.5 bg-destructive/[0.06]">
                {isCustom ? (
                  <Zap className="w-3 h-3 text-primary" />
                ) : (
                  <Clock className="w-3 h-3 text-destructive" />
                )}
                <span className="text-[10px] text-foreground font-medium">
                  {isCustom
                    ? `还差 ${remaining}${product.unit} 开机 · 拼板价 ¥${product.groupBuy.targetPrice}/${product.unit}`
                    : `还差 ${remaining} 人成团 · 底价 ¥${product.groupBuy.targetPrice.toLocaleString()}`
                  }
                </span>
              </div>
            )}

            <div className="px-5 py-3">
              {/* Price summary */}
              {!reserved && (
                <div className="flex items-baseline justify-between mb-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold text-foreground">
                      ¥{product.groupBuy.currentPrice.toLocaleString()}{isCustom ? `/${product.unit}` : ""}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ¥{(isCustom ? product.brandUnitPrice : product.brandPrice)?.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-destructive/10 text-destructive font-bold">
                    省 {Math.round((((isCustom ? (product.brandUnitPrice || 0) : product.brandPrice) - product.groupBuy.currentPrice) / (isCustom ? (product.brandUnitPrice || 1) : product.brandPrice)) * 100)}%
                  </span>
                </div>
              )}

              <button
                onClick={handleReserve}
                disabled={reserved}
                className={`w-full py-3.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all ${
                  reserved
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground text-background active:scale-[0.98]"
                }`}
              >
                {reserved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    已帮你锁住最低价，正在凑人
                  </>
                ) : isCustom ? (
                  "⚡ 先按这个思路做一版我的"
                ) : (
                  "⚡ 这个价格先帮我留住"
                )}
              </button>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                {reserved
                  ? "可以在「拼单助手」中查看进度"
                  : "0 成本占位 · 成团后再决定 · 不满意随时退出"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailCard;
