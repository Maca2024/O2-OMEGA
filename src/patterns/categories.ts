import { PatternCategory } from '../types/breath';

export interface PatternCategoryInfo {
  id: PatternCategory;
  name: string;
  nameDutch: string;
  color: string;
  icon: string;
  description: string;
}

export const PATTERN_CATEGORIES: PatternCategoryInfo[] = [
  {
    id: 'parasympathetic',
    name: 'Calm',
    nameDutch: 'Kalmte',
    color: '#00D4AA',
    icon: '🟢',
    description: 'Activate your rest-and-digest system',
  },
  {
    id: 'sympathetic',
    name: 'Energy',
    nameDutch: 'Energie',
    color: '#FFD93D',
    icon: '🟡',
    description: 'Boost alertness and performance',
  },
  {
    id: 'clinical',
    name: 'Clinical',
    nameDutch: 'Klinisch',
    color: '#4A9EFF',
    icon: '🔵',
    description: 'Evidence-based therapeutic protocols',
  },
  {
    id: 'transformative',
    name: 'Transform',
    nameDutch: 'Transformatief',
    color: '#7B68EE',
    icon: '🟣',
    description: 'Consciousness expansion protocols',
  },
];

export function getCategoryInfo(id: PatternCategory): PatternCategoryInfo | undefined {
  return PATTERN_CATEGORIES.find((cat) => cat.id === id);
}
