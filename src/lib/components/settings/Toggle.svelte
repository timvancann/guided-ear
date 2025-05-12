<script lang="ts">
  import ToggleSlider from './ToggleSlider.svelte';

  let { checked = $bindable(), label, description } = $props();
  let id = 'toggle-' + Math.random().toString(36).substring(2, 9);
</script>

<div class="flex items-center justify-between">
  <div>
    <label class="text-sm font-medium text-gray-300" for={id}>{label}</label>
    {#if description}
      <p class="text-xs text-gray-500">{description}</p>
    {/if}
  </div>

  <ToggleSlider bind:checked />
</div>
