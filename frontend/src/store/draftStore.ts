import { create } from 'zustand';
import type { EmailDraft, ToneType, SendStatus } from '../types/draft';

interface DraftStore {
  draft: EmailDraft;
  updateField: (field: keyof EmailDraft, value: string) => void;
  setTone: (tone: ToneType) => void;
  setSendStatus: (status: SendStatus) => void;
  addSuggestionApplied: (suggestion: string) => void;
  setDraft: (newDraft: Partial<EmailDraft>) => void;
  resetDraft: () => void;
}

const INITIAL_DRAFT: EmailDraft = {
  recipient: '',
  subject: '',
  body: '',
  topic: '',
  tone: 'Professional',
  specifics: '',
  aiSuggestionsApplied: [],
  sendStatus: 'Draft',
};

export const useDraftStore = create<DraftStore>((set) => ({
  draft: INITIAL_DRAFT,

  updateField: (field, value) =>
    set((prev) => ({
      draft: { ...prev.draft, [field]: value },
    })),

  setTone: (tone) =>
    set((prev) => ({
      draft: { ...prev.draft, tone },
    })),

  setSendStatus: (sendStatus) =>
    set((prev) => ({
      draft: { ...prev.draft, sendStatus },
    })),

  addSuggestionApplied: (suggestion) =>
    set((prev) => ({
      draft: {
        ...prev.draft,
        aiSuggestionsApplied: [...prev.draft.aiSuggestionsApplied, suggestion],
      },
    })),

  setDraft: (newDraft) =>
    set((prev) => ({
      draft: { ...prev.draft, ...newDraft },
    })),

  resetDraft: () => set({ draft: INITIAL_DRAFT }),
}));
