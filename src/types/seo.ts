export interface CompetitorAnalysis {
  id: string;
  rank: number; // 1 to count
  url: string;
  domain: string;
  slugPath: string;
  slugTokens: string[];
  title: string;
  urlLength: number;
  proportionalBarWidth: number; // Proportional to URL string length & structural complexity
  estimatedWordCount: number;
  semanticDensity: number; // e.g. 1.85%
  contentScore: number; // 0 to 100
  structuralDepth: 'Brief Overview' | 'Moderate Guide' | 'In-Depth Pillar' | 'Comprehensive Playbook';
  h2Count: number;
  h3Count: number;
  missedTopics: string[]; // Dynamically constructed from keyword tokens
  omittedSubheadings: string[]; // Dynamically constructed
  primaryWeakness: string;
  uniqueAngle: string;
  // Historical trend metadata for Trend Line overlay
  historicalDensityPoints: number[]; // 4 historical snapshots [Q1, Q2, Q3, Q4]
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  trendDeltaPercent: number; // e.g. +14 or -8
  trendSummary: string;
}

export interface LsiKeywordItem {
  id: string;
  keyword: string;
  searchIntent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  relevanceScore: number; // 0 to 100
  recommendedDensity: string;
  adopted: boolean;
}

export interface SubheadingItem {
  id: string;
  tag: 'H2' | 'H3';
  title: string;
  intentGoal: string;
  competitorsLacking: number; // based on actual competitor count
  adopted: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  searchIntent: string;
  schemaValid: boolean;
  adopted: boolean;
}

export interface AnalysisResult {
  targetKeyword: string;
  timestamp: string;
  competitorCount: number;
  competitors: CompetitorAnalysis[];
  averageWordCount: number;
  averageContentScore: number;
  averageSemanticDensity: number;
  serpDifficulty: 'Low' | 'Medium' | 'High' | 'Very Competitive';
  recommendedTargetWordCount: number;
  dynamicLsiKeywords: LsiKeywordItem[];
  missedSubheadings: SubheadingItem[];
  coreFaqs: FaqItem[];
  baseRankingProbability: number;
  modifierCount: number;
  randomFactor: number;
}

export type LinearMetricType = 'urlLength' | 'contentScore' | 'wordCount' | 'semanticDensity';
