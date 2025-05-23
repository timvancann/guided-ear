<script lang="ts">
  import { Check } from '@lucide/svelte';

  interface Props {
    children?: any;
    toggle: () => void;
    isEnabled: boolean;
    title: string;
    subtitle?: string;
  }

  let { children, toggle, isEnabled, title, subtitle }: Props = $props();
</script>

<button class={`flex flex-col gap-1 rounded border p-2 ${isEnabled ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-700 bg-gray-700'}`} onclick={toggle}>
  <div class="flex items-center justify-between">
    <div class="flex flex-col items-start">
      <span class={isEnabled ? 'text-emerald-400' : 'text-gray-300'}>{title}</span>
      {#if subtitle}
        <span class="text-xs text-gray-500">{subtitle}</span>
      {/if}
    </div>
    <div class={`flex h-5 w-5 items-center justify-center rounded-full border ${isEnabled ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'}`}>
      {#if isEnabled}
        <Check size={12} class="text-black" />
      {/if}
    </div>
  </div>

  {@render children?.()}
</button>
