from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    auth_token = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    prediction_history = relationship(
        "PredictionHistory",
        back_populates="user",
        cascade="all, delete-orphan",
    )
