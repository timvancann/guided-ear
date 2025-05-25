import { audioState } from '$lib/audioplayer.svelte';

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  currentBeat: number;
  beatsPerBar: number;
  currentBar: number;
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
    currentBar: 0
  });

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
      await new Promise(resolve => setTimeout(resolve, 100));
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

    // Different frequency for downbeat vs other beats
    const isDownbeat = this.state.currentBeat === 0;
    clickOsc.frequency.value = isDownbeat ? 1000 : 800;
    
    clickGain.gain.setValueAtTime(0.1, this.nextBeatTime);
    clickGain.gain.exponentialRampToValueAtTime(0.01, this.nextBeatTime + 0.1);

    clickOsc.start(this.nextBeatTime);
    clickOsc.stop(this.nextBeatTime + 0.1);
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.state.bpm;
    this.nextBeatTime += secondsPerBeat;

    // Call beat event before incrementing (for the beat that just played)
    if (this.events.onBeat) {
      this.events.onBeat(this.state.currentBeat);
    }

    this.state.currentBeat++;
    
    if (this.state.currentBeat >= this.state.beatsPerBar) {
      this.state.currentBeat = 0;
      this.state.currentBar++;
      
      // Call bar event
      if (this.events.onBar) {
        this.events.onBar(this.state.currentBar);
      }
    }
  }

  // Allow updating event handlers
  updateEvents(events: MetronomeEvents) {
    this.events = { ...this.events, ...events };
  }

  // Get progress as percentage (0-100) for current beat
  getBeatProgress(): number {
    if (!this.state.isPlaying || !audioState.audioContext) return 0;
    
    const secondsPerBeat = 60.0 / this.state.bpm;
    const timeSinceLastBeat = audioState.audioContext.currentTime - (this.nextBeatTime - secondsPerBeat);
    return Math.min(100, (timeSinceLastBeat / secondsPerBeat) * 100);
  }
}