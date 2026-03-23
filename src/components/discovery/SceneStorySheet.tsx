import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Zap, Sparkles, Gift } from "lucide-react";
import type { SceneStory } from "@/data/mockSceneStories";
import DetailGallery from "./story/DetailGallery";
import BeforeAfterSlider from "./story/BeforeAfterSlider";
import LifeSceneBoard from "./story/LifeSceneBoard";
import ProductList from "./story/ProductList";
import AnimatedPrice from "./story/AnimatedPrice";

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
  const scrollY = useMotionValue(0);
  const heroScale = useTransform(scrollY, [0, 400], [1.08, 1.25]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ top: 0 });
      setScrolled(false);
      scrollY.set(0);
    }
  }, [isOpen, story?.id, scrollY]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const top = scrollRef.current.scrollTop;
      setScrolled(top > 120);
      scrollY.set(top);
    }
  }, [scrollY]);

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
                  className="p-1.5 bg-foreground/20 backdrop-blur-sm rounded-full transition-colors hover:bg-foreground/30"
                >
                  <X className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto overscroll-contain">

              {/* ═══ 1. CINEMATIC HERO with Ken Burns ═══ */}
              <div className="relative h-[80vh] min-h-[480px] max-h-[660px] overflow-hidden">
                <motion.img
                  src={story.heroImage}
                  alt={story.hook}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  style={{ scale: heroScale, opacity: heroOpacity }}
                  initial={{ scale: 1.0 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 12, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                />
                {/* Cinematic gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-foreground/5" />

                {/* Floating bokeh particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-primary-foreground/10"
                      style={{
                        width: 4 + Math.random() * 8,
                        height: 4 + Math.random() * 8,
                        left: `${10 + Math.random() * 80}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [0, -30 - Math.random() * 20, 0],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-7">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary-foreground/90 text-foreground font-medium">{story.persona}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-foreground/30 text-primary-foreground backdrop-blur-sm">{story.area} · {story.roomType}</span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="font-serif text-[24px] leading-[1.25] font-medium text-foreground tracking-display mb-4"
                  >
                    {story.hook}
                  </motion.h2>

                  {/* Animated price */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-baseline gap-3"
                  >
                    <AnimatedPrice value={story.ourTotal} delay={0.8} className="font-mono-data text-3xl font-bold text-foreground" />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-sm text-muted-foreground line-through font-mono-data"
                    >
                      ¥{story.brandTotal.toLocaleString()}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.6, type: "spring", stiffness: 400 }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saving text-saving-foreground"
                    >
                      省 {savedPct}%
                    </motion.span>
                  </motion.div>
                </div>

                {/* Scroll hint */}
                <motion.div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-5 h-8 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-1.5">
                    <motion.div
                      className="w-1 h-1.5 rounded-full bg-primary-foreground/60"
                      animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* ═══ 2. STORY — cinematic quote ═══ */}
              <div className="px-6 py-10">
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <span className="absolute -top-5 -left-1 text-5xl text-muted-foreground/15 font-serif select-none">"</span>
                  <p className="text-[15px] text-foreground leading-[1.8] font-light pl-4 italic">{story.backstory}</p>
                </motion.blockquote>

                <motion.div
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  whileInView={{ opacity: 1, x: 0, width: "auto" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-6 flex items-start gap-3 pl-4"
                >
                  <motion.div
                    className="w-[3px] min-h-[28px] bg-shock/60 rounded-full flex-shrink-0 self-stretch"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    style={{ originY: 0 }}
                  />
                  <p className="text-sm text-shock/90 leading-relaxed font-medium">{story.painPoint}</p>
                </motion.div>
              </div>

              {/* ═══ 3. BEFORE / AFTER ═══ */}
              {story.beforeImage && (
                <BeforeAfterSlider beforeImage={story.beforeImage} afterImage={story.heroImage} />
              )}

              {/* ═══ 4. DETAIL GALLERY ═══ */}
              {story.detailImages && story.detailImages.length > 0 && (
                <DetailGallery images={story.detailImages} highlights={story.highlights} />
              )}

              {/* ═══ 5. LIFE SCENES ═══ */}
              {story.lifeScenes && story.lifeScenes.length > 0 && (
                <LifeSceneBoard scenes={story.lifeScenes} />
              )}

              {/* ═══ 6. PRODUCTS ═══ */}
              <ProductList products={story.products} totalSaved={saved} brandTotal={story.brandTotal} />

              {/* ═══ 7. SOCIAL PROOF — animated ═══ */}
              <div className="px-6 pb-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="flex -space-x-2">
                    {[0, 1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center"
                      >
                        <span className="text-[9px]">{["🏠", "✨", "🛋️", "❤️"][i]}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{story.socialProof}</p>
                </motion.div>
                <p className="text-center text-[10px] text-muted-foreground/60 mt-4">AI 会根据你的面积和预算，生成你的专属方案</p>
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
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleCustomize(story.chatPrompt)}
                  className="flex-[1.5] relative flex items-center justify-center gap-1.5 py-3 bg-foreground text-background text-xs font-semibold rounded-xl shadow-elevated overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                  <Zap className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">加入拼团 · 省 {savedPct}%</span>
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
