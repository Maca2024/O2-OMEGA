import {
  formatDuration,
  formatMinutes,
  formatSeconds,
  formatPhaseLabel,
  formatGreeting,
  formatXP,
  formatDate,
  formatPercentage,
  getDifficultyStars,
} from '../formatters';

describe('formatDuration', () => {
  it('formats zero', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formats seconds only', () => {
    expect(formatDuration(30000)).toBe('0:30');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(125000)).toBe('2:05');
  });

  it('formats exact minutes', () => {
    expect(formatDuration(300000)).toBe('5:00');
  });

  it('pads seconds with leading zero', () => {
    expect(formatDuration(63000)).toBe('1:03');
  });
});

describe('formatMinutes', () => {
  it('formats minutes under an hour', () => {
    expect(formatMinutes(45)).toBe('45m');
  });

  it('formats exact hours', () => {
    expect(formatMinutes(120)).toBe('2h');
  });

  it('formats hours and minutes', () => {
    expect(formatMinutes(90)).toBe('1h 30m');
  });
});

describe('formatSeconds', () => {
  it('rounds up milliseconds to seconds', () => {
    expect(formatSeconds(3500)).toBe('4');
  });

  it('handles exact seconds', () => {
    expect(formatSeconds(5000)).toBe('5');
  });

  it('handles zero', () => {
    expect(formatSeconds(0)).toBe('0');
  });
});

describe('formatPhaseLabel', () => {
  it('maps inhale', () => {
    expect(formatPhaseLabel('inhale')).toBe('INHALE');
  });

  it('maps holdIn', () => {
    expect(formatPhaseLabel('holdIn')).toBe('HOLD');
  });

  it('maps exhale', () => {
    expect(formatPhaseLabel('exhale')).toBe('EXHALE');
  });

  it('maps holdOut', () => {
    expect(formatPhaseLabel('holdOut')).toBe('HOLD');
  });

  it('maps free', () => {
    expect(formatPhaseLabel('free')).toBe('FREE BREATHE');
  });

  it('handles unknown phase', () => {
    expect(formatPhaseLabel('unknown')).toBe('UNKNOWN');
  });
});

describe('formatGreeting', () => {
  it('returns morning greeting', () => {
    expect(formatGreeting(8)).toBe('Good morning');
  });

  it('returns afternoon greeting', () => {
    expect(formatGreeting(14)).toBe('Good afternoon');
  });

  it('returns evening greeting', () => {
    expect(formatGreeting(19)).toBe('Good evening');
  });

  it('returns night greeting', () => {
    expect(formatGreeting(23)).toBe('Good night');
  });

  it('returns night greeting for early morning', () => {
    expect(formatGreeting(3)).toBe('Good night');
  });

  it('returns morning at 5am boundary', () => {
    expect(formatGreeting(5)).toBe('Good morning');
  });
});

describe('formatXP', () => {
  it('formats small XP normally', () => {
    expect(formatXP(500)).toBe('500');
  });

  it('formats large XP with k suffix', () => {
    expect(formatXP(2500)).toBe('2.5k');
  });

  it('formats exact thousands', () => {
    expect(formatXP(3000)).toBe('3.0k');
  });
});

describe('formatPercentage', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercentage(0.75)).toBe('75%');
  });

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  it('formats full', () => {
    expect(formatPercentage(1)).toBe('100%');
  });

  it('rounds to nearest integer', () => {
    expect(formatPercentage(0.333)).toBe('33%');
  });
});

describe('getDifficultyStars', () => {
  it('shows 1 star', () => {
    expect(getDifficultyStars(1)).toBe('★☆☆☆');
  });

  it('shows 2 stars', () => {
    expect(getDifficultyStars(2)).toBe('★★☆☆');
  });

  it('shows 3 stars', () => {
    expect(getDifficultyStars(3)).toBe('★★★☆');
  });

  it('shows 4 stars', () => {
    expect(getDifficultyStars(4)).toBe('★★★★');
  });
});

describe('formatDate', () => {
  it('formats timestamp as short date', () => {
    const timestamp = new Date('2026-02-05').getTime();
    const result = formatDate(timestamp);
    expect(result).toContain('Feb');
    expect(result).toContain('5');
  });
});
