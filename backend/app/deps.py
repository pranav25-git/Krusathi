from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from . import models
from .database import SessionLocal


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
