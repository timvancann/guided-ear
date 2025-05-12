<script lang="ts">
  import { Volume2 } from '@lucide/svelte';
  import { globalSettings } from '$lib/state.svelte';
  import RangeSlider from './RangeSlider.svelte';
  import SettingsSection from './SettingsSection.svelte';
</script>

<SettingsSection title="Audio Settings" icon={Volume2}>
  <div class="space-y-3">
    <RangeSlider title="Volume" description="Volume of the chords and notes" min={0} max={127} step={1} bind:value={globalSettings.velocity} />
    <RangeSlider title="Speech Volume" description="Volume of the speech feedback" min={0} max={1} step={0.1} bind:value={globalSettings.voiceVolume} />
  </div>
</SettingsSection>
