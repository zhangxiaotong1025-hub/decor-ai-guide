import { motion } from "framer-motion";
import { Menu, Plus, Compass, Users } from "lucide-react";

interface ChatTopBarProps {
  onMenuOpen: () => void;
  onNewProject: () => void;
  onOpenDiscover: () => void;
  projectTitle?: string;
}

const ChatTopBar = ({ onMenuOpen, onNewProject, onOpenDiscover, projectTitle }: ChatTopBarProps) => (
  <header className="flex-shrink-0 px-3 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm">
    <div className="max-w-2xl mx-auto flex items-center gap-2">
      {/* Menu trigger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenuOpen}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
      >
        <Menu className="w-[18px] h-[18px]" />
      </motion.button>

      {/* Center: project title */}
      <div className="flex-1 min-w-0 text-center">
        <h1 className="text-sm font-semibold truncate">
          {projectTitle ?? "Home Copilot"}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onOpenDiscover}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          title="灵感发现"
        >
          <Compass className="w-[18px] h-[18px] text-muted-foreground" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onNewProject}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          title="新方案"
        >
          <Plus className="w-[18px] h-[18px]" />
        </motion.button>
      </div>
    </div>
  </header>
);

export default ChatTopBar;
