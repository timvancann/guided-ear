<script lang="ts">
  import { MetronomeEngine } from '$lib/chordflow/metronome.svelte';
  import { Volume2, Clock, Settings } from '@lucide/svelte';

  interface Props {
    metronome: MetronomeEngine;
  }

  let { metronome }: Props = $props();
  let metronomeState = metronome.currentState;
  let showAdvanced = $state(false);
  let tapCount = $state(0);

  const bpmPresets = MetronomeEngine.getBpmPresets();

  function handleTimeSignatureChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const timeSignature = target.value as '4/4' | '3/4' | '2/4';
    metronome.setTimeSignature(timeSignature);
  }

  function handleClickVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value);
    metronome.setClickVolume(volume);
  }

  function handleTapTempo() {
    metronome.tapTempo();
    tapCount++;
    
    // Reset tap count display after 3 seconds
    setTimeout(() => {
      tapCount = 0;
    }, 3000);
  }

  function handleBpmPreset(bpm: number) {
    metronome.setBpmPreset(bpm);
  }
</script>

<div class="space-y-4">
  <!-- Settings Header -->
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-medium text-gray-300">Advanced Settings</h3>
    <button
      onclick={() => (showAdvanced = !showAdvanced)}
      class="p-2 rounded text-gray-400 hover:text-gray-300 transition-colors"
      aria-label="Toggle advanced settings"
    >
      <Settings class="w-4 h-4" />
    </button>
  </div>

  {#if showAdvanced}
    <div class="space-y-6 bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
      <!-- Time Signature -->
      <div class="space-y-2">
        <label for="time-signature" class="text-sm font-medium text-gray-400 flex items-center space-x-2">
          <Clock class="w-4 h-4" />
          <span>Time Signature</span>
        </label>
        <select
          id="time-signature"
          value={metronomeState.timeSignature}
          onchange={handleTimeSignatureChange}
          class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        >
          <option value="4/4">4/4 (Common Time)</option>
          <option value="3/4">3/4 (Waltz Time)</option>
          <option value="2/4">2/4 (March Time)</option>
        </select>
        <p class="text-xs text-gray-500">
          {metronomeState.timeSignature === '4/4'
            ? 'Most common time signature for popular music'
            : metronomeState.timeSignature === '3/4'
              ? 'Common in waltzes and ballads'
              : 'Common in marches and polkas'}
        </p>
      </div>

      <!-- Click Volume -->
      <div class="space-y-2">
        <label for="click-volume" class="text-sm font-medium text-gray-400 flex items-center space-x-2">
          <Volume2 class="w-4 h-4" />
          <span>Click Volume</span>
        </label>
        <div class="flex items-center space-x-3">
          <input
            id="click-volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={metronomeState.clickVolume}
            oninput={handleClickVolumeChange}
            class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span class="text-sm text-gray-400 w-12 text-right">
            {Math.round(metronomeState.clickVolume * 100)}%
          </span>
        </div>
      </div>

      <!-- Tap Tempo -->
      <div class="space-y-2">
        <div class="text-sm font-medium text-gray-400">Tap Tempo</div>
        <div class="flex items-center space-x-3">
          <button
            onclick={handleTapTempo}
            class="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors duration-200 active:scale-95"
          >
            Tap Tempo {tapCount > 0 ? `(${tapCount})` : ''}
          </button>
          <div class="text-xs text-gray-500 text-center">
            <div>Tap the beat</div>
            <div>to set BPM</div>
          </div>
        </div>
        <p class="text-xs text-gray-500">Tap at least twice to calculate BPM</p>
      </div>

      <!-- BPM Presets -->
      <div class="space-y-2">
        <div class="text-sm font-medium text-gray-400">BPM Presets</div>
        <div class="grid grid-cols-2 gap-2">
          {#each bpmPresets as preset (preset.bpm)}
            <button
              onclick={() => handleBpmPreset(preset.bpm)}
              class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors duration-200 {metronomeState.bpm === preset.bpm ? 'bg-emerald-600 hover:bg-emerald-700' : ''}"
            >
              <div class="font-medium text-white">{preset.name}</div>
              <div class="text-xs text-gray-400">{preset.bpm} BPM</div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Current Settings Summary -->
      <div class="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
        <div class="text-xs text-gray-400 space-y-1">
          <div class="flex justify-between">
            <span>Time Signature:</span>
            <span class="text-white">{metronomeState.timeSignature}</span>
          </div>
          <div class="flex justify-between">
            <span>Beats per Bar:</span>
            <span class="text-white">{metronomeState.beatsPerBar}</span>
          </div>
          <div class="flex justify-between">
            <span>Click Volume:</span>
            <span class="text-white">{Math.round(metronomeState.clickVolume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Collapsed View - Quick Access -->
    <div class="flex items-center justify-between bg-gray-800/20 rounded-lg p-3">
      <div class="text-sm text-gray-400">
        {metronomeState.timeSignature} • {Math.round(metronomeState.clickVolume * 100)}% volume
      </div>
      <button
        onclick={handleTapTempo}
        class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-sm text-white transition-colors duration-200"
      >
        Tap
      </button>
    </div>
  {/if}
</div>

<style>
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>