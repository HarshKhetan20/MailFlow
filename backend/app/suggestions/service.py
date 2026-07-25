from app.ai.manager import AILayerManager

class SuggestionService:
    @staticmethod
    def apply_suggestion(current_body: str, suggestion: str) -> str:
        return AILayerManager.rewrite_draft(current_body, suggestion)
