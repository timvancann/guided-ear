<script lang="ts">
  import { chordFlowState, setDiatonicOption } from '$lib/chordflow/state.svelte';

  let selectedOption = $derived(chordFlowState.settings.diatonicOption);

  function handleOptionChange(option: 'incremental' | 'random') {
    setDiatonicOption(option);
  }
</script>

<div class="space-y-4">
  <h4 class="text-md font-medium text-gray-300">Progression Order</h4>
  
  <!-- Option Selection -->
  <div class="space-y-3">
    
    <!-- Incremental Option -->
    <button
      onclick={() => handleOptionChange('incremental')}
      class="w-full p-3 rounded-lg border-2 transition-all duration-200 text-left {selectedOption === 'incremental'
        ? 'border-emerald-500 bg-emerald-900/20'
        : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
    >
      <div class="flex items-center space-x-3">
        <div class="w-4 h-4 rounded-full border-2 {selectedOption === 'incremental'
          ? 'border-emerald-500 bg-emerald-500'
          : 'border-gray-500'}"
        ></div>
        <div>
          <h5 class="font-medium text-white">Incremental</h5>
          <p class="text-sm text-gray-400 mt-1">
            I → ii → iii → IV → V → vi → vii° → I (repeat)
          </p>
        </div>
      </div>
    </button>

    <!-- Random Option -->
    <button
      onclick={() => handleOptionChange('random')}
      class="w-full p-3 rounded-lg border-2 transition-all duration-200 text-left {selectedOption === 'random'
        ? 'border-emerald-500 bg-emerald-900/20'
        : 'border-gray-600 bg-gray-800 hover:border-gray-500'}"
    >
      <div class="flex items-center space-x-3">
        <div class="w-4 h-4 rounded-full border-2 {selectedOption === 'random'
          ? 'border-emerald-500 bg-emerald-500'
          : 'border-gray-500'}"
        ></div>
        <div>
          <h5 class="font-medium text-white">Random</h5>
          <p class="text-sm text-gray-400 mt-1">
            Random selection from the 7 diatonic chords
          </p>
        </div>
      </div>
    </button>
  </div>

  <!-- Option Description -->
  <div class="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
    <div class="text-xs text-gray-400">
      {selectedOption === 'incremental' 
        ? 'Perfect for learning scale patterns and chord relationships. Follows the natural sequence of the major scale.'
        : 'Great for practicing chord recognition within a key. Challenges you to identify diatonic relationships.'
      }
    </div>
  </div>
</div>