<script lang="ts">
	import { chordSettings } from '$lib/state.svelte';

	let progressPercentage = $derived((chordSettings.progress / chordSettings.totalExercises) * 100);
</script>

<div>
	<div class="mb-1 flex justify-between text-xs">
		<span class="text-gray-400">Progress</span>
		<span class="text-emerald-400">{chordSettings.progress}/{chordSettings.totalExercises}</span>
	</div>
	<div class="h-2 overflow-hidden rounded-full bg-gray-700">
		<div
			class="h-full rounded-full bg-emerald-500 transition-all duration-300"
			style={`width: ${progressPercentage}%`}
		></div>
	</div>
</div>
