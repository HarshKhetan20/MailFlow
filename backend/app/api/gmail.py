from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.repositories.session_repo import SessionRepository
from app.gmail.service import GmailService
from app.schemas.response import ApiResponse

router = APIRouter(prefix="/gmail", tags=["Gmail"])

class SendEmailRequest(BaseModel):
    sessionId: str | None = None
    recipient: str | None = None
    subject: str | None = None
    body: str | None = None
    accessToken: str | None = None

@router.post("/send", response_model=ApiResponse)
async def send_email(req: SendEmailRequest, db: Session = Depends(get_db)):
    recipient = req.recipient
    subject = req.subject or ""
    body = req.body or ""

    if req.sessionId:
        repo = SessionRepository(db)
        draft = repo.get_draft(req.sessionId)
        if draft:
            recipient = recipient or draft.recipient
            subject = subject or draft.subject
            body = body or draft.body

    if not recipient or not body:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Draft incomplete or missing recipient")

    result = await GmailService.send_email(
        recipient=recipient,
        subject=subject,
        body=body,
        access_token=req.accessToken
    )

    if req.sessionId:
        repo.update_draft(req.sessionId, status="sent")
        repo.update_session_state(req.sessionId, "COMPLETE")

    return ApiResponse(
        success=True,
        data=result
    )
