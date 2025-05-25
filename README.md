# 🎵 Guided Ear Training

> **Practice and improve your musical ear with interactive training modules**

A modern, comprehensive ear training application built with Svelte 5 that helps musicians develop their listening skills through progressive practice sessions.

## 🌐 Live Demo

**[🚀 Try Guided Ear Training Now](https://guided-ear.vercel.app/)**

Experience the full application live on Vercel - no installation required!

## ✨ Features

### 🎼 Core Training Modules
- **Chord Recognition** - Master identification of major, minor, diminished, augmented, and extended chords
- **Interval Training** - Practice recognizing musical intervals from unison to octave
- **Chord Inversions** - Learn to identify root position, first, and second inversions
- **Chord Progressions** - Develop skills in recognizing chord sequences and harmonic movement

### 🎹 ChordFlow Practice System
- **Multiple Progression Types**:
  - Cycle of Fourths (classic jazz progression pattern)
  - Random Chords (practice with selected chord qualities)
  - Diatonic Progressions (scale-based sequences with incremental or random selection)
  - Custom Progressions (user-defined sequences with flexible formatting)
- **Integrated Metronome** - Visual and audio click with configurable tempo and time signature
- **Chord Audio Playback** - Optional sounds with multiple voicing options (close, open, shell)
- **Preset Library** - Common progressions organized by category (Popular, Jazz, Blues, etc.)

### 🧠 Intelligent Training System
- **Progressive Difficulty** - Incremental learning with customizable levels
- **Multiple Play Modes** - Custom selection, incremental progression, and recap modes
- **Audio Feedback** - High-quality SoundFont-based playback with speech synthesis
- **Settings Persistence** - Save your preferences and progress locally
- **Responsive Design** - Optimized for desktop and mobile practice sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/timvancann/guided-ear.git
cd guided-ear

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:5173` to start training!

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm dev -- --open       # Start dev server and open browser

# Building
pnpm build              # Build for production
pnpm preview            # Preview production build

# Code Quality
pnpm check              # Run Svelte type checking
pnpm check:watch        # Run type checking in watch mode
pnpm lint               # Run ESLint and Prettier checks
pnpm format             # Format code with Prettier
```

### Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) with SvelteKit
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Audio**: [WebAudioFont](https://surikov.github.io/webaudiofont/) via [smplr](https://github.com/danigb/smplr)
- **Music Theory**: [Tonal.js](https://github.com/tonaljs/tonal)
- **Icons**: [Lucide](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🎯 Architecture

### Core Components

```
src/
├── lib/
│   ├── training/           # Generic training system
│   │   ├── types.ts        # Core interfaces
│   │   ├── TrainingEngine.svelte.ts  # State machine
│   │   └── modes/          # Specific implementations
│   ├── chordflow/          # ChordFlow practice system
│   │   ├── state.svelte.ts # Reactive state management
│   │   ├── chordGenerator.svelte.ts # Progression logic
│   │   └── metronome.svelte.ts      # Enhanced metronome
│   ├── components/         # UI components
│   │   ├── training/       # Generic training UI
│   │   ├── chordflow/      # ChordFlow specific UI
│   │   └── practice/       # Shared practice components
│   └── audioplayer.svelte.ts  # Global audio system
└── routes/                 # SvelteKit pages
    ├── chords/            # Chord recognition training
    ├── intervals/         # Interval training
    ├── inversions/        # Inversion training
    ├── progressions/      # Progression training
    └── chordflow/         # ChordFlow practice
```

### State Management
- **Svelte 5 Runes** - Modern reactive state with `$state` and `$derived`
- **Global Audio State** - Centralized SoundFont player and AudioContext
- **Persistent Settings** - localStorage-based configuration management
- **Modular Design** - Each training mode is self-contained and extensible

## 🎨 Design System

The application features a modern, professional design with:

- **Color-Coded Training Modes** - Each module has its own theme
- **Responsive Layout** - Optimized for all screen sizes  
- **Dark Theme** - Easy on the eyes for extended practice sessions
- **Smooth Animations** - Enhanced user experience with subtle transitions
- **Professional Typography** - Noto Sans font family for clarity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm check && pnpm lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow existing code style and use Prettier for formatting
- Write TypeScript with proper type annotations
- Use Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactivity
- Maintain responsive design principles
- Test across different browsers and screen sizes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tonal.js](https://github.com/tonaljs/tonal) for comprehensive music theory utilities
- [smplr](https://github.com/danigb/smplr) for high-quality audio sampling
- [WebAudioFont](https://surikov.github.io/webaudiofont/) for instrument sounds
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

**Start your musical journey today!** 🎵 Practice with focus, improve with consistency.