from sqlalchemy.orm import Session
from app.models.database import SessionModel, DraftModel

class SessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_session(self, initial_state: str = "SELECT_COMPOSITION_MODE") -> SessionModel:
        session = SessionModel(current_state=initial_state)
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        # Initialize corresponding draft
        draft = DraftModel(session_id=session.id)
        self.db.add(draft)
        self.db.commit()
        
        return session

    def get_session(self, session_id: str) -> SessionModel | None:
        return self.db.query(SessionModel).filter(SessionModel.id == session_id).first()

    def get_draft(self, session_id: str) -> DraftModel | None:
        return self.db.query(DraftModel).filter(DraftModel.session_id == session_id).first()

    def update_session_state(self, session_id: str, new_state: str) -> SessionModel | None:
        session = self.get_session(session_id)
        if session:
            session.current_state = new_state
            self.db.commit()
            self.db.refresh(session)
        return session

    def update_draft(self, session_id: str, recipient: str = None, subject: str = None, body: str = None, status: str = None) -> DraftModel | None:
        draft = self.get_draft(session_id)
        if draft:
            if recipient is not None:
                draft.recipient = recipient
            if subject is not None:
                draft.subject = subject
            if body is not None:
                draft.body = body
            if status is not None:
                draft.status = status
            self.db.commit()
            self.db.refresh(draft)
        return draft
