<script lang="ts">
  import { CHORD_QUALITIES } from '$lib/chordflow/chordGenerator.svelte';
  import { chordFlowState, toggleQuality } from '$lib/chordflow/state.svelte';

  let selectedQualities = $derived(chordFlowState.settings.selectedQualities);

  function handleQualityToggle(quality: string) {
    toggleQuality(quality);
  }

  function selectAll() {
    chordFlowState.settings.selectedQualities = CHORD_QUALITIES.map(q => q.symbol);
  }

  function selectNone() {
    // Keep at least major chord
    chordFlowState.settings.selectedQualities = [''];
  }

  function selectBasic() {
    chordFlowState.settings.selectedQualities = ['', 'm'];
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="text-md font-medium text-gray-300">Chord Qualities</h4>
    <div class="flex space-x-2 text-xs">
      <button 
        onclick={selectBasic}
        class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
      >
        Basic
      </button>
      <button 
        onclick={selectAll}
        class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
      >
        All
      </button>
      <button 
        onclick={selectNone}
        class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
      >
        Reset
      </button>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-3">
    {#each CHORD_QUALITIES as quality}
      {@const isSelected = selectedQualities.includes(quality.symbol)}
      <label class="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-800/50">
        <input
          type="checkbox"
          checked={isSelected}
          onchange={() => handleQualityToggle(quality.symbol)}
          class="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
        />
        <div class="flex items-center space-x-2">
          <span class="text-emerald-400 font-mono text-sm min-w-[2rem]">
            {quality.symbol || 'maj'}
          </span>
          <span class="text-gray-300 text-sm">
            {quality.name}
          </span>
        </div>
      </label>
    {/each}
  </div>

  <div class="text-xs text-gray-500 mt-2">
    Selected: {selectedQualities.length} of {CHORD_QUALITIES.length} qualities
  </div>
</div>

<style>
  /* Custom checkbox styling */
  input[type="checkbox"]:checked {
    background-color: #10b981;
    border-color: #10b981;
  }
</style>