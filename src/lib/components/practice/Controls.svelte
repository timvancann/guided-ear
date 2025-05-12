<script lang="ts">
	import { ChevronDown, ChevronUp, Pause, Play } from '@lucide/svelte';

	let {
		isPlaying = $bindable(),
		togglePlay,
		playMode,
		currentLevel,
		incrementLevel,
		decrementLevel,
		totalLevels
	} = $props();
</script>

<div class="mt-auto">
	<div class="grid grid-cols-3 justify-center gap-4">
		<button
			class="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-4 text-gray-400
	transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-800/40 disabled:text-gray-700"
			onclick={decrementLevel}
			disabled={(currentLevel <= 1 && playMode !== 'recap') || playMode === 'custom'}
		>
			<div class="flex flex-col items-center justify-center gap-2">
				<ChevronDown size={30} />
				<span class="text-xs">Level Down</span>
			</div>
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
			class="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-4 text-gray-400
transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-800/40 disabled:text-gray-700"
			onclick={incrementLevel}
			disabled={(currentLevel === totalLevels && playMode === 'recap') || playMode === 'custom'}
		>
			<div class="flex flex-col items-center justify-center gap-2">
				<ChevronUp size={30} />
				<span class="text-xs">Level Up</span>
			</div>
		</button>
	</div>
</div>
