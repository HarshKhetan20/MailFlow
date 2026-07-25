export type ToneType =
  | 'Professional'
  | 'Friendly'
  | 'Formal'
  | 'Casual'
  | 'Polite'
  | 'Persuasive'
  | 'Apologetic';

export type SendStatus = 'Draft' | 'Ready for Review' | 'Ready to Send' | 'Sending' | 'Sent';

export interface EmailDraft {
  recipient: string;
  subject: string;
  body: string;
  topic?: string;
  tone?: ToneType;
  specifics?: string;
  aiSuggestionsApplied: string[];
  sendStatus: SendStatus;
}
