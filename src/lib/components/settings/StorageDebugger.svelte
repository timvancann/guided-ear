<script lang="ts">
  import { storage } from '$lib/storage.svelte';

  let showDebugger = $state(false);
  let storageData = $state<any>(null);
  let exportText = $state('');

  function loadData() {
    storageData = storage.load();
    exportText = storage.export();
  }

  function clearData() {
    if (confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
      storage.clear();
      storageData = null;
      exportText = '';
    }
  }

  function exportData() {
    const blob = new Blob([exportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guided-ear-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          if (storage.import(text)) {
            alert('Settings imported successfully! Please refresh the page.');
          } else {
            alert('Failed to import settings. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  $effect(() => {
    if (showDebugger) {
      loadData();
    }
  });
</script>

{#if import.meta.env.DEV}
  <div class="fixed bottom-4 right-4 z-50">
    <button onclick={() => (showDebugger = !showDebugger)} class="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"> 🔧 Storage Debug </button>
  </div>

  {#if showDebugger}
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Storage Debugger</h2>
            <button onclick={() => (showDebugger = false)} class="text-gray-500 hover:text-gray-700"> ✕ </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div class="space-y-4">
            <div class="flex gap-2">
              <button onclick={loadData} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"> Refresh Data </button>
              <button onclick={exportData} class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"> Export Settings </button>
              <button onclick={importData} class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"> Import Settings </button>
              <button onclick={clearData} class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"> Clear All Data </button>
            </div>

            {#if storageData}
              <div class="bg-gray-100 p-4 rounded-lg">
                <h3 class="font-semibold mb-2">Current Storage Data:</h3>
                <pre class="text-xs bg-white p-3 rounded border overflow-x-auto">{JSON.stringify(storageData, null, 2)}</pre>
              </div>
            {:else}
              <p class="text-gray-500">No stored data found or click "Refresh Data" to load.</p>
            {/if}

            <div class="text-sm text-gray-600">
              <p><strong>Storage Size:</strong> {exportText ? new Blob([exportText]).size : 0} bytes</p>
              <p><strong>Last Updated:</strong> {storageData?.timestamp ? new Date(storageData.timestamp).toLocaleString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}
