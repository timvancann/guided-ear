import type { ChordFlowSettings } from './chordflow/state.svelte';
import type { InteractiveStats } from './training/InteractiveTrainingEngine.svelte';
import type { TrainingSettings } from './training/types';

export interface StorageData {
  globalSettings: {
    velocity: number;
    voiceVolume: number;
  };
  trainingSettings: {
    intervals: TrainingSettings;
    chords: TrainingSettings;
    inversions: TrainingSettings;
    progressions: TrainingSettings;
  };
  chordFlowSettings: ChordFlowSettings;
  interactiveStats: {
    chords: InteractiveStats;
    intervals: InteractiveStats;
    inversions: InteractiveStats;
    progressions: InteractiveStats;
  };
  chordCategories: {
    [categoryName: string]: {
      expanded: boolean;
      chords: Array;
    };
  };
  intervals: Array;
  inversions: Array;
}

class LocalStorageManager {
  private readonly STORAGE_KEY = 'guided-ear-settings';
  private readonly STORAGE_VERSION = '1.0';

  // Load data from localStorage
  load(): Partial | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);

      // Version check - migrate if needed
      if (data.version !== this.STORAGE_VERSION) {
        console.log('Storage version mismatch, migrating...');
        return this.migrate(data);
      }

      return data.data;
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      return null;
    }
  }

  // Save data to localStorage
  save(data: Partial): void {
    if (typeof window === 'undefined') return;

    try {
      const storageObject = {
        version: this.STORAGE_VERSION,
        timestamp: Date.now(),
        data
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageObject));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }

  // Update specific section
  updateSection<K extends keyof StorageData>(section: K, data: StorageData[K]): void {
    const existing = this.load() || {};
    existing[section] = data;
    this.save(existing);
  }

  // Clear all data
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Migrate from older versions
  private migrate(oldData: any): Partial | null {
    // For now, just return null to use defaults
    // In the future, implement migration logic here
    console.log('Migration not implemented, using defaults');
    return null;
  }

  // Export settings as JSON for backup
  export(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  // Import settings from JSON
  import(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      this.save(data);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }
}

export const storage = new LocalStorageManager();

// Reactive storage utilities for Svelte 5
export function createPersistedState<T>(key: string, defaultValue: T, serialize?: (value: T) => string, deserialize?: (value: string) => T) {
  // Get initial value from localStorage
  const getInitialValue = (): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return deserialize ? deserialize(item) : JSON.parse(item);
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  let value = $state(getInitialValue());

  return {
    get value() {
      return value;
    },
    set value(newValue: T) {
      value = newValue;

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          const serialized = serialize ? serialize(newValue) : JSON.stringify(newValue);
          localStorage.setItem(key, serialized);
        } catch (error) {
          console.error(`Failed to save ${key} to localStorage:`, error);
        }
      }
    }
  };
}

// Utility to create default stats
export function createDefaultStats(): InteractiveStats {
  return {
    totalAnswers: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageResponseTime: 0,
    currentStreak: 0,
    bestStreak: 0,
    responses: []
  };
}
