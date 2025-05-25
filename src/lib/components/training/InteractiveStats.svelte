<script lang="ts">
  import { TrendingUp, Target, Clock, Zap } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import type { InteractiveStats } from '$lib/training/InteractiveTrainingEngine.svelte';

  interface Props {
    stats: InteractiveStats;
    config?: {
      color: string;
      icon: Component;
      title: string;
    };
  }

  let { stats, config }: Props = $props();

  function getColorClasses(color: string, type: 'bg' | 'text' | 'border') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-400' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-400' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-400' }
    };
    return colors[color]?.[type] || '';
  }

  const accentColor = config?.color || 'emerald';

  const accuracy = $derived(stats.totalAnswers > 0 ? ((stats.correctAnswers / stats.totalAnswers) * 100) : 0);
  const avgResponseTime = $derived(stats.averageResponseTime / 1000); // Convert to seconds
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- Accuracy -->
  <div class="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
    <div class="flex items-center space-x-3 mb-3">
      <div class="flex items-center justify-center w-8 h-8 {getColorClasses(accentColor, 'bg')}/20 rounded-lg">
        <Target class="w-4 h-4 {getColorClasses(accentColor, 'text')}" />
      </div>
      <div>
        <div class="text-sm text-gray-400">Accuracy</div>
        <div class="text-xl font-bold text-white">{accuracy.toFixed(1)}%</div>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div class="w-full bg-gray-600 rounded-full h-2">
      <div 
        class="h-2 rounded-full {getColorClasses(accentColor, 'bg')} transition-all duration-500"
        style="width: {accuracy}%"
      ></div>
    </div>
  </div>

  <!-- Total Answers -->
  <div class="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
    <div class="flex items-center space-x-3 mb-3">
      <div class="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
        <TrendingUp class="w-4 h-4 text-blue-400" />
      </div>
      <div>
        <div class="text-sm text-gray-400">Total</div>
        <div class="text-xl font-bold text-white">{stats.totalAnswers}</div>
      </div>
    </div>
    
    <div class="text-xs text-gray-500">
      {stats.correctAnswers} correct • {stats.incorrectAnswers} incorrect
    </div>
  </div>

  <!-- Current Streak -->
  <div class="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
    <div class="flex items-center space-x-3 mb-3">
      <div class="flex items-center justify-center w-8 h-8 bg-orange-500/20 rounded-lg">
        <Zap class="w-4 h-4 text-orange-400" />
      </div>
      <div>
        <div class="text-sm text-gray-400">Streak</div>
        <div class="text-xl font-bold text-white">{stats.currentStreak}</div>
      </div>
    </div>
    
    <div class="text-xs text-gray-500">
      Best: {stats.bestStreak}
    </div>
  </div>

  <!-- Average Response Time -->
  <div class="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
    <div class="flex items-center space-x-3 mb-3">
      <div class="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
        <Clock class="w-4 h-4 text-purple-400" />
      </div>
      <div>
        <div class="text-sm text-gray-400">Avg Time</div>
        <div class="text-xl font-bold text-white">{avgResponseTime.toFixed(1)}s</div>
      </div>
    </div>
    
    <div class="text-xs text-gray-500">
      Response time
    </div>
  </div>
</div>

{#if stats.totalAnswers === 0}
  <div class="text-center py-8">
    <p class="text-gray-500 text-sm">Start practicing to see your statistics!</p>
  </div>
{/if}