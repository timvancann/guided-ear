<script lang="ts">
  import PracticeItemCard from '$lib/components/settings/PracticeItemCard.svelte';
  import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
  import { inversions } from '$lib/settings.svelte';
  import { Music } from '@lucide/svelte';
  import TrainingSettings from './TrainingSettings.svelte';
  import { inversionMode } from '$lib/training/modes/inversionMode';

  let { setView } = $props();

  const enableAll = () => {
    inversions.forEach((inversion) => {
      inversion.enabled = true;
    });
  };

  const disableAll = () => {
    inversions.forEach((inversion) => {
      inversion.enabled = false;
    });
  };

  const enableMajorTriads = () => {
    inversions.forEach((inversion) => {
      inversion.enabled = (inversion.level || 0) === 1;
    });
  };

  const enableMinorTriads = () => {
    inversions.forEach((inversion) => {
      inversion.enabled = (inversion.level || 0) === 2;
    });
  };

  const enableTriads = () => {
    inversions.forEach((inversion) => {
      inversion.enabled = (inversion.level || 0) <= 3;
    });
  };

  const enableSevenths = () => {
    inversions.forEach((inversion) => {
      inversion.enabled = (inversion.level || 0) >= 4;
    });
  };

  const enableRootPosition = () => {
    inversions.forEach((inversion) => {
      inversion.enabled = inversion.inversion === 0;
    });
  };
</script>

<TrainingSettings mode={inversionMode} {setView}>
  <SettingsSection title="Inversion Types" icon={Music}>
    <div class="mb-3 flex flex-wrap gap-1">
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableAll}>All</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={disableAll}>None</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableMajorTriads}>Major Triads</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableMinorTriads}>Minor Triads</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableTriads}>All Triads</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableSevenths}>7th Chords</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableRootPosition}>Root Position Only</button>
    </div>
    <div class="mt-3 grid grid-cols-2 gap-2">
      {#each inversions as inversion (inversion.id)}
        <PracticeItemCard toggle={() => (inversion.enabled = !inversion.enabled)} title={inversion.id} isEnabled={inversion.enabled} />
      {/each}
    </div>
  </SettingsSection>
</TrainingSettings>
