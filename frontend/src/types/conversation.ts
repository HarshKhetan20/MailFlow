export type CompositionMode = 'MANUAL' | 'AI_COMPOSER';

export type EngineState =
  | 'IDLE'
  | 'SELECT_COMPOSITION_MODE'
  | 'MANUAL_WAITING_RECIPIENT'
  | 'CONFIRM_RECIPIENT'
  | 'MANUAL_WAITING_SUBJECT'
  | 'MANUAL_WAITING_BODY'
  | 'AI_WAITING_TOPIC'
  | 'AI_WAITING_TONE'
  | 'AI_WAITING_SPECIFICS'
  | 'AI_GENERATING'
  | 'EMAIL_PREVIEW'
  | 'SUGGESTION_MODE'
  | 'CONFIRM_SEND'
  | 'SENDING'
  | 'COMPLETE';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  state: EngineState;
}

export interface ConversationState {
  currentState: EngineState;
  mode: CompositionMode | null;
  currentQuestion: string;
  messages: ConversationMessage[];
  errorMessage: string | null;
}
