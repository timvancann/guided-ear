<script lang="ts">
	import { chordCategories, levels } from '$lib/settings.svelte';
	import { Layers, RefreshCw } from '@lucide/svelte';
	import { chordSettings } from '$lib/state.svelte';

	let selectedChords = $derived(
		chordCategories.flatMap((group) => group.chords).filter((chord) => chord.enabled)
	);

	const chordsInLevel = $derived(
		chordCategories.flatMap((category) => {
			return category.chords.filter((chord) => chord.level === chordSettings.currentLevel);
		})
	);
	$effect(() => console.log(chordsInLevel));
</script>

<div
	class={`inline-flex flex-col overflow-hidden rounded-xl ${
		chordSettings.playMode === 'custom'
			? 'border border-blue-800/50 bg-blue-900/20'
			: chordSettings.playMode === 'incremental'
				? 'border border-emerald-800/50 bg-emerald-900/20'
				: 'border border-purple-800/50 bg-purple-900/20'
	}`}
>
	<div
		class={`flex items-center gap-3 px-4 py-2 ${
			chordSettings.playMode === 'custom'
				? 'bg-blue-900/30'
				: chordSettings.playMode === 'incremental'
					? 'bg-emerald-900/30'
					: 'bg-purple-900/30'
		}`}
	>
		{#if chordSettings.playMode === 'custom'}
			<Layers size={16} class="text-blue-400" />
			<span class="text-sm font-medium text-blue-300">Custom Practice</span>
		{:else if chordSettings.playMode === 'incremental'}
			<div
				class="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-xs font-bold text-white"
			>
				{chordSettings.currentLevel}
			</div>
			<span class="text-sm font-medium text-emerald-300"
				>{chordsInLevel.map((c) => c.chord.aliases[0]).join(', ')}</span
			>
		{:else if chordSettings.playMode === 'recap'}
			<RefreshCw size={16} class="text-purple-400" />
			<span class="text-sm font-medium text-purple-300"
				>Level {chordSettings.currentLevel} Recap</span
			>
		{/if}
	</div>
	<div class="px-4 py-2 text-sm text-gray-300">
		{#if chordSettings.playMode === 'custom'}
			{#if selectedChords.length > 0}
				{selectedChords.length} chord types selected
			{:else}
				No chord types selected
			{/if}
		{:else if chordSettings.playMode === 'incremental'}
			<select
				value={chordSettings.currentLevel}
				onchange={(e) => (chordSettings.currentLevel = parseInt(e.target.value))}
				class="ml-auto cursor-pointer rounded border border-emerald-700/30 bg-transparent px-2 py-1 text-sm text-emerald-300 transition-colors hover:bg-emerald-800/20 focus:border-emerald-500 focus:outline-none"
			>
				{#each levels as level (level.level)}
					<option value={level.level} class="bg-gray-800 text-white">
						Level {level.level}: {level.name}
					</option>
				{/each}
			</select>
		{:else if chordSettings.playMode === 'recap'}
			All previous level chords
		{/if}
	</div>
</div>
