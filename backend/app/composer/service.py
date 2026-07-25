from app.ai.manager import AILayerManager

class ComposerService:
    @staticmethod
    async def generate_email(topic: str, tone: str, specifics: str = None) -> tuple[str, str]:
        return await AILayerManager.compose_email("", topic, tone, specifics)
