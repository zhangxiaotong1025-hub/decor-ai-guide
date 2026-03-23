import { TrendingDown } from "lucide-react";

const ChatHeader = () => (
  <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-inner bg-foreground flex items-center justify-center">
          <TrendingDown className="w-4 h-4 text-background" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-display leading-none">Home Copilot</h1>
          <span className="text-[10px] text-saving font-medium flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-saving inline-block animate-pulse" />
            正在帮你省钱
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-saving/10 border border-saving/20">
        <span className="text-[10px] font-mono-data text-saving font-semibold">累计省 ¥18,461</span>
      </div>
    </div>
  </header>
);

export default ChatHeader;
