import re

def is_valid_email(email: str) -> bool:
    cleaned = email.strip().lower()
    cleaned = re.sub(r'\s+at\s+', '@', cleaned)
    cleaned = re.sub(r'\s+dot\s+', '.', cleaned)
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return bool(re.match(email_regex, cleaned))

def parse_spoken_email(spoken: str) -> str:
    cleaned = spoken.strip().lower()
    cleaned = re.sub(r'\s+at\s+', '@', cleaned)
    cleaned = re.sub(r'\s+dot\s+', '.', cleaned)
    return re.sub(r'\s+', '', cleaned)

class ConversationEngine:
    @staticmethod
    def process_message(current_state: str, user_input: str, current_draft: dict) -> tuple[str, str, dict]:
        text = user_input.strip()
        lower = text.lower()
        next_state = current_state
        updated_draft = dict(current_draft)

        if current_state == "IDLE" or current_state == "START_CONVERSATION":
            next_state = "SELECT_COMPOSITION_MODE"
            response = "Sure. Would you like to dictate the email yourself, or would you like me to compose it for you?"

        elif current_state == "SELECT_COMPOSITION_MODE":
            next_state = "MANUAL_WAITING_RECIPIENT"
            response = "Who would you like to send the email to?"

        elif current_state == "MANUAL_WAITING_RECIPIENT":
            parsed = parse_spoken_email(text)
            if is_valid_email(parsed):
                updated_draft["recipient"] = parsed
                if updated_draft.get("mode") == "AI_COMPOSER":
                    next_state = "AI_WAITING_TOPIC"
                    response = "What is the email about?"
                else:
                    next_state = "MANUAL_WAITING_SUBJECT"
                    response = "What should the subject be?"
            else:
                response = "That doesn't appear to be a valid email address. Could you repeat it?"

        elif current_state == "MANUAL_WAITING_SUBJECT":
            updated_draft["subject"] = text
            next_state = "MANUAL_WAITING_BODY"
            response = "What would you like the email to say?"

        elif current_state == "MANUAL_WAITING_BODY":
            updated_draft["body"] = text
            updated_draft["status"] = "review"
            next_state = "EMAIL_PREVIEW"
            response = "I've prepared the draft. Would you like to edit it, improve it, or send it?"

        elif current_state == "AI_WAITING_TOPIC":
            updated_draft["topic"] = text
            next_state = "AI_WAITING_TONE"
            response = "What tone would you like? (e.g. Professional, Friendly, Formal)"

        elif current_state == "AI_WAITING_TONE":
            updated_draft["tone"] = text
            next_state = "AI_WAITING_SPECIFICS"
            response = "Is there anything important or specific you'd like me to include?"

        elif current_state == "AI_WAITING_SPECIFICS":
            updated_draft["specifics"] = text
            topic = updated_draft.get("topic", "Update")
            tone = updated_draft.get("tone", "Professional")
            updated_draft["subject"] = f"Regarding: {topic}"
            updated_draft["body"] = f"Dear Recipient,\n\nI am writing to discuss {topic} in a {tone} tone. {text}\n\nBest regards,\n[Your Name]"
            updated_draft["status"] = "review"
            next_state = "EMAIL_PREVIEW"
            response = "I have generated your email draft. Would you like to edit it, improve it, or send it?"

        elif current_state in ["EMAIL_PREVIEW", "SUGGESTION_MODE"]:
            if "send" in lower:
                next_state = "CONFIRM_SEND"
                updated_draft["status"] = "ready"
                response = f"Everything looks good. Would you like me to send this email to {updated_draft.get('recipient', 'the recipient')} now?"
            else:
                updated_draft["body"] += f"\n{text}"
                response = "Updated draft with your input. Would you like to refine it further or send it?"

        elif current_state == "CONFIRM_SEND":
            if any(k in lower for k in ["yes", "send", "sure", "ok", "confirm"]):
                next_state = "SENDING"
                updated_draft["status"] = "sent"
                response = "Sending your email via Gmail..."
            else:
                next_state = "EMAIL_PREVIEW"
                updated_draft["status"] = "review"
                response = "Sending cancelled. What would you like to modify?"

        else:
            response = "How can I assist you with your email?"

        return response, next_state, updated_draft
