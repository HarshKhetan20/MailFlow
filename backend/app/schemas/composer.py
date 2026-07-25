from pydantic import BaseModel
from typing import Optional

class GenerateEmailRequest(BaseModel):
    topic: str
    tone: str
    specifics: Optional[str] = None

class GenerateEmailResponse(BaseModel):
    subject: str
    body: str

class ApplySuggestionRequest(BaseModel):
    currentBody: str
    suggestion: str # Professional, Friendly, Formal, Concise, Expand, Grammar, Rewrite, Simplify, Persuasive

class ApplySuggestionResponse(BaseModel):
    updatedBody: str
