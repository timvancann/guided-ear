<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import '../app.css';
  import { Soundfont } from 'smplr';
  import AudioLoading from './AudioLoading.svelte';
  import { audioState } from '$lib/audioplayer.svelte';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(async () => {
    await setupPlayer();
    if ('speechSynthesis' in window) {
      audioState.speech = speechSynthesis;
    } else {
      console.error('Text-to-speech not supported in this browser');
    }
  });
  const setupPlayer = async () => {
    audioState.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioState.player = await new Soundfont(audioState.audioContext, {
      instrument: 'acoustic_grand_piano',
      volume: 127
    }).load;
  };
</script>

{#if !browser}
  <AudioLoading />
{:else}
  <!-- ChordFlow and training pages handle their own layout, other pages need padding -->
  {#if $page.route.id === '/chordflow' || $page.route.id?.includes('/training/') || $page.route.id?.includes('/chords') || $page.route.id?.includes('/intervals') || $page.route.id?.includes('/inversions') || $page.route.id?.includes('/progressions')}
    {@render children()}
  {:else}
    <div class="p-6">
      {@render children()}
    </div>
  {/if}
{/if}
