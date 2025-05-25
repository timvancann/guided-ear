import { Chord, Interval, type IntervalName } from 'tonal';
import type { TrainingItem, TrainingLevel } from './training/types';

export interface ChordData extends TrainingItem {
  chord: Chord.Chord;
  type?: string;
}
interface ChordCategory {
  name: string;
  expanded: boolean;
  chords: ChordData[];
}

const basicTriads: ChordCategory = {
  name: 'Basic Triads',
  expanded: false,
  chords: [
    { id: 'Major', enabled: true, chord: Chord.get('C'), level: 1, speech: 'Major triad', displayText: 'maj' },
    { id: 'Minor', enabled: true, chord: Chord.get('Cm'), level: 1, speech: 'Minor triad', displayText: 'm' },
    { id: 'Diminished', enabled: false, chord: Chord.get('Cdim'), level: 2, speech: 'Diminished triad', displayText: 'dim' },
    { id: 'Augmented', enabled: false, chord: Chord.get('Caug'), level: 2, speech: 'Augmented triad', displayText: 'aug' }
  ]
};

const seventh: ChordCategory = {
  name: 'Seventh Chords',
  expanded: false,
  chords: [
    { id: 'Major 7th', enabled: true, chord: Chord.get('Cmaj7'), level: 4, speech: 'Major seventh chord', displayText: 'maj7' },
    { id: 'Minor 7th', enabled: true, chord: Chord.get('Cm7'), level: 4, speech: 'Minor seventh chord', displayText: 'm7' },
    { id: 'Dominant 7th', enabled: true, chord: Chord.get('C7'), level: 4, speech: 'Dominant seventh chord', displayText: '7' },
    { id: 'Minor 7th flat 5', enabled: false, chord: Chord.get('Cm7b5'), level: 5, speech: 'Minor seventh flat five chord', displayText: 'm7♭5' },
    { id: 'Diminished 7th', enabled: false, chord: Chord.get('Cdim7'), level: 5, speech: 'Diminished seventh chord', displayText: 'dim7' },
    { id: 'Minor Major 7th', enabled: false, chord: Chord.get('CmMaj7'), level: 5, speech: 'Minor major seventh chord', displayText: 'mMaj7' }
  ]
};

const extendedChords: ChordCategory = {
  name: 'Extended Chords',
  expanded: false,
  chords: [
    { id: 'Major 9th', enabled: false, chord: Chord.get('Cmaj9'), speech: 'Major ninth chord', displayText: 'maj9' },
    { id: 'Minor 9th', enabled: false, chord: Chord.get('Cm9'), speech: 'Minor ninth chord', displayText: 'm9' },
    { id: 'Dominant 9th', enabled: false, chord: Chord.get('C9'), speech: 'Dominant ninth chord', displayText: '9' },
    { id: 'Major 11th', enabled: false, chord: Chord.get('C11'), speech: 'Major eleventh chord', displayText: 'maj11' },
    { id: 'Minor 11th', enabled: false, chord: Chord.get('Cm11'), speech: 'Minor eleventh chord', displayText: 'm11' }
  ]
};

const susChords: ChordCategory = {
  name: 'Sus and Add Chords',
  expanded: false,
  chords: [
    { id: 'Sus2', enabled: false, chord: Chord.get('Csus2'), level: 3, speech: 'Suspended second chord', displayText: 'sus2' },
    { id: 'Sus4', enabled: false, chord: Chord.get('Csus4'), level: 3, speech: 'Suspended fourth chord', displayText: 'sus4' },
    { id: 'Add9', enabled: false, chord: Chord.get('Cadd9'), speech: 'Add ninth chord', displayText: 'add9' },
    { id: 'Add13', enabled: false, chord: Chord.get('Cadd13'), speech: 'Add thirteenth chord', displayText: 'add13' }
  ]
};

const otherChords: ChordCategory = {
  name: 'Other Chords',
  expanded: false,
  chords: [{ id: 'Five', enabled: true, chord: Chord.get('C5'), level: 1, speech: 'Power chord', displayText: '5' }]
};

export const chordCategories = $state([basicTriads, seventh, extendedChords, susChords, otherChords]);

export const chordLevels: TrainingLevel[] = $state([
  { name: 'Basic Chords', level: 1 },
  { name: 'More triads', level: 2 },
  { name: 'Suspended Chords', level: 3 },
  { name: 'Basic 7th Chords', level: 4 },
  { name: 'More 7th Chords', level: 5 }
]);

export interface IntervalData extends TrainingItem {
  interval: IntervalName;
}

export const intervals: IntervalData[] = $state([
  {
    id: 'Root',
    interval: Interval.fromSemitones(0),
    enabled: true,
    level: 1,
    speech: 'Root interval',
    displayText: 'Root'
  },
  {
    id: 'Minor 2nd',
    interval: Interval.fromSemitones(1),
    enabled: false,
    level: 2,
    speech: 'Minor second interval',
    displayText: 'Minor 2nd'
  },
  {
    id: 'Major 2nd',
    interval: Interval.fromSemitones(2),
    enabled: true,
    level: 1,
    speech: 'Major second interval',
    displayText: 'Major 2nd'
  },
  {
    id: 'Minor 3rd',
    interval: Interval.fromSemitones(3),
    enabled: false,
    level: 2,
    speech: 'Minor third interval',
    displayText: 'Minor 3rd'
  },
  {
    id: 'Major 3rd',
    interval: Interval.fromSemitones(4),
    enabled: true,
    level: 1,
    speech: 'Major third interval',
    displayText: 'Major 3rd'
  },
  {
    id: 'Perfect 4th',
    interval: Interval.fromSemitones(5),
    enabled: true,
    level: 1,
    speech: 'Perfect fourth interval',
    displayText: 'Perfect 4th'
  },
  {
    id: 'Tri tone',
    interval: Interval.fromSemitones(6),
    enabled: false,
    level: 2,
    speech: 'Tritone interval',
    displayText: 'Tritone'
  },
  {
    id: 'Perfect 5th',
    interval: Interval.fromSemitones(7),
    enabled: true,
    level: 3,
    speech: 'Perfect fifth interval',
    displayText: 'Perfect 5th'
  },
  {
    id: 'Minor 6th',
    interval: Interval.fromSemitones(8),
    enabled: false,
    level: 4,
    speech: 'Minor sixth interval',
    displayText: 'Minor 6th'
  },
  {
    id: 'Major 6th',
    interval: Interval.fromSemitones(9),
    enabled: true,
    level: 3,
    speech: 'Major sixth interval',
    displayText: 'Major 6th'
  },
  {
    id: 'Minor 7th',
    interval: Interval.fromSemitones(10),
    enabled: false,
    level: 4,
    speech: 'Minor seventh interval',
    displayText: 'Minor 7th'
  },
  {
    id: 'Major 7th',
    interval: Interval.fromSemitones(11),
    enabled: true,
    level: 3,
    speech: 'Major seventh interval',
    displayText: 'Major 7th'
  },
  {
    id: 'Octave',
    interval: Interval.fromSemitones(12),
    enabled: true,
    level: 3,
    speech: 'Octave interval',
    displayText: 'Octave'
  }
]);

export const intervalLevels: TrainingLevel[] = $state([
  { name: 'Lower Octave (major)', level: 1 },
  { name: 'Lower Octave (minor)', level: 2 },
  { name: 'Upper Octave (major)', level: 3 },
  { name: 'Upper Octave (minor)', level: 4 }
]);

export interface InversionData extends TrainingItem {
  chord: Chord.Chord;
  inversion: number;
}

export const inversionLevels: TrainingLevel[] = $state([
  { name: 'Major Triads (All Inversions)', level: 1 },
  { name: 'Minor Triads (All Inversions)', level: 2 },
  { name: 'Diminished Triads (All Inversions)', level: 3 },
  { name: 'Major 7th Chords (All Inversions)', level: 4 },
  { name: 'Minor 7th Chords (All Inversions)', level: 5 },
  { name: 'Dominant 7th Chords (All Inversions)', level: 6 }
]);

export const inversions: InversionData[] = $state([
  // Major triad inversions - Level 1
  { id: 'Major Root inversion', enabled: true, chord: Chord.get('C'), inversion: 0, level: 1, speech: 'Major triad root position', displayText: 'Major Root' },
  { id: 'Major 1st inversion', enabled: true, chord: Chord.get('C'), inversion: 1, level: 1, speech: 'Major triad first inversion', displayText: 'Major 1st' },
  { id: 'Major 2nd inversion', enabled: true, chord: Chord.get('C'), inversion: 2, level: 1, speech: 'Major triad second inversion', displayText: 'Major 2nd' },

  // Minor triad inversions - Level 2
  { id: 'Minor Root inversion', enabled: true, chord: Chord.get('Cm'), inversion: 0, level: 2, speech: 'Minor triad root position', displayText: 'Minor Root' },
  { id: 'Minor 1st inversion', enabled: true, chord: Chord.get('Cm'), inversion: 1, level: 2, speech: 'Minor triad first inversion', displayText: 'Minor 1st' },
  { id: 'Minor 2nd inversion', enabled: true, chord: Chord.get('Cm'), inversion: 2, level: 2, speech: 'Minor triad second inversion', displayText: 'Minor 2nd' },

  // Diminished triad inversions - Level 3
  { id: 'Diminished Root inversion', enabled: false, chord: Chord.get('Cdim'), inversion: 0, level: 3, speech: 'Diminished triad root position', displayText: 'Diminished Root' },
  { id: 'Diminished 1st inversion', enabled: false, chord: Chord.get('Cdim'), inversion: 1, level: 3, speech: 'Diminished triad first inversion', displayText: 'Diminished 1st' },
  { id: 'Diminished 2nd inversion', enabled: false, chord: Chord.get('Cdim'), inversion: 2, level: 3, speech: 'Diminished triad second inversion', displayText: 'Diminished 2nd' },

  // Major 7th inversions - Level 4
  { id: 'Major 7th Root inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 0, level: 4, speech: 'Major seventh chord root position', displayText: 'Major 7th Root' },
  { id: 'Major 7th 1st inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 1, level: 4, speech: 'Major seventh chord first inversion', displayText: 'Major 7th 1st' },
  { id: 'Major 7th 2nd inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 2, level: 4, speech: 'Major seventh chord second inversion', displayText: 'Major 7th 2nd' },
  { id: 'Major 7th 3rd inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 3, level: 4, speech: 'Major seventh chord third inversion', displayText: 'Major 7th 3rd' },

  // Minor 7th inversions - Level 5
  { id: 'Minor 7th Root inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 0, level: 5, speech: 'Minor seventh chord root position', displayText: 'Minor 7th Root' },
  { id: 'Minor 7th 1st inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 1, level: 5, speech: 'Minor seventh chord first inversion', displayText: 'Minor 7th 1st' },
  { id: 'Minor 7th 2nd inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 2, level: 5, speech: 'Minor seventh chord second inversion', displayText: 'Minor 7th 2nd' },
  { id: 'Minor 7th 3rd inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 3, level: 5, speech: 'Minor seventh chord third inversion', displayText: 'Minor 7th 3rd' },

  // Dominant 7th inversions - Level 6
  { id: 'Dominant 7th Root inversion', enabled: false, chord: Chord.get('C7'), inversion: 0, level: 6, speech: 'Dominant seventh chord root position', displayText: 'Dominant 7th Root' },
  { id: 'Dominant 7th 1st inversion', enabled: false, chord: Chord.get('C7'), inversion: 1, level: 6, speech: 'Dominant seventh chord first inversion', displayText: 'Dominant 7th 1st' },
  { id: 'Domitant 7th 2nd inversion', enabled: false, chord: Chord.get('C7'), inversion: 2, level: 6, speech: 'Dominant seventh chord second inversion', displayText: 'Dominant 7th 2nd' },
  { id: 'Domitant 7th 3rd inversion', enabled: false, chord: Chord.get('C7'), inversion: 3, level: 6, speech: 'Dominant seventh chord third inversion', displayText: 'Dominant 7th 3rd' }
]);

// Add this to src/lib/settings.svelte.ts

export interface ProgressionData extends TrainingItem {
  romanNumerals: string[];
  commonName?: string;
}

const commonProgressions: ProgressionData[] = [
  // Level 1 - Basic Pop Progressions
  {
    id: '1 5 Minor 6 4',
    enabled: true,
    level: 1,
    romanNumerals: ['I', 'V', 'vi', 'IV'],
    commonName: 'Pop',
    speech: 'One five six four progression',
    displayText: 'I-V-vi-IV (Pop)'
  },
  {
    id: 'vi-IV-I-V',
    enabled: true,
    level: 1,
    romanNumerals: ['vi', 'IV', 'I', 'V'],
    commonName: 'Pop (variant)',
    speech: 'Six four one five progression',
    displayText: 'vi-IV-I-V (Pop variant)'
  },
  {
    id: 'I-vi-IV-V',
    enabled: true,
    level: 1,
    romanNumerals: ['I', 'vi', 'IV', 'V'],
    commonName: '50s',
    speech: 'One six four five progression',
    displayText: 'I-vi-IV-V (50s)'
  },

  // Level 2 - Jazz Standards
  {
    id: 'ii-V-I',
    enabled: false,
    level: 2,
    romanNumerals: ['ii7', 'V7', 'IM7'],
    commonName: 'Jazz Turnaround',
    speech: 'Two five one jazz turnaround',
    displayText: 'ii-V-I (Jazz)'
  },
  {
    id: 'I-vi-ii-V',
    enabled: false,
    level: 2,
    romanNumerals: ['IM7', 'vi7', 'ii7', 'V7'],
    commonName: 'Circle of Fifths',
    speech: 'One six two five circle of fifths',
    displayText: 'I-vi-ii-V (Circle)'
  },
  {
    id: 'iii-vi-ii-V',
    enabled: false,
    level: 2,
    romanNumerals: ['iii7', 'vi7', 'ii7', 'V7'],
    commonName: 'Extended Circle',
    speech: 'Three six two five extended circle',
    displayText: 'iii-vi-ii-V (Extended)'
  },

  // Level 3 - Classical Cadences
  {
    id: 'ii-V-I (Classical)',
    enabled: false,
    level: 3,
    romanNumerals: ['ii', 'V', 'I'],
    commonName: 'Authentic Cadence',
    speech: 'Two five one authentic cadence',
    displayText: 'ii-V-I (Authentic)'
  },
  {
    id: 'IV-V-I',
    enabled: false,
    level: 3,
    romanNumerals: ['IV', 'V', 'I'],
    commonName: 'Plagal Cadence',
    speech: 'Four five one plagal cadence',
    displayText: 'IV-V-I (Plagal)'
  },
  {
    id: 'V-vi',
    enabled: false,
    level: 3,
    romanNumerals: ['V', 'vi'],
    commonName: 'Deceptive Cadence',
    speech: 'Five six deceptive cadence',
    displayText: 'V-vi (Deceptive)'
  },

  // Level 4 - Modal and Modern
  {
    id: 'i-VII-VI-VII',
    enabled: false,
    level: 4,
    romanNumerals: ['i', 'bVII', 'bVI', 'bVII'],
    commonName: 'Aeolian',
    speech: 'One flat seven flat six flat seven aeolian progression',
    displayText: 'i-♭VII-♭VI-♭VII (Aeolian)'
  },
  {
    id: 'I-bVII-IV-I',
    enabled: false,
    level: 4,
    romanNumerals: ['I', 'bVII', 'IV', 'I'],
    commonName: 'Mixolydian',
    speech: 'One flat seven four one mixolydian progression',
    displayText: 'I-♭VII-IV-I (Mixolydian)'
  },
  {
    id: 'i-IV-bVII-i',
    enabled: false,
    level: 4,
    romanNumerals: ['i', 'IV', 'bVII', 'i'],
    commonName: 'Dorian',
    speech: 'One four flat seven one dorian progression',
    displayText: 'i-IV-♭VII-i (Dorian)'
  }
];

export const progressions: ProgressionData[] = $state(commonProgressions);

export const progressionLevels: TrainingLevel[] = $state([
  { name: 'Popular Progressions', level: 1 },
  { name: 'Jazz Standards', level: 2 },
  { name: 'Classical Cadences', level: 3 },
  { name: 'Modal & Modern', level: 4 }
]);
