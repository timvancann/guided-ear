<script lang="ts">
	import ToggleButton from '$lib/components/ToggleButton.svelte';
	import { MinusIcon, PlusIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	// Types
	interface ChordType {
		name: string;
		intervals: number[];
		color: string;
	}

	interface PresetInfo {
		variable: string;
		url: string;
	}

	interface Level {
		level: number;
		name: string;
		chords: ChordType[];
	}

	interface Preset {
		name: string;
		info: PresetInfo;
	}

	type InstrumentKey = 'piano' | 'jazzGuitar';
	type ExerciseState = 'generating' | 'idle' | 'playing' | 'waiting' | 'revealing';

	interface CurrentChord extends ChordType {
		rootNote: number;
		color: string;
	}

	// Audio context for Web Audio API
	let audioContext: AudioContext;

	// Global declaration for the WebAudioFontPlayer class
	// Since it's loaded via script tag and exposed globally
	declare global {
		interface Window {
			WebAudioFontPlayer: any;
		}
	}

	// States
	let exerciseState: ExerciseState = $state('idle');
	let selectedChordTypes: ChordType[] = $state([]);
	let currentChord: CurrentChord | null = $state(null);
	let volume: number = $state(0.7);
	let noteDuration: number = $state(0.5); // seconds
	let chordDuration: number = $state(3);
	let waitTimeBeforeAnswer: number = $state(2); // seconds
	let selectedInstrument: InstrumentKey = $state('jazzGuitar');
	let isLoading: boolean = $state(true);
	let loadingProgress: number = $state(0);
	let started = $state(false);

	let randomRoot = $state(false);
	let continuousMode = $state(true);
	let includeSingleNotes = $state(true);
	let currentLevel = $state(1);

	// WebAudioFont player
	let player: any;
	let speech: SpeechSynthesis | null;

	// Preset information
	const presets: Record<InstrumentKey, Preset> = {
		piano: {
			name: 'Piano',
			info: {
				variable: '_tone_0000_JCLive_sf2_file',
				url: 'https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js'
			}
		},
		jazzGuitar: {
			name: 'Jazz Guitar',
			info: {
				variable: '_tone_0260_JCLive_sf2_file',
				url: 'https://surikov.github.io/webaudiofontdata/sound/0260_JCLive_sf2_file.js'
			}
		}
	};

	// Instrument presets after loading
	let instrumentPresets: Record<string, any> = {};

	// Define all available chord types and their intervals (in semitones)
	const level1: Level = {
		level: 1,
		name: 'Basic',
		chords: [
			{
				name: 'Major',
				intervals: [0, 4, 7], // root, major 3rd, perfect 5th
				color: 'var(--color-rosePineDawn-gold)'
			},
			{
				name: 'Minor',
				intervals: [0, 3, 7], // root, minor 3rd, perfect 5th
				color: 'var(--color-rosePineDawn-gold)'
			},
			{
				name: 'Power',
				intervals: [0, 7],
				color: 'var(--color-rosePineDawn-gold)'
			}
		]
	};
	const level2: Level = {
		level: 2,
		name: 'Augmented, Diminished',
		chords: [
			{
				name: 'Diminished',
				intervals: [0, 3, 6], // root, minor 3rd, diminished 5th
				color: 'var(--color-rosePineDawn-love)'
			},
			{
				name: 'Augmented',
				intervals: [0, 4, 8], // root, major 3rd, augmented 5th
				color: 'var(--color-rosePineDawn-love)'
			}
		]
	};
	const level3: Level = {
		level: 3,
		name: 'Suspended',
		chords: [
			{
				name: 'Sus2',
				intervals: [0, 2, 7], // root, major 2nd, perfect 5th
				color: 'var(--color-rosePineDawn-rose)'
			},
			{
				name: 'Sus4',
				intervals: [0, 5, 7], // root, perfect 4th, perfect 5th
				color: 'var(--color-rosePineDawn-rose)'
			}
		]
	};
	const level4: Level = {
		level: 4,
		name: 'Common 7th',
		chords: [
			{
				name: 'Dominant 7th',
				intervals: [0, 4, 7, 10], // root, major 3rd, perfect 5th, minor 7th
				color: 'var(--color-rosePineDawn-pine)'
			},
			{
				name: 'Major 7th',
				intervals: [0, 4, 7, 11], // root, major 3rd, perfect 5th, major 7th
				color: 'var(--color-rosePineDawn-pine)'
			},
			{
				name: 'Minor 7th',
				intervals: [0, 3, 7, 10], // root, minor 3rd, perfect 5th, minor 7th
				color: 'var(--color-rosePineDawn-pine)'
			}
		]
	};

	const level5: Level = {
		level: 5,
		name: 'More 7th chords',
		chords: [
			{
				name: 'Minor 7th Flat 5',
				intervals: [0, 3, 6, 10], // root, minor 3rd, diminished 5th, minor 7th
				color: 'var(--color-rosePineDawn-iris)'
			},
			{
				name: 'Diminished 7th',
				intervals: [0, 3, 6, 9], // root, minor 3rd, diminished 5th, diminished 7th
				color: 'var(--color-rosePineDawn-iris)'
			},
			{
				name: 'Minor Major 7th',
				intervals: [0, 3, 7, 11], // root, minor 3rd, perfect 5th, major 7th
				color: 'var(--color-rosePineDawn-iris)'
			}
		]
	};

	const level6: Level = {
		level: 6,
		name: 'Common 9th chords',
		chords: [
			{
				name: 'Dominant 9th',
				intervals: [0, 4, 7, 10, 14], // root, major 3rd, perfect 5th, minor 7th, major 9th
				color: 'var(--color-rosePineDawn-foam)'
			},
			{
				name: 'Major 9th',
				intervals: [0, 4, 7, 11, 14], // root, major 3rd, perfect 5th, major 7th, major 9th
				color: 'var(--color-rosePineDawn-foam)'
			},
			{
				name: 'Minor 9th',
				intervals: [0, 3, 7, 10, 14], // root, minor 3rd, perfect 5th, minor 7th, major 9th
				color: 'var(--color-rosePineDawn-foam)'
			}
		]
	};

	const levels = [level1, level2, level3, level4, level5, level6];

	// Toggle chord type selection
	function toggleChordType(type: ChordType): void {
		if (selectedChordTypes.some((t) => t.name === type.name)) {
			selectedChordTypes = selectedChordTypes.filter((t) => t.name !== type.name);
		} else {
			selectedChordTypes = [...selectedChordTypes, type];
		}
	}

	// Load WebAudioFont library script
	function loadWebAudioFontScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			// Check if WebAudioFontPlayer is already loaded
			if (window.WebAudioFontPlayer) {
				resolve();
				return;
			}

			// Load WebAudioFont script
			const script = document.createElement('script');
			script.src = 'https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js';
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load WebAudioFont player'));
			document.head.appendChild(script);
		});
	}

	// Load instruments using WebAudioFontPlayer
	async function loadInstruments(): Promise<void> {
		isLoading = true;
		loadingProgress = 0;

		try {
			// First, make sure the WebAudioFontPlayer script is loaded
			await loadWebAudioFontScript();

			// Create WebAudioFontPlayer instance
			player = new window.WebAudioFontPlayer();

			// Load piano instrument
			await loadInstrument('piano');
			loadingProgress = 50;

			// Load jazz guitar instrument
			await loadInstrument('jazzGuitar');
			loadingProgress = 100;

			isLoading = false;
		} catch (error) {
			console.error('Error loading instruments:', error);
			isLoading = false;
		}
	}

	// Load a specific instrument
	function loadInstrument(instrumentKey: InstrumentKey): Promise<void> {
		return new Promise((resolve, reject) => {
			const preset = presets[instrumentKey];

			// Create a script element to load the instrument data
			const script = document.createElement('script');
			script.src = preset.info.url;
			script.onload = () => {
				try {
					// Access the global variable created by the loaded script
					const presetData = window[preset.info.variable];
					if (presetData) {
						// Store the preset
						instrumentPresets[instrumentKey] = presetData;
						// Decode the instrument
						player.loader.decodeAfterLoading(audioContext, preset.info.variable);
						resolve();
					} else {
						reject(new Error(`Failed to load instrument: ${preset.name}`));
					}
				} catch (e) {
					reject(e);
				}
			};
			script.onerror = (e) => {
				reject(new Error(`Failed to load instrument script: ${preset.info.url}`));
			};

			// Add the script to the document
			document.head.appendChild(script);
		});
	}

	// Play a single note at the specified pitch using WebAudioFont
	function playTone(pitch: number, startTime: number, duration: number, preset: any) {
		// Get the current instrument preset
		player.queueWaveTable(
			audioContext,
			audioContext.destination,
			preset,
			startTime,
			pitch,
			duration,
			volume
		);
	}

	// Generate a random root note (C3-C5)
	function getRandomRoot(): number {
		// MIDI notes from 48 (C3) to 72 (C5)
		if (randomRoot) {
			return Math.floor(Math.random() * 25) + 48;
		}

		return 48;
	}

	function cancelAllAudio(): void {
		if (player && audioContext) {
			player.cancelQueue(audioContext);
		}
		if ('speechSynthesis' in window) {
			speechSynthesis.cancel();
		}
		if (speech) {
			speech.cancel();
		}
		started = false;
		currentChord = null;
		exerciseState = 'idle';
	}

	$effect(() => {
		console.log(exerciseState);
	});

	$effect(() => {
		if (exerciseState === 'idle' && continuousMode && started) {
			exerciseState = 'generating';
		}
	});

	$effect(() => {
		if (exerciseState === 'generating') {
			const randomTypeIndex = Math.floor(Math.random() * selectedChordTypes.length);
			const chordType = selectedChordTypes[randomTypeIndex];

			// Generate a random root note
			const rootNote = getRandomRoot();
			currentChord = {
				rootNote: rootNote,
				...chordType
			};
			exerciseState = 'playing';
		}
	});

	$effect(() => {
		if (exerciseState === 'playing') {
			playChordSequence().then(() => {
				if (exerciseState === 'playing') exerciseState = 'waiting';
			});
		}
	});

	$effect(() => {
		if (exerciseState === 'waiting') {
			sleep(waitTimeBeforeAnswer * 1000).then(() => {
				if (exerciseState === 'waiting') exerciseState = 'revealing';
			});
		}
	});

	$effect(() => {
		if (exerciseState === 'revealing' && currentChord) {
			speak(currentChord.name);
			sleep(2000).then(() => {
				if (exerciseState === 'revealing') {
					exerciseState = 'idle';
					currentChord = null;
				}
			});
		}
	});

	// Sleep function using promises instead of setTimeout
	function sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function playChordSequence(): Promise<void> {
		if (!currentChord) return;

		const instrumentKey = selectedInstrument;
		const preset = instrumentPresets[instrumentKey];

		const now = audioContext.currentTime;
		let nextStart = now + 0.1; // Small initial delay

		// 2. Play each note individually in ascending order
		if (includeSingleNotes) {
			for (let i = 0; i < currentChord.intervals.length; i++) {
				const midiNote = currentChord.rootNote + currentChord.intervals[i];
				playTone(midiNote, nextStart, noteDuration + 0.1, preset);
				nextStart += noteDuration;
			}

			nextStart += 0.5; // Extra pause before next full chord
		}

		// 3. Play full chord again
		player.queueStrumUp(
			audioContext,
			audioContext.destination,
			preset,
			nextStart,
			currentChord.intervals.map((i) => i + currentChord.rootNote),
			chordDuration
		);

		nextStart += chordDuration;

		// 4. Play each note individually in descending order
		if (includeSingleNotes) {
			for (let i = currentChord.intervals.length - 1; i >= 0; i--) {
				const midiNote = currentChord.rootNote + currentChord.intervals[i];
				playTone(midiNote, nextStart, noteDuration + 0.1, preset);
				nextStart += noteDuration;
			}
		}
		nextStart += 0.5; // Extra pause before final full chord

		// 5. Play full chord one last time
		player.queueStrumDown(
			audioContext,
			audioContext.destination,
			preset,
			nextStart,
			currentChord.intervals.map((i) => i + currentChord.rootNote),
			chordDuration
		);
		nextStart += chordDuration;

		await sleep((nextStart - now) * 1000);
	}

	// Text-to-speech function
	function speak(text: string): void {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = 0.8; // Slightly slower for clarity
		utterance.pitch = 1.5;
		utterance.volume = 1;
		if (speech) speech.speak(utterance);
	}

	function start() {
		exerciseState = 'generating';
		started = true;
	}

	function enableLevel(level: number) {
		// Enable the level and its chords
		const levelData = levels.find((l) => l.level === level);
		if (levelData) {
			selectedChordTypes = [...selectedChordTypes, ...levelData.chords];
		}
	}

	function nextLevel() {
		currentLevel = Math.min(currentLevel + 1, levels.length);
		enableLevel(currentLevel);
	}
	function previousLevel() {
		disableLevel(currentLevel);
		currentLevel = Math.max(currentLevel - 1, 1);
	}

	function disableLevel(level: number) {
		// Disable the level and its chords
		const levelData = levels.find((l) => l.level === level);
		if (levelData) {
			selectedChordTypes = selectedChordTypes.filter(
				(c) => !levelData.chords.some((l) => l.name === c.name)
			);
		}
	}

	function areAllChordsInLevelSelected(level: number): boolean {
		// Check if all chords in the level are selected
		const levelData = levels.find((l) => l.level === level);
		if (levelData) {
			return levelData.chords.every((c) => selectedChordTypes.some((sc) => sc.name === c.name));
		}
		return false;
	}

	function isAnyChordInLevelSelected(level: number): boolean {
		// Check if any chord in the level is selected
		const levelData = levels.find((l) => l.level === level);
		if (levelData) {
			return levelData.chords.some((c) => selectedChordTypes.some((sc) => sc.name === c.name));
		}
		return false;
	}

	// Initialize audio
	onMount((): void => {
		try {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			loadInstruments();
			if ('speechSynthesis' in window) {
				speech = speechSynthesis;
			} else {
				console.error('Text-to-speech not supported in this browser');
			}

			// Request microphone permission to keep audio context active on iOS
			// navigator.mediaDevices
			// 	.getUserMedia({ audio: true })
			// 	.then(() => {
			// 		console.log('Microphone access granted to keep audio context active');
			// 		// Load instrument samples
			// 		loadInstruments();
			// 	})
			// 	.catch((err) => {
			// 		console.error('Error accessing microphone:', err);
			// 		// Still try to load instruments even if mic access fails
			// 		loadInstruments();
			// 	});
		} catch (e) {
			alert('Web Audio API is not supported in this browser');
			console.error(e);
			isLoading = false;
		}
		enableLevel(1);
	});
</script>

<main>
	{#if isLoading}
		<div class="">
			<div class=""></div>
			<p>Loading sounds... {loadingProgress}%</p>
		</div>
	{/if}

	<div class="mt-4 flex flex-col">
		<section class="flex flex-col items-center justify-center">
			<div
				class="chord-display"
				class:bg-rosePineDawn-highlightLow={exerciseState === 'playing'}
				class:bg-rosePineDawn-highlightMed={exerciseState === 'waiting'}
				class:revealing={exerciseState === 'revealing'}
				style="--accent-color: {currentChord?.color}"
			>
				{#if exerciseState === 'revealing'}
					<p class="state-text">{currentChord?.name}</p>
				{:else if exerciseState === 'playing'}
					<p class="state-text">Listen...</p>
				{:else if exerciseState === 'waiting'}
					<p class="state-text">Take your guess...</p>
				{:else}
					<p class="state-text">Not Playing</p>
				{/if}
			</div>
			<div class="mx-auto flex justify-between gap-8">
				<button class="click-button" onclick={previousLevel}>Level<MinusIcon /> </button>
				<button
					class="play-button"
					class:active={exerciseState !== 'idle'}
					onclick={exerciseState !== 'idle' ? cancelAllAudio : start}
				>
					{exerciseState !== 'idle' ? 'Stop' : 'Play'}
				</button>
				<button class="click-button" onclick={nextLevel}>Level<PlusIcon /> </button>
			</div>
		</section>

		<section class="mt-6 flex flex-col gap-1">
			<h2 class="text-center text-2xl font-bold">Chord Types</h2>
			{#each levels as level (level.level)}
				<div
					class="chord-group"
					class:selected={areAllChordsInLevelSelected(level.level)}
					style="--accent-color: {level.chords[0].color}"
				>
					<button
						class="justify-start gap-2"
						onclick={() => {
							if (isAnyChordInLevelSelected(level.level)) {
								disableLevel(level.level);
							} else {
								enableLevel(level.level);
							}
						}}
					>
						<span class="text-[var(--accent-color)]">Level {level.level}:</span>
						<span class="text-xs">{level.name}</span>
					</button>
					<div class="button-group">
						{#each level.chords as chord (chord.name)}
							<button
								class="toggle-button"
								class:selected={selectedChordTypes.some((c) => c.name === chord.name)}
								style="--accent-color: {chord.color}"
								onclick={() => toggleChordType(chord)}
							>
								{chord.name}
							</button>
						{/each}
					</div>
				</div>
			{/each}

			<div class="flex flex-col gap-6">
				<div class="mb-6">
					<label class="block" for="instrument">Instrument</label>
					<div class="button-group">
						<button
							class="toggle-button"
							class:selected={selectedInstrument === 'piano'}
							onclick={() => (selectedInstrument = 'piano')}
							style="--accent-color: var(--color-rosePineDawn-pine)"
						>
							Piano
						</button>
						<button
							class="toggle-button"
							class:selected={selectedInstrument === 'jazzGuitar'}
							onclick={() => (selectedInstrument = 'jazzGuitar')}
							style="--accent-color: var(--color-rosePineDawn-pine)"
						>
							Jazz Guitar
						</button>
					</div>
				</div>

				<div class="flex flex-col gap-2 text-nowrap">
					<div class="setting gap-4">
						<label for="wait-time"
							>Guessing Time:
							<span class="font-bold italic">{waitTimeBeforeAnswer}s</span>
						</label>
						<input
							class="w-full"
							type="range"
							id="wait-time"
							min="1"
							max="4"
							step="0.5"
							bind:value={waitTimeBeforeAnswer}
						/>
					</div>
					<div class="flex justify-between gap-4">
						<ToggleButton bind:toggle={randomRoot} title="Random Root" />
						<ToggleButton bind:toggle={continuousMode} title="Continuous Mode" />
						<ToggleButton bind:toggle={includeSingleNotes} title="Single Notes" />
					</div>
				</div>
			</div>
		</section>
	</div>
</main>
