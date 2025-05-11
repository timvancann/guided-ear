<script lang="ts">
	import ModuleCard from '$lib/components/ModuleCard.svelte';
	import { ChevronRight, History, Info, PlayCircle, Settings } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let selection: Card | null = null;

	type Card = {
		id: string;
		title: string;
		description: string;
	};

	let cards: Card[] = [
		{
			title: 'Chord Recognition',
			description: 'Identify major, minor, 7th, and other chord types',
			id: 'chords'
		}
		// {
		// 	title: 'Chord Inversions',
		// 	description: 'Detect root position, first and second and other inversions',
		// 	id: 'intervals'
		// },
		// {
		// 	title: 'Interval Training',
		// 	description: 'Recognize intervals from minor 2nd to perfect octave',
		// 	id: 'inversions'
		// },
		// {
		// 	title: 'Chord Progressions',
		// 	description: 'Identify common chord sequences and cadences',
		// 	id: 'progressions'
		// }
	];

	onMount(() => {
		selection = cards[0];
	});
</script>

<div class="flex flex-col">
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold text-emerald-400">Guided Ear</h1>
			<div class="flex gap-3">
				<!-- <a class="rounded-full p-2 hover:bg-gray-700" href="/history">
					<History size={24} class="text-gray-300" />
				</a> -->
				<!-- <button class="rounded-full p-2 hover:bg-gray-700">
					<Settings size={24} class="text-gray-300" />
				</button> -->
				<a class="rounded-full p-2 hover:bg-gray-700" href="/info">
					<Info size={24} class="text-gray-300" />
				</a>
			</div>
		</div>
		<p class="mt-1 text-gray-400">Hands-free ear training for musicians</p>
	</header>

	<a
		class="mb-8 flex w-full cursor-pointer items-center justify-between rounded-xl bg-emerald-700 p-4 transition-colors hover:bg-emerald-500"
		href="/{selection?.id}"
	>
		<div class="flex items-center gap-3">
			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-4">
					<PlayCircle size={32} />
					<span class="text-xl font-medium">Continue Training </span>
				</div>
				{selection?.title}
			</div>
		</div>
		<ChevronRight size={24} />
	</a>

	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-300">Training Modules</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each cards as card, i (i)}
				<ModuleCard
					onclick={() => (selection = card)}
					title={card.title}
					description={card.description}
					active={selection === card}
				/>
			{/each}
		</div>
	</div>
</div>
