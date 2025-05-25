import { audioState } from '$lib/audioplayer.svelte';
import { Chord } from 'tonal';

export interface ChordAudioSettings {
  enabled: boolean;
  volume: number;
  playOnBeat1Only: boolean;
  voicing: 'close' | 'open' | 'shell';
}

export const chordAudioSettings = $state<ChordAudioSettings>({
  enabled: true,
  volume: 0.5,
  playOnBeat1Only: true,
  voicing: 'close'
});

/**
 * Play a chord using the existing SoundFont system
 */
export async function playChord(chordName: string, settings: ChordAudioSettings = chordAudioSettings) {
  if (!settings.enabled || !audioState.player || !audioState.audioContext) {
    return;
  }

  try {
    const chord = Chord.get(chordName);
    if (!chord.notes || chord.notes.length === 0) {
      console.warn(`Invalid chord: ${chordName}`);
      return;
    }

    // Get chord notes and apply voicing
    let notes = getChordVoicing(chord.notes, settings.voicing);
    
    // Convert to MIDI note format (with octave)
    const octave = 4;
    const midiNotes = notes.map(note => `${note}${octave}`);

    const now = audioState.audioContext.currentTime;
    const duration = 1.0; // 1 second duration

    // Play each note of the chord
    midiNotes.forEach((note, index) => {
      audioState.player?.start({
        note,
        time: now,
        duration: duration,
        velocity: Math.floor(settings.volume * 127)
      });
    });

  } catch (error) {
    console.error(`Error playing chord ${chordName}:`, error);
  }
}

/**
 * Get chord voicing based on settings
 */
function getChordVoicing(notes: string[], voicing: 'close' | 'open' | 'shell'): string[] {
  if (notes.length === 0) return [];

  switch (voicing) {
    case 'close':
      // Keep notes as-is (close position)
      return notes;
      
    case 'open':
      // Spread notes across wider range
      if (notes.length >= 3) {
        return [notes[0], notes[2], notes[1], ...notes.slice(3)];
      }
      return notes;
      
    case 'shell':
      // Just root and 7th (if available) or root and 3rd
      if (notes.length >= 4) {
        return [notes[0], notes[3]]; // Root and 7th
      } else if (notes.length >= 3) {
        return [notes[0], notes[2]]; // Root and 5th
      } else {
        return notes.slice(0, 2); // Root and whatever else
      }
      
    default:
      return notes;
  }
}

/**
 * Play metronome click sound
 */
export function playMetronomeClick(isDownbeat: boolean = false, volume: number = 0.3) {
  if (!audioState.audioContext) return;

  const clickOsc = audioState.audioContext.createOscillator();
  const clickGain = audioState.audioContext.createGain();

  clickOsc.connect(clickGain);
  clickGain.connect(audioState.audioContext.destination);

  // Different frequency for downbeat vs other beats
  clickOsc.frequency.value = isDownbeat ? 1200 : 800;
  
  const now = audioState.audioContext.currentTime;
  clickGain.gain.setValueAtTime(volume, now);
  clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  clickOsc.start(now);
  clickOsc.stop(now + 0.1);
}

/**
 * Settings management
 */
export function toggleChordAudio() {
  chordAudioSettings.enabled = !chordAudioSettings.enabled;
}

export function setChordVolume(volume: number) {
  chordAudioSettings.volume = Math.max(0, Math.min(1, volume));
}

export function setChordVoicing(voicing: 'close' | 'open' | 'shell') {
  chordAudioSettings.voicing = voicing;
}

export function togglePlayOnBeat1Only() {
  chordAudioSettings.playOnBeat1Only = !chordAudioSettings.playOnBeat1Only;
}