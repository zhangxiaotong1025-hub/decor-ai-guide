import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Sparkles, Gift } from "lucide-react";
import type { SceneStory } from "@/data/mockSceneStories";
import DetailGallery from "./story/DetailGallery";
import BeforeAfterSlider from "./story/BeforeAfterSlider";
import LifeSceneBoard from "./story/LifeSceneBoard";
import ProductList from "./story/ProductList";

interface SceneStorySheetProps {
  story: SceneStory | null;
  isOpen: boolean;
  bottomInset?: number;
  onClose: () => void;
  onStartChat: (prompt: string) => void;
  onFillPrompt?: (prompt: string) => void;
}

const SceneStorySheet = ({ story, isOpen, bottomInset = 0, onClose, onStartChat, onFillPrompt }: SceneStorySheetProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ top: 0 });
      setScrolled(false);
    }
  }, [isOpen, story?.id]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrolled(scrollRef.current.scrollTop > 120);
  }, []);

  const handleCustomize = useCallback((prompt: string) => {
    onClose();
    setTimeout(() => {
      if (onFillPrompt) onFillPrompt(prompt);
      else onStartChat(prompt);
    }, 300);
  }, [onClose, onFillPrompt, onStartChat]);

  if (!story) return null;

  const saved = story.brandTotal - story.ourTotal;
  const savedPct = Math.round((saved / story.brandTotal) * 100);
  const perDay = Math.round(story.ourTotal / 365 / 3); // ~3 year usage

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 bg-foreground/20 z-[65]"
            style={{ bottom: bottomInset }}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed left-0 right-0 z-[70] bg-background flex flex-col top-[env(safe-area-inset-top,0px)] rounded-t-[20px]"
            style={{ bottom: bottomInset, boxShadow: "0 -4px 40px rgba(0,0,0,0.08)" }}
          >
            {/* Floating header */}
            <div className="absolute top-0 left-0 right-0 z-20">
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-[3px] bg-primary-foreground/30 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-4 py-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: scrolled ? 1 : 0 }}
                  className="text-xs font-medium text-foreground bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full truncate"
                >
                  {story.persona}的家
                </motion.span>
                <button
                  onClick={onClose}
                  className="p-1.5 bg-foreground/20 backdrop-blur-sm rounded-full"
                >
                  <X className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto overscroll-contain">

              {/* ═══ 1. HERO — clean, no gimmicks ═══ */}
              <div className="relative h-[75vh] min-h-[440px] max-h-[620px]">
                <img src={story.heroImage} alt={story.hook} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-foreground/5" />

                <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary-foreground/90 text-foreground font-medium">{story.persona}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-foreground/30 text-primary-foreground backdrop-blur-sm">{story.area} · {story.roomType}</span>
                  </div>
                  <h2 className="font-serif text-[22px] leading-[1.3] font-medium text-foreground tracking-display mb-3">
                    {story.hook}
                  </h2>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-data text-3xl font-bold text-foreground">¥{story.ourTotal.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through font-mono-data">¥{story.brandTotal.toLocaleString()}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saving text-saving-foreground">省 {savedPct}%</span>
                  </div>
                </div>
              </div>

              {/* ═══ 2. "IMAGINE THIS" — the emotional hook ═══ */}
              {story.imagineScene && (
                <div className="px-5 py-8 border-b border-border/30">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">想象一下</p>
                  <p className="text-[15px] text-foreground leading-[1.9] font-light">
                    {story.imagineScene}
                  </p>
                </div>
              )}

              {/* ═══ 3. BEFORE / AFTER ═══ */}
              {story.beforeImage && (
                <BeforeAfterSlider beforeImage={story.beforeImage} afterImage={story.heroImage} />
              )}

              {/* ═══ 4. LIFE SCENES ═══ */}
              {story.lifeScenes && story.lifeScenes.length > 0 && (
                <LifeSceneBoard scenes={story.lifeScenes} />
              )}

              {/* ═══ 5. DETAIL GALLERY ═══ */}
              {story.detailImages && story.detailImages.length > 0 && (
                <DetailGallery images={story.detailImages} highlights={story.highlights} />
              )}

              {/* ═══ 6. USER REVIEW — real voice ═══ */}
              {story.userReview && (
                <div className="px-5 pb-8">
                  <div className="p-4 bg-secondary/30 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[11px]">
                        {story.userReview.name.slice(0, 1)}
                      </div>
                      <span className="text-xs font-medium text-foreground">{story.userReview.name}</span>
                      <span className="text-[10px] text-saving">已入住</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      "{story.userReview.text}"
                    </p>
                  </div>
                </div>
              )}

              {/* ═══ 7. PRODUCTS ═══ */}
              <ProductList products={story.products} totalSaved={saved} brandTotal={story.brandTotal} />

              {/* ═══ 8. COST REFRAME — make it relatable ═══ */}
              {story.costReframe && (
                <div className="px-5 pb-8">
                  <div className="text-center py-5 px-4 bg-secondary/20 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground mb-1">换个算法</p>
                    <p className="font-mono-data text-lg font-bold text-foreground mb-1">
                      每天 ¥{perDay}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {story.costReframe}
                    </p>
                  </div>
                </div>
              )}

              {/* ═══ 9. PAIN → SOLUTION bridge ═══ */}
              <div className="px-5 pb-8">
                <div className="flex gap-3">
                  <div className="flex-1 p-3 rounded-xl bg-shock/5 border border-shock/10">
                    <p className="text-[10px] text-shock/70 mb-1">痛点</p>
                    <p className="text-xs text-shock/90 leading-relaxed">{story.painPoint}</p>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-saving/5 border border-saving/10">
                    <p className="text-[10px] text-saving/70 mb-1">解法</p>
                    <p className="text-xs text-saving/90 leading-relaxed">
                      同源工厂直供，砍掉品牌溢价 {savedPct}%，品质一模一样
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══ 10. SOCIAL PROOF ═══ */}
              <div className="px-5 pb-10">
                <div className="flex items-center gap-3 py-3">
                  <div className="flex -space-x-2">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                        <span className="text-[9px]">{["🏠", "✨", "🛋️", "❤️"][i]}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{story.socialProof}</p>
                </div>
                <p className="text-center text-[10px] text-muted-foreground/60 mt-3">AI 会根据你的面积和预算，生成你的专属方案</p>
              </div>
            </div>

            {/* ═══ BOTTOM CTA ═══ */}
            <div className="flex-shrink-0 border-t border-border/50 bg-background/95 backdrop-blur-sm">
              <div className="px-5 pt-2.5 pb-1">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-shock/5 rounded-lg">
                  <Gift className="w-3.5 h-3.5 text-shock flex-shrink-0" />
                  <p className="text-[10px] text-shock leading-tight">
                    <span className="font-semibold">首次参团享折上折</span>
                    <span className="text-shock/70 ml-1">· 已有 {story.joinedCount} 人参与</span>
                  </p>
                </div>
              </div>
              <div className="px-5 pt-2 pb-3 flex gap-2.5">
                <button
                  onClick={() => { onClose(); setTimeout(() => onStartChat("我想从零开始，帮我设计一套专属方案"), 300); }}
                  className="flex-1 flex items-center justify-center gap-1 py-3 border border-border text-foreground text-xs font-medium rounded-xl hover:bg-secondary transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />专属定制
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCustomize(story.chatPrompt)}
                  className="flex-[1.5] flex items-center justify-center gap-1.5 py-3 bg-foreground text-background text-xs font-semibold rounded-xl shadow-elevated"
                >
                  <Zap className="w-3.5 h-3.5" />加入拼团 · 省 {savedPct}%
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SceneStorySheet;
