<script>
  import { ChevronLeft, Settings } from '@lucide/svelte';

  let { setView, title } = $props();
</script>

<header class="mb-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <a class="rounded-full p-2 hover:bg-gray-700" href="/">
        <ChevronLeft size={24} class="text-gray-300" />
      </a>
      <h1 class="text-2xl font-bold text-emerald-400">{title}</h1>
    </div>
    <button class="cursor-pointer rounded-full p-2 hover:bg-gray-700" onclick={setView}>
      <Settings size={24} class="text-gray-300" />
    </button>
  </div>
</header>
