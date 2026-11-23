from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    role = Column(String(20), nullable=False, default="farmer")  # "farmer" | "bidder"
    region_or_org = Column(String(150), nullable=True)
    hashed_password = Column(String(255), nullable=True)
    auth_provider = Column(String(20), nullable=False, default="local")  # "local" | "google"
    google_sub = Column(String(255), unique=True, nullable=True)
    redeemed_points = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))