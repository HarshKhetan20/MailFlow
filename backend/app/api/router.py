from fastapi import APIRouter
from app.api import conversation, composer, suggestions, gmail
from app.auth import google

api_router = APIRouter()
api_router.include_router(conversation.router)
api_router.include_router(composer.router)
api_router.include_router(suggestions.router)
api_router.include_router(gmail.router)
api_router.include_router(google.router)
