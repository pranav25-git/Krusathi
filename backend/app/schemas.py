from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    created_at: datetime | None = None

    class Config:
        from_attributes = True
