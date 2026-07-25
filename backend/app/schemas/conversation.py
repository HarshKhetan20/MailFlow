from pydantic import BaseModel
from typing import Optional

class StartConversationResponse(BaseModel):
    sessionId: str
    state: str
    message: str

class ConversationMessageRequest(BaseModel):
    sessionId: str
    message: str

class DraftSchema(BaseModel):
    recipient: str = ""
    subject: str = ""
    body: str = ""
    status: str = "draft"

class ConversationMessageResponse(BaseModel):
    assistantResponse: str
    nextState: str
    draft: DraftSchema
