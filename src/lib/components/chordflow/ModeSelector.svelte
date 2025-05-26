<script lang="ts">
  import { chordFlowState, setProgressionType, executeChordChange } from '$lib/chordflow/state.svelte';
  import type { MetronomeEngine } from '$lib/chordflow/metronome.svelte';
  import type { ChordGenerator } from '$lib/chordflow/chordGenerator.svelte';
  import QualitySelector from './QualitySelector.svelte';
  import ScaleSelector from './ScaleSelector.svelte';
  import DiatonicOptions from './DiatonicOptions.svelte';
  import CustomProgressionInput from './CustomProgressionInput.svelte';
  import ProgressionPresets from './ProgressionPresets.svelte';

  interface Props {
    metronome: MetronomeEngine | null;
    chordGenerator: ChordGenerator;
  }

  let { metronome, chordGenerator }: Props = $props();
  let currentMode = $derived(chordFlowState.settings.progressionType);

  function handleModeChange(mode: 'fourths' | 'random' | 'diatonic' | 'custom') {
    // Stop playback when changing modes
    if (metronome?.currentState.isPlaying) {
      metronome.stop();
    }

    // Reset metronome state
    if (metronome) {
      metronome.reset();
    }

    // Change the progression type
    setProgressionType(mode);

    // Reset all chord generators to start fresh
    chordGenerator.resetAll();

    // Generate new initial chords for the selected mode
    const { current, next } = chordGenerator.getNextChord(
      mode,
      chordFlowState.settings.selectedQualities,
      chordFlowState.settings.diatonicKey,
      chordFlowState.settings.diatonicOption,
      chordFlowState.settings.customProgression
    );
    executeChordChange(current, next);
  }

  function handleSelectProgression(progression: string) {
    chordFlowState.settings.customProgression = progression;
  }
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-semibold text-gray-300 mb-4">Practice Mode</h3>

    <!-- Mode Selection -->
    <div class="space-y-3">
      <!-- Fourths Mode -->
      <button
        onclick={() => handleModeChange('fourths')}
        class="w-full p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'fourths'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-start space-x-3">
          <div class="w-5 h-5 rounded-full border-2 mt-0.5 {currentMode === 'fourths' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500'}"></div>
          <div class="flex-1">
            <h4 class="font-semibold text-white mb-1">Cycle of Fourths</h4>
            <p class="text-sm text-gray-400 leading-relaxed">B → E → A → D → G → C → F → Bb → Eb → Ab → Db → Gb</p>
          </div>
        </div>
      </button>

      <!-- Random Mode -->
      <button
        onclick={() => handleModeChange('random')}
        class="w-full p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'random'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-start space-x-3">
          <div class="w-5 h-5 rounded-full border-2 mt-0.5 {currentMode === 'random' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500'}"></div>
          <div class="flex-1">
            <h4 class="font-semibold text-white mb-1">Random Chords</h4>
            <p class="text-sm text-gray-400 leading-relaxed">Random selection from chosen chord qualities</p>
          </div>
        </div>
      </button>

      <!-- Diatonic Mode -->
      <button
        onclick={() => handleModeChange('diatonic')}
        class="w-full p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'diatonic'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-start space-x-3">
          <div class="w-5 h-5 rounded-full border-2 mt-0.5 {currentMode === 'diatonic' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500'}"></div>
          <div class="flex-1">
            <h4 class="font-semibold text-white mb-1">Diatonic Scale</h4>
            <p class="text-sm text-gray-400 leading-relaxed">Chords from a major scale in any key</p>
          </div>
        </div>
      </button>

      <!-- Custom Mode -->
      <button
        onclick={() => handleModeChange('custom')}
        class="w-full p-4 rounded-lg border-2 transition-all duration-200 text-left {currentMode === 'custom'
          ? 'border-emerald-500 bg-emerald-900/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
      >
        <div class="flex items-start space-x-3">
          <div class="w-5 h-5 rounded-full border-2 mt-0.5 {currentMode === 'custom' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500'}"></div>
          <div class="flex-1">
            <h4 class="font-semibold text-white mb-1">Custom Progression</h4>
            <p class="text-sm text-gray-400 leading-relaxed">Enter your own chord sequence</p>
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
  <div class="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
    <h4 class="text-base font-semibold text-gray-300 mb-3">
      {currentMode === 'fourths' ? 'Cycle of Fourths' : currentMode === 'random' ? 'Random Chords' : currentMode === 'diatonic' ? 'Diatonic Scale' : 'Custom Progression'} - Practice Tips
    </h4>
    <p class="text-sm text-gray-400 leading-relaxed">
      {currentMode === 'fourths'
        ? 'Perfect for building chord transitions and muscle memory. Each chord is a perfect fourth above the previous one.'
        : currentMode === 'random'
          ? 'Great for improvisation practice. Adjust chord qualities to focus on specific types (major, minor, 7th chords, etc.).'
          : currentMode === 'diatonic'
            ? 'Essential for understanding key relationships. Practice chord functions (I, ii, iii, IV, V, vi, vii°) in any major key.'
            : 'Practice specific songs or progressions. Enter chord sequences from real music or explore theoretical progressions.'}
    </p>
  </div>
</div>
