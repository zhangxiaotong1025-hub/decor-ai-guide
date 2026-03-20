import { motion } from "framer-motion";
import type { ProductItem } from "@/types/product";
import sceneMorning from "@/assets/scene-morning.jpg";

interface Props {
  product: ProductItem;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-20px" },
  transition: { duration: 0.4 },
};

const CustomProductDetail = ({ product }: Props) => {
  const progress = (product.groupBuy.current / product.groupBuy.target) * 100;

  return (
    <>
      {/* 第一屏：结果感 — 先看到未来 */}
      <div className="relative">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          src={product.heroImage || sceneMorning}
          alt={product.name}
          className="w-full h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-sm text-foreground/80 mb-1">{product.category}</p>
          <h1 className="text-lg font-medium text-foreground leading-snug">
            这是可以为你家定制出来的效果
          </h1>
        </div>
      </div>

      <div className="px-5 pt-5">
        <p className="text-sm text-muted-foreground mb-1">大致费用：</p>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-medium text-foreground">
            ¥{(product.price * 0.8).toLocaleString()} - ¥{(product.price * 1.2).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          会根据你家尺寸再细调
        </p>
      </div>

      <Divider />

      {/* 第二屏：为什么会舒服 */}
      <Section>
        <SectionTitle>这套为什么会舒服</SectionTitle>
        <p className="text-sm text-muted-foreground mb-4">
          这套看起来比较轻松，不压空间。主要做了两件事：
        </p>
        <div className="space-y-2.5">
          {product.lifeReasons.slice(0, 2).map((reason, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="flex items-start gap-2.5">
              <span className="text-accent text-sm mt-0.5">✔</span>
              <span className="text-sm text-foreground leading-relaxed">{reason}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          日常待着，会比较放松一点
        </p>
      </Section>

      <Divider />

      {/* 第三屏：放在你家大概什么感觉 */}
      <Section>
        <SectionTitle>放在你家，大概是什么感觉</SectionTitle>
        <p className="text-sm text-muted-foreground mb-3">如果是普通家庭客厅：</p>
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">进门不会被家具"堵住"</p>
          <p className="text-sm text-foreground leading-relaxed">中间还能有一块比较完整的活动空间</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            平时坐着、躺着都比较自然，不用刻意去找位置
          </p>
        </div>
      </Section>

      <Divider />

      {/* 第四屏：关键细节 */}
      <Section>
        <SectionTitle>关键细节是怎么考虑的</SectionTitle>

        <DetailBlock title="▪ 动线">
          <p className="text-sm text-foreground leading-relaxed">从门口到沙发，再到阳台，是顺着走的</p>
          <p className="text-sm text-muted-foreground leading-relaxed">不会被家具挡住，也不用绕</p>
        </DetailBlock>

        <DetailBlock title="▪ 收纳">
          <p className="text-sm text-foreground leading-relaxed">{product.name}带收纳</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            平时遥控器、杂物可以直接放进去，空间不容易显乱
          </p>
        </DetailBlock>

        <DetailBlock title="▪ 整体感觉">
          <p className="text-sm text-foreground leading-relaxed">
            颜色{product.color}，搭一点木色
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            不是为了"好看"，是待久了不容易累
          </p>
        </DetailBlock>
      </Section>

      <Divider />

      {/* 第五屏：怎么做出来的 */}
      <Section>
        <SectionTitle>这套是怎么做出来的</SectionTitle>
        <p className="text-sm text-muted-foreground mb-4">
          这套不是现成卖的，会根据你家来调整：
        </p>
        <div className="space-y-3">
          {[
            "按你的户型，把尺寸改到合适",
            "一起确认颜色、材质这些细节",
            "确认没问题后，再安排生产",
          ].map((step, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="flex items-start gap-3">
              <span className="text-sm text-muted-foreground font-mono w-5 flex-shrink-0">{i + 1}.</span>
              <span className="text-sm text-foreground leading-relaxed">{step}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* 第六屏：费用 */}
      <Section>
        <SectionTitle>大概会花多少钱</SectionTitle>
        <div className="bg-secondary/30 rounded-2xl p-4 mb-3">
          <p className="text-sm text-muted-foreground mb-2">这套做下来，大致在：</p>
          <p className="font-mono text-lg font-medium text-foreground">
            ¥{(product.price * 0.8).toLocaleString()} - ¥{(product.price * 1.2).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            会根据你家尺寸和选择的材料有一点浮动
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            在确定之前，你都能看到清单
          </p>
        </div>
        {product.brandUnitPrice && product.unitPrice && (
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">
              传统定制 ¥{product.brandUnitPrice}/{product.unit}
            </span>
            <span className="text-foreground font-medium">
              直供 ¥{product.unitPrice}/{product.unit}
            </span>
          </div>
        )}
      </Section>

      <Divider />

      {/* 第七屏：一起做会更合适 */}
      <Section>
        <SectionTitle>一起做会更合适</SectionTitle>
        <div className="space-y-3 mb-4">
          <p className="text-sm text-foreground leading-relaxed">
            如果有几个人做类似的方案：
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            可以一起下单生产，材料和加工成本会更低一些
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            价格一般也会更合适
          </p>
        </div>

        {/* Group buy progress */}
        <div className="bg-secondary/30 rounded-2xl p-4">
          <div className="relative h-2 bg-secondary rounded-full mb-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {product.groupBuy.current}/{product.groupBuy.target}{product.unit}
            </span>
            <span className="text-muted-foreground">{product.groupBuy.estimatedTime}</span>
          </div>
          {product.groupBuy.explanation && (
            <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/20">
              {product.groupBuy.explanation}
            </p>
          )}
          {product.groupBuy.status && (
            <p className="text-sm text-primary mt-2">状态：{product.groupBuy.status}</p>
          )}
        </div>
      </Section>

      <Divider />

      {/* 第八屏：参与方式 */}
      <Section>
        <SectionTitle>你可以先参与进来看看</SectionTitle>
        <div className="space-y-2.5">
          {[
            "方案可以继续改",
            "细节可以慢慢确认",
            "不合适也可以不做",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-accent text-sm mt-0.5">✔</span>
              <span className="text-sm text-foreground leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* 第九屏：轻量信息 */}
      <Section>
        <SectionTitle>补充信息</SectionTitle>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">可调整范围</p>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">✔ 风格可以微调</p>
              <p className="text-sm text-muted-foreground">✔ 预算可以控制</p>
              <p className="text-sm text-muted-foreground">✔ 单个家具可以替换</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">材质</p>
            <p className="text-sm text-muted-foreground">{product.material}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">产地</p>
            <p className="text-sm text-muted-foreground">
              {product.factory.location} · {product.factory.name}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

/* ─── Sub-components ─── */

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="px-5 py-1">{children}</div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base font-medium text-foreground mb-3">{children}</h2>
);

const Divider = () => (
  <div className="mx-5 my-5 h-px bg-border/20" />
);

const DetailBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5 last:mb-0">
    <p className="text-sm font-medium text-foreground mb-2">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

export default CustomProductDetail;
