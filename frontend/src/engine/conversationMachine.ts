import type { StateMachineContext, EngineState, CompositionMode } from './types';

export const INITIAL_CONTEXT: StateMachineContext = {
  currentState: 'IDLE',
  mode: null,
  draft: {
    recipient: '',
    subject: '',
    body: '',
    topic: '',
    tone: 'Professional',
    specifics: '',
  },
  messages: [
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am your MailFlow AI Agent. Tap the microphone and say "Send an email" to get started.',
      timestamp: new Date(),
      state: 'IDLE',
    },
  ],
  isListening: false,
  isSpeaking: false,
  errorMessage: null,
};

export function isValidEmail(email: string): boolean {
  const cleaned = email.trim().replace(/\s+at\s+/gi, '@').replace(/\s+dot\s+/gi, '.').toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned);
}

export function parseSpokenEmail(spoken: string): string {
  let cleaned = spoken.trim().toLowerCase();
  cleaned = cleaned.replace(/\s+at\s+/gi, '@');
  cleaned = cleaned.replace(/\s+dot\s+/gi, '.');
  cleaned = cleaned.replace(/\s+/g, '');
  return cleaned;
}

export function generateAssistantPrompt(state: EngineState, mode: CompositionMode | null, draft: StateMachineContext['draft']): string {
  switch (state) {
    case 'SELECT_COMPOSITION_MODE':
      return 'Sure. Would you like to dictate the email yourself, or would you like me to compose it for you?';
    case 'MANUAL_WAITING_RECIPIENT':
    case 'AI_WAITING_TOPIC':
      return mode === 'MANUAL' 
        ? 'Who would you like to send the email to?' 
        : 'What is the email about? (State the topic or main message)';
    case 'MANUAL_WAITING_SUBJECT':
      return 'What should the subject be? (Say "generate one" if you want me to write it)';
    case 'MANUAL_WAITING_BODY':
      return 'What would you like the email to say?';
    case 'AI_WAITING_TONE':
      return 'What tone would you like? (e.g. Professional, Friendly, Formal, Casual, Polite, Persuasive, Apologetic)';
    case 'AI_WAITING_SPECIFICS':
      return 'Is there anything important or specific you would like me to include?';
    case 'AI_GENERATING':
      return 'Generating your email draft now...';
    case 'EMAIL_PREVIEW':
      return 'I have prepared the draft. Would you like to edit it, improve it, or send it?';
    case 'SUGGESTION_MODE':
      return 'Select a quick tone optimization or dictate an edit command like "change the subject" or "make it shorter".';
    case 'CONFIRM_SEND':
      return `Everything looks good. Would you like me to send this email to ${draft.recipient}?`;
    case 'SENDING':
      return 'Sending your email...';
    case 'COMPLETE':
      return 'Email successfully sent! Let me know if you need anything else.';
    default:
      return 'How can I assist you with your email?';
  }
}
