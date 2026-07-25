import { useVoiceStore } from '../store/voiceStore';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useTextToSpeech } from './useTextToSpeech';

export function useVoice() {
  const voiceStore = useVoiceStore();
  const recognition = useSpeechRecognition();
  const tts = useTextToSpeech();

  const toggleListen = (onSpeechResult?: (text: string) => void) => {
    if (voiceStore.isListening) {
      recognition.stopListening();
      voiceStore.setVoiceMode('Idle');
    } else {
      // Barge-in: Stop assistant speaking immediately when user speaks
      tts.stopSpeaking();
      voiceStore.setVoiceMode('Listening');
      recognition.startListening((text) => {
        if (text) {
          voiceStore.setTranscript(text);
          if (onSpeechResult) {
            onSpeechResult(text);
          }
        }
        voiceStore.setVoiceMode('Idle');
      });
    }
  };

  return {
    ...voiceStore,
    isListening: recognition.isListening || voiceStore.isListening,
    isSpeaking: tts.isSpeaking || voiceStore.isSpeaking,
    recordingDuration: recognition.recordingDuration,
    toggleListen,
    speak: tts.speak,
    stopSpeaking: tts.stopSpeaking,
  };
}
