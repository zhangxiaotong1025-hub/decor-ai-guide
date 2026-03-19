export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  type?: "product" | "budget" | "analysis" | "design-solution";
  products?: ProductCard[];
  budget?: BudgetSummary;
  designSolution?: DesignSolution;
}

export interface ProductCard {
  name: string;
  spec: string;
  material: string;
  price: string;
  tag: string;
}

export interface BudgetSummary {
  total: string;
  breakdown: { item: string; cost: string; pct: number }[];
  status: "within" | "over" | "under";
}

export interface DesignSolution {
  id: string;
  name: string;
  concept: string;
  renderImages: string[];
  annotations: Array<{
    position: { x: number; y: number };
    label: string;
    description: string;
  }>;
  spaceUnderstanding: {
    analysis: string;
    opportunities: string[];
    challenges: string[];
  };
  designThinking: {
    concept: string;
    layout: { principle: string; circulation: string; zoning: string };
    atmosphere: { lighting: string; color: string; texture: string };
  };
  lifeScenarios: Array<{
    name: string;
    description: string;
    design: string;
  }>;
  productSelection: {
    principle: string;
    items: Array<{
      category: string;
      why: string;
      material: string;
      color: string;
      performance: string;
      storage: string;
      texture: string;
      style: string;
      price: number;
      name: string;
      brand: string;
      brief: string;
    }>;
  };
  costOptimization: {
    current: number;
    canSave: Array<{ item: string; savings: number; tradeoff: string }>;
    canUpgrade: Array<{ item: string; cost: number; benefit: string }>;
    recommendation: string;
  };
}
