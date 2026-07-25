import { create } from 'zustand';
import type { ConversationMessage, EngineState, CompositionMode } from '../types/conversation';

interface ConversationStore {
  currentState: EngineState;
  mode: CompositionMode | null;
  currentQuestion: string;
  messages: ConversationMessage[];
  errorMessage: string | null;
  setCurrentState: (state: EngineState) => void;
  setMode: (mode: CompositionMode | null) => void;
  addMessage: (role: 'user' | 'assistant', text: string, state: EngineState) => void;
  setErrorMessage: (msg: string | null) => void;
  startConversation: () => void;
  resetConversation: () => void;
}

const INITIAL_MESSAGES: ConversationMessage[] = [
  {
    id: 'init-1',
    role: 'assistant',
    text: 'Hello! I am your MailFlow AI Agent. Tap the microphone and say "Send an email" to get started.',
    timestamp: new Date().toISOString(),
    state: 'IDLE',
  },
];

export const useConversationStore = create<ConversationStore>((set) => ({
  currentState: 'IDLE',
  mode: null,
  currentQuestion: 'How can I assist you with your email today?',
  messages: INITIAL_MESSAGES,
  errorMessage: null,

  setCurrentState: (currentState) => set({ currentState }),
  setMode: (mode) => set({ mode }),

  addMessage: (role, text, state) =>
    set((prev) => ({
      messages: [
        ...prev.messages,
        {
          id: Math.random().toString(36).substring(2, 9),
          role,
          text,
          timestamp: new Date().toISOString(),
          state,
        },
      ],
    })),

  setErrorMessage: (errorMessage) => set({ errorMessage }),

  startConversation: () => {
    const prompt = 'Sure. Would you like to dictate the email yourself, or would you like me to compose it for you?';
    set((prev) => ({
      currentState: 'SELECT_COMPOSITION_MODE',
      errorMessage: null,
      messages: [
        ...prev.messages,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          text: prompt,
          timestamp: new Date().toISOString(),
          state: 'SELECT_COMPOSITION_MODE',
        },
      ],
    }));
  },

  resetConversation: () =>
    set({
      currentState: 'IDLE',
      mode: null,
      currentQuestion: 'How can I assist you with your email today?',
      messages: INITIAL_MESSAGES,
      errorMessage: null,
    }),
}));
