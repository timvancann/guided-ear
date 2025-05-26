<script lang="ts">
  import { Download, Upload, Trash2, Copy, Plus, Search, Clock, Star, Folder, Music, BookOpen, User } from '@lucide/svelte';
  import type { ChordFlowPreset } from '$lib/chordflow/settings.svelte';
  import {
    settingsState,
    createPreset,
    loadPreset,
    deletePreset,
    duplicatePreset,
    exportPresets,
    importPresets,
    resetToDefaults,
    getPresetsByCategory,
    getRecentPresets,
    searchPresets
  } from '$lib/chordflow/settings.svelte';

  interface Props {
    currentSettings?: ChordFlowPreset['settings'];
    onLoadPreset?: (preset: ChordFlowPreset) => void;
  }

  let { currentSettings, onLoadPreset }: Props = $props();

  // UI State
  let showCreateModal = $state(false);
  let showImportExport = $state(false);
  let searchQuery = $state('');
  let selectedCategory = $state<ChordFlowPreset['category'] | 'all' | 'recent'>('all');

  // Create preset form
  let newPresetName = $state('');
  let newPresetDescription = $state('');
  let newPresetCategory = $state<ChordFlowPreset['category']>('custom');

  // Import/export state
  let importData = $state('');
  let importResult = $state<{ success: boolean; imported: number; errors: string[] } | null>(null);

  // Filtered presets
  let filteredPresets: ChordFlowPreset[] = $derived.by(() => {
    let presets: ChordFlowPreset[] = settingsState.presets;

    // Filter by category
    if (selectedCategory === 'recent') {
      presets = getRecentPresets();
    } else if (selectedCategory !== 'all') {
      presets = getPresetsByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      presets = searchPresets(searchQuery);
    }

    return presets;
  });

  // Category icons
  const categoryIcons = {
    practice: Music,
    song: Star,
    theory: BookOpen,
    custom: User,
    all: Folder,
    recent: Clock
  };

  // Category counts
  let categoryCounts = $derived(() => ({
    all: settingsState.presets.length,
    recent: getRecentPresets().length,
    practice: getPresetsByCategory('practice').length,
    song: getPresetsByCategory('song').length,
    theory: getPresetsByCategory('theory').length,
    custom: getPresetsByCategory('custom').length
  }));

  function handleCreatePreset() {
    if (!newPresetName.trim()) return;

    // Create default complete settings if not provided
    const completeSettings = currentSettings || {
      progressionType: 'fourths' as const,
      selectedQualities: ['', 'm', '7'],
      diatonicKey: 'C',
      diatonicOption: 'incremental' as const,
      customProgression: 'C Am F G',
      barsPerChord: 2,
      bpm: 120,
      timeSignature: '4/4' as const,
      clickVolume: 0.5,
      chordAudioEnabled: true,
      chordVolume: 0.7,
      voicing: 'close' as const
    };

    const preset = createPreset(newPresetName.trim(), newPresetDescription.trim(), newPresetCategory, completeSettings);

    // Close modal and reset form
    showCreateModal = false;
    newPresetName = '';
    newPresetDescription = '';
    newPresetCategory = 'custom';

    // Load the new preset
    if (preset && onLoadPreset) {
      onLoadPreset(preset);
    }
  }

  function handleLoadPreset(presetId: string) {
    const preset = loadPreset(presetId);
    if (preset && onLoadPreset) {
      onLoadPreset(preset);
    }
  }

  function handleDuplicatePreset(presetId: string) {
    const duplicated = duplicatePreset(presetId);
    if (duplicated && onLoadPreset) {
      onLoadPreset(duplicated);
    }
  }

  function handleDeletePreset(presetId: string) {
    if (confirm('Are you sure you want to delete this preset?')) {
      deletePreset(presetId);
    }
  }

  function handleExport() {
    const jsonData = exportPresets();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chordflow-presets-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    if (!importData.trim()) return;

    importResult = importPresets(importData);
    if (importResult.success) {
      importData = '';
      setTimeout(() => {
        importResult = null;
      }, 5000);
    }
  }

  function handleFileImport(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        importData = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString();
  }

  function handleResetDefaults() {
    if (confirm('This will delete all custom presets and reset to defaults. Continue?')) {
      resetToDefaults();
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h3 class="text-xl font-semibold text-white">Preset Manager</h3>
    <div class="flex items-center space-x-2">
      <button onclick={() => (showCreateModal = true)} class="flex items-center space-x-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm transition-colors">
        <Plus class="w-4 h-4" />
        <span>Create</span>
      </button>
      <button onclick={() => (showImportExport = !showImportExport)} class="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors">
        <Download class="w-4 h-4" />
        <span>Import/Export</span>
      </button>
    </div>
  </div>

  <!-- Search and Filters -->
  <div class="space-y-4">
    <!-- Search -->
    <div class="relative">
      <Search class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search presets..."
        bind:value={searchQuery}
        class="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
      />
    </div>

    <!-- Category Filters -->
    <div class="flex flex-wrap gap-2">
      {#each Object.entries(categoryCounts) as [category, count] (category)}
        {@const IconComponent = categoryIcons[category as keyof typeof categoryIcons]}
        <button
          onclick={() => (selectedCategory = category as ChordFlowPreset['category'] | 'all' | 'recent')}
          class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors {selectedCategory === category
            ? 'bg-emerald-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        >
          <IconComponent class="w-4 h-4" />
          <span class="capitalize">{category}</span>
          <span class="bg-gray-600 text-xs px-1.5 py-0.5 rounded">{count}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Presets List -->
  <div class="space-y-3">
    {#if filteredPresets.length === 0}
      <div class="text-center py-8 text-gray-400">
        <Music class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No presets found</p>
        {#if searchQuery}
          <p class="text-sm mt-1">Try adjusting your search terms</p>
        {/if}
      </div>
    {:else}
      {#each filteredPresets as preset (preset.id)}
        {@const IconComponent = categoryIcons[preset.category]}
        <div class="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <IconComponent class="w-4 h-4 text-gray-400" />
                <h4 class="font-semibold text-white">{preset.name}</h4>
                {#if settingsState.currentPreset === preset.id}
                  <span class="bg-emerald-600 text-white text-xs px-2 py-1 rounded">Current</span>
                {/if}
              </div>

              {#if preset.description}
                <p class="text-sm text-gray-400 mb-3">{preset.description}</p>
              {/if}

              <!-- Settings Preview -->
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Mode: <span class="text-gray-300">{preset.settings.progressionType}</span></div>
                <div>Tempo: <span class="text-gray-300">{preset.settings.bpm} BPM</span></div>
                <div>Time: <span class="text-gray-300">{preset.settings.timeSignature}</span></div>
                <div>Bars: <span class="text-gray-300">{preset.settings.barsPerChord}</span></div>
              </div>

              <div class="text-xs text-gray-500 mt-2">
                Created {formatDate(preset.createdAt)} • Last used {formatDate(preset.lastUsed)}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2 ml-4">
              <button onclick={() => handleLoadPreset(preset.id)} class="p-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white transition-colors" title="Load preset">
                <Download class="w-4 h-4" />
              </button>

              <button onclick={() => handleDuplicatePreset(preset.id)} class="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors" title="Duplicate preset">
                <Copy class="w-4 h-4" />
              </button>

              {#if !preset.id.startsWith('default-')}
                <button onclick={() => handleDeletePreset(preset.id)} class="p-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors" title="Delete preset">
                  <Trash2 class="w-4 h-4" />
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Quick Actions -->
  <div class="flex items-center justify-between pt-4 border-t border-gray-700">
    <button onclick={handleResetDefaults} class="text-sm text-red-400 hover:text-red-300 transition-colors"> Reset to Defaults </button>

    <div class="text-xs text-gray-500">
      {settingsState.presets.length} presets total
    </div>
  </div>
</div>

<!-- Create Preset Modal -->
{#if showCreateModal}
  <div class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
    <div class="bg-gray-900 rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-semibold text-white mb-4">Create New Preset</h3>

      <div class="space-y-4">
        <div>
          <label for="preset-name" class="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input
            id="preset-name"
            type="text"
            bind:value={newPresetName}
            placeholder="My Practice Setup"
            class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label for="preset-description" class="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            id="preset-description"
            bind:value={newPresetDescription}
            placeholder="Optional description..."
            rows="2"
            class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 resize-none"
          ></textarea>
        </div>

        <div>
          <label for="preset-category" class="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select id="preset-category" bind:value={newPresetCategory} class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white">
            <option value="practice">Practice</option>
            <option value="song">Song</option>
            <option value="theory">Theory</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div class="flex items-center space-x-3 mt-6">
        <button
          onclick={handleCreatePreset}
          disabled={!newPresetName.trim()}
          class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded text-white transition-colors"
        >
          Create Preset
        </button>
        <button onclick={() => (showCreateModal = false)} class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"> Cancel </button>
      </div>
    </div>
  </div>
{/if}

<!-- Import/Export Panel -->
{#if showImportExport}
  <div class="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="font-semibold text-white">Import/Export Presets</h4>
      <button onclick={() => (showImportExport = false)} class="text-gray-400 hover:text-white">✕</button>
    </div>

    <!-- Export -->
    <div class="space-y-2">
      <h5 class="text-sm font-medium text-gray-300">Export</h5>
      <button onclick={handleExport} class="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors">
        <Download class="w-4 h-4" />
        <span>Download Presets</span>
      </button>
    </div>

    <!-- Import -->
    <div class="space-y-2">
      <h5 class="text-sm font-medium text-gray-300">Import</h5>
      <div class="space-y-2">
        <input
          type="file"
          accept=".json"
          onchange={handleFileImport}
          class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
        />

        <textarea
          bind:value={importData}
          placeholder="Or paste JSON data here..."
          rows="4"
          class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 text-sm resize-none"
        ></textarea>

        <button
          onclick={handleImport}
          disabled={!importData.trim()}
          class="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm transition-colors"
        >
          <Upload class="w-4 h-4" />
          <span>Import Presets</span>
        </button>
      </div>
    </div>

    <!-- Import Result -->
    {#if importResult}
      <div class="p-3 rounded {importResult.success ? 'bg-green-900/20 border border-green-600/30' : 'bg-red-900/20 border border-red-600/30'}">
        {#if importResult.success}
          <p class="text-green-400 text-sm">✓ Successfully imported {importResult.imported} presets</p>
        {:else}
          <p class="text-red-400 text-sm">✗ Import failed</p>
        {/if}

        {#if importResult.errors.length > 0}
          <ul class="text-xs text-gray-400 mt-2 space-y-1">
            {#each importResult.errors as error (error)}
              <li>• {error}</li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
  </div>
{/if}
