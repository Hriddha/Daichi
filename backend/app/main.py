from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models import user  # Registers User model before create_all
from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Daichi AgriCore API",
    description="Direct Farmer-to-Buyer Marketplace, Deterministic Finance Ledger & Crop AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": "postgresql"}