<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { MetronomeEngine } from '$lib/chordflow/metronome.svelte';
  import MetronomeControls from './MetronomeControls.svelte';

  interface Props {
    metronome: MetronomeEngine;
  }

  let { metronome }: Props = $props();
  let metronomeState = metronome.currentState;
  let beatProgress = $state(0);
  let animationFrameId: number;

  // Update beat progress for visual feedback
  function updateBeatProgress() {
    beatProgress = metronome.getBeatProgress();
    animationFrameId = requestAnimationFrame(updateBeatProgress);
  }

  onMount(() => {
    updateBeatProgress();
  });

  onDestroy(() => {
    metronome.stop();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  // Generate beat indicator dots
  let beatDots = $derived(Array.from({ length: metronomeState.beatsPerBar }, (_, i) => i));
</script>

<div class="flex flex-col items-center space-y-8">
  <!-- Beat Visualization -->
  <div class="flex flex-col items-center space-y-4">
    <h2 class="text-xl font-semibold text-gray-300">Beat Indicator</h2>
    
    <!-- Beat Dots -->
    <div class="flex space-x-3">
      {#each beatDots as beat}
        <div
          class="w-4 h-4 rounded-full transition-all duration-100 {beat === metronomeState.currentBeat
            ? 'bg-emerald-400 scale-125 shadow-lg shadow-emerald-400/50'
            : 'bg-gray-600'}"
        ></div>
      {/each}
    </div>

    <!-- Progress Bar for Current Beat -->
    <div class="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full bg-emerald-400 transition-all duration-75 ease-linear"
        style="width: {beatProgress}%"
      ></div>
    </div>

    <!-- Beat Counter -->
    <div class="text-center">
      <div class="text-2xl font-bold text-white">
        {metronomeState.currentBeat + 1} / {metronomeState.beatsPerBar}
      </div>
      <div class="text-sm text-gray-400">Beat / Bar</div>
    </div>

    <!-- Bar Counter -->
    <div class="text-center">
      <div class="text-lg font-semibold text-emerald-400">
        Bar {metronomeState.currentBar + 1}
      </div>
    </div>
  </div>

  <!-- Metronome Controls -->
  <MetronomeControls {metronome} />

  <!-- Status -->
  <div class="text-center">
    <div class="inline-flex items-center px-3 py-1 rounded-full text-sm {metronomeState.isPlaying
      ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-600/30'
      : 'bg-gray-800 text-gray-400 border border-gray-600'}">
      <div class="w-2 h-2 rounded-full mr-2 {metronomeState.isPlaying ? 'bg-emerald-400' : 'bg-gray-400'}"></div>
      {metronomeState.isPlaying ? 'Playing' : 'Stopped'}
    </div>
  </div>
</div>

<style>
  /* Add subtle animations for beat visualization */
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
</style>