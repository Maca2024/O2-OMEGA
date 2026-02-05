import { PersonalizationEngine, TimeOfDay } from '../PersonalizationEngine';
import { BreathPattern, SessionResult } from '../../types/breath';
import { BiometricState } from '../../types/biometrics';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

function makePattern(overrides: Partial<BreathPattern> & { id: string }): BreathPattern {
  return {
    name: overrides.id,
    nameDutch: overrides.id,
    category: 'parasympathetic',
    phases: [{ phase: 'inhale', duration: 4, instruction: 'Breathe in', visualIntensity: 0.5 }],
    rounds: 'infinite',
    requiredLevel: 1,
    description: 'Test pattern',
    descriptionDutch: 'Test pattern',
    scienceNote: '',
    bpm: null,
    durationRange: { min: 5, max: 20 },
    difficulty: 1,
    tags: [],
    ...overrides,
  };
}

function makeSession(overrides: Partial<SessionResult> & { patternId: string }): SessionResult {
  const now = Date.now();
  return {
    id: `session-${Math.random().toString(36).slice(2)}`,
    startedAt: now - 10 * 60_000,
    completedAt: now,
    totalBreaths: 60,
    avgBreathRate: 6,
    completionRate: 1,
    ...overrides,
  };
}

function makeBiometrics(overrides: Partial<BiometricState> = {}): BiometricState {
  return {
    heartRate: 72,
    hrv: 45,
    spo2: 98,
    respiratoryRate: 14,
    polyvagalState: 'ventral',
    coherenceScore: 0.6,
    timestamp: Date.now(),
    source: 'simulated',
    ...overrides,
  };
}

// A realistic set of patterns covering all categories / difficulties / IDs
const PATTERNS: BreathPattern[] = [
  makePattern({ id: 'diaphragmatic', category: 'parasympathetic', difficulty: 1, requiredLevel: 1 }),
  makePattern({ id: 'coherent-breathing', category: 'parasympathetic', difficulty: 1, requiredLevel: 1 }),
  makePattern({ id: '4-7-8', category: 'parasympathetic', difficulty: 2, requiredLevel: 1 }),
  makePattern({ id: 'box-breathing', category: 'sympathetic', difficulty: 2, requiredLevel: 1 }),
  makePattern({ id: 'buteyko-sleep', category: 'clinical', difficulty: 2, requiredLevel: 2 }),
  makePattern({ id: 'wim-hof', category: 'sympathetic', difficulty: 3, requiredLevel: 3 }),
  makePattern({ id: 'holotropic', category: 'transformative', difficulty: 4, requiredLevel: 4 }),
  makePattern({ id: 'tummo', category: 'transformative', difficulty: 4, requiredLevel: 4 }),
];

// ---------------------------------------------------------------------------
// 1. getTimeOfDay
// ---------------------------------------------------------------------------

describe('PersonalizationEngine.getTimeOfDay', () => {
  const cases: [number, TimeOfDay][] = [
    [0, 'night'],
    [3, 'night'],
    [4, 'night'],
    [5, 'morning'],
    [8, 'morning'],
    [11, 'morning'],
    [12, 'afternoon'],
    [14, 'afternoon'],
    [16, 'afternoon'],
    [17, 'evening'],
    [19, 'evening'],
    [20, 'evening'],
    [21, 'night'],
    [23, 'night'],
  ];

  test.each(cases)('hour %i returns "%s"', (hour, expected) => {
    expect(PersonalizationEngine.getTimeOfDay(hour)).toBe(expected);
  });

  test('uses current hour when none provided', () => {
    const result = PersonalizationEngine.getTimeOfDay();
    expect(['morning', 'afternoon', 'evening', 'night']).toContain(result);
  });
});

// ---------------------------------------------------------------------------
// 2. getRecommendation — parasympathetic preferred in evening/night
// ---------------------------------------------------------------------------

describe('getRecommendation — evening/night prefers parasympathetic', () => {
  test('evening recommends a parasympathetic pattern', () => {
    const rec = PersonalizationEngine.getRecommendation(PATTERNS, {
      timeOfDay: 'evening',
      recentSessions: [],
      userLevel: 1,
    });
    const chosen = PATTERNS.find(p => p.id === rec.patternId)!;
    expect(chosen.category).toBe('parasympathetic');
    expect(rec.context).toBe('evening');
  });

  test('night recommends 4-7-8 or buteyko-sleep (sleep-specific patterns)', () => {
    const rec = PersonalizationEngine.getRecommendation(PATTERNS, {
      timeOfDay: 'night',
      recentSessions: [],
      userLevel: 2,
    });
    expect(['4-7-8', 'buteyko-sleep']).toContain(rec.patternId);
    expect(rec.context).toBe('sleep');
  });
});

// ---------------------------------------------------------------------------
// 3. getRecommendation — sympathetic preferred in morning
// ---------------------------------------------------------------------------

describe('getRecommendation — morning prefers sympathetic', () => {
  test('morning recommends a sympathetic pattern when available at user level', () => {
    // Use userLevel 2 to avoid beginner-boost (+1 for difficulty 1) creating a
    // tie between parasympathetic patterns and the sympathetic one.
    const rec = PersonalizationEngine.getRecommendation(PATTERNS, {
      timeOfDay: 'morning',
      recentSessions: [],
      userLevel: 2,
    });
    const chosen = PATTERNS.find(p => p.id === rec.patternId)!;
    // box-breathing is the highest-scoring sympathetic pattern in the morning
    expect(chosen.category).toBe('sympathetic');
    expect(rec.reason).toBe('Morning energy boost');
  });
});

// ---------------------------------------------------------------------------
// 4. getRecommendation — stressed biometrics lead to calming
// ---------------------------------------------------------------------------

describe('getRecommendation — stressed biometrics', () => {
  test('sympathetic polyvagal state + low HRV favours parasympathetic', () => {
    const stressedBio = makeBiometrics({
      heartRate: 95,
      hrv: 15,
      polyvagalState: 'sympathetic',
    });

    const rec = PersonalizationEngine.getRecommendation(PATTERNS, {
      timeOfDay: 'afternoon',
      currentBiometrics: stressedBio,
      recentSessions: [],
      userLevel: 1,
    });

    const chosen = PATTERNS.find(p => p.id === rec.patternId)!;
    expect(chosen.category).toBe('parasympathetic');
    expect(rec.context).toBe('stress');
  });

  test('dorsal state recommends gentle activation patterns', () => {
    const dorsalBio = makeBiometrics({ polyvagalState: 'dorsal', hrv: 30 });

    const rec = PersonalizationEngine.getRecommendation(PATTERNS, {
      timeOfDay: 'afternoon',
      currentBiometrics: dorsalBio,
      recentSessions: [],
      userLevel: 1,
    });

    expect(['diaphragmatic', 'coherent-breathing']).toContain(rec.patternId);
    expect(rec.context).toBe('energy');
  });
});

// ---------------------------------------------------------------------------
// 5. getRecommendation — filters out patterns above user level
// ---------------------------------------------------------------------------

describe('getRecommendation — level filtering', () => {
  test('level 1 user never receives level 2+ patterns', () => {
    // Run recommendation for every time of day to be thorough
    const times: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
    for (const t of times) {
      const rec = PersonalizationEngine.getRecommendation(PATTERNS, {
        timeOfDay: t,
        recentSessions: [],
        userLevel: 1,
      });
      const chosen = PATTERNS.find(p => p.id === rec.patternId)!;
      expect(chosen.requiredLevel).toBeLessThanOrEqual(1);
    }
  });

  test('level 4 user can receive any pattern', () => {
    const rec = PersonalizationEngine.getRecommendation(PATTERNS, {
      timeOfDay: 'morning',
      recentSessions: [],
      userLevel: 4,
    });
    const chosen = PATTERNS.find(p => p.id === rec.patternId)!;
    expect(chosen).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 6. getRecommendation — variety scoring
// ---------------------------------------------------------------------------

describe('getRecommendation — variety', () => {
  test('avoids patterns done in recent sessions', () => {
    // Create recent sessions for the patterns that would otherwise score highest
    // In morning, box-breathing (sympathetic) scores highest. Mark it as recently done.
    const recentSessions = [
      makeSession({ patternId: 'box-breathing' }),
      makeSession({ patternId: 'box-breathing' }),
    ];

    // With only level-1 patterns and box-breathing recently done, the variety
    // penalty should shift the recommendation away when scores are close.
    // To make a cleaner test, use only two patterns with identical time scores.
    const twoPatterns = [
      makePattern({ id: 'pattern-a', category: 'sympathetic', difficulty: 1, requiredLevel: 1 }),
      makePattern({ id: 'pattern-b', category: 'sympathetic', difficulty: 1, requiredLevel: 1 }),
    ];

    const sessionsA = [makeSession({ patternId: 'pattern-a' })];

    const rec = PersonalizationEngine.getRecommendation(twoPatterns, {
      timeOfDay: 'morning',
      recentSessions: sessionsA,
      userLevel: 1,
    });

    // pattern-b should win because pattern-a was done recently (tie-break via variety)
    expect(rec.patternId).toBe('pattern-b');
  });
});

// ---------------------------------------------------------------------------
// 7. generateInsights — HRV improvement
// ---------------------------------------------------------------------------

describe('generateInsights — HRV improvement', () => {
  test('detects HRV improvement > 5%', () => {
    const olderWeek = [30, 32, 31, 29, 30, 33, 31]; // avg ~30.86
    const recentWeek = [40, 42, 38, 41, 39, 43, 40]; // avg ~40.43 => ~31% improvement
    const hrvHistory = [...olderWeek, ...recentWeek];

    const insights = PersonalizationEngine.generateInsights([], hrvHistory, []);
    const hrvInsight = insights.find(i => i.type === 'hrv_trend');
    expect(hrvInsight).toBeDefined();
    expect(hrvInsight!.title).toBe('HRV Improving');
    expect(hrvInsight!.actionable).toBe(false);
    expect(hrvInsight!.message).toContain('improved');
  });
});

// ---------------------------------------------------------------------------
// 8. generateInsights — HRV decline with actionable recommendation
// ---------------------------------------------------------------------------

describe('generateInsights — HRV decline', () => {
  test('detects HRV decline > 10% and provides actionable insight', () => {
    const olderWeek = [50, 52, 48, 51, 49, 53, 50]; // avg ~50.43
    const recentWeek = [35, 38, 36, 34, 37, 33, 36]; // avg ~35.57 => ~-29%
    const hrvHistory = [...olderWeek, ...recentWeek];

    const insights = PersonalizationEngine.generateInsights([], hrvHistory, []);
    const declineInsight = insights.find(i => i.type === 'warning');
    expect(declineInsight).toBeDefined();
    expect(declineInsight!.title).toBe('HRV Declining');
    expect(declineInsight!.actionable).toBe(true);
    expect(declineInsight!.action).toEqual({
      type: 'start_session',
      patternId: 'coherent-breathing',
    });
    expect(declineInsight!.message).toContain('decreased');
  });
});

// ---------------------------------------------------------------------------
// 9. generateInsights — session milestones
// ---------------------------------------------------------------------------

describe('generateInsights — milestones', () => {
  test('detects consistent practice (5+ sessions this week)', () => {
    const now = Date.now();
    const sessions: SessionResult[] = Array.from({ length: 6 }, (_, i) =>
      makeSession({
        patternId: 'coherent-breathing',
        startedAt: now - i * 24 * 3600 * 1000,
        completedAt: now - i * 24 * 3600 * 1000 + 10 * 60_000,
      }),
    );

    const insights = PersonalizationEngine.generateInsights(sessions, [], []);
    const consistency = insights.find(i => i.title === 'Consistent Practice');
    expect(consistency).toBeDefined();
    expect(consistency!.type).toBe('milestone');
    expect(consistency!.message).toContain('6 sessions');
  });

  test('detects total minutes milestone (60 min)', () => {
    const now = Date.now();
    // 7 sessions x ~9 min each = 63 min (within 60 * 1.1 = 66)
    const sessions: SessionResult[] = Array.from({ length: 7 }, (_, i) =>
      makeSession({
        patternId: 'diaphragmatic',
        startedAt: now - (i + 7) * 24 * 3600 * 1000,
        completedAt: now - (i + 7) * 24 * 3600 * 1000 + 9 * 60_000,
      }),
    );

    const insights = PersonalizationEngine.generateInsights(sessions, [], []);
    const milestone = insights.find(i => i.title === '60 Minutes Milestone!');
    expect(milestone).toBeDefined();
    expect(milestone!.message).toContain('63 minutes');
  });

  test('detects Buteyko CP improvement', () => {
    const cpHistory = [15, 18, 22, 28]; // 28 - 15 = 13 >= 10
    const insights = PersonalizationEngine.generateInsights([], [], cpHistory);
    const cp = insights.find(i => i.title === 'Control Pause Improved');
    expect(cp).toBeDefined();
    expect(cp!.type).toBe('progress');
    expect(cp!.message).toContain('15s');
    expect(cp!.message).toContain('28s');
  });
});

// ---------------------------------------------------------------------------
// 10. generateCoachingMessage — varies by time of day
// ---------------------------------------------------------------------------

describe('generateCoachingMessage', () => {
  test('morning message references morning themes', () => {
    // Run multiple times to cover random selection
    const msgs = new Set<string>();
    for (let i = 0; i < 20; i++) {
      msgs.add(PersonalizationEngine.generateCoachingMessage('morning'));
    }
    // All morning messages should contain known morning keywords
    for (const m of msgs) {
      expect(
        m.includes('morning') || m.includes('Morning') || m.includes('day') || m.includes('alertness'),
      ).toBe(true);
    }
  });

  test('night message references sleep themes', () => {
    const msgs = new Set<string>();
    for (let i = 0; i < 20; i++) {
      msgs.add(PersonalizationEngine.generateCoachingMessage('night'));
    }
    for (const m of msgs) {
      expect(
        m.includes('sleep') || m.includes('Sleep') || m.includes('Night') || m.includes('night') || m.includes('exhale'),
      ).toBe(true);
    }
  });

  test('returns biometric-based message when HRV is below baseline', () => {
    const bio = makeBiometrics({ hrv: 25 });
    const msg = PersonalizationEngine.generateCoachingMessage('afternoon', bio, 40);
    expect(msg).toContain('15ms below your baseline');
    expect(msg).toContain('Coherent Breathing');
  });

  test('returns stress message for sympathetic polyvagal state', () => {
    const bio = makeBiometrics({ hrv: 40, polyvagalState: 'sympathetic' });
    const msg = PersonalizationEngine.generateCoachingMessage('afternoon', bio, 38);
    expect(msg).toContain('elevated stress');
    expect(msg).toContain('vagus nerve');
  });
});

// ---------------------------------------------------------------------------
// 11. suggestDuration — appropriate durations
// ---------------------------------------------------------------------------

describe('suggestDuration', () => {
  const pattern = makePattern({ id: 'test', durationRange: { min: 5, max: 20 } });

  test('morning/afternoon returns shorter duration (min + 5 capped at max)', () => {
    expect(PersonalizationEngine.suggestDuration(pattern, 'morning')).toBe(10);
    expect(PersonalizationEngine.suggestDuration(pattern, 'afternoon')).toBe(10);
  });

  test('evening/night returns medium duration (avg of min and max)', () => {
    expect(PersonalizationEngine.suggestDuration(pattern, 'evening')).toBe(13); // round((5+20)/2) = 13
    expect(PersonalizationEngine.suggestDuration(pattern, 'night')).toBe(13);
  });

  test('morning duration does not exceed max', () => {
    const shortRange = makePattern({ id: 'short', durationRange: { min: 3, max: 5 } });
    expect(PersonalizationEngine.suggestDuration(shortRange, 'morning')).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Additional edge-case: mapTimeToContext
// ---------------------------------------------------------------------------

describe('mapTimeToContext', () => {
  test('returns stress when polyvagal state is sympathetic', () => {
    expect(PersonalizationEngine.mapTimeToContext('morning', 'sympathetic')).toBe('stress');
  });

  test('returns energy when polyvagal state is dorsal', () => {
    expect(PersonalizationEngine.mapTimeToContext('afternoon', 'dorsal')).toBe('energy');
  });

  test('returns time-based context when polyvagal state is ventral', () => {
    expect(PersonalizationEngine.mapTimeToContext('morning', 'ventral')).toBe('morning');
    expect(PersonalizationEngine.mapTimeToContext('afternoon', 'ventral')).toBe('afternoon');
    expect(PersonalizationEngine.mapTimeToContext('evening', 'ventral')).toBe('evening');
    expect(PersonalizationEngine.mapTimeToContext('night', 'ventral')).toBe('sleep');
  });

  test('returns time-based context when polyvagal state is undefined', () => {
    expect(PersonalizationEngine.mapTimeToContext('night')).toBe('sleep');
  });
});
