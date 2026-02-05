import {
  checkAccess,
  calculateLevelProgress,
  ACCESS_LEVELS,
} from '../ProgressiveAccess';
import { evaluateMedicalScreening, MEDICAL_QUESTIONS } from '../MedicalScreening';
import { evaluateTest, KNOWLEDGE_TEST, PASS_THRESHOLD } from '../KnowledgeTest';
import { BiometricSafetyMonitor, SafetyAlert } from '../BiometricSafetyMonitor';

// ---------------------------------------------------------------------------
// 1. Level 1 user can access level 1 patterns
// ---------------------------------------------------------------------------
describe('ProgressiveAccess - checkAccess', () => {
  it('grants access when a level 1 user requests level 1 patterns', () => {
    const result = checkAccess(
      1, // userLevel
      1, // requiredLevel
      0, // totalSessions
      0, // totalHours
      false, // knowledgeTestPassed
      false, // medicalClearance
      false, // informedConsent
      false, // hasEmergencyContact
    );

    expect(result.granted).toBe(true);
    expect(result.currentLevel).toBe(1);
    expect(result.requiredLevel).toBe(1);
    expect(result.missingRequirements).toEqual([]);
  });

  it('grants access to level 2 when all level 2 requirements are met', () => {
    const result = checkAccess(2, 2, 15, 5, true, false, false, false);

    expect(result.granted).toBe(true);
    expect(result.missingRequirements).toEqual([]);
  });

  it('grants access to level 3 when all level 3 requirements are met', () => {
    const result = checkAccess(3, 3, 30, 15, true, false, false, false);

    expect(result.granted).toBe(true);
    expect(result.missingRequirements).toEqual([]);
  });

  // ---------------------------------------------------------------------------
  // 2. Level 1 user cannot access level 4 patterns (missing requirements listed)
  // ---------------------------------------------------------------------------
  it('denies access when a level 1 user requests level 4 patterns and lists all missing requirements', () => {
    const result = checkAccess(
      1, // userLevel
      4, // requiredLevel
      0, // totalSessions
      0, // totalHours
      false, // knowledgeTestPassed
      false, // medicalClearance
      false, // informedConsent
      false, // hasEmergencyContact
    );

    expect(result.granted).toBe(false);
    expect(result.currentLevel).toBe(1);
    expect(result.requiredLevel).toBe(4);
    expect(result.missingRequirements).toContain(
      'Access level 4 required (current: 1)',
    );
    expect(result.missingRequirements).toContain(
      '50 sessions required (current: 0)',
    );
    expect(result.missingRequirements).toContain(
      '50 hours of practice required (current: 0)',
    );
    expect(result.missingRequirements).toContain(
      'Knowledge test must be passed',
    );
    expect(result.missingRequirements).toContain('Medical clearance required');
    expect(result.missingRequirements).toContain(
      'Informed consent must be signed',
    );
    expect(result.missingRequirements).toContain(
      'Emergency contact must be provided',
    );
    expect(result.missingRequirements).toHaveLength(7);
  });

  it('denies access when sessions are insufficient even if level matches', () => {
    const result = checkAccess(2, 2, 5, 10, true, false, false, false);

    expect(result.granted).toBe(false);
    expect(result.missingRequirements).toContain(
      '10 sessions required (current: 5)',
    );
  });

  it('denies access when hours are insufficient', () => {
    const result = checkAccess(2, 2, 15, 1, true, false, false, false);

    expect(result.granted).toBe(false);
    expect(result.missingRequirements).toContain(
      '3 hours of practice required (current: 1)',
    );
  });

  it('denies access when knowledge test not passed for level 2+', () => {
    const result = checkAccess(2, 2, 15, 5, false, false, false, false);

    expect(result.granted).toBe(false);
    expect(result.missingRequirements).toContain(
      'Knowledge test must be passed',
    );
  });

  it('grants full level 4 access when every requirement is met', () => {
    const result = checkAccess(4, 4, 100, 80, true, true, true, true);

    expect(result.granted).toBe(true);
    expect(result.missingRequirements).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 3. Progress calculation works correctly
// ---------------------------------------------------------------------------
describe('ProgressiveAccess - calculateLevelProgress', () => {
  it('shows full progress and no next level when already at level 4', () => {
    const result = calculateLevelProgress(4, 100, 100);

    expect(result.nextLevel).toBeNull();
    expect(result.progress).toBe(1);
    expect(result.sessionsNeeded).toBe(0);
    expect(result.hoursNeeded).toBe(0);
  });

  it('calculates correct progress from level 1 to level 2', () => {
    // Level 2 requires 10 sessions and 3 hours
    const result = calculateLevelProgress(1, 5, 1.5);

    expect(result.nextLevel).toBe(2);
    // Session progress: 5/10 = 0.5, Hours progress: 1.5/3 = 0.5
    // Average: 0.5
    expect(result.progress).toBeCloseTo(0.5, 5);
    expect(result.sessionsNeeded).toBe(5);
    expect(result.hoursNeeded).toBeCloseTo(1.5, 5);
  });

  it('calculates correct progress from level 2 to level 3', () => {
    // Level 3 requires 30 sessions and 15 hours
    const result = calculateLevelProgress(2, 15, 7.5);

    expect(result.nextLevel).toBe(3);
    // Session progress: 15/30 = 0.5, Hours progress: 7.5/15 = 0.5
    expect(result.progress).toBeCloseTo(0.5, 5);
    expect(result.sessionsNeeded).toBe(15);
    expect(result.hoursNeeded).toBeCloseTo(7.5, 5);
  });

  it('caps progress at 1 when sessions/hours exceed the next level requirement', () => {
    // Level 2 requires 10 sessions, 3 hours -- we exceed both
    const result = calculateLevelProgress(1, 20, 10);

    expect(result.nextLevel).toBe(2);
    expect(result.progress).toBe(1);
    expect(result.sessionsNeeded).toBe(0);
    expect(result.hoursNeeded).toBe(0);
  });

  it('returns 0 progress when no sessions or hours completed', () => {
    const result = calculateLevelProgress(1, 0, 0);

    expect(result.nextLevel).toBe(2);
    expect(result.progress).toBe(0);
    expect(result.sessionsNeeded).toBe(10);
    expect(result.hoursNeeded).toBe(3);
  });

  it('calculates correct progress from level 3 to level 4', () => {
    // Level 4 requires 50 sessions and 50 hours
    const result = calculateLevelProgress(3, 25, 25);

    expect(result.nextLevel).toBe(4);
    // Session progress: 25/50 = 0.5, Hours progress: 25/50 = 0.5
    expect(result.progress).toBeCloseTo(0.5, 5);
    expect(result.sessionsNeeded).toBe(25);
    expect(result.hoursNeeded).toBe(25);
  });
});

// ---------------------------------------------------------------------------
// 4. Medical screening blocks on any blocker answer
// ---------------------------------------------------------------------------
describe('MedicalScreening - evaluateMedicalScreening', () => {
  it('clears when all answers are false (no conditions)', () => {
    const answers: Record<string, boolean> = {};
    for (const q of MEDICAL_QUESTIONS) {
      answers[q.id] = false;
    }

    const result = evaluateMedicalScreening(answers);

    expect(result.cleared).toBe(true);
    expect(result.blockers).toEqual([]);
  });

  it('blocks when any single blocker question is answered yes', () => {
    const answers: Record<string, boolean> = {};
    for (const q of MEDICAL_QUESTIONS) {
      answers[q.id] = false;
    }
    // Answer epilepsy as true
    answers['epilepsy'] = true;

    const result = evaluateMedicalScreening(answers);

    expect(result.cleared).toBe(false);
    expect(result.blockers).toContain('epilepsy');
    expect(result.blockers).toHaveLength(1);
  });

  it('blocks and lists multiple blockers when several conditions present', () => {
    const answers: Record<string, boolean> = {};
    for (const q of MEDICAL_QUESTIONS) {
      answers[q.id] = false;
    }
    answers['epilepsy'] = true;
    answers['pregnancy'] = true;
    answers['psychosis'] = true;

    const result = evaluateMedicalScreening(answers);

    expect(result.cleared).toBe(false);
    expect(result.blockers).toContain('epilepsy');
    expect(result.blockers).toContain('pregnancy');
    expect(result.blockers).toContain('psychosis');
    expect(result.blockers).toHaveLength(3);
  });

  it('blocks when ALL conditions are answered yes', () => {
    const answers: Record<string, boolean> = {};
    for (const q of MEDICAL_QUESTIONS) {
      answers[q.id] = true;
    }

    const result = evaluateMedicalScreening(answers);

    expect(result.cleared).toBe(false);
    expect(result.blockers).toHaveLength(MEDICAL_QUESTIONS.length);
  });

  it('clears when answers object is empty (no answers provided)', () => {
    const result = evaluateMedicalScreening({});

    expect(result.cleared).toBe(true);
    expect(result.blockers).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 5. Knowledge test evaluation with pass/fail scenarios
// ---------------------------------------------------------------------------
describe('KnowledgeTest - evaluateTest', () => {
  it('passes when all answers are correct (10/10)', () => {
    const answers: Record<string, number> = {};
    for (const q of KNOWLEDGE_TEST) {
      answers[q.id] = q.correctIndex;
    }

    const result = evaluateTest(answers);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(1);
    expect(result.totalQuestions).toBe(10);
    expect(result.incorrectIds).toEqual([]);
  });

  it('passes when exactly 8/10 correct (at threshold)', () => {
    const answers: Record<string, number> = {};
    for (const q of KNOWLEDGE_TEST) {
      answers[q.id] = q.correctIndex;
    }
    // Make exactly 2 incorrect
    const firstTwoIds = KNOWLEDGE_TEST.slice(0, 2).map((q) => q.id);
    for (const id of firstTwoIds) {
      const q = KNOWLEDGE_TEST.find((qu) => qu.id === id)!;
      answers[id] = (q.correctIndex + 1) % q.options.length;
    }

    const result = evaluateTest(answers);

    expect(result.passed).toBe(true);
    expect(result.score).toBeCloseTo(0.8, 5);
    expect(result.totalQuestions).toBe(10);
    expect(result.incorrectIds).toHaveLength(2);
    expect(result.incorrectIds).toContain(firstTwoIds[0]);
    expect(result.incorrectIds).toContain(firstTwoIds[1]);
  });

  it('fails when only 7/10 correct (below threshold)', () => {
    const answers: Record<string, number> = {};
    for (const q of KNOWLEDGE_TEST) {
      answers[q.id] = q.correctIndex;
    }
    // Make 3 incorrect
    const wrongIds = KNOWLEDGE_TEST.slice(0, 3).map((q) => q.id);
    for (const id of wrongIds) {
      const q = KNOWLEDGE_TEST.find((qu) => qu.id === id)!;
      answers[id] = (q.correctIndex + 1) % q.options.length;
    }

    const result = evaluateTest(answers);

    expect(result.passed).toBe(false);
    expect(result.score).toBeCloseTo(0.7, 5);
    expect(result.incorrectIds).toHaveLength(3);
  });

  it('fails when all answers are wrong (0/10)', () => {
    const answers: Record<string, number> = {};
    for (const q of KNOWLEDGE_TEST) {
      answers[q.id] = (q.correctIndex + 1) % q.options.length;
    }

    const result = evaluateTest(answers);

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.incorrectIds).toHaveLength(10);
  });

  it('fails when no answers are provided', () => {
    const result = evaluateTest({});

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.incorrectIds).toHaveLength(10);
  });

  it('has exactly 10 questions', () => {
    expect(KNOWLEDGE_TEST).toHaveLength(10);
  });

  it('has a pass threshold of 0.8', () => {
    expect(PASS_THRESHOLD).toBe(0.8);
  });

  it('each question has valid structure', () => {
    for (const q of KNOWLEDGE_TEST) {
      expect(q.id).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// 6. BiometricSafetyMonitor fires alerts correctly
// ---------------------------------------------------------------------------
describe('BiometricSafetyMonitor', () => {
  let alerts: SafetyAlert[];
  let monitor: BiometricSafetyMonitor;

  beforeEach(() => {
    alerts = [];
    monitor = new BiometricSafetyMonitor(150, 88, (alert) => {
      alerts.push(alert);
    });
    monitor.reset();
  });

  // --- Heart rate alerts ---

  it('returns null when HR and SpO2 are within safe limits', () => {
    const result = monitor.check(120, 95);

    expect(result).toBeNull();
    expect(alerts).toHaveLength(0);
  });

  it('fires a warning when HR exceeds max for 30 seconds', () => {
    // First call: HR above max, starts tracking
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(160, 95);

    // 30 seconds later: should trigger warning
    jest.spyOn(Date, 'now').mockReturnValue(31_000);
    const result = monitor.check(160, 95);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('warning');
    expect(result!.action).toBe('slow_down');
    expect(alerts.length).toBeGreaterThanOrEqual(1);

    jest.restoreAllMocks();
  });

  it('fires a critical alert when HR exceeds max for 60 seconds', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(160, 95);

    jest.spyOn(Date, 'now').mockReturnValue(61_000);
    const result = monitor.check(160, 95);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('critical');
    expect(result!.action).toBe('pause');

    jest.restoreAllMocks();
  });

  it('fires an emergency alert when HR exceeds max for 120 seconds', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(160, 95);

    jest.spyOn(Date, 'now').mockReturnValue(121_000);
    const result = monitor.check(160, 95);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('emergency');
    expect(result!.action).toBe('emergency');

    jest.restoreAllMocks();
  });

  it('resets HR tracking when heart rate returns to safe range', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(160, 95);

    // HR returns to normal
    jest.spyOn(Date, 'now').mockReturnValue(20_000);
    monitor.check(120, 95);

    // HR goes high again -- timer should restart from 0
    jest.spyOn(Date, 'now').mockReturnValue(30_000);
    monitor.check(160, 95);

    // Only 20s since re-exceeded, should NOT trigger yet (needs 30s)
    jest.spyOn(Date, 'now').mockReturnValue(50_000);
    const result = monitor.check(160, 95);

    // 50000 - 30000 = 20s, no alert yet for HR (below 30s)
    // No SpO2 issues either
    expect(result).toBeNull();

    jest.restoreAllMocks();
  });

  // --- SpO2 alerts ---

  it('fires a warning when SpO2 drops below min for 60 seconds', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(120, 85);

    jest.spyOn(Date, 'now').mockReturnValue(61_000);
    const result = monitor.check(120, 85);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('warning');
    expect(result!.action).toBe('slow_down');

    jest.restoreAllMocks();
  });

  it('fires a critical alert when SpO2 drops below min for 120 seconds', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(120, 85);

    jest.spyOn(Date, 'now').mockReturnValue(121_000);
    const result = monitor.check(120, 85);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('critical');
    expect(result!.action).toBe('pause');

    jest.restoreAllMocks();
  });

  it('fires an immediate emergency when SpO2 drops below 80%', () => {
    const result = monitor.check(120, 75);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('emergency');
    expect(result!.action).toBe('emergency');
    expect(result!.message).toContain('EMERGENCY');
  });

  it('resets SpO2 tracking when SpO2 returns to safe range', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(120, 85);

    // SpO2 returns to normal
    jest.spyOn(Date, 'now').mockReturnValue(30_000);
    monitor.check(120, 95);

    // SpO2 drops again -- timer should restart
    jest.spyOn(Date, 'now').mockReturnValue(40_000);
    monitor.check(120, 85);

    // Only 20s since re-dropped, should NOT trigger yet (needs 60s)
    jest.spyOn(Date, 'now').mockReturnValue(60_000);
    const result = monitor.check(120, 85);

    // 60000 - 40000 = 20s, no SpO2 alert yet
    expect(result).toBeNull();

    jest.restoreAllMocks();
  });

  // --- Check-in functionality ---

  it('needs check-in after 5 minutes', () => {
    jest.spyOn(Date, 'now').mockReturnValue(0);
    monitor.reset(); // sets lastCheckIn to 0

    jest.spyOn(Date, 'now').mockReturnValue(5 * 60 * 1000);
    expect(monitor.needsCheckIn()).toBe(true);

    jest.restoreAllMocks();
  });

  it('does not need check-in right after confirming', () => {
    jest.spyOn(Date, 'now').mockReturnValue(10_000);
    monitor.confirmCheckIn();

    jest.spyOn(Date, 'now').mockReturnValue(10_001);
    expect(monitor.needsCheckIn()).toBe(false);

    jest.restoreAllMocks();
  });

  it('reset clears all tracking state', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(160, 85); // start tracking both thresholds

    jest.spyOn(Date, 'now').mockReturnValue(2000);
    monitor.reset();

    // After reset, checking high HR should start fresh
    jest.spyOn(Date, 'now').mockReturnValue(3000);
    monitor.check(160, 95);

    // Only 27s (30000 - 3000 = 27s), should not trigger
    jest.spyOn(Date, 'now').mockReturnValue(30_000);
    const result = monitor.check(160, 95);

    // 30000 - 3000 = 27s, below 30s threshold
    expect(result).toBeNull();

    jest.restoreAllMocks();
  });

  // --- Combined scenario ---

  it('returns most severe alert when both HR and SpO2 are exceeded', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    monitor.check(160, 85); // both start tracking

    // After 65 seconds: HR critical (60s), SpO2 warning (60s)
    jest.spyOn(Date, 'now').mockReturnValue(66_000);
    const result = monitor.check(160, 85);

    expect(result).not.toBeNull();
    // HR critical should be the most severe returned
    expect(result!.type).toBe('critical');
    expect(result!.action).toBe('pause');
    // Both alerts should have been fired via callback
    expect(alerts.length).toBeGreaterThanOrEqual(2);

    jest.restoreAllMocks();
  });
});
