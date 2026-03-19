export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  type?: "product" | "budget" | "analysis";
  products?: ProductCard[];
  budget?: BudgetSummary;
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
