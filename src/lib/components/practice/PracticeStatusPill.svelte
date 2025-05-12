<script lang="ts">
	import { Layers, RefreshCw } from '@lucide/svelte';

	let { playMode, currentLevel, levelName, textIncremental, numberCustomSelected } = $props();
</script>

<div
	class={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
		playMode === 'custom'
			? 'bg-blue-900/30 text-blue-300'
			: playMode === 'incremental'
				? 'bg-emerald-900/30 text-emerald-300'
				: 'bg-purple-900/30 text-purple-300'
	}`}
>
	{#if playMode === 'custom'}
		<Layers size={14} />
	{:else if playMode === 'incremental'}
		<div
			class="flex h-4 w-4 items-center justify-center rounded bg-emerald-600 text-xs font-bold text-white"
		>
			{currentLevel}
		</div>
	{:else if playMode === 'recap'}
		<RefreshCw size={14} />
	{/if}

	<span class="text-sm font-medium">
		{#if playMode === 'custom'}
			Custom
		{:else if playMode === 'incremental'}
			{levelName}
		{:else if playMode === 'recap'}
			Recap level {currentLevel}
		{/if}
	</span>

	{#if playMode === 'incremental'}
		<span class="text-xs opacity-75">({textIncremental})</span>
	{:else if playMode === 'custom'}
		<span class="text-xs opacity-75">({numberCustomSelected} selected)</span>
	{:else if playMode === 'recap'}
		<span class="text-xs opacity-75">(All previous exercises)</span>
	{/if}
</div>
