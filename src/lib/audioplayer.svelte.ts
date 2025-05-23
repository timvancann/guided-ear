import { Soundfont } from 'smplr';
import { Chord, Note } from 'tonal';

import type { IntervalData, InversionData } from './settings.svelte';
import { chordSettings, globalSettings } from './state.svelte';

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
      velocity: globalSettings.velocity,
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
      velocity: globalSettings.velocity,
      duration: duration + (i === notes.length - 1 ? duration : 0),
      onEnded: () => {
        if (i === notes.length - 1) callback();
      }
    });
  });
};

export const playChord = (chord: Chord.Chord, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.chordDuration, callback = options.callback || (() => {}) } = options;
  const notes = Chord.notes(chord.type, tonic);
  midiChord(notes, duration, callback);
};

export const arpeggiateChord = (chord: Chord.Chord, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.noteDuration, increment = options.increment || true, callback = options.callback || (() => {}) } = options;
  const notes = Chord.notes(chord.type, tonic);
  if (!increment) {
    notes.reverse();
  }
  midiArpeggio(notes, duration, callback);
};

export const arpeggiateInterval = (interval: IntervalData, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.noteDuration, increment = options.increment || true, callback = options.callback || (() => {}) } = options;
  const notes = [tonic, Note.transpose(tonic, interval.interval)];
  if (!increment) {
    notes.reverse();
  }
  midiArpeggio(notes, duration, callback);
};

export const playInterval = (interval: IntervalData, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.noteDuration, increment = options.increment || true, callback = options.callback || (() => {}) } = options;
  const notes = [tonic, Note.transpose(tonic, interval.interval)];
  midiChord(notes, duration, callback);
};

export const playInversion = (inversion: InversionData, options: PlayChordOptions) => {
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.chordDuration, callback = options.callback || (() => {}) } = options;
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
  const { tonic = options.tonic || 'C4', duration = options.duration || chordSettings.noteDuration, increment = options.increment || true, callback = options.callback || (() => {}) } = options;
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
