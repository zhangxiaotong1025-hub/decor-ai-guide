import { motion } from "framer-motion";
import type { ChatMessage } from "@/types/chat";
import ProductCards from "./ProductCards";
import BudgetCard from "./BudgetCard";

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] ${isUser ? "order-1" : "order-1"}`}>
        {/* Bubble */}
        {message.content && (
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed ${
              isUser
                ? "bg-primary text-primary-foreground rounded-outer rounded-br-button"
                : "bg-card shadow-layered rounded-outer rounded-bl-button"
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Product cards */}
        {message.type === "product" && message.products && (
          <div className="mt-2">
            <ProductCards products={message.products} />
          </div>
        )}

        {/* Budget card */}
        {message.type === "budget" && message.budget && (
          <div className="mt-2">
            <BudgetCard budget={message.budget} />
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 ${isUser ? "text-right" : "text-left"}`}>
          <span className="text-[10px] text-muted-foreground/40 font-mono">
            {new Date(message.timestamp).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
