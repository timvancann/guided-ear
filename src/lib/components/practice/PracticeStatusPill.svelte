<!-- Alternative: Two-line compact PracticeStatusPill.svelte -->
<script lang="ts">
  import { Layers, RefreshCw } from '@lucide/svelte';

  let { playMode, currentLevel, levelName, textIncremental, numberCustomSelected } = $props();
</script>

<div
  class={`inline-flex flex-col gap-1 rounded-lg px-3 py-2 ${
    playMode === 'custom' ? 'bg-blue-900/30 text-blue-300' : playMode === 'incremental' ? 'bg-emerald-900/30 text-emerald-300' : 'bg-purple-900/30 text-purple-300'
  }`}
>
  <!-- Main status line -->
  <div class="flex items-center gap-2">
    {#if playMode === 'custom'}
      <Layers size={14} />
      <span class="text-sm font-medium">Custom</span>
    {:else if playMode === 'incremental'}
      <div class="flex h-4 w-4 items-center justify-center rounded bg-emerald-600 text-xs font-bold text-white">
        {currentLevel}
      </div>
      <span class="text-sm font-medium">{levelName}</span>
    {:else if playMode === 'recap'}
      <RefreshCw size={14} />
      <span class="text-sm font-medium">Recap Level {currentLevel}</span>
    {/if}
  </div>

  <!-- Details line -->
  <div class="text-xs opacity-75">
    {#if playMode === 'incremental'}
      {textIncremental}
    {:else if playMode === 'custom'}
      {numberCustomSelected} items selected
    {:else if playMode === 'recap'}
      All previous exercises
    {/if}
  </div>
</div>
