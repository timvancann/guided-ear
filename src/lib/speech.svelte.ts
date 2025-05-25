import { audioState } from '$lib/audioplayer.svelte';
import { globalSettings } from '$lib/state.svelte';

export interface SpeechOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  onEnd?: () => void;
  onStart?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export function speak(text: string, options: SpeechOptions = {}) {
  if (!audioState.speech) {
    console.warn('Speech synthesis not available');
    if (options.onError) {
      const errorEvent = new Event('error') as SpeechSynthesisErrorEvent;
      options.onError(errorEvent);
    }
    return;
  }

  // Cancel any existing speech
  audioState.speech.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Set default options
  utterance.pitch = options.pitch ?? 1.2;
  utterance.rate = options.rate ?? 0.8;
  utterance.volume = options.volume ?? globalSettings.value.voiceVolume;
  utterance.voice = options.voice ?? null;

  // Set event handlers
  utterance.onend = () => options.onEnd?.();
  utterance.onstart = () => options.onStart?.();
  utterance.onerror = (error) => options.onError?.(error);

  audioState.speech.speak(utterance);
}

export function cancelSpeech() {
  if (audioState.speech) {
    audioState.speech.cancel();
  }
}

export function isSpeaking() {
  return audioState.speech?.speaking ?? false;
}

export function getVoices(): SpeechSynthesisVoice[] {
  return speechSynthesis.getVoices();
}

export function findVoice(criteria: { lang?: string; name?: string }): SpeechSynthesisVoice | null {
  const voices = getVoices();

  if (criteria.name) {
    return voices.find((voice) => voice.name === criteria.name) ?? null;
  }

  if (criteria.lang) {
    return voices.find((voice) => voice.lang.startsWith(criteria.lang!)) ?? null;
  }

  return null;
}
