import { useLocation, useNavigate } from "react-router-dom";
import { Compass, PenTool, Users, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { key: "discover", label: "发现", icon: Compass, path: "/" },
  { key: "projects", label: "设计", icon: PenTool, path: "/projects" },
  { key: "groupbuy", label: "拼团", icon: Users, path: "/groupbuy" },
  { key: "profile", label: "我的", icon: User, path: "/profile" },
] as const;

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide tab bar when inside a project detail (chat flow)
  if (location.pathname.startsWith("/project/")) return null;

  const currentTab = tabs.find((t) => t.path === location.pathname)?.key ?? "discover";

  return (
    <nav className="flex-shrink-0 border-t border-border bg-card/95 backdrop-blur-md px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = tab.key === currentTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 flex-1 transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {active && (
                  <motion.div
                    layoutId="tab-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] leading-tight ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
