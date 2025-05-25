<script lang="ts">
  import { ChevronDown, ChevronUp, Pause, Play } from '@lucide/svelte';
  import type { Component } from 'svelte';

  interface Props {
    isPlaying: boolean;
    togglePlay: () => void;
    playMode: string;
    currentLevel: number;
    incrementLevel: () => void;
    decrementLevel: () => void;
    totalLevels: number;
    config?: {
      color: string;
      icon: Component;
      title: string;
    };
  }

  let { isPlaying = $bindable(), togglePlay, playMode, currentLevel, incrementLevel, decrementLevel, totalLevels, config }: Props = $props();

  function getColorClasses(color: string, type: 'bg' | 'hover' | 'text' | 'border') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400' },
      blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-500', text: 'text-blue-400', border: 'border-blue-400' },
      purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-500', text: 'text-purple-400', border: 'border-purple-400' },
      orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-500', text: 'text-orange-400', border: 'border-orange-400' }
    };
    return colors[color]?.[type] || '';
  }

  const accentColor = config?.color || 'emerald';
</script>

<div class="mt-auto">
  <div class="grid grid-cols-3 justify-center gap-4">
    <button
      class="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-4 text-gray-400
	transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-800/40 disabled:text-gray-700"
      onclick={decrementLevel}
      disabled={(currentLevel <= 1 && playMode !== 'recap') || playMode === 'custom'}
    >
      <div class="flex flex-col items-center justify-center gap-2">
        <ChevronDown size={30} />
        <span class="text-xs">Level Down</span>
      </div>
    </button>
    <button
      class={`flex flex-col items-center justify-center rounded-lg p-4 ${isPlaying ? 'bg-red-600 hover:bg-red-500' : getColorClasses(accentColor, 'bg') + ' ' + getColorClasses(accentColor, 'hover')}`}
      onclick={togglePlay}
    >
      {#if isPlaying}
        <Pause size={28} class="mb-1" />
        <span class="text-xs">Stop</span>
      {:else}
        <Play size={28} class="mb-1 ml-1" />
        <span class="text-xs">Play</span>
      {/if}
    </button>

    <button
      class="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-4 text-gray-400
transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-800/40 disabled:text-gray-700"
      onclick={incrementLevel}
      disabled={(currentLevel === totalLevels && playMode === 'recap') || playMode === 'custom'}
    >
      <div class="flex flex-col items-center justify-center gap-2">
        <ChevronUp size={30} />
        <span class="text-xs">Level Up</span>
      </div>
    </button>
  </div>
</div>
