import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap, Factory, Shield, Truck, Award, Clock, Eye, Flame, TrendingDown } from "lucide-react";
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

const useLiveViewers = (base: number) => {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) setCount((c) => c + 1);
    }, 3500 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);
  return count;
};

const CustomProductDetail = ({ product }: Props) => {
  const progress = (product.groupBuy.current / product.groupBuy.target) * 100;
  const remaining = product.groupBuy.target - product.groupBuy.current;
  const viewers = useLiveViewers(12 + Math.floor(Math.random() * 8));
  const unitSaving = (product.brandUnitPrice || 0) - (product.unitPrice || 0);
  const unitSavingPct = product.brandUnitPrice ? Math.round((unitSaving / product.brandUnitPrice) * 100) : 0;

  return (
    <div className="bg-background">
      {/* ━━━ Hero: 定制效果图 + 价格区间 ━━━ */}
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

        {/* Live viewers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-foreground/60 text-background"
        >
          <Eye className="w-3 h-3" />
          <span className="text-[10px] font-medium">{viewers} 人正在看</span>
        </motion.div>

        {/* Hero overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-6 left-5 right-5"
        >
          <p className="text-[10px] tracking-widest text-foreground/60 uppercase mb-1.5">{product.category} · 定制方案</p>
          <h1 className="text-xl font-medium text-foreground leading-tight mb-3">为你家量身定制的效果</h1>

          <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border border-border/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-3.5 h-3.5 text-destructive" />
              <span className="text-[10px] font-medium text-destructive">柔性智造拼团价</span>
            </div>
            {product.unitPrice && (
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-mono text-2xl font-bold text-foreground">
                  ¥{product.unitPrice}/{product.unit}
                </span>
                {product.brandUnitPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    传统定制 ¥{product.brandUnitPrice}/{product.unit}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              {unitSavingPct > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-destructive/10 text-destructive font-bold">
                  省 {unitSavingPct}%
                </span>
              )}
              <span className="text-[11px] text-accent font-medium">
                每平米省 ¥{unitSaving.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ━━━ 紧迫感：拼板进度 ━━━ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mx-5 mt-4 mb-2 bg-primary/[0.04] border border-primary/15 rounded-xl p-3 flex items-center gap-3"
      >
        <Zap className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-foreground font-medium">
            已拼 {product.groupBuy.current}{product.unit}，还差 {remaining}{product.unit} 开机排产
          </p>
          <p className="text-[10px] text-muted-foreground">{product.groupBuy.estimatedTime}</p>
        </div>
        <span className="text-[10px] font-bold text-primary whitespace-nowrap">
          底价 ¥{product.groupBuy.targetPrice}/{product.unit}
        </span>
      </motion.div>

      {/* ━━━ 画廊 ━━━ */}
      {product.gallery && product.gallery.length > 0 && (
        <div className="py-4">
          <div className="flex gap-2.5 overflow-x-auto px-5 snap-x snap-mandatory scrollbar-hide pb-2">
            {product.gallery.map((img, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="flex-shrink-0 snap-center w-[72vw] max-w-[300px]"
              >
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
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

      {/* ━━━ 为什么这套舒服 ━━━ */}
      <Section>
        <SectionTag>为你定制</SectionTag>
        <h2 className="text-base font-medium text-foreground mb-1">这套为什么会舒服</h2>
        <p className="text-[11px] text-muted-foreground mb-4">严丝合缝的定制，告别卫生死角</p>

        <div className="relative rounded-2xl overflow-hidden mb-4">
          <img
            src={product.lifestyleImage || product.spaceImage || sceneMorning}
            alt="舒适空间"
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

        {/* AI reasoning */}
        <div className="bg-primary/[0.04] border border-primary/10 rounded-xl p-3 flex items-start gap-2.5">
          <span className="text-sm">🤖</span>
          <p className="text-[11px] text-foreground leading-relaxed">
            <span className="font-medium">AI 选品理由：</span>{product.why}
          </p>
        </div>
      </Section>

      {/* ━━━ 空间布局 ━━━ */}
      {product.spaceImage && (
        <div className="relative">
          <motion.div {...fadeUp}>
            <img src={product.spaceImage} alt="空间布局" className="w-full aspect-[4/3] object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <motion.div {...fadeUp} className="absolute bottom-5 left-5 right-5">
            <p className="text-[10px] tracking-widest text-primary-foreground/60 uppercase mb-1.5">Space</p>
            <p className="text-sm text-primary-foreground/90 leading-relaxed">严丝合缝，告别积灰死角</p>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">悬浮离地，扫地机器人自由通行</p>
          </motion.div>
        </div>
      )}

      {/* ━━━ 材质微距 ━━━ */}
      {product.textureImage && (
        <div className="relative">
          <motion.div {...fadeUp}>
            <img src={product.textureImage} alt="材质微距" className="w-full aspect-[4/3] object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          <motion.div {...fadeUp} className="absolute bottom-6 left-5 right-5">
            <p className="text-[10px] tracking-widest text-foreground/50 uppercase mb-1.5">Material</p>
            <h2 className="text-base font-medium text-foreground mb-1">{product.material}</h2>
            <p className="text-sm text-foreground/80">{product.texture}，{product.color}</p>
          </motion.div>
        </div>
      )}

      {/* ━━━ 价格脱水 — 定制也透明 ━━━ */}
      <Section>
        <SectionTag>价格透明</SectionTag>
        <h2 className="text-base font-medium text-foreground mb-1">定制也能买的明白</h2>
        <p className="text-[11px] text-muted-foreground mb-4">传统定制溢价高达 {unitSavingPct}%，我们直接砍掉</p>

        {product.brandUnitPrice && product.unitPrice && (
          <div className="space-y-3 mb-4">
            <PriceRow
              label="传统定制价"
              price={`¥${product.brandUnitPrice}/${product.unit}`}
              strikethrough
              note="含品牌溢价、门店租金、销售提成"
            />
            <div className="flex items-center gap-2 px-2">
              <TrendingDown className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] text-accent font-medium">去掉所有中间环节</span>
            </div>
            <PriceRow
              label="工厂直供价"
              price={`¥${product.unitPrice}/${product.unit}`}
              note="柔性产线、同等品质、工厂直发"
            />
            <div className="flex items-center gap-2 px-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-primary font-medium">AI 拼板再降</span>
            </div>
            <PriceRow
              label="🔥 拼板底价"
              price={`¥${product.groupBuy.targetPrice}/${product.unit}`}
              highlight
              note={`满${product.groupBuy.target}${product.unit}开机，板材利用率↑20%，成本直返`}
            />
          </div>
        )}
      </Section>

      {/* ━━━ 拼板进度 — 柔性智造 ━━━ */}
      <motion.div {...fadeUp} className="mx-5 mb-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.03]">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

          <div className="p-5 relative">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">柔性生产拼板</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">AI 合并同材质需求，统一下料，成本直返</p>

            {/* Glowing progress */}
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
                已拼 {product.groupBuy.current}{product.unit} · 目标 {product.groupBuy.target}{product.unit}
              </span>
              <span className="text-primary font-medium">
                还差 {remaining}{product.unit}
              </span>
            </div>

            <div className="bg-background/60 rounded-xl p-3.5 border border-border/10">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[11px] text-muted-foreground">当前价</span>
                <span className="font-mono text-base text-foreground">¥{product.groupBuy.currentPrice}/{product.unit}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-primary font-medium">开机底价</span>
                <span className="font-mono text-xl font-bold text-primary">¥{product.groupBuy.targetPrice}/{product.unit}</span>
              </div>
            </div>

            {product.groupBuy.explanation && (
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/10">
                💡 {product.groupBuy.explanation}
              </p>
            )}
            {product.groupBuy.status && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-primary font-medium">{product.groupBuy.status}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ━━━ 定制三步流程 ━━━ */}
      <Section>
        <SectionTag>定制流程</SectionTag>
        <h2 className="text-base font-medium text-foreground mb-4">三步搞定，全程透明</h2>
        <div className="space-y-3">
          {[
            { num: "01", title: "户型适配", desc: "AI 根据你家尺寸自动调整，精度 ±0.5mm" },
            { num: "02", title: "确认细节", desc: "颜色、材质、五金件，每一项你都能看到清单" },
            { num: "03", title: "拼板生产", desc: "和同款需求一起下料，成本降低直接返还" },
          ].map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="flex items-start gap-4 bg-secondary/20 rounded-xl p-4"
            >
              <span className="font-mono text-2xl font-light text-primary/40 leading-none">{step.num}</span>
              <div className="pt-0.5">
                <p className="text-[12px] font-medium text-foreground mb-0.5">{step.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━ 工厂溯源 ━━━ */}
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
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { icon: Factory, text: "头部品牌同源工厂" },
            { icon: Shield, text: "品质造假，全额免单" },
            { icon: Truck, text: "送装一体，带走垃圾" },
            { icon: Award, text: "365天只换不修" },
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-2 py-2.5 px-3 bg-secondary/20 rounded-xl">
              <g.icon className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
              <span className="text-[11px] text-foreground">{g.text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InfoCard label="材质" value={product.material} />
          <InfoCard label="颜色" value={product.color} />
          <InfoCard label="风格" value={product.style} />
          <InfoCard label="产地" value={product.factory.location} />
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
  price: string;
  highlight?: boolean;
  strikethrough?: boolean;
  note?: string;
}) => (
  <div className={`rounded-xl p-3.5 ${highlight ? "bg-primary/[0.06] border border-primary/15" : "bg-secondary/20"}`}>
    <div className="flex items-baseline justify-between mb-0.5">
      <span className={`text-[12px] ${highlight ? "text-primary font-medium" : "text-muted-foreground"}`}>{label}</span>
      <span className={`font-mono text-lg ${
        strikethrough ? "line-through text-muted-foreground/60" : highlight ? "font-bold text-primary" : "font-medium text-foreground"
      }`}>
        {price}
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

export default CustomProductDetail;
