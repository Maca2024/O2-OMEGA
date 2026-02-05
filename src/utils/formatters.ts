export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) return `${Math.round(totalMinutes)}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatSeconds(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  return `${seconds}`;
}

export function formatPhaseLabel(phase: string): string {
  switch (phase) {
    case 'inhale': return 'INHALE';
    case 'holdIn': return 'HOLD';
    case 'exhale': return 'EXHALE';
    case 'holdOut': return 'HOLD';
    case 'free': return 'FREE BREATHE';
    default: return phase.toUpperCase();
  }
}

export function formatGreeting(hour?: number): string {
  const h = hour ?? new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return `${xp}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getDifficultyStars(difficulty: number): string {
  return '★'.repeat(difficulty) + '☆'.repeat(4 - difficulty);
}
