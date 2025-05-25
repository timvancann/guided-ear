import { audioState } from '$lib/audioplayer.svelte';

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  currentBeat: number;
  beatsPerBar: number;
  currentBar: number;
  timeSignature: '4/4' | '3/4' | '2/4';
  clickVolume: number;
}

export interface MetronomeEvents {
  onBeat?: (beat: number) => void;
  onBar?: (bar: number) => void;
  onCycle?: () => void;
}

export class MetronomeEngine {
  private state = $state<MetronomeState>({
    isPlaying: false,
    bpm: 120,
    currentBeat: 0,
    beatsPerBar: 4,
    currentBar: 0,
    timeSignature: '4/4',
    clickVolume: 0.3
  });

  private tapTimes: number[] = [];
  private lastTapTime: number = 0;

  private intervalId: number | null = null;
  private nextBeatTime = 0;
  private lookAhead = 25; // How far ahead to schedule audio (ms)
  private scheduleAheadTime = 0.1; // How far ahead to schedule audio (seconds)
  private events: MetronomeEvents = {};

  constructor(events: MetronomeEvents = {}) {
    this.events = events;
    this.setupAudioContext();
  }

  private async setupAudioContext() {
    // Audio context is set up in the layout, so we just wait for it
    while (!audioState.audioContext) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  get currentState() {
    return this.state;
  }

  setBpm(bpm: number) {
    if (bpm >= 60 && bpm <= 200) {
      this.state.bpm = bpm;
    }
  }

  setBeatsPerBar(beats: number) {
    if (beats >= 2 && beats <= 8) {
      this.state.beatsPerBar = beats;
      this.reset();
    }
  }

  setTimeSignature(timeSignature: '4/4' | '3/4' | '2/4') {
    this.state.timeSignature = timeSignature;
    const beatsMap = { '4/4': 4, '3/4': 3, '2/4': 2 };
    this.state.beatsPerBar = beatsMap[timeSignature];
    this.reset();
  }

  setClickVolume(volume: number) {
    this.state.clickVolume = Math.max(0, Math.min(1, volume));
  }

  start() {
    if (this.state.isPlaying) return;

    this.state.isPlaying = true;

    if (!audioState.audioContext) {
      console.warn('Audio context not available');
      return;
    }

    this.nextBeatTime = audioState.audioContext.currentTime;
    this.scheduleNote();
    this.intervalId = window.setInterval(() => this.scheduler(), this.lookAhead);
  }

  stop() {
    this.state.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.state.currentBeat = 0;
    this.state.currentBar = 0;
    this.nextBeatTime = 0;
  }

  toggle() {
    if (this.state.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  private scheduler() {
    if (!audioState.audioContext) return;

    while (this.nextBeatTime < audioState.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote();
      this.nextNote();
    }
  }

  private scheduleNote() {
    if (!audioState.audioContext) return;

    // Create metronome click sound
    const clickOsc = audioState.audioContext.createOscillator();
    const clickGain = audioState.audioContext.createGain();

    clickOsc.connect(clickGain);
    clickGain.connect(audioState.audioContext.destination);

    // Different frequency and volume for downbeat vs other beats
    const isDownbeat = this.state.currentBeat === 0;
    clickOsc.frequency.value = isDownbeat ? 1200 : 800;

    const volume = this.state.clickVolume * (isDownbeat ? 1.5 : 1.0);
    clickGain.gain.setValueAtTime(volume, this.nextBeatTime);
    clickGain.gain.exponentialRampToValueAtTime(0.01, this.nextBeatTime + 0.1);

    clickOsc.start(this.nextBeatTime);
    clickOsc.stop(this.nextBeatTime + 0.1);

    // Schedule visual update to happen at the exact same time as audio
    const visualUpdateDelay = (this.nextBeatTime - audioState.audioContext.currentTime) * 1000;
    setTimeout(
      () => {
        // Call beat event when the audio actually plays (for the current beat)
        if (this.events.onBeat) {
          this.events.onBeat(this.state.currentBeat);
        }

        // Check if this is the start of a new bar (beat 0)
        if (this.state.currentBeat === 0 && this.events.onBar) {
          this.events.onBar(this.state.currentBar);
        }
      },
      Math.max(0, visualUpdateDelay)
    );
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.state.bpm;
    this.nextBeatTime += secondsPerBeat;

    // Update state to reflect the next beat that will be played
    this.state.currentBeat++;

    if (this.state.currentBeat >= this.state.beatsPerBar) {
      this.state.currentBeat = 0;
      this.state.currentBar++;
    }
  }

  // Allow updating event handlers
  updateEvents(events: MetronomeEvents) {
    this.events = { ...this.events, ...events };
  }

  // Tap tempo functionality
  tapTempo() {
    const now = Date.now();

    // Reset if too much time has passed since last tap
    if (now - this.lastTapTime > 3000) {
      this.tapTimes = [];
    }

    this.tapTimes.push(now);
    this.lastTapTime = now;

    // Keep only the last 4 taps for averaging
    if (this.tapTimes.length > 4) {
      this.tapTimes.shift();
    }

    // Need at least 2 taps to calculate BPM
    if (this.tapTimes.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < this.tapTimes.length; i++) {
        intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
      }

      const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);

      // Constrain to valid BPM range
      const constrainedBpm = Math.max(60, Math.min(200, bpm));
      this.setBpm(constrainedBpm);
    }
  }

  // BPM presets
  setBpmPreset(bpm: number) {
    this.setBpm(bpm);
  }

  // Get common BPM presets
  static getBpmPresets(): Array<{ name: string; bpm: number }> {
    return [
      { name: 'Largo', bpm: 60 },
      { name: 'Andante', bpm: 80 },
      { name: 'Moderato', bpm: 100 },
      { name: 'Allegro', bpm: 120 },
      { name: 'Vivace', bpm: 140 },
      { name: 'Presto', bpm: 180 }
    ];
  }
}
