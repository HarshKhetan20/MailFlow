import { useConversationStore } from '../store/conversationStore';
import { useDraftStore } from '../store/draftStore';
import { useVoiceStore } from '../store/voiceStore';
import type { EngineState, CompositionMode } from '../types/conversation';
import { generateDraftWithAI } from '../services/composerService';
import { isValidEmail, parseSpokenEmail } from '../engine/conversationMachine';

export function useConversation() {
  const conversation = useConversationStore();
  const draftStore = useDraftStore();
  const voiceStore = useVoiceStore();

  const transitionTo = (nextState: EngineState) => {
    conversation.setCurrentState(nextState);
  };

  const selectMode = (mode: CompositionMode) => {
    conversation.setMode(mode);
    const nextState = 'MANUAL_WAITING_RECIPIENT';
    conversation.setCurrentState(nextState);
    conversation.addMessage('assistant', 'Who would you like to send the email to?', nextState);
  };

  const handleUserInput = async (input: string) => {
    const text = input.trim();
    if (!text) return;

    conversation.addMessage('user', text, conversation.currentState);

    switch (conversation.currentState) {
      case 'IDLE':
        conversation.setCurrentState('SELECT_COMPOSITION_MODE');
        conversation.addMessage('assistant', 'Sure. Would you like to dictate the email yourself, or would you like me to compose it for you?', 'SELECT_COMPOSITION_MODE');
        break;

      case 'SELECT_COMPOSITION_MODE':
        if (text.toLowerCase().includes('manual') || text.toLowerCase().includes('dictate')) {
          selectMode('MANUAL');
        } else {
          selectMode('AI_COMPOSER');
        }
        break;

      case 'MANUAL_WAITING_RECIPIENT': {
        const parsed = parseSpokenEmail(text);
        if (isValidEmail(parsed)) {
          draftStore.updateField('recipient', parsed);
          transitionTo('CONFIRM_RECIPIENT');
          conversation.addMessage('assistant', `Is the recipient email "${parsed}" correct?`, 'CONFIRM_RECIPIENT');
        } else {
          conversation.addMessage('assistant', "That doesn't appear to be a valid email address. Could you repeat or speak a valid email address?", 'MANUAL_WAITING_RECIPIENT');
        }
        break;
      }

      case 'CONFIRM_RECIPIENT': {
        const lower = text.toLowerCase();
        if (lower.includes('yes') || lower.includes('correct') || lower.includes('sure') || lower.includes('right') || lower.includes('ok') || lower.includes('yeah')) {
          if (conversation.mode === 'AI_COMPOSER') {
            transitionTo('AI_WAITING_TOPIC');
            conversation.addMessage('assistant', 'What is the email about?', 'AI_WAITING_TOPIC');
          } else {
            transitionTo('MANUAL_WAITING_SUBJECT');
            conversation.addMessage('assistant', 'What should the subject be?', 'MANUAL_WAITING_SUBJECT');
          }
        } else {
          draftStore.updateField('recipient', '');
          transitionTo('MANUAL_WAITING_RECIPIENT');
          conversation.addMessage('assistant', 'No problem. Who would you like to send the email to?', 'MANUAL_WAITING_RECIPIENT');
        }
        break;
      }

      case 'MANUAL_WAITING_SUBJECT':
        draftStore.updateField('subject', text);
        transitionTo('MANUAL_WAITING_BODY');
        conversation.addMessage('assistant', 'What would you like the email to say?', 'MANUAL_WAITING_BODY');
        break;

      case 'MANUAL_WAITING_BODY':
        draftStore.updateField('body', text);
        draftStore.setSendStatus('Ready for Review');
        transitionTo('EMAIL_PREVIEW');
        conversation.addMessage('assistant', 'I have prepared the draft. Would you like to edit it, improve it, or send it?', 'EMAIL_PREVIEW');
        break;

      case 'AI_WAITING_TOPIC':
        draftStore.updateField('topic', text);
        transitionTo('AI_WAITING_TONE');
        conversation.addMessage('assistant', 'What tone would you like? (e.g. Professional, Friendly, Formal)', 'AI_WAITING_TONE');
        break;

      case 'AI_WAITING_TONE':
        draftStore.updateField('tone', text);
        transitionTo('AI_WAITING_SPECIFICS');
        conversation.addMessage('assistant', 'Is there anything specific or important you would like me to include?', 'AI_WAITING_SPECIFICS');
        break;

      case 'AI_WAITING_SPECIFICS':
        draftStore.updateField('specifics', text);
        transitionTo('AI_GENERATING');
        voiceStore.setVoiceMode('Processing');
        conversation.addMessage('assistant', 'Generating your email draft...', 'AI_GENERATING');
        
        const generated = await generateDraftWithAI(draftStore.draft.topic || 'Update', draftStore.draft.tone || 'Professional', text);
        draftStore.setDraft({ subject: generated.subject, body: generated.body, sendStatus: 'Ready for Review' });
        
        voiceStore.setVoiceMode('Idle');
        transitionTo('EMAIL_PREVIEW');
        conversation.addMessage('assistant', 'I have generated your draft. Would you like to edit it, improve it, or send it?', 'EMAIL_PREVIEW');
        break;

      case 'EMAIL_PREVIEW':
      case 'SUGGESTION_MODE':
        if (text.toLowerCase().includes('send')) {
          transitionTo('CONFIRM_SEND');
          draftStore.setSendStatus('Ready to Send');
          conversation.addMessage('assistant', `Everything looks good. Would you like me to send this email now?`, 'CONFIRM_SEND');
        } else {
          draftStore.updateField('body', draftStore.draft.body + `\n${text}`);
          conversation.addMessage('assistant', 'Updated draft with your input.', 'EMAIL_PREVIEW');
        }
        break;

      case 'CONFIRM_SEND':
        if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('send') || text.toLowerCase().includes('sure')) {
          transitionTo('SENDING');
          draftStore.setSendStatus('Sending');
          conversation.addMessage('assistant', 'Sending your email via Gmail...', 'SENDING');
          setTimeout(() => {
            transitionTo('COMPLETE');
            draftStore.setSendStatus('Sent');
            conversation.addMessage('assistant', 'Email successfully sent!', 'COMPLETE');
          }, 1200);
        } else {
          transitionTo('EMAIL_PREVIEW');
          draftStore.setSendStatus('Ready for Review');
          conversation.addMessage('assistant', 'Sending cancelled. What would you like to modify?', 'EMAIL_PREVIEW');
        }
        break;
    }
  };

  return {
    ...conversation,
    startConversation: conversation.startConversation,
    selectMode,
    handleUserInput,
  };
}
