import { useState, useCallback, useRef } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startListening = useCallback((onResult: (text: string) => void) => {
    // Stop any active TTS audio playback (Barge-in / Interruption)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Browser fallback simulation if SpeechRecognition API is unavailable
      setIsListening(true);
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      setTimeout(() => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingDuration(0);
      }, 3000);
      return;
    }

    try {
      const recognition = new (SpeechRecognition as any)();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setRecordingDuration(0);
        timerRef.current = window.setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      };

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        finalTranscript = text;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
        onResult(finalTranscript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    isListening,
    transcript,
    recordingDuration,
    startListening,
    stopListening,
  };
}
