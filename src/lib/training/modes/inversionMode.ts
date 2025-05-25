import { arpeggiateInversion, playInversion } from '$lib/audioplayer.svelte';
import { inversionLevels, inversions, type InversionData } from '$lib/settings.svelte';
import { inversionSettings } from '$lib/state.svelte';
import type { AudioPlayOptions, TrainingMode } from '../types';

export const inversionMode: TrainingMode<InversionData> = {
  name: 'inversions',
  title: 'Inversion Training',
  items: inversions,
  levels: inversionLevels,
  settings: inversionSettings,
  playAudio: (item: InversionData, options: AudioPlayOptions) => {
    playInversion(item, options);
  },
  playArpeggiated: (item: InversionData, options: AudioPlayOptions) => {
    arpeggiateInversion(item, options);
  },
  getDisplayText: (item: InversionData) => item.displayText
};
