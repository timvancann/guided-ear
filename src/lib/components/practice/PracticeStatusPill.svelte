<!-- Alternative: Two-line compact PracticeStatusPill.svelte -->
<script lang="ts">
  import { Layers, RefreshCw } from '@lucide/svelte';
  import type { Component } from 'svelte';

  interface Props {
    playMode: string;
    currentLevel: number;
    levelName: string;
    textIncremental: string;
    numberCustomSelected: number;
    config?: {
      color: string;
      icon: Component;
      title: string;
    };
  }

  let { playMode, currentLevel, levelName, textIncremental, numberCustomSelected, config }: Props = $props();

  function getColorClasses(color: string, type: 'bg' | 'text' | 'bgDark') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-300', bgDark: 'bg-emerald-900/30' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-300', bgDark: 'bg-blue-900/30' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-300', bgDark: 'bg-purple-900/30' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-300', bgDark: 'bg-orange-900/30' }
    };
    return colors[color]?.[type] || '';
  }

  const accentColor = config?.color || 'emerald';
</script>

<div
  class={`inline-flex flex-col gap-1 rounded-lg px-3 py-2 ${
    playMode === 'custom'
      ? 'bg-blue-900/30 text-blue-300'
      : playMode === 'incremental'
        ? getColorClasses(accentColor, 'bgDark') + ' ' + getColorClasses(accentColor, 'text')
        : 'bg-purple-900/30 text-purple-300'
  }`}
>
  <!-- Main status line -->
  <div class="flex items-center gap-2">
    {#if playMode === 'custom'}
      <Layers size={14} />
      <span class="text-sm font-medium">Custom</span>
    {:else if playMode === 'incremental'}
      <div class="flex h-4 w-4 items-center justify-center rounded {getColorClasses(accentColor, 'bg')} text-xs font-bold text-white">
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
