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

const StandardProductDetail = ({ product }: Props) => {
  const progress = (product.groupBuy.current / product.groupBuy.target) * 100;
  const groupSavings = product.groupBuy.currentPrice - product.groupBuy.targetPrice;

  return (
    <>
      {/* 第一屏：先看到结果 */}
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
            这款{product.name}，放在普通客厅里会比较轻松
          </h1>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-sm text-muted-foreground">现在一起买，大概</span>
          <span className="font-mono text-lg font-medium text-foreground">
            ¥{product.groupBuy.currentPrice.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          平时单买在 ¥{product.price.toLocaleString()} 左右
        </p>
      </div>

      <Divider />

      {/* 第二屏：适合什么情况 */}
      <Section>
        <SectionTitle>这款大概适合什么情况</SectionTitle>
        <p className="text-sm text-muted-foreground mb-4">
          如果你家是这种情况，会比较合适：
        </p>
        <div className="space-y-2.5">
          {product.lifeReasons.slice(0, 3).map((reason, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="flex items-start gap-2.5">
              <span className="text-accent text-sm mt-0.5">✔</span>
              <span className="text-sm text-foreground leading-relaxed">{reason}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          👉 属于那种不挑空间、用着也舒服的类型
        </p>
      </Section>

      <Divider />

      {/* 第三屏：用起来是什么感觉 */}
      <Section>
        <SectionTitle>用起来是什么感觉</SectionTitle>
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">
            {product.texture ? `质感${product.texture}` : "坐下去是偏软一点的"}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            不是那种很塌的感觉，是可以久坐不累的
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            平时坐着看看手机、休息一下会比较放松
          </p>
        </div>
      </Section>

      <Divider />

      {/* 第四屏：为什么会选这一款 */}
      <Section>
        <SectionTitle>为什么会选这一款</SectionTitle>
        <p className="text-sm text-muted-foreground mb-4">
          这款不是"好看就选"，主要是它放在这种客厅里更合适：
        </p>
        <div className="space-y-2.5">
          {[
            `${product.style}，不会压空间`,
            `${product.color}比较中性，不容易和其他家具冲突`,
            "尺寸刚好，不会影响走动",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-accent text-sm mt-0.5">✔</span>
              <span className="text-sm text-foreground leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          👉 放进去整体会比较稳，不容易出错
        </p>
      </Section>

      <Divider />

      {/* 第五屏：放在家里的感觉 */}
      <Section>
        <SectionTitle>放在家里的感觉</SectionTitle>
        <p className="text-sm text-muted-foreground mb-3">如果放在你家这种客厅：</p>
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">进门不会觉得拥挤</p>
          <p className="text-sm text-foreground leading-relaxed">中间还能留出一块活动空间</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            平时坐着、躺着都比较自然，不用刻意去调整位置
          </p>
        </div>
      </Section>

      <Divider />

      {/* 第六屏：一起买是怎么回事 */}
      <Section>
        <SectionTitle>这次一起买是怎么回事</SectionTitle>
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">
            这次不是直接让你下单
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            是先把想买的人凑在一起，人数差不多了，再去帮大家谈价格
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            如果最后价格不合适，也可以不买
          </p>
        </div>
      </Section>

      <Divider />

      {/* 第七屏：为什么便宜 */}
      <Section>
        <SectionTitle>为什么会便宜一点</SectionTitle>
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">一个人买，是零售价</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            几个人一起买，相当于一次性下单，成本会低一些
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            👉 所以价格会比平时好一点
          </p>
        </div>
      </Section>

      <Divider />

      {/* 第八屏：现在的进度 */}
      <Section>
        <SectionTitle>现在的进度</SectionTitle>
        <div className="bg-secondary/30 rounded-2xl p-4">
          <p className="text-sm text-foreground mb-3">
            现在已经有 {product.groupBuy.current} 个人在看这款
          </p>
          {/* Progress bar */}
          <div className="relative h-2 bg-secondary rounded-full mb-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground">
              {product.groupBuy.current}/{product.groupBuy.target} 人
            </span>
            <span className="text-muted-foreground">{product.groupBuy.estimatedTime}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            如果到 {product.groupBuy.target} 人，价格大概还能再降 ¥{groupSavings.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            你可以先留一下，不用马上决定
          </p>
        </div>
      </Section>

      <Divider />

      {/* 第九屏：补充信息 */}
      <Section>
        <SectionTitle>补充信息</SectionTitle>
        <div className="space-y-4">
          <InfoBlock label="材质" items={[
            `面料：${product.material}`,
            `填充：${product.performance}`,
          ]} />
          <InfoBlock label="产地" items={[
            `${product.factory.location} · ${product.factory.name}`,
            ...product.factory.certifications,
          ]} />
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

const InfoBlock = ({ label, items }: { label: string; items: string[] }) => (
  <div>
    <p className="text-sm font-medium text-foreground mb-1.5">{label}</p>
    <div className="space-y-1">
      {items.map((item, i) => (
        <p key={i} className="text-sm text-muted-foreground">{item}</p>
      ))}
    </div>
  </div>
);

export default StandardProductDetail;
