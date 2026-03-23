import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Clock, ChevronRight, Sparkles, Users,
  TrendingDown, Compass, ShoppingBag, Settings, Trash2,
} from "lucide-react";

interface ProjectRecord {
  id: string;
  title: string;
  style: string;
  updatedAt: string;
  isActive?: boolean;
}

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
  onOpenDiscover: () => void;
  onOpenGroupBuy: () => void;
  activeProjectId?: string;
}

const MOCK_PROJECTS: ProjectRecord[] = [
  { id: "proj-1", title: "北欧风客厅方案", style: "北欧简约 · 25㎡", updatedAt: "2小时前" },
  { id: "proj-2", title: "日式卧室改造", style: "日式原木 · 15㎡", updatedAt: "昨天" },
  { id: "proj-3", title: "工业风Loft", style: "工业复古 · 40㎡", updatedAt: "3天前" },
];

const SidebarDrawer = ({
  isOpen,
  onClose,
  onNewProject,
  onSelectProject,
  onOpenDiscover,
  onOpenGroupBuy,
  activeProjectId,
}: SidebarDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-0 left-0 bottom-0 z-[85] w-[280px] bg-card border-r border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                  <TrendingDown className="w-3.5 h-3.5 text-background" />
                </div>
                <span className="text-sm font-semibold tracking-display">Home Copilot</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* New project button */}
            <div className="px-3 py-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { onNewProject(); onClose(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">新建设计方案</span>
              </motion.button>
            </div>

            {/* Quick tools */}
            <div className="px-3 pb-2">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider px-1 mb-2">工具</p>
              <div className="space-y-0.5">
                <button
                  onClick={() => { onOpenDiscover(); onClose(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm text-left"
                >
                  <Compass className="w-4 h-4 text-primary" />
                  <span>灵感发现</span>
                </button>
                <button
                  onClick={() => { onOpenGroupBuy(); onClose(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm text-left"
                >
                  <Users className="w-4 h-4 text-saving" />
                  <span>拼团助手</span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-saving/10 text-saving font-medium">2</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-border mx-3" />

            {/* Project history */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider px-1 mb-2">设计项目</p>
              <div className="space-y-0.5">
                {MOCK_PROJECTS.map((project) => {
                  const active = project.id === activeProjectId;
                  return (
                    <motion.button
                      key={project.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { onSelectProject(project.id); onClose(); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${
                        active ? "bg-primary/8 text-primary" : "hover:bg-secondary"
                      }`}
                    >
                      <p className={`text-sm truncate ${active ? "font-semibold" : ""}`}>
                        {project.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {project.updatedAt} · {project.style}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-3 py-3 border-t border-border">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">未登录</p>
                  <p className="text-[10px] text-saving flex items-center gap-1">
                    <TrendingDown className="w-2.5 h-2.5" />
                    累计省 ¥18,461
                  </p>
                </div>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                  <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidebarDrawer;
