<script lang="ts">
  import { CheckCircle, XCircle } from '@lucide/svelte';
  import { fade, scale } from 'svelte/transition';
  import type { Component } from 'svelte';
  import type { InteractivePlayState } from '$lib/training/InteractiveTrainingEngine.svelte';

  interface Props {
    options: string[];
    correctAnswer: string;
    playState: InteractivePlayState;
    selectedAnswer: string | null;
    showFeedback: boolean;
    onSelectAnswer: (answer: string) => void;
    config?: {
      color: string;
      icon: Component;
      title: string;
    };
  }

  let { options, correctAnswer, playState, selectedAnswer, showFeedback, onSelectAnswer, config }: Props = $props();

  function getColorClasses(color: string, type: 'bg' | 'text' | 'border' | 'hover') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-400', hover: 'hover:bg-emerald-500' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-400', hover: 'hover:bg-blue-500' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-400', hover: 'hover:bg-purple-500' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-400', hover: 'hover:bg-orange-500' }
    };
    return colors[color]?.[type] || '';
  }

  const accentColor = config?.color || 'emerald';

  function getButtonClass(option: string) {
    const isCorrect = option === correctAnswer;
    const isSelected = option === selectedAnswer;
    const canClick = playState === 'selecting';

    if (showFeedback) {
      if (isSelected && isCorrect) {
        return 'bg-green-600 border-green-500 text-white';
      } else if (isSelected && !isCorrect) {
        return 'bg-red-600 border-red-500 text-white';
      } else if (isCorrect) {
        return 'bg-green-600/50 border-green-500/50 text-green-300';
      } else {
        return 'bg-gray-700 border-gray-600 text-gray-400';
      }
    }

    if (!canClick) {
      return 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed';
    }

    return `bg-gray-800 border-gray-600 text-white hover:bg-gray-700 ${getColorClasses(accentColor, 'hover')} transition-all duration-200 cursor-pointer`;
  }

  function handleClick(option: string) {
    if (playState === 'selecting') {
      onSelectAnswer(option);
    }
  }
</script>

<div class="space-y-4">
  <div class="text-center mb-6">
    <h3 class="text-lg font-semibold text-white mb-2">Select the Chord</h3>
    {#if playState === 'idle'}
      <p class="text-gray-400 text-sm">Press play to hear a chord</p>
    {:else if playState === 'playing'}
      <p class="text-gray-400 text-sm">Listen carefully...</p>
    {:else if playState === 'selecting'}
      <p class="{getColorClasses(accentColor, 'text')} text-sm">Choose your answer</p>
    {:else if playState === 'feedback'}
      <p class="text-gray-400 text-sm">
        {selectedAnswer === correctAnswer ? 'Well done!' : 'Better luck next time!'}
      </p>
    {/if}
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
    {#each options as option (option)}
      <button
        class="relative p-2 sm:p-3 rounded-lg border-2 font-medium text-center transition-all duration-200 text-sm {getButtonClass(option)}"
        onclick={() => handleClick(option)}
        disabled={playState !== 'selecting'}
        in:fade={{ delay: options.indexOf(option) * 50, duration: 300 }}
      >
        <div class="flex items-center justify-center relative">
          <span class="text-center flex-1">{option}</span>

          {#if showFeedback}
            <div class="absolute -top-1 -right-1">
              {#if option === selectedAnswer && option === correctAnswer}
                <div in:scale={{ duration: 300 }}>
                  <CheckCircle class="w-4 h-4 text-green-300" />
                </div>
              {:else if option === selectedAnswer && option !== correctAnswer}
                <div in:scale={{ duration: 300 }}>
                  <XCircle class="w-4 h-4 text-red-300" />
                </div>
              {:else if option === correctAnswer}
                <div in:scale={{ duration: 300, delay: 200 }}>
                  <CheckCircle class="w-4 h-4 text-green-400/60" />
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Ripple effect for clicking -->
        {#if playState === 'selecting'}
          <div class="absolute inset-0 rounded-lg bg-gradient-to-r {getColorClasses(accentColor, 'bg')}/0 hover:{getColorClasses(accentColor, 'bg')}/10 transition-all duration-200"></div>
        {/if}
      </button>
    {/each}
  </div>

  {#if options.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-500 text-sm">No options available</p>
    </div>
  {/if}
</div>
