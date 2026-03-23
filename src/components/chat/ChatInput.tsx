import { useState, useRef, useImperativeHandle, forwardRef, useCallback, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Plus, X, Image, FileText, Mic, MicOff, Home, ShoppingBag,
  Camera, Paperclip
} from "lucide-react";

export interface ChatInputProps {
  onSend: (text: string, attachments?: Attachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
  compact?: boolean;
}

export interface ChatInputHandle {
  focus: () => void;
  fillText: (text: string) => void;
}

export interface Attachment {
  id: string;
  type: "image" | "file" | "floorplan" | "product";
  name: string;
  preview?: string; // thumbnail URL or emoji
}

/* ─── Mock data for selection panels ─── */
const FLOORPLAN_OPTIONS = [
  { id: "fp1", name: "一室一厅 · 45㎡", icon: "🏠" },
  { id: "fp2", name: "两室一厅 · 75㎡", icon: "🏡" },
  { id: "fp3", name: "三室两厅 · 120㎡", icon: "🏘️" },
  { id: "fp4", name: "Loft · 60㎡", icon: "🏙️" },
];

const PRODUCT_OPTIONS = [
  { id: "pd1", name: "沙发 · 三人位", icon: "🛋️" },
  { id: "pd2", name: "茶几 · 岩板", icon: "☕" },
  { id: "pd3", name: "电视柜 · 悬浮式", icon: "📺" },
  { id: "pd4", name: "落地灯 · 北欧", icon: "💡" },
  { id: "pd5", name: "地毯 · 手工", icon: "🧶" },
];

type PanelType = null | "menu" | "floorplan" | "product";

const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  ({ onSend, disabled, placeholder, compact }, ref) => {
    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [activePanel, setActivePanel] = useState<PanelType>(null);
    const [isRecording, setIsRecording] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const autoResize = useCallback(() => {
      const el = inputRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, el.offsetWidth ? 999 : 999)}px`;
    }, []);

    // Auto-resize textarea whenever text changes
    useEffect(() => {
      autoResize();
    }, [text, autoResize]);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      fillText: (value: string) => {
        setText(value);
        setTimeout(() => {
          autoResize();
          inputRef.current?.focus();
        }, 50);
      },
    }));

    const handleSend = useCallback(() => {
      const trimmed = text.trim();
      if ((!trimmed && attachments.length === 0) || disabled) return;
      onSend(trimmed, attachments.length > 0 ? attachments : undefined);
      setText("");
      setAttachments([]);
      setActivePanel(null);
      inputRef.current?.focus();
    }, [text, attachments, disabled, onSend]);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const addAttachment = useCallback((att: Attachment) => {
      setAttachments((prev) => [...prev, att]);
      setActivePanel(null);
    }, []);

    const removeAttachment = useCallback((id: string) => {
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
      const files = e.target.files;
      if (!files) return;
      Array.from(files).forEach((file) => {
        addAttachment({
          id: crypto.randomUUID(),
          type,
          name: file.name,
          preview: type === "image" ? URL.createObjectURL(file) : undefined,
        });
      });
      e.target.value = "";
      setActivePanel(null);
    }, [addAttachment]);

    const toggleRecording = useCallback(() => {
      if (isRecording) {
        setIsRecording(false);
        // Mock: simulate voice transcription
        setTimeout(() => {
          setText((prev) => prev + (prev ? " " : "") + "我想要一个温馨的客厅");
        }, 300);
      } else {
        setIsRecording(true);
        // Auto-stop after 10s
        setTimeout(() => setIsRecording(false), 10000);
      }
    }, [isRecording]);

    const handleSelectFloorplan = useCallback((fp: typeof FLOORPLAN_OPTIONS[number]) => {
      addAttachment({ id: crypto.randomUUID(), type: "floorplan", name: fp.name, preview: fp.icon });
    }, [addAttachment]);

    const handleSelectProduct = useCallback((pd: typeof PRODUCT_OPTIONS[number]) => {
      addAttachment({ id: crypto.randomUUID(), type: "product", name: pd.name, preview: pd.icon });
    }, [addAttachment]);

    const togglePanel = useCallback((panel: PanelType) => {
      setActivePanel((prev) => (prev === panel ? null : panel));
    }, []);

    const hasContent = text.trim().length > 0 || attachments.length > 0;

    return (
      <div className="flex-shrink-0 border-t border-border bg-card/80 backdrop-blur-sm z-[60] relative">
        {/* Hidden file inputs */}
        <input ref={fileInputRef} type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.dwg,.dxf"
          onChange={(e) => handleFileSelect(e, "file")} />
        <input ref={imageInputRef} type="file" className="hidden" multiple accept="image/*"
          onChange={(e) => handleFileSelect(e, "image")} />

        {/* ── Expansion panels ── */}
        <AnimatePresence>
          {activePanel === "menu" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-border/30"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Image, label: "图片", color: "text-emerald-600", bg: "bg-emerald-50", action: () => imageInputRef.current?.click() },
                    { icon: Paperclip, label: "文件", color: "text-blue-600", bg: "bg-blue-50", action: () => fileInputRef.current?.click() },
                    { icon: Home, label: "选户型", color: "text-amber-600", bg: "bg-amber-50", action: () => setActivePanel("floorplan") },
                    { icon: ShoppingBag, label: "选商品", color: "text-purple-600", bg: "bg-purple-50", action: () => setActivePanel("product") },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-secondary/40 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === "floorplan" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-border/30"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-foreground">选择户型</span>
                  <button onClick={() => setActivePanel("menu")} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    ← 返回
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FLOORPLAN_OPTIONS.map((fp) => (
                    <button
                      key={fp.id}
                      onClick={() => handleSelectFloorplan(fp)}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-border/30 hover:border-foreground/15 hover:bg-secondary/30 transition-all text-left"
                    >
                      <span className="text-xl">{fp.icon}</span>
                      <span className="text-[11px] text-foreground font-medium">{fp.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-border/50 text-[10px] text-muted-foreground hover:border-foreground/20 hover:text-foreground/70 transition-all flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  上传户型图
                </button>
              </div>
            </motion.div>
          )}

          {activePanel === "product" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-border/30"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-foreground">选择商品</span>
                  <button onClick={() => setActivePanel("menu")} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    ← 返回
                  </button>
                </div>
                <div className="space-y-1.5">
                  {PRODUCT_OPTIONS.map((pd) => (
                    <button
                      key={pd.id}
                      onClick={() => handleSelectProduct(pd)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-secondary/30 transition-colors text-left"
                    >
                      <span className="text-lg">{pd.icon}</span>
                      <span className="text-[11px] text-foreground">{pd.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main input area ── */}
        <div className={`max-w-2xl mx-auto ${compact ? "px-3 py-2" : "px-4 py-3"}`}>
          {/* Attachment previews */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
              >
                {attachments.map((att) => (
                  <motion.div
                    key={att.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex-shrink-0 relative group"
                  >
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary/50 rounded-lg border border-border/30">
                      {att.type === "image" && att.preview ? (
                        <img src={att.preview} alt="" className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <span className="text-sm">{att.preview || (att.type === "file" ? "📎" : "📦")}</span>
                      )}
                      <span className="text-[10px] text-foreground/80 max-w-[80px] truncate">{att.name}</span>
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
                      >
                        <X className="w-2.5 h-2.5 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row */}
          <div className="flex items-end gap-1.5 bg-secondary/40 rounded-2xl p-1.5">
            {/* Plus button */}
            <button
              onClick={() => togglePanel(activePanel ? null : "menu")}
              className={`flex-shrink-0 p-2 rounded-xl transition-all ${
                activePanel
                  ? "bg-foreground/10 text-foreground rotate-45"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
              aria-label="添加附件"
            >
              <Plus className="w-[18px] h-[18px] transition-transform" />
            </button>

            {/* Text area */}
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "描述您的装修需求..."}
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/40 max-h-32 py-1.5 px-1 leading-relaxed"
            />

            {/* Voice button */}
            <button
              onClick={toggleRecording}
              className={`flex-shrink-0 p-2 rounded-xl transition-all ${
                isRecording
                  ? "bg-red-500/15 text-red-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
              aria-label={isRecording ? "停止录音" : "语音输入"}
            >
              {isRecording ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <MicOff className="w-[18px] h-[18px]" />
                </motion.div>
              ) : (
                <Mic className="w-[18px] h-[18px]" />
              )}
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={disabled || !hasContent}
              className={`flex-shrink-0 p-2 rounded-xl transition-all ${
                hasContent && !disabled
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/20 text-primary-foreground/30"
              }`}
              aria-label="发送"
            >
              <Send className="w-[16px] h-[16px]" />
            </button>
          </div>

          {!compact && (
            <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
              支持图片、户型图、语音 · AI 建议仅供参考
            </p>
          )}
        </div>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
