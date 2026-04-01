import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid3X3, Maximize, Minimize, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TOTAL_SLIDES = 10;

/* ─── Slide Components ─── */

const SlideCover = () => (
  <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,15%)] via-[hsl(217,91%,10%)] to-[hsl(222,47%,5%)]" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />
    <div className="relative z-10 space-y-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-white font-bold text-2xl font-serif italic">灵</span>
        </div>
        <span className="text-white/60 text-lg tracking-widest">LINGDONG DESIGN</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-display">
        AI空间导购<br />
        <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">
          解决方案
        </span>
      </h1>
      <p className="text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
        一起探索「设计能力如何转化为成交能力」
      </p>
      <div className="flex items-center justify-center gap-6 text-white/30 text-sm pt-8">
        <span>共创版 v1.0</span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span>{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}</span>
      </div>
    </div>
  </div>
);

const SlideTOC = () => {
  const items = [
    { num: "01", title: "产品概述", desc: "核心功能与价值主张" },
    { num: "02", title: "市场分析", desc: "行业痛点与市场机遇" },
    { num: "03", title: "交易模型", desc: "五层交易加速系统" },
    { num: "04", title: "行业适配", desc: "为什么家居行业最成立" },
    { num: "05", title: "产品形态", desc: "当前能力与体验展示" },
    { num: "06", title: "合作方式", desc: "共创模式与合作原则" },
    { num: "07", title: "下一步", desc: "验证计划与推进路径" },
    { num: "08", title: "联系我们", desc: "开启合作对话" },
  ];
  return (
    <div className="h-full flex flex-col justify-center px-16 md:px-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/30" />
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-foreground mb-2">目录</h2>
        <p className="text-muted-foreground mb-10">CONTENTS</p>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {items.map((item) => (
            <div key={item.num} className="flex items-start gap-4 group">
              <span className="font-mono text-primary/60 text-sm font-bold mt-1">{item.num}</span>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SlideOverview = () => (
  <div className="h-full flex flex-col justify-center px-16 md:px-24 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
    <div className="relative z-10 space-y-10">
      <div>
        <p className="text-label text-primary mb-3">PRODUCT OVERVIEW</p>
        <h2 className="text-4xl font-bold text-foreground leading-snug">
          基于AI的<span className="text-primary">「空间化卖货引擎」</span>
        </h2>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
          用空间方案替代传统货架，提升商品转化率
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[
          { icon: "🏠", title: "空间即货架", desc: "用整屋方案替代单品展示，提高信任与客单价", color: "from-primary/20 to-primary/5" },
          { icon: "🤖", title: "AI即导购", desc: "自动生成搭配逻辑，把卖点变成买点", color: "from-accent/20 to-accent/5" },
          { icon: "💎", title: "交易即方案", desc: "支持整套购买、拼团、单品拆分一站式成交", color: "from-gold/20 to-gold/5" },
        ].map((item) => (
          <div key={item.title} className={`rounded-2xl bg-gradient-to-br ${item.color} p-6 border border-border/50`}>
            <span className="text-3xl">{item.icon}</span>
            <h3 className="font-bold text-foreground mt-4 mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-secondary/40 rounded-xl p-5 border-l-4 border-primary">
        <p className="text-foreground font-medium">
          本质不是做电商平台，而是<span className="text-primary font-bold">让商家更容易把货卖出去</span>
        </p>
      </div>
    </div>
  </div>
);

const SlideMarket = () => (
  <div className="h-full flex flex-col justify-center px-16 md:px-24 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/20" />
    <div className="relative z-10 space-y-8">
      <div>
        <p className="text-label text-primary mb-3">MARKET ANALYSIS</p>
        <h2 className="text-3xl font-bold text-foreground">家居消费中的<span className="text-shock">共性挑战</span></h2>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-shock/10 flex items-center justify-center text-shock text-sm">❌</span>
            行业痛点
          </h3>
          {[
            { label: "流量见顶", desc: "获客成本持续上升，ROI持续下降" },
            { label: "决策困难", desc: "商品丰富但用户无法判断是否适合" },
            { label: "服务瓶颈", desc: "依赖导购/设计师，难以规模化" },
            { label: "转化低迷", desc: "客单价高、决策周期长、流失率高" },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-shock mt-2 shrink-0" />
              <div>
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-sm text-muted-foreground ml-2">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-saving/10 flex items-center justify-center text-saving text-sm">✅</span>
            市场机遇
          </h3>
          {[
            { label: "万亿市场", desc: "家居家装市场规模超5万亿，线上渗透率持续提升" },
            { label: "AI成熟", desc: "生成式AI让内容生产与个性化服务成本大幅降低" },
            { label: "用户需求", desc: "消费者期待「所见即所得」的确定性购物体验" },
            { label: "拼团验证", desc: "拼多多已验证群体决策模型，家居场景天然适配" },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-saving mt-2 shrink-0" />
              <div>
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-sm text-muted-foreground ml-2">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center pt-4">
        <p className="text-muted-foreground italic">
          用户"看得多"，但"买得更难" —— 核心阻力是<span className="text-foreground font-semibold">决策不确定性</span>与<span className="text-foreground font-semibold">行动不确定性</span>
        </p>
      </div>
    </div>
  </div>
);

const SlideTransaction = () => {
  const steps = [
    { phase: "共鸣", module: "灵感空间", from: "没想买", to: "我也想要", emoji: "💫", color: "bg-purple-500" },
    { phase: "确定", module: "空间方案", from: "好看", to: "适合我", emoji: "🏡", color: "bg-primary" },
    { phase: "信任", module: "专业解释", from: "我不懂", to: "可以相信", emoji: "🛡️", color: "bg-blue-500" },
    { phase: "掌控", module: "预算分析", from: "怕花错钱", to: "我能决定", emoji: "💰", color: "bg-gold" },
    { phase: "行动", module: "拼团机制", from: "再看看", to: "现在购买", emoji: "🚀", color: "bg-saving" },
  ];
  return (
    <div className="h-full flex flex-col justify-center px-12 md:px-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(217,91%,8%)] to-[hsl(222,47%,5%)]" />
      <div className="relative z-10 space-y-8">
        <div className="text-center">
          <p className="text-label text-primary mb-3">TRANSACTION MODEL</p>
          <h2 className="text-3xl font-bold text-white">五层交易加速系统</h2>
          <p className="text-white/40 mt-2">从"产生兴趣"到"完成成交"，减少每一个流失节点</p>
        </div>
        {/* Traditional path */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-xs text-white/30 mb-2">❌ 传统路径</p>
          <div className="flex items-center justify-between text-sm">
            {["兴趣","浏览","理解","对比","犹豫","流失"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`${i === 5 ? "text-shock" : "text-white/40"}`}>{s}</span>
                {i < 5 && <span className="text-white/20">→</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Our model */}
        <div className="grid grid-cols-5 gap-3">
          {steps.map((step, i) => (
            <div key={step.phase} className="relative">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center h-full flex flex-col items-center">
                <span className="text-2xl mb-2">{step.emoji}</span>
                <div className={`${step.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>
                  {step.phase}
                </div>
                <p className="text-white/50 text-xs mb-1">{step.module}</p>
                <div className="mt-auto pt-3 border-t border-white/10 w-full">
                  <p className="text-white/30 text-xs line-through">{step.from}</p>
                  <p className="text-white font-semibold text-sm mt-1">{step.to}</p>
                </div>
              </div>
              {i < 4 && (
                <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-white/20 z-10 text-lg">→</div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl p-4 border border-primary/20">
          <p className="text-white font-bold">
            🎯 不是优化某一个环节，而是在减少每一个<span className="text-primary">"放弃购买"</span>的瞬间
          </p>
        </div>
      </div>
    </div>
  );
};

const SlideIndustry = () => (
  <div className="h-full flex flex-col justify-center px-16 md:px-24 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-background to-accent/5" />
    <div className="relative z-10 space-y-8">
      <div>
        <p className="text-label text-primary mb-3">INDUSTRY FIT</p>
        <h2 className="text-3xl font-bold text-foreground">为什么这个模式在<span className="text-accent">家居行业</span>更成立</h2>
      </div>
      <div className="space-y-4">
        {[
          { left: "用户买的是\u201C结果\u201D而非单品，但交易仍以SKU为中心", right: "空间方案更贴近用户真实决策方式", tag: "结果消费" },
          { left: "用户难以独立完成搭配决策，依赖人力成本高", right: "AI承接设计与导购能力，可规模化", tag: "专业门槛" },
          { left: "客单价高、决策周期长、犹豫即流失", right: "提前完成关键判断，缩短决策路径", tag: "决策周期" },
          { left: "单一用户决策压力大，缺乏信心来源", right: "拼团连接相似需求用户，群体增信", tag: "社交决策" },
        ].map((item) => (
          <div key={item.tag} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
              <p className="text-sm text-muted-foreground">{item.left}</p>
            </div>
            <div className="shrink-0">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                {item.tag}
              </span>
            </div>
            <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
              <p className="text-sm text-foreground font-medium">{item.right}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pt-4">
        <p className="text-lg font-semibold text-foreground">
          从"卖商品" → "卖空间结果" → <span className="text-accent">"卖决策信心"</span>
        </p>
      </div>
    </div>
  </div>
);

const SlideProduct = () => (
  <div className="h-full flex flex-col justify-center px-16 md:px-24 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-background to-primary/5" />
    <div className="relative z-10 space-y-8">
      <div>
        <p className="text-label text-primary mb-3">PRODUCT FORM</p>
        <h2 className="text-3xl font-bold text-foreground">产品形态与核心能力</h2>
        <p className="text-muted-foreground mt-2">已具备基础闭环能力，可用于真实场景验证</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { icon: "✨", title: "灵感空间", desc: "真实案例展示，增强用户代入感与共鸣，激发消费兴趣" },
            { icon: "🎨", title: "AI空间方案", desc: "根据户型、风格、预算智能生成专属空间设计方案" },
            { icon: "🧠", title: "设计顾问Agent", desc: "专业解释搭配逻辑，布局动线、照明规划、材质选择" },
            { icon: "💰", title: "预算顾问Agent", desc: "智能预算拆解与分析，明确每一分钱的去向" },
            { icon: "🤝", title: "拼团与方案购买", desc: "群体决策增强信任，动态折扣触发即时购买" },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 items-start bg-card/50 rounded-xl p-4 border border-border/50">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full aspect-[9/16] max-h-[420px] bg-gradient-to-br from-secondary/40 to-primary/10 rounded-2xl border border-border/50 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-xl" />
            <div className="text-center space-y-3 relative z-10">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-xl font-serif italic">灵</span>
              </div>
              <p className="text-sm text-muted-foreground">产品演示</p>
              <a
                href="https://decor-ai-guide.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                体验POC Demo →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SlideCooperation = () => (
  <div className="h-full flex flex-col justify-center px-16 md:px-24 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-background to-accent/5" />
    <div className="relative z-10 space-y-10">
      <div>
        <p className="text-label text-primary mb-3">COOPERATION</p>
        <h2 className="text-3xl font-bold text-foreground">以<span className="text-accent">「共创」</span>方式推进</h2>
        <p className="text-muted-foreground mt-2">不是单向交付，而是一起找到"对你有效的方式"</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg">🤝</div>
          <h3 className="font-bold text-foreground">合作原则</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-saving">✓</span> 不改变现有价格体系</li>
            <li className="flex gap-2"><span className="text-saving">✓</span> 不影响现有渠道结构</li>
            <li className="flex gap-2"><span className="text-saving">✓</span> 不额外占用品牌流量</li>
          </ul>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-lg">📊</div>
          <h3 className="font-bold text-foreground">验证指标</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary">→</span> 商品转化率提升</li>
            <li className="flex gap-2"><span className="text-primary">→</span> 客单价变化</li>
            <li className="flex gap-2"><span className="text-primary">→</span> 用户决策时间缩短</li>
          </ul>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-lg">💡</div>
          <h3 className="font-bold text-foreground">收益模式</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-gold">•</span> 按效果分成，零前期投入</li>
            <li className="flex gap-2"><span className="text-gold">•</span> 灵活合作期限</li>
            <li className="flex gap-2"><span className="text-gold">•</span> 无效果则共同复盘</li>
          </ul>
        </div>
      </div>
      <div className="bg-secondary/30 rounded-xl p-5 text-center">
        <p className="text-foreground font-medium">
          只验证一件事：<span className="text-primary font-bold">是否能提升转化效率与客单价</span>
        </p>
      </div>
    </div>
  </div>
);

const SlideNextSteps = () => (
  <div className="h-full flex flex-col justify-center px-16 md:px-24 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-background to-primary/5" />
    <div className="relative z-10 space-y-10">
      <div>
        <p className="text-label text-primary mb-3">NEXT STEPS</p>
        <h2 className="text-3xl font-bold text-foreground">三步验证路径</h2>
        <p className="text-muted-foreground mt-2">用最小成本，验证一个值得长期投入的方向</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            step: "STEP 1",
            title: "共创验证",
            time: "1-2个月",
            items: ["选择1-2个核心品类/场景", "快速接入POC能力", "在真实链路中验证转化"],
            color: "from-primary to-blue-400",
          },
          {
            step: "STEP 2",
            title: "能力沉淀",
            time: "1个季度",
            items: ["标准化商品接入流程", "标准化方案生成模板", "标准化Agent话术库"],
            color: "from-accent to-emerald-400",
          },
          {
            step: "STEP 3",
            title: "平台演进",
            time: "长期",
            items: ["多品牌接入与统一货盘", "C端入口探索", "平台化与数据沉淀"],
            color: "from-gold to-amber-400",
          },
        ].map((item, i) => (
          <div key={item.step} className="relative">
            <div className="bg-card rounded-2xl p-6 border border-border/50 h-full flex flex-col">
              <div className={`bg-gradient-to-r ${item.color} text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4`}>
                {item.step}
              </div>
              <h3 className="font-bold text-xl text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{item.time}</p>
              <ul className="space-y-2 mt-auto">
                {item.items.map((li) => (
                  <li key={li} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary shrink-0">→</span> {li}
                  </li>
                ))}
              </ul>
            </div>
            {i < 2 && (
              <div className="absolute right-[-18px] top-1/2 -translate-y-1/2 text-muted-foreground/30 text-2xl z-10 hidden md:block">
                →
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-primary/10 rounded-xl p-5 border border-primary/20 text-center">
        <p className="text-foreground font-medium">
          平台不是起点，而是<span className="text-primary font-bold">能力沉淀后的结果</span>
        </p>
      </div>
    </div>
  </div>
);

const SlideContact = () => (
  <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,12%)] via-[hsl(222,47%,8%)] to-[hsl(217,91%,6%)]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
    <div className="relative z-10 space-y-8 max-w-lg">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <span className="text-white font-bold text-3xl font-serif italic">灵</span>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-3">
          我们不确定这是最终答案
        </h2>
        <p className="text-xl text-white/50">
          但希望它是一个值得一起尝试的开始
        </p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-4 text-left">
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-white/40 text-sm">产品体验</span>
          <a href="https://decor-ai-guide.lovable.app" target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
            decor-ai-guide.lovable.app
          </a>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-white/40 text-sm">邮箱</span>
          <span className="text-white text-sm">contact@lingdong.design</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-white/40 text-sm">微信</span>
          <span className="text-white text-sm">lingdong-design</span>
        </div>
      </div>
      <p className="text-white/20 text-xs">
        © {new Date().getFullYear()} 灵动设计 · LINGDONG DESIGN
      </p>
    </div>
  </div>
);

/* ─── Slides Array ─── */
const slides = [SlideCover, SlideTOC, SlideOverview, SlideMarket, SlideTransaction, SlideIndustry, SlideProduct, SlideCooperation, SlideNextSteps, SlideContact];

/* ─── Main Presentation Component ─── */
const Presentation = () => {
  const [current, setCurrent] = useState(0);
  const [isGrid, setIsGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback((i: number) => {
    setCurrent(Math.max(0, Math.min(i, TOTAL_SLIDES - 1)));
    setIsGrid(false);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "Escape") { setIsGrid(false); if (document.fullscreenElement) document.exitFullscreen(); }
      else if (e.key === "g") setIsGrid((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (isGrid) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">全部幻灯片</h2>
          <button onClick={() => setIsGrid(false)} className="text-sm text-primary hover:underline">返回演示</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slides.map((Slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                i === current ? "border-primary shadow-lg" : "border-border/50"
              }`}
            >
              <div className="w-full h-full transform scale-[0.25] origin-top-left" style={{ width: "400%", height: "400%" }}>
                <Slide />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const CurrentSlide = slides[current];

  return (
    <div className="h-screen w-screen bg-background overflow-hidden relative select-none">
      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-between px-6 pb-3 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-white/40 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </button>
          <button onClick={() => setIsGrid(true)} className="text-white/40 hover:text-white transition-colors">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={toggleFullscreen} className="text-white/40 hover:text-white transition-colors">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prev} disabled={current === 0} className="text-white/40 hover:text-white disabled:opacity-20 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white/60 text-xs font-mono">{current + 1} / {TOTAL_SLIDES}</span>
          <button onClick={next} disabled={current === TOTAL_SLIDES - 1} className="text-white/40 hover:text-white disabled:opacity-20 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }} />
        </div>
      </div>

      {/* Click zones */}
      <div className="absolute inset-0 z-40 flex">
        <div className="w-1/3 h-full cursor-w-resize" onClick={prev} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full cursor-e-resize" onClick={next} />
      </div>
    </div>
  );
};

export default Presentation;
