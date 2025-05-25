<script lang="ts">
  interface Props {
    currentBeat: number;
    beatsPerBar: number;
    currentBar: number;
    barsPerChord: number;
    barsSinceLastChord: number;
    beatProgress: number;
  }

  let { 
    currentBeat, 
    beatsPerBar, 
    currentBar, 
    barsPerChord, 
    barsSinceLastChord, 
    beatProgress 
  }: Props = $props();

  // Calculate progress percentages
  let beatProgressPercent = $derived(beatProgress);
  let barProgressPercent = $derived(((barsSinceLastChord % barsPerChord) / barsPerChord) * 100);
  let isChordChangeReady = $derived(barsSinceLastChord >= barsPerChord - 1 && currentBeat === beatsPerBar - 1);

  // Generate beat and bar indicators
  let beatDots = $derived(Array.from({ length: beatsPerBar }, (_, i) => i));
  let barDots = $derived(Array.from({ length: barsPerChord }, (_, i) => i));
</script>

<div class="flex flex-col items-center space-y-6">
  <!-- Beat Progress Section -->
  <div class="text-center space-y-3">
    <h3 class="text-sm font-medium text-gray-400">Beat Progress</h3>
    
    <!-- Beat Dots -->
    <div class="flex space-x-2">
      {#each beatDots as beat}
        <div
          class="w-3 h-3 rounded-full transition-all duration-100 {beat === currentBeat
            ? 'bg-emerald-400 scale-125 shadow-lg shadow-emerald-400/50'
            : beat < currentBeat
            ? 'bg-emerald-600'
            : 'bg-gray-600'}"
        ></div>
      {/each}
    </div>

    <!-- Current Beat Progress Bar -->
    <div class="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full bg-emerald-400 transition-all duration-75 ease-linear"
        style="width: {beatProgressPercent}%"
      ></div>
    </div>

    <!-- Beat Counter -->
    <div class="text-sm text-gray-300">
      Beat {currentBeat + 1} of {beatsPerBar}
    </div>
  </div>

  <!-- Bar Progress Section -->
  <div class="text-center space-y-3">
    <h3 class="text-sm font-medium text-gray-400">Bar Progress (Until Next Chord)</h3>
    
    <!-- Bar Dots -->
    <div class="flex space-x-3">
      {#each barDots as bar}
        <div class="flex flex-col items-center space-y-1">
          <div
            class="w-4 h-4 rounded-full transition-all duration-200 {bar === barsSinceLastChord % barsPerChord
              ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50'
              : bar < barsSinceLastChord % barsPerChord
              ? 'bg-amber-600'
              : 'bg-gray-600'}"
          ></div>
          <div class="text-xs text-gray-500">{bar + 1}</div>
        </div>
      {/each}
    </div>

    <!-- Bar Progress Bar -->
    <div class="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full transition-all duration-200 {isChordChangeReady 
          ? 'bg-red-400' 
          : 'bg-amber-400'}"
        style="width: {barProgressPercent}%"
      ></div>
    </div>

    <!-- Bar Counter -->
    <div class="text-sm text-gray-300">
      Bar {(barsSinceLastChord % barsPerChord) + 1} of {barsPerChord}
    </div>
  </div>

  <!-- Chord Change Indicator -->
  {#if isChordChangeReady}
    <div class="flex items-center space-x-2 px-4 py-2 bg-red-900/30 border border-red-600/50 rounded-lg">
      <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
      <span class="text-red-400 text-sm font-medium">Chord Change Ready!</span>
    </div>
  {/if}

  <!-- Overall Progress Stats -->
  <div class="text-center text-xs text-gray-500 space-y-1">
    <div>Total Bars: {currentBar + 1}</div>
    <div>Bars per Chord: {barsPerChord}</div>
  </div>
</div>