import { motion } from "framer-motion";

interface QuickOptionsProps {
  options: string[];
  onSelect: (text: string) => void;
}

const QuickOptions = ({ options, onSelect }: QuickOptionsProps) => (
  <div className="flex-shrink-0 px-4 py-2 border-t border-border bg-card/50">
    <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto">
      {options.map((opt) => (
        <motion.button
          key={opt}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(opt)}
          className="flex-shrink-0 px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-button hover:shadow-layered transition-shadow whitespace-nowrap"
        >
          {opt}
        </motion.button>
      ))}
    </div>
  </div>
);

export default QuickOptions;
