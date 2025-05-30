<script lang="ts">
  import AudioBars from '$lib/components/AudioBars.svelte';
  import { Mic, Music } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { sineInOut } from 'svelte/easing';

  interface Props {
    answer: string;
    playState: 'idle' | 'playing' | 'waiting' | 'answering' | 'finished' | 'generating';
    config?: {
      color: string;
      icon: Component;
      title: string;
    };
  }

  let { playState, answer, config }: Props = $props();

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

  // Create breathing effect
  const breathingScale = tweened(1, {
    duration: 2000,
    easing: sineInOut
  });

  // Create particle opacity for pulsing effect
  const particleOpacity = tweened(0.5, {
    duration: 1500,
    easing: sineInOut
  });

  // Start animations when entering waiting state
  $effect(() => {
    if (playState === 'waiting') {
      // Continuous breathing effect
      const breathe = async () => {
        while (playState === 'waiting') {
          await breathingScale.set(1.05);
          await breathingScale.set(0.95);
        }
      };
      breathe();

      // Particle opacity pulse
      const pulse = async () => {
        while (playState === 'waiting') {
          await particleOpacity.set(0.9);
          await particleOpacity.set(0.3);
        }
      };
      pulse();
    }
  });
</script>

<div class="flex flex-1 items-center justify-center">
  <div class="relative flex h-64 w-64 items-center justify-center rounded-full focus:outline-none">
    <div class="absolute inset-0">
      {#if playState === 'idle'}
        <div class="absolute inset-0 rounded-full border-4 border-gray-700">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400">
            <div class="flex items-center justify-center gap-3">
              <iconComponent size={32} class="text-gray-500"></iconComponent>
              <div class="text-left">
                <div class="text-lg font-medium">Ready</div>
                <div class="text-sm text-gray-500">Press play to start</div>
              </div>
            </div>
          </div>
        </div>
      {:else if playState === 'playing'}
        <div class="absolute inset-0 rounded-full border-8 {getColorClasses(accentColor, 'border')}/20 bg-gray-800 shadow-lg"></div>
        <div class="absolute inset-0 animate-spin rounded-full border-t-8 {getColorClasses(accentColor, 'border')}" style="animation-duration: 4s"></div>

        <!-- Content  -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class=" flex flex-col items-center justify-center text-center">
            <div class="mb-1 {getColorClasses(accentColor, 'text')}">Playing</div>
            <AudioBars />
          </div>
        </div>
      {:else if playState === 'waiting'}
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

        <!-- Inner breathing circle -->
        <div
          in:scale={{ delay: 200, duration: 500 }}
          style:transform="scale({0.9 + 0.1 * ($breathingScale - 1) * 20})"
          class="absolute inset-4 rounded-full border {getColorClasses(accentColor, 'border')}/30"
        ></div>

        <!-- Content -->
        <div in:fade={{ delay: 300, duration: 500 }} out:fade={{ duration: 200 }} class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center justify-center text-center">
            <div in:scale={{ delay: 400, duration: 500, start: 0.8 }} style:opacity={0.7 + 0.3 * ($breathingScale - 1) * 20} class="mb-2 text-lg {getColorClasses(accentColor, 'text')}">
              Think about it...
            </div>
            <div in:fade={{ delay: 600 }} class="text-sm text-gray-400">Take your time</div>
          </div>
        </div>
      {:else if playState === 'answering'}
        <!-- Background gradient -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-r {getColorClasses(accentColor, 'from')}/40 {getColorClasses(accentColor, 'to')}/30"></div>

        <!-- Border  -->
        <div class="absolute inset-0 rounded-full border-4 {getColorClasses(accentColor, 'border')}"></div>

        <!-- Content  -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class=" flex flex-col items-center justify-center text-center">
            <div class="mb-1 text-sm {getColorClasses(accentColor, 'text')}">Correct answer:</div>
            <div class="text-4xl font-bold {getColorClasses(accentColor, 'text')}">{answer}</div>
            <div class="mt-8 flex items-center gap-2 rounded-full {getColorClasses(accentColor, 'bg')}/20 px-3 py-1 text-sm">
              <Mic size={14} class="animate-pulse {getColorClasses(accentColor, 'text')}" />
              <span>Speaking...</span>
            </div>
          </div>
        </div>
      {:else if playState === 'finished'}
        <!-- Minimal background -->
        <div in:fade={{ duration: 300 }} out:fade={{ duration: 200 }} class="absolute inset-0 rounded-full bg-gray-800/10"></div>

        <!-- Border -->
        <div in:scale={{ delay: 100, duration: 400, start: 0.9 }} class="absolute inset-0 rounded-full border-2 border-green-500/30"></div>

        <!-- Content -->
        <div in:fade={{ delay: 200, duration: 400 }} out:fade={{ duration: 300 }} class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center justify-center text-center">
            <div in:scale={{ duration: 500, start: 0.5 }} class="mb-2 text-green-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L12 15L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <div class="text-sm text-gray-300">Completed</div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
