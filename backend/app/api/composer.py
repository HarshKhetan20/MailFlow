from fastapi import APIRouter
from app.composer.service import ComposerService
from app.schemas.composer import GenerateEmailRequest, GenerateEmailResponse
from app.schemas.response import ApiResponse

router = APIRouter(prefix="/composer", tags=["Composer"])

@router.post("/generate", response_model=ApiResponse)
async def generate_email(req: GenerateEmailRequest):
    subject, body = await ComposerService.generate_email(req.topic, req.tone, req.specifics)
    return ApiResponse(
        success=True,
        data={
            "subject": subject,
            "body": body
        }
    )
