import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ChevronRight, Sparkles, Clock } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  style: string;
  area: string;
  budget: string;
  updatedAt: string;
  thumbnail: string;
  status: "drafting" | "designing" | "purchasing";
}

const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "我的北欧客厅",
    style: "北欧简约",
    area: "25㎡",
    budget: "¥23,800",
    updatedAt: "2 小时前",
    thumbnail: "/src/assets/scene-nordic-living.jpg",
    status: "designing",
  },
  {
    id: "proj-2",
    title: "日式卧室改造",
    style: "日式原木",
    area: "15㎡",
    budget: "¥12,600",
    updatedAt: "昨天",
    thumbnail: "/src/assets/scene-japanese-studio.jpg",
    status: "drafting",
  },
];

const statusMap = {
  drafting: { label: "方案中", color: "bg-muted text-muted-foreground" },
  designing: { label: "设计中", color: "bg-primary/10 text-primary" },
  purchasing: { label: "采购中", color: "bg-saving/10 text-saving" },
};

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-base font-semibold tracking-display">我的设计</h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/project/new")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            新方案
          </motion.button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {MOCK_PROJECTS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">还没有设计方案</p>
              <p className="text-xs text-muted-foreground mb-4">
                去「发现」看看别人的家，或者直接开始创建
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/project/new")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                创建我的方案
              </motion.button>
            </div>
          ) : (
            MOCK_PROJECTS.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/project/${project.id}`)}
                className="flex gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-layered active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold truncate">{project.title}</h3>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          statusMap[project.status].color
                        }`}
                      >
                        {statusMap[project.status].label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {project.style} · {project.area} · {project.budget}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.updatedAt}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
