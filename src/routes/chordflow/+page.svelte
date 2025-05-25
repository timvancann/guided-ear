<script lang="ts">
  import { onMount } from 'svelte';
  import Metronome from '$lib/components/chordflow/Metronome.svelte';
  import ChordDisplay from '$lib/components/chordflow/ChordDisplay.svelte';
  import ProgressBar from '$lib/components/chordflow/ProgressBar.svelte';
  import ModeSelector from '$lib/components/chordflow/ModeSelector.svelte';
  import AudioControls from '$lib/components/chordflow/AudioControls.svelte';
  import { MetronomeEngine, type MetronomeEvents } from '$lib/chordflow/metronome.svelte';
  import { ChordGenerator } from '$lib/chordflow/chordGenerator.svelte';
  import { chordFlowState, advanceBar, executeChordChange, setBarsPerChord } from '$lib/chordflow/state.svelte';
  import { playChord, chordAudioSettings } from '$lib/chordflow/chordAudio.svelte';

  let title = 'ChordFlow Practice';
  let chordGenerator = new ChordGenerator();
  let metronome = $state<MetronomeEngine | null>(null);

  // Initialize chord progression
  onMount(() => {
    // Set up initial chord progression
    const { current, next } = chordGenerator.getNextChord(
      chordFlowState.settings.progressionType,
      chordFlowState.settings.selectedQualities,
      chordFlowState.settings.diatonicKey,
      chordFlowState.settings.diatonicOption,
      chordFlowState.settings.customProgression
    );
    executeChordChange(current, next);

    // Set up metronome with chord change events
    const events: MetronomeEvents = {
      onBar: handleBarChange,
      onBeat: handleBeatChange
    };

    metronome = new MetronomeEngine(events);
  });

  function handleBarChange() {
    advanceBar();

    // Check if it's time to change chords
    if (chordFlowState.isChordChangeReady) {
      const { current, next } = chordGenerator.getNextChord(
        chordFlowState.settings.progressionType,
        chordFlowState.settings.selectedQualities,
        chordFlowState.settings.diatonicKey,
        chordFlowState.settings.diatonicOption,
        chordFlowState.settings.customProgression
      );
      executeChordChange(current, next);

      // Play chord audio on chord change (only when chords actually change)
      if (chordAudioSettings.enabled) {
        playChord(current);
      }
    }
  }

  function handleBeatChange(beat: number) {
    // Play chord audio on each beat 1 if enabled and playOnBeat1Only is false
    // Only play if we're NOT changing chords this beat to avoid double playback
    if (chordAudioSettings.enabled && !chordAudioSettings.playOnBeat1Only && beat === 0 && !chordFlowState.isChordChangeReady) {
      playChord(chordFlowState.settings.currentChord);
    }
  }


  function handleBarsPerChordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    setBarsPerChord(parseInt(target.value));
  }

</script>

<svelte:head>
  <title>{title} - Guided Ear</title>
  <meta name="description" content="Guitar chord progression practice with metronome" />
</svelte:head>

<main class="min-h-screen bg-gray-950 text-white">
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-emerald-400 mb-2">🎸 ChordFlow</h1>
      <p class="text-gray-300 text-lg">Guitar chord progression practice with metronome</p>
    </header>

    <!-- Main Practice Area -->
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chord Display Section -->
        <div class="lg:col-span-1">
          <div class="bg-gray-900 rounded-lg p-6 shadow-xl">
            <ChordDisplay currentChord={chordFlowState.settings.currentChord} nextChord={chordFlowState.settings.nextChord} isChordChangeReady={chordFlowState.isChordChangeReady} />
          </div>
        </div>

        <!-- Metronome Section -->
        <div class="lg:col-span-1">
          <div class="bg-gray-900 rounded-lg p-6 shadow-xl">
            {#if metronome}
              <Metronome {metronome} />
            {/if}
          </div>
        </div>

        <!-- Progress Section -->
        <div class="lg:col-span-1">
          <div class="bg-gray-900 rounded-lg p-6 shadow-xl">
            {#if metronome}
              <ProgressBar
                currentBeat={metronome.currentState.currentBeat}
                beatsPerBar={metronome.currentState.beatsPerBar}
                currentBar={chordFlowState.currentBar}
                barsPerChord={chordFlowState.settings.barsPerChord}
                barsSinceLastChord={chordFlowState.barsSinceLastChord}
              />
            {/if}
          </div>
        </div>
      </div>

      <!-- Settings Panel -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Mode Selection -->
        <div class="lg:col-span-2 bg-gray-900 rounded-lg p-6 shadow-xl">
          <ModeSelector />
        </div>

        <!-- Timing & Audio Settings -->
        <div class="bg-gray-900 rounded-lg p-6 shadow-xl space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-300 mb-4">Timing</h3>

            <!-- Bars per Chord Setting -->
            <div class="space-y-2">
              <label for="bars-per-chord" class="text-sm font-medium text-gray-400">Bars per Chord</label>
              <select
                id="bars-per-chord"
                value={chordFlowState.settings.barsPerChord}
                onchange={handleBarsPerChordChange}
                class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value={1}>1 Bar</option>
                <option value={2}>2 Bars</option>
                <option value={4}>4 Bars</option>
                <option value={8}>8 Bars</option>
              </select>
              <p class="text-xs text-gray-500">How many bars to play each chord</p>
            </div>
          </div>

          <!-- Audio Controls -->
          <AudioControls />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-center text-gray-500">
      <p>Practice guitar chord progressions with precision timing</p>
    </footer>
  </div>
</main>
