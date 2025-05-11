<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Spring } from 'svelte/motion';

	// Create animated height values for each bar using spring motion
	// The spring parameters control the "bounciness" of the animation
	const barHeights = Array(5)
		.fill(null)
		.map(
			() =>
				new Spring(4, {
					stiffness: 0.15,
					damping: 0.4
				})
		);

	// Define heights for the bars
	const maxHeights = [12, 18, 24, 16, 20];

	// Create a continuous animation loop
	let animationRunning = true;
	let startTime: number;

	function animate() {
		if (!startTime) startTime = Date.now();

		const elapsed = Date.now() - startTime;

		// Set each bar height using a sin wave with different offsets
		barHeights.forEach((bar, i) => {
			// Create a sin wave between 0 and 1, offset by bar index
			// The offset creates a wave effect across the bars
			const sinVal = Math.sin(elapsed / 300 + i * 0.5);

			// Map the -1 to 1 range to min/max heights
			const height = 4 + (maxHeights[i] - 4) * ((sinVal + 1) / 2);

			// Update the spring
			bar.set(height);
		});

		// Continue the animation
		if (animationRunning) {
			requestAnimationFrame(animate);
		}
	}

	onMount(() => {
		// Start with initial heights
		barHeights.forEach((bar, i) => {
			bar.set(maxHeights[i] / 2);
		});

		// Start animation on next frame
		requestAnimationFrame(animate);

		return () => {
			animationRunning = false;
		};
	});

	onDestroy(() => {
		animationRunning = false;
	});
</script>

<div class="flex h-20 items-end gap-1">
	{#each barHeights as bar, i (i)}
		<div class="w-2 rounded-full bg-emerald-500 opacity-80" style="height: {bar.current}px"></div>
	{/each}
</div>
