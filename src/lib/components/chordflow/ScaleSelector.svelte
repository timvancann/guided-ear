<script lang="ts">
  import { chordFlowState, setDiatonicKey, executeChordChange } from '$lib/chordflow/state.svelte';
  import type { MetronomeEngine } from '$lib/chordflow/metronome.svelte';
  import type { ChordGenerator } from '$lib/chordflow/chordGenerator.svelte';

  interface Props {
    metronome: MetronomeEngine | null;
    chordGenerator: ChordGenerator;
  }

  let { metronome, chordGenerator }: Props = $props();

  const allKeys = [
    { key: 'C', display: 'C Major' },
    { key: 'G', display: 'G Major' },
    { key: 'D', display: 'D Major' },
    { key: 'A', display: 'A Major' },
    { key: 'E', display: 'E Major' },
    { key: 'B', display: 'B Major' },
    { key: 'F#', display: 'F# Major' },
    { key: 'Db', display: 'Db Major' },
    { key: 'Ab', display: 'Ab Major' },
    { key: 'Eb', display: 'Eb Major' },
    { key: 'Bb', display: 'Bb Major' },
    { key: 'F', display: 'F Major' }
  ];

  let selectedKey = $derived(chordFlowState.settings.diatonicKey);

  function handleKeyChange(key: string) {
    // Stop playback when changing key
    if (metronome?.currentState.isPlaying) {
      metronome.stop();
    }

    // Reset metronome state
    if (metronome) {
      metronome.reset();
    }

    // Change the key
    setDiatonicKey(key);

    // Reset chord generators
    chordGenerator.resetAll();

    // Generate new initial chords for the new key
    const { current, next } = chordGenerator.getNextChord(
      'diatonic',
      chordFlowState.settings.selectedQualities,
      key,
      chordFlowState.settings.diatonicOption,
      chordFlowState.settings.customProgression
    );
    executeChordChange(current, next);
  }

  // Group keys for easier selection
  const sharpKeys = allKeys.filter((k) => k.key.includes('#') || ['C', 'G', 'D', 'A', 'E', 'B'].includes(k.key));
  const flatKeys = allKeys.filter((k) => k.key.includes('b') || k.key === 'F');
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="text-md font-medium text-gray-300">Key Selection</h4>
    <div class="text-xs text-gray-500">
      Current: {allKeys.find((k) => k.key === selectedKey)?.display || selectedKey}
    </div>
  </div>

  <!-- Key Selection Buttons -->
  <div class="space-y-4">
    <!-- Sharp Keys (and naturals) -->
    <div>
      <div class="text-sm text-gray-400 mb-2">Sharp Keys & Naturals</div>
      <div class="grid grid-cols-3 gap-2">
        {#each sharpKeys as keyInfo (keyInfo.key)}
          <button
            onclick={() => handleKeyChange(keyInfo.key)}
            class="px-3 py-2 rounded text-sm font-medium transition-all duration-200 {selectedKey === keyInfo.key ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
          >
            {keyInfo.key}
          </button>
        {/each}
      </div>
    </div>

    <!-- Flat Keys -->
    <div>
      <div class="text-sm text-gray-400 mb-2">Flat Keys</div>
      <div class="grid grid-cols-3 gap-2">
        {#each flatKeys as keyInfo (keyInfo.key)}
          <button
            onclick={() => handleKeyChange(keyInfo.key)}
            class="px-3 py-2 rounded text-sm font-medium transition-all duration-200 {selectedKey === keyInfo.key ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
          >
            {keyInfo.key}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Key Information -->
  <div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
    <div class="text-sm text-gray-300">
      <strong>{allKeys.find((k) => k.key === selectedKey)?.display}</strong> Scale Chords:
    </div>
    <div class="text-xs text-gray-400 mt-1">I - ii - iii - IV - V - vi - vii°</div>
    <div class="text-xs text-gray-500 mt-1">(Major - minor - minor - Major - Major - minor - diminished)</div>
  </div>
</div>
