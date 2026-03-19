import { motion } from "framer-motion";
import type { ProductCard } from "@/types/chat";

interface ProductCardsProps {
  products: ProductCard[];
}

const ProductCards = ({ products }: ProductCardsProps) => (
  <div className="space-y-2">
    {products.map((product, i) => (
      <motion.div
        key={product.name}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.25 }}
        whileHover={{ y: -1 }}
        className="bg-card shadow-layered rounded-inner p-3 border-l-[3px] border-primary"
      >
        <div className="flex items-start justify-between mb-1.5">
          <h4 className="text-xs font-semibold">{product.name}</h4>
          <span className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-button font-mono flex-shrink-0 ml-2">
            {product.tag}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-label text-muted-foreground font-mono w-8">尺寸</span>
            <span className="font-mono-data text-[11px]">{product.spec}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-label text-muted-foreground font-mono w-8">材质</span>
            <span className="text-[11px] text-muted-foreground">{product.material}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border">
          <span className="font-mono-data text-sm font-semibold text-primary">{product.price}</span>
          <button className="text-[10px] px-2.5 py-1 bg-secondary text-secondary-foreground rounded-button font-medium">
            查看详情
          </button>
        </div>
      </motion.div>
    ))}
  </div>
);

export default ProductCards;
