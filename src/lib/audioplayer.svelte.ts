import Soundfont from 'soundfont-player';
import { Chord } from 'tonal';

export const audioState: { player: Soundfont.Player | null, audioContext: AudioContext | null, speech: SpeechSynthesis | null } = $state({
  player: null,
  audioContext: null,
  speech: null,
});


export const playChord = (chord: Chord.Chord, tonic: string = "C4", duration: number = 2) => {
  for (const note of Chord.notes(chord.type, tonic)) {
    audioState.player?.play(note, audioState.audioContext?.currentTime, {
      duration: duration,
    });
  }
}
