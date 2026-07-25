import re

class SubjectGenerator:
    @staticmethod
    def generate(topic: str, body: str = "") -> str:
        clean_topic = topic.strip().capitalize()
        if not clean_topic:
            clean_topic = "Important Update"
            
        # Ensure sentence case, 3-10 words, no clickbait or excessive punctuation
        clean_topic = re.sub(r'[!?:;]', '', clean_topic)
        words = clean_topic.split()
        
        if len(words) < 2:
            return f"Regarding: {clean_topic}"
        elif len(words) > 10:
            return " ".join(words[:8]) + "..."
            
        return clean_topic
