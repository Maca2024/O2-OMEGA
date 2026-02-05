import { createClient } from '@supabase/supabase-js';

// EU-hosted Supabase instance (Frankfurt)
// Replace with actual values in production
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Database types for Supabase tables
export interface DatabaseSession {
  id: string;
  user_id: string;
  pattern_id: string;
  started_at: string;
  completed_at: string;
  total_breaths: number;
  avg_breath_rate: number;
  completion_rate: number;
  mood_before: number | null;
  mood_after: number | null;
  journal_entry: string | null;
  avg_hr: number | null;
  avg_hrv: number | null;
  avg_spo2: number | null;
  coherence_score: number | null;
  created_at: string;
}

export interface DatabaseUserProfile {
  id: string;
  display_name: string;
  email: string;
  locale: string;
  access_level: number;
  subscription: string;
  total_sessions: number;
  total_minutes: number;
  current_streak: number;
  longest_streak: number;
  xp: number;
  level: number;
  buteyko_cp_score: number | null;
  personal_resonant_frequency: number | null;
  medical_clearance: boolean;
  informed_consent_signed: boolean;
  onboarding_completed: boolean;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
