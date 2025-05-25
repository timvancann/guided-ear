import { Soundfont } from 'smplr';
import { Chord, Note, Progression } from 'tonal';

import { type IntervalData, type InversionData, type ProgressionData } from './settings.svelte';
import { chordSettings, globalSettings, progressionSettings } from './state.svelte';

export const audioState: {
  player: Soundfont | null;
  audioContext: AudioContext | null;
  speech: SpeechSynthesis | null;
} = $state({
  player: null,
  audioContext: null,
  speech: null
});

type PlayChordOptions = {
  tonic?: string;
  duration?: number;
  increment?: boolean;
  callback?: () => void;
};

const midiChord = (notes: string[], duration: number, callback: () => void) => {
  if (!audioState.audioContext || !audioState.player) {
    console.error('Audio context is not initialized');
    return;
  }
  const now = audioState.audioContext.currentTime;
  notes.forEach((note, i) => {
    audioState.player?.start({
      note,
      time: now,
      duration,
      velocity: globalSettings.value.velocity,
      onEnded: () => {
        if (i === notes.length - 1) callback();
      }
    });
  });
};

const midiArpeggio = (notes: string[], duration: number, callback: () => void) => {
  if (!audioState.audioContext || !audioState.player) {
    console.error('Audio context is not initialized');
    return;
  }
  const now = audioState.audioContext.currentTime;
  notes.forEach((note, i) => {
    audioState.player?.start({
      note,
      time: now + i * duration,
      velocity: globalSettings.value.velocity,
      duration: duration + (i === notes.length - 1 ? duration : 0),
      onEnded: () => {
        if (i === notes.length - 1) callback();
      }
    });
  });
};

export const playChord = (chord: Chord.Chord, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.value.chordDuration, callback = options.callback || (() => {}) } = options;
  const notes = Chord.notes(chord.type, tonic);
  midiChord(notes, duration, callback);
};

export const arpeggiateChord = (chord: Chord.Chord, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.value.noteDuration, increment = options.increment || true, callback = options.callback || (() => {}) } = options;
  const notes = Chord.notes(chord.type, tonic);
  if (!increment) {
    notes.reverse();
  }
  midiArpeggio(notes, duration, callback);
};

export const arpeggiateInterval = (interval: IntervalData, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.value.noteDuration, increment = options.increment || true, callback = options.callback || (() => {}) } = options;
  const notes = [tonic, Note.transpose(tonic, interval.interval)];
  if (!increment) {
    notes.reverse();
  }
  midiArpeggio(notes, duration, callback);
};

export const playInterval = (interval: IntervalData, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.value.noteDuration, callback = options.callback || (() => {}) } = options;
  const notes = [tonic, Note.transpose(tonic, interval.interval)];
  midiChord(notes, duration, callback);
};

export const playInversion = (inversion: InversionData, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.value.chordDuration, callback = options.callback || (() => {}) } = options;
  const chordNotes = Chord.notes(inversion.chord.type, tonic);

  // Create inversion by rotating the chord notes
  const inversionNotes = [...chordNotes];
  for (let i = 0; i < inversion.inversion; i++) {
    const note = inversionNotes.shift();
    if (note) {
      // Move the note up an octave when rotating
      const octaveUp = Note.transpose(note, '8P');
      inversionNotes.push(octaveUp);
    }
  }
  midiChord(inversionNotes, duration, callback);
};

export const arpeggiateInversion = (inversion: InversionData, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.value.noteDuration, increment = options.increment || true, callback = options.callback || (() => {}) } = options;
  const chordNotes = Chord.notes(inversion.chord.type, tonic);

  // Create inversion by rotating the chord notes
  const inversionNotes = [...chordNotes];
  for (let i = 0; i < inversion.inversion; i++) {
    const note = inversionNotes.shift();
    if (note) {
      // Move the note up an octave when rotating
      const octaveUp = Note.transpose(note, '8P');
      inversionNotes.push(octaveUp);
    }
  }

  if (!increment) {
    inversionNotes.reverse();
  }
  midiArpeggio(inversionNotes, duration, callback);
};

export const playProgression = (progression: ProgressionData, options: PlayChordOptions) => {
  const { tonic = 'C4', duration = progressionSettings.value.chordDuration, callback = () => {} } = options;

  if (!audioState.audioContext || !audioState.player) {
    console.error('Audio context is not initialized');
    return;
  }

  const keyTonic = tonic.replace(/\d/, '');
  const octave = tonic.match(/\d/)?.[0] || '4';

  // Get the actual chord names from roman numerals
  const chordNames = Progression.fromRomanNumerals(keyTonic, progression.romanNumerals);

  const now = audioState.audioContext.currentTime;
  let totalDuration = 0;

  chordNames.forEach((chordName, index) => {
    const chord = Chord.get(chordName);
    const chordNotes = Chord.notes(chord.type, chord.tonic + octave);
    const startTime = now + index * duration;

    // Play each chord in the progression
    chordNotes.forEach((note) => {
      audioState.player?.start({
        note,
        time: startTime,
        duration: duration * 0.9, // Slight gap between chords
        velocity: globalSettings.value.velocity
      });
    });

    totalDuration = startTime + duration;
  });

  // Call callback after the entire progression finishes
  setTimeout(callback, (totalDuration - now + duration * 2) * 1000);
};
