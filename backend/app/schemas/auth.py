from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field

UserRole = Literal["farmer", "bidder"]


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRole
    phone: Optional[str] = None
    region_or_org: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Optional[UserRole] = None


class GoogleAuthRequest(BaseModel):
    credential: str
    role: UserRole = "farmer"
    demo_email: Optional[EmailStr] = None
    demo_name: Optional[str] = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    role: UserRole
    phone: Optional[str] = None
    region_or_org: Optional[str] = None
    auth_provider: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse