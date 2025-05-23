<script lang="ts" generics="T extends TrainingItem">
  import SettingsHeader from '$lib/components/settings/SettingsHeader.svelte';
  import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
  import Toggle from '$lib/components/settings/Toggle.svelte';
  import RangeSlider from '$lib/components/settings/RangeSlider.svelte';
  import GlobalSettings from '$lib/components/settings/GlobalSettings.svelte';
  import { Timer } from '@lucide/svelte';
  import type { TrainingItem, TrainingMode } from '$lib/training/types';

  let { mode, setView, children }: { mode: TrainingMode<T>; setView: () => void; children?: any } = $props();
</script>

<div class="flex flex-col gap-6">
  <SettingsHeader title="{mode.title} Settings" {setView} />

  {@render children?.()}

  <SettingsSection title="Exercise Settings" icon={Timer}>
    <div class="space-y-3">
      <Toggle label="Random Root" description="Pick a random root" bind:checked={mode.settings.randomRoot} />
      <Toggle label="Arpeggiate Chords" description="Play the notes of the chord one by one" bind:checked={mode.settings.arpegiateChords} />
      <RangeSlider title="Chord Duration" description="Duration of each chord in seconds" min={0.2} max={4.0} step={0.2} bind:value={mode.settings.chordDuration} />
      <RangeSlider title="Note Duration" description="Duration of each note in seconds" min={0.2} max={2.0} step={0.1} bind:value={mode.settings.noteDuration} />
      <RangeSlider title="Questions" description="Number of questions to answer in each level" min={2} max={36} step={2} bind:value={mode.settings.totalExercises} />
      <Toggle label="Level Mode" description="Play chords in incremental levels" bind:checked={mode.settings.incrementalMode} />
      <Toggle label="Auto Increment" description="Automatically advance to the next level" bind:checked={mode.settings.autoIncrement} />
      <Toggle label="Continuous Mode" description="Automatically play the next exercise" bind:checked={mode.settings.continuousMode} />
    </div>
  </SettingsSection>

  <GlobalSettings />
</div>

