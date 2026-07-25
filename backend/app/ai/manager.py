from app.ai.intent_analyzer import IntentAnalyzer, IntentType
from app.ai.email_composer import EmailComposerAI
from app.ai.rewrite_engine import RewriteEngine
from app.ai.subject_generator import SubjectGenerator
from app.ai.validation_layer import ValidationLayer

class AILayerManager:
    @staticmethod
    def analyze_intent(text: str, current_state: str) -> IntentType:
        return IntentAnalyzer.analyze(text, current_state)

    @staticmethod
    async def compose_email(recipient: str, topic: str, tone: str, specifics: str = None) -> tuple[str, str]:
        return await EmailComposerAI.compose(recipient, topic, tone, specifics)

    @staticmethod
    def rewrite_draft(current_body: str, suggestion_or_edit: str) -> str:
        return RewriteEngine.apply_section_or_tone_edit(current_body, suggestion_or_edit)

    @staticmethod
    def validate(recipient: str, subject: str, body: str) -> tuple[bool, str | None]:
        return ValidationLayer.validate_draft(recipient, subject, body)
