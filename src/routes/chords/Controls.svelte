<script lang="ts">
	import { ChevronDown, ChevronUp, Pause, Play } from '@lucide/svelte';
	import { chordSettings } from '$lib/state.svelte';

	let { isPlaying = $bindable(), togglePlay, incrementLevel, decrementLevel } = $props();
</script>

<div class="mt-auto">
	<div class="mb-6 grid grid-cols-3 gap-4">
		<button
			class="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-4 hover:bg-gray-700"
			onclick={decrementLevel}
		>
			<ChevronDown size={24} class="mb-1 text-gray-300" />
			<span class="text-xs text-gray-400">Level Down</span>
		</button>

		<button
			class={`flex flex-col items-center justify-center rounded-lg p-4 ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
			onclick={togglePlay}
		>
			{#if isPlaying}
				<Pause size={28} class="mb-1" />
				<span class="text-xs">Stop</span>
			{:else}
				<Play size={28} class="mb-1 ml-1" />
				<span class="text-xs">Play</span>
			{/if}
		</button>

		<button
			class="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-4 hover:bg-gray-700"
			onclick={incrementLevel}
		>
			<ChevronUp size={24} class="mb-1 text-gray-300" />
			<span class="text-xs text-gray-400">Level Up</span>
		</button>
	</div>
</div>
