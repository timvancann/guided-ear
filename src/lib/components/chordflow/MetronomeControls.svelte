<script lang="ts">
  import { Play, Pause, RotateCcw } from '@lucide/svelte';
  import type { MetronomeEngine } from '$lib/chordflow/metronome.svelte';

  interface Props {
    metronome: MetronomeEngine;
  }

  let { metronome }: Props = $props();

  let metronomeState = metronome.currentState;

  function handleBpmChange(event: Event) {
    const target = event.target as HTMLInputElement;
    metronome.setBpm(parseInt(target.value));
  }

  function increaseBpm() {
    metronome.setBpm(metronomeState.bpm + 5);
  }

  function decreaseBpm() {
    metronome.setBpm(metronomeState.bpm - 5);
  }
</script>

<div class="flex flex-col items-center space-y-6">
  <!-- Play/Pause Button -->
  <button
    onclick={() => metronome.toggle()}
    class="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center shadow-lg"
    aria-label={metronomeState.isPlaying ? 'Pause metronome' : 'Start metronome'}
  >
    {#if metronomeState.isPlaying}
      <Pause class="w-8 h-8 text-white" />
    {:else}
      <Play class="w-8 h-8 text-white ml-1" />
    {/if}
  </button>

  <!-- BPM Controls -->
  <div class="flex flex-col items-center space-y-4">
    <div class="flex items-center space-x-4">
      <button
        onclick={decreaseBpm}
        class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center text-white font-bold"
        disabled={metronomeState.bpm <= 60}
      >
        −
      </button>
      
      <div class="text-center">
        <div class="text-3xl font-bold text-emerald-400">
          {metronomeState.bpm}
        </div>
        <div class="text-sm text-gray-400">BPM</div>
      </div>
      
      <button
        onclick={increaseBpm}
        class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center text-white font-bold"
        disabled={metronomeState.bpm >= 200}
      >
        +
      </button>
    </div>

    <!-- BPM Slider -->
    <div class="w-64">
      <input
        type="range"
        min="60"
        max="200"
        step="5"
        value={metronomeState.bpm}
        oninput={handleBpmChange}
        class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>60</span>
        <span>200</span>
      </div>
    </div>
  </div>

  <!-- Reset Button -->
  <button
    onclick={() => metronome.reset()}
    class="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
    aria-label="Reset metronome"
  >
    <RotateCcw class="w-4 h-4" />
    <span>Reset</span>
  </button>
</div>

<style>
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>