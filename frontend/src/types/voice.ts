export type VoiceStateMode = 'Idle' | 'Listening' | 'Processing' | 'Speaking';

export interface VoiceState {
  mode: VoiceStateMode;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
}
