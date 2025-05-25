<script lang="ts">
  import { ChevronRight, Info, PlayCircle, Music, Volume2, RotateCcw, Target, Guitar, Headphones, Users, Award, MousePointer, Clock } from '@lucide/svelte';
  import { onMount } from 'svelte';

  let selection: Card | null = null;

  type Card = {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    features: string[];
  };

  let handsfreeCards: Card[] = [
    {
      title: 'Chord Recognition',
      description: 'Master chord identification with progressive difficulty levels',
      id: 'handsfree/chords',
      icon: Music,
      color: 'emerald',
      features: ['Major & Minor Chords', '7th & Extended Chords', 'Progressive Difficulty']
    },
    {
      title: 'Interval Training',
      description: 'Perfect your interval recognition from unison to octave',
      id: 'handsfree/intervals',
      icon: Target,
      color: 'purple',
      features: ['All Interval Types', 'Ascending & Descending', 'Custom Practice']
    },
    {
      title: 'Chord Inversions',
      description: 'Develop skills in recognizing chord inversions and voicings',
      id: 'handsfree/inversions',
      icon: RotateCcw,
      color: 'blue',
      features: ['Root Position', 'First & Second Inversions', 'Advanced Voicings']
    },
    {
      title: 'Chord Progressions',
      description: 'Learn to identify common chord sequences and cadences',
      id: 'handsfree/progressions',
      icon: Volume2,
      color: 'orange',
      features: ['Common Progressions', 'Jazz & Classical', 'Cadence Recognition']
    }
  ];

  let interactiveCards: Card[] = [
    {
      title: 'Chord Recognition',
      description: 'Click-based chord identification with instant feedback',
      id: 'interactive/chords',
      icon: Music,
      color: 'emerald',
      features: ['Multiple Choice', 'Instant Feedback', 'Progress Tracking']
    },
    {
      title: 'Interval Training',
      description: 'Interactive interval recognition with visual answers',
      id: 'interactive/intervals',
      icon: Target,
      color: 'purple',
      features: ['Visual Interface', 'Score System', 'Custom Levels']
    },
    {
      title: 'Chord Inversions',
      description: 'Interactive inversion practice with answer selection',
      id: 'interactive/inversions',
      icon: RotateCcw,
      color: 'blue',
      features: ['Visual Feedback', 'Timed Challenges', 'Leaderboards']
    },
    {
      title: 'Chord Progressions',
      description: 'Interactive progression analysis with step-by-step guidance',
      id: 'interactive/progressions',
      icon: Volume2,
      color: 'orange',
      features: ['Step-by-Step', 'Analysis Tools', 'Performance Metrics']
    }
  ];

  let practiceCards: Card[] = [
    {
      title: 'ChordFlow Practice',
      description: 'Guitar chord progression practice with professional metronome',
      id: 'chordflow',
      icon: Guitar,
      color: 'rose',
      features: ['Metronome Integration', 'Multiple Progressions', 'Preset Management']
    }
  ];

  onMount(() => {
    selection = handsfreeCards[0];
  });

  function getColorClasses(color: string, type: 'bg' | 'text' | 'border' | 'from' | 'to') {
    const colors: Record<string, Record<string, string>> = {
      emerald: {
        bg: 'bg-emerald-500',
        text: 'text-emerald-400',
        border: 'border-emerald-400',
        from: 'from-emerald-500',
        to: 'to-emerald-600'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-400',
        border: 'border-blue-400',
        from: 'from-blue-500',
        to: 'to-blue-600'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-400',
        border: 'border-purple-400',
        from: 'from-purple-500',
        to: 'to-purple-600'
      },
      orange: {
        bg: 'bg-orange-500',
        text: 'text-orange-400',
        border: 'border-orange-400',
        from: 'from-orange-500',
        to: 'to-orange-600'
      },
      rose: {
        bg: 'bg-rose-500',
        text: 'text-rose-400',
        border: 'border-rose-400',
        from: 'from-rose-500',
        to: 'to-rose-600'
      }
    };
    return colors[color]?.[type] || '';
  }
</script>

<!-- Hero Section -->
<div class="relative overflow-hidden">
  <!-- Background Pattern -->
  <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black opacity-50"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_50%)]"></div>

  <!-- Header -->
  <header class="relative z-10 flex items-center justify-between mb-12">
    <div class="flex items-center space-x-4">
      <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
        <Headphones class="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">Guided Ear</h1>
        <p class="text-gray-400 text-lg">Professional ear training for musicians</p>
      </div>
    </div>
    <a class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors" href="/info" aria-label="App information">
      <Info class="w-5 h-5 text-gray-300" />
    </a>
  </header>

  <!-- Continue Training CTA -->
  {#if selection}
    <a
      class="relative z-10 group block mb-12 p-6 bg-gradient-to-r {getColorClasses(selection.color, 'from')} {getColorClasses(
        selection.color,
        'to'
      )} rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      href="/{selection.id}"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl">
            <PlayCircle class="w-8 h-8 text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white mb-1">Continue Training</div>
            <div class="text-white/80 text-lg">{selection.title}</div>
            <div class="text-white/60 text-sm mt-1">{selection.description}</div>
          </div>
        </div>
        <ChevronRight class="w-8 h-8 text-white/80 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  {/if}
</div>

<!-- Handsfree Training Section -->
<div class="mb-16">
  <div class="flex items-center space-x-3 mb-4">
    <Headphones class="w-6 h-6 text-emerald-400" />
    <h2 class="text-2xl font-bold text-white">Handsfree Training</h2>
  </div>
  <p class="text-gray-400 mb-8">Practice without looking at the screen - perfect for focused listening sessions</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
    {#each handsfreeCards as card}
      <button
        onclick={() => (selection = card)}
        class="group relative p-4 sm:p-6 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/50 rounded-xl sm:rounded-2xl transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-xl"
        class:ring-2={selection?.id === card.id}
        class:ring-offset-2={selection?.id === card.id}
        class:ring-offset-gray-950={selection?.id === card.id}
        class:ring-emerald-400={selection?.id === card.id}
      >
        <!-- Icon and Title -->
        <div class="flex items-start justify-between mb-3 sm:mb-4">
          <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div
              class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br {getColorClasses(card.color, 'from')} {getColorClasses(
                card.color,
                'to'
              )} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform flex-shrink-0"
            >
              <card.icon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-lg sm:text-xl font-bold text-white group-hover:{getColorClasses(card.color, 'text')} transition-colors truncate">
                {card.title}
              </h3>
              <p class="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">{card.description}</p>
            </div>
          </div>

          {#if selection?.id === card.id}
            <div class="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex-shrink-0 ml-2">
              <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span class="text-xs text-emerald-400 font-medium hidden sm:inline">SELECTED</span>
            </div>
          {/if}
        </div>

        <!-- Features List - Compact on mobile -->
        <div class="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
          {#each card.features.slice(0, 3) as feature}
            <div class="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
              <div class="w-1 h-1 sm:w-1.5 sm:h-1.5 {getColorClasses(card.color, 'bg')} rounded-full flex-shrink-0"></div>
              <span class="truncate">{feature}</span>
            </div>
          {/each}
        </div>

        <!-- Launch Button -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <a
            href="/{card.id}"
            class="inline-flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 sm:py-2 bg-gradient-to-r {getColorClasses(card.color, 'from')} {getColorClasses(
              card.color,
              'to'
            )} rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            onclick={(e) => e.stopPropagation()}
          >
            <span>Start Training</span>
            <ChevronRight class="w-4 h-4" />
          </a>

          <div class="text-xs text-gray-500 text-center sm:text-right hidden sm:block">Click to select • Click button to start</div>
        </div>
      </button>
    {/each}
  </div>
</div>

<!-- Interactive Training Section -->
<div class="mb-16">
  <div class="flex items-center space-x-3 mb-4">
    <MousePointer class="w-6 h-6 text-blue-400" />
    <h2 class="text-2xl font-bold text-white">Interactive Training</h2>
    <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-medium">NEW</span>
  </div>
  <p class="text-gray-400 mb-8">Click-based training with instant feedback and visual interfaces</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
    {#each interactiveCards as card, index}
      {#if card.id === 'interactive/chords'}
        <!-- Chord Recognition - Available -->
        <button
          onclick={() => (selection = card)}
          class="group relative p-4 sm:p-6 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/50 rounded-xl sm:rounded-2xl transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-xl"
          class:ring-2={selection?.id === card.id}
          class:ring-offset-2={selection?.id === card.id}
          class:ring-offset-gray-950={selection?.id === card.id}
          class:ring-emerald-400={selection?.id === card.id}
        >
          <!-- Icon and Title -->
          <div class="flex items-start justify-between mb-3 sm:mb-4">
            <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div
                class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br {getColorClasses(card.color, 'from')} {getColorClasses(
                  card.color,
                  'to'
                )} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform flex-shrink-0"
              >
                <card.icon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-lg sm:text-lg font-semibold text-white mb-1 truncate group-hover:{getColorClasses(card.color, 'text')} transition-colors">{card.title}</h3>
                <p class="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2">{card.description}</p>
              </div>
            </div>

            {#if selection?.id === card.id}
              <div class="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex-shrink-0 ml-2">
                <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span class="text-xs text-emerald-400 font-medium hidden sm:inline">SELECTED</span>
              </div>
            {/if}
          </div>

          <!-- Features List - Compact on mobile -->
          <div class="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            {#each card.features.slice(0, 3) as feature}
              <div class="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                <div class="w-1 h-1 sm:w-1.5 sm:h-1.5 {getColorClasses(card.color, 'bg')} rounded-full flex-shrink-0"></div>
                <span class="truncate">{feature}</span>
              </div>
            {/each}
          </div>

          <!-- Launch Button -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <a
              href="/{card.id}"
              class="inline-flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 sm:py-2 bg-gradient-to-r {getColorClasses(card.color, 'from')} {getColorClasses(
                card.color,
                'to'
              )} rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              onclick={(e) => e.stopPropagation()}
            >
              <span>Start Training</span>
              <ChevronRight class="w-4 h-4" />
            </a>

            <div class="text-xs text-gray-500 text-center sm:text-right hidden sm:block">Click to select • Click button to start</div>
          </div>
        </button>
      {:else}
        <!-- Other Interactive Modes - Coming Soon -->
        <div class="group relative p-4 sm:p-6 bg-gray-800/30 border border-gray-700/30 rounded-xl sm:rounded-2xl opacity-75">
          <!-- Icon and Title -->
          <div class="flex items-start justify-between mb-3 sm:mb-4">
            <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div
                class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br {getColorClasses(card.color, 'from')} {getColorClasses(
                  card.color,
                  'to'
                )} rounded-lg sm:rounded-xl opacity-60 flex-shrink-0"
              >
                <card.icon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-lg sm:text-lg font-semibold text-white mb-1 truncate">{card.title}</h3>
                <p class="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2">{card.description}</p>
              </div>
            </div>
          </div>

          <!-- Features List - Compact on mobile -->
          <div class="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            {#each card.features.slice(0, 3) as feature}
              <div class="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                <div class="w-1 h-1 sm:w-1.5 sm:h-1.5 {getColorClasses(card.color, 'bg')} rounded-full opacity-60 flex-shrink-0"></div>
                <span class="truncate">{feature}</span>
              </div>
            {/each}
          </div>

          <!-- Coming Soon Button -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div class="inline-flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 sm:py-2 bg-gray-700 rounded-lg text-gray-400 font-medium cursor-not-allowed text-sm sm:text-base">
              <span>Coming Soon</span>
              <Clock class="w-4 h-4" />
            </div>
            <div class="text-xs text-gray-600 text-center sm:text-right hidden sm:block">Interactive mode in development</div>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>

<!-- Practice Tools Section -->
<div class="mb-16">
  <div class="flex items-center space-x-3 mb-4">
    <Guitar class="w-6 h-6 text-rose-400" />
    <h2 class="text-2xl font-bold text-white">Practice Tools</h2>
  </div>
  <p class="text-gray-400 mb-8">Professional tools for structured practice sessions</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
    {#each practiceCards as card}
      <button
        onclick={() => (selection = card)}
        class="group relative p-4 sm:p-6 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/50 rounded-xl sm:rounded-2xl transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-xl"
        class:ring-2={selection?.id === card.id}
        class:ring-offset-2={selection?.id === card.id}
        class:ring-offset-gray-950={selection?.id === card.id}
        class:ring-emerald-400={selection?.id === card.id}
      >
        <!-- Icon and Title -->
        <div class="flex items-start justify-between mb-3 sm:mb-4">
          <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div
              class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br {getColorClasses(card.color, 'from')} {getColorClasses(
                card.color,
                'to'
              )} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform flex-shrink-0"
            >
              <card.icon class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-lg sm:text-lg font-semibold text-white mb-1 truncate">{card.title}</h3>
              <p class="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2">{card.description}</p>
            </div>
          </div>

          {#if selection?.id === card.id}
            <div class="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex-shrink-0 ml-2">
              <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span class="text-xs text-emerald-400 font-medium hidden sm:inline">SELECTED</span>
            </div>
          {/if}
        </div>

        <!-- Features List - Compact on mobile -->
        <div class="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
          {#each card.features.slice(0, 3) as feature}
            <div class="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
              <div class="w-1 h-1 sm:w-1.5 sm:h-1.5 {getColorClasses(card.color, 'bg')} rounded-full flex-shrink-0"></div>
              <span class="truncate">{feature}</span>
            </div>
          {/each}
        </div>

        <!-- Launch Button -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <a
            href="/{card.id}"
            class="inline-flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 sm:py-2 bg-gradient-to-r {getColorClasses(card.color, 'from')} {getColorClasses(
              card.color,
              'to'
            )} rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            onclick={(e) => e.stopPropagation()}
          >
            <span>Start Training</span>
            <ChevronRight class="w-4 h-4" />
          </a>

          <div class="text-xs text-gray-500 text-center sm:text-right hidden sm:block">Click to select • Click button to start</div>
        </div>
      </button>
    {/each}
  </div>
</div>

<!-- Footer Info -->
<div class="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
  <div class="flex items-center justify-center space-x-2 mb-3">
    <Users class="w-5 h-5 text-emerald-400" />
    <span class="text-lg font-semibold text-white">Built for Musicians, by Musicians</span>
  </div>
  <p class="text-gray-400 max-w-2xl mx-auto">
    Guided Ear provides comprehensive ear training modules designed to improve your musical listening skills. From basic chord recognition to advanced progression analysis, develop your musical ear
    with professional-grade training tools.
  </p>
</div>
