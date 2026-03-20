import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Factory, Shield, Award, Truck, ChevronRight, Users, Zap } from "lucide-react";
import { getProductById } from "@/data/mockProducts";
import sceneMorning from "@/assets/scene-morning.jpg";
import fabricMacro from "@/assets/fabric-macro.jpg";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || "");

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">商品不存在</p>
          <button onClick={() => navigate(-1)} className="text-primary text-sm">← 返回</button>
        </div>
      </div>
    );
  }

  const savings = product.brandPrice - product.price;
  const groupSavings = product.price - product.groupBuy.targetPrice;
  const progress = (product.groupBuy.current / product.groupBuy.target) * 100;
  const isCustom = product.groupBuy.type === "custom";

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/30 z-20 relative">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-sm font-medium text-foreground">商品详情</span>
        <button className="p-1.5 -mr-1.5 hover:bg-secondary rounded-full transition-colors">
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">

        {/* ═══ 第一屏：情感暴击 ═══ */}
        <div className="relative">
          <motion.img
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={product.heroImage || sceneMorning}
            alt={product.name}
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-xs text-muted-foreground">{product.category}</span>
            <h1 className="text-xl font-medium text-foreground mt-0.5">{product.name}</h1>
          </div>
        </div>

        {/* ═══ 为什么是它 — 生活理由 ═══ */}
        <div className="px-5 pt-5 pb-6">
          <p className="text-sm text-foreground leading-relaxed">{product.why}</p>
          <div className="mt-4 space-y-2">
            {product.lifeReasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-2.5"
              >
                <span className="text-accent mt-0.5 text-xs">✓</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ 材质细节 ═══ */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs text-muted-foreground">肉眼可见的质感</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>
          <div className="rounded-2xl overflow-hidden mb-3">
            <img src={fabricMacro} alt="材质特写" className="w-full h-40 object-cover" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[product.material, product.texture, product.performance].filter(Boolean).map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-secondary rounded-full text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>

        {/* ═══ 制造溯源 ═══ */}
        <div className="px-5 pb-6">
          <div className="bg-secondary/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Factory className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">制造大揭秘</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {product.factory.location} · {product.factory.name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.factory.certifications.map((cert) => (
                <span key={cert} className="text-xs px-2.5 py-1 bg-accent/10 text-accent rounded-full">{cert}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ 价格解构 ═══ */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs text-muted-foreground">价格透明</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          <div className="bg-secondary/20 rounded-2xl p-4">
            {isCustom && product.brandUnitPrice ? (
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm text-muted-foreground line-through">
                  传统定制 ¥{product.brandUnitPrice}/{product.unit}
                </span>
                <span className="text-sm text-foreground font-medium">
                  直供 ¥{product.unitPrice}/{product.unit}
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-muted-foreground line-through">
                    品牌门店价 ¥{product.brandPrice.toLocaleString()}
                  </span>
                </div>
                {/* Breakdown bar */}
                <div className="flex h-7 rounded-lg overflow-hidden gap-px mb-3">
                  <div className="flex-[40] bg-destructive/15 flex items-center justify-center">
                    <span className="text-[10px] text-destructive">品牌溢价</span>
                  </div>
                  <div className="flex-[33] bg-destructive/10 flex items-center justify-center">
                    <span className="text-[10px] text-destructive/80">经销商</span>
                  </div>
                  <div className="flex-[27] bg-accent/15 flex items-center justify-center">
                    <span className="text-[10px] text-accent">出厂成本</span>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">我们的直供价</span>
              <span className="font-mono text-lg font-medium text-foreground">¥{product.price.toLocaleString()}</span>
            </div>
            <p className="text-xs text-accent mt-1">为你省下 ¥{savings.toLocaleString()}</p>
          </div>
        </div>

        {/* ═══ 拼团核心区 ═══ */}
        <div className="px-5 pb-6">
          <div className="border border-primary/20 rounded-2xl p-4 bg-primary/[0.03]">
            <div className="flex items-center gap-2 mb-3">
              {isCustom ? (
                <Zap className="w-4 h-4 text-primary" />
              ) : (
                <Users className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm font-medium text-foreground">
                {isCustom ? "⚙️ 柔性生产拼板（众筹造物）" : "🔥 现货阶梯拼团"}
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-secondary rounded-full mb-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
              />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                {product.groupBuy.current}/{product.groupBuy.target}
                {isCustom ? "㎡" : "人"}
              </span>
              <span className="text-xs text-muted-foreground">
                {product.groupBuy.estimatedTime}
              </span>
            </div>

            {/* Current tier */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between py-2 px-3 bg-background/60 rounded-xl">
                <span className="text-sm text-foreground">当前已解锁</span>
                <div className="text-right">
                  <span className="font-mono text-sm font-medium text-foreground">
                    ¥{product.groupBuy.currentPrice.toLocaleString()}
                    {isCustom ? `/${product.unit}` : ""}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-primary/5 rounded-xl border border-primary/10">
                <span className="text-sm text-primary">满{product.groupBuy.target}{isCustom ? "㎡" : "人"}底价</span>
                <div className="text-right">
                  <span className="font-mono text-sm font-medium text-primary">
                    ¥{product.groupBuy.targetPrice.toLocaleString()}
                    {isCustom ? `/${product.unit}` : ""}
                  </span>
                  <span className="text-xs text-accent ml-1.5">
                    再省¥{isCustom ? (product.groupBuy.currentPrice - product.groupBuy.targetPrice) * product.groupBuy.target : groupSavings}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom explanation */}
            {isCustom && product.groupBuy.explanation && (
              <div className="bg-background/60 rounded-xl p-3 mb-3">
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">💡 为什么定制也能拼？</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{product.groupBuy.explanation}</p>
                {product.groupBuy.status && (
                  <p className="text-xs text-primary mt-2">状态：{product.groupBuy.status}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══ 信任保障 ═══ */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs text-muted-foreground">安心保障</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          <div className="space-y-2">
            {[
              { icon: Factory, text: "100% 头部品牌同源大厂发货" },
              { icon: Shield, text: "材质弄虚作假，平台全额免单" },
              { icon: Truck, text: "送装一体，拆包摆放，带走垃圾" },
              { icon: Award, text: "365 天只换不修，三年质保" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3.5 bg-secondary/20 rounded-xl">
                <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer for bottom bar */}
        <div className="h-24" />
      </div>

      {/* ═══ 底部 CTA ═══ */}
      <div className="flex-shrink-0 bg-background/90 backdrop-blur-md border-t border-border/30 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-[0.4] py-3 border border-border text-foreground text-sm rounded-xl"
          >
            💬 微调尺寸/材质
          </button>
          <button className="flex-1 py-3 bg-foreground text-background text-sm font-medium rounded-xl">
            ⚡ 加入拼团 · ¥{product.groupBuy.currentPrice.toLocaleString()}
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {isCustom
            ? `还差 ${product.groupBuy.target - product.groupBuy.current}${product.unit} 即可开机排产`
            : `已有 ${product.groupBuy.current} 人参团 · 满 ${product.groupBuy.target} 人再省 ¥${groupSavings.toLocaleString()}`
          }
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
