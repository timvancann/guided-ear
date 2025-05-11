<script lang="ts">
	import { ChevronLeft, Settings } from '@lucide/svelte';
	import Controls from './Controls.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import PlayingIndicator from './PlayingIndicator.svelte';
	import { audioState, playChord, arpeggiateChord } from '$lib/audioplayer.svelte';
	import PlayerSettingToggle from './PlayerSettingToggle.svelte';
	import { chordCategories, type ChordData } from '$lib/settings.svelte';
	import PracticeStatusPill from './PracticeStatusPill.svelte';

	import { chordSettings } from '$lib/state.svelte';

	type PlayState = 'generating' | 'playing' | 'idle' | 'waiting' | 'answering' | 'finished';
	let playState: PlayState = $state('idle');

	let isPlaying = $derived(playState !== 'idle');

	let started = $state(false);

	let { onclick = $bindable() } = $props();
	let currentChord = $state<ChordData | null>(null);

	let activeChords: () => ChordData[] = $derived(() => {
		if (chordSettings.playMode === 'incremental') {
			return chordCategories
				.flatMap((group) => group.chords)
				.filter((chord) => chord.level === chordSettings.currentLevel);
		} else if (chordSettings.playMode === 'recap') {
			return chordCategories
				.flatMap((group) => group.chords)
				.filter((chord) => chord.level <= chordSettings.currentLevel);
		} else {
			return chordCategories.flatMap((group) => group.chords).filter((chord) => chord.enabled);
		}
	});

	$effect(() => {
		if (chordSettings.incrementalMode) {
			chordSettings.playMode = 'incremental';
		} else {
			chordSettings.playMode = 'custom';
		}
	});
	const randomChord = () => {
		const enabledChords = activeChords();
		if (enabledChords.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * enabledChords.length);
		currentChord = enabledChords[randomIndex];
	};

	const togglePlay = () => {
		started = !started;
		if (isPlaying) {
			playState = 'idle';
			audioState.speech?.cancel();
			audioState.player?.stop();
		} else {
			playState = 'generating';
		}
	};

	const incrementLevel = () => {
		if (chordSettings.playMode === 'recap') {
			if (chordSettings.currentLevel === 6) return;
			chordSettings.currentLevel += 1;
			chordSettings.playMode = 'incremental';
		} else if (chordSettings.playMode === 'incremental') {
			chordSettings.playMode = 'recap';
		}
	};

	const decrementLevel = () => {
		if (chordSettings.playMode === 'recap') {
			chordSettings.playMode = 'incremental';
		} else if (chordSettings.playMode === 'incremental') {
			if (chordSettings.currentLevel === 1) return;
			chordSettings.currentLevel -= 1;
			chordSettings.playMode = 'recap';
		}
	};
	const switchState = (from: PlayState, to: PlayState) => {
		if (playState === from) {
			playState = to;
		}
	};

	$effect(() => {
		if (playState === 'generating') {
			randomChord();
			switchState('generating', 'playing');
		}
	});
	
	$effect(() => {
		if (playState === 'playing') {
			if (currentChord) {
				if (chordSettings.arpegiateChords) {
					arpeggiateChord(currentChord.chord, {
						callback: () => {
							playChord(currentChord.chord, {
								callback: () => {
									arpeggiateChord(currentChord.chord, {
										increment: false,
										callback: () => {
											playChord(currentChord.chord, {
												callback: () => {
													switchState('playing', 'waiting');
												}
											});
										}
									});
								}
							});
						}
					});
				} else {
					playChord(currentChord.chord, {
						callback: () => {
							playChord(currentChord.chord, {
								callback: () => {
									switchState('playing', 'waiting');
								}
							});
						}
					});
				}
			}
		}
	});

	$effect(() => {
		if (playState === 'answering') {
			let utterance = new SpeechSynthesisUtterance(currentChord?.id);
			utterance.pitch = 1.2;
			utterance.rate = 0.8;
			utterance.volume = 0.5;
			utterance.onend = () => {
				switchState('answering', 'finished');
			};
			audioState.speech?.speak(utterance);
		}
	});
	$effect(() => {
		if (playState === 'finished') {
			setTimeout(() => {
				switchState('finished', 'idle');
			}, chordSettings.timeBetweenExercises * 1000);
		}
	});

	$effect(() => {
		if (playState === 'waiting') {
			setTimeout(() => {
				switchState('waiting', 'answering');
			}, chordSettings.waitingTimeSeconds * 1000);
		}
	});

	$effect(() => {
		if (chordSettings.progress >= chordSettings.totalExercises) {
			if (chordSettings.autoIncrement) {
				chordSettings.progress = 0;
				if (chordSettings.playMode === 'incremental') {
					chordSettings.playMode = 'recap';
				} else if (chordSettings.playMode === 'recap') {
					chordSettings.playMode = 'incremental';
					chordSettings.currentLevel += 1;
				}
			}
		}
	});

	$effect(() => {
		if (playState === 'idle') {
			if (chordSettings.playMode === 'incremental' && started) {
				chordSettings.progress += 1;
			}

			if (chordSettings.continuousMode && started) {
				switchState('idle', 'generating');
			}
		}
	});
</script>

<header class="mb-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<a class="rounded-full p-2 hover:bg-gray-700" href="/">
				<ChevronLeft size={24} class="text-gray-300" />
			</a>
			<h1 class="text-2xl font-bold text-emerald-400">Chord Recognition</h1>
		</div>
		<button class="rounded-full p-2 hover:bg-gray-700" {onclick}>
			<Settings size={24} class="text-gray-300" />
		</button>
	</div>
</header>

<div class="flex flex-col">
	<div class="mb-6 flex justify-between">
		<PracticeStatusPill />
		<div class="flex flex-col items-end gap-2">
			<PlayerSettingToggle bind:toggle={chordSettings.incrementalMode} name="Level mode" label="" />
			<PlayerSettingToggle
				bind:toggle={chordSettings.continuousMode}
				name="Continuous Mode"
				label=""
			/>
		</div>
	</div>
	<PlayingIndicator {playState} {currentChord} />
	<ProgressBar />
	<Controls {togglePlay} {isPlaying} {incrementLevel} {decrementLevel} />
</div>
