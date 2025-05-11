<script lang="ts">
	// Using Svelte 5 runes
	import { spring } from 'svelte/motion';

	let { checked = $bindable() } = $props();
	let id = 'toggle-' + Math.random().toString(36).substring(2, 9);

	// Using spring for smooth motion
	const position = spring(checked ? 1 : 0, {
		stiffness: 0.3,
		damping: 0.7
	});

	// Update spring when checked changes
	$effect(() => {
		position.set(checked ? 1 : 0);
	});

	function toggle() {
		checked = !checked;
	}
</script>

<button
	{id}
	role="switch"
	aria-checked={checked}
	aria-label="Toggle"
	tabindex={0}
	class="relative h-6 w-12 rounded-full transition-colors duration-200"
	class:bg-emerald-600={checked}
	class:bg-gray-600={!checked}
	onclick={toggle}
>
	<div
		class="absolute h-5 w-5 rounded-full bg-white"
		style="top: 2px; transform: translateX({$position * 24}px); left: 2px;"
	></div>
</button>
