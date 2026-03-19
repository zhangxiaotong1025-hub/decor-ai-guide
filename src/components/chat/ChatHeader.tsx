const ChatHeader = () => (
  <header className="flex-shrink-0 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-inner bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-semibold font-mono">HC</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-display leading-none">Home Copilot</h1>
          <span className="text-[10px] text-accent font-mono flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            在线
          </span>
        </div>
      </div>
      <span className="text-label text-muted-foreground font-mono">v0.1</span>
    </div>
  </header>
);

export default ChatHeader;
