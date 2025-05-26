import { Note, Scale } from 'tonal';
import { parseProgression } from './progressionParser';

// Fourths progression cycle: B → E → A → D → G → C → F → Bb → Eb → Ab → Db → Gb → B
const FOURTHS_CYCLE = ['B', 'E', 'A', 'D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

// Common chord qualities for random generation
export const CHORD_QUALITIES = [
  { symbol: '', name: 'Major' },
  { symbol: 'm', name: 'Minor' },
  { symbol: '7', name: 'Dominant 7th' },
  { symbol: 'maj7', name: 'Major 7th' },
  { symbol: 'm7', name: 'Minor 7th' },
  { symbol: 'dim', name: 'Diminished' },
  { symbol: 'aug', name: 'Augmented' }
];

export class ChordGenerator {
  private currentFourthsIndex = 0;
  private currentDiatonicIndex = 0;
  private currentCustomIndex = 0;

  constructor() {
    // Start with B (index 0) for fourths
    this.currentFourthsIndex = 0;
    // Start with I (index 0) for diatonic
    this.currentDiatonicIndex = 0;
    // Start with first chord for custom
    this.currentCustomIndex = 0;
  }

  /**
   * Generate next chord in fourths progression
   */
  generateFourthsChord(): { current: string; next: string } {
    const current = FOURTHS_CYCLE[this.currentFourthsIndex];

    // Advance to next chord in cycle
    this.currentFourthsIndex = (this.currentFourthsIndex + 1) % FOURTHS_CYCLE.length;
    const next = FOURTHS_CYCLE[this.currentFourthsIndex];

    return { current, next };
  }

  /**
   * Generate random chord from all 12 chromatic roots
   */
  generateRandomChord(selectedQualities: string[] = ['']): { current: string; next: string } {
    const allRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Ensure we have at least one quality
    const qualities = selectedQualities.length > 0 ? selectedQualities : [''];

    // Pick random root and quality
    const currentRoot = allRoots[Math.floor(Math.random() * allRoots.length)];
    const currentQuality = qualities[Math.floor(Math.random() * qualities.length)];
    const current = currentRoot + currentQuality;

    // Generate next chord (different from current)
    let nextRoot = currentRoot;
    let nextQuality = currentQuality;
    let attempts = 0;

    // Try to generate a different chord (different root or quality)
    while (nextRoot === currentRoot && nextQuality === currentQuality && attempts < 10) {
      nextRoot = allRoots[Math.floor(Math.random() * allRoots.length)];
      nextQuality = qualities[Math.floor(Math.random() * qualities.length)];
      attempts++;
    }

    const next = nextRoot + nextQuality;

    return { current, next };
  }

  /**
   * Generate only the next random chord, ensuring it's different from the current
   */
  generateNextRandomChord(currentChord: string, selectedQualities: string[] = ['']): { next: string } {
    const allRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const qualities = selectedQualities.length > 0 ? selectedQualities : [''];

    // Parse current chord to avoid duplicates
    const currentMatch = currentChord.match(/^([A-G][#b]?)(.*)$/);
    const currentRoot = currentMatch ? currentMatch[1] : '';
    const currentQuality = currentMatch ? currentMatch[2] : '';

    let nextRoot = currentRoot;
    let nextQuality = currentQuality;
    let attempts = 0;

    // Generate a different chord
    while (nextRoot === currentRoot && nextQuality === currentQuality && attempts < 10) {
      nextRoot = allRoots[Math.floor(Math.random() * allRoots.length)];
      nextQuality = qualities[Math.floor(Math.random() * qualities.length)];
      attempts++;
    }

    return { next: nextRoot + nextQuality };
  }

  /**
   * Generate diatonic chord progression
   */
  generateDiatonicChord(key: string, option: 'incremental' | 'random'): { current: string; next: string } {
    // Get the major scale for the key
    const scaleName = `${key} major`;
    const scaleChords = Scale.scaleChords(scaleName);

    if (scaleChords.length === 0) {
      // Fallback if scale not found
      return { current: key, next: key };
    }

    let currentChord: string;
    let nextChord: string;

    if (option === 'incremental') {
      // Sequential progression through scale degrees
      currentChord = scaleChords[this.currentDiatonicIndex];
      this.currentDiatonicIndex = (this.currentDiatonicIndex + 1) % scaleChords.length;
      nextChord = scaleChords[this.currentDiatonicIndex];
    } else {
      // Random selection from diatonic chords
      const currentIndex = Math.floor(Math.random() * scaleChords.length);
      currentChord = scaleChords[currentIndex];

      // Pick a different chord for next
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex && scaleChords.length > 1) {
        nextIndex = Math.floor(Math.random() * scaleChords.length);
      }
      nextChord = scaleChords[nextIndex];
    }

    return { current: currentChord, next: nextChord };
  }

  /**
   * Generate custom chord progression
   */
  generateCustomChord(progressionText: string): { current: string; next: string } {
    const parsed = parseProgression(progressionText);

    if (!parsed.isValid || parsed.chords.length === 0) {
      // Fallback to simple progression
      return { current: 'C', next: 'Am' };
    }

    const validChords = parsed.chords.filter((chord) => chord.isValid);
    if (validChords.length === 0) {
      return { current: 'C', next: 'Am' };
    }

    // Get current and next chord from progression
    const currentChord = validChords[this.currentCustomIndex].chord;
    this.currentCustomIndex = (this.currentCustomIndex + 1) % validChords.length;
    const nextChord = validChords[this.currentCustomIndex].chord;

    return { current: currentChord, next: nextChord };
  }

  /**
   * Get chord progression based on type
   */
  getNextChord(
    type: 'fourths' | 'random' | 'diatonic' | 'custom',
    selectedQualities: string[] = [''],
    diatonicKey: string = 'C',
    diatonicOption: 'incremental' | 'random' = 'incremental',
    customProgression: string = 'C Am F G'
  ): { current: string; next: string } {
    switch (type) {
      case 'fourths':
        return this.generateFourthsChord();
      case 'random':
        return this.generateRandomChord(selectedQualities);
      case 'diatonic':
        return this.generateDiatonicChord(diatonicKey, diatonicOption);
      case 'custom':
        return this.generateCustomChord(customProgression);
      default:
        return this.generateFourthsChord();
    }
  }

  /**
   * Reset fourths progression to start
   */
  resetFourths() {
    this.currentFourthsIndex = 0;
  }

  /**
   * Reset diatonic progression to start (I chord)
   */
  resetDiatonic() {
    this.currentDiatonicIndex = 0;
  }

  /**
   * Reset custom progression to start (first chord)
   */
  resetCustom() {
    this.currentCustomIndex = 0;
  }

  /**
   * Reset all progression indices when switching modes
   */
  resetAll() {
    this.currentFourthsIndex = 0;
    this.currentDiatonicIndex = 0;
    this.currentCustomIndex = 0;
  }

  /**
   * Set specific position in fourths cycle
   */
  setFourthsPosition(chordName: string) {
    const index = FOURTHS_CYCLE.findIndex((chord) => chord === chordName);
    if (index !== -1) {
      this.currentFourthsIndex = index;
    }
  }

  /**
   * Get all available chord qualities
   */
  static getAvailableQualities(): typeof CHORD_QUALITIES {
    return CHORD_QUALITIES;
  }

  /**
   * Validate if a chord name is valid using Tonal.js
   */
  static isValidChord(chordName: string): boolean {
    try {
      const chord = Note.get(chordName.replace(/[^A-G#b]/g, ''));
      return chord.name !== '';
    } catch {
      return false;
    }
  }

  /**
   * Get display name for chord (handles enharmonic equivalents)
   */
  static getDisplayName(chordName: string): string {
    try {
      // Extract root note and quality
      const rootMatch = chordName.match(/^[A-G][#b]?/);
      if (!rootMatch) return chordName;

      const root = rootMatch[0];
      const quality = chordName.slice(root.length);

      // Normalize the root note
      const normalizedRoot = Note.simplify(root);

      return normalizedRoot + quality;
    } catch {
      return chordName;
    }
  }
}
