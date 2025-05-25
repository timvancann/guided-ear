import { playProgression } from '$lib/audioplayer.svelte';
import { progressionLevels, progressions, type ProgressionData } from '$lib/settings.svelte';
import { progressionSettings } from '$lib/state.svelte';
import type { AudioPlayOptions, TrainingMode } from '../types';

export const progressionMode: TrainingMode<ProgressionData> = {
  name: 'progressions',
  title: 'Chord Progressions',
  items: progressions,
  levels: progressionLevels,
  settings: progressionSettings.value,
  playAudio: (item: ProgressionData, options: AudioPlayOptions) => {
    playProgression(item, options);
  },
  playArpeggiated: () => {},
  getDisplayText: (item: ProgressionData) => item.displayText
};
