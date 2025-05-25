<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Clock, Music, BarChart3, RotateCcw } from '@lucide/svelte';

  interface Props {
    currentChord: string;
    nextChord: string;
    bpm: number;
    timeSignature: string;
    isPlaying: boolean;
  }

  let { currentChord, nextChord, bpm, timeSignature, isPlaying }: Props = $props();

  // Session statistics
  let sessionStats = $state({
    startTime: Date.now(),
    totalTime: 0,
    chordsPlayed: 0,
    bpmChanges: 0,
    averageBpm: bpm,
    totalBpmValues: [bpm],
    isActive: false
  });

  let updateInterval: number | null = null;

  // Track session time
  function updateSessionTime() {
    if (sessionStats.isActive) {
      sessionStats.totalTime = Date.now() - sessionStats.startTime;
    }
  }

  // Format time display
  function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  // Track when practice starts/stops
  $effect(() => {
    if (isPlaying && !sessionStats.isActive) {
      sessionStats.isActive = true;
      sessionStats.startTime = Date.now() - sessionStats.totalTime;
    } else if (!isPlaying) {
      sessionStats.isActive = false;
    }
  });

  // Track chord changes
  let previousChord = currentChord;
  $effect(() => {
    if (currentChord !== previousChord && previousChord !== '') {
      sessionStats.chordsPlayed++;
      previousChord = currentChord;
    }
  });

  // Track BPM changes
  let previousBpm = bpm;
  $effect(() => {
    if (bpm !== previousBpm) {
      sessionStats.bpmChanges++;
      sessionStats.totalBpmValues.push(bpm);
      sessionStats.averageBpm = Math.round(
        sessionStats.totalBpmValues.reduce((sum, val) => sum + val, 0) / sessionStats.totalBpmValues.length
      );
      previousBpm = bpm;
    }
  });

  function resetStats() {
    sessionStats.startTime = Date.now();
    sessionStats.totalTime = 0;
    sessionStats.chordsPlayed = 0;
    sessionStats.bpmChanges = 0;
    sessionStats.totalBpmValues = [bpm];
    sessionStats.averageBpm = bpm;
    sessionStats.isActive = false;
  }

  onMount(() => {
    updateInterval = window.setInterval(updateSessionTime, 1000);
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });
</script>

<div class="bg-gray-900/50 rounded-lg border border-gray-700/30 p-4">
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-sm font-medium text-gray-300 flex items-center space-x-2">
      <BarChart3 class="w-4 h-4" />
      <span>Session Statistics</span>
    </h3>
    <button
      onclick={resetStats}
      class="p-1 text-gray-400 hover:text-gray-300 transition-colors"
      aria-label="Reset statistics"
    >
      <RotateCcw class="w-4 h-4" />
    </button>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <!-- Practice Time -->
    <div class="text-center">
      <div class="flex items-center justify-center space-x-1 text-emerald-400 mb-1">
        <Clock class="w-4 h-4" />
      </div>
      <div class="text-lg font-bold text-white">{formatTime(sessionStats.totalTime)}</div>
      <div class="text-xs text-gray-400">Practice Time</div>
    </div>

    <!-- Chords Played -->
    <div class="text-center">
      <div class="flex items-center justify-center space-x-1 text-blue-400 mb-1">
        <Music class="w-4 h-4" />
      </div>
      <div class="text-lg font-bold text-white">{sessionStats.chordsPlayed}</div>
      <div class="text-xs text-gray-400">Chords Played</div>
    </div>

    <!-- Current Tempo -->
    <div class="text-center">
      <div class="text-amber-400 mb-1 text-sm">♩</div>
      <div class="text-lg font-bold text-white">{bpm}</div>
      <div class="text-xs text-gray-400">Current BPM</div>
    </div>

    <!-- Average Tempo -->
    <div class="text-center">
      <div class="text-purple-400 mb-1 text-sm">≈♩</div>
      <div class="text-lg font-bold text-white">{sessionStats.averageBpm}</div>
      <div class="text-xs text-gray-400">Avg BPM</div>
    </div>
  </div>

  <!-- Additional Info Row -->
  <div class="mt-4 pt-3 border-t border-gray-700/30">
    <div class="flex items-center justify-between text-xs text-gray-400">
      <div class="flex items-center space-x-4">
        <span>Time Signature: <span class="text-white">{timeSignature}</span></span>
        <span>BPM Changes: <span class="text-white">{sessionStats.bpmChanges}</span></span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 rounded-full {sessionStats.isActive ? 'bg-emerald-400' : 'bg-gray-600'}"></div>
        <span>{sessionStats.isActive ? 'Active' : 'Paused'}</span>
      </div>
    </div>
  </div>

  <!-- Current Progress -->
  <div class="mt-3 pt-3 border-t border-gray-700/30">
    <div class="text-xs text-gray-400 mb-2">Current Progress</div>
    <div class="flex items-center justify-between">
      <div class="text-sm">
        <span class="text-gray-400">Playing:</span>
        <span class="text-emerald-400 font-medium ml-1">{currentChord}</span>
      </div>
      <div class="text-sm">
        <span class="text-gray-400">Next:</span>
        <span class="text-blue-400 font-medium ml-1">{nextChord}</span>
      </div>
    </div>
  </div>
</div>