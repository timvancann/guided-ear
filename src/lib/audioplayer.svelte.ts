import { Soundfont } from "smplr";
import { Chord } from 'tonal';

import { chordSettings } from "./state.svelte";


export const audioState: { player: Soundfont | null, audioContext: AudioContext | null, speech: SpeechSynthesis | null } = $state({
  player: null,
  audioContext: null,
  speech: null,
});

type PlayChordOptions = {
  tonic?: string;
  duration?: number;
  increment?: boolean;
  callback?: () => void;
}

export const playChord = (chord: Chord.Chord, options: PlayChordOptions) => {
  const { tonic = options.tonic || "C4",
    duration = options.duration || 2.5,
    callback = options.callback || (() => { }),
  } = options;
  if (!audioState.audioContext || !audioState.player) {
    console.error("Audio context is not initialized");
    return
  }

  const now = audioState.audioContext.currentTime;
  const notes = Chord.notes(chord.type, tonic);
  notes.forEach((note, i) => {
    audioState.player?.start({
      note, time: now, duration, velocity: chordSettings.velocity, onEnded: () => {
        if (i === notes.length - 1) callback();
      }
    });
  });
}

export const arpeggiateChord = (chord: Chord.Chord, options: PlayChordOptions) => {
  const { tonic = options.tonic || "C4",
    duration = options.duration || .8,
    increment = options.increment || true,
    callback = options.callback || (() => { }),
  } = options;
  if (!audioState.audioContext) {
    console.error("Audio context is not initialized");
    return
  }
  const now = audioState.audioContext.currentTime;
  const notes = Chord.notes(chord.type, tonic);
  if (!increment) {
    notes.reverse();
  }
  notes.forEach((note, i) => {
    audioState.player?.start({
      note, time: now + i * duration, velocity: chordSettings.velocity, duration: duration + (i === notes.length - 1 ? duration : 0), onEnded: () => {
        if (i === notes.length - 1 && options.callback) callback();
      }
    });
  });
}
