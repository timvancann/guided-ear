<script lang="ts">
	import { slide } from 'svelte/transition';
	import Main from './Main.svelte';
	import Settings from './Settings.svelte';

	type View = 'main' | 'settings';

	let currentView: View = $state('main');
</script>

<div class="flex flex-col bg-gray-900 font-sans text-white">
	{#key currentView}
		<div transition:slide={{ axis: 'y' }}>
			{#if currentView === 'main'}
				<Main onclick={() => (currentView = 'settings')} />
			{:else if currentView === 'settings'}
				<Settings onclick={() => (currentView = 'main')} />
			{/if}
		</div>
	{/key}
</div>
