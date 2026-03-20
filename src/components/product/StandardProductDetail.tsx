import { motion } from "framer-motion";
import { useState } from "react";
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

const StandardProductDetail = ({ product }: Props) => {
  const progress = (product.groupBuy.current / product.groupBuy.target) * 100;
  const groupSavings = product.groupBuy.currentPrice - product.groupBuy.targetPrice;
  const [activeGallery, setActiveGallery] = useState(0);
  const gallery = product.gallery || [];

  return (
    <div className="bg-background">
      {/* ━━━ 第一屏：全幅沉浸式 Hero ━━━ */}
      <div className="relative">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full h-[85vh] min-h-[520px] overflow-hidden"
        >
          <img
            src={product.heroImage || sceneMorning}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        {/* Subtle bottom gradient for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-8 left-5 right-5"
        >
          <p className="text-xs tracking-widest text-foreground/70 uppercase mb-2">{product.category}</p>
          <h1 className="text-xl font-medium text-foreground leading-tight mb-3">
            这款{product.name}，放在普通客厅里会比较轻松
          </h1>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl font-semibold text-foreground">
              ¥{product.groupBuy.currentPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ¥{product.price.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ━━━ 图片画廊横滑 ━━━ */}
      {gallery.length > 0 && (
        <div className="py-6">
          <div className="flex gap-3 overflow-x-auto px-5 snap-x snap-mandatory scrollbar-hide pb-2">
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="flex-shrink-0 snap-center w-[75vw] max-w-[320px]"
                onClick={() => setActiveGallery(i)}
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  {i === activeGallery && (
                    <motion.div
                      layoutId="gallery-ring"
                      className="absolute inset-0 rounded-2xl ring-2 ring-primary"
                    />
                  )}
                </div>
                {img.caption && (
                  <p className="text-xs text-muted-foreground mt-2 px-1">{img.caption}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ 第二屏：适合什么情况 — 图文叠加 ━━━ */}
      <Section>
        <SectionLabel>适合你吗</SectionLabel>
        <SectionTitle>这款大概适合什么情况</SectionTitle>
        <div className="relative rounded-2xl overflow-hidden mb-5">
          <img
            src={product.lifestyleImage || product.heroImage || sceneMorning}
            alt="使用场景"
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {product.lifeReasons.slice(0, 3).map((reason, i) => (
              <motion.p
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="text-sm text-white/90 leading-relaxed mb-1.5 last:mb-0"
              >
                ✔ {reason}
              </motion.p>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          👉 属于那种不挑空间、用着也舒服的类型
        </p>
      </Section>

      {/* ━━━ 第三屏：材质微距 ━━━ */}
      {product.textureImage && (
        <div className="relative">
          <motion.div {...fadeUp} className="w-full">
            <img
              src={product.textureImage}
              alt="材质微距"
              className="w-full aspect-square object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          <motion.div
            {...fadeUp}
            className="absolute bottom-6 left-5 right-5"
          >
            <p className="text-xs tracking-widest text-foreground/60 uppercase mb-2">Material</p>
            <h2 className="text-base font-medium text-foreground mb-2">
              {product.material}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.texture ? `质感${product.texture}` : "坐下去是偏软一点的"}
              ，不是那种很塌的感觉，是可以久坐不累的
            </p>
          </motion.div>
        </div>
      )}

      {/* ━━━ 第四屏：为什么选这一款 ━━━ */}
      <Section>
        <SectionLabel>选品逻辑</SectionLabel>
        <SectionTitle>为什么会选这一款</SectionTitle>
        <p className="text-sm text-muted-foreground mb-5">
          这款不是"好看就选"，主要是它放在这种客厅里更合适：
        </p>
        <div className="space-y-4">
          {[
            { icon: "◻", text: `${product.style}，不会压空间` },
            { icon: "◻", text: `${product.color}比较中性，不容易和其他家具冲突` },
            { icon: "◻", text: "尺寸刚好，不会影响走动" },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="flex items-start gap-3 bg-secondary/40 rounded-xl p-3.5"
            >
              <span className="text-primary text-sm mt-0.5">✔</span>
              <span className="text-sm text-foreground leading-relaxed">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━ 第五屏：空间布局图 ━━━ */}
      {product.spaceImage && (
        <motion.div {...fadeUp} className="px-5 py-2">
          <SectionLabel>空间感受</SectionLabel>
          <SectionTitle>放在家里的感觉</SectionTitle>
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <img
              src={product.spaceImage}
              alt="空间布局"
              className="w-full aspect-square object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 pt-12">
              <p className="text-sm text-white/90 leading-relaxed">进门不会觉得拥挤</p>
              <p className="text-sm text-white/90 leading-relaxed">中间还能留出一块活动空间</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            平时坐着、躺着都比较自然，不用刻意去调整位置
          </p>
        </motion.div>
      )}

      <Divider />

      {/* ━━━ 第六屏：拼团解释 — 视觉化 ━━━ */}
      <Section>
        <SectionLabel>一起买</SectionLabel>
        <SectionTitle>这次一起买是怎么回事</SectionTitle>
        <div className="space-y-4 mb-6">
          {[
            { num: "01", text: "先把想买的人凑在一起" },
            { num: "02", text: "人数差不多了，去帮大家谈价格" },
            { num: "03", text: "价格不合适，也可以不买" },
          ].map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <span className="font-mono text-2xl font-light text-primary/40">{step.num}</span>
              <span className="text-sm text-foreground leading-relaxed pt-2">{step.text}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━ 第七屏：拼团进度 — 全幅卡片 ━━━ */}
      <motion.div {...fadeUp} className="mx-5 mb-6">
        <div className="bg-secondary/30 rounded-2xl p-5 relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <p className="text-sm text-foreground font-medium mb-4">
            现在已经有 {product.groupBuy.current} 个人在看这款
          </p>

          {/* Animated progress */}
          <div className="relative h-3 bg-secondary rounded-full mb-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: `${progress}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="absolute inset-y-0 left-0 bg-primary/30 rounded-full blur-sm"
            />
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-muted-foreground">
              {product.groupBuy.current}/{product.groupBuy.target} 人
            </span>
            <span className="text-muted-foreground">{product.groupBuy.estimatedTime}</span>
          </div>

          <div className="border-t border-border/30 pt-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-muted-foreground">当前价</span>
              <span className="font-mono text-lg font-medium text-foreground">
                ¥{product.groupBuy.currentPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">满{product.groupBuy.target}人底价</span>
              <span className="font-mono text-lg font-semibold text-primary">
                ¥{product.groupBuy.targetPrice.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-1.5 font-normal">
                  再省 ¥{groupSavings.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ 第八屏：工厂溯源 ━━━ */}
      {product.factoryImage && (
        <div className="relative">
          <motion.div {...fadeUp}>
            <img
              src={product.factoryImage}
              alt="工厂实景"
              className="w-full aspect-[16/9] object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <motion.div {...fadeUp} className="absolute bottom-5 left-5 right-5">
            <p className="text-xs tracking-widest text-foreground/60 uppercase mb-2">Factory</p>
            <p className="text-sm font-medium text-foreground mb-1">
              {product.factory.location} · {product.factory.name}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {product.factory.certifications.map((cert, i) => (
                <span key={i} className="text-xs bg-background/80 backdrop-blur-sm text-muted-foreground px-2 py-1 rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ━━━ 第九屏：补充信息 ━━━ */}
      <Section>
        <SectionLabel>Detail</SectionLabel>
        <SectionTitle>补充信息</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <InfoCard label="材质" value={product.material} />
          <InfoCard label="填充" value={product.performance} />
          <InfoCard label="颜色" value={product.color} />
          <InfoCard label="风格" value={product.style} />
        </div>
      </Section>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
};

/* ─── Sub-components ─── */

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="px-5 py-6">{children}</div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs tracking-widest text-primary/60 uppercase mb-2">{children}</p>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-medium text-foreground mb-4">{children}</h2>
);

const Divider = () => (
  <div className="mx-5 my-2 h-px bg-border/20" />
);

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-secondary/30 rounded-xl p-3.5"
  >
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-sm text-foreground font-medium">{value}</p>
  </motion.div>
);

export default StandardProductDetail;
