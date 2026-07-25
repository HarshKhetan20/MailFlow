import { create } from 'zustand';
import type { VoiceStateMode } from '../types/voice';

interface VoiceStore {
  mode: VoiceStateMode;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
  setVoiceMode: (mode: VoiceStateMode) => void;
  setTranscript: (transcript: string) => void;
  resetVoice: () => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  mode: 'Idle',
  isListening: false,
  isSpeaking: false,
  isProcessing: false,
  transcript: '',

  setVoiceMode: (mode) =>
    set({
      mode,
      isListening: mode === 'Listening',
      isSpeaking: mode === 'Speaking',
      isProcessing: mode === 'Processing',
    }),

  setTranscript: (transcript) => set({ transcript }),

  resetVoice: () =>
    set({
      mode: 'Idle',
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
      transcript: '',
    }),
}));
