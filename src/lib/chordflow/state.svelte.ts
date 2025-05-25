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

export const chordFlowState = $state<ChordFlowState>({
  settings: {
    barsPerChord: 2,
    progressionType: 'fourths',
    currentChord: 'B',
    nextChord: 'E',
    selectedQualities: ['', 'm', '7'], // Default: Major, Minor, Dominant 7th
    diatonicKey: 'C',
    diatonicOption: 'incremental',
    customProgression: 'C Am F G'
  },
  currentBar: 0,
  barsSinceLastChord: 0,
  isChordChangeReady: false
});

export function setBarsPerChord(bars: number) {
  if (bars >= 1 && bars <= 8) {
    chordFlowState.settings.barsPerChord = bars;
    resetChordProgress();
  }
}

export function setProgressionType(type: 'fourths' | 'random' | 'diatonic' | 'custom') {
  if (chordFlowState.settings.progressionType !== type) {
    chordFlowState.settings.progressionType = type;
    resetChordProgress();
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

  if (chordFlowState.barsSinceLastChord >= chordFlowState.settings.barsPerChord) {
    chordFlowState.isChordChangeReady = true;
  }
}

export function executeChordChange(newChord: string, nextChord: string) {
  chordFlowState.settings.currentChord = newChord;
  chordFlowState.settings.nextChord = nextChord;
  chordFlowState.barsSinceLastChord = 0;
  chordFlowState.isChordChangeReady = false;
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
}

export function setSelectedQualities(qualities: string[]) {
  chordFlowState.settings.selectedQualities = qualities.length > 0 ? qualities : [''];
}

export function setDiatonicKey(key: string) {
  chordFlowState.settings.diatonicKey = key;
  resetChordProgress();
}

export function setDiatonicOption(option: 'incremental' | 'random') {
  chordFlowState.settings.diatonicOption = option;
  resetChordProgress();
}

export function setCustomProgression(progression: string) {
  chordFlowState.settings.customProgression = progression;
  resetChordProgress();
}
