<script>
	import ModuleCard from '$lib/components/ModuleCard.svelte';
	import { ChevronRight, History, Info, PlayCircle, Settings } from '@lucide/svelte';
</script>

<div class="flex flex-col">
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold text-emerald-400">Guided Ear</h1>
			<div class="flex gap-3">
				<button class="rounded-full p-2 hover:bg-gray-700">
					<History size={24} class="text-gray-300" />
				</button>
				<button class="rounded-full p-2 hover:bg-gray-700">
					<Settings size={24} class="text-gray-300" />
				</button>
				<button class="rounded-full p-2 hover:bg-gray-700">
					<Info size={24} class="text-gray-300" />
				</button>
			</div>
		</div>
		<p class="mt-1 text-gray-400">Hands-free ear training for musicians</p>
	</header>

	<div class="mb-8">
		<button
			class="flex w-full items-center justify-between rounded-xl bg-emerald-600 p-4 transition-colors hover:bg-emerald-500"
		>
			<a class="flex items-center gap-3" href="/chords">
				<PlayCircle size={32} />
				<span class="text-xl font-medium">Continue Training</span>
			</a>
			<ChevronRight size={24} />
		</button>
	</div>

	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-300">Training Modules</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<ModuleCard
				title="Chord Recognition"
				description="Identify major, minor, 7th, and other chord types"
				active={true}
			/>
			<ModuleCard
				title="Chord Inversions"
				description="Detect root position, first and second inversions"
			/>
			<ModuleCard
				title="Interval Training"
				description="Recognize intervals from minor 2nd to perfect octave"
			/>
			<ModuleCard
				title="Chord Progressions"
				description="Identify common chord sequences and cadences"
			/>
		</div>
	</div>
</div>
