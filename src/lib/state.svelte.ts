export interface PracticeState {
  currentLevel: number
  isRecap: boolean
}
export const practiceState = $state({
  currentLevel: 0,
  isRecap: false
})

type PlayMode = 'custom' | 'incremental' | 'recap';
interface ChordSettings {
  currentLevel: number
  arpegiateChords: boolean
  autoIncrement: boolean
  continuousMode: boolean
  incrementalMode: boolean
  progress: number
  totalExercises: number
  waitingTimeSeconds: number
  timeBetweenExercises: number
  playMode: PlayMode
  velocity: number
  voiceVolume: number
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
  velocity: 127,
  voiceVolume: 0.5,
})
