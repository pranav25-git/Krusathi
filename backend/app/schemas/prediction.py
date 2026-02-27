from datetime import date, datetime

from pydantic import BaseModel


class PredictionCreate(BaseModel):
    crop_type: str
    crop_stage: str
    state: str
    district: str
    city: str
    village: str
    temperature: float
    humidity: float
    rainfall: float
    wind_speed: float
    soil_moisture: float
    prediction_date: date


class PredictionResponse(BaseModel):
    id: int
    user_id: int
    crop_type: str
    crop_stage: str
    state: str
    district: str
    city: str
    village: str
    temperature: float
    humidity: float
    rainfall: float
    wind_speed: float
    soil_moisture: float
    prediction_result: str
    confidence_score: float
    prediction_date: date
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class RiskDistribution(BaseModel):
    high: float
    medium: float
    low: float


class ClimateTrendPoint(BaseModel):
    prediction_date: date
    temperature: float
    humidity: float


class PredictionAnalyticsResponse(BaseModel):
    total_predictions: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    avg_temperature: float
    avg_humidity: float
    risk_distribution: RiskDistribution
    climate_trend: list[ClimateTrendPoint]
