import { motion } from "framer-motion";
import { 
  User, ChevronRight, Heart, ShoppingBag, FileText, 
  HelpCircle, Settings, TrendingDown, Star
} from "lucide-react";

const menuItems = [
  { icon: Heart, label: "我的收藏", badge: "12" },
  { icon: ShoppingBag, label: "我的订单", badge: "3" },
  { icon: FileText, label: "设计方案", badge: "" },
  { icon: Star, label: "评价管理", badge: "" },
  { icon: HelpCircle, label: "帮助与反馈", badge: "" },
  { icon: Settings, label: "设置", badge: "" },
];

const Profile = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Profile header */}
        <div className="px-4 pt-8 pb-6 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary border-2 border-primary/20 flex items-center justify-center">
                <User className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-base font-semibold">未登录</h2>
                <p className="text-xs text-muted-foreground mt-0.5">登录后同步你的设计方案</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mt-5">
              <div className="flex-1 p-3 rounded-xl bg-card border border-border/50 text-center">
                <p className="text-lg font-bold text-saving">¥18,461</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-center gap-0.5">
                  <TrendingDown className="w-3 h-3" /> 累计节省
                </p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-card border border-border/50 text-center">
                <p className="text-lg font-bold">2</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">设计方案</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-card border border-border/50 text-center">
                <p className="text-lg font-bold">3</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">拼团订单</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu list */}
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden divide-y divide-border/50">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  whileTap={{ backgroundColor: "hsl(var(--secondary))" }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                >
                  <Icon className="w-4.5 h-4.5 text-muted-foreground" />
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
