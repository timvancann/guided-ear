<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { MetronomeEngine } from '$lib/chordflow/metronome.svelte';
  import MetronomeControls from './MetronomeControls.svelte';
  import MetronomeSettings from './MetronomeSettings.svelte';

  interface Props {
    metronome: MetronomeEngine;
  }

  let { metronome }: Props = $props();
  let metronomeState = metronome.currentState;
  let beatAnimation = $state(false);
  let lastBeat = $state(-1);

  // Trigger beat animation when beat changes
  $effect(() => {
    if (metronomeState.currentBeat !== lastBeat && metronomeState.isPlaying) {
      beatAnimation = true;
      setTimeout(() => {
        beatAnimation = false;
      }, 100);
      lastBeat = metronomeState.currentBeat;
    }
  });

  onDestroy(() => {
    metronome.stop();
  });

  // Generate beat indicator dots
  let beatDots = $derived(Array.from({ length: metronomeState.beatsPerBar }, (_, i) => i));
</script>

<div class="flex flex-col items-center space-y-8">
  <!-- Beat Visualization -->
  <div class="flex flex-col items-center space-y-4">
    <h2 class="text-xl font-semibold text-gray-300">Beat Indicator</h2>

    <!-- Beat Dots with Enhanced Animation -->
    <div class="flex space-x-3">
      {#each beatDots as beat (beat)}
        {@const isCurrentBeat = beat === metronomeState.currentBeat}
        {@const isDownbeat = beat === 0}
        <div
          class="w-5 h-5 rounded-full transition-all duration-150 {isCurrentBeat
            ? isDownbeat
              ? 'bg-amber-400 scale-150 shadow-lg shadow-amber-400/60 pulse'
              : 'bg-emerald-400 scale-125 shadow-lg shadow-emerald-400/50'
            : isDownbeat
              ? 'bg-amber-600/50'
              : 'bg-gray-600'} {beatAnimation && isCurrentBeat ? 'animate-pulse-once' : ''}"
        ></div>
      {/each}
    </div>

    <!-- Beat Counter with Time Signature -->
    <div class="text-center">
      <div class="text-2xl font-bold text-white">
        {metronomeState.currentBeat + 1} / {metronomeState.beatsPerBar}
      </div>
      <div class="text-sm text-gray-400">{metronomeState.timeSignature}</div>
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

  <!-- Advanced Settings -->
  <MetronomeSettings {metronome} />

  <!-- Status -->
  <div class="text-center">
    <div
      class="inline-flex items-center px-3 py-1 rounded-full text-sm {metronomeState.isPlaying
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-600/30'
        : 'bg-gray-800 text-gray-400 border border-gray-600'}"
    >
      <div class="w-2 h-2 rounded-full mr-2 {metronomeState.isPlaying ? 'bg-emerald-400' : 'bg-gray-400'}"></div>
      {metronomeState.isPlaying ? 'Playing' : 'Stopped'}
    </div>
  </div>
</div>

<style>
  /* Enhanced animations for beat visualization */
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes pulse-once {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-pulse-once {
    animation: pulse-once 0.1s ease-out;
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
