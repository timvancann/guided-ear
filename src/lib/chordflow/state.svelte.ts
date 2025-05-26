export interface ChordFlowSettings {
  barsPerChord: number;
  progressionType: 'fourths' | 'random' | 'diatonic' | 'custom';
  currentChord: string;
  nextChord: string;
  selectedQualities: string[];
  diatonicKey: string;
  diatonicOption: 'incremental' | 'random';
  customProgression: string;
}

export interface ChordFlowState {
  settings: ChordFlowSettings;
  currentBar: number;
  barsSinceLastChord: number;
  isChordChangeReady: boolean;
}

import { createPersistedState } from '../storage.svelte';

// Create persisted ChordFlow settings
const chordFlowSettingsState = createPersistedState('guided-ear-chordflow-settings', {
  barsPerChord: 2,
  progressionType: 'fourths' as const,
  currentChord: 'B',
  nextChord: 'E',
  selectedQualities: ['', 'm', '7'], // Default: Major, Minor, Dominant 7th
  diatonicKey: 'C',
  diatonicOption: 'incremental' as const,
  customProgression: 'C Am F G'
} as ChordFlowSettings);

export const chordFlowState = $state<ChordFlowState>({
  settings: chordFlowSettingsState.value,
  currentBar: 0,
  barsSinceLastChord: 0,
  isChordChangeReady: false
});

// Update the persisted state when settings change
export function updateChordFlowSettings() {
  chordFlowSettingsState.value = chordFlowState.settings;
}

export function setBarsPerChord(bars: number) {
  if (bars >= 1 && bars <= 8) {
    chordFlowState.settings.barsPerChord = bars;
    resetChordProgress();
    updateChordFlowSettings();
  }
}

export function setProgressionType(type: 'fourths' | 'random' | 'diatonic' | 'custom') {
  if (chordFlowState.settings.progressionType !== type) {
    chordFlowState.settings.progressionType = type;
    resetChordProgress();
    updateChordFlowSettings();
  }
}

export function resetChordProgress() {
  chordFlowState.currentBar = 0;
  chordFlowState.barsSinceLastChord = 0;
  chordFlowState.isChordChangeReady = false;
}

export function advanceBar() {
  chordFlowState.currentBar++;
  chordFlowState.barsSinceLastChord++;
}

export function executeChordChange(newChord: string, nextChord: string) {
  chordFlowState.settings.currentChord = newChord;
  chordFlowState.settings.nextChord = nextChord;
  chordFlowState.barsSinceLastChord = 0;
  chordFlowState.isChordChangeReady = false;
  updateChordFlowSettings();
}

export function toggleQuality(quality: string) {
  const qualities = chordFlowState.settings.selectedQualities;
  const index = qualities.indexOf(quality);

  if (index === -1) {
    // Add quality
    qualities.push(quality);
  } else {
    // Remove quality (but keep at least one)
    if (qualities.length > 1) {
      qualities.splice(index, 1);
    }
  }
  updateChordFlowSettings();
}

export function setSelectedQualities(qualities: string[]) {
  chordFlowState.settings.selectedQualities = qualities.length > 0 ? qualities : [''];
  updateChordFlowSettings();
}

export function setDiatonicKey(key: string) {
  chordFlowState.settings.diatonicKey = key;
  resetChordProgress();
  updateChordFlowSettings();
}

export function setDiatonicOption(option: 'incremental' | 'random') {
  chordFlowState.settings.diatonicOption = option;
  resetChordProgress();
  updateChordFlowSettings();
}

export function setCustomProgression(progression: string) {
  chordFlowState.settings.customProgression = progression;
  resetChordProgress();
  updateChordFlowSettings();
}
