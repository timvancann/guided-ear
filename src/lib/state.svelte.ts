type PlayMode = 'custom' | 'incremental' | 'recap';

interface GlobalSettings {
  velocity: number;
  voiceVolume: number;
}

export const globalSettings: GlobalSettings = $state({
  velocity: 127,
  voiceVolume: 0.5
});

interface IntervalSettings {
  arpegiateChords: boolean;
  autoIncrement: boolean;
  chordDuration: number;
  continuousMode: boolean;
  currentLevel: number;
  incrementalMode: boolean;
  noteDuration: number;
  playMode: PlayMode;
  progress: number;
  timeBetweenExercises: number;
  totalExercises: number;
  waitingTimeSeconds: number;
}

export const intervalSettings: IntervalSettings = $state({
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

interface ChordSettings {
  arpegiateChords: boolean;
  autoIncrement: boolean;
  chordDuration: number;
  continuousMode: boolean;
  currentLevel: number;
  incrementalMode: boolean;
  noteDuration: number;
  playMode: PlayMode;
  progress: number;
  timeBetweenExercises: number;
  totalExercises: number;
  waitingTimeSeconds: number;
}

export const chordSettings: ChordSettings = $state({
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
