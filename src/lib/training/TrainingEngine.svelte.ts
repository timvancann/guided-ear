import { audioState } from '$lib/audioplayer.svelte';
import { cancelSpeech, speak } from '$lib/speech.svelte';
import type { PlayState, TrainingItem, TrainingMode } from './types';
import { storage, createDefaultStats } from '../storage.svelte';

export interface HandsfreeStats {
  totalExercises: number;
  completedSessions: number;
  totalPracticeTime: number; // in seconds
  lastSessionDate: number;
  exerciseHistory: Array<{
    timestamp: number;
    level: number;
    playMode: string;
    exerciseCount: number;
    duration: number;
  }>;
}

export class TrainingEngine<T extends TrainingItem> {
  playState: PlayState = $state('idle');
  started = $state(false);
  currentItem: T | null = $state(null);
  private playingItemId: string | null = null;
  
  // Handsfree training stats
  stats: HandsfreeStats = $state({
    totalExercises: 0,
    completedSessions: 0,
    totalPracticeTime: 0,
    lastSessionDate: 0,
    exerciseHistory: []
  });
  
  private sessionStartTime: number | null = null;
  private sessionExerciseCount = 0;

  constructor(private mode: TrainingMode<T>) {
    this.loadStats();
  }

  get isPlaying() {
    return this.playState !== 'idle';
  }

  get selectedItems() {
    return this.mode.items.filter((item) => item.enabled);
  }

  get itemsInLevel() {
    return this.mode.items.filter((item) => item.level === this.mode.settings.currentLevel);
  }

  get activeItems(): T[] {
    if (this.mode.settings.playMode === 'incremental') {
      return this.mode.items.filter((item) => item.level === this.mode.settings.currentLevel);
    } else if (this.mode.settings.playMode === 'recap') {
      return this.mode.items.filter((item) => item.level && item.level <= this.mode.settings.currentLevel);
    } else {
      return this.selectedItems;
    }
  }

  private randomItem() {
    const items = this.activeItems;
    if (items.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    this.currentItem = items[randomIndex];
  }

  private switchState(from: PlayState, to: PlayState) {
    if (this.playState === from) {
      this.playState = to;
    }
  }

  togglePlay() {
    this.started = !this.started;
    if (this.isPlaying) {
      this.playState = 'idle';
      cancelSpeech();
      audioState.player?.stop();
      this.endSession();
    } else {
      this.startSession();
      this.playState = 'generating';
    }
  }

  incrementLevel() {
    this.mode.settings.progress = 0;
    if (this.mode.settings.playMode === 'recap') {
      if (this.mode.settings.currentLevel === this.mode.levels.length) return;
      this.mode.settings.currentLevel += 1;
      this.mode.settings.playMode = 'incremental';
    } else if (this.mode.settings.playMode === 'incremental') {
      this.mode.settings.playMode = 'recap';
    }
  }

  decrementLevel() {
    this.mode.settings.progress = 0;
    if (this.mode.settings.playMode === 'recap') {
      this.mode.settings.playMode = 'incremental';
    } else if (this.mode.settings.playMode === 'incremental') {
      if (this.mode.settings.currentLevel === 1) return;
      this.mode.settings.currentLevel -= 1;
      this.mode.settings.playMode = 'recap';
    }
  }

  private handleGenerating() {
    if (this.playState === 'generating') {
      this.randomItem();
      if (this.mode.settings.playMode !== 'custom' && this.started) {
        this.mode.settings.progress += 1;
      }
      this.switchState('generating', 'playing');
    }
  }

  private getTonic() {
    if (this.mode.settings.randomRoot) {
      const roots = ['F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4'];
      const randomIndex = Math.floor(Math.random() * roots.length);
      return roots[randomIndex];
    }
    return 'C4';
  }

  private handlePlaying() {
    // Get the tonic once and use it throughout this play sequence
    if (this.playState === 'playing' && this.currentItem) {
      // Prevent double playing of the same item
      const currentItemId = JSON.stringify(this.currentItem);
      if (this.playingItemId === currentItemId) {
        return;
      }
      this.playingItemId = currentItemId;

      const tonic = this.getTonic();
      const options = { tonic };

      if (this.mode.settings.arpegiateChords) {
        this.mode.playArpeggiated(this.currentItem, {
          ...options,
          callback: () => {
            if (!this.isPlaying) return;
            this.mode.playAudio(this.currentItem!, {
              ...options,
              callback: () => {
                if (!this.isPlaying) return;
                this.mode.playArpeggiated(this.currentItem!, {
                  increment: false,
                  ...options,
                  callback: () => {
                    if (!this.isPlaying) return;
                    this.mode.playAudio(this.currentItem!, {
                      ...options,
                      callback: () => {
                        this.playingItemId = null;
                        this.switchState('playing', 'waiting');
                      }
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        this.mode.playAudio(this.currentItem, {
          ...options,
          callback: () => {
            if (!this.isPlaying) return;
            this.mode.playAudio(this.currentItem!, {
              ...options,
              callback: () => {
                this.playingItemId = null;
                this.switchState('playing', 'waiting');
              }
            });
          }
        });
      }
    }
  }

  private handleAnswering() {
    if (this.playState === 'answering' && this.currentItem) {
      speak(this.currentItem.speech, {
        onEnd: () => {
          this.switchState('answering', 'finished');
        }
      });
    }
  }

  private handleWaiting() {
    if (this.playState === 'waiting') {
      setTimeout(() => {
        this.switchState('waiting', 'answering');
      }, this.mode.settings.waitingTimeSeconds * 1000);
    }
  }

  private handleFinished() {
    if (this.playState === 'finished') {
      this.recordExercise();
      this.mode.settings.progress += 1;
      setTimeout(() => {
        this.switchState('finished', 'idle');
      }, this.mode.settings.timeBetweenExercises * 1000);
    }
  }

  private handleIdle() {
    if (this.playState === 'idle') {
      if (this.mode.settings.progress >= this.mode.settings.totalExercises) {
        if (this.mode.settings.autoIncrement) {
          this.mode.settings.progress = 0;
          if (this.mode.settings.playMode === 'incremental') {
            this.mode.settings.playMode = 'recap';
          } else if (this.mode.settings.playMode === 'recap') {
            this.mode.settings.playMode = 'incremental';
            this.mode.settings.currentLevel += 1;
          }
        }
      }
      if (this.mode.settings.continuousMode && this.started) {
        this.switchState('idle', 'generating');
      }
    }
  }

  // Effect handlers - these should be called from $effect in components
  handleStateEffects() {
    this.handleGenerating();
    this.handlePlaying();
    this.handleAnswering();
    this.handleWaiting();
    this.handleFinished();
    this.handleIdle();
  }

  // Effect for play mode sync
  handlePlayModeSync() {
    if (this.mode.settings.incrementalMode) {
      this.mode.settings.playMode = 'incremental';
    } else {
      this.mode.settings.playMode = 'custom';
    }
  }

  // Statistics methods
  private loadStats() {
    if (typeof window === 'undefined') return;
    
    const stored = storage.load();
    const statsKey = `handsfree_${this.mode.name}` as keyof typeof stored;
    
    if (stored?.[statsKey]) {
      this.stats = stored[statsKey] as HandsfreeStats;
    } else {
      this.stats = {
        totalExercises: 0,
        completedSessions: 0,
        totalPracticeTime: 0,
        lastSessionDate: 0,
        exerciseHistory: []
      };
    }
  }

  private saveStats() {
    if (typeof window === 'undefined') return;
    
    const existing = storage.load() || {};
    const statsKey = `handsfree_${this.mode.name}`;
    existing[statsKey as keyof typeof existing] = this.stats as any;
    storage.save(existing);
  }

  startSession() {
    this.sessionStartTime = Date.now();
    this.sessionExerciseCount = 0;
  }

  endSession() {
    if (this.sessionStartTime) {
      const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      
      this.stats.completedSessions++;
      this.stats.totalPracticeTime += duration;
      this.stats.lastSessionDate = Date.now();
      
      // Add to history
      this.stats.exerciseHistory.push({
        timestamp: Date.now(),
        level: this.mode.settings.currentLevel,
        playMode: this.mode.settings.playMode,
        exerciseCount: this.sessionExerciseCount,
        duration
      });
      
      // Keep only last 50 sessions
      if (this.stats.exerciseHistory.length > 50) {
        this.stats.exerciseHistory = this.stats.exerciseHistory.slice(-50);
      }
      
      this.saveStats();
      this.sessionStartTime = null;
    }
  }

  recordExercise() {
    this.stats.totalExercises++;
    this.sessionExerciseCount++;
    this.saveStats();
  }

  resetStats() {
    this.stats = {
      totalExercises: 0,
      completedSessions: 0,
      totalPracticeTime: 0,
      lastSessionDate: 0,
      exerciseHistory: []
    };
    this.saveStats();
  }
}
