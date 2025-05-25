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
  waitingTimeSeconds: 2,
  chordDuration: 1.5,
  noteDuration: 0.4
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
  chordDuration: 1.5,
  noteDuration: 0.4
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
  chordDuration: 1.5,
  noteDuration: 0.4
});

export const progressionSettings: TrainingSettings = $state({
  randomRoot: true,
  autoIncrement: false,
  continuousMode: true,
  arpegiateChords: false,
  incrementalMode: true,
  currentLevel: 1,
  playMode: 'incremental',
  progress: 0,
  timeBetweenExercises: 3, // Slightly longer for progressions
  totalExercises: 8, // Fewer exercises since progressions are longer
  waitingTimeSeconds: 5, // More time to think about progressions
  chordDuration: 0.5,
  noteDuration: 0.6
});
