from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from ..database import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    crop_type = Column(String, nullable=False)
    crop_stage = Column(String, nullable=False)

    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    city = Column(String, nullable=False)
    village = Column(String, nullable=False)

    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    soil_moisture = Column(Float, nullable=False)

    prediction_result = Column(String, nullable=False)
    confidence_score = Column(Float, nullable=False)

    prediction_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="prediction_history")
