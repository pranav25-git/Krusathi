from datetime import datetime

from pydantic import BaseModel


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
