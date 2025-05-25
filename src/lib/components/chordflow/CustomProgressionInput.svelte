<script lang="ts">
  import { chordFlowState } from '$lib/chordflow/state.svelte';
  import { parseProgression, getProgressionExamples, type ParsedProgression } from '$lib/chordflow/progressionParser';
  import { AlertCircle, CheckCircle, HelpCircle } from '@lucide/svelte';

  let inputText = $state('C Am F G');
  let parsedProgression = $state<ParsedProgression | null>(null);
  let showHelp = $state(false);

  // Parse progression when input changes
  $effect(() => {
    if (inputText.trim()) {
      parsedProgression = parseProgression(inputText);
      // Update global state if valid
      if (parsedProgression.isValid) {
        chordFlowState.settings.customProgression = inputText;
      }
    } else {
      parsedProgression = null;
    }
  });

  function handleInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    inputText = target.value;
  }

  function clearInput() {
    inputText = '';
  }

  const examples = getProgressionExamples();
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="text-md font-medium text-gray-300">Custom Progression</h4>
    <button
      onclick={() => showHelp = !showHelp}
      class="p-1 rounded text-gray-400 hover:text-gray-300"
      aria-label="Toggle help"
    >
      <HelpCircle class="w-4 h-4" />
    </button>
  </div>

  <!-- Input Area -->
  <div class="space-y-2">
    <div class="relative">
      <textarea
        value={inputText}
        oninput={handleInputChange}
        placeholder="Enter chord progression (e.g., C Am F G or C | Am | F | G)"
        class="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      ></textarea>
      
      {#if inputText.trim()}
        <button
          onclick={clearInput}
          class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-300"
          aria-label="Clear input"
        >
          ✕
        </button>
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
    <div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
      <div class="text-sm text-gray-300 mb-2">Chord Sequence:</div>
      <div class="flex flex-wrap gap-2">
        {#each parsedProgression.chords as parsedChord, index}
          <span class="px-2 py-1 rounded text-xs font-mono {parsedChord.isValid 
            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-600/30' 
            : 'bg-red-900/30 text-red-400 border border-red-600/30'}"
          >
            {parsedChord.chord}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Help Panel -->
  {#if showHelp}
    <div class="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
      <h5 class="text-sm font-medium text-gray-300 mb-3">Progression Format Help</h5>
      
      <div class="space-y-3 text-xs text-gray-400">
        <div>
          <strong class="text-gray-300">Supported Formats:</strong>
          <ul class="mt-1 space-y-1 list-disc list-inside">
            <li><code class="bg-gray-700 px-1 rounded">C Am F G</code> - Simple space-separated</li>
            <li><code class="bg-gray-700 px-1 rounded">C | Am | F | G</code> - Bar-separated</li>
            <li><code class="bg-gray-700 px-1 rounded">Cmaj7 Am7 Dm7 G7</code> - Complex chords</li>
            <li><code class="bg-gray-700 px-1 rounded">C . Am . | F . G .</code> - Dots for beat holds</li>
          </ul>
        </div>

        <div>
          <strong class="text-gray-300">Supported Chord Types:</strong>
          <div class="mt-1">
            Major, minor (m), 7th, maj7, m7, sus2, sus4, dim, aug, add9, etc.
          </div>
        </div>

        <div>
          <strong class="text-gray-300">Examples:</strong>
          <div class="mt-1 space-y-1">
            {#each examples as example}
              <div>
                <button
                  onclick={() => inputText = example}
                  class="text-emerald-400 hover:text-emerald-300 font-mono text-xs underline"
                >
                  {example}
                </button>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>