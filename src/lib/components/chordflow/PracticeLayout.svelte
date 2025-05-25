<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Settings, Keyboard, BarChart3, Bookmark } from '@lucide/svelte';
  import { chordFlowSettings } from '$lib/chordflow/settings.svelte';

  interface Props {
    children: import('svelte').Snippet;
    settingsPanel?: import('svelte').Snippet;
    statusBar?: import('svelte').Snippet;
  }

  let { children, settingsPanel, statusBar }: Props = $props();

  let showSettings = $state(false);
  let showStats = $state(false);
  let showKeyboardShortcuts = $state(false);
  let showPresetQuickAccess = $state(false);

  // Keyboard shortcuts
  function handleKeydown(event: KeyboardEvent) {
    // Only handle shortcuts when not typing in input fields
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case ' ':
        event.preventDefault();
        // Dispatch space key event for play/pause
        window.dispatchEvent(new CustomEvent('chordflow:space'));
        break;
      case '=':
      case '+':
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('chordflow:bpm-up'));
        break;
      case '-':
      case '_':
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('chordflow:bpm-down'));
        break;
      case 'r':
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('chordflow:reset'));
        break;
      case 's':
        event.preventDefault();
        showSettings = !showSettings;
        break;
      case 't':
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('chordflow:tap-tempo'));
        break;
      case '?':
        event.preventDefault();
        showKeyboardShortcuts = !showKeyboardShortcuts;
        break;
      case 'escape':
        showSettings = false;
        showStats = false;
        showKeyboardShortcuts = false;
        break;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="min-h-screen bg-gray-950 text-white relative">
  <!-- Main Content Area -->
  <div class="transition-all duration-300 {showSettings ? 'mr-96' : ''}">
    <div class="container mx-auto px-4 py-8">
      <!-- Top Controls Bar -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <!-- Settings Toggle -->
          <button
            onclick={() => (showSettings = !showSettings)}
            class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 {showSettings ? 'bg-emerald-600 text-white' : ''}"
            aria-label="Toggle settings panel"
          >
            <Settings class="w-5 h-5" />
          </button>

          <!-- Stats Toggle -->
          <button
            onclick={() => (showStats = !showStats)}
            class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 {showStats ? 'bg-emerald-600 text-white' : ''}"
            aria-label="Toggle statistics"
          >
            <BarChart3 class="w-5 h-5" />
          </button>

          <!-- Keyboard Shortcuts -->
          <button
            onclick={() => (showKeyboardShortcuts = !showKeyboardShortcuts)}
            class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Show keyboard shortcuts"
          >
            <Keyboard class="w-5 h-5" />
          </button>
        </div>

        <!-- Preset Quick Access -->
        <div class="flex items-center space-x-2">
          <button
            onclick={() => (showPresetQuickAccess = !showPresetQuickAccess)}
            class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 {showPresetQuickAccess ? 'bg-emerald-600 text-white' : ''}"
            aria-label="Quick preset access"
          >
            <Bookmark class="w-5 h-5" />
          </button>

          {#if showPresetQuickAccess}
            <div class="flex items-center space-x-2">
              {#each chordFlowSettings.getFavoritePresets() as preset (preset.id)}
                <button
                  onclick={() => {
                    chordFlowSettings.loadPreset(preset.id);
                    showPresetQuickAccess = false;
                  }}
                  class="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors"
                  title={preset.description}
                >
                  {preset.name}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Mobile Menu Indicator -->
        <div class="md:hidden">
          {#if showSettings}
            <div class="text-sm text-gray-400">Settings Open</div>
          {/if}
        </div>
      </div>

      <!-- Status Bar -->
      {#if showStats && statusBar}
        <div class="mb-6">
          {@render statusBar()}
        </div>
      {/if}

      <!-- Main Practice Content -->
      <div class="relative">
        {@render children()}
      </div>
    </div>
  </div>

  <!-- Collapsible Settings Panel -->
  {#if showSettings}
    <div class="fixed top-0 right-0 h-full w-96 bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 translate-x-0">
      <div class="p-6 h-full overflow-y-auto">
        <!-- Settings Header -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-semibold text-white">Practice Settings</h2>
          <button onclick={() => (showSettings = false)} class="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" aria-label="Close settings"> ✕ </button>
        </div>

        <!-- Settings Content -->
        {#if settingsPanel}
          {@render settingsPanel()}
        {/if}
      </div>
    </div>

    <!-- Overlay for mobile -->
    <button class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden cursor-default" onclick={() => (showSettings = false)} aria-label="Close settings overlay"></button>
  {/if}

  <!-- Keyboard Shortcuts Modal -->
  {#if showKeyboardShortcuts}
    <div class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div class="bg-gray-900 rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
          <button onclick={() => (showKeyboardShortcuts = false)} class="text-gray-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Play/Pause</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">Space</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Increase BPM</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">+</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Decrease BPM</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">-</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Reset Metronome</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">R</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Toggle Settings</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">S</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Tap Tempo</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">T</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Show Shortcuts</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">?</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Close Modals</span>
            <kbd class="px-2 py-1 bg-gray-700 rounded text-white">Esc</kbd>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Ensure smooth transitions */
  .transition-transform {
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .fixed.right-0.w-96 {
      width: 100%;
    }
  }
</style>
