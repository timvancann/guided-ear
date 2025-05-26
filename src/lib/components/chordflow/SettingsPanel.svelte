<script lang="ts">
  import { ChevronDown, ChevronRight } from '@lucide/svelte';
  import type { MetronomeEngine } from '$lib/chordflow/metronome.svelte';
  import type { ChordGenerator } from '$lib/chordflow/chordGenerator.svelte';
  import ModeSelector from './ModeSelector.svelte';
  import MetronomeSettings from './MetronomeSettings.svelte';
  import AudioControls from './AudioControls.svelte';
  import PresetManager from './PresetManager.svelte';
  import { setBarsPerChord, chordFlowState } from '$lib/chordflow/state.svelte';

  interface Props {
    metronome: MetronomeEngine;
    chordGenerator: ChordGenerator;
  }

  let { metronome, chordGenerator }: Props = $props();

  // Collapsible sections
  let sectionsOpen = $state({
    practiceMode: true,
    timing: true,
    metronome: false,
    audio: false,
    presets: false
  });

  function toggleSection(section: keyof typeof sectionsOpen) {
    sectionsOpen[section] = !sectionsOpen[section];
  }

  function handleBarsPerChordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    setBarsPerChord(parseInt(target.value));
  }
</script>

<div class="space-y-6">
  <!-- Practice Mode Section -->
  <div class="bg-gray-800/30 rounded-xl border border-gray-700/50">
    <button onclick={() => toggleSection('practiceMode')} class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-700/30 transition-colors rounded-xl">
      <h3 class="text-lg font-semibold text-white">Practice Mode</h3>
      {#if sectionsOpen.practiceMode}
        <ChevronDown class="w-5 h-5 text-gray-400" />
      {:else}
        <ChevronRight class="w-5 h-5 text-gray-400" />
      {/if}
    </button>

    {#if sectionsOpen.practiceMode}
      <div class="px-5 pb-5">
        <ModeSelector {metronome} {chordGenerator} />
      </div>
    {/if}
  </div>

  <!-- Timing Settings Section -->
  <div class="bg-gray-800/30 rounded-xl border border-gray-700/50">
    <button onclick={() => toggleSection('timing')} class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-700/30 transition-colors rounded-xl">
      <h3 class="text-lg font-semibold text-white">Timing Settings</h3>
      {#if sectionsOpen.timing}
        <ChevronDown class="w-5 h-5 text-gray-400" />
      {:else}
        <ChevronRight class="w-5 h-5 text-gray-400" />
      {/if}
    </button>

    {#if sectionsOpen.timing}
      <div class="px-5 pb-5 space-y-6">
        <!-- Bars per Chord Setting -->
        <div class="space-y-3">
          <label for="bars-per-chord-panel" class="text-sm font-semibold text-gray-300">Bars per Chord</label>
          <select
            id="bars-per-chord-panel"
            value={chordFlowState.settings.barsPerChord}
            onchange={handleBarsPerChordChange}
            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-base"
          >
            <option value={1}>1 Bar</option>
            <option value={2}>2 Bars</option>
            <option value={4}>4 Bars</option>
            <option value={8}>8 Bars</option>
          </select>
          <p class="text-sm text-gray-400">How many bars to play each chord</p>
        </div>

        <!-- Quick BPM Presets -->
        <div class="space-y-3">
          <div class="text-sm font-semibold text-gray-300">Quick BPM</div>
          <div class="grid grid-cols-2 gap-3">
            {#each [80, 100, 120, 140, 160, 180] as bpm (bpm)}
              <button
                onclick={() => metronome.setBpmPreset(bpm)}
                class="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-base font-medium transition-colors {metronome.currentState.bpm === bpm
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'text-gray-200'}"
              >
                {bpm}
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Advanced Metronome Section -->
  <div class="bg-gray-800/30 rounded-xl border border-gray-700/50">
    <button onclick={() => toggleSection('metronome')} class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-700/30 transition-colors rounded-xl">
      <h3 class="text-lg font-semibold text-white">Advanced Metronome</h3>
      {#if sectionsOpen.metronome}
        <ChevronDown class="w-5 h-5 text-gray-400" />
      {:else}
        <ChevronRight class="w-5 h-5 text-gray-400" />
      {/if}
    </button>

    {#if sectionsOpen.metronome}
      <div class="px-5 pb-5">
        <MetronomeSettings {metronome} />
      </div>
    {/if}
  </div>

  <!-- Audio Settings Section -->
  <div class="bg-gray-800/30 rounded-xl border border-gray-700/50">
    <button onclick={() => toggleSection('audio')} class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-700/30 transition-colors rounded-xl">
      <h3 class="text-lg font-semibold text-white">Audio Settings</h3>
      {#if sectionsOpen.audio}
        <ChevronDown class="w-5 h-5 text-gray-400" />
      {:else}
        <ChevronRight class="w-5 h-5 text-gray-400" />
      {/if}
    </button>

    {#if sectionsOpen.audio}
      <div class="px-5 pb-5">
        <AudioControls />
      </div>
    {/if}
  </div>

  <!-- Presets & Settings Section -->
  <div class="bg-gray-800/30 rounded-xl border border-gray-700/50">
    <button onclick={() => toggleSection('presets')} class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-700/30 transition-colors rounded-xl">
      <h3 class="text-lg font-semibold text-white">Presets & Settings</h3>
      {#if sectionsOpen.presets}
        <ChevronDown class="w-5 h-5 text-gray-400" />
      {:else}
        <ChevronRight class="w-5 h-5 text-gray-400" />
      {/if}
    </button>

    {#if sectionsOpen.presets}
      <div class="px-5 pb-5">
        <PresetManager />
      </div>
    {/if}
  </div>

  <!-- Practice Tips -->
  <div class="bg-emerald-900/10 rounded-xl border border-emerald-600/20 p-5">
    <h4 class="text-base font-semibold text-emerald-400 mb-3">💡 Practice Tips</h4>
    <ul class="text-sm text-gray-300 space-y-2">
      <li class="flex items-start space-x-2">
        <span class="text-emerald-400 mt-0.5">•</span>
        <span>Start with a slower tempo and gradually increase</span>
      </li>
      <li class="flex items-start space-x-2">
        <span class="text-emerald-400 mt-0.5">•</span>
        <span>Use keyboard shortcuts for faster control</span>
      </li>
      <li class="flex items-start space-x-2">
        <span class="text-emerald-400 mt-0.5">•</span>
        <span>Practice chord transitions without audio first</span>
      </li>
      <li class="flex items-start space-x-2">
        <span class="text-emerald-400 mt-0.5">•</span>
        <span>Try different time signatures for variety</span>
      </li>
      <li class="flex items-start space-x-2">
        <span class="text-emerald-400 mt-0.5">•</span>
        <span>Use tap tempo to match songs you're learning</span>
      </li>
    </ul>
  </div>

  <!-- Current Settings Summary -->
  <div class="bg-gray-800/20 rounded-xl p-5 border border-gray-700/30">
    <h4 class="text-base font-semibold text-gray-300 mb-4">Current Settings</h4>
    <div class="text-sm text-gray-400 space-y-3">
      <div class="flex justify-between items-center">
        <span>Mode:</span>
        <span class="text-white font-medium capitalize">{chordFlowState.settings.progressionType}</span>
      </div>
      <div class="flex justify-between items-center">
        <span>Tempo:</span>
        <span class="text-white font-medium">{metronome.currentState.bpm} BPM</span>
      </div>
      <div class="flex justify-between items-center">
        <span>Time Signature:</span>
        <span class="text-white font-medium">{metronome.currentState.timeSignature}</span>
      </div>
      <div class="flex justify-between items-center">
        <span>Bars per Chord:</span>
        <span class="text-white font-medium">{chordFlowState.settings.barsPerChord}</span>
      </div>
    </div>
  </div>
</div>
