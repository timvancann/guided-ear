import { playChord, arpeggiateChord } from '$lib/audioplayer.svelte';
import { chordCategories, chordLevels, type ChordData } from '$lib/settings.svelte';
import { chordSettings } from '$lib/state.svelte';
import type { TrainingMode, AudioPlayOptions } from '../types';

export const chordMode: TrainingMode<ChordData> = {
  name: 'chords',
  title: 'Chord Recognition',
  get items() {
    return chordCategories.flatMap(category => category.chords);
  },
  levels: chordLevels,
  settings: chordSettings,
  playAudio: (item: ChordData, options: AudioPlayOptions) => {
    playChord(item.chord, options);
  },
  playArpeggiated: (item: ChordData, options: AudioPlayOptions) => {
    arpeggiateChord(item.chord, options);
  },
  getDisplayText: (item: ChordData) => item.displayText
};