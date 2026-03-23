import { motion } from "framer-motion";
import type { DetailImage } from "@/data/mockSceneStories";

interface DetailGalleryProps {
  images: DetailImage[];
  highlights: string[];
}

const DetailGallery = ({ images, highlights }: DetailGalleryProps) => (
  <div className="pb-8">
    <h3 className="px-6 text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
      设计细节
    </h3>

    {/* Horizontal scrolling gallery with captions on images */}
    <div className="flex gap-3 overflow-x-auto px-6 pb-3 scrollbar-hide snap-x snap-mandatory">
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex-shrink-0 w-[280px] relative rounded-2xl overflow-hidden snap-center"
        >
          <img src={img.src} alt={img.caption} className="w-full h-[200px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <p className="text-xs text-primary-foreground font-medium leading-relaxed drop-shadow-sm">
              {img.caption}
            </p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Text highlights below gallery */}
    <div className="px-6 mt-3 flex flex-wrap gap-2">
      {highlights.map((h, i) => (
        <span key={i} className="text-[11px] text-muted-foreground px-3 py-1.5 bg-secondary/50 rounded-full">
          ✓ {h}
        </span>
      ))}
    </div>
  </div>
);

export default DetailGallery;
