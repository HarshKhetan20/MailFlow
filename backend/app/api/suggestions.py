from fastapi import APIRouter
from app.suggestions.service import SuggestionService
from app.schemas.composer import ApplySuggestionRequest
from app.schemas.response import ApiResponse

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])

@router.post("/apply", response_model=ApiResponse)
def apply_suggestion(req: ApplySuggestionRequest):
    updated_body = SuggestionService.apply_suggestion(req.currentBody, req.suggestion)
    return ApiResponse(
        success=True,
        data={
            "updatedBody": updated_body
        }
    )
