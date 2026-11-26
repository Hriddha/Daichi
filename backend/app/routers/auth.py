from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    GoogleAuthRequest,
    AuthTokenResponse,
    UserResponse,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    verify_google_id_token,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
        )
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/register", response_model=AuthTokenResponse, status_code=201)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="An account with this email already exists."
        )

    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        phone=payload.phone,
        role=payload.role,
        region_or_org=payload.region_or_org
        or ("Bogura Sadar" if payload.role == "farmer" else "Dhaka Wholesale Hub"),
        hashed_password=hash_password(payload.password),
        auth_provider="local",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return AuthTokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=AuthTokenResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials or account uses Google Sign-In.",
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    if payload.role and user.role != payload.role:
        raise HTTPException(
            status_code=403,
            detail=f"This account is registered as a {user.role.capitalize()}. Switch mode to sign in.",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return AuthTokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.post("/google", response_model=AuthTokenResponse)
def google_oauth_login(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        claims = verify_google_id_token(payload.credential)
        email = claims["email"].lower()
        full_name = claims.get("name") or email.split("@")[0]
        google_sub = claims["sub"]
    except Exception as exc:
        raise HTTPException(
            status_code=401,
            detail=f"Google token verification failed: {exc}",
        )

    user = db.query(User).filter(User.email == email).first()

    if user:
        # Enforce role check if user already registered under the opposite role
        if payload.role and user.role != payload.role:
            raise HTTPException(
                status_code=403,
                detail=f"This Google account is already registered as a {user.role.capitalize()}. Switch mode at the top to sign in.",
            )
    else:
        # First-time Google Sign-Up creates a new row in PostgreSQL with the chosen role
        user = User(
            full_name=full_name,
            email=email,
            role=payload.role,
            region_or_org="Bogura Sadar"
            if payload.role == "farmer"
            else "Dhaka Agro Buyers",
            auth_provider="google",
            google_sub=google_sub,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return AuthTokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)