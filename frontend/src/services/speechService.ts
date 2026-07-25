export async function speechToText(): Promise<string> {
  // Service abstraction for Web Speech Recognition API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Mock spoken text transcript');
    }, 500);
  });
}

export async function textToSpeech(text: string): Promise<void> {
  // Service abstraction for Web Speech Synthesis API
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}
