import { Chord } from 'tonal';

export interface ParsedChord {
  chord: string;
  bars: number;
  isValid: boolean;
  originalText: string;
}

export interface ParsedProgression {
  chords: ParsedChord[];
  isValid: boolean;
  totalBars: number;
  errors: string[];
}

/**
 * Parse chord progression from text input
 * Supports formats like:
 * - "C Am F G" (simple space-separated)
 * - "C | Am | F | G" (bar-separated)
 * - "Cmaj7 Am7 Dm7 G7" (complex chords)
 * - "C . . . | Am . | F G" (dots for beat holds, bars for grouping)
 */
export function parseProgression(input: string): ParsedProgression {
  if (!input.trim()) {
    return {
      chords: [],
      isValid: false,
      totalBars: 0,
      errors: ['Progression cannot be empty']
    };
  }

  const errors: string[] = [];
  const chords: ParsedChord[] = [];
  let totalBars = 0;

  try {
    // Clean and normalize input
    const normalized = input
      .trim()
      .replace(/\s*\|\s*/g, ' | ') // Normalize bar separators
      .replace(/\s+/g, ' '); // Normalize spaces

    // Split by bars if they exist, otherwise treat as single bar
    const bars = normalized.includes('|') 
      ? normalized.split('|').map(bar => bar.trim()).filter(bar => bar)
      : [normalized];

    for (let barIndex = 0; barIndex < bars.length; barIndex++) {
      const barContent = bars[barIndex].trim();
      if (!barContent) continue;

      // Split bar content by spaces
      const tokens = barContent.split(/\s+/);
      let currentChord: string | null = null;
      let beatCount = 0;

      for (const token of tokens) {
        if (token === '.') {
          // Dot extends current chord
          if (currentChord === null) {
            errors.push(`Bar ${barIndex + 1}: Dot (.) found without preceding chord`);
            continue;
          }
          beatCount++;
        } else {
          // New chord
          if (currentChord !== null) {
            // Finalize previous chord
            chords.push({
              chord: currentChord,
              bars: 1,
              isValid: isValidChord(currentChord),
              originalText: currentChord
            });
            if (!isValidChord(currentChord)) {
              errors.push(`Invalid chord: "${currentChord}"`);
            }
          }
          currentChord = token;
          beatCount = 1;
        }
      }

      // Finalize last chord in bar
      if (currentChord !== null) {
        chords.push({
          chord: currentChord,
          bars: 1,
          isValid: isValidChord(currentChord),
          originalText: currentChord
        });
        if (!isValidChord(currentChord)) {
          errors.push(`Invalid chord: "${currentChord}"`);
        }
      }

      totalBars++;
    }

    // If no bars were specified, treat each chord as one bar
    if (!normalized.includes('|') && chords.length > 0) {
      totalBars = chords.length;
    }

  } catch (error) {
    errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Validation
  if (chords.length === 0) {
    errors.push('No valid chords found');
  }

  if (chords.length > 32) {
    errors.push('Progression too long (maximum 32 chords)');
  }

  return {
    chords,
    isValid: errors.length === 0 && chords.length > 0,
    totalBars: Math.max(totalBars, chords.length),
    errors
  };
}

/**
 * Validate if a chord name is recognizable by Tonal.js
 */
function isValidChord(chordName: string): boolean {
  try {
    const chord = Chord.get(chordName);
    return chord.name !== '' && chord.notes.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get example progression formats for help text
 */
export function getProgressionExamples(): string[] {
  return [
    'C Am F G',
    'C | Am | F | G',
    'Cmaj7 Am7 Dm7 G7',
    'C . Am . | F . G .',
    'I vi IV V',
    'Em Am D G'
  ];
}

/**
 * Common chord progression presets
 */
export const PROGRESSION_PRESETS = [
  {
    name: 'Pop Progression',
    progression: 'C G Am F',
    description: 'I-V-vi-IV (very popular in pop music)',
    category: 'Popular'
  },
  {
    name: 'Jazz ii-V-I',
    progression: 'Dm7 G7 Cmaj7',
    description: 'Essential jazz progression in C major',
    category: 'Jazz'
  },
  {
    name: '50s Progression',
    progression: 'C Am F G',
    description: 'I-vi-IV-V (classic 50s sound)',
    category: 'Popular'
  },
  {
    name: 'Canon Progression',
    progression: 'C G Am Em F C F G',
    description: 'Pachelbel\'s Canon chord sequence',
    category: 'Classical'
  },
  {
    name: 'Blues Progression',
    progression: 'C7 | C7 | C7 | C7 | F7 | F7 | C7 | C7 | G7 | F7 | C7 | G7',
    description: '12-bar blues in C',
    category: 'Blues'
  },
  {
    name: 'Circle of Fifths',
    progression: 'Am7 D7 Gmaj7 Cmaj7 Fmaj7 Bdim Em7',
    description: 'Moving through keys via fifths',
    category: 'Jazz'
  },
  {
    name: 'Modal Progression',
    progression: 'Em Am Em Am D Em',
    description: 'Natural minor (Aeolian) progression',
    category: 'Modal'
  },
  {
    name: 'Gospel Progression',
    progression: 'C Am7 Dm7 G7 Em7 Am7 Dm7 G7',
    description: 'Common gospel chord movement',
    category: 'Gospel'
  }
];

/**
 * Normalize chord name for display
 */
export function normalizeChordName(chordName: string): string {
  try {
    const chord = Chord.get(chordName);
    return chord.symbol || chordName;
  } catch {
    return chordName;
  }
}