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
    { id: 'Major', enabled: true, chord: Chord.get('C'), level: 1 },
    { id: 'Minor', enabled: true, chord: Chord.get('Cm'), level: 1 },
    { id: 'Diminished', enabled: false, chord: Chord.get('Cdim'), level: 2 },
    { id: 'Augmented', enabled: false, chord: Chord.get('Caug'), level: 2 }
  ]
};

const seventh: ChordCategory = {
  name: 'Seventh Chords',
  expanded: false,
  chords: [
    { id: 'Major 7th', enabled: true, chord: Chord.get('Cmaj7'), level: 4 },
    { id: 'Minor 7th', enabled: true, chord: Chord.get('Cm7'), level: 4 },
    { id: 'Dominant 7th', enabled: true, chord: Chord.get('C7'), level: 4 },
    { id: 'Minor 7th flat 5', enabled: false, chord: Chord.get('Cm7b5'), level: 5 },
    { id: 'Diminished 7th', enabled: false, chord: Chord.get('Cdim7'), level: 5 },
    { id: 'Minor Major 7th', enabled: false, chord: Chord.get('CmMaj7'), level: 5 }
  ]
};

const extendedChords: ChordCategory = {
  name: 'Extended Chords',
  expanded: false,
  chords: [
    { id: 'Major 9th', enabled: false, chord: Chord.get('Cmaj9') },
    { id: 'Minor 9th', enabled: false, chord: Chord.get('Cm9') },
    { id: 'Dominant 9th', enabled: false, chord: Chord.get('C9') },
    { id: 'Major 11th', enabled: false, chord: Chord.get('C11') },
    { id: 'Minor 11th', enabled: false, chord: Chord.get('Cm11') }
  ]
};

const susChords: ChordCategory = {
  name: 'Sus and Add Chords',
  expanded: false,
  chords: [
    { id: 'Sus2', enabled: false, chord: Chord.get('Csus2'), level: 3 },
    { id: 'Sus4', enabled: false, chord: Chord.get('Csus4'), level: 3 },
    { id: 'Add9', enabled: false, chord: Chord.get('Cadd9') },
    { id: 'Add13', enabled: false, chord: Chord.get('Cadd13') }
  ]
};

const otherChords: ChordCategory = {
  name: 'Other Chords',
  expanded: false,
  chords: [{ id: 'Five', enabled: true, chord: Chord.get('C5'), level: 1 }]
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
    level: 1
  },
  {
    id: 'Minor 2nd',
    interval: Interval.fromSemitones(1),
    enabled: false,
    level: 2
  },
  {
    id: 'Major 2nd',
    interval: Interval.fromSemitones(2),
    enabled: true,
    level: 1
  },
  {
    id: 'Minor 3rd',
    interval: Interval.fromSemitones(3),
    enabled: false,
    level: 2
  },
  {
    id: 'Major 3rd',
    interval: Interval.fromSemitones(4),
    enabled: true,
    level: 1
  },
  {
    id: 'Perfect 4th',
    interval: Interval.fromSemitones(5),
    enabled: true,
    level: 1
  },
  {
    id: 'Tri tone',
    interval: Interval.fromSemitones(6),
    enabled: false,
    level: 2
  },
  {
    id: 'Perfect 5th',
    interval: Interval.fromSemitones(7),
    enabled: true,
    level: 3
  },
  {
    id: 'Minor 6th',
    interval: Interval.fromSemitones(8),
    enabled: false,
    level: 4
  },
  {
    id: 'Major 6th',
    interval: Interval.fromSemitones(9),
    enabled: true,
    level: 3
  },
  {
    id: 'Minor 7th',
    interval: Interval.fromSemitones(10),
    enabled: false,
    level: 4
  },
  {
    id: 'Major 7th',
    interval: Interval.fromSemitones(11),
    enabled: true,
    level: 3
  },
  {
    id: 'Octave',
    interval: Interval.fromSemitones(12),
    enabled: true,
    level: 3
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
  { id: 'Major Root inversion', enabled: true, chord: Chord.get('C'), inversion: 0, level: 1 },
  { id: 'Major 1st inversion', enabled: true, chord: Chord.get('C'), inversion: 1, level: 1 },
  { id: 'Major 2nd inversion', enabled: true, chord: Chord.get('C'), inversion: 2, level: 1 },
  
  // Minor triad inversions - Level 2
  { id: 'Minor Root inversion', enabled: true, chord: Chord.get('Cm'), inversion: 0, level: 2 },
  { id: 'Minor 1st inversion', enabled: true, chord: Chord.get('Cm'), inversion: 1, level: 2 },
  { id: 'Minor 2nd inversion', enabled: true, chord: Chord.get('Cm'), inversion: 2, level: 2 },
  
  // Diminished triad inversions - Level 3
  { id: 'Diminished Root inversion', enabled: false, chord: Chord.get('Cdim'), inversion: 0, level: 3 },
  { id: 'Diminished 1st inversion', enabled: false, chord: Chord.get('Cdim'), inversion: 1, level: 3 },
  { id: 'Diminished 2nd inversion', enabled: false, chord: Chord.get('Cdim'), inversion: 2, level: 3 },
  
  // Major 7th inversions - Level 4
  { id: 'Major 7th Root inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 0, level: 4 },
  { id: 'Major 7th 1st inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 1, level: 4 },
  { id: 'Major 7th 2nd inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 2, level: 4 },
  { id: 'Major 7th 3rd inversion', enabled: false, chord: Chord.get('Cmaj7'), inversion: 3, level: 4 },
  
  // Minor 7th inversions - Level 5
  { id: 'Minor 7th Root inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 0, level: 5 },
  { id: 'Minor 7th 1st inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 1, level: 5 },
  { id: 'Minor 7th 2nd inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 2, level: 5 },
  { id: 'Minor 7th 3rd inversion', enabled: false, chord: Chord.get('Cm7'), inversion: 3, level: 5 },
  
  // Dominant 7th inversions - Level 6
  { id: 'Dominant 7th Root inversion', enabled: false, chord: Chord.get('C7'), inversion: 0, level: 6 },
  { id: 'Dominant 7th 1st inversion', enabled: false, chord: Chord.get('C7'), inversion: 1, level: 6 },
  { id: 'Domitant 7th 2nd inversion', enabled: false, chord: Chord.get('C7'), inversion: 2, level: 6 },
  { id: 'Domitant 7th 3rd inversion', enabled: false, chord: Chord.get('C7'), inversion: 3, level: 6 }
]);

// Add this to src/lib/settings.svelte.ts

export interface ProgressionData extends TrainingItem {
  romanNumerals: string[];
  commonName?: string;
}

const commonProgressions: ProgressionData[] = [
  // Level 1 - Basic Pop Progressions
  {
    id: 'I-V-vi-IV',
    enabled: true,
    level: 1,
    romanNumerals: ['I', 'V', 'vi', 'IV'],
    commonName: 'Pop Progression'
  },
  {
    id: 'vi-IV-I-V',
    enabled: true,
    level: 1,
    romanNumerals: ['vi', 'IV', 'I', 'V'],
    commonName: 'Pop Progression (variant)'
  },
  {
    id: 'I-vi-IV-V',
    enabled: true,
    level: 1,
    romanNumerals: ['I', 'vi', 'IV', 'V'],
    commonName: '50s Progression'
  },

  // Level 2 - Jazz Standards
  {
    id: 'ii-V-I',
    enabled: false,
    level: 2,
    romanNumerals: ['ii7', 'V7', 'IM7'],
    commonName: 'Jazz Turnaround'
  },
  {
    id: 'I-vi-ii-V',
    enabled: false,
    level: 2,
    romanNumerals: ['IM7', 'vi7', 'ii7', 'V7'],
    commonName: 'Circle of Fifths'
  },
  {
    id: 'iii-vi-ii-V',
    enabled: false,
    level: 2,
    romanNumerals: ['iii7', 'vi7', 'ii7', 'V7'],
    commonName: 'Extended Circle'
  },

  // Level 3 - Classical Cadences
  {
    id: 'ii-V-I (Classical)',
    enabled: false,
    level: 3,
    romanNumerals: ['ii', 'V', 'I'],
    commonName: 'Authentic Cadence'
  },
  {
    id: 'IV-V-I',
    enabled: false,
    level: 3,
    romanNumerals: ['IV', 'V', 'I'],
    commonName: 'Plagal Cadence'
  },
  {
    id: 'V-vi',
    enabled: false,
    level: 3,
    romanNumerals: ['V', 'vi'],
    commonName: 'Deceptive Cadence'
  },

  // Level 4 - Modal and Modern
  {
    id: 'i-VII-VI-VII',
    enabled: false,
    level: 4,
    romanNumerals: ['i', 'bVII', 'bVI', 'bVII'],
    commonName: 'Aeolian Progression'
  },
  {
    id: 'I-bVII-IV-I',
    enabled: false,
    level: 4,
    romanNumerals: ['I', 'bVII', 'IV', 'I'],
    commonName: 'Mixolydian Progression'
  }
];

export const progressions: ProgressionData[] = $state(commonProgressions);

export const progressionLevels: TrainingLevel[] = $state([
  { name: 'Popular Progressions', level: 1 },
  { name: 'Jazz Standards', level: 2 },
  { name: 'Classical Cadences', level: 3 },
  { name: 'Modal & Modern', level: 4 }
]);