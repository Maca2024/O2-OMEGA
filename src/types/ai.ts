export interface AIRecommendation {
  patternId: string;
  reason: string;
  confidence: number;
  suggestedDuration: number;
  context: 'morning' | 'afternoon' | 'evening' | 'stress' | 'energy' | 'sleep' | 'progress';
}

export interface AIInsight {
  id: string;
  type: 'hrv_trend' | 'pattern_suggestion' | 'progress' | 'milestone' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  actionable: boolean;
  action?: { type: 'start_session'; patternId: string } | { type: 'view_insights' } | { type: 'unlock_info' };
}

export interface JournalEntry {
  id: string;
  sessionId: string;
  timestamp: number;
  text?: string;
  voiceTranscript?: string;
  mood: number;
  tags: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}
