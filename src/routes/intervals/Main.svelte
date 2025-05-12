<script lang="ts">
  import { arpeggiateInterval, playInterval, audioState } from '$lib/audioplayer.svelte';
  import Controls from '$lib/components/practice/Controls.svelte';
  import PlayerSettingToggle from '$lib/components/practice/PlayerSettingToggle.svelte';
  import PlayingIndicator from '$lib/components/practice/PlayingIndicator.svelte';
  import PracticeStatusPill from '$lib/components/practice/PracticeStatusPill.svelte';
  import ProgressBar from '$lib/components/practice/ProgressBar.svelte';
  import PracticeHeader from '$lib/components/PracticeHeader.svelte';
  import { intervalLevels, intervals, type IntervalData } from '$lib/settings.svelte';
  import { globalSettings, intervalSettings } from '$lib/state.svelte';
  import { slide } from 'svelte/transition';

  let { setView } = $props();
  let selected = $derived(intervals.filter((item) => item.enabled));
  let intervalsInLevel = $derived(intervals.filter((item) => item.level === intervalSettings.currentLevel));

  type PlayState = 'generating' | 'playing' | 'idle' | 'waiting' | 'answering' | 'finished';
  let playState: PlayState = $state('idle');
  let isPlaying = $derived(playState !== 'idle');
  let started = $state(false);

  let activeIntervals: () => IntervalData[] = $derived(() => {
    if (intervalSettings.playMode === 'incremental') {
      return intervals.filter((item) => item.level === intervalSettings.currentLevel);
    } else if (intervalSettings.playMode === 'recap') {
      return intervals.filter((item) => item.level <= intervalSettings.currentLevel);
    } else {
      return selected;
    }
  });

  $effect(() => {
    if (intervalSettings.incrementalMode) {
      intervalSettings.playMode = 'incremental';
    } else {
      intervalSettings.playMode = 'custom';
    }
  });
  let currentInterval: IntervalData = $state(null);

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

  const randomInterval = () => {
    const enabledChords = activeIntervals();
    if (enabledChords.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * enabledChords.length);
    currentInterval = enabledChords[randomIndex];
  };

  const incrementLevel = () => {
    intervalSettings.progress = 0;
    if (intervalSettings.playMode === 'recap') {
      if (intervalSettings.currentLevel === 6) return;
      intervalSettings.currentLevel += 1;
      intervalSettings.playMode = 'incremental';
    } else if (intervalSettings.playMode === 'incremental') {
      intervalSettings.playMode = 'recap';
    }
  };

  const decrementLevel = () => {
    intervalSettings.progress = 0;
    if (intervalSettings.playMode === 'recap') {
      intervalSettings.playMode = 'incremental';
    } else if (intervalSettings.playMode === 'incremental') {
      if (intervalSettings.currentLevel === 1) return;
      intervalSettings.currentLevel -= 1;
      intervalSettings.playMode = 'recap';
    }
  };

  const switchState = (from: PlayState, to: PlayState) => {
    if (playState === from) {
      playState = to;
    }
  };

  $effect(() => {
    if (playState === 'generating') {
      randomInterval();
      if (intervalSettings.playMode !== 'custom' && started) {
        intervalSettings.progress += 1;
      }
      switchState('generating', 'playing');
    }
  });

  $effect(() => {
    if (playState === 'playing') {
      if (currentInterval) {
        if (intervalSettings.arpegiateChords) {
          arpeggiateInterval(currentInterval, {
            callback: () => {
              if (!isPlaying) return;
              playInterval(currentInterval, {
                callback: () => {
                  if (!isPlaying) return;
                  arpeggiateInterval(currentInterval, {
                    increment: false,
                    callback: () => {
                      if (!isPlaying) return;
                      playInterval(currentInterval, {
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
          playInterval(currentInterval, {
            callback: () => {
              if (!isPlaying) return;
              playInterval(currentInterval, {
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
      let utterance = new SpeechSynthesisUtterance(currentInterval?.id);
      utterance.pitch = 1.2;
      utterance.rate = 0.8;
      utterance.volume = globalSettings.voiceVolume;
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
      }, intervalSettings.timeBetweenExercises * 1000);
    }
  });

  $effect(() => {
    if (playState === 'waiting') {
      setTimeout(() => {
        switchState('waiting', 'answering');
      }, intervalSettings.waitingTimeSeconds * 1000);
    }
  });

  $effect(() => {
    if (playState === 'idle') {
      if (intervalSettings.progress >= intervalSettings.totalExercises) {
        if (intervalSettings.autoIncrement) {
          intervalSettings.progress = 0;
          if (intervalSettings.playMode === 'incremental') {
            intervalSettings.playMode = 'recap';
          } else if (intervalSettings.playMode === 'recap') {
            intervalSettings.playMode = 'incremental';
            intervalSettings.currentLevel += 1;
          }
        }
      }
      if (intervalSettings.continuousMode && started) {
        switchState('idle', 'generating');
      }
    }
  });
</script>

<PracticeHeader {setView} title="Interval Training" />

<div class="flex flex-col space-y-6">
  <div class="flex items-center justify-between">
    <PracticeStatusPill
      playMode={intervalSettings.playMode}
      currentLevel={intervalSettings.currentLevel}
      levelName={intervalLevels[intervalSettings.currentLevel - 1].name}
      textIncremental={intervalsInLevel.map((i) => i.interval).join(', ')}
      numberCustomSelected={selected.length}
    />
    <PlayerSettingToggle bind:toggle={intervalSettings.incrementalMode} name="Level mode" label="" />
  </div>
  <PlayingIndicator {playState} answer={currentInterval.id} />
  <ProgressBar total={intervalSettings.totalExercises} progress={intervalSettings.progress} />
  <Controls {togglePlay} {isPlaying} {incrementLevel} {decrementLevel} currentLevel={intervalSettings.currentLevel} playMode={intervalSettings.playMode} totalLevels={intervalLevels.length} />
  {#if intervalSettings.playMode !== 'custom'}
    <div class="mb-4 rounded-lg bg-gray-800 p-4" transition:slide>
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-400">Change Level</span>
          <PlayerSettingToggle bind:toggle={intervalSettings.autoIncrement} name="Auto increment" label="" />
        </div>
        <select
          value={intervalSettings.currentLevel}
          onchange={(e) => (intervalSettings.currentLevel = parseInt(e.target.value))}
          class="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        >
          {#each intervalLevels as level (level.level)}
            <option value={level.level} class="bg-gray-800 text-white">
              {level.level}: {level.name}
            </option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
</div>
