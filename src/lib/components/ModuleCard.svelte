<script lang="ts">
	import { Music } from '@lucide/svelte';

	let { title, description, active = false } = $props();
</script>

<div
	class={`rounded-xl p-4 ${active ? 'border border-emerald-400 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} transition-colors`}
>
	<div class="flex items-start justify-between">
		<div>
			<h3 class="text-lg font-medium">{title}</h3>
			<p class="mt-1 text-sm text-gray-400">{description}</p>
		</div>
		<Music class={`${active ? 'text-emerald-400' : 'text-gray-500'}`} />
	</div>

	{#if active}
		<div class="mt-3 text-xs font-medium text-emerald-400">ACTIVE</div>
	{/if}
</div>
