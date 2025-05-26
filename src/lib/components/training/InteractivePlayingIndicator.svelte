<script lang="ts">
  import AudioBars from '$lib/components/AudioBars.svelte';
  import { Music, CheckCircle, XCircle } from '@lucide/svelte';
  import { fade, scale } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { sineInOut } from 'svelte/easing';
  import type { Component } from 'svelte';
  import type { InteractivePlayState } from '$lib/training/InteractiveTrainingEngine.svelte';

  interface Props {
    answer: string;
    playState: InteractivePlayState;
    showFeedback: boolean;
    lastAnswerCorrect: boolean | null;
    selectedAnswer: string | null;
    config?: {
      color: string;
      icon: Component;
      title: string;
    };
  }

  let { playState, answer, showFeedback, lastAnswerCorrect, selectedAnswer, config }: Props = $props();

  function getColorClasses(color: string, type: 'bg' | 'text' | 'border' | 'from' | 'to') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400', from: 'from-emerald-500', to: 'to-emerald-600' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-400', from: 'from-blue-500', to: 'to-blue-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-400', from: 'from-purple-500', to: 'to-purple-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-400', from: 'from-orange-500', to: 'to-orange-600' }
    };
    return colors[color]?.[type] || '';
  }

  const accentColor = config?.color || 'emerald';
  const iconComponent = $derived(config?.icon || Music);

  // Create breathing effect for waiting state
  const breathingScale = tweened(1, {
    duration: 2000,
    easing: sineInOut
  });

  // Start breathing animation when in selecting state
  $effect(() => {
    if (playState === 'selecting') {
      const breathe = async () => {
        while (playState === 'selecting') {
          await breathingScale.set(1.05);
          await breathingScale.set(0.95);
        }
      };
      breathe();
    }
  });
</script>

<div class="flex flex-1 items-center justify-center">
  <div class="relative flex h-48 w-48 items-center justify-center rounded-full focus:outline-none">
    <div class="absolute inset-0">
      {#if playState === 'idle'}
        <div class="absolute inset-0 rounded-full border-4 border-gray-700">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400">
            <div class="flex flex-col items-center justify-center">
              <iconComponent class="w-8 h-8 text-gray-500 mb-2"></iconComponent>
              <div class="text-center">
                <div class="text-lg font-medium">Ready</div>
                <div class="text-sm text-gray-500">Press play to start</div>
              </div>
            </div>
          </div>
        </div>
      {:else if playState === 'playing'}
        <div class="absolute inset-0 rounded-full border-6 {getColorClasses(accentColor, 'border')}/20 bg-gray-800 shadow-lg"></div>
        <div class="absolute inset-0 animate-spin rounded-full border-t-6 {getColorClasses(accentColor, 'border')}" style="animation-duration: 4s"></div>

        <!-- Content  -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center justify-center text-center">
            <div class="mb-2 {getColorClasses(accentColor, 'text')}">Playing</div>
            <AudioBars />
          </div>
        </div>
      {:else if playState === 'selecting'}
        <!-- Background -->
        <div in:fade={{ duration: 400 }} out:fade={{ duration: 200 }} class="absolute inset-0 rounded-full bg-gradient-to-r {getColorClasses(accentColor, 'from')}/20 to-blue-900/20"></div>

        <!-- Breathing border -->
        <div
          in:scale={{ duration: 500, start: 0.9 }}
          out:scale={{ duration: 300, start: 1.1 }}
          style:transform="scale({$breathingScale})"
          style:opacity={0.8 + 0.2 * ($breathingScale - 1) * 20}
          class="absolute inset-0 rounded-full border-4 {getColorClasses(accentColor, 'border')} transition-all duration-100"
        ></div>

        <!-- Content -->
        <div in:fade={{ delay: 300, duration: 500 }} out:fade={{ duration: 200 }} class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center justify-center text-center">
            <div class="mb-2 text-lg {getColorClasses(accentColor, 'text')}">Choose Answer</div>
            <div class="text-sm text-gray-400">Click the correct chord</div>
          </div>
        </div>
      {:else if playState === 'feedback'}
        <!-- Feedback Background -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-r {lastAnswerCorrect ? 'from-green-900/40 to-green-700/30' : 'from-red-900/40 to-red-700/30'}"></div>

        <!-- Border  -->
        <div class="absolute inset-0 rounded-full border-4 {lastAnswerCorrect ? 'border-green-500' : 'border-red-500'}"></div>

        <!-- Content  -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center justify-center text-center">
            {#if lastAnswerCorrect}
              <CheckCircle class="w-8 h-8 text-green-400 mb-2" />
              <div class="text-sm text-green-300">Correct!</div>
              <div class="text-xs text-gray-400 mt-1">{answer}</div>
            {:else}
              <XCircle class="w-8 h-8 text-red-400 mb-2" />
              <div class="text-sm text-red-300">Incorrect</div>
              <div class="text-xs text-gray-400 mt-1">Answer: {answer}</div>
              {#if selectedAnswer}
                <div class="text-xs text-red-400 mt-1">You chose: {selectedAnswer}</div>
              {/if}
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
