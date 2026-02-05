export interface SafetyAlert {
  type: 'warning' | 'critical' | 'emergency';
  message: string;
  messageDutch: string;
  action: 'slow_down' | 'pause' | 'stop' | 'emergency';
  timestamp: number;
}

/**
 * Real-time safety monitoring during transformative breathwork sessions.
 *
 * Monitors heart rate and SpO2 against configurable thresholds and fires
 * escalating alerts when limits are exceeded for sustained durations:
 *
 * - Heart rate above max for 30s: warning (slow down)
 * - Heart rate above max for 60s: critical (pause)
 * - Heart rate above max for 120s: emergency (stop)
 *
 * - SpO2 below min for 60s: warning (slow down)
 * - SpO2 below min for 120s: critical (pause)
 * - SpO2 below 80%: immediate emergency regardless of duration
 *
 * Also requires periodic check-ins (every 5 minutes) to confirm the
 * user is conscious and responsive.
 */
export class BiometricSafetyMonitor {
  private maxHR: number;
  private minSpO2: number;
  private hrExceedStart: number | null = null;
  private spo2BelowStart: number | null = null;
  private lastCheckIn: number = 0;
  private checkInInterval: number = 5 * 60 * 1000; // 5 minutes
  private onAlert: (alert: SafetyAlert) => void;

  constructor(
    maxHR: number,
    minSpO2: number,
    onAlert: (alert: SafetyAlert) => void,
  ) {
    this.maxHR = maxHR;
    this.minSpO2 = minSpO2;
    this.onAlert = onAlert;
  }

  /**
   * Check biometric readings and fire alerts if thresholds are exceeded.
   * Returns the most severe alert generated, or null if all readings are safe.
   */
  check(hr: number, spo2: number): SafetyAlert | null {
    const now = Date.now();
    let mostSevereAlert: SafetyAlert | null = null;

    // --- SpO2 checks ---

    // Immediate emergency if SpO2 drops below 80%
    if (spo2 < 80) {
      const alert: SafetyAlert = {
        type: 'emergency',
        message:
          'EMERGENCY: Blood oxygen critically low! Stop immediately and breathe normally.',
        messageDutch:
          'NOODGEVAL: Bloedzuurstof kritiek laag! Stop onmiddellijk en adem normaal.',
        action: 'emergency',
        timestamp: now,
      };
      this.onAlert(alert);
      return alert;
    }

    // SpO2 below minimum threshold tracking
    if (spo2 < this.minSpO2) {
      if (this.spo2BelowStart === null) {
        this.spo2BelowStart = now;
      }

      const spo2Duration = now - this.spo2BelowStart;

      if (spo2Duration >= 120_000) {
        // 2 minutes: critical
        const alert: SafetyAlert = {
          type: 'critical',
          message:
            'Blood oxygen has been low for over 2 minutes. Please pause and recover.',
          messageDutch:
            'Bloedzuurstof is al meer dan 2 minuten laag. Pauzeer en herstel alstublieft.',
          action: 'pause',
          timestamp: now,
        };
        this.onAlert(alert);
        mostSevereAlert = alert;
      } else if (spo2Duration >= 60_000) {
        // 1 minute: warning
        const alert: SafetyAlert = {
          type: 'warning',
          message:
            'Blood oxygen is below optimal. Consider slowing your breathing.',
          messageDutch:
            'Bloedzuurstof is onder optimaal. Overweeg uw ademhaling te vertragen.',
          action: 'slow_down',
          timestamp: now,
        };
        this.onAlert(alert);
        if (!mostSevereAlert) {
          mostSevereAlert = alert;
        }
      }
    } else {
      // SpO2 has returned to safe range
      this.spo2BelowStart = null;
    }

    // --- Heart rate checks ---

    if (hr > this.maxHR) {
      if (this.hrExceedStart === null) {
        this.hrExceedStart = now;
      }

      const hrDuration = now - this.hrExceedStart;

      if (hrDuration >= 120_000) {
        // 2 minutes: emergency
        const alert: SafetyAlert = {
          type: 'emergency',
          message:
            'EMERGENCY: Heart rate has been dangerously high for over 2 minutes. Stop immediately.',
          messageDutch:
            'NOODGEVAL: Hartslag is al meer dan 2 minuten gevaarlijk hoog. Stop onmiddellijk.',
          action: 'emergency',
          timestamp: now,
        };
        this.onAlert(alert);
        return alert; // Emergency always takes priority
      } else if (hrDuration >= 60_000) {
        // 1 minute: critical
        const alert: SafetyAlert = {
          type: 'critical',
          message:
            'Heart rate has been elevated for over 1 minute. Please pause the session.',
          messageDutch:
            'Hartslag is al meer dan 1 minuut verhoogd. Pauzeer de sessie alstublieft.',
          action: 'pause',
          timestamp: now,
        };
        this.onAlert(alert);
        // Critical HR overrides warning-level SpO2
        if (!mostSevereAlert || mostSevereAlert.type === 'warning') {
          mostSevereAlert = alert;
        }
      } else if (hrDuration >= 30_000) {
        // 30 seconds: warning
        const alert: SafetyAlert = {
          type: 'warning',
          message:
            'Heart rate is above your safe threshold. Consider slowing down.',
          messageDutch:
            'Hartslag is boven uw veilige drempel. Overweeg te vertragen.',
          action: 'slow_down',
          timestamp: now,
        };
        this.onAlert(alert);
        if (!mostSevereAlert) {
          mostSevereAlert = alert;
        }
      }
    } else {
      // HR has returned to safe range
      this.hrExceedStart = null;
    }

    return mostSevereAlert;
  }

  /**
   * Returns true if a periodic check-in is needed to confirm the user
   * is conscious and responsive. Check-ins are required every 5 minutes.
   */
  needsCheckIn(): boolean {
    const now = Date.now();
    return now - this.lastCheckIn >= this.checkInInterval;
  }

  /**
   * Record that the user has responded to a check-in prompt.
   */
  confirmCheckIn(): void {
    this.lastCheckIn = Date.now();
  }

  /**
   * Reset all tracking state. Should be called at the start of a new session.
   */
  reset(): void {
    this.hrExceedStart = null;
    this.spo2BelowStart = null;
    this.lastCheckIn = Date.now();
  }
}
