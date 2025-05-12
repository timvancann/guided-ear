<script>
  import { ChevronLeft } from '@lucide/svelte';
  let { setView, title } = $props();
</script>

<header class="mb-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <button class="rounded-full p-2 hover:bg-gray-700" onclick={setView}>
        <ChevronLeft size={24} class="text-gray-300" />
      </button>
      <h1 class="text-2xl font-bold text-emerald-400">{title}</h1>
    </div>
  </div>
  <p class="mt-1 text-gray-400">Customize your practice experience.</p>
</header>
