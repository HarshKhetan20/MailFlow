from pydantic import BaseModel, EmailStr
from typing import Optional, Any

class ApiResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    error: Optional[dict] = None

class ErrorDetail(BaseModel):
    code: str
    message: str
