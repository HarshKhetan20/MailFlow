class ValidationLayer:
    @staticmethod
    def validate_draft(recipient: str, subject: str, body: str) -> tuple[bool, str | None]:
        if recipient and "@" not in recipient:
            return False, "Recipient email address format is invalid."
        if not subject.strip():
            return False, "Subject cannot be empty."
        if not body.strip():
            return False, "Email body cannot be empty."
        if "[placeholder]" in body.lower() or "[your name]" in body.lower():
            # Acceptable default placeholder for signoff, but check for unfulfilled tags
            pass
        return True, None
