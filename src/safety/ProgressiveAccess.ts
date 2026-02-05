import { AccessLevel } from '../types/breath';

export interface AccessRequirements {
  level: AccessLevel;
  minSessions: number;
  minHours: number;
  requiresKnowledgeTest: boolean;
  requiresMedicalClearance: boolean;
  requiresInformedConsent: boolean;
  requiresEmergencyContact: boolean;
}

export const ACCESS_LEVELS: Record<AccessLevel, AccessRequirements> = {
  1: {
    level: 1,
    minSessions: 0,
    minHours: 0,
    requiresKnowledgeTest: false,
    requiresMedicalClearance: false,
    requiresInformedConsent: false,
    requiresEmergencyContact: false,
  },
  2: {
    level: 2,
    minSessions: 10,
    minHours: 3,
    requiresKnowledgeTest: true,
    requiresMedicalClearance: false,
    requiresInformedConsent: false,
    requiresEmergencyContact: false,
  },
  3: {
    level: 3,
    minSessions: 30,
    minHours: 15,
    requiresKnowledgeTest: true,
    requiresMedicalClearance: false,
    requiresInformedConsent: false,
    requiresEmergencyContact: false,
  },
  4: {
    level: 4,
    minSessions: 50,
    minHours: 50,
    requiresKnowledgeTest: true,
    requiresMedicalClearance: true,
    requiresInformedConsent: true,
    requiresEmergencyContact: true,
  },
};

export interface AccessCheckResult {
  granted: boolean;
  currentLevel: AccessLevel;
  requiredLevel: AccessLevel;
  missingRequirements: string[];
  progressToNextLevel: number; // 0-1
}

/**
 * Checks whether a user meets the requirements for accessing a given level.
 * Returns a detailed result including any missing requirements and progress
 * toward the next access level.
 */
export function checkAccess(
  userLevel: AccessLevel,
  requiredLevel: AccessLevel,
  totalSessions: number,
  totalHours: number,
  knowledgeTestPassed: boolean,
  medicalClearance: boolean,
  informedConsent: boolean,
  hasEmergencyContact: boolean,
): AccessCheckResult {
  const requirements = ACCESS_LEVELS[requiredLevel];
  const missingRequirements: string[] = [];

  // Check user level
  if (userLevel < requiredLevel) {
    missingRequirements.push(
      `Access level ${requiredLevel} required (current: ${userLevel})`,
    );
  }

  // Check session count
  if (totalSessions < requirements.minSessions) {
    missingRequirements.push(
      `${requirements.minSessions} sessions required (current: ${totalSessions})`,
    );
  }

  // Check total hours
  if (totalHours < requirements.minHours) {
    missingRequirements.push(
      `${requirements.minHours} hours of practice required (current: ${totalHours})`,
    );
  }

  // Check knowledge test
  if (requirements.requiresKnowledgeTest && !knowledgeTestPassed) {
    missingRequirements.push('Knowledge test must be passed');
  }

  // Check medical clearance
  if (requirements.requiresMedicalClearance && !medicalClearance) {
    missingRequirements.push('Medical clearance required');
  }

  // Check informed consent
  if (requirements.requiresInformedConsent && !informedConsent) {
    missingRequirements.push('Informed consent must be signed');
  }

  // Check emergency contact
  if (requirements.requiresEmergencyContact && !hasEmergencyContact) {
    missingRequirements.push('Emergency contact must be provided');
  }

  const granted = missingRequirements.length === 0;

  // Calculate progress toward next level from current level
  const { progress } = calculateLevelProgress(
    userLevel,
    totalSessions,
    totalHours,
  );

  return {
    granted,
    currentLevel: userLevel,
    requiredLevel,
    missingRequirements,
    progressToNextLevel: progress,
  };
}

/**
 * Calculates the user's progress toward the next access level based on their
 * session count and total hours. Returns how many more sessions and hours
 * are needed and an overall progress fraction (0-1).
 */
export function calculateLevelProgress(
  currentLevel: AccessLevel,
  totalSessions: number,
  totalHours: number,
): {
  nextLevel: AccessLevel | null;
  progress: number;
  sessionsNeeded: number;
  hoursNeeded: number;
} {
  // If the user is already at the maximum level, there is no next level
  if (currentLevel >= 4) {
    return {
      nextLevel: null,
      progress: 1,
      sessionsNeeded: 0,
      hoursNeeded: 0,
    };
  }

  const nextLevel = (currentLevel + 1) as AccessLevel;
  const nextRequirements = ACCESS_LEVELS[nextLevel];

  const sessionsNeeded = Math.max(
    0,
    nextRequirements.minSessions - totalSessions,
  );
  const hoursNeeded = Math.max(0, nextRequirements.minHours - totalHours);

  // Progress is the average of session progress and hours progress
  const sessionProgress =
    nextRequirements.minSessions > 0
      ? Math.min(1, totalSessions / nextRequirements.minSessions)
      : 1;
  const hoursProgress =
    nextRequirements.minHours > 0
      ? Math.min(1, totalHours / nextRequirements.minHours)
      : 1;

  const progress = (sessionProgress + hoursProgress) / 2;

  return {
    nextLevel,
    progress: Math.min(1, Math.max(0, progress)),
    sessionsNeeded,
    hoursNeeded,
  };
}
