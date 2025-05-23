import { playInversion, arpeggiateInversion } from '$lib/audioplayer.svelte';
import { inversions, inversionLevels, type InversionData } from '$lib/settings.svelte';
import { inversionSettings } from '$lib/state.svelte';
import type { TrainingMode, AudioPlayOptions } from '../types';

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
  getDisplayText: (item: InversionData) => item.id
}