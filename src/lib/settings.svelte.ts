import { Chord, Interval, type IntervalName } from 'tonal';

export interface ChordData {
  level?: number;
  id: string;
  enabled: boolean;
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

interface Level {
  name: string;
  level: number;
}

export const chordLevels: Level[] = $state([
  { name: 'Basic Chords', level: 1 },
  { name: 'More triads', level: 2 },
  { name: 'Suspended Chords', level: 3 },
  { name: 'Basic 7th Chords', level: 4 },
  { name: 'More 7th Chords', level: 5 }
]);

export type IntervalData = {
  id: string;
  interval: IntervalName;
  enabled: boolean;
  level: number;
};

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

export const intervalLevels: Level[] = $state([
  { name: 'Lower Octave (major)', level: 1 },
  { name: 'Lower Octave (minor)', level: 2 },
  { name: 'Upper Octave (major)', level: 3 },
  { name: 'Upper Octave (minor)', level: 4 }
]);
