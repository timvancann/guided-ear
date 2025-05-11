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
	class={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
		chordSettings.playMode === 'custom'
			? 'bg-blue-900/30 text-blue-300'
			: chordSettings.playMode === 'incremental'
				? 'bg-emerald-900/30 text-emerald-300'
				: 'bg-purple-900/30 text-purple-300'
	}`}
>
	{#if chordSettings.playMode === 'custom'}
		<Layers size={14} />
	{:else if chordSettings.playMode === 'incremental'}
		<div
			class="flex h-4 w-4 items-center justify-center rounded bg-emerald-600 text-xs font-bold text-white"
		>
			{chordSettings.currentLevel}
		</div>
	{:else if chordSettings.playMode === 'recap'}
		<RefreshCw size={14} />
	{/if}

	<span class="text-sm font-medium">
		{#if chordSettings.playMode === 'custom'}
			Custom
		{:else if chordSettings.playMode === 'incremental'}
			{levels[chordSettings.currentLevel - 1].name}
		{:else if chordSettings.playMode === 'recap'}
			Recap level {chordSettings.currentLevel}
		{/if}
	</span>

	{#if chordSettings.playMode === 'incremental'}
		<span class="text-xs opacity-75"
			>({chordsInLevel.map((c) => c.chord.aliases[0]).join(', ')})</span
		>
	{:else if chordSettings.playMode === 'custom'}
		<span class="text-xs opacity-75">({selectedChords.length} chords selected)</span>
	{:else if chordSettings.playMode === 'recap'}
		<span class="text-xs opacity-75">(All previous chords)</span>
	{/if}
</div>
