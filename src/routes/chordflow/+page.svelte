<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import PracticeLayout from '$lib/components/chordflow/PracticeLayout.svelte';
  import Metronome from '$lib/components/chordflow/Metronome.svelte';
  import ChordDisplay from '$lib/components/chordflow/ChordDisplay.svelte';
  import ProgressBar from '$lib/components/chordflow/ProgressBar.svelte';
  import SettingsPanel from '$lib/components/chordflow/SettingsPanel.svelte';
  import StatusBar from '$lib/components/chordflow/StatusBar.svelte';
  import { MetronomeEngine, type MetronomeEvents } from '$lib/chordflow/metronome.svelte';
  import { ChordGenerator } from '$lib/chordflow/chordGenerator.svelte';
  import { chordFlowState, advanceBar, executeChordChange } from '$lib/chordflow/state.svelte';
  import { playChord, chordAudioSettings } from '$lib/chordflow/chordAudio.svelte';

  let title = 'ChordFlow Practice';
  let chordGenerator = new ChordGenerator();
  let metronome = $state<MetronomeEngine | null>(null);

  // Initialize chord progression and keyboard shortcuts
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

    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
  });

  function setupKeyboardShortcuts() {
    // Space key for play/pause
    window.addEventListener('chordflow:space', () => {
      if (metronome) {
        metronome.toggle();
      }
    });

    // BPM controls
    window.addEventListener('chordflow:bpm-up', () => {
      if (metronome) {
        const currentBpm = metronome.currentState.bpm;
        metronome.setBpm(Math.min(200, currentBpm + 5));
      }
    });

    window.addEventListener('chordflow:bpm-down', () => {
      if (metronome) {
        const currentBpm = metronome.currentState.bpm;
        metronome.setBpm(Math.max(60, currentBpm - 5));
      }
    });

    // Reset metronome
    window.addEventListener('chordflow:reset', () => {
      if (metronome) {
        metronome.reset();
      }
    });

    // Tap tempo
    window.addEventListener('chordflow:tap-tempo', () => {
      if (metronome) {
        metronome.tapTempo();
      }
    });
  }

  onDestroy(() => {
    // Clean up event listeners
    window.removeEventListener('chordflow:space', () => {});
    window.removeEventListener('chordflow:bpm-up', () => {});
    window.removeEventListener('chordflow:bpm-down', () => {});
    window.removeEventListener('chordflow:reset', () => {});
    window.removeEventListener('chordflow:tap-tempo', () => {});
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



</script>

<svelte:head>
  <title>{title} - Guided Ear</title>
  <meta name="description" content="Guitar chord progression practice with metronome" />
</svelte:head>

<PracticeLayout>
  {#snippet children()}
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
          <div class="bg-gray-900 rounded-lg p-8 shadow-xl">
            <ChordDisplay currentChord={chordFlowState.settings.currentChord} nextChord={chordFlowState.settings.nextChord} isChordChangeReady={chordFlowState.isChordChangeReady} />
          </div>
        </div>

        <!-- Metronome Section -->
        <div class="lg:col-span-1">
          <div class="bg-gray-900 rounded-lg p-8 shadow-xl">
            {#if metronome}
              <Metronome {metronome} />
            {/if}
          </div>
        </div>

        <!-- Progress Section -->
        <div class="lg:col-span-1">
          <div class="bg-gray-900 rounded-lg p-8 shadow-xl">
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
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-center text-gray-500">
      <p class="flex items-center justify-center space-x-2">
        <span>Practice guitar chord progressions with precision timing</span>
        <span class="text-gray-600">•</span>
        <span class="text-emerald-400">Press ? for shortcuts</span>
      </p>
    </footer>
  {/snippet}

  {#snippet settingsPanel()}
    {#if metronome}
      <SettingsPanel {metronome} />
    {/if}
  {/snippet}

  {#snippet statusBar()}
    {#if metronome}
      <StatusBar
        currentChord={chordFlowState.settings.currentChord}
        nextChord={chordFlowState.settings.nextChord}
        bpm={metronome.currentState.bpm}
        timeSignature={metronome.currentState.timeSignature}
        isPlaying={metronome.currentState.isPlaying}
      />
    {/if}
  {/snippet}
</PracticeLayout>
