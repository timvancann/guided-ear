<script lang="ts">
  import PracticeItemCard from '$lib/components/settings/PracticeItemCard.svelte';
  import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
  import { progressions } from '$lib/settings.svelte';
  import { Music } from '@lucide/svelte';
  import TrainingSettings from './TrainingSettings.svelte';
  import { progressionMode } from '$lib/training/modes/progressionMode';

  let { setView } = $props();

  const enableAll = () => {
    progressions.forEach((progression) => {
      progression.enabled = true;
    });
  };

  const disableAll = () => {
    progressions.forEach((progression) => {
      progression.enabled = false;
    });
  };

  const enablePopular = () => {
    progressions.forEach((progression) => {
      progression.enabled = (progression.level || 0) === 1;
    });
  };

  const enableJazz = () => {
    progressions.forEach((progression) => {
      progression.enabled = (progression.level || 0) === 2;
    });
  };

  const enableClassical = () => {
    progressions.forEach((progression) => {
      progression.enabled = (progression.level || 0) === 3;
    });
  };

  const enableCadences = () => {
    progressions.forEach((progression) => {
      progression.enabled = progression.id.toLowerCase().includes('cadence');
    });
  };
</script>

<TrainingSettings mode={progressionMode} {setView}>
  <SettingsSection title="Progression Types" icon={Music}>
    <div class="mb-3 flex flex-wrap gap-1">
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableAll}>All</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={disableAll}>None</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enablePopular}>Popular</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableJazz}>Jazz</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableClassical}>Classical</button>
      <button class="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600" onclick={enableCadences}>Cadences</button>
    </div>
    <div class="mt-3 grid grid-cols-1 gap-2">
      {#each progressions as progression (progression.id)}
        <PracticeItemCard 
          toggle={() => (progression.enabled = !progression.enabled)} 
          title={progression.commonName || ""}
          isEnabled={progression.enabled} 
        >
          <div class="mt-2 flex flex-wrap gap-1">
            {#each progression.romanNumerals as numeral, i (i)}
              <span class="rounded bg-gray-700 px-2 py-1 text-xs font-mono text-emerald-300">
                {numeral}
              </span>
            {/each}
          </div>
        </PracticeItemCard>
      {/each}
    </div>
  </SettingsSection>
</TrainingSettings>