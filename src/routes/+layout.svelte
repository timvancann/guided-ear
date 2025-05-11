<script lang="ts">
	import { browser } from '$app/environment';
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
		audioState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		audioState.player = await new Soundfont(audioState.audioContext, {
			instrument: 'acoustic_grand_piano'
		}).load;
	};
</script>

{#if !browser}
	<AudioLoading />
{:else}
	{@render children()}
{/if}
