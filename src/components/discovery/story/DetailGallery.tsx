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

    {/* Full-bleed horizontal gallery with parallax-style depth */}
    <div className="flex gap-3 overflow-x-auto px-6 pb-3 scrollbar-hide snap-x snap-mandatory">
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, rotateY: -8 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          className="flex-shrink-0 w-[300px] relative rounded-2xl overflow-hidden snap-center group"
          style={{ perspective: "800px" }}
        >
          <motion.img
            src={img.src}
            alt={img.caption}
            className="w-full h-[220px] object-cover transition-transform duration-700"
            whileHover={{ scale: 1.05 }}
          />
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/5 to-transparent" />

          {/* Caption with subtle slide-up */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-4 pb-4"
            initial={{ y: 8 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 + 0.3 }}
          >
            <p className="text-[13px] text-primary-foreground font-medium leading-relaxed drop-shadow-md">
              {img.caption}
            </p>
          </motion.div>

          {/* Subtle glow on edge */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary-foreground/10 pointer-events-none" />
        </motion.div>
      ))}
    </div>

    {/* Highlights as flowing tags */}
    <div className="px-6 mt-4 flex flex-wrap gap-2">
      {highlights.map((h, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="text-[11px] text-foreground/80 px-3 py-1.5 bg-secondary/60 rounded-full border border-border/30"
        >
          ✓ {h}
        </motion.span>
      ))}
    </div>
  </div>
);

export default DetailGallery;
