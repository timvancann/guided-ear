<script lang="ts">
  import { PROGRESSION_PRESETS } from '$lib/chordflow/progressionParser';

  interface Props {
    onSelectProgression: (progression: string) => void;
  }

  let { onSelectProgression }: Props = $props();

  // Group presets by category
  const categories = PROGRESSION_PRESETS.reduce(
    (acc, preset) => {
      if (!acc[preset.category]) {
        acc[preset.category] = [];
      }
      acc[preset.category].push(preset);
      return acc;
    },
    {} as Record<string, typeof PROGRESSION_PRESETS>
  );

  function selectPreset(progression: string) {
    onSelectProgression(progression);
  }
</script>

<div class="space-y-3">
  <h4 class="text-md font-medium text-gray-300">Popular Progressions</h4>

  <div class="max-h-64 overflow-y-auto space-y-3 pr-2">
    {#each Object.entries(categories) as [category, presets] (category)}
      <div>
        <h5 class="text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">{category}</h5>
        <div class="space-y-1">
          {#each presets as preset (preset.name)}
            <button
              onclick={() => selectPreset(preset.progression)}
              class="w-full p-2 bg-gray-700/50 hover:bg-gray-700 rounded border border-gray-600/50 hover:border-emerald-500/50 transition-all duration-200 text-left group"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-200 group-hover:text-white truncate">{preset.name}</div>
                  <div class="text-xs font-mono text-emerald-400/80 group-hover:text-emerald-400 mt-0.5">{preset.progression}</div>
                </div>
                <div class="text-xs text-gray-500 group-hover:text-emerald-400">→</div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="text-xs text-gray-500 pt-2 border-t border-gray-700/50">Click to load • Modify in the input above</div>
</div>
