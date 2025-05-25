<script lang="ts">
  import { PROGRESSION_PRESETS } from '$lib/chordflow/progressionParser';
  import { chordFlowState } from '$lib/chordflow/state.svelte';

  interface Props {
    onSelectProgression: (progression: string) => void;
  }

  let { onSelectProgression }: Props = $props();

  // Group presets by category
  const categories = PROGRESSION_PRESETS.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, typeof PROGRESSION_PRESETS>);

  function selectPreset(progression: string) {
    onSelectProgression(progression);
  }
</script>

<div class="space-y-4">
  <h4 class="text-md font-medium text-gray-300">Progression Presets</h4>

  <div class="space-y-4">
    {#each Object.entries(categories) as [category, presets]}
      <div>
        <h5 class="text-sm font-medium text-gray-400 mb-2">{category}</h5>
        <div class="grid grid-cols-1 gap-2">
          {#each presets as preset}
            <button
              onclick={() => selectPreset(preset.progression)}
              class="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors duration-200 text-left"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="text-sm font-medium text-white">{preset.name}</div>
                  <div class="text-xs text-gray-400 mt-1">{preset.description}</div>
                  <div class="text-xs font-mono text-emerald-400 mt-2">{preset.progression}</div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Custom Help -->
  <div class="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
    <div class="text-xs text-gray-400">
      <strong class="text-gray-300">Tip:</strong> Click any preset to load it into the custom progression input. You can then modify it or use it as-is for practice.
    </div>
  </div>
</div>