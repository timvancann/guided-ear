export type PlayMode = 'custom' | 'incremental' | 'recap';
export type PlayState = 'generating' | 'playing' | 'idle' | 'waiting' | 'answering' | 'finished';

export interface TrainingSettings {
  randomRoot: boolean;
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

export interface TrainingItem {
  id: string;
  enabled: boolean;
  level?: number;
}

export interface TrainingLevel {
  name: string;
  level: number;
}

export interface AudioPlayOptions {
  tonic?: string;
  duration?: number;
  increment?: boolean;
  callback?: () => void;
}

export interface TrainingMode<T extends TrainingItem> {
  name: string;
  title: string;
  items: T[];
  levels: TrainingLevel[];
  settings: TrainingSettings;
  playAudio: (item: T, options: AudioPlayOptions) => void;
  playArpeggiated: (item: T, options: AudioPlayOptions) => void;
  getDisplayText: (item: T) => string;
}

