import { playProgression } from '$lib/audioplayer.svelte';
import { progressions, progressionLevels, type ProgressionData } from '$lib/settings.svelte';
import { progressionSettings } from '$lib/state.svelte';
import type { TrainingMode, AudioPlayOptions } from '../types';

export const progressionMode: TrainingMode<ProgressionData> = {
  name: 'progressions',
  title: 'Chord Progressions',
  items: progressions,
  levels: progressionLevels,
  settings: progressionSettings,
  playAudio: (item: ProgressionData, options: AudioPlayOptions) => {
    playProgression(item, options);
  },
  playArpeggiated: () => { },
  getDisplayText: (item: ProgressionData) => {
    // Return both the progression name and roman numerals
    const romanText = item.romanNumerals.join(' - ');
    return item.commonName ? `${item.commonName}: ${romanText}` : `${item.id}: ${romanText}`;
  }
};