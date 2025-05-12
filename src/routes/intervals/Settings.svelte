<script lang="ts">
  import GlobalSettings from '$lib/components/settings/GlobalSettings.svelte';
  import PracticeItemCard from '$lib/components/settings/PracticeItemCard.svelte';
  import RangeSlider from '$lib/components/settings/RangeSlider.svelte';
  import SettingsHeader from '$lib/components/settings/SettingsHeader.svelte';
  import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
  import Toggle from '$lib/components/settings/Toggle.svelte';
  import { intervals } from '$lib/settings.svelte';
  import { intervalSettings } from '$lib/state.svelte';
  import { Timer } from '@lucide/svelte';
  import { Scale } from 'tonal';

  let { setView } = $props();

  const enableAll = () => {
    intervals.forEach((interval) => {
      interval.enabled = true;
    });
  };

  const disableAll = () => {
    intervals.forEach((interval) => {
      interval.enabled = false;
    });
  };

  const enableScale = (scaleName: string) => {
    const scale = Scale.get(scaleName);
    intervals.forEach((interval) => {
      if (scale.intervals.includes(interval.interval)) {
        interval.enabled = true;
      } else {
        interval.enabled = false;
      }
    });
  };
</script>

<div class="flex flex-col gap-6">
  <SettingsHeader {setView} title="Interval Settings" />
  <SettingsSection title="Interval Types" icon={Timer}>
    <div class="mr-2 flex gap-1">
      <button
        class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
        onclick={(e) => {
          e.stopPropagation();
          enableAll();
        }}
      >
        All
      </button>
      <button
        class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
        onclick={(e) => {
          e.stopPropagation();
          disableAll();
        }}
      >
        None
      </button>
      <button
        class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
        onclick={(e) => {
          e.stopPropagation();
          enableScale('major');
        }}
      >
        Major
      </button>
      <button
        class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
        onclick={(e) => {
          e.stopPropagation();
          enableScale('melodic minor');
        }}
      >
        Melodic Minor
      </button>
      <button
        class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
        onclick={(e) => {
          e.stopPropagation();
          enableScale('harmonic minor');
        }}
      >
        Harmonic Minor
      </button>
    </div>
    <div class="mt-3 grid grid-cols-3 gap-2">
      {#each intervals as interval (interval.id)}
        <PracticeItemCard toggle={() => (interval.enabled = !interval.enabled)} title={interval.interval} isEnabled={interval.enabled} />
      {/each}
    </div>
  </SettingsSection>
  <SettingsSection title="Excercise Settings" icon={Timer}>
    <div class="space-y-3">
      <Toggle label="Arpeggiate Chords" description="Play the notes of the chord one by one" bind:checked={intervalSettings.arpegiateChords} />
      <RangeSlider title="Chord Duration" description="Duration of each chord in seconds" min={0.2} max={4.0} step={0.2} bind:value={intervalSettings.chordDuration} />
      <RangeSlider title="Note Duration" description="Duration of each note in seconds" min={0.2} max={2.0} step={0.1} bind:value={intervalSettings.noteDuration} />
      <RangeSlider title="Questions" description="Number of questions to answer in each level" min={2} max={36} step={2} bind:value={intervalSettings.totalExercises} />
      <Toggle label="Level Mode" description="Play chords in incremental levels" bind:checked={intervalSettings.incrementalMode} />
      <Toggle label="Auto Increment" description="Automatically advance to the next level" bind:checked={intervalSettings.autoIncrement} />
      <Toggle label="Continuous Mode" description="Automatically play the next exercise" bind:checked={intervalSettings.continuousMode} />
    </div>
  </SettingsSection>
  <GlobalSettings />
</div>
