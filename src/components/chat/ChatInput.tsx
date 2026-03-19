import { useState, useRef, type KeyboardEvent } from "react";
import { Send, ImagePlus } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-border bg-card/80 backdrop-blur-sm px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-end gap-2 bg-secondary/50 rounded-outer p-2">
          <button
            className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-inner"
            aria-label="上传图片"
          >
            <ImagePlus size={18} />
          </button>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="描述您的装修需求..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/50 max-h-32 py-1.5 leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="flex-shrink-0 p-2 bg-primary text-primary-foreground rounded-inner disabled:opacity-30 transition-opacity"
            aria-label="发送"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 text-center mt-2 font-mono">
          AI 建议仅供参考，实际方案以专业设计师确认为准
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
