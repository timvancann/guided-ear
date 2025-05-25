<script lang="ts">
  import type { Component } from 'svelte';
  interface Props {
    progress: number;
    total: number;
    config?: {
      color: string;
      icon: Component;
      title: string;
    };
  }

  let { progress, total, config }: Props = $props();

  let progressPercentage = $derived((progress / total) * 100);

  function getColorClasses(color: string, type: 'bg' | 'text') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400' }
    };
    return colors[color]?.[type] || '';
  }

  const accentColor = config?.color || 'emerald';
</script>

<div>
  <div class="mb-1 flex justify-between text-xs">
    <span class="text-gray-400">Progress</span>
    <span class={getColorClasses(accentColor, 'text')}>{progress}/{total}</span>
  </div>
  <div class="h-2 overflow-hidden rounded-full bg-gray-700">
    <div class="h-full rounded-full {getColorClasses(accentColor, 'bg')} transition-all duration-300" style={`width: ${progressPercentage}%`}></div>
  </div>
</div>
