<script lang="ts">
  import { ChevronRight, Info, PlayCircle, Music, Volume2, RotateCcw, Target, Guitar, Headphones, Users, Award } from '@lucide/svelte';
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

  let cards: Card[] = [
    {
      title: 'Chord Recognition',
      description: 'Master chord identification with progressive difficulty levels',
      id: 'chords',
      icon: Music,
      color: 'emerald',
      features: ['Major & Minor Chords', '7th & Extended Chords', 'Progressive Difficulty']
    },
    {
      title: 'Chord Inversions',
      description: 'Develop skills in recognizing chord inversions and voicings',
      id: 'inversions',
      icon: RotateCcw,
      color: 'blue',
      features: ['Root Position', 'First & Second Inversions', 'Advanced Voicings']
    },
    {
      title: 'Interval Training',
      description: 'Perfect your interval recognition from unison to octave',
      id: 'intervals',
      icon: Target,
      color: 'purple',
      features: ['All Interval Types', 'Ascending & Descending', 'Custom Practice']
    },
    {
      title: 'Chord Progressions',
      description: 'Learn to identify common chord sequences and cadences',
      id: 'progressions',
      icon: Volume2,
      color: 'orange',
      features: ['Common Progressions', 'Jazz & Classical', 'Cadence Recognition']
    },
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
    selection = cards[0];
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

<!-- Training Modules Section -->
<div class="mb-12">
  <div class="flex items-center space-x-3 mb-8">
    <Award class="w-6 h-6 text-emerald-400" />
    <h2 class="text-2xl font-bold text-white">Training Modules</h2>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#each cards as card}
      <button
        onclick={() => (selection = card)}
        class="group relative p-6 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/50 rounded-2xl transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-xl"
        class:ring-2={selection?.id === card.id}
        class:ring-offset-2={selection?.id === card.id}
        class:ring-offset-gray-950={selection?.id === card.id}
        class:ring-emerald-400={selection?.id === card.id}
      >
        <!-- Icon and Title -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-4">
            <div
              class="flex items-center justify-center w-12 h-12 bg-gradient-to-br {getColorClasses(card.color, 'from')} {getColorClasses(
                card.color,
                'to'
              )} rounded-xl group-hover:scale-110 transition-transform"
            >
              <card.icon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white group-hover:{getColorClasses(card.color, 'text')} transition-colors">
                {card.title}
              </h3>
              <p class="text-gray-400 text-sm mt-1">{card.description}</p>
            </div>
          </div>

          {#if selection?.id === card.id}
            <div class="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full">
              <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span class="text-xs text-emerald-400 font-medium">SELECTED</span>
            </div>
          {/if}
        </div>

        <!-- Features List -->
        <div class="space-y-2">
          {#each card.features as feature}
            <div class="flex items-center space-x-2 text-sm text-gray-300">
              <div class="w-1.5 h-1.5 {getColorClasses(card.color, 'bg')} rounded-full"></div>
              <span>{feature}</span>
            </div>
          {/each}
        </div>

        <!-- Launch Button -->
        <div class="mt-6 flex items-center justify-between">
          <a
            href="/{card.id}"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r {getColorClasses(card.color, 'from')} {getColorClasses(
              card.color,
              'to'
            )} rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            onclick={(e) => e.stopPropagation()}
          >
            <span>Start Training</span>
            <ChevronRight class="w-4 h-4" />
          </a>

          <div class="text-xs text-gray-500">Click to select • Click button to start</div>
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
