export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const KNOWLEDGE_TEST: QuizQuestion[] = [
  {
    id: 'ans_branches',
    question:
      'What are the two main branches of the Autonomic Nervous System?',
    options: [
      'Central and Peripheral',
      'Sympathetic and Parasympathetic',
      'Somatic and Autonomic',
      'Afferent and Efferent',
    ],
    correctIndex: 1,
    explanation:
      'The ANS consists of the sympathetic (fight-or-flight) and parasympathetic (rest-and-digest) branches, which work in balance to regulate involuntary body functions.',
  },
  {
    id: 'vagus_nerve',
    question: 'What is the primary role of the vagus nerve in breathwork?',
    options: [
      'It controls voluntary muscle movement',
      'It activates the sympathetic stress response',
      'It mediates the parasympathetic relaxation response',
      'It regulates blood sugar levels',
    ],
    correctIndex: 2,
    explanation:
      'The vagus nerve is the main pathway of the parasympathetic nervous system. Slow, deep breathing stimulates vagal tone, promoting relaxation and reducing stress.',
  },
  {
    id: 'hyperventilation',
    question: 'What happens physiologically during hyperventilation?',
    options: [
      'CO2 levels rise, causing relaxation',
      'CO2 levels drop, causing respiratory alkalosis and potential tingling or dizziness',
      'Oxygen levels drop to dangerous levels',
      'Heart rate decreases significantly',
    ],
    correctIndex: 1,
    explanation:
      'Hyperventilation rapidly expels CO2, raising blood pH (alkalosis). This can cause tingling, lightheadedness, and in extreme cases, tetany or loss of consciousness.',
  },
  {
    id: 'contraindications',
    question:
      'Which of the following is a serious contraindication for intensive breathwork?',
    options: [
      'Mild seasonal allergies',
      'Epilepsy or seizure disorders',
      'Occasional headaches',
      'Mild nearsightedness',
    ],
    correctIndex: 1,
    explanation:
      'Epilepsy is a serious contraindication because altered breathing patterns and blood chemistry changes can lower the seizure threshold, potentially triggering an episode.',
  },
  {
    id: 'spo2_safety',
    question: 'At what SpO2 level should a breathwork session be stopped?',
    options: [
      'Below 99%',
      'Below 95%',
      'Below 80%',
      'SpO2 monitoring is unnecessary',
    ],
    correctIndex: 2,
    explanation:
      'While temporary SpO2 dips during breath holds are expected, readings below 80% indicate dangerous hypoxemia requiring immediate return to normal breathing. Clinical concern typically begins below 90%.',
  },
  {
    id: 'exhale_effect',
    question:
      'Why does extending the exhale relative to the inhale promote relaxation?',
    options: [
      'It increases sympathetic activation',
      'It stimulates vagal tone and parasympathetic dominance',
      'It increases blood pressure',
      'It causes hyperventilation',
    ],
    correctIndex: 1,
    explanation:
      'Extended exhales activate the vagus nerve, increasing parasympathetic tone. The heart rate naturally slows during exhalation (respiratory sinus arrhythmia), deepening the relaxation response.',
  },
  {
    id: 'polyvagal_theory',
    question:
      'According to Polyvagal Theory, what are the three states of the nervous system?',
    options: [
      'Alpha, Beta, and Gamma',
      'Ventral vagal (safe), Sympathetic (mobilized), Dorsal vagal (shutdown)',
      'Conscious, Subconscious, and Unconscious',
      'Fight, Flight, and Freeze',
    ],
    correctIndex: 1,
    explanation:
      'Stephen Porges\' Polyvagal Theory describes three hierarchical states: ventral vagal (social engagement, safety), sympathetic (fight/flight mobilization), and dorsal vagal (freeze/shutdown). Breathwork can help navigate between these states.',
  },
  {
    id: 'hrv_meaning',
    question: 'What does high Heart Rate Variability (HRV) generally indicate?',
    options: [
      'Poor cardiovascular health and arrhythmia',
      'High stress and sympathetic dominance',
      'Good autonomic flexibility and resilience',
      'A need for immediate medical attention',
    ],
    correctIndex: 2,
    explanation:
      'Higher HRV indicates a healthy, adaptable autonomic nervous system that can efficiently switch between sympathetic and parasympathetic states. Regular breathwork practice tends to improve HRV over time.',
  },
  {
    id: 'safe_environment',
    question:
      'Why should intensive breathwork never be practiced while driving or in water?',
    options: [
      'It is simply a tradition, not a safety concern',
      'Altered states, dizziness, or loss of motor control can cause accidents or drowning',
      'The breathing patterns only work indoors',
      'Water temperature affects breathing rhythm',
    ],
    correctIndex: 1,
    explanation:
      'Intensive breathwork can cause dizziness, altered consciousness, temporary loss of motor control, or even brief loss of consciousness. Performing these practices while driving or in water creates an immediate life-threatening risk.',
  },
  {
    id: 'progressive_overload',
    question:
      'Why does PNEUMA use a progressive access system for advanced breathing techniques?',
    options: [
      'To sell more premium subscriptions',
      'To ensure users build physiological adaptation and safety knowledge before attempting intense practices',
      'Advanced techniques are less effective than basic ones',
      'There is no real reason; all techniques are equally safe',
    ],
    correctIndex: 1,
    explanation:
      'Progressive access ensures that users develop proper technique, physiological tolerance, and safety awareness gradually. Jumping directly to advanced practices without preparation can cause adverse reactions including panic, severe dizziness, or dangerous hypoxemia.',
  },
];

export const PASS_THRESHOLD = 0.8; // 8 out of 10

/**
 * Evaluates a completed knowledge test.
 *
 * @param answers A record mapping question IDs to the selected option index (0-based).
 * @returns An object indicating pass/fail, score, and which questions were answered incorrectly.
 */
export function evaluateTest(
  answers: Record<string, number>,
): {
  passed: boolean;
  score: number;
  totalQuestions: number;
  incorrectIds: string[];
} {
  const totalQuestions = KNOWLEDGE_TEST.length;
  const incorrectIds: string[] = [];
  let correctCount = 0;

  for (const question of KNOWLEDGE_TEST) {
    const selectedIndex = answers[question.id];

    if (selectedIndex === question.correctIndex) {
      correctCount++;
    } else {
      incorrectIds.push(question.id);
    }
  }

  const score = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  return {
    passed: score >= PASS_THRESHOLD,
    score,
    totalQuestions,
    incorrectIds,
  };
}
