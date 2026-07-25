import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { ConversationPanel } from '../components/conversation/ConversationPanel';
import { DraftPanel } from '../components/draft/DraftPanel';
import { VoiceBar } from '../components/voice/VoiceBar';
import { useConversation } from '../hooks/useConversation';
import { useDraft } from '../hooks/useDraft';
import { useVoice } from '../hooks/useVoice';
import { AlertCircle, X } from 'lucide-react';

export function HomePage() {
  const conversation = useConversation();
  const draftStore = useDraft();
  const voice = useVoice();

  const [dismissedError, setDismissedError] = useState(false);

  const handleFullReset = () => {
    conversation.resetConversation();
    draftStore.resetDraft();
  };

  const canSend = Boolean(draftStore.draft.recipient && draftStore.draft.subject && draftStore.draft.body);

  return (
    <div className="app-container">
      <Header currentState={conversation.currentState} onReset={handleFullReset} />

      {conversation.errorMessage && !dismissedError && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--accent-rose)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{conversation.errorMessage}</span>
          </div>
          <button onClick={() => setDismissedError(true)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}



      <main className="main-grid">
        <ConversationPanel
          messages={conversation.messages}
          currentState={conversation.currentState}
          isListening={voice.isListening}
          isSpeaking={voice.isSpeaking}
          onStartVoice={() => {
            voice.toggleListen(conversation.handleUserInput);
          }}
        />

        <DraftPanel
          draft={draftStore.draft}
          currentState={conversation.currentState}
          onUpdateDraft={draftStore.updateField}
          onApplyTone={draftStore.applyTone}
        />
      </main>

      <VoiceBar
        isListening={voice.isListening}
        isSpeaking={voice.isSpeaking}
        currentState={conversation.currentState}
        onToggleListen={() => voice.toggleListen(conversation.handleUserInput)}
        onCancel={handleFullReset}
        onConfirmSend={() => conversation.handleUserInput('send')}
        canSend={canSend}
      />
    </div>
  );
}
