import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Sparkles, TrendingDown, ChevronRight, Gift } from "lucide-react";
import type { SceneStory } from "@/data/mockSceneStories";

interface SceneStorySheetProps {
  story: SceneStory | null;
  isOpen: boolean;
  bottomInset?: number;
  onClose: () => void;
  onStartChat: (prompt: string) => void;
  onFillPrompt?: (prompt: string) => void;
}

/* ─── Main Sheet ─── */
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 bg-foreground/20 z-[65]"
            style={{ bottom: bottomInset }}
            onClick={onClose}
          />

          {/* Sheet */}
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

            {/* Scrollable content */}
            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto overscroll-contain">

              {/* ═══ 1. CINEMATIC HERO ═══ */}
              <div className="relative h-[85vh] min-h-[520px] max-h-[700px]">
                <img
                  src={story.heroImage}
                  alt={story.hook}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Cinematic gradient — subtle top, strong bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-foreground/10" />

                {/* Hero content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">
                  {/* Persona pill */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary-foreground/90 text-foreground font-medium tracking-wide">
                      {story.persona}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-foreground/30 text-primary-foreground backdrop-blur-sm">
                      {story.area} · {story.roomType}
                    </span>
                  </motion.div>

                  {/* Hook — large serif for editorial feel */}
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-[22px] leading-[1.3] font-medium text-foreground tracking-display mb-4"
                  >
                    {story.hook}
                  </motion.h2>

                  {/* Price hero — dramatic */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex items-baseline gap-3"
                  >
                    <span className="font-mono-data text-3xl font-bold text-foreground">
                      ¥{story.ourTotal.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground line-through font-mono-data">
                      ¥{story.brandTotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saving text-saving-foreground">
                      省 {savedPct}%
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* ═══ 2. LIFE STORY — immersive quote ═══ */}
              <div className="px-6 py-10">
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <span className="absolute -top-4 -left-1 text-4xl text-muted-foreground/20 font-serif select-none">"</span>
                  <p className="text-base text-foreground leading-relaxed font-light pl-3 italic">
                    {story.backstory}
                  </p>
                </motion.blockquote>

                {/* Pain point — editorial callout */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mt-6 flex items-start gap-3 pl-3"
                >
                  <div className="w-[3px] h-full min-h-[32px] bg-shock/60 rounded-full flex-shrink-0" />
                  <p className="text-sm text-shock/90 leading-relaxed">
                    {story.painPoint}
                  </p>
                </motion.div>
              </div>

              {/* ═══ 3. SOLUTION HIGHLIGHTS — visual cards ═══ */}
              <div className="pb-8">
                <h3 className="px-6 text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
                  方案亮点
                </h3>
                <div className="flex gap-3 overflow-x-auto px-6 pb-2 scrollbar-hide">
                  {story.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex-shrink-0 w-[200px] p-4 bg-secondary/40 rounded-2xl border border-border/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{h}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ═══ 4. PRODUCTS — clean visual list ═══ */}
              <div className="px-6 pb-8">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-4">
                  方案清单 · {story.products.length} 件
                </h3>
                <div className="space-y-1">
                  {story.products.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-3.5 border-b border-border/40 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] text-muted-foreground w-10 flex-shrink-0">{p.category}</span>
                        <span className="text-sm text-foreground truncate">{p.name}</span>
                      </div>
                      <div className="flex items-baseline gap-2 flex-shrink-0 ml-3">
                        <span className="font-mono-data text-sm font-semibold text-foreground">
                          ¥{p.ourPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground line-through font-mono-data">
                          {p.brandPrice.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total savings */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-5 flex items-center justify-between py-4 px-4 bg-saving/5 border border-saving/10 rounded-2xl"
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-saving" />
                    <span className="text-sm text-foreground">总共省下</span>
                  </div>
                  <span className="font-mono-data text-xl font-bold text-saving">
                    ¥{saved.toLocaleString()}
                  </span>
                </motion.div>
              </div>

              {/* ═══ 5. SOCIAL PROOF — minimal, trust-building ═══ */}
              <div className="px-6 pb-10">
                <div className="flex items-center gap-3 py-3">
                  {/* Stacked avatars placeholder */}
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center"
                      >
                        <span className="text-[9px] text-muted-foreground">
                          {["🏠", "✨", "🛋️"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {story.socialProof}
                  </p>
                </div>

                <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
                  AI 会根据你的面积和预算，生成你的专属方案
                </p>
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
                  onClick={() => {
                    onClose();
                    setTimeout(() => onStartChat("我想从零开始，帮我设计一套专属方案"), 300);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 py-3 border border-border text-foreground text-xs font-medium rounded-xl hover:bg-secondary transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  专属定制
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCustomize(story.chatPrompt)}
                  className="flex-[1.5] flex items-center justify-center gap-1.5 py-3 bg-foreground text-background text-xs font-semibold rounded-xl shadow-elevated"
                >
                  <Zap className="w-3.5 h-3.5" />
                  加入拼团 · 省 {savedPct}%
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
