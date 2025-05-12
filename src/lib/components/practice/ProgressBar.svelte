<script lang="ts">
	let { progress, total } = $props();

	let progressPercentage = $derived((progress / total) * 100);
</script>

<div>
	<div class="mb-1 flex justify-between text-xs">
		<span class="text-gray-400">Progress</span>
		<span class="text-emerald-400">{progress}/{total}</span>
	</div>
	<div class="h-2 overflow-hidden rounded-full bg-gray-700">
		<div
			class="h-full rounded-full bg-emerald-500 transition-all duration-300"
			style={`width: ${progressPercentage}%`}
		></div>
	</div>
</div>
