<script lang="ts" generics="T extends TrainingItem">
  import { slide } from 'svelte/transition';
  import { ChevronLeft, Settings, Music, Target, RotateCcw, Volume2, Headphones } from '@lucide/svelte';
  import TrainingMain from './TrainingMain.svelte';
  import ChordSettings from './ChordSettings.svelte';
  import IntervalSettings from './IntervalSettings.svelte';
  import InversionSettings from './InversionSettings.svelte';
  import type { TrainingItem, TrainingMode } from '$lib/training/types';
  import ProgressionSettings from './ProgressionSettings.svelte';

  type View = 'main' | 'settings';

  let { mode }: { mode: TrainingMode<T> } = $props();
  let currentView: View = $state('main');

  // Map training modes to their colors and icons
  const modeConfig = {
    chords: { color: 'emerald', icon: Music, title: 'Chord Recognition' },
    intervals: { color: 'purple', icon: Target, title: 'Interval Training' },
    inversions: { color: 'blue', icon: RotateCcw, title: 'Chord Inversions' },
    progressions: { color: 'orange', icon: Volume2, title: 'Chord Progressions' }
  };

  const config = modeConfig[mode.name as keyof typeof modeConfig] || { color: 'emerald', icon: Music, title: mode.title };

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

<!-- Full Screen Background -->
<div class="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black opacity-50"></div>
<div class="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_50%)]"></div>

<!-- Main Container with Responsive Padding -->
<div class="relative min-h-screen p-4 sm:p-6 lg:p-8 xl:p-12 z-10">
  <div class="max-w-7xl mx-auto">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Header -->
      <header class="relative z-10 mb-8">
        <div class="flex items-center justify-between mb-6">
          <a class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors group" href="/" aria-label="Back to home">
            <ChevronLeft class="w-5 h-5 text-gray-300 group-hover:-translate-x-0.5 transition-transform" />
          </a>

          <button
            onclick={() => (currentView = currentView === 'main' ? 'settings' : 'main')}
            class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors group"
            class:bg-emerald-600={currentView === 'settings'}
            class:hover:bg-emerald-700={currentView === 'settings'}
            aria-label="Toggle settings"
          >
            <Settings class="w-5 h-5 text-gray-300 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br {getColorClasses(config.color, 'from')} {getColorClasses(config.color, 'to')} rounded-xl">
            <config.icon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r {getColorClasses(config.color, 'text')} via-gray-300 to-white bg-clip-text text-transparent">
              {config.title}
            </h1>
            <p class="text-gray-400">Practice and improve your musical ear</p>
          </div>
        </div>
      </header>
    </div>

    <!-- Main Content -->
    <div class="relative">
      {#key currentView}
        <div transition:slide={{ axis: 'y', duration: 300 }} class="relative z-10">
          {#if currentView === 'main'}
            <TrainingMain {mode} {config} />
          {:else if currentView === 'settings'}
            <div class="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 mb-8">
              <div class="flex items-center space-x-3 mb-6">
                <Settings class="w-6 h-6 {getColorClasses(config.color, 'text')}" />
                <h2 class="text-2xl font-bold text-white">Training Settings</h2>
              </div>

              {#if mode.name === 'chords'}
                <ChordSettings setView={() => {}} />
              {:else if mode.name === 'intervals'}
                <IntervalSettings setView={() => {}} />
              {:else if mode.name === 'inversions'}
                <InversionSettings setView={() => {}} />
              {:else if mode.name === 'progressions'}
                <ProgressionSettings setView={() => {}} />
              {/if}

              <div class="mt-8 pt-6 border-t border-gray-700">
                <button
                  onclick={() => (currentView = 'main')}
                  class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r {getColorClasses(config.color, 'from')} {getColorClasses(
                    config.color,
                    'to'
                  )} rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span>Return to Practice</span>
                  <ChevronLeft class="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/key}
    </div>

    <!-- Footer -->
    <div class="mt-16 border-t border-gray-800 pt-6 text-center">
      <div class="flex items-center justify-center space-x-2 mb-2">
        <Headphones class="w-4 h-4 {getColorClasses(config.color, 'text')}" />
        <span class="text-sm font-medium text-gray-400">Guided Ear Training</span>
      </div>
      <p class="text-xs text-gray-500">Practice with focus, improve with consistency</p>
    </div>
  </div>
</div>
