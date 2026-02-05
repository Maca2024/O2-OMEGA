import {
  BreathPattern,
  PatternCategory,
  AccessLevel,
} from '../types/breath';

// ---------------------------------------------------------------------------
// PNEUMA Complete Pattern Library -- 20 Breathing Patterns
// ---------------------------------------------------------------------------
// All phase durations are specified in milliseconds.
// `rounds` indicates the default number of full-cycle repetitions; 'infinite'
// means the session continues until the user stops it.
// `durationRange` is expressed in seconds (min/max recommended session length).
// ---------------------------------------------------------------------------

export const BREATH_PATTERNS: readonly BreathPattern[] = [
  // =========================================================================
  // 1 -- COHERENT BREATHING
  // =========================================================================
  {
    id: 'coherent-breathing',
    name: 'Coherent Breathing',
    nameDutch: 'Coherente Ademhaling',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 5500,
        instruction: 'Breathe in slowly through the nose',
        visualIntensity: 0.5,
      },
      {
        phase: 'exhale',
        duration: 5500,
        instruction: 'Breathe out gently through the nose',
        visualIntensity: 0.4,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 1,
    description:
      'Equal-ratio breathing at ~5.5 breaths per minute. Synchronises heart rate variability with the respiratory cycle for maximal coherence.',
    descriptionDutch:
      'Gelijkmatige ademhaling op ~5,5 ademhalingen per minuut. Synchroniseert hartslagvariabiliteit met de ademcyclus voor maximale coherentie.',
    scienceNote:
      'Research by Lehrer & Gevirtz (2014) shows 5.5 bpm breathing maximises baroreflex gain and HRV coherence, engaging the vagus nerve most efficiently.',
    bpm: 5.5,
    durationRange: { min: 180, max: 1200 },
    difficulty: 1,
    tags: ['beginner', 'hrv', 'vagus', 'calm', 'coherence', 'sleep'],
  },

  // =========================================================================
  // 2 -- 4-7-8 BREATHING
  // =========================================================================
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    nameDutch: '4-7-8 Ademhaling',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 4000,
        instruction: 'Inhale quietly through the nose',
        visualIntensity: 0.5,
      },
      {
        phase: 'holdIn',
        duration: 7000,
        instruction: 'Hold your breath gently',
        visualIntensity: 0.6,
      },
      {
        phase: 'exhale',
        duration: 8000,
        instruction: 'Exhale completely through the mouth with a whoosh',
        visualIntensity: 0.4,
      },
    ],
    rounds: 4,
    requiredLevel: 1,
    description:
      'Dr. Andrew Weil\'s relaxation technique. The 4-7-8 ratio naturally activates the parasympathetic nervous system and is particularly effective for falling asleep.',
    descriptionDutch:
      'De ontspanningstechniek van Dr. Andrew Weil. De 4-7-8 verhouding activeert het parasympathische zenuwstelsel en is bijzonder effectief om in slaap te vallen.',
    scienceNote:
      'The extended exhale and breath hold increase CO2 tolerance and shift autonomic balance toward parasympathetic dominance. Weil recommends limiting beginners to 4 cycles.',
    bpm: 3,
    durationRange: { min: 60, max: 300 },
    difficulty: 1,
    tags: ['beginner', 'sleep', 'anxiety', 'relaxation', 'parasympathetic'],
  },

  // =========================================================================
  // 3 -- BOX BREATHING
  // =========================================================================
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    nameDutch: 'Vierkante Ademhaling',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 4000,
        instruction: 'Inhale steadily through the nose',
        visualIntensity: 0.5,
      },
      {
        phase: 'holdIn',
        duration: 4000,
        instruction: 'Hold at the top',
        visualIntensity: 0.6,
      },
      {
        phase: 'exhale',
        duration: 4000,
        instruction: 'Exhale steadily through the nose',
        visualIntensity: 0.4,
      },
      {
        phase: 'holdOut',
        duration: 4000,
        instruction: 'Hold at the bottom',
        visualIntensity: 0.3,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 1,
    description:
      'Equal-ratio four-phase breathing used by Navy SEALs for focus and composure under pressure. Balances sympathetic and parasympathetic tone.',
    descriptionDutch:
      'Vierfasige ademhaling met gelijke verhoudingen, gebruikt door Navy SEALs voor focus en kalmte onder druk. Balanceert sympathische en parasympathische tonus.',
    scienceNote:
      'Box breathing has been shown to lower cortisol and improve sustained attention. The equal hold phases enhance interoceptive awareness and CO2 tolerance.',
    bpm: 3.75,
    durationRange: { min: 180, max: 600 },
    difficulty: 1,
    tags: ['beginner', 'focus', 'stress', 'military', 'balanced', 'performance'],
  },

  // =========================================================================
  // 4 -- DIAPHRAGMATIC BREATHING
  // =========================================================================
  {
    id: 'diaphragmatic-breathing',
    name: 'Diaphragmatic Breathing',
    nameDutch: 'Diafragmatische Ademhaling',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 4000,
        instruction: 'Inhale deeply into the belly, let the diaphragm descend',
        visualIntensity: 0.5,
      },
      {
        phase: 'exhale',
        duration: 6000,
        instruction: 'Exhale slowly, letting the belly fall naturally',
        visualIntensity: 0.3,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 1,
    description:
      'Foundation breathing technique. Slow, deep belly breathing that engages the diaphragm fully, promoting vagal tone and gas exchange efficiency.',
    descriptionDutch:
      'Basisademhalingstechniek. Langzame, diepe buikademhaling die het diafragma volledig inschakelt voor betere vagale tonus en gasuitwisseling.',
    scienceNote:
      'Diaphragmatic breathing stimulates stretch receptors in the lungs that trigger the parasympathetic response via the vagus nerve. Ma et al. (2017) showed significant cortisol reduction.',
    bpm: 6,
    durationRange: { min: 120, max: 900 },
    difficulty: 1,
    tags: ['beginner', 'foundation', 'belly', 'vagus', 'stress-relief'],
  },

  // =========================================================================
  // 5 -- NADI SHODHANA (Alternate Nostril)
  // =========================================================================
  {
    id: 'nadi-shodhana',
    name: 'Nadi Shodhana',
    nameDutch: 'Nadi Shodhana',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 4000,
        instruction: 'Inhale through the left nostril',
        visualIntensity: 0.5,
      },
      {
        phase: 'holdIn',
        duration: 4000,
        instruction: 'Hold gently, switch fingers',
        visualIntensity: 0.5,
      },
      {
        phase: 'exhale',
        duration: 4000,
        instruction: 'Exhale through the right nostril',
        visualIntensity: 0.4,
      },
      {
        phase: 'holdOut',
        duration: 4000,
        instruction: 'Pause briefly, keep right nostril open',
        visualIntensity: 0.3,
      },
    ],
    rounds: 10,
    requiredLevel: 2,
    description:
      'Alternate nostril breathing from the yogic tradition. Balances left and right hemispheres and calms the nervous system. Each round alternates the starting nostril.',
    descriptionDutch:
      'Afwisselende neusgat-ademhaling uit de yogische traditie. Balanceert linker- en rechterhersenhelft en kalmeert het zenuwstelsel.',
    scienceNote:
      'Studies show Nadi Shodhana reduces sympathetic activity and improves cardiovascular function. Telles et al. (2013) demonstrated improved spatial memory scores after practice.',
    bpm: 3.75,
    durationRange: { min: 180, max: 900 },
    difficulty: 2,
    tags: ['yoga', 'balance', 'hemispheric', 'focus', 'calm'],
  },

  // =========================================================================
  // 6 -- EXTENDED EXHALE
  // =========================================================================
  {
    id: 'extended-exhale',
    name: 'Extended Exhale',
    nameDutch: 'Verlengde Uitademing',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 4000,
        instruction: 'Inhale comfortably through the nose',
        visualIntensity: 0.5,
      },
      {
        phase: 'exhale',
        duration: 8000,
        instruction: 'Exhale slowly and completely, twice as long as the inhale',
        visualIntensity: 0.3,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 1,
    description:
      'Simple yet powerful: an exhale twice the length of the inhale maximises parasympathetic activation. Ideal for acute stress and pre-sleep wind-down.',
    descriptionDutch:
      'Eenvoudig maar krachtig: een uitademing twee keer zo lang als de inademing maximaliseert parasympathische activatie. Ideaal voor acute stress en voor het slapen.',
    scienceNote:
      'The extended exhale phase lengthens the cardiac vagal period, directly lowering heart rate. Balban et al. (2023) found cyclic sighing with extended exhale superior to meditation for mood.',
    bpm: 5,
    durationRange: { min: 120, max: 600 },
    difficulty: 1,
    tags: ['beginner', 'parasympathetic', 'sleep', 'stress', 'simple'],
  },

  // =========================================================================
  // 7 -- BREATH OF FIRE (Kapalabhati)
  // =========================================================================
  {
    id: 'breath-of-fire',
    name: 'Breath of Fire',
    nameDutch: 'Vuuradem',
    category: 'sympathetic',
    phases: [
      {
        phase: 'exhale',
        duration: 500,
        instruction: 'Sharp forceful exhale through the nose, pump the navel',
        visualIntensity: 0.9,
      },
      {
        phase: 'inhale',
        duration: 500,
        instruction: 'Passive inhale, let the belly relax',
        visualIntensity: 0.4,
      },
    ],
    rounds: 30,
    requiredLevel: 2,
    description:
      'Rapid rhythmic diaphragmatic pumping from Kundalini yoga. Energises the body, clears the nasal passages, and increases alertness through controlled hyperventilation.',
    descriptionDutch:
      'Snel ritmisch diafragmatisch pompen uit Kundalini yoga. Geeft energie, maakt de neusholtes vrij en verhoogt de alertheid door gecontroleerde hyperventilatie.',
    scienceNote:
      'Kapalabhati increases sympathetic neural activity and blood oxygen saturation acutely. EEG studies show increased beta-wave activity, correlated with alertness.',
    bpm: 60,
    durationRange: { min: 60, max: 300 },
    difficulty: 2,
    tags: ['energy', 'kundalini', 'yoga', 'activating', 'cleansing'],
  },

  // =========================================================================
  // 8 -- WIM HOF METHOD
  // =========================================================================
  {
    id: 'wim-hof-method',
    name: 'Wim Hof Method',
    nameDutch: 'Wim Hof Methode',
    category: 'sympathetic',
    phases: [
      // Phase 1: 30 power breaths (represented as a single rapid cycle; engine repeats)
      {
        phase: 'inhale',
        duration: 1500,
        instruction: 'Deep powerful inhale through the mouth, fill chest and belly',
        visualIntensity: 0.8,
      },
      {
        phase: 'exhale',
        duration: 1000,
        instruction: 'Let the air go passively, do not force it out',
        visualIntensity: 0.5,
      },
    ],
    rounds: 30,
    requiredLevel: 3,
    description:
      'The Wim Hof Method: 30 deep power breaths followed by a breath retention on empty lungs and a recovery breath. Profoundly shifts blood chemistry and autonomic state.',
    descriptionDutch:
      'De Wim Hof Methode: 30 diepe krachtige ademhalingen gevolgd door ademretentie op lege longen en een hersteladem. Verschuift de bloedchemie en autonome toestand diepgaand.',
    scienceNote:
      'Kox et al. (2014) showed WHM practitioners could voluntarily influence their innate immune response. The controlled hyperventilation raises blood pH and suppresses pro-inflammatory cytokines.',
    bpm: null,
    durationRange: { min: 300, max: 1800 },
    difficulty: 3,
    tags: ['advanced', 'cold-exposure', 'immune', 'retention', 'performance', 'dutch'],
  },

  // =========================================================================
  // 9 -- BHASTRIKA (Bellows Breath)
  // =========================================================================
  {
    id: 'bhastrika',
    name: 'Bhastrika',
    nameDutch: 'Bhastrika',
    category: 'sympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 1000,
        instruction: 'Forceful inhale through the nose, expand the chest',
        visualIntensity: 0.8,
      },
      {
        phase: 'exhale',
        duration: 1000,
        instruction: 'Forceful exhale through the nose, contract the abdomen',
        visualIntensity: 0.8,
      },
    ],
    rounds: 20,
    requiredLevel: 2,
    description:
      'Bellows breath: equal, forceful inhales and exhales that rapidly increase oxygen intake and metabolic heat. More vigorous than Kapalabhati with active inhales.',
    descriptionDutch:
      'Blaasbalg-adem: gelijkmatige, krachtige in- en uitademingen die snel de zuurstofopname en metabole warmte verhogen. Krachtiger dan Kapalabhati met actieve inademingen.',
    scienceNote:
      'Bhastrika activates both sympathetic arousal and parasympathetic rebound. Practising for 5 minutes increases EEG beta power and peripheral skin temperature.',
    bpm: 30,
    durationRange: { min: 60, max: 300 },
    difficulty: 2,
    tags: ['energy', 'yoga', 'heat', 'activating', 'pranayama'],
  },

  // =========================================================================
  // 10 -- TUMMO (Inner Fire)
  // =========================================================================
  {
    id: 'tummo',
    name: 'Tummo',
    nameDutch: 'Tummo',
    category: 'sympathetic',
    phases: [
      // Vase breathing phase: deep inhale with bandha engagement
      {
        phase: 'inhale',
        duration: 4000,
        instruction: 'Inhale deeply, visualise fire at the navel center',
        visualIntensity: 0.7,
      },
      {
        phase: 'holdIn',
        duration: 8000,
        instruction: 'Hold and engage root lock (mula bandha), feel inner heat rise',
        visualIntensity: 1.0,
      },
      {
        phase: 'exhale',
        duration: 4000,
        instruction: 'Exhale slowly, release bandhas, radiate warmth outward',
        visualIntensity: 0.6,
      },
      {
        phase: 'holdOut',
        duration: 2000,
        instruction: 'Rest in the warmth before the next breath',
        visualIntensity: 0.4,
      },
    ],
    rounds: 10,
    requiredLevel: 3,
    description:
      'Tibetan inner-fire meditation. Combines vase breathing with bandhas and visualisation to generate measurable body heat. Requires prior pranayama experience.',
    descriptionDutch:
      'Tibetaanse innerlijke-vuur meditatie. Combineert vaasademhaling met bandha\'s en visualisatie om meetbare lichaamswarmte te genereren. Vereist eerdere pranayama-ervaring.',
    scienceNote:
      'Kozhevnikov et al. (2013) documented Tummo practitioners raising core body temperature by up to 1.5 degrees C. The technique combines somatic, cognitive, and autonomic mechanisms.',
    bpm: null,
    durationRange: { min: 300, max: 1800 },
    difficulty: 3,
    tags: ['advanced', 'tibetan', 'heat', 'meditation', 'bandha', 'visualisation'],
  },

  // =========================================================================
  // 11 -- BUTEYKO BASIC (Reduced Breathing)
  // =========================================================================
  {
    id: 'buteyko-basic',
    name: 'Buteyko Basic',
    nameDutch: 'Buteyko Basis',
    category: 'clinical',
    phases: [
      {
        phase: 'inhale',
        duration: 3000,
        instruction: 'Small, gentle inhale through the nose -- less than you want',
        visualIntensity: 0.3,
      },
      {
        phase: 'exhale',
        duration: 4000,
        instruction: 'Relaxed exhale through the nose, do not empty fully',
        visualIntensity: 0.2,
      },
      {
        phase: 'holdOut',
        duration: 5000,
        instruction: 'Comfortable pause -- feel gentle air hunger',
        visualIntensity: 0.4,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 1,
    description:
      'Core Buteyko technique: deliberately reduce breathing volume to normalise CO2 levels. Builds CO2 tolerance and restores nasal breathing reflexes.',
    descriptionDutch:
      'Basis Buteyko-techniek: bewust het ademvolume verlagen om CO2-niveaus te normaliseren. Bouwt CO2-tolerantie op en herstelt neusademhalingsreflexen.',
    scienceNote:
      'Buteyko breathing has strong evidence for asthma management (Bruton & Lewith, 2005). Raising alveolar CO2 improves oxygen delivery via the Bohr effect and dilates smooth muscle.',
    bpm: 5,
    durationRange: { min: 300, max: 1200 },
    difficulty: 1,
    tags: ['clinical', 'asthma', 'nasal', 'co2-tolerance', 'reduced-breathing'],
  },

  // =========================================================================
  // 12 -- BUTEYKO WALK
  // =========================================================================
  {
    id: 'buteyko-walk',
    name: 'Buteyko Walk',
    nameDutch: 'Buteyko Wandeling',
    category: 'clinical',
    phases: [
      {
        phase: 'inhale',
        duration: 3000,
        instruction: 'Small nasal inhale while standing still',
        visualIntensity: 0.3,
      },
      {
        phase: 'exhale',
        duration: 3000,
        instruction: 'Gentle nasal exhale',
        visualIntensity: 0.2,
      },
      {
        phase: 'holdOut',
        duration: 15000,
        instruction: 'Pinch nose and walk at a normal pace -- count your steps',
        visualIntensity: 0.7,
      },
      {
        phase: 'inhale',
        duration: 3000,
        instruction: 'Resume gentle nasal breathing, recover',
        visualIntensity: 0.3,
      },
      {
        phase: 'exhale',
        duration: 4000,
        instruction: 'Calm exhale, let breathing normalise',
        visualIntensity: 0.2,
      },
    ],
    rounds: 6,
    requiredLevel: 2,
    description:
      'Buteyko breath-hold walking exercise. Walk with held breath to build CO2 tolerance under mild metabolic demand. Track your control pause progress over time.',
    descriptionDutch:
      'Buteyko adempauzewandeling. Loop met ingehouden adem om CO2-tolerantie op te bouwen onder lichte metabole belasting. Volg je controlepauze-voortgang.',
    scienceNote:
      'Walking during breath holds amplifies CO2 accumulation and challenges the chemoreceptor setpoint, accelerating Buteyko adaptation. Validated in COPD rehabilitation protocols.',
    bpm: null,
    durationRange: { min: 300, max: 900 },
    difficulty: 2,
    tags: ['clinical', 'walking', 'co2-tolerance', 'exercise', 'buteyko'],
  },

  // =========================================================================
  // 13 -- BUTEYKO SLEEP (Reduced Side-Lying)
  // =========================================================================
  {
    id: 'buteyko-sleep',
    name: 'Buteyko Sleep',
    nameDutch: 'Buteyko Slaap',
    category: 'clinical',
    phases: [
      {
        phase: 'inhale',
        duration: 3000,
        instruction: 'Lie on your left side, tiny soft inhale through the nose',
        visualIntensity: 0.2,
      },
      {
        phase: 'exhale',
        duration: 5000,
        instruction: 'Slow, barely-there exhale, let the body sink into the bed',
        visualIntensity: 0.1,
      },
      {
        phase: 'holdOut',
        duration: 4000,
        instruction: 'Allow a natural pause, relax all muscles',
        visualIntensity: 0.2,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 1,
    description:
      'Buteyko sleep protocol: ultra-reduced breathing while lying on the left side to promote nasal breathing, raise CO2, and ease the transition into sleep.',
    descriptionDutch:
      'Buteyko-slaapprotocol: ultra-gereduceerde ademhaling terwijl u op uw linkerzijde ligt om neusademhaling te bevorderen, CO2 te verhogen en het inslapen te vergemakkelijken.',
    scienceNote:
      'Left-side lying reduces cardiac compression and improves vagal tone. Combined with reduced breathing, this lowers arousal thresholds and shortens sleep onset latency.',
    bpm: 5,
    durationRange: { min: 300, max: 1800 },
    difficulty: 1,
    tags: ['clinical', 'sleep', 'insomnia', 'nasal', 'buteyko', 'gentle'],
  },

  // =========================================================================
  // 14 -- HOLOTROPIC BREATHWORK
  // =========================================================================
  {
    id: 'holotropic-breathwork',
    name: 'Holotropic Breathwork',
    nameDutch: 'Holotrope Ademhaling',
    category: 'transformative',
    phases: [
      {
        phase: 'inhale',
        duration: 1200,
        instruction: 'Deep connected inhale through the mouth, no pause',
        visualIntensity: 0.8,
      },
      {
        phase: 'exhale',
        duration: 1200,
        instruction: 'Full exhale immediately, keep the breath circular and connected',
        visualIntensity: 0.7,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 3,
    description:
      'Developed by Stanislav Grof. Sustained connected breathing at 25-30 bpm combined with evocative music to access non-ordinary states of consciousness. Requires a sitter.',
    descriptionDutch:
      'Ontwikkeld door Stanislav Grof. Aanhoudende verbonden ademhaling op 25-30 per minuut gecombineerd met muziek om niet-alledaagse bewustzijnstoestanden te bereiken. Vereist een begeleider.',
    scienceNote:
      'Prolonged hyperventilation reduces cerebral blood flow through hypocapnia while maintaining oxygenation, producing altered states. Rhinewine & Williams (2007) documented therapeutic outcomes.',
    bpm: 25,
    durationRange: { min: 1800, max: 10800 },
    difficulty: 3,
    tags: ['transformative', 'grof', 'connected', 'non-ordinary', 'therapeutic'],
    safetyWarning:
      'Holotropic breathwork can produce intense physical and emotional experiences including tetany, altered consciousness, and emotional catharsis. Must be practised with a trained facilitator. Contraindicated for cardiovascular disease, epilepsy, pregnancy, and severe psychiatric conditions.',
    biometricThresholds: {
      maxHR: 170,
      minSpO2: 88,
    },
  },

  // =========================================================================
  // 15 -- DMT ACTIVATION PROTOCOL
  // =========================================================================
  {
    id: 'dmt-activation',
    name: 'DMT Activation Protocol',
    nameDutch: 'DMT-activatieprotocol',
    category: 'transformative',
    phases: [
      // Phase 1: Hyperventilation ramp-up
      {
        phase: 'inhale',
        duration: 1000,
        instruction: 'Rapid deep inhale through the mouth, fill completely',
        visualIntensity: 0.9,
      },
      {
        phase: 'exhale',
        duration: 800,
        instruction: 'Forceful sharp exhale, maintain rhythm',
        visualIntensity: 0.8,
      },
      // Phase 2: Apneic hold on empty lungs
      {
        phase: 'inhale',
        duration: 1500,
        instruction: 'One final deep inhale, fill every cell',
        visualIntensity: 1.0,
      },
      {
        phase: 'holdIn',
        duration: 20000,
        instruction: 'Hold at the top, squeeze root lock and throat lock, direct energy to the third eye',
        visualIntensity: 1.0,
      },
      // Phase 3: Release and recovery
      {
        phase: 'exhale',
        duration: 5000,
        instruction: 'Slow release, surrender completely',
        visualIntensity: 0.5,
      },
      {
        phase: 'free',
        duration: 15000,
        instruction: 'Rest in stillness, observe any visions or sensations',
        visualIntensity: 0.2,
      },
    ],
    rounds: 5,
    requiredLevel: 4,
    description:
      'Advanced multi-phase protocol combining rapid breathing, extended retention with bandhas, and deep rest. Designed to produce endogenous neurochemical shifts. Maximum supervision required.',
    descriptionDutch:
      'Geavanceerd meerfasenprotocol dat snelle ademhaling, verlengde retentie met bandha\'s en diepe rust combineert. Ontworpen om endogene neurochemische verschuivingen te produceren. Maximaal toezicht vereist.',
    scienceNote:
      'The combination of respiratory alkalosis, extended apnea, and interoceptive focus may stimulate endogenous tryptamine pathways. Strassman (2001) hypothesised pineal involvement. Rigorous clinical evidence remains limited.',
    bpm: null,
    durationRange: { min: 1200, max: 3600 },
    difficulty: 4,
    tags: ['transformative', 'advanced', 'pineal', 'visionary', 'bandha', 'extreme'],
    safetyWarning:
      'This is the most intense protocol in the library. Risk of syncope, severe tetany, dissociation, and overwhelming psychological experiences. Must only be practised lying down with a trained sitter. Absolutely contraindicated for heart conditions, seizure disorders, pregnancy, psychosis history, or unmedicated psychiatric conditions.',
    biometricThresholds: {
      maxHR: 180,
      minSpO2: 85,
    },
  },

  // =========================================================================
  // 16 -- SHAMANIC BREATHWORK
  // =========================================================================
  {
    id: 'shamanic-breathwork',
    name: 'Shamanic Breathwork',
    nameDutch: 'Sjamanistische Ademhaling',
    category: 'transformative',
    phases: [
      {
        phase: 'inhale',
        duration: 1500,
        instruction: 'Circular inhale through the mouth, connect to the drum rhythm',
        visualIntensity: 0.8,
      },
      {
        phase: 'exhale',
        duration: 1500,
        instruction: 'Circular exhale, no pause, let sound carry the breath',
        visualIntensity: 0.7,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 3,
    description:
      'Circular connected breathing synchronised with rhythmic drumming or music. Used to journey inward, access somatic memories, and facilitate emotional release.',
    descriptionDutch:
      'Circulaire verbonden ademhaling gesynchroniseerd met ritmisch drummen of muziek. Gebruikt om naar binnen te reizen, somatische herinneringen te bereiken en emotionele loslating te faciliteren.',
    scienceNote:
      'Rhythmic breathing combined with auditory driving (drumming at 4-4.5 Hz) can entrain theta-wave EEG patterns associated with hypnagogic states and deep meditation.',
    bpm: null,
    durationRange: { min: 1200, max: 7200 },
    difficulty: 3,
    tags: ['transformative', 'shamanic', 'drumming', 'journey', 'somatic'],
    safetyWarning:
      'May produce intense emotional release, involuntary movements, or altered states. Practise with a facilitator experienced in shamanic breathwork. Contraindicated for cardiovascular disease, epilepsy, and severe psychiatric conditions.',
  },

  // =========================================================================
  // 17 -- REBIRTHING
  // =========================================================================
  {
    id: 'rebirthing',
    name: 'Rebirthing',
    nameDutch: 'Rebirthing',
    category: 'transformative',
    phases: [
      {
        phase: 'inhale',
        duration: 2000,
        instruction: 'Gentle connected inhale through the nose or mouth, like sipping air',
        visualIntensity: 0.5,
      },
      {
        phase: 'exhale',
        duration: 2000,
        instruction: 'Relaxed release, let gravity empty the lungs, no effort',
        visualIntensity: 0.3,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 3,
    description:
      'Developed by Leonard Orr. Gentle connected breathing with no pauses between inhale and exhale. Emphasises relaxation and surrender to access pre-verbal memories.',
    descriptionDutch:
      'Ontwikkeld door Leonard Orr. Zachte verbonden ademhaling zonder pauzes tussen in- en uitademing. Legt de nadruk op ontspanning en overgave om pre-verbale herinneringen te bereiken.',
    scienceNote:
      'Connected breathing techniques maintain mildly elevated respiratory rate, gradually shifting CO2/O2 balance. The relaxation emphasis distinguishes it from more intense hyperventilation protocols.',
    bpm: null,
    durationRange: { min: 1800, max: 5400 },
    difficulty: 3,
    tags: ['transformative', 'gentle', 'connected', 'emotional-release', 'surrender'],
    safetyWarning:
      'Rebirthing can surface intense emotions and somatic experiences. Should be practised with a certified rebirther. Contraindicated for serious cardiovascular conditions, epilepsy, and acute psychiatric episodes.',
  },

  // =========================================================================
  // 18 -- LION'S BREATH
  // =========================================================================
  {
    id: 'lions-breath',
    name: "Lion's Breath",
    nameDutch: 'Leeuwenadem',
    category: 'sympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 3000,
        instruction: 'Deep inhale through the nose, fill the lungs completely',
        visualIntensity: 0.6,
      },
      {
        phase: 'exhale',
        duration: 2000,
        instruction: 'Open mouth wide, stick out tongue, exhale forcefully with a "HAAA" sound',
        visualIntensity: 1.0,
      },
      {
        phase: 'holdOut',
        duration: 2000,
        instruction: 'Pause, relax the face and jaw',
        visualIntensity: 0.2,
      },
    ],
    rounds: 8,
    requiredLevel: 1,
    description:
      'Simhasana pranayama: a deep inhale followed by an explosive open-mouth exhale with tongue extension. Releases jaw tension, energises, and engages facial muscles.',
    descriptionDutch:
      'Simhasana pranayama: een diepe inademing gevolgd door een explosieve uitademing met open mond en uitgestoken tong. Verlost kaakspanning, geeft energie en activeert gezichtsspieren.',
    scienceNote:
      'The forced expiration with laryngeal opening and facial muscle engagement stimulates cranial nerve activation and can release stored tension in the temporomandibular joint.',
    bpm: null,
    durationRange: { min: 60, max: 300 },
    difficulty: 1,
    tags: ['energy', 'yoga', 'tension-release', 'jaw', 'fun', 'beginner'],
  },

  // =========================================================================
  // 19 -- QI GONG 4-4-6-2
  // =========================================================================
  {
    id: 'qi-gong-4-4-6-2',
    name: 'Qi Gong 4-4-6-2',
    nameDutch: 'Qi Gong 4-4-6-2',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 4000,
        instruction: 'Inhale through the nose, draw qi into the lower dantian',
        visualIntensity: 0.5,
      },
      {
        phase: 'holdIn',
        duration: 4000,
        instruction: 'Hold and circulate energy, feel warmth in the belly',
        visualIntensity: 0.6,
      },
      {
        phase: 'exhale',
        duration: 6000,
        instruction: 'Exhale softly, guide qi down the front channel',
        visualIntensity: 0.4,
      },
      {
        phase: 'holdOut',
        duration: 2000,
        instruction: 'Brief pause, settle into stillness',
        visualIntensity: 0.3,
      },
    ],
    rounds: 'infinite',
    requiredLevel: 2,
    description:
      'Traditional Qi Gong breathing ratio. The asymmetric pattern with longer exhale and shorter bottom hold gently encourages parasympathetic dominance while maintaining energetic flow.',
    descriptionDutch:
      'Traditionele Qi Gong ademhalingsverhouding. Het asymmetrische patroon met langere uitademing en kortere onderpauze bevordert parasympathische dominantie met behoud van energetische stroom.',
    scienceNote:
      'Qi Gong breathing at this ratio has been shown to improve HRV metrics and reduce blood pressure. The 6s exhale phase hits the parasympathetic sweet spot identified in vagal tone research.',
    bpm: 3.75,
    durationRange: { min: 300, max: 1200 },
    difficulty: 2,
    tags: ['qi-gong', 'traditional', 'energy-work', 'dantian', 'balanced'],
  },

  // =========================================================================
  // 20 -- PHYSIOLOGICAL SIGH
  // =========================================================================
  {
    id: 'physiological-sigh',
    name: 'Physiological Sigh',
    nameDutch: 'Fysiologische Zucht',
    category: 'parasympathetic',
    phases: [
      {
        phase: 'inhale',
        duration: 2500,
        instruction: 'Inhale deeply through the nose',
        visualIntensity: 0.6,
      },
      {
        phase: 'inhale',
        duration: 1000,
        instruction: 'Quick second sip of air on top, maximally inflate the alveoli',
        visualIntensity: 0.8,
      },
      {
        phase: 'exhale',
        duration: 6000,
        instruction: 'Long slow exhale through the mouth, let everything go',
        visualIntensity: 0.3,
      },
    ],
    rounds: 3,
    requiredLevel: 1,
    description:
      'The fastest known method to reduce real-time stress. A double inhale followed by an extended exhale pops open collapsed alveoli and maximises CO2 offloading in a single breath.',
    descriptionDutch:
      'De snelst bekende methode om real-time stress te verlagen. Een dubbele inademing gevolgd door een verlengde uitademing opent samengevallen longblaasjes en maximaliseert CO2-afvoer in een enkele ademhaling.',
    scienceNote:
      'Balban et al. (2023, Stanford) showed cyclic physiological sighing for 5 minutes/day was more effective than meditation at reducing anxiety and improving mood. The double inhale reinflates atelectatic alveoli.',
    bpm: null,
    durationRange: { min: 30, max: 300 },
    difficulty: 1,
    tags: ['beginner', 'instant', 'stress', 'stanford', 'science', 'simple'],
  },
] as const;

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Find a single pattern by its unique id.
 */
export function getPatternById(id: string): BreathPattern | undefined {
  return BREATH_PATTERNS.find((p) => p.id === id);
}

/**
 * Return all patterns belonging to a given category.
 */
export function getPatternsByCategory(category: PatternCategory): BreathPattern[] {
  return BREATH_PATTERNS.filter((p) => p.category === category);
}

/**
 * Return all patterns that require exactly the specified access level.
 */
export function getPatternsByLevel(level: AccessLevel): BreathPattern[] {
  return BREATH_PATTERNS.filter((p) => p.requiredLevel === level);
}

/**
 * Return all patterns accessible to a user with the given access level.
 * A user with level N can access all patterns with requiredLevel <= N.
 */
export function getPatternsForUser(accessLevel: AccessLevel): BreathPattern[] {
  return BREATH_PATTERNS.filter((p) => p.requiredLevel <= accessLevel);
}
