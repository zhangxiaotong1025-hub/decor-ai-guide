import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import type { ProductItem } from "@/types/product";
import StandardProductDetail from "@/components/product/StandardProductDetail";
import CustomProductDetail from "@/components/product/CustomProductDetail";

interface ProductDetailCardProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReserve?: (product: ProductItem) => void;
}

const ProductDetailCard = ({ product, isOpen, onClose, onReserve }: ProductDetailCardProps) => {
  const [reserved, setReserved] = useState(false);

  const isCustom = product ? product.groupBuy.type === "custom" : false;

  const handleReserve = () => {
    setReserved(true);
    onReserve?.(product);
    // Auto close after brief feedback
    setTimeout(() => {
      setReserved(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-x-0 top-0 bottom-[56px] z-[50] bg-background flex flex-col rounded-t-[20px]"
          style={{
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
            <div className="h-32" />
          </div>

          {/* Bottom CTA */}
          <div className="flex-shrink-0 bg-background/90 backdrop-blur-md border-t border-border/30 px-5 py-3">
            <button
              onClick={handleReserve}
              disabled={reserved}
              className={`w-full py-3.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-all ${
                reserved
                  ? "bg-accent text-accent-foreground"
                  : "bg-foreground text-background"
              }`}
            >
              {reserved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  已帮你留住，正在帮你凑人
                </>
              ) : isCustom ? (
                "先按这个思路做一版我的"
              ) : (
                `这个价格先帮我留一下 · ¥${product.groupBuy.currentPrice.toLocaleString()}`
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {reserved
                ? "可以在「拼单助手」中查看进度"
                : isCustom
                  ? "方案可以继续改，细节可以慢慢确认"
                  : "成团后再决定要不要买，不会直接扣钱"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailCard;
