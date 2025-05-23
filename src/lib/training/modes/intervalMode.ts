import { playInterval, arpeggiateInterval } from '$lib/audioplayer.svelte';
import { intervals, intervalLevels, type IntervalData } from '$lib/settings.svelte';
import { intervalSettings } from '$lib/state.svelte';
import type { TrainingMode, AudioPlayOptions } from '../types';

export const intervalMode: TrainingMode<IntervalData> = {
  name: 'intervals',
  title: 'Interval Training',
  items: intervals,
  levels: intervalLevels,
  settings: intervalSettings,
  playAudio: (item: IntervalData, options: AudioPlayOptions) => {
    playInterval(item, options);
  },
  playArpeggiated: (item: IntervalData, options: AudioPlayOptions) => {
    arpeggiateInterval(item, options);
  },
  getDisplayText: (item: IntervalData) => item.displayText
};