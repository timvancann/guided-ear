<script lang="ts" generics="T extends TrainingItem">
  import { TrainingEngine } from '$lib/training/TrainingEngine.svelte';
  import PracticeHeader from '$lib/components/PracticeHeader.svelte';
  import PracticeStatusPill from '$lib/components/practice/PracticeStatusPill.svelte';
  import PlayerSettingToggle from '$lib/components/practice/PlayerSettingToggle.svelte';
  import PlayingIndicator from '$lib/components/practice/PlayingIndicator.svelte';
  import ProgressBar from '$lib/components/practice/ProgressBar.svelte';
  import Controls from '$lib/components/practice/Controls.svelte';
  import type { TrainingItem, TrainingMode } from '$lib/training/types';
  import { slide } from 'svelte/transition';

  let { mode, setView }: { mode: TrainingMode<T>; setView: () => void } = $props();
  
  const engine = new TrainingEngine(mode);

  // Reactive effects
  $effect(() => {
    engine.handlePlayModeSync();
  });

  $effect(() => {
    engine.handleStateEffects();
  });
</script>

<PracticeHeader {setView} title={mode.title} />

<div class="flex flex-col space-y-6">
  <div class="flex items-center justify-between">
    <PracticeStatusPill
      playMode={mode.settings.playMode}
      currentLevel={mode.settings.currentLevel}
      levelName={mode.levels[mode.settings.currentLevel - 1].name}
      textIncremental={engine.itemsInLevel.map((item) => mode.getDisplayText(item)).join(', ')}
      numberCustomSelected={engine.selectedItems.length}
    />
    <PlayerSettingToggle bind:toggle={mode.settings.incrementalMode} name="Level mode" label="" />
  </div>
  <PlayingIndicator playState={engine.playState} answer={engine.currentItem ? mode.getDisplayText(engine.currentItem) : ''} />
  <ProgressBar total={mode.settings.totalExercises} progress={mode.settings.progress} />
  <Controls 
    togglePlay={engine.togglePlay.bind(engine)} 
    isPlaying={engine.isPlaying} 
    incrementLevel={engine.incrementLevel.bind(engine)} 
    decrementLevel={engine.decrementLevel.bind(engine)} 
    currentLevel={mode.settings.currentLevel} 
    playMode={mode.settings.playMode} 
    totalLevels={mode.levels.length} 
  />

  {#if mode.settings.playMode !== 'custom'}
    <div class="mb-4 rounded-lg bg-gray-800 p-4" transition:slide>
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-400">Change Level</span>
          <PlayerSettingToggle bind:toggle={mode.settings.autoIncrement} name="Auto increment" label="" />
        </div>
        <select
          value={mode.settings.currentLevel}
          onchange={(e) => (mode.settings.currentLevel = parseInt((e.target as HTMLSelectElement).value))}
          class="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        >
          {#each mode.levels as level (level.level)}
            <option value={level.level} class="bg-gray-800 text-white">
              {level.level}: {level.name}
            </option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
</div>