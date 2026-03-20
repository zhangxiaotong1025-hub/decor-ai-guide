import { motion } from "framer-motion";
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

const CustomProductDetail = ({ product }: Props) => {
  const progress = (product.groupBuy.current / product.groupBuy.target) * 100;

  return (
    <div className="bg-background">
      {/* ━━━ 第一屏：全幅沉浸式定制效果图 ━━━ */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-8 left-5 right-5"
        >
          <p className="text-xs tracking-widest text-foreground/70 uppercase mb-2">{product.category} · 定制方案</p>
          <h1 className="text-xl font-medium text-foreground leading-tight mb-3">
            这是可以为你家定制出来的效果
          </h1>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">大致费用</span>
            <span className="font-mono text-2xl font-semibold text-foreground">
              ¥{(product.price * 0.8).toLocaleString()} - ¥{(product.price * 1.2).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">会根据你家尺寸再细调</p>
        </motion.div>
      </div>

      {/* ━━━ 画廊横滑 ━━━ */}
      {product.gallery && product.gallery.length > 0 && (
        <div className="py-6">
          <div className="flex gap-3 overflow-x-auto px-5 snap-x snap-mandatory scrollbar-hide pb-2">
            {product.gallery.map((img, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="flex-shrink-0 snap-center w-[75vw] max-w-[320px]"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
                {img.caption && (
                  <p className="text-xs text-muted-foreground mt-2 px-1">{img.caption}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ 第二屏：为什么舒服 — 图文叠加 ━━━ */}
      <Section>
        <SectionLabel>核心判断</SectionLabel>
        <SectionTitle>这套为什么会舒服</SectionTitle>
        <div className="relative rounded-2xl overflow-hidden mb-4">
          <img
            src={product.lifestyleImage || product.spaceImage || sceneMorning}
            alt="舒适空间"
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {product.lifeReasons.slice(0, 2).map((reason, i) => (
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
        <p className="text-sm text-muted-foreground">日常待着，会比较放松一点</p>
      </Section>

      {/* ━━━ 第三屏：空间布局图 ━━━ */}
      {product.spaceImage && (
        <div className="relative">
          <motion.div {...fadeUp}>
            <img
              src={product.spaceImage}
              alt="空间布局"
              className="w-full aspect-square object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          <motion.div {...fadeUp} className="absolute bottom-6 left-5 right-5">
            <p className="text-xs tracking-widest text-foreground/60 uppercase mb-2">Space</p>
            <h2 className="text-base font-medium text-foreground mb-2">
              放在你家，大概是什么感觉
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">进门不会被家具"堵住"</p>
            <p className="text-sm text-foreground/80 leading-relaxed">中间还能有一块比较完整的活动空间</p>
          </motion.div>
        </div>
      )}

      {/* ━━━ 第四屏：材质微距 ━━━ */}
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
          <motion.div {...fadeUp} className="absolute bottom-6 left-5 right-5">
            <p className="text-xs tracking-widest text-foreground/60 uppercase mb-2">Material</p>
            <h2 className="text-base font-medium text-foreground mb-2">{product.material}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              颜色{product.color}，搭一点木色。不是为了"好看"，是待久了不容易累
            </p>
          </motion.div>
        </div>
      )}

      {/* ━━━ 第五屏：关键细节 — 卡片组 ━━━ */}
      <Section>
        <SectionLabel>设计细节</SectionLabel>
        <SectionTitle>关键细节是怎么考虑的</SectionTitle>
        <div className="space-y-3">
          {[
            {
              icon: "→",
              title: "动线",
              desc: "从门口到沙发，再到阳台，是顺着走的",
              sub: "不会被家具挡住，也不用绕",
            },
            {
              icon: "□",
              title: "收纳",
              desc: `${product.name}带收纳`,
              sub: "遥控器、杂物直接放进去，不容易显乱",
            },
            {
              icon: "○",
              title: "整体感觉",
              desc: `颜色${product.color}，搭一点木色`,
              sub: "不是为了好看，是待久了不容易累",
            },
          ].map((detail, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="bg-secondary/40 rounded-2xl p-4"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-primary text-lg">{detail.icon}</span>
                <span className="text-sm font-medium text-foreground">{detail.title}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{detail.desc}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{detail.sub}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━ 第六屏：定制流程 — 视觉化步骤 ━━━ */}
      <Section>
        <SectionLabel>定制流程</SectionLabel>
        <SectionTitle>这套是怎么做出来的</SectionTitle>
        <p className="text-sm text-muted-foreground mb-5">
          这套不是现成卖的，会根据你家来调整：
        </p>
        <div className="space-y-4">
          {[
            { num: "01", text: "按你的户型，把尺寸改到合适" },
            { num: "02", text: "一起确认颜色、材质这些细节" },
            { num: "03", text: "确认没问题后，再安排生产" },
          ].map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <span className="font-mono text-3xl font-light text-primary/30 leading-none">{step.num}</span>
              <div className="pt-1.5">
                <span className="text-sm text-foreground leading-relaxed">{step.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ━━━ 第七屏：费用 ━━━ */}
      <motion.div {...fadeUp} className="mx-5 mb-6">
        <div className="bg-secondary/30 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <SectionLabel>费用预估</SectionLabel>
          <p className="text-sm text-muted-foreground mb-3">这套做下来，大致在：</p>
          <p className="font-mono text-2xl font-semibold text-foreground mb-3">
            ¥{(product.price * 0.8).toLocaleString()} - ¥{(product.price * 1.2).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">会根据你家尺寸和选择的材料有一点浮动</p>
          <p className="text-sm text-muted-foreground mt-1">在确定之前，你都能看到清单</p>

          {product.brandUnitPrice && product.unitPrice && (
            <div className="flex items-baseline justify-between text-sm mt-4 pt-4 border-t border-border/20">
              <span className="text-muted-foreground">
                传统定制 ¥{product.brandUnitPrice}/{product.unit}
              </span>
              <span className="text-foreground font-medium">
                直供 ¥{product.unitPrice}/{product.unit}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ━━━ 第八屏：拼团进度 ━━━ */}
      <Section>
        <SectionLabel>柔性智造</SectionLabel>
        <SectionTitle>一起做会更合适</SectionTitle>
        <div className="space-y-3 mb-5">
          <p className="text-sm text-foreground leading-relaxed">
            如果有几个人做类似的方案，可以一起下单生产
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            材料和加工成本会更低一些，价格一般也会更合适
          </p>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-5 relative overflow-hidden">
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
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground">
              {product.groupBuy.current}/{product.groupBuy.target}{product.unit}
            </span>
            <span className="text-muted-foreground">{product.groupBuy.estimatedTime}</span>
          </div>
          {product.groupBuy.explanation && (
            <p className="text-sm text-muted-foreground leading-relaxed pt-3 border-t border-border/20">
              {product.groupBuy.explanation}
            </p>
          )}
          {product.groupBuy.status && (
            <p className="text-sm text-primary mt-2 font-medium">状态：{product.groupBuy.status}</p>
          )}
        </div>
      </Section>

      {/* ━━━ 第九屏：工厂溯源 ━━━ */}
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

      {/* ━━━ 参与方式 & 补充信息 ━━━ */}
      <Section>
        <SectionLabel>参与方式</SectionLabel>
        <SectionTitle>你可以先参与进来看看</SectionTitle>
        <div className="space-y-2.5 mb-6">
          {["方案可以继续改", "细节可以慢慢确认", "不合适也可以不做"].map((text, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="flex items-start gap-3 bg-secondary/40 rounded-xl p-3.5"
            >
              <span className="text-accent text-sm mt-0.5">✔</span>
              <span className="text-sm text-foreground leading-relaxed">{text}</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoCard label="材质" value={product.material} />
          <InfoCard label="颜色" value={product.color} />
          <InfoCard label="风格" value={product.style} />
          <InfoCard label="产地" value={`${product.factory.location}`} />
        </div>
      </Section>

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

export default CustomProductDetail;
