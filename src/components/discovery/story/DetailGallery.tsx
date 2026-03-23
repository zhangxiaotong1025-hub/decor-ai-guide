import type { DetailImage } from "@/data/mockSceneStories";

interface DetailGalleryProps {
  images: DetailImage[];
  highlights: string[];
}

const DetailGallery = ({ images, highlights }: DetailGalleryProps) => (
  <div className="pb-8">
    <h3 className="px-5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
      设计细节
    </h3>

    <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide snap-x snap-mandatory">
      {images.map((img, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[280px] relative rounded-2xl overflow-hidden snap-center"
        >
          <img src={img.src} alt={img.caption} className="w-full h-[200px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <p className="text-xs text-primary-foreground font-medium leading-relaxed">
              {img.caption}
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="px-5 mt-3 flex flex-wrap gap-2">
      {highlights.map((h, i) => (
        <span key={i} className="text-[11px] text-foreground/80 px-3 py-1.5 bg-secondary/50 rounded-full">
          ✓ {h}
        </span>
      ))}
    </div>
  </div>
);

export default DetailGallery;
