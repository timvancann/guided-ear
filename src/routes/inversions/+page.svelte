<script lang="ts">
  import TrainingPage from '$lib/components/training/TrainingPage.svelte';
  import { inversionMode } from '$lib/training/modes/inversionMode';
</script>

<TrainingPage mode={inversionMode} />