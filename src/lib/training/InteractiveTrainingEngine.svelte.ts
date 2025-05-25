import { audioState } from '$lib/audioplayer.svelte';
import type { PlayState, TrainingItem, TrainingMode } from './types';
import { storage, createDefaultStats } from '../storage.svelte';

// Extended play state for interactive mode
export type InteractivePlayState = PlayState | 'selecting' | 'feedback';

// Statistics tracking interface
export interface InteractiveStats {
  totalAnswers: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number;
  currentStreak: number;
  bestStreak: number;
  responses: Array<{
    item: TrainingItem;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    responseTime: number;
    timestamp: number;
  }>;
}

export class InteractiveTrainingEngine<T extends TrainingItem> {
  playState: InteractivePlayState = $state('idle');
  started = $state(false);
  currentItem: T | null = $state(null);
  showFeedback = $state(false);
  lastAnswerCorrect: boolean | null = $state(null);
  selectedAnswer: string | null = $state(null);
  
  // Statistics
  stats: InteractiveStats = $state({
    totalAnswers: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageResponseTime: 0,
    currentStreak: 0,
    bestStreak: 0,
    responses: []
  });

  private playingItemId: string | null = null;
  private selectionStartTime: number | null = null;

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

  get accuracy() {
    return this.stats.totalAnswers > 0 ? (this.stats.correctAnswers / this.stats.totalAnswers) * 100 : 0;
  }

  // Get answer options for current item (for multiple choice)
  get answerOptions(): string[] {
    if (!this.currentItem) return [];
    
    // Get all possible answers from the current level or all items
    const allItems = this.mode.settings.playMode === 'incremental' 
      ? this.itemsInLevel 
      : this.activeItems;
    
    const correctAnswer = this.mode.getDisplayText(this.currentItem);
    const otherAnswers = allItems
      .filter(item => this.mode.getDisplayText(item) !== correctAnswer)
      .map(item => this.mode.getDisplayText(item)); // Take all available options
    
    // Create all unique options and sort them consistently
    const allOptions = Array.from(new Set([correctAnswer, ...otherAnswers]));
    return this.sortChordNames(allOptions);
  }

  private sortChordNames(chordNames: string[]): string[] {
    // Define the musical order for chord types
    const chordOrder = [
      'maj',     // Major
      'm',       // Minor  
      'dim',     // Diminished
      'aug',     // Augmented
      '5',       // Power chord
      'sus2',    // Suspended 2nd
      'sus4',    // Suspended 4th
      '7',       // Dominant 7th
      'maj7',    // Major 7th
      'm7',      // Minor 7th
      'm7♭5',    // Half-diminished 7th
      'dim7',    // Diminished 7th
      'mMaj7',   // Minor Major 7th
      '9',       // Dominant 9th
      'maj9',    // Major 9th
      'm9',      // Minor 9th
      'maj11',   // Major 11th
      'm11',     // Minor 11th
      'add9',    // Add 9th
      'add13'    // Add 13th
    ];
    
    return chordNames.sort((a, b) => {
      const indexA = chordOrder.indexOf(a);
      const indexB = chordOrder.indexOf(b);
      
      // If both chords are in our order list, sort by that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in the list, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the list, sort alphabetically
      return a.localeCompare(b);
    });
  }

  private randomItem() {
    const items = this.activeItems;
    if (items.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    this.currentItem = items[randomIndex];
  }

  private switchState(from: InteractivePlayState, to: InteractivePlayState) {
    if (this.playState === from) {
      this.playState = to;
    }
  }

  togglePlay() {
    this.started = !this.started;
    if (this.isPlaying) {
      this.playState = 'idle';
      audioState.player?.stop();
    } else {
      this.playState = 'generating';
    }
  }

  // User selects an answer
  selectAnswer(answer: string) {
    if (this.playState !== 'selecting' || !this.currentItem) return;

    this.selectedAnswer = answer;
    const correctAnswer = this.mode.getDisplayText(this.currentItem);
    const isCorrect = answer === correctAnswer;
    const responseTime = this.selectionStartTime ? Date.now() - this.selectionStartTime : 0;

    this.lastAnswerCorrect = isCorrect;
    
    // Update statistics
    this.updateStats(this.currentItem, answer, correctAnswer, isCorrect, responseTime);
    
    // Progress the exercise
    if (this.mode.settings.playMode !== 'custom' && this.started) {
      this.mode.settings.progress += 1;
    }

    this.switchState('selecting', 'feedback');
  }

  private updateStats(item: T, selectedAnswer: string, correctAnswer: string, isCorrect: boolean, responseTime: number) {
    this.stats.totalAnswers++;
    
    if (isCorrect) {
      this.stats.correctAnswers++;
      this.stats.currentStreak++;
      if (this.stats.currentStreak > this.stats.bestStreak) {
        this.stats.bestStreak = this.stats.currentStreak;
      }
    } else {
      this.stats.incorrectAnswers++;
      this.stats.currentStreak = 0;
    }

    // Update average response time
    const totalTime = this.stats.averageResponseTime * (this.stats.totalAnswers - 1) + responseTime;
    this.stats.averageResponseTime = totalTime / this.stats.totalAnswers;

    // Add to responses history
    this.stats.responses.push({
      item,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      responseTime,
      timestamp: Date.now()
    });

    // Keep only last 100 responses
    if (this.stats.responses.length > 100) {
      this.stats.responses.shift();
    }
    
    // Save stats to localStorage
    this.saveStats();
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

  private loadStats() {
    if (typeof window === 'undefined') return;
    
    const stored = storage.load();
    if (stored?.interactiveStats?.[this.mode.name as keyof typeof stored.interactiveStats]) {
      this.stats = stored.interactiveStats[this.mode.name as keyof typeof stored.interactiveStats];
    } else {
      this.stats = createDefaultStats();
    }
  }

  private saveStats() {
    if (typeof window === 'undefined') return;
    
    const existing = storage.load() || {};
    if (!existing.interactiveStats) {
      existing.interactiveStats = {
        chords: createDefaultStats(),
        intervals: createDefaultStats(),
        inversions: createDefaultStats(),
        progressions: createDefaultStats()
      };
    }
    
    existing.interactiveStats[this.mode.name as keyof typeof existing.interactiveStats] = this.stats;
    storage.save(existing);
  }

  // Method to reset stats
  resetStats() {
    this.stats = createDefaultStats();
    this.saveStats();
  }

  private handleGenerating() {
    if (this.playState === 'generating') {
      this.randomItem();
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
                        this.selectionStartTime = Date.now();
                        this.switchState('playing', 'selecting');
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
                this.selectionStartTime = Date.now();
                this.switchState('playing', 'selecting');
              }
            });
          }
        });
      }
    }
  }

  private handleFeedback() {
    if (this.playState === 'feedback') {
      this.showFeedback = true;
      setTimeout(() => {
        this.showFeedback = false;
        this.selectedAnswer = null;
        this.lastAnswerCorrect = null;
        this.switchState('feedback', 'idle');
      }, 1500); // Show feedback for 1.5 seconds
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
    this.handleFeedback();
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

}