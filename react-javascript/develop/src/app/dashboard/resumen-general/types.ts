export interface SummaryCardData {
  title: string;
  value: string | number;
  description: string;
  color: string;
}

export interface DashboardSummary {
  cards: SummaryCardData[];
}