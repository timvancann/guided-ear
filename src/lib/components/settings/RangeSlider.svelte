<script lang="ts">
  interface Props {
    children?: () => any;
    min?: number;
    max?: number;
    step?: number;
    title: string;
    description: string;
    value: number;
  }
  let { children, min = 0, max = 1, step = 0.1, title, description, value = $bindable() }: Props = $props();
</script>

<div>
  <div class="flex justify-between">
    <span class="text-sm font-medium text-gray-300">{title}</span>
    <span class="text-sm text-emerald-400">{value}</span>
  </div>
  <p class="mb-1 text-xs text-gray-500">{description}</p>
  <input type="range" {min} {max} {step} {value} onchange={(e) => (value = parseFloat((e.target as HTMLInputElement).value))} class="w-full accent-emerald-500" />
  <div class="mt-1 flex justify-between text-xs text-gray-500">
    {@render children?.()}
  </div>
</div>
