export type SeedType = 'wheat' | 'barley' | 'oats' | 'rye' | 'broken';

export interface SeedAnalysis {
  type: SeedType;
  count: number;
}

export interface HistoryItem {
  id: string;
  imageUri: string;
  analysis: SeedAnalysis;
  date: string;
}
