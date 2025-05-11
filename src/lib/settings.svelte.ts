import { Chord } from "tonal";

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

const major: ChordData = $state({ id: "Major", enabled: true, chord: Chord.get("C"), level: 1 });
const minor: ChordData = $state({ id: "Minor", enabled: true, chord: Chord.get("Cm"), level: 1 });
const diminished: ChordData = $state({ id: "Diminished", enabled: false, chord: Chord.get("Cdim"), level: 2 });
const augmented: ChordData = $state({ id: "Augmented", enabled: false, chord: Chord.get("Caug"), level: 2 });
const power: ChordData = $state({ id: "Power", enabled: true, chord: Chord.get("C5"), level: 1 });

const basicTriads: ChordCategory = {
  name: "Basic Triads",
  expanded: false,
  chords: [major, minor, diminished, augmented]
}

const seventh: ChordCategory = {
  name: "Seventh Chords",
  expanded: false,
  chords: [
    { id: "Major 7th", enabled: true, chord: Chord.get("Cmaj7") },
    { id: "Minor 7th", enabled: true, chord: Chord.get("Cm7") },
    { id: "Dominant 7th", enabled: true, chord: Chord.get("C7") },
    { id: "Minor 7th flat 5", enabled: false, chord: Chord.get("Cm7b5") },
    { id: "Diminished 7th", enabled: false, chord: Chord.get("Cdim7") },
    { id: "Minor Major 7th", enabled: false, chord: Chord.get("CmMaj7") }
  ]
}

const extendedChords: ChordCategory = {
  name: "Extended Chords",
  expanded: false,
  chords: [
    { id: "Major 9th", enabled: false, chord: Chord.get("Cmaj9") },
    { id: "Minor 9th", enabled: false, chord: Chord.get("Cm9") },
    { id: "Dominant 9th", enabled: false, chord: Chord.get("C9") },
    { id: "Major 11th", enabled: false, chord: Chord.get("C11") },
    { id: "Minor 11th", enabled: false, chord: Chord.get("Cm11") }
  ]
}

const susChords: ChordCategory = {
  name: "Sus and Add Chords",
  expanded: false,
  chords: [
    { id: "Sus2", enabled: false, chord: Chord.get("Csus2") },
    { id: "Sus4", enabled: false, chord: Chord.get("Csus4") },
    { id: "Add9", enabled: false, chord: Chord.get("Cadd9") },
    { id: "Add13", enabled: false, chord: Chord.get("Cadd13") }
  ]
}

const otherChords: ChordCategory = {
  name: "Other Chords",
  expanded: false,
  chords: [power]
}

export const chordCategories = $state([basicTriads, seventh, extendedChords, susChords, otherChords]);

interface Level {
  name: string;
}

export const levels: Level[] = $state([
  { name: "Basic Chords" },
  { name: "Augmented and Diminished" },
  { name: "Basic 7th Chords" }
]);
