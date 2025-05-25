import type { TrainingSettings } from './training/types';
import { createPersistedState } from './storage.svelte';

interface GlobalSettings {
  velocity: number;
  voiceVolume: number;
}

// Create persisted global settings
const globalSettingsState = createPersistedState(
  'guided-ear-global-settings',
  { velocity: 127, voiceVolume: 0.5 } as GlobalSettings
);

export const globalSettings = globalSettingsState;

// Create persisted training settings
const intervalSettingsState = createPersistedState('guided-ear-interval-settings', {
  randomRoot: true,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: true,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental' as const,
  progress: 0,
  timeBetweenExercises: 2,
  totalExercises: 12,
  waitingTimeSeconds: 2,
  chordDuration: 1.5,
  noteDuration: 0.4
} as TrainingSettings);

const chordSettingsState = createPersistedState('guided-ear-chord-settings', {
  randomRoot: false,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: true,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental' as const,
  progress: 0,
  timeBetweenExercises: 2,
  totalExercises: 12,
  waitingTimeSeconds: 3,
  chordDuration: 1.5,
  noteDuration: 0.4
} as TrainingSettings);

const inversionSettingsState = createPersistedState('guided-ear-inversion-settings', {
  randomRoot: true,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: true,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental' as const,
  progress: 0,
  timeBetweenExercises: 2,
  totalExercises: 12,
  waitingTimeSeconds: 3,
  chordDuration: 1.5,
  noteDuration: 0.4
} as TrainingSettings);

const progressionSettingsState = createPersistedState('guided-ear-progression-settings', {
  randomRoot: true,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: false,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental' as const,
  progress: 0,
  timeBetweenExercises: 3,
  totalExercises: 8,
  waitingTimeSeconds: 5,
  chordDuration: 0.5,
  noteDuration: 0.6
} as TrainingSettings);

export const intervalSettings = intervalSettingsState;
export const chordSettings = chordSettingsState;
export const inversionSettings = inversionSettingsState;
export const progressionSettings = progressionSettingsState;
