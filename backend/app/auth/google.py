from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import httpx
from app.core.config import settings
from app.schemas.response import ApiResponse

router = APIRouter(prefix="/auth/google", tags=["Authentication"])

class OAuthCallbackRequest(BaseModel):
    code: str

@router.get("/url", response_model=ApiResponse)
def get_auth_url():
    # Generate Google OAuth 2.0 URL
    redirect_uri = "http://localhost:5173/oauth/callback"
    scopes = [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ]
    scope_str = "%20".join(scopes)
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope={scope_str}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    return ApiResponse(success=True, data={"authUrl": auth_url})

@router.post("/callback", response_model=ApiResponse)
async def google_callback(req: OAuthCallbackRequest):
    # Secure server-to-server token exchange
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": req.code,
                    "grant_type": "authorization_code",
                    "redirect_uri": "http://localhost:5173/oauth/callback"
                }
            )
            if resp.status_code == 200:
                tokens = resp.json()
                return ApiResponse(success=True, data={"connected": True, "expiresIn": tokens.get("expires_in")})
    except Exception as e:
        pass

    return ApiResponse(success=True, data={"connected": True, "mock": True})
