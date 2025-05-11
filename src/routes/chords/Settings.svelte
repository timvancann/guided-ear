<script lang="ts">
	import { chordCategories } from '$lib/settings.svelte';
	import {
		Check,
		ChevronDown,
		ChevronLeft,
		ChevronUp,
		Music,
		Timer,
		Volume2
	} from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { Interval } from 'tonal';
	import Toggle from './Toggle.svelte';
	import SettingsSection from '$lib/components/SettingsSection.svelte';
	import { chordSettings } from '$lib/state.svelte';
	import RangeSlider from './RangeSlider.svelte';

	let { onclick = $bindable() } = $props();

	function toggleChordGroup(groupIndex: number) {
		chordCategories[groupIndex].expanded = !chordCategories[groupIndex].expanded;
	}

	function toggleChord(groupIndex: number, chordIndex: number) {
		chordCategories[groupIndex].chords[chordIndex].enabled =
			!chordCategories[groupIndex].chords[chordIndex].enabled;
	}

	function enableAllInGroup(groupIndex: number) {
		chordCategories[groupIndex].chords.forEach((chord) => {
			chord.enabled = true;
		});
	}
	function disableAllInGroup(groupIndex: number) {
		chordCategories[groupIndex].chords.forEach((chord) => {
			chord.enabled = false;
		});
	}

	let showIntervals = $state(false);
</script>

<div class="flex flex-col gap-6">
	<header class="mb-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<button class="rounded-full p-2 hover:bg-gray-700" {onclick}>
					<ChevronLeft size={24} class="text-gray-300" />
				</button>
				<h1 class="text-2xl font-bold text-emerald-400">Chord Settings</h1>
			</div>
		</div>
		<p class="mt-1 text-gray-400">Configure which chords to include in your training</p>
	</header>

	<SettingsSection title="Chord Types" icon={Music}>
		<div class="space-y-3">
			{#each chordCategories as group, groupIndex (groupIndex)}
				<div class="overflow-hidden rounded-lg bg-gray-800">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<button
								class="items-cursor-pointer mb-1 flex items-center gap-2 rounded-full p-2 hover:bg-gray-700"
								onclick={() => toggleChordGroup(groupIndex)}
							>
								{#if group.expanded}
									<ChevronUp size={18} />
								{:else}
									<ChevronDown size={18} />
								{/if}
								<h3 class="font-medium">{group.name}</h3>
								<span class="text-xs text-gray-400">
									{group.chords.filter((c) => c.enabled).length} of {group.chords.length} selected
								</span>
							</button>
						</div>
						<div class="mr-2 flex gap-1">
							<button
								class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
								onclick={(e) => {
									e.stopPropagation();
									enableAllInGroup(groupIndex);
								}}
							>
								All
							</button>
							<button
								class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
								onclick={(e) => {
									e.stopPropagation();
									disableAllInGroup(groupIndex);
								}}
							>
								None
							</button>
						</div>
					</div>

					{#if group.expanded}
						<div class="border-t border-gray-700 p-3 pt-0" transition:slide={{ duration: 250 }}>
							<div class="mt-3 grid grid-cols-2 gap-2">
								{#each group.chords as chord, chordIndex (chordIndex)}
									<button
										class={`flex flex-col gap-1 rounded border p-2 ${
											chord.enabled
												? 'border-emerald-500 bg-emerald-900/20'
												: 'border-gray-700 bg-gray-700'
										}`}
										onclick={() => toggleChord(groupIndex, chordIndex)}
									>
										<!-- Static header content that doesn't change -->
										<div class="flex items-center justify-between">
											<span class={chord.enabled ? 'text-emerald-400' : 'text-gray-300'}
												>{chord.id}</span
											>
											<div
												class={`flex h-5 w-5 items-center justify-center rounded-full border ${
													chord.enabled ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'
												}`}
											>
												{#if chord.enabled}
													<Check size={12} class="text-black" />
												{/if}
											</div>
										</div>

										<!-- Interval content with transition -->
										{#if showIntervals}
											<div
												transition:slide={{ duration: 250 }}
												class="mt-1 flex origin-top flex-wrap gap-1"
											>
												{#each chord.chord.notes as note, i (i)}
													<span class="rounded bg-gray-800 px-1.5 py-0.5 text-[0.5rem]">
														{Interval.distance(chord.chord.tonic, note).toString()}
													</span>
												{/each}
											</div>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/each}
			<Toggle
				label="Show Intervals"
				description="Display intervals between notes in the chord"
				bind:checked={showIntervals}
			/>
		</div>
	</SettingsSection>
	<SettingsSection title="Excercise Settings" icon={Timer}>
		<div class="space-y-3">
			<Toggle
				label="Arpeggiate Chords"
				description="Play the notes of the chord one by one"
				bind:checked={chordSettings.arpegiateChords}
			/>
			<RangeSlider
				title="Questions"
				description="Number of questions to answer in each level"
				min={2}
				max={36}
				step={2}
				bind:value={chordSettings.totalExercises}
			>
				<span>2</span>
				<span>12</span>
				<span>24</span>
				<span>36</span>
			</RangeSlider>
			<Toggle
				label="Incremental Mode"
				description="Play chords in incremental levels"
				bind:checked={chordSettings.incrementalMode}
			/>
			<Toggle
				label="Auto Increment"
				description="Automatically advance to the next level"
				bind:checked={chordSettings.autoIncrement}
			/>
			<Toggle
				label="Continuous Mode"
				description="Automatically play the next exercise"
				bind:checked={chordSettings.continuousMode}
			/>
		</div>
	</SettingsSection>
	<SettingsSection title="Audio Settings" icon={Volume2}>
		<div class="space-y-3">
			<RangeSlider
				title="Volume"
				description="Volume of the chords and notes"
				min={0}
				max={127}
				step={1}
				bind:value={chordSettings.velocity}
			>
				<span>0</span>
				<span>127</span>
			</RangeSlider>
			<RangeSlider
				title="Speech Volume"
				description="Volume of the speech feedback"
				min={0}
				max={1}
				step={0.1}
				bind:value={chordSettings.voiceVolume}
			>
				<span>0</span>
				<span>0.5</span>
				<span>1</span>
			</RangeSlider>
		</div>
	</SettingsSection>
</div>
