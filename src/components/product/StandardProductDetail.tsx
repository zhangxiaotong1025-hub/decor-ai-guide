import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Users, Factory, Shield, Truck, Award, Clock, TrendingDown, Eye, Flame, ChevronRight } from "lucide-react";
import type { ProductItem } from "@/types/product";
import sceneMorning from "@/assets/scene-morning.jpg";

interface Props {
  product: ProductItem;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

/** Animated counter */
const AnimatedNumber = ({ value, duration = 1.2 }: { value: number; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(value * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <span ref={ref}>0</span>;
};

/** Fake live viewer count that ticks up */
const useLiveViewers = (base: number) => {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) setCount((c) => c + 1);
    }, 3000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);
  return count;
};

const StandardProductDetail = ({ product }: Props) => {
  const progress = (product.groupBuy.current / product.groupBuy.target) * 100;
  const brandSaving = product.brandPrice - product.price;
  const brandSavingPct = Math.round((brandSaving / product.brandPrice) * 100);
  const groupSaving = product.price - product.groupBuy.targetPrice;
  const totalSaving = product.brandPrice - product.groupBuy.targetPrice;
  const totalSavingPct = Math.round((totalSaving / product.brandPrice) * 100);
  const viewers = useLiveViewers(18 + Math.floor(Math.random() * 12));
  const remaining = product.groupBuy.target - product.groupBuy.current;
  const [activeGallery, setActiveGallery] = useState(0);
  const gallery = product.gallery || [];

  return (
    <div className="bg-background">
      {/* ━━━ Hero: 全幅产品图 + 价格锚定 ━━━ */}
      <div className="relative">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full h-[70vh] min-h-[420px] overflow-hidden"
        >
          <img
            src={product.heroImage || sceneMorning}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Live viewers badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-foreground/60 text-background"
        >
          <Eye className="w-3 h-3" />
          <span className="text-[10px] font-medium">{viewers} 人正在看</span>
        </motion.div>

        {/* Hero info overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-6 left-5 right-5"
        >
          <p className="text-[10px] tracking-widest text-foreground/60 uppercase mb-1.5">{product.category}</p>
          <h1 className="text-xl font-medium text-foreground leading-tight mb-3">{product.name}</h1>

          {/* Price anchoring - the kill shot */}
          <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border border-border/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-3.5 h-3.5 text-destructive" />
              <span className="text-[10px] font-medium text-destructive">限时工厂直供价</span>
            </div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-mono text-3xl font-bold text-foreground">
                ¥<AnimatedNumber value={product.groupBuy.currentPrice} />
              </span>
              <span className="text-sm text-muted-foreground line-through">
                品牌价 ¥{product.brandPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-destructive/10 text-destructive font-bold">
                省 {brandSavingPct}%
              </span>
              <span className="text-[11px] text-accent font-medium">
                已帮你省 ¥{brandSaving.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ━━━ 紧迫感条幅 ━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mx-5 mt-4 mb-2 bg-destructive/[0.06] border border-destructive/15 rounded-xl p-3 flex items-center gap-3"
      >
        <div className="flex-shrink-0">
          <Clock className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-foreground font-medium">
            还差 {remaining} 人成团，底价再降 ¥{groupSaving.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">{product.groupBuy.estimatedTime}</p>
        </div>
        <span className="text-[10px] font-bold text-destructive whitespace-nowrap">
          总省 ¥{totalSaving.toLocaleString()}
        </span>
      </motion.div>

      {/* ━━━ 图片画廊 ━━━ */}
      {gallery.length > 0 && (
        <div className="py-4">
          <div className="flex gap-2.5 overflow-x-auto px-5 snap-x snap-mandatory scrollbar-hide pb-2">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="flex-shrink-0 snap-center w-[72vw] max-w-[300px]"
                onClick={() => setActiveGallery(i)}
              >
                <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] transition-all ${
                  activeGallery === i ? "ring-2 ring-primary" : ""
                }`}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
                {img.caption && (
                  <p className="text-[11px] text-muted-foreground mt-2 px-1">{img.caption}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ 为什么适合你 — 生活场景代入 ━━━ */}
      <Section>
        <SectionTag>为你挑选</SectionTag>
        <h2 className="text-base font-medium text-foreground mb-1">为什么是这一款</h2>
        <p className="text-[11px] text-muted-foreground mb-4">不是"好看就选"，是放在你家里最合适</p>

        <div className="relative rounded-2xl overflow-hidden mb-4">
          <img
            src={product.lifestyleImage || product.heroImage || sceneMorning}
            alt="使用场景"
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {product.lifeReasons.map((reason, i) => (
              <motion.p
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="text-[12px] text-primary-foreground/90 leading-relaxed mb-1 last:mb-0"
              >
                ✔ {reason}
              </motion.p>
            ))}
          </div>
        </div>

        {/* AI recommendation badge */}
        <div className="bg-primary/[0.04] border border-primary/10 rounded-xl p-3 flex items-start gap-2.5">
          <span className="text-sm">🤖</span>
          <p className="text-[11px] text-foreground leading-relaxed">
            <span className="font-medium">AI 选品理由：</span>{product.why}
          </p>
        </div>
      </Section>

      {/* ━━━ 材质微距 — 触感可视化 ━━━ */}
      {product.textureImage && (
        <div className="relative">
          <motion.div {...fadeUp}>
            <img src={product.textureImage} alt="材质微距" className="w-full aspect-[4/3] object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          <motion.div {...fadeUp} className="absolute bottom-6 left-5 right-5">
            <p className="text-[10px] tracking-widest text-foreground/50 uppercase mb-1.5">Material</p>
            <h2 className="text-base font-medium text-foreground mb-1">{product.material}</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {product.texture}，{product.performance}
            </p>
          </motion.div>
        </div>
      )}

      {/* ━━━ 价格脱水 — 买的明明白白 ━━━ */}
      <Section>
        <SectionTag>价格透明</SectionTag>
        <h2 className="text-base font-medium text-foreground mb-1">每一分钱花在哪里</h2>
        <p className="text-[11px] text-muted-foreground mb-4">去掉品牌溢价，只为真实价值买单</p>

        {/* Price waterfall */}
        <div className="space-y-3 mb-4">
          <PriceRow
            label="品牌专柜价"
            price={product.brandPrice}
            highlight={false}
            strikethrough
            note="含品牌溢价、渠道费用、广告费"
          />
          <div className="flex items-center gap-2 px-2">
            <TrendingDown className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] text-accent font-medium">去掉品牌溢价 -{brandSavingPct}%</span>
          </div>
          <PriceRow
            label="工厂直供价"
            price={product.price}
            highlight={false}
            note="同源工厂、同等品质、零中间商"
          />
          <div className="flex items-center gap-2 px-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-primary font-medium">拼团集采再降</span>
          </div>
          <PriceRow
            label="🔥 拼团底价"
            price={product.groupBuy.targetPrice}
            highlight
            note={`满${product.groupBuy.target}人即达，总省 ¥${totalSaving.toLocaleString()}（${totalSavingPct}%）`}
          />
        </div>
      </Section>

      {/* ━━━ 拼团进度 — 紧迫感 ━━━ */}
      <motion.div {...fadeUp} className="mx-5 mb-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.03]">
          {/* Animated glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          
          <div className="p-5 relative">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">拼团进度</span>
              <span className="ml-auto text-[10px] text-primary font-bold">
                还差 {remaining} 人
              </span>
            </div>

            {/* Glowing progress bar */}
            <div className="relative h-3 bg-secondary rounded-full mb-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: `${progress}%`, opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-primary rounded-full blur-md"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] mb-4">
              <span className="text-muted-foreground">
                已有 {product.groupBuy.current} 人 · 目标 {product.groupBuy.target} 人
              </span>
              <span className="text-muted-foreground">{product.groupBuy.estimatedTime}</span>
            </div>

            {/* Price comparison in group buy */}
            <div className="bg-background/60 rounded-xl p-3.5 border border-border/10">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[11px] text-muted-foreground">当前价</span>
                <span className="font-mono text-base text-foreground">¥{product.groupBuy.currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-primary font-medium">成团底价</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-primary">¥{product.groupBuy.targetPrice.toLocaleString()}</span>
                  <span className="text-[10px] text-accent font-medium">
                    再省 ¥{groupSaving.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ 空间布局图 ━━━ */}
      {product.spaceImage && (
        <div className="relative">
          <motion.div {...fadeUp}>
            <img src={product.spaceImage} alt="空间布局" className="w-full aspect-[4/3] object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <motion.div {...fadeUp} className="absolute bottom-5 left-5 right-5">
            <p className="text-[10px] tracking-widest text-primary-foreground/60 uppercase mb-1.5">Space</p>
            <p className="text-sm text-primary-foreground/90 leading-relaxed">放在你家客厅，进门不觉得挤</p>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">中间留出活动空间，走动自如</p>
          </motion.div>
        </div>
      )}

      {/* ━━━ 工厂溯源 — 信任背书 ━━━ */}
      {product.factoryImage && (
        <div className="relative">
          <motion.div {...fadeUp}>
            <img src={product.factoryImage} alt="工厂实景" className="w-full aspect-[16/9] object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <motion.div {...fadeUp} className="absolute bottom-5 left-5 right-5">
            <p className="text-[10px] tracking-widest text-foreground/50 uppercase mb-1.5">Factory</p>
            <p className="text-sm font-medium text-foreground mb-1">
              {product.factory.location} · {product.factory.name}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {product.factory.certifications.map((cert, i) => (
                <span key={i} className="text-[10px] bg-background/80 backdrop-blur-sm text-muted-foreground px-2 py-1 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ━━━ 信任保障 ━━━ */}
      <Section>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Factory, text: "头部品牌同源工厂" },
            { icon: Shield, text: "品质造假，全额免单" },
            { icon: Truck, text: "送装一体，带走垃圾" },
            { icon: Award, text: "365天只换不修" },
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-2 py-2.5 px-3 bg-secondary/15 rounded-xl">
              <g.icon className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
              <span className="text-[11px] text-foreground">{g.text}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ━━━ 补充参数 ━━━ */}
      <Section>
        <div className="grid grid-cols-2 gap-2">
          <InfoCard label="材质" value={product.material} />
          <InfoCard label="填充" value={product.performance} />
          <InfoCard label="颜色" value={product.color} />
          <InfoCard label="风格" value={product.style} />
        </div>
      </Section>

      <div className="h-4" />
    </div>
  );
};

/* ─── Sub-components ─── */

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="px-5 py-5">{children}</div>
);

const SectionTag = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] tracking-widest text-primary/60 uppercase mb-2">{children}</p>
);

const PriceRow = ({ label, price, highlight, strikethrough, note }: {
  label: string;
  price: number;
  highlight: boolean;
  strikethrough?: boolean;
  note?: string;
}) => (
  <div className={`rounded-xl p-3.5 ${highlight ? "bg-primary/[0.06] border border-primary/15" : "bg-secondary/20"}`}>
    <div className="flex items-baseline justify-between mb-0.5">
      <span className={`text-[12px] ${highlight ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</span>
      <span className={`font-mono text-lg ${
        strikethrough ? "line-through text-muted-foreground/60" : highlight ? "font-bold text-primary" : "font-medium text-foreground"
      }`}>
        ¥{price.toLocaleString()}
      </span>
    </div>
    {note && <p className={`text-[10px] ${highlight ? "text-primary/70" : "text-muted-foreground/60"}`}>{note}</p>}
  </div>
);

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-secondary/20 rounded-xl p-3"
  >
    <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
    <p className="text-[12px] text-foreground font-medium">{value}</p>
  </motion.div>
);

export default StandardProductDetail;
