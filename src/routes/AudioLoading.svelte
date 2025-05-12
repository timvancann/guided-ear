<script lang="ts">
  import AudioBars from '$lib/components/AudioBars.svelte';
  import { Volume2 } from '@lucide/svelte';
</script>

<div class="flex flex-col items-center justify-center py-12 text-white">
  <AudioBars />

  <div class="mt-8 flex animate-pulse items-center gap-3 text-gray-300">
    <div class="h-2 w-2 rounded-full bg-emerald-400"></div>
    <span>Loading audio samples</span>
    <div class="h-2 w-2 rounded-full bg-emerald-400"></div>
  </div>

  <div class="mt-4 flex items-center gap-2 text-xs text-gray-500">
    <Volume2 size={14} />
    <span>Ensure your sound is turned on</span>
  </div>
</div>
