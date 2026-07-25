import { useDraftStore } from '../store/draftStore';
import type { ToneType } from '../types/draft';
import { applyToneRefinement } from '../services/suggestionService';

export function useDraft() {
  const draftStore = useDraftStore();

  const applyTone = async (tone: ToneType) => {
    const updated = await applyToneRefinement(draftStore.draft.body, tone);
    draftStore.setDraft({ body: updated, tone });
    draftStore.addSuggestionApplied(tone);
  };

  return {
    ...draftStore,
    applyTone,
  };
}
