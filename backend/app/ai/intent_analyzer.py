from enum import Enum

class IntentType(str, Enum):
    DICTATE_MANUAL = "DICTATE_MANUAL"
    AI_COMPOSE = "AI_COMPOSE"
    EDIT_DRAFT = "EDIT_DRAFT"
    APPLY_SUGGESTION = "APPLY_SUGGESTION"
    CONFIRM_SEND = "CONFIRM_SEND"
    CANCEL = "CANCEL"
    UNKNOWN = "UNKNOWN"

class IntentAnalyzer:
    @staticmethod
    def analyze(text: str, current_state: str) -> IntentType:
        t = text.strip().lower()
        
        if any(w in t for w in ["cancel", "stop", "reset", "start over"]):
            return IntentType.CANCEL
        if any(w in t for w in ["yes", "confirm", "send email", "send now", "looks good"]) and current_state == "CONFIRM_SEND":
            return IntentType.CONFIRM_SEND
        if any(w in t for w in ["manual", "dictate", "myself"]):
            return IntentType.DICTATE_MANUAL
        if any(w in t for w in ["ai", "compose", "help me write"]):
            return IntentType.AI_COMPOSE
        if any(w in t for w in ["shorten", "professional", "friendly", "formal", "rewrite", "expand", "simplify", "tone"]):
            return IntentType.APPLY_SUGGESTION
        if any(w in t for w in ["change", "edit", "replace", "add", "remove"]):
            return IntentType.EDIT_DRAFT

        return IntentType.UNKNOWN
