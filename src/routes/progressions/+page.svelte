<script lang="ts">
  import TrainingPage from '$lib/components/training/TrainingPage.svelte';
  import { progressionMode } from '$lib/training/modes/progressionMode';
</script>

<TrainingPage mode={progressionMode} />