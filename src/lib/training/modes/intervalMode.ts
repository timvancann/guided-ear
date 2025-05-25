import { arpeggiateInterval, playInterval } from '$lib/audioplayer.svelte';
import { intervalLevels, intervals, type IntervalData } from '$lib/settings.svelte';
import { intervalSettings } from '$lib/state.svelte';
import type { AudioPlayOptions, TrainingMode } from '../types';

export const intervalMode: TrainingMode<IntervalData> = {
  name: 'intervals',
  title: 'Interval Training',
  items: intervals,
  levels: intervalLevels,
  settings: intervalSettings.value,
  playAudio: (item: IntervalData, options: AudioPlayOptions) => {
    playInterval(item, options);
  },
  playArpeggiated: (item: IntervalData, options: AudioPlayOptions) => {
    arpeggiateInterval(item, options);
  },
  getDisplayText: (item: IntervalData) => item.displayText
};
