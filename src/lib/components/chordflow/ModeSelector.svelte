<script lang="ts">
  import { chordFlowState, setProgressionType } from '$lib/chordflow/state.svelte';
  import QualitySelector from './QualitySelector.svelte';
  import ScaleSelector from './ScaleSelector.svelte';
  import DiatonicOptions from './DiatonicOptions.svelte';
  import CustomProgressionInput from './CustomProgressionInput.svelte';
  import ProgressionPresets from './ProgressionPresets.svelte';

  let currentMode = $derived(chordFlowState.settings.progressionType);

  function handleModeChange(mode: 'fourths' | 'random' | 'diatonic' | 'custom') {
    setProgressionType(mode);
  }

  function handleSelectProgression(progression: string) {
    chordFlowState.settings.customProgression = progression;
  }
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-semibold text-gray-300 mb-4">Practice Mode</h3>
    
    <!-- Mode Selection -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Fourths Mode -->
      <button
        onclick={() => handleModeChange('fourths')}
        class="p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'fourths'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded-full border-2 {currentMode === 'fourths'
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-gray-500'}"
          ></div>
          <div>
            <h4 class="font-medium text-white">Cycle of Fourths</h4>
            <p class="text-sm text-gray-400 mt-1">
              B → E → A → D → G → C → F → Bb → Eb → Ab → Db → Gb
            </p>
          </div>
        </div>
      </button>

      <!-- Random Mode -->
      <button
        onclick={() => handleModeChange('random')}
        class="p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'random'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded-full border-2 {currentMode === 'random'
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-gray-500'}"
          ></div>
          <div>
            <h4 class="font-medium text-white">Random Chords</h4>
            <p class="text-sm text-gray-400 mt-1">
              Random selection from chosen chord qualities
            </p>
          </div>
        </div>
      </button>

      <!-- Diatonic Mode -->
      <button
        onclick={() => handleModeChange('diatonic')}
        class="p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'diatonic'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded-full border-2 {currentMode === 'diatonic'
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-gray-500'}"
          ></div>
          <div>
            <h4 class="font-medium text-white">Diatonic Scale</h4>
            <p class="text-sm text-gray-400 mt-1">
              Chords from a major scale in any key
            </p>
          </div>
        </div>
      </button>

      <!-- Custom Mode -->
      <button
        onclick={() => handleModeChange('custom')}
        class="p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'custom'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded-full border-2 {currentMode === 'custom'
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-gray-500'}"
          ></div>
          <div>
            <h4 class="font-medium text-white">Custom Progression</h4>
            <p class="text-sm text-gray-400 mt-1">
              Enter your own chord sequence
            </p>
          </div>
        </div>
      </button>
    </div>
  </div>

  <!-- Mode-specific Options -->
  {#if currentMode === 'random'}
    <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <QualitySelector />
    </div>
  {:else if currentMode === 'diatonic'}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <ScaleSelector />
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <DiatonicOptions />
      </div>
    </div>
  {:else if currentMode === 'custom'}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <CustomProgressionInput />
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <ProgressionPresets onSelectProgression={handleSelectProgression} />
      </div>
    </div>
  {/if}

  <!-- Mode Information -->
  <div class="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
    <h4 class="text-sm font-medium text-gray-300 mb-2">
      {currentMode === 'fourths' ? 'Cycle of Fourths' : 
       currentMode === 'random' ? 'Random Chords' : 
       currentMode === 'diatonic' ? 'Diatonic Scale' : 
       'Custom Progression'} - Practice Tips
    </h4>
    <p class="text-xs text-gray-400">
      {currentMode === 'fourths' 
        ? 'Perfect for building chord transitions and muscle memory. Each chord is a perfect fourth above the previous one.'
        : currentMode === 'random'
        ? 'Great for improvisation practice. Adjust chord qualities to focus on specific types (major, minor, 7th chords, etc.).'
        : currentMode === 'diatonic'
        ? 'Essential for understanding key relationships. Practice chord functions (I, ii, iii, IV, V, vi, vii°) in any major key.'
        : 'Practice specific songs or progressions. Enter chord sequences from real music or explore theoretical progressions.'
      }
    </p>
  </div>
</div>