<script lang="ts">
  import {
    ChevronLeft,
    Code,
    ExternalLink,
    Github,
    Headphones,
    Heart,
    Mic,
    Music,
    Target,
    RotateCcw,
    Volume2,
    Guitar,
    Zap,
    Star,
    Users,
    Award,
    Globe,
    Coffee,
    Sparkles,
    Shield,
    Download
  } from '@lucide/svelte';

  const features = [
    {
      icon: Headphones,
      title: 'Hands-Free Training',
      description: 'Practice anywhere, anytime without needing to look at your screen',
      color: 'emerald'
    },
    {
      icon: Mic,
      title: 'Speech Synthesis',
      description: 'Hear results announced back to you - no tapping or screen interaction required',
      color: 'blue'
    },
    {
      icon: Music,
      title: 'Progressive Learning',
      description: 'Start with basic triads and advance through complex chord types and inversions',
      color: 'purple'
    },
    {
      icon: Target,
      title: 'Multiple Training Modes',
      description: 'Chord recognition, intervals, inversions, progressions, and ChordFlow practice',
      color: 'orange'
    },
    {
      icon: Guitar,
      title: 'Professional Metronome',
      description: 'Advanced metronome with tap tempo, time signatures, and preset management',
      color: 'rose'
    },
    {
      icon: Zap,
      title: 'Real-Time Practice',
      description: 'Immediate feedback and dynamic progression through difficulty levels',
      color: 'yellow'
    }
  ];

  const techStack = [
    { name: 'SvelteKit 5', description: 'Modern reactive framework with latest runes system' },
    { name: 'TypeScript', description: 'Type-safe development with excellent IntelliSense' },
    { name: 'Tailwind CSS 4.0', description: 'Utility-first styling with custom design system' },
    { name: 'Web Audio API', description: 'High-quality audio synthesis and precise timing' },
    { name: 'Tonal.js', description: 'Comprehensive music theory calculations and analysis' },
    { name: 'WebAudioFont', description: 'Professional SoundFont-based instrument samples' }
  ];

  function getColorClasses(color: string, type: 'bg' | 'text' | 'border' | 'from' | 'to') {
    const colors: Record<string, Record<string, string>> = {
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-400', from: 'from-emerald-500', to: 'to-emerald-600' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-400', from: 'from-blue-500', to: 'to-blue-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-400', from: 'from-purple-500', to: 'to-purple-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-400', from: 'from-orange-500', to: 'to-orange-600' },
      rose: { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-400', from: 'from-rose-500', to: 'to-rose-600' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-400', from: 'from-yellow-500', to: 'to-yellow-600' }
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
  <header class="relative z-10 mb-12">
    <div class="flex items-center justify-between mb-8">
      <a class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors group" href="/" aria-label="Back to home">
        <ChevronLeft class="w-5 h-5 text-gray-300 group-hover:-translate-x-0.5 transition-transform" />
      </a>
    </div>

    <div class="text-center">
      <div class="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-6">
        <Headphones class="w-10 h-10 text-white" />
      </div>
      <h1 class="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent mb-4">About Guided Ear</h1>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto">Professional ear training designed for musicians who want to practice anywhere, anytime</p>
    </div>
  </header>
</div>

<!-- Features Section -->
<div class="mb-16">
  <div class="flex items-center space-x-3 mb-10">
    <Sparkles class="w-6 h-6 text-emerald-400" />
    <h2 class="text-3xl font-bold text-white">Key Features</h2>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each features as feature}
      <div class="group relative p-6 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-gray-600/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div class="flex items-center space-x-4 mb-4">
          <div
            class="flex items-center justify-center w-12 h-12 bg-gradient-to-br {getColorClasses(feature.color, 'from')} {getColorClasses(
              feature.color,
              'to'
            )} rounded-xl group-hover:scale-110 transition-transform"
          >
            <feature.icon class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-bold text-white group-hover:{getColorClasses(feature.color, 'text')} transition-colors">
            {feature.title}
          </h3>
        </div>
        <p class="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
      </div>
    {/each}
  </div>
</div>

<!-- Technology Stack Section -->
<div class="mb-16">
  <div class="flex items-center space-x-3 mb-10">
    <Code class="w-6 h-6 text-emerald-400" />
    <h2 class="text-3xl font-bold text-white">Built With Modern Technology</h2>
  </div>

  <div class="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each techStack as tech}
        <div class="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-xl">
          <div class="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-lg">
            <Globe class="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 class="font-semibold text-white mb-1">{tech.name}</h4>
            <p class="text-sm text-gray-400">{tech.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Developer Section -->
<div class="mb-16">
  <div class="flex items-center space-x-3 mb-10">
    <Coffee class="w-6 h-6 text-emerald-400" />
    <h2 class="text-3xl font-bold text-white">About the Developer</h2>
  </div>

  <div class="bg-gradient-to-r from-gray-800/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
    <div class="flex items-start space-x-6">
      <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
        <Users class="w-8 h-8 text-white" />
      </div>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-white mb-3">Created by a Musician, for Musicians</h3>
        <p class="text-gray-300 mb-6 leading-relaxed">
          Guided Ear was created by a musician and developer who wanted a distraction-free way to practice ear training during commutes, walks, and other moments when hands are busy. The goal was to
          build something that actually helps musicians improve their skills without getting in the way of daily life.
        </p>

        <div class="flex items-center space-x-4">
          <a
            href="https://github.com/timvancann"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-lg text-white transition-all duration-300 hover:scale-105"
          >
            <Github class="w-4 h-4" />
            <span>GitHub Profile</span>
            <ExternalLink class="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Open Source Section -->
<div class="mb-16">
  <div class="flex items-center space-x-3 mb-10">
    <Heart class="w-6 h-6 text-emerald-400" />
    <h2 class="text-3xl font-bold text-white">Free & Open Source</h2>
  </div>

  <div class="bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 border border-emerald-600/20 rounded-2xl p-8">
    <div class="flex items-start space-x-6 mb-8">
      <div class="flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-xl">
        <Shield class="w-8 h-8 text-emerald-400" />
      </div>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-emerald-300 mb-3">Completely Free Forever</h3>
        <p class="text-gray-300 leading-relaxed mb-6">
          Guided Ear is completely free to use, with no ads, subscriptions, or in-app purchases. The full source code is available on GitHub for transparency, contributions, and learning.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-center space-x-2 text-emerald-300">
            <Shield class="w-4 h-4" />
            <span class="text-sm">No Ads</span>
          </div>
          <div class="flex items-center space-x-2 text-emerald-300">
            <Shield class="w-4 h-4" />
            <span class="text-sm">No Tracking</span>
          </div>
          <div class="flex items-center space-x-2 text-emerald-300">
            <Shield class="w-4 h-4" />
            <span class="text-sm">No Subscriptions</span>
          </div>
          <div class="flex items-center space-x-2 text-emerald-300">
            <Shield class="w-4 h-4" />
            <span class="text-sm">Open Source</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <a
        href="https://github.com/timvancann/guided-ear"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <Github class="w-5 h-5" />
        <span>View Source Code</span>
        <ExternalLink class="w-4 h-4" />
      </a>

      <a
        href="https://github.com/timvancann/guided-ear/issues"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
      >
        <span>Report Issues</span>
        <ExternalLink class="w-4 h-4" />
      </a>
    </div>
  </div>
</div>

<!-- Feedback Section -->
<div class="mb-16">
  <div class="bg-gradient-to-r from-blue-900/20 to-purple-800/10 border border-blue-600/20 rounded-2xl p-8 text-center">
    <div class="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-xl mx-auto mb-6">
      <Star class="w-8 h-8 text-blue-400" />
    </div>
    <h3 class="text-2xl font-bold text-white mb-4">Have Feedback or Suggestions?</h3>
    <p class="text-gray-300 mb-6 max-w-2xl mx-auto">
      Your input helps make this app better for everyone! Whether it's a bug report, feature request, or just general feedback, we'd love to hear from you.
    </p>
    <a
      href="https://github.com/timvancann/guided-ear/issues/new"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      <span>Share Feedback</span>
      <ExternalLink class="w-4 h-4" />
    </a>
  </div>
</div>

<!-- Footer -->
<div class="border-t border-gray-800 pt-8 pb-4">
  <div class="text-center">
    <div class="flex items-center justify-center space-x-2 mb-4">
      <Headphones class="w-5 h-5 text-emerald-400" />
      <span class="text-lg font-semibold text-white">Guided Ear</span>
    </div>
    <p class="text-gray-400 mb-2">Built with ♥ for musicians everywhere</p>
    <p class="text-sm text-gray-500">Made with SvelteKit 5, TypeScript, Tailwind CSS, and Web Audio API</p>
  </div>
</div>
