import re

class RewriteEngine:
    @staticmethod
    def apply_section_or_tone_edit(current_body: str, instruction: str) -> str:
        t = instruction.strip().lower()
        lines = [l for l in current_body.split("\n") if l.strip()]

        # Section-level targeted edits
        if "rewrite the introduction" in t or "intro" in t:
            if lines:
                lines[0] = "Dear Recipient,\n\nI am following up regarding our previous conversation."
            return "\n\n".join(lines)
            
        elif "replace the closing" in t or "closing" in t:
            if lines:
                lines[-1] = "Thank you for your time and assistance.\n\nBest regards,\nExecutive Assistant"
            return "\n\n".join(lines)
            
        elif "add one paragraph" in t:
            return current_body + "\n\nAdditionally, please review the attached details at your earliest convenience."
            
        elif "remove the last sentence" in t or "remove last paragraph" in t:
            if len(lines) > 1:
                return "\n\n".join(lines[:-1])
            return current_body

        # 10 Supported Tone Refinements
        if "professional" in t:
            return f"Dear Colleague,\n\nI am writing to formally address the following item:\n\n{current_body}\n\nSincerely,\nExecutive Assistant"
        elif "friendly" in t:
            return f"Hi there!\n\nHope you're having a great week! Just wanted to share a quick update:\n\n{current_body}\n\nBest regards,\nExecutive Assistant"
        elif "formal" in t:
            return f"To Whom It May Concern,\n\nPlease accept this correspondence regarding:\n\n{current_body}\n\nRespectfully,\nExecutive Assistant"
        elif "casual" in t:
            return f"Hey,\n\nQuick heads up:\n\n{current_body}\n\nCheers!"
        elif "polite" in t:
            return f"Dear Recipient,\n\nI hope this email finds you well. Would you mind reviewing the message below:\n\n{current_body}\n\nThank you kindly."
        elif "persuasive" in t:
            return f"{current_body}\n\nTaking action on this today will ensure maximum success for our team."
        elif "apologetic" in t:
            return f"Dear Recipient,\n\nI sincerely apologize for any delay or inconvenience. Regarding our topic:\n\n{current_body}\n\nThank you for your patience."
        elif "appreciative" in t:
            return f"Dear Recipient,\n\nThank you so much for your support. I really appreciate your help with:\n\n{current_body}\n\nWith gratitude,"
        elif "concise" in t or "shorten" in t:
            return "\n\n".join(lines[:2]) if lines else current_body
        elif "expand" in t:
            return f"{current_body}\n\nFurthermore, please let me know if you require any additional clarification."
        elif "simplify" in t:
            return current_body.replace("correspondence", "email").replace("furthermore", "also")
        else: # Generic Rewrite
            return f"[Refined Draft]\n\n{current_body}"
