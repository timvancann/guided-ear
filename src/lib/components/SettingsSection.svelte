<script lang="ts">
	let props = $props();
</script>

<div class="rounded-lg border border-gray-700 bg-gray-950/30 p-4">
	<h2 class="mb-3 flex items-center gap-2 font-medium text-emerald-400">
		<props.icon size={18} />
		<span>{props.title}</span>
	</h2>
	<div class="text-sm text-gray-400">
		{@render props.children()}
	</div>
</div>
