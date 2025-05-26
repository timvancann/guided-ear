<script lang="ts">
  import { chordFlowState } from '$lib/chordflow/state.svelte';
  import { parseProgression, getProgressionExamples, type ParsedProgression } from '$lib/chordflow/progressionParser';
  import { AlertCircle, CheckCircle, HelpCircle } from '@lucide/svelte';

  let inputText = $state(chordFlowState.settings.customProgression);
  let parsedProgression = $state<ParsedProgression | null>(null);
  let showHelp = $state(false);

  // Parse and validate progression
  function parseAndValidate(text: string) {
    if (text.trim()) {
      parsedProgression = parseProgression(text);
      return parsedProgression;
    } else {
      parsedProgression = null;
      return null;
    }
  }

  // Initialize with current progression
  parseAndValidate(inputText);

  // Watch for external changes to the custom progression
  $effect(() => {
    const currentProgression = chordFlowState.settings.customProgression;
    if (currentProgression !== inputText) {
      inputText = currentProgression;
      parseAndValidate(currentProgression);
    }
  });

  function handleInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    inputText = target.value;

    // Parse and update global state if valid
    const parsed = parseAndValidate(target.value);
    if (parsed?.isValid) {
      chordFlowState.settings.customProgression = target.value;
    }
  }

  function clearInput() {
    inputText = '';
  }

  const examples = getProgressionExamples();
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="text-md font-medium text-gray-300">Custom Progression</h4>
    <button onclick={() => (showHelp = !showHelp)} class="p-1 rounded text-gray-400 hover:text-gray-300" aria-label="Toggle help">
      <HelpCircle class="w-4 h-4" />
    </button>
  </div>

  <!-- Input Area -->
  <div class="space-y-2">
    <div class="relative">
      <textarea
        bind:value={inputText}
        oninput={handleInputChange}
        placeholder="Enter chord progression (e.g., C Am F G)"
        class="w-full h-16 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
      ></textarea>

      {#if inputText.trim()}
        <button onclick={clearInput} class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-300" aria-label="Clear input"> ✕ </button>
      {/if}
    </div>

    <!-- Validation Status -->
    {#if parsedProgression}
      <div class="flex items-start space-x-2">
        {#if parsedProgression.isValid}
          <CheckCircle class="w-4 h-4 text-emerald-400 mt-0.5" />
          <div class="text-sm text-emerald-400">
            Valid progression: {parsedProgression.chords.length} chords, {parsedProgression.totalBars} bars
          </div>
        {:else}
          <AlertCircle class="w-4 h-4 text-red-400 mt-0.5" />
          <div class="text-sm text-red-400">
            {parsedProgression.errors.join(', ')}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Parsed Chords Preview -->
  {#if parsedProgression?.isValid}
    <div class="bg-gray-700/30 rounded p-2 border border-gray-600/50">
      <div class="flex flex-wrap gap-1.5">
        {#each parsedProgression.chords as parsedChord, index (index)}
          <span class="px-2 py-0.5 rounded text-xs font-mono {parsedChord.isValid ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}">
            {parsedChord.chord}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Help Panel -->
  {#if showHelp}
    <div class="bg-gray-700/30 rounded p-3 border border-gray-600/50 text-xs">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <div class="font-medium text-gray-300 mb-1">Format Examples:</div>
          <div class="space-y-0.5 text-gray-400">
            <div><code class="text-emerald-400">C Am F G</code></div>
            <div><code class="text-emerald-400">C | Am | F | G</code></div>
            <div><code class="text-emerald-400">Cmaj7 Am7 Dm7 G7</code></div>
          </div>
        </div>
        <div>
          <div class="font-medium text-gray-300 mb-1">Quick Examples:</div>
          <div class="space-y-0.5">
            {#each examples.slice(0, 3) as example}
              <button onclick={() => (inputText = example)} class="text-emerald-400 hover:text-emerald-300 font-mono block">
                {example}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
