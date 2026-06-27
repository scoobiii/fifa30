export interface Candidate {
  id: string;
  name: string;
  party?: string;
  share: number; // Percentage, e.g. 41
  color: string;
  isCustom?: boolean;
  governmentPlan?: string;
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  score?: number; // 1 to 3 stars/points
  whatIsMissing?: string;
}

export interface PolicyIndicator {
  id: string;
  name: string;
  weight: number; // Percent weight, e.g., 25
  score: number;  // 0-100 rating
  trend: "up" | "down" | "stable";
  description: string;
  metricName: string;
  metricCurrent: string;
  metricTarget: string;
}

export interface KPI {
  name: string;
  current: string;
  target: string;
  progress: number; // 0 to 100 percentage of target met
}

export interface Ministry {
  id: string;
  name: string;
  ministerName: string;
  icon: string;
  description: string;
  goals: string[];
  kpis: KPI[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  growthRate: number;
  indicators: { [key: string]: number }; // Score modifiers
  pib2045: string;
}
