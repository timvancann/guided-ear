<script lang="ts" generics="T extends TrainingItem">
  import { TrainingEngine } from '$lib/training/TrainingEngine.svelte';
  import PracticeStatusPill from '$lib/components/practice/PracticeStatusPill.svelte';
  import PlayerSettingToggle from '$lib/components/practice/PlayerSettingToggle.svelte';
  import PlayingIndicator from '$lib/components/practice/PlayingIndicator.svelte';
  import ProgressBar from '$lib/components/practice/ProgressBar.svelte';
  import Controls from '$lib/components/practice/Controls.svelte';
  import type { TrainingItem, TrainingMode } from '$lib/training/types';
  import { slide } from 'svelte/transition';
  import { Play, Volume2, Settings } from '@lucide/svelte';

  import type { Component } from 'svelte';

  interface Config {
    color: string;
    icon: Component;
    title: string;
  }

  let { mode, config }: { mode: TrainingMode<T>; config: Config } = $props();

  const engine = new TrainingEngine(mode);

  // Reactive effects
  $effect(() => {
    engine.handlePlayModeSync();
  });

  // Only run state effects when playState changes
  $effect(() => {
    const currentState = engine.playState;
    engine.handleStateEffects();
  });

  function getColorClasses(color: string, type: 'bg' | 'text' | 'border' | 'from' | 'to') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400', from: 'from-emerald-500', to: 'to-emerald-600' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-400', from: 'from-blue-500', to: 'to-blue-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-400', from: 'from-purple-500', to: 'to-purple-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-400', from: 'from-orange-500', to: 'to-orange-600' }
    };
    return colors[color]?.[type] || '';
  }
</script>

<!-- Status Section -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
  <!-- Practice Status -->
  <div class="lg:col-span-2 bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br {getColorClasses(config.color, 'from')} {getColorClasses(config.color, 'to')} rounded-lg">
          <config.icon class="w-4 h-4 text-white" />
        </div>
        <h3 class="text-lg font-semibold text-white">Practice Status</h3>
      </div>
      <PlayerSettingToggle bind:toggle={mode.settings.incrementalMode} name="Level mode" label="" />
    </div>

    <PracticeStatusPill
      playMode={mode.settings.playMode}
      currentLevel={mode.settings.currentLevel}
      levelName={mode.levels[mode.settings.currentLevel - 1].name}
      textIncremental={engine.itemsInLevel.map((item) => mode.getDisplayText(item as T)).join(', ')}
      numberCustomSelected={engine.selectedItems.length}
      {config}
    />
  </div>

  <!-- Progress -->
  <div class="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
    <div class="flex items-center space-x-3 mb-4">
      <div class="flex items-center justify-center w-8 h-8 {getColorClasses(config.color, 'bg')}/20 rounded-lg">
        <Volume2 class="w-4 h-4 {getColorClasses(config.color, 'text')}" />
      </div>
      <h3 class="text-lg font-semibold text-white">Progress</h3>
    </div>
    <ProgressBar total={mode.settings.totalExercises} progress={mode.settings.progress} {config} />
  </div>
</div>

<!-- Main Practice Area -->
<div class="bg-gray-800/20 border border-gray-700/30 rounded-3xl p-8 mb-8">
  <PlayingIndicator playState={engine.playState} answer={engine.currentItem ? mode.getDisplayText(engine.currentItem as T) : ''} {config} />
</div>

<!-- Controls Section -->
<div class="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 mb-8">
  <div class="flex items-center space-x-3 mb-6">
    <div class="flex items-center justify-center w-8 h-8 {getColorClasses(config.color, 'bg')}/20 rounded-lg">
      <Play class="w-4 h-4 {getColorClasses(config.color, 'text')}" />
    </div>
    <h3 class="text-lg font-semibold text-white">Practice Controls</h3>
  </div>

  <Controls
    togglePlay={engine.togglePlay.bind(engine)}
    isPlaying={engine.isPlaying}
    incrementLevel={engine.incrementLevel.bind(engine)}
    decrementLevel={engine.decrementLevel.bind(engine)}
    currentLevel={mode.settings.currentLevel}
    playMode={mode.settings.playMode}
    totalLevels={mode.levels.length}
    {config}
  />
</div>

<!-- Level Settings -->
{#if mode.settings.playMode !== 'custom'}
  <div class="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6" transition:slide>
    <div class="flex items-center space-x-3 mb-6">
      <div class="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
        <Settings class="w-4 h-4 text-purple-400" />
      </div>
      <h3 class="text-lg font-semibold text-white">Level Settings</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-3">
        <label for="level-select" class="text-sm font-medium {getColorClasses(config.color, 'text')}">Current Level</label>
        <select
          id="level-select"
          value={mode.settings.currentLevel}
          onchange={(e) => (mode.settings.currentLevel = parseInt((e.target as HTMLSelectElement).value))}
          class="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
        >
          {#each mode.levels as level (level.level)}
            <option value={level.level} class="bg-gray-800 text-white">
              Level {level.level}: {level.name}
            </option>
          {/each}
        </select>
      </div>

      <div class="space-y-3">
        <div class="text-sm font-medium {getColorClasses(config.color, 'text')}">Auto Increment</div>
        <div class="flex items-center">
          <PlayerSettingToggle bind:toggle={mode.settings.autoIncrement} name="Auto increment levels" label="Automatically advance to next level when mastered" />
        </div>
      </div>
    </div>
  </div>
{/if}
