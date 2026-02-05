export interface MedicalQuestion {
  id: string;
  question: string;
  questionDutch: string;
  isBlocker: boolean; // if answered 'yes', blocks L4 access
}

export const MEDICAL_QUESTIONS: MedicalQuestion[] = [
  {
    id: 'epilepsy',
    question: 'Have you been diagnosed with epilepsy or seizure disorders?',
    questionDutch:
      'Bent u gediagnosticeerd met epilepsie of aanvalsstoornissen?',
    isBlocker: true,
  },
  {
    id: 'cardiovascular',
    question: 'Do you have severe cardiovascular conditions?',
    questionDutch: 'Heeft u ernstige cardiovasculaire aandoeningen?',
    isBlocker: true,
  },
  {
    id: 'heart_attack',
    question: 'Have you had a heart attack or stroke in the last 6 months?',
    questionDutch:
      'Heeft u in de afgelopen 6 maanden een hartaanval of beroerte gehad?',
    isBlocker: true,
  },
  {
    id: 'hypertension',
    question: 'Do you have uncontrolled high blood pressure?',
    questionDutch: 'Heeft u ongecontroleerde hoge bloeddruk?',
    isBlocker: true,
  },
  {
    id: 'pregnancy',
    question: 'Are you currently pregnant?',
    questionDutch: 'Bent u momenteel zwanger?',
    isBlocker: true,
  },
  {
    id: 'psychosis',
    question: 'Have you experienced psychotic episodes?',
    questionDutch: 'Heeft u psychotische episodes ervaren?',
    isBlocker: true,
  },
  {
    id: 'asthma',
    question:
      'Do you have uncontrolled asthma (without medical approval)?',
    questionDutch:
      'Heeft u ongecontroleerde astma (zonder medische goedkeuring)?',
    isBlocker: true,
  },
  {
    id: 'retinal',
    question: 'Do you have retinal detachment or glaucoma?',
    questionDutch: 'Heeft u netvliesloslating of glaucoom?',
    isBlocker: true,
  },
  {
    id: 'surgery',
    question: 'Have you had recent surgery?',
    questionDutch: 'Heeft u recent een chirurgische ingreep gehad?',
    isBlocker: true,
  },
];

/**
 * Evaluates the medical screening questionnaire answers.
 * Any blocker question answered with `true` (yes) prevents medical clearance.
 * Returns the list of blocker condition IDs that were triggered.
 */
export function evaluateMedicalScreening(
  answers: Record<string, boolean>,
): {
  cleared: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];

  for (const question of MEDICAL_QUESTIONS) {
    if (question.isBlocker && answers[question.id] === true) {
      blockers.push(question.id);
    }
  }

  return {
    cleared: blockers.length === 0,
    blockers,
  };
}
