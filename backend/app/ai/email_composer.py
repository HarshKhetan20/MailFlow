import json
import httpx
from app.core.config import settings
from app.ai.prompts.templates import SYSTEM_PROMPT_COMPOSER, USER_PROMPT_COMPOSER_TEMPLATE
from app.ai.subject_generator import SubjectGenerator

class EmailComposerAI:
    @staticmethod
    async def compose(recipient: str, topic: str, tone: str, specifics: str = None) -> tuple[str, str]:
        # Version-controlled prompt compilation
        user_prompt = USER_PROMPT_COMPOSER_TEMPLATE.format(
            recipient=recipient or "Unspecified",
            topic=topic,
            tone=tone,
            specifics=specifics or "None"
        )

        if settings.OPENAI_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": "gpt-4o-mini",
                            "messages": [
                                {"role": "system", "content": SYSTEM_PROMPT_COMPOSER},
                                {"role": "user", "content": user_prompt}
                            ],
                            "response_format": {"type": "json_object"}
                        }
                    )
                    if resp.status_code == 200:
                        content = resp.json()["choices"][0]["message"]["content"]
                        parsed = json.loads(content)
                        subject = SubjectGenerator.generate(parsed.get("subject", topic))
                        body = parsed.get("body", "")
                        return subject, body
            except Exception:
                pass

        # Robust Fallback Generation
        subject = SubjectGenerator.generate(f"Regarding: {topic}")
        body = (
            f"Dear Recipient,\n\n"
            f"I am writing to discuss {topic} in a {tone} tone.\n"
            f"{f'Additional details: {specifics}' if specifics else 'Please let me know your availability to connect.'}\n\n"
            f"Best regards,\nExecutive Assistant"
        )
        return subject, body
