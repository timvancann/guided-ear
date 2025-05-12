<script lang="ts">
  import { chordCategories } from '$lib/settings.svelte';
  import { ChevronDown, ChevronUp, Music, Timer } from '@lucide/svelte';
  import { slide } from 'svelte/transition';
  import { Interval } from 'tonal';
  import { chordSettings } from '$lib/state.svelte';
  import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
  import Toggle from '$lib/components/settings/Toggle.svelte';
  import SettingsHeader from '$lib/components/settings/SettingsHeader.svelte';
  import RangeSlider from '$lib/components/settings/RangeSlider.svelte';
  import GlobalSettings from '$lib/components/settings/GlobalSettings.svelte';
  import PracticeItemCard from '$lib/components/settings/PracticeItemCard.svelte';

  let { setView = $bindable() } = $props();

  function toggleChordGroup(groupIndex: number) {
    chordCategories[groupIndex].expanded = !chordCategories[groupIndex].expanded;
  }

  function toggleChord(groupIndex: number, chordIndex: number) {
    chordCategories[groupIndex].chords[chordIndex].enabled = !chordCategories[groupIndex].chords[chordIndex].enabled;
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
  <SettingsHeader title="Chord Settings" {setView} />

  <SettingsSection title="Chord Types" icon={Music}>
    <div class="space-y-3">
      {#each chordCategories as group, groupIndex (groupIndex)}
        <div class="overflow-hidden rounded-lg bg-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button class="items-cursor-pointer mb-1 flex items-center gap-2 rounded-full p-2 hover:bg-gray-700" onclick={() => toggleChordGroup(groupIndex)}>
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
                  <PracticeItemCard toggle={() => toggleChord(groupIndex, chordIndex)} isEnabled={chord.enabled} title={chord.id}>
                    <!-- Interval content with transition -->
                    {#if showIntervals}
                      <div transition:slide={{ duration: 250 }} class="mt-1 flex origin-top flex-wrap gap-1">
                        {#each chord.chord.notes as note, i (i)}
                          <span class="rounded bg-gray-800 px-1.5 py-0.5 text-[0.5rem]">
                            {Interval.distance(chord.chord.tonic, note).toString()}
                          </span>
                        {/each}
                      </div>
                    {/if}
                  </PracticeItemCard>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
      <Toggle label="Show Intervals" description="Display intervals between notes in the chord" bind:checked={showIntervals} />
    </div>
  </SettingsSection>
  <SettingsSection title="Excercise Settings" icon={Timer}>
    <div class="space-y-3">
      <Toggle label="Arpeggiate Chords" description="Play the notes of the chord one by one" bind:checked={chordSettings.arpegiateChords} />
      <RangeSlider title="Chord Duration" description="Duration of each chord in seconds" min={0.2} max={4.0} step={0.2} bind:value={chordSettings.chordDuration} />
      <RangeSlider title="Note Duration" description="Duration of each note in seconds" min={0.2} max={2.0} step={0.1} bind:value={chordSettings.noteDuration} />
      <RangeSlider title="Questions" description="Number of questions to answer in each level" min={2} max={36} step={2} bind:value={chordSettings.totalExercises} />
      <Toggle label="Level Mode" description="Play chords in incremental levels" bind:checked={chordSettings.incrementalMode} />
      <Toggle label="Auto Increment" description="Automatically advance to the next level" bind:checked={chordSettings.autoIncrement} />
      <Toggle label="Continuous Mode" description="Automatically play the next exercise" bind:checked={chordSettings.continuousMode} />
    </div>
  </SettingsSection>
  <GlobalSettings />
</div>
