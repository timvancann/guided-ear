<script lang="ts" generics="T extends TrainingItem">
  import { slide } from 'svelte/transition';
  import TrainingMain from './TrainingMain.svelte';
  import ChordSettings from './ChordSettings.svelte';
  import IntervalSettings from './IntervalSettings.svelte';
  import InversionSettings from './InversionSettings.svelte';
  import type { TrainingItem, TrainingMode } from '$lib/training/types';

  type View = 'main' | 'settings';

  let { mode }: { mode: TrainingMode<T> } = $props();
  let currentView: View = $state('main');
</script>

<div class="flex flex-col bg-gray-900 font-sans text-white">
  {#key currentView}
    <div transition:slide={{ axis: 'y' }}>
      {#if currentView === 'main'}
        <TrainingMain {mode} setView={() => (currentView = 'settings')} />
      {:else if currentView === 'settings'}
        {#if mode.name === 'chords'}
          <ChordSettings setView={() => (currentView = 'main')} />
        {:else if mode.name === 'intervals'}
          <IntervalSettings setView={() => (currentView = 'main')} />
        {:else if mode.name === 'inversions'}
          <InversionSettings setView={() => (currentView = 'main')} />
        {/if}
      {/if}
    </div>
  {/key}
</div>