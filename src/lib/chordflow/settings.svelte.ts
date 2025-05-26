import { browser } from '$app/environment';

export interface ChordFlowPreset {
  id: string;
  name: string;
  description: string;
  category: 'practice' | 'song' | 'theory' | 'custom';
  settings: {
    // Progression settings
    progressionType: 'fourths' | 'random' | 'diatonic' | 'custom';
    selectedQualities: string[];
    diatonicKey: string;
    diatonicOption: 'incremental' | 'random';
    customProgression: string;
    barsPerChord: number;

    // Metronome settings
    bpm: number;
    timeSignature: '4/4' | '3/4' | '2/4';
    clickVolume: number;

    // Audio settings
    chordAudioEnabled: boolean;
    chordVolume: number;
    voicing: 'close' | 'open' | 'shell';
  };
  createdAt: number;
  lastUsed: number;
}

export interface ChordFlowSettingsState {
  currentPreset: string | null;
  presets: ChordFlowPreset[];
  autoSave: boolean;
  lastBackup: number | null;
}

// Default presets
const DEFAULT_PRESETS: ChordFlowPreset[] = [
  {
    id: 'jazz-practice',
    name: 'Jazz Practice',
    description: 'Perfect for jazz standards with complex chords',
    category: 'practice',
    settings: {
      progressionType: 'fourths',
      selectedQualities: ['', 'm', '7', 'maj7', 'm7'],
      diatonicKey: 'C',
      diatonicOption: 'incremental',
      customProgression: 'Cmaj7 Am7 Dm7 G7',
      barsPerChord: 2,
      bpm: 120,
      timeSignature: '4/4',
      clickVolume: 0.3,
      chordAudioEnabled: true,
      chordVolume: 0.8,
      voicing: 'shell'
    },
    createdAt: Date.now(),
    lastUsed: Date.now()
  },
  {
    id: 'pop-progressions',
    name: 'Pop Progressions',
    description: 'Common progressions in popular music',
    category: 'practice',
    settings: {
      progressionType: 'custom',
      selectedQualities: ['', 'm'],
      diatonicKey: 'C',
      diatonicOption: 'incremental',
      customProgression: 'C G Am F',
      barsPerChord: 4,
      bpm: 100,
      timeSignature: '4/4',
      clickVolume: 0.3,
      chordAudioEnabled: true,
      chordVolume: 0.6,
      voicing: 'close'
    },
    createdAt: Date.now(),
    lastUsed: Date.now()
  },
  {
    id: 'blues-study',
    name: 'Blues Study',
    description: '12-bar blues progression practice',
    category: 'practice',
    settings: {
      progressionType: 'custom',
      selectedQualities: ['7'],
      diatonicKey: 'C',
      diatonicOption: 'incremental',
      customProgression: 'C7 | C7 | C7 | C7 | F7 | F7 | C7 | C7 | G7 | F7 | C7 | G7',
      barsPerChord: 1,
      bpm: 80,
      timeSignature: '4/4',
      clickVolume: 0.4,
      chordAudioEnabled: true,
      chordVolume: 0.7,
      voicing: 'open'
    },
    createdAt: Date.now(),
    lastUsed: Date.now()
  },
  {
    id: 'scale-study',
    name: 'Scale Study',
    description: 'Diatonic chord relationships in all keys',
    category: 'theory',
    settings: {
      progressionType: 'diatonic',
      selectedQualities: ['', 'm', 'dim'],
      diatonicKey: 'C',
      diatonicOption: 'incremental',
      customProgression: 'C Am F G',
      barsPerChord: 2,
      bpm: 90,
      timeSignature: '4/4',
      clickVolume: 0.3,
      chordAudioEnabled: true,
      chordVolume: 0.5,
      voicing: 'close'
    },
    createdAt: Date.now(),
    lastUsed: Date.now()
  },
  {
    id: 'fast-practice',
    name: 'Fast Practice',
    description: 'High tempo for advanced players',
    category: 'practice',
    settings: {
      progressionType: 'random',
      selectedQualities: ['', 'm'],
      diatonicKey: 'C',
      diatonicOption: 'random',
      customProgression: 'C Am F G',
      barsPerChord: 1,
      bpm: 160,
      timeSignature: '4/4',
      clickVolume: 0.2,
      chordAudioEnabled: false,
      chordVolume: 0.5,
      voicing: 'close'
    },
    createdAt: Date.now(),
    lastUsed: Date.now()
  }
];

const STORAGE_KEY = 'chordflow-settings';
const PRESETS_KEY = 'chordflow-presets';

// Settings state
export const settingsState = $state<ChordFlowSettingsState>({
  currentPreset: null,
  presets: [],
  autoSave: true,
  lastBackup: null
});

// Initialize settings from localStorage
export function initializeSettings() {
  if (!browser) return;

  try {
    // Load main settings
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      Object.assign(settingsState, parsed);
    }

    // Load presets
    const savedPresets = localStorage.getItem(PRESETS_KEY);
    if (savedPresets) {
      settingsState.presets = JSON.parse(savedPresets);
    } else {
      // Initialize with default presets
      settingsState.presets = [...DEFAULT_PRESETS];
      savePresets();
    }
  } catch (error) {
    console.warn('Failed to load ChordFlow settings:', error);
    // Reset to defaults on error
    settingsState.presets = [...DEFAULT_PRESETS];
    settingsState.autoSave = true;
    settingsState.currentPreset = null;
  }
}

// Save settings to localStorage
export function saveSettings() {
  if (!browser) return;

  try {
    const toSave = {
      currentPreset: settingsState.currentPreset,
      autoSave: settingsState.autoSave,
      lastBackup: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    settingsState.lastBackup = Date.now();
  } catch (error) {
    console.warn('Failed to save ChordFlow settings:', error);
  }
}

// Save presets to localStorage
export function savePresets() {
  if (!browser) return;

  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(settingsState.presets));
  } catch (error) {
    console.warn('Failed to save ChordFlow presets:', error);
  }
}

// Create a new preset from current settings
export function createPreset(name: string, description: string, category: ChordFlowPreset['category'], currentSettings: ChordFlowPreset['settings']): ChordFlowPreset {
  const preset: ChordFlowPreset = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    category,
    settings: { ...currentSettings },
    createdAt: Date.now(),
    lastUsed: Date.now()
  };

  settingsState.presets.push(preset);
  savePresets();

  return preset;
}

// Load a preset
export function loadPreset(presetId: string): ChordFlowPreset | null {
  const preset = settingsState.presets.find((p) => p.id === presetId);
  if (preset) {
    preset.lastUsed = Date.now();
    settingsState.currentPreset = presetId;
    saveSettings();
    savePresets();
    return preset;
  }
  return null;
}

// Update an existing preset
export function updatePreset(presetId: string, updates: Partial): boolean {
  const index = settingsState.presets.findIndex((p) => p.id === presetId);
  if (index !== -1) {
    settingsState.presets[index] = { ...settingsState.presets[index], ...updates };
    savePresets();
    return true;
  }
  return false;
}

// Delete a preset
export function deletePreset(presetId: string): boolean {
  const index = settingsState.presets.findIndex((p) => p.id === presetId);
  if (index !== -1) {
    settingsState.presets.splice(index, 1);
    if (settingsState.currentPreset === presetId) {
      settingsState.currentPreset = null;
    }
    saveSettings();
    savePresets();
    return true;
  }
  return false;
}

// Duplicate a preset
export function duplicatePreset(presetId: string, newName?: string): ChordFlowPreset | null {
  const original = settingsState.presets.find((p) => p.id === presetId);
  if (original) {
    return createPreset(newName || `${original.name} (Copy)`, original.description, original.category, { ...original.settings });
  }
  return null;
}

// Export presets to JSON
export function exportPresets(): string {
  return JSON.stringify(
    {
      version: '1.0',
      exported: Date.now(),
      presets: settingsState.presets.filter((p) => !p.id.startsWith('default-')),
      settings: {
        autoSave: settingsState.autoSave
      }
    },
    null,
    2
  );
}

// Import presets from JSON
export function importPresets(jsonData: string): { success: boolean; imported: number; errors: string[] } {
  const result = { success: false, imported: 0, errors: [] as string[] };

  try {
    const data = JSON.parse(jsonData);

    if (!data.presets || !Array.isArray(data.presets)) {
      result.errors.push('Invalid format: missing presets array');
      return result;
    }

    for (const presetData of data.presets) {
      try {
        // Validate preset structure
        if (!presetData.name || !presetData.settings) {
          result.errors.push(`Skipped invalid preset: ${presetData.name || 'unnamed'}`);
          continue;
        }

        // Create imported preset with new ID
        const preset: ChordFlowPreset = {
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: presetData.name,
          description: presetData.description || '',
          category: presetData.category || 'custom',
          settings: { ...presetData.settings },
          createdAt: Date.now(),
          lastUsed: Date.now()
        };

        settingsState.presets.push(preset);
        result.imported++;
      } catch {
        result.errors.push(`Failed to import preset: ${presetData.name || 'unnamed'}`);
      }
    }

    if (result.imported > 0) {
      savePresets();
      result.success = true;
    }
  } catch {
    result.errors.push('Failed to parse JSON data');
  }

  return result;
}

// Reset to default presets
export function resetToDefaults() {
  settingsState.presets = [...DEFAULT_PRESETS];
  settingsState.currentPreset = null;
  settingsState.autoSave = true;
  saveSettings();
  savePresets();
}

// Get presets by category
export function getPresetsByCategory(category: ChordFlowPreset['category']): ChordFlowPreset[] {
  return settingsState.presets.filter((p) => p.category === category);
}

// Get recently used presets
export function getRecentPresets(limit: number = 5): ChordFlowPreset[] {
  return [...settingsState.presets].sort((a, b) => b.lastUsed - a.lastUsed).slice(0, limit);
}

// Search presets
export function searchPresets(query: string): ChordFlowPreset[] {
  const lowercaseQuery = query.toLowerCase();
  return settingsState.presets.filter((p) => p.name.toLowerCase().includes(lowercaseQuery) || p.description.toLowerCase().includes(lowercaseQuery));
}

// Auto-save current settings if enabled
export function autoSaveCurrentSettings(currentSettings: ChordFlowPreset['settings']) {
  if (!settingsState.autoSave || !settingsState.currentPreset) return;

  const currentPreset = settingsState.presets.find((p) => p.id === settingsState.currentPreset);
  if (currentPreset) {
    currentPreset.settings = { ...currentSettings };
    currentPreset.lastUsed = Date.now();
    savePresets();
  }
}

// Clear all data
export function clearAllData() {
  if (!browser) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PRESETS_KEY);
    settingsState.presets = [...DEFAULT_PRESETS];
    settingsState.currentPreset = null;
    settingsState.autoSave = true;
    settingsState.lastBackup = null;
  } catch (error) {
    console.warn('Failed to clear ChordFlow data:', error);
  }
}

// Get favorite presets (recently used + high-rated)
export function getFavoritePresets(limit: number = 4): ChordFlowPreset[] {
  return getRecentPresets(limit);
}

// Alias for auto-save
export function autoSave(currentSettings: ChordFlowPreset['settings']) {
  autoSaveCurrentSettings(currentSettings);
}

// Settings manager object for easier imports
export const chordFlowSettings = {
  // State
  get state() {
    return settingsState;
  },

  // Core functions
  initialize: initializeSettings,
  save: saveSettings,

  // Preset management
  createPreset,
  loadPreset,
  updatePreset,
  deletePreset,
  duplicatePreset,

  // Queries
  getPresetsByCategory,
  getRecentPresets,
  getFavoritePresets,
  searchPresets,

  // Auto-save
  autoSave,
  autoSaveCurrentSettings,

  // Import/Export
  exportPresets,
  importPresets,

  // Utilities
  clearAllData
};
