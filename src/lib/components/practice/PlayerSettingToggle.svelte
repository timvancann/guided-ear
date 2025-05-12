<script lang="ts">
  import ToggleSlider from '../settings/ToggleSlider.svelte';

  interface Props {
    toggle: boolean;
    name: string;
    label: string;
  }

  let { toggle = $bindable(), name, label }: Props = $props();
</script>

<div>
  <label class="mb-1 flex items-center gap-2">
    <span class="text-sm text-gray-400">{name}</span>
    <ToggleSlider bind:checked={toggle} />
  </label>
  <div class="text-xs text-gray-500">{label}</div>
</div>
