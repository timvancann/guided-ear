<script lang="ts">
  import { chordAudioSettings, toggleChordAudio, setChordVolume, setChordVoicing, togglePlayOnBeat1Only, playChord } from '$lib/chordflow/chordAudio.svelte';
  import { chordFlowState } from '$lib/chordflow/state.svelte';
  import { Volume2, VolumeX, Play } from '@lucide/svelte';

  function handleVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    setChordVolume(parseFloat(target.value));
  }

  function handleVoicingChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    setChordVoicing(target.value as 'close' | 'open' | 'shell');
  }

  function testChordAudio() {
    playChord(chordFlowState.settings.currentChord);
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="text-md font-medium text-gray-300">Audio Settings</h4>
    <button onclick={toggleChordAudio} class="p-1 rounded text-gray-400 hover:text-gray-300" aria-label="Toggle chord audio">
      {#if chordAudioSettings.enabled}
        <Volume2 class="w-4 h-4" />
      {:else}
        <VolumeX class="w-4 h-4" />
      {/if}
    </button>
  </div>

  <!-- Audio Enable/Disable -->
  <div class="flex items-center space-x-3">
    <label class="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={chordAudioSettings.enabled}
        onchange={toggleChordAudio}
        class="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
      />
      <span class="text-sm text-gray-300">Enable chord audio</span>
    </label>
  </div>

  {#if chordAudioSettings.enabled}
    <!-- Volume Control -->
    <div class="space-y-2">
      <label for="chord-volume" class="text-sm font-medium text-gray-400">Chord Volume</label>
      <div class="flex items-center space-x-3">
        <input
          id="chord-volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={chordAudioSettings.volume}
          oninput={handleVolumeChange}
          class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <span class="text-xs text-gray-400 min-w-[2rem]">
          {Math.round(chordAudioSettings.volume * 100)}%
        </span>
      </div>
    </div>

    <!-- Chord Voicing -->
    <div class="space-y-2">
      <label for="chord-voicing" class="text-sm font-medium text-gray-400">Chord Voicing</label>
      <select id="chord-voicing" value={chordAudioSettings.voicing} onchange={handleVoicingChange} class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
        <option value="close">Close Position</option>
        <option value="open">Open Position</option>
        <option value="shell">Shell Voicing</option>
      </select>
      <div class="text-xs text-gray-500">
        {chordAudioSettings.voicing === 'close' ? 'Notes close together' : chordAudioSettings.voicing === 'open' ? 'Notes spread wider' : 'Root + 7th only'}
      </div>
    </div>

    <!-- Play Timing -->
    <div class="flex items-center space-x-3">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={chordAudioSettings.playOnBeat1Only}
          onchange={togglePlayOnBeat1Only}
          class="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
        />
        <span class="text-sm text-gray-300">Play on beat 1 only</span>
      </label>
    </div>

    <!-- Test Button -->
    <div class="pt-2">
      <button onclick={testChordAudio} class="flex items-center space-x-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white text-sm transition-colors duration-200">
        <Play class="w-4 h-4" />
        <span>Test Current Chord</span>
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
