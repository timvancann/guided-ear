<script lang="ts">
  import PracticeItemCard from '$lib/components/settings/PracticeItemCard.svelte';
  import SettingsSection from '$lib/components/settings/SettingsSection.svelte';
  import { intervals } from '$lib/settings.svelte';
  import { Timer } from '@lucide/svelte';
  import { Scale } from 'tonal';
  import TrainingSettings from './TrainingSettings.svelte';
  import { intervalMode } from '$lib/training/modes/intervalMode';

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

<TrainingSettings mode={intervalMode} {setView}>
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
</TrainingSettings>