import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, TrendingDown, Users } from "lucide-react";
import type { ProductItem } from "@/types/product";

interface PriceFlipCardProps {
  product: ProductItem;
  onTap?: (product: ProductItem) => void;
  delay?: number;
}

const PriceFlipCard = ({ product, onTap, delay = 0 }: PriceFlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const saved = product.brandPrice - product.price;
  const savedPercent = Math.round((saved / product.brandPrice) * 100);

  const handleFlip = () => {
    setFlipped(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="relative"
    >
      <div
        className="relative rounded-xl overflow-hidden bg-card shadow-layered border border-border cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => (flipped ? onTap?.(product) : handleFlip())}
      >
        {/* Hero Image Area */}
        {product.heroImage && (
          <div className="relative h-44 overflow-hidden">
            <img
              src={product.heroImage}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            
            {/* Category badge */}
            <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm font-medium">
              {product.category}
            </span>

            {/* Savings badge - always visible as hook */}
            <motion.span
              className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full bg-shock text-shock-foreground font-bold font-mono-data"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              省 {savedPercent}%
            </motion.span>

            {/* Product name overlay */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-sm font-semibold text-primary-foreground drop-shadow-md">{product.name}</h3>
              <p className="text-xs text-primary-foreground/80 mt-0.5 line-clamp-1">{product.brief}</p>
            </div>
          </div>
        )}

        {/* Price Area */}
        <div className="p-3.5">
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div
                key="front"
                exit={{ opacity: 0, rotateX: -90 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">品牌专柜价</span>
                  <div className="font-mono-data text-lg font-bold text-foreground">
                    ¥{product.brandPrice.toLocaleString()}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-shock/10 text-shock text-xs font-semibold border border-shock/20"
                >
                  <Eye className="w-3.5 h-3.5" />
                  揭开工厂底价
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">工厂直供价</span>
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        className="font-mono-data text-xl font-bold text-saving"
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        ¥{product.price.toLocaleString()}
                      </motion.span>
                      <span className="price-slash font-mono-data text-xs">
                        ¥{product.brandPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-end gap-1"
                  >
                    <span className="flex items-center gap-1 text-[10px] font-mono-data text-saving font-semibold">
                      <TrendingDown className="w-3 h-3" />
                      省 ¥{saved.toLocaleString()}
                    </span>
                  </motion.div>
                </div>

                {/* Group buy hint */}
                {product.groupBuy && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-3 pt-2.5 border-t border-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Users className="w-3 h-3 text-accent" />
                      <span>
                        {product.groupBuy.current}/{product.groupBuy.target} 人拼团中
                      </span>
                      <span className="text-accent font-semibold font-mono-data">
                        ¥{product.groupBuy.targetPrice.toLocaleString()}
                      </span>
                    </div>
                    <motion.span
                      className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent font-medium"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      加入省更多
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceFlipCard;
