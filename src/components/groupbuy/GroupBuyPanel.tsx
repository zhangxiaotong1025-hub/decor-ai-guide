import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, Users, Clock, CheckCircle2, Truck,
  ShieldCheck, Sparkles, Package, CreditCard, ArrowRight,
  TrendingDown, Layers, AlertCircle,
} from "lucide-react";
import type { UserGroupBuy, GroupBuyEvent, CustomGroupBuyInfo } from "@/types/groupBuy";
import { mockUserGroupBuys, mockFormedGroupBuy, mockCustomGroupBuyInfo } from "@/data/mockGroupBuy";

interface GroupBuyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = "list" | "detail" | "confirm" | "order-success";

const GroupBuyPanel = ({ isOpen, onClose }: GroupBuyPanelProps) => {
  const [view, setView] = useState<ViewState>("list");
  const [selectedBuy, setSelectedBuy] = useState<UserGroupBuy | null>(null);
  const [demoFormed, setDemoFormed] = useState(false);

  if (!isOpen) return null;

  const handleBack = () => {
    if (view === "order-success") { setView("list"); return; }
    if (view === "confirm") { setView("detail"); return; }
    if (view === "detail") { setView("list"); setSelectedBuy(null); return; }
  };

  const handleSelect = (buy: UserGroupBuy) => {
    setSelectedBuy(buy);
    setView("detail");
  };

  const handleSimulateFormed = () => {
    setSelectedBuy(mockFormedGroupBuy);
    setDemoFormed(true);
    setView("detail");
  };

  const handleConfirmOrder = () => setView("confirm");
  const handlePay = () => setView("order-success");

  const viewTitle =
    view === "detail" ? "拼单详情" :
    view === "confirm" ? "确认订单" :
    view === "order-success" ? "下单成功" : undefined;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 top-0 bottom-0 z-[70] bg-background flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between px-4 h-12">
            {view !== "list" ? (
              <button onClick={handleBack} className="flex items-center gap-1 text-sm text-primary">
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>返回</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">我的拼单</span>
              </div>
            )}
            {viewTitle && <span className="text-sm font-medium text-foreground">{viewTitle}</span>}
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait">
            {view === "list" && (
              <ListView
                key="list"
                buys={mockUserGroupBuys}
                onSelect={handleSelect}
                onSimulateFormed={handleSimulateFormed}
              />
            )}
            {view === "detail" && selectedBuy && (
              <DetailView
                key="detail"
                buy={selectedBuy}
                onConfirmOrder={handleConfirmOrder}
              />
            )}
            {view === "confirm" && selectedBuy && (
              <ConfirmView key="confirm" buy={selectedBuy} onPay={handlePay} />
            )}
            {view === "order-success" && (
              <OrderSuccessView key="success" onBackToList={() => setView("list")} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── List View ─── */
const ListView = ({
  buys, onSelect, onSimulateFormed,
}: {
  buys: UserGroupBuy[];
  onSelect: (b: UserGroupBuy) => void;
  onSimulateFormed: () => void;
}) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 pt-4 pb-16">
    {/* Active group buys */}
    <div className="flex items-center gap-2 mb-3">
      <Package className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">进行中的拼单</span>
      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">{buys.length}</span>
    </div>

    <div className="space-y-3 mb-6">
      {buys.map((buy) => {
        const pool = buy.pool;
        const progress = Math.round((pool.currentCount / pool.targetCount) * 100);
        const isCustom = pool.type === "custom";

        return (
          <button
            key={buy.poolId}
            onClick={() => onSelect(buy)}
            className="w-full text-left rounded-xl border border-border p-4 hover:bg-secondary/20 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/60 flex items-center justify-center text-xl flex-shrink-0">
                {isCustom ? "📐" : "🛋️"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{pool.product.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isCustom ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                  }`}>
                    {isCustom ? "定制拼单" : "优惠拼单"}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm font-bold text-foreground">
                    ¥{pool.priceRange[0].toLocaleString()} - {pool.priceRange[1].toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground line-through font-mono">
                    ¥{pool.soloPrice.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`h-full rounded-full ${progress >= 80 ? "bg-accent" : "bg-primary/50"}`}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {pool.currentCount}/{pool.targetCount}人
                  </span>
                </div>

                <p className="text-[10px] text-muted-foreground mt-1.5">{pool.estimatedTime}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors mt-1" />
            </div>
          </button>
        );
      })}
    </div>

    {/* Demo: simulate formed */}
    <button
      onClick={onSimulateFormed}
      className="w-full flex items-center justify-between rounded-xl border border-accent/20 bg-accent/[0.04] p-4 hover:bg-accent/[0.08] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">模拟成团</p>
          <p className="text-[11px] text-muted-foreground">体验成团 → 确认 → 下单流程</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-accent" />
    </button>
  </motion.div>
);

/* ─── Detail View ─── */
const DetailView = ({ buy, onConfirmOrder }: { buy: UserGroupBuy; onConfirmOrder: () => void }) => {
  const pool = buy.pool;
  const progress = Math.round((pool.currentCount / pool.targetCount) * 100);
  const isFormed = pool.status === "formed";
  const isCustom = pool.type === "custom";

  const stateLabel: Record<string, { text: string; color: string }> = {
    reserved: { text: "已占位", color: "bg-primary/10 text-primary" },
    pending_pay: { text: "待确认付款", color: "bg-accent/10 text-accent" },
    paid: { text: "已付款", color: "bg-accent/10 text-accent" },
  };
  const label = stateLabel[buy.userState] ?? { text: buy.userState, color: "bg-secondary text-foreground" };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-4 pt-4 pb-16">
      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${label.color}`}>{label.text}</span>
        {isFormed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" /> 已成团
          </motion.span>
        )}
      </div>

      {/* Product card */}
      <div className="rounded-xl border border-border p-4 mb-4">
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-lg bg-secondary/60 flex items-center justify-center text-2xl flex-shrink-0">
            {isCustom ? "📐" : "🛋️"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">{pool.product.name}</p>
            <p className="text-[12px] text-muted-foreground line-clamp-2">{pool.product.brief}</p>
          </div>
        </div>
      </div>

      {/* Price section */}
      <div className="rounded-xl bg-secondary/30 border border-border p-4 mb-4">
        {isFormed && pool.finalPrice ? (
          <>
            <p className="text-xs text-muted-foreground mb-1">成团锁定价</p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-accent">¥{pool.finalPrice.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground line-through font-mono">¥{pool.soloPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingDown className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-accent font-medium">
                比单独买省 ¥{(pool.soloPrice - pool.finalPrice).toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-1">当前预计价</p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-foreground">
                ¥{pool.priceRange[0].toLocaleString()} - {pool.priceRange[1].toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground line-through font-mono">¥{pool.soloPrice.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">成团后锁定最终价格</p>
          </>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">拼单进度</span>
          </div>
          <span className="font-mono text-sm font-bold text-foreground">{pool.currentCount} / {pool.targetCount} 人</span>
        </div>

        <div className="h-2.5 bg-secondary rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${isFormed ? "bg-accent" : progress >= 80 ? "bg-accent/70" : "bg-primary/50"}`}
          />
        </div>

        {!isFormed && (
          <p className="text-[11px] text-muted-foreground">
            还差 <span className="text-foreground font-medium">{pool.targetCount - pool.currentCount}</span> 人 · {pool.estimatedTime}
          </p>
        )}
      </div>

      {/* Custom: design steps */}
      {isCustom && (
        <div className="rounded-xl border border-border p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">定制流程</span>
          </div>
          {mockCustomGroupBuyInfo.steps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                step.status === "done" ? "bg-accent/10 text-accent" :
                step.status === "current" ? "bg-primary/10 text-primary" :
                "bg-secondary text-muted-foreground"
              }`}>
                {step.status === "done" ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div>
                <p className={`text-xs font-medium ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}

          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>已有 {mockCustomGroupBuyInfo.householdCount} 户同材质拼单，累计 {mockCustomGroupBuyInfo.totalArea}㎡</span>
            </div>
            <p className="text-[11px] text-accent font-medium mt-1">
              合并生产预计可省 ¥{mockCustomGroupBuyInfo.materialSaving}/户
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">动态</span>
        </div>
        <div className="space-y-2.5">
          {[...pool.timeline].reverse().slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                event.type === "formed" || event.type === "price_locked" ? "bg-accent" : "bg-primary/40"
              }`} />
              <div className="flex-1">
                <p className={`text-[12px] leading-relaxed ${
                  event.type === "formed" ? "text-accent font-medium" : "text-foreground"
                }`}>{event.message}</p>
                <p className="text-[10px] text-muted-foreground">{event.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {isFormed && buy.userState === "pending_pay" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
          <button
            onClick={onConfirmOrder}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            确认下单 · ¥{pool.finalPrice?.toLocaleString()}
          </button>
          <button className="w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary/30 transition-colors">
            放弃（不扣任何费用）
          </button>
          <p className="text-[10px] text-muted-foreground text-center">
            成团价已锁定，你可以选择确认或放弃，完全自由
          </p>
        </motion.div>
      )}

      {!isFormed && buy.userState === "reserved" && (
        <div className="rounded-xl bg-primary/[0.04] border border-primary/10 p-4">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] text-foreground font-medium mb-1">价格已帮你留住</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                成团后会第一时间通知你确认，在此之前不需要付款，随时可以退出。
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ─── Confirm View ─── */
const ConfirmView = ({ buy, onPay }: { buy: UserGroupBuy; onPay: () => void }) => {
  const pool = buy.pool;
  const price = pool.finalPrice ?? pool.priceRange[0];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-4 pt-4 pb-16">
      {/* Order summary */}
      <div className="rounded-xl border border-border p-4 mb-4">
        <div className="flex gap-3 mb-3">
          <div className="w-14 h-14 rounded-lg bg-secondary/60 flex items-center justify-center text-xl flex-shrink-0">🛋️</div>
          <div>
            <p className="text-sm font-medium text-foreground">{pool.product.name}</p>
            <p className="text-[12px] text-muted-foreground">{pool.product.brief}</p>
          </div>
        </div>
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">成团价</span>
            <span className="font-mono font-bold text-foreground">¥{price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">配送费</span>
            <span className="text-accent font-medium">免运费</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="font-medium text-foreground">合计</span>
            <span className="font-mono text-lg font-bold text-primary">¥{price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="rounded-xl border border-border p-4 mb-4 space-y-3">
        <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-primary" /> 配送信息
        </h4>
        <div className="space-y-2 text-[12px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">收货地址</span>
            <span className="text-foreground">请填写收货地址</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">预计发货</span>
            <span className="text-foreground">付款后 7 个工作日内</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">配送方式</span>
            <span className="text-foreground">送货上门 + 安装</span>
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="rounded-xl bg-secondary/30 border border-border p-4 mb-6">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: <ShieldCheck className="w-4 h-4" />, text: "7天无理由" },
            { icon: <Package className="w-4 h-4" />, text: "正品保障" },
            { icon: <Truck className="w-4 h-4" />, text: "免费安装" },
          ].map((g) => (
            <div key={g.text} className="flex flex-col items-center gap-1">
              <div className="text-primary">{g.icon}</div>
              <span className="text-[10px] text-muted-foreground">{g.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={onPay}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2"
      >
        <CreditCard className="w-4 h-4" />
        确认支付 ¥{price.toLocaleString()}
      </button>
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        支付即表示同意《购买协议》，支持 7 天无理由退款
      </p>
    </motion.div>
  );
};

/* ─── Order Success ─── */
const OrderSuccessView = ({ onBackToList }: { onBackToList: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="px-4 pt-12 pb-16 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
    >
      <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
    </motion.div>
    <h3 className="text-lg font-semibold text-foreground mb-2">下单成功！</h3>
    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
      你的订单已提交，我们正在安排生产和发货。<br />
      你可以在「我的拼单」里随时查看进度。
    </p>

    {/* Order tracking preview */}
    <div className="rounded-xl border border-border p-4 mb-6 text-left">
      <p className="text-xs font-semibold text-foreground mb-3">订单状态</p>
      {[
        { label: "已下单", done: true },
        { label: "生产中", done: false, current: true },
        { label: "发货中", done: false },
        { label: "已送达", done: false },
      ].map((step, i) => (
        <div key={step.label} className="flex items-center gap-3 mb-2 last:mb-0">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            step.done ? "bg-accent/10 text-accent" :
            step.current ? "bg-primary/10 text-primary" :
            "bg-secondary text-muted-foreground"
          }`}>
            {step.done ? <CheckCircle2 className="w-3 h-3" /> :
             <span className="text-[9px] font-bold">{i + 1}</span>}
          </div>
          <span className={`text-xs ${step.done ? "text-accent" : step.current ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {step.label}
          </span>
          {step.current && (
            <span className="text-[10px] text-primary ml-auto">预计 7 天内发货</span>
          )}
        </div>
      ))}
    </div>

    <button
      onClick={onBackToList}
      className="w-full py-3 rounded-xl border border-border text-sm text-foreground hover:bg-secondary/30 transition-colors"
    >
      返回我的拼单
    </button>
  </motion.div>
);

export default GroupBuyPanel;
