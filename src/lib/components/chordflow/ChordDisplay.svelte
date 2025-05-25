<script lang="ts">
  import { ChordGenerator } from '$lib/chordflow/chordGenerator.svelte';

  interface Props {
    currentChord: string;
    nextChord: string;
    isChordChangeReady?: boolean;
  }

  let { currentChord, nextChord, isChordChangeReady = false }: Props = $props();

  // Get display names for chords
  let currentDisplayName = $derived(ChordGenerator.getDisplayName(currentChord));
  let nextDisplayName = $derived(ChordGenerator.getDisplayName(nextChord));
</script>

<div class="flex flex-col items-center space-y-6">
  <!-- Current Chord Display -->
  <div class="text-center">
    <h2 class="text-lg font-medium text-gray-300 mb-2">Current Chord</h2>
    <div class="bg-gray-800 rounded-xl p-12 border-2 transition-all duration-300 {isChordChangeReady ? 'border-emerald-400 bg-emerald-900/20 scale-105' : 'border-gray-600'}">
      <div class="text-7xl md:text-8xl font-bold text-white font-mono tracking-wider leading-none">
        {currentDisplayName}
      </div>
    </div>
  </div>

  <!-- Arrow Indicator -->
  <div class="flex items-center justify-center">
    <div class="text-gray-400">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  </div>

  <!-- Next Chord Display -->
  <div class="text-center">
    <h3 class="text-lg font-medium text-gray-300 mb-3">Next Chord</h3>
    <div class="bg-gray-900 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-colors">
      <div class="text-5xl md:text-6xl font-bold text-gray-400 font-mono tracking-wider">
        {nextDisplayName}
      </div>
    </div>
  </div>
</div>

<style>
  /* Add subtle glow effect for chord change ready state */
  .border-emerald-400 {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  }
</style>
