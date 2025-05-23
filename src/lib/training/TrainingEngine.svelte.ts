import { audioState } from '$lib/audioplayer.svelte';
import { globalSettings } from '$lib/state.svelte';
import type { PlayState, TrainingItem, TrainingMode } from './types';

export class TrainingEngine<T extends TrainingItem> {
  playState: PlayState = $state('idle');
  started = $state(false);
  currentItem: T | null = $state(null);
  private playingItemId: string | null = null;

  constructor(private mode: TrainingMode<T>) {}

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
      audioState.speech?.cancel();
      audioState.player?.stop();
    } else {
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
      const utterance = new SpeechSynthesisUtterance(this.mode.getDisplayText(this.currentItem));
      utterance.pitch = 1.2;
      utterance.rate = 0.8;
      utterance.volume = globalSettings.voiceVolume;
      utterance.onend = () => {
        this.switchState('answering', 'finished');
      };
      audioState.speech?.speak(utterance);
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
}

