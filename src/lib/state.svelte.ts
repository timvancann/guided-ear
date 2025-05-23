import type { TrainingSettings } from './training/types';

interface GlobalSettings {
  velocity: number;
  voiceVolume: number;
}

export const globalSettings: GlobalSettings = $state({
  velocity: 127,
  voiceVolume: 0.5
});

export const intervalSettings: TrainingSettings = $state({
  randomRoot: true,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: true,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental',
  progress: 0,
  timeBetweenExercises: 2,
  totalExercises: 12,
  waitingTimeSeconds: 3,
  chordDuration: 2.5,
  noteDuration: 0.8
});

export const chordSettings: TrainingSettings = $state({
  randomRoot: false,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: true,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental',
  progress: 0,
  timeBetweenExercises: 2,
  totalExercises: 12,
  waitingTimeSeconds: 3,
  chordDuration: 2.5,
  noteDuration: 0.8
});

export const inversionSettings: TrainingSettings = $state({
  randomRoot: true,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: true,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental',
  progress: 0,
  timeBetweenExercises: 2,
  totalExercises: 12,
  waitingTimeSeconds: 3,
  chordDuration: 2.5,
  noteDuration: 0.8
});
