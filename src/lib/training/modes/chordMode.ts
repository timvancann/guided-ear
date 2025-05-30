import { arpeggiateChord, playChord } from '$lib/audioplayer.svelte';
import { chordCategories, chordLevels, type ChordData } from '$lib/settings.svelte';
import { chordSettings } from '$lib/state.svelte';
import type { AudioPlayOptions, TrainingMode } from '../types';

export const chordMode: TrainingMode = {
  name: 'chords',
  title: 'Chord Recognition',
  get items() {
    return chordCategories.flatMap((category) => category.chords);
  },
  levels: chordLevels,
  settings: chordSettings.value,
  playAudio: (item: ChordData, options: AudioPlayOptions) => {
    playChord(item.chord, options);
  },
  playArpeggiated: (item: ChordData, options: AudioPlayOptions) => {
    arpeggiateChord(item.chord, options);
  },
  getDisplayText: (item: ChordData) => item.displayText
};
