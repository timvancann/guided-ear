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

<div class="flex flex-col items-center space-y-6 w-full">
  <!-- Current Chord Display -->
  <div class="text-center w-full">
    <h2 class="text-lg font-medium text-gray-300 mb-2">Current Chord</h2>
    <div class="bg-gray-800 rounded-xl p-6 md:p-8 border-2 transition-all duration-300 overflow-hidden {isChordChangeReady ? 'border-emerald-400 bg-emerald-900/20 scale-105' : 'border-gray-600'}">
      <div class="chord-display text-white font-mono font-bold leading-tight">
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
  <div class="text-center w-full">
    <h3 class="text-lg font-medium text-gray-300 mb-3">Next Chord</h3>
    <div class="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden">
      <div class="chord-display-next text-gray-400 font-mono font-bold leading-tight">
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

  /* Responsive chord display sizing */
  .chord-display {
    font-size: clamp(2.5rem, 8vw, 5rem);
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  .chord-display-next {
    font-size: clamp(1.875rem, 6vw, 3.75rem);
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  /* For very long chord names, ensure they fit */
  @media (max-width: 640px) {
    .chord-display {
      font-size: clamp(2rem, 7vw, 3rem);
    }
    .chord-display-next {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
    }
  }
</style>
