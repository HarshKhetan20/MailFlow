from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.repositories.session_repo import SessionRepository
from app.gmail.service import GmailService
from app.schemas.response import ApiResponse

router = APIRouter(prefix="/gmail", tags=["Gmail"])

class SendEmailRequest(BaseModel):
    sessionId: str

@router.post("/send", response_model=ApiResponse)
async def send_email(req: SendEmailRequest, db: Session = Depends(get_db)):
    repo = SessionRepository(db)
    draft = repo.get_draft(req.sessionId)
    if not draft or not draft.recipient or not draft.body:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Draft incomplete or missing recipient")

    result = await GmailService.send_email(draft.recipient, draft.subject, draft.body)
    repo.update_draft(req.sessionId, status="sent")
    repo.update_session_state(req.sessionId, "COMPLETE")

    return ApiResponse(
        success=True,
        data=result
    )
