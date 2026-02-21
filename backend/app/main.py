import secrets
import traceback

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, SessionLocal, engine

app = FastAPI()

# allow front-end dev origins; change in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    Base.metadata.create_all(bind=engine)
    # Keep existing local DBs compatible by adding auth_token if it does not exist.
    with engine.begin() as conn:
        columns = {col["name"] for col in inspect(conn).get_columns("users")}
        if "auth_token" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN auth_token VARCHAR"))
            conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_auth_token ON users (auth_token)"))
    print("Database tables ready")
except Exception as e:
    print(f"Error creating database tables: {e}")
    traceback.print_exc()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def extract_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    prefix = "Bearer "
    if authorization.startswith(prefix):
        return authorization[len(prefix):].strip()
    return None


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    token = extract_token(authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    db_user = db.query(models.User).filter(models.User.auth_token == token).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return db_user


@app.post("/api/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        normalized_email = user.email.strip()
        existing = db.query(models.User).filter(models.User.email == normalized_email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        db_user = models.User(email=normalized_email, hashed_password=user.password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"id": db_user.id, "email": db_user.email, "created_at": db_user.created_at}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Register error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        normalized_email = user.email.strip()
        db_user = db.query(models.User).filter(models.User.email == normalized_email).first()
        if not db_user or db_user.hashed_password != user.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        new_token = secrets.token_urlsafe(48)
        db_user.auth_token = new_token
        db.commit()
        return {"message": "Login successful", "email": db_user.email, "token": new_token}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/logout")
def logout(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.auth_token = None
    db.commit()
    return {"message": "Logged out"}


@app.get("/api/validate-token")
def validate_token(current_user: models.User = Depends(get_current_user)):
    return {"valid": True, "email": current_user.email}


@app.get("/api/dashboard")
def dashboard_data(current_user: models.User = Depends(get_current_user)):
    return {"message": "Authorized dashboard data", "email": current_user.email}
