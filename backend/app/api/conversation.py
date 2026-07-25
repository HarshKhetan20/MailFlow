from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.repositories.session_repo import SessionRepository
from app.conversation.engine import ConversationEngine
from app.schemas.conversation import StartConversationResponse, ConversationMessageRequest, ConversationMessageResponse, DraftSchema
from app.schemas.response import ApiResponse

router = APIRouter(prefix="/conversation", tags=["Conversation"])

@router.post("/start", response_model=ApiResponse)
def start_conversation(db: Session = Depends(get_db)):
    repo = SessionRepository(db)
    session = repo.create_session("SELECT_COMPOSITION_MODE")
    
    return ApiResponse(
        success=True,
        data={
            "sessionId": session.id,
            "state": session.current_state,
            "message": "Sure. Would you like to dictate the email yourself, or would you like me to compose it for you?"
        }
    )

@router.post("/message", response_model=ApiResponse)
def handle_message(req: ConversationMessageRequest, db: Session = Depends(get_db)):
    repo = SessionRepository(db)
    session = repo.get_session(req.sessionId)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    draft_model = repo.get_draft(req.sessionId)
    current_draft_dict = {
        "recipient": draft_model.recipient if draft_model else "",
        "subject": draft_model.subject if draft_model else "",
        "body": draft_model.body if draft_model else "",
        "status": draft_model.status if draft_model else "draft",
    }

    assistant_resp, next_state, updated_draft_dict = ConversationEngine.process_message(
        session.current_state, req.message, current_draft_dict
    )

    repo.update_session_state(req.sessionId, next_state)
    repo.update_draft(
        req.sessionId,
        recipient=updated_draft_dict.get("recipient"),
        subject=updated_draft_dict.get("subject"),
        body=updated_draft_dict.get("body"),
        status=updated_draft_dict.get("status")
    )

    return ApiResponse(
        success=True,
        data={
            "assistantResponse": assistant_resp,
            "nextState": next_state,
            "draft": updated_draft_dict
        }
    )
