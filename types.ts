
export type RiskStyle = 'Growth' | 'Balanced' | 'Income';
export type TimeHorizon = '<5 years' | '5–10 years' | '10+ years';

export interface FormData {
  age: number;
  riskStyle: RiskStyle;
  timeHorizon: TimeHorizon;
  monthlyContribution: number;
}

export interface AllocationItem {
    etf: string;
    percentage: number;
    explanation: string;
}

export interface GrowthDataPoint {
    name: string;
    value: number;
}

export interface Plan {
  inputs: FormData;
  allocation: AllocationItem[];
  growth: GrowthDataPoint[];
}
