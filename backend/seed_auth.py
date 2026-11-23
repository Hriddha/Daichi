from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.core.security import hash_password


def seed_users():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "hriddha.farmer@gmail.com").first():
            db.add(
                User(
                    full_name="Hriddha Pratim Saha",
                    email="hriddha.farmer@gmail.com",
                    role="farmer",
                    region_or_org="Bogura Sadar",
                    hashed_password=hash_password("farmer123"),
                    auth_provider="local",
                )
            )
        if not db.query(User).filter(User.email == "dhaka.agro.buyer@gmail.com").first():
            db.add(
                User(
                    full_name="Dhaka Agro Wholesalers",
                    email="dhaka.agro.buyer@gmail.com",
                    role="bidder",
                    region_or_org="Karwan Bazar, Dhaka",
                    hashed_password=hash_password("bidder123"),
                    auth_provider="local",
                )
            )
        db.commit()
        print("Seeded PostgreSQL users:")
        print("  Farmer -> hriddha.farmer@gmail.com / farmer123")
        print("  Bidder -> dhaka.agro.buyer@gmail.com / bidder123")
    finally:
        db.close()


if __name__ == "__main__":
    seed_users()