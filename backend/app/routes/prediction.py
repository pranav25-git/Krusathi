import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..deps import get_current_user, get_db

router = APIRouter()


@router.post("/predict", response_model=schemas.PredictionResponse)
def create_prediction(
    payload: schemas.PredictionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.humidity > 70 and payload.rainfall > 50:
        prediction_result = "High"
    elif 40 <= payload.humidity <= 70:
        prediction_result = "Medium"
    else:
        prediction_result = "Low"

    confidence_score = round(random.uniform(0.75, 0.95), 2)

    prediction = models.PredictionHistory(
        user_id=current_user.id,
        crop_type=payload.crop_type,
        crop_stage=payload.crop_stage,
        state=payload.state,
        district=payload.district,
        city=payload.city,
        village=payload.village,
        temperature=payload.temperature,
        humidity=payload.humidity,
        rainfall=payload.rainfall,
        wind_speed=payload.wind_speed,
        soil_moisture=payload.soil_moisture,
        prediction_result=prediction_result,
        confidence_score=confidence_score,
        prediction_date=payload.prediction_date,
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction


@router.get("/predictions/latest", response_model=schemas.PredictionResponse)
def get_latest_prediction(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    latest_prediction = (
        db.query(models.PredictionHistory)
        .filter(models.PredictionHistory.user_id == current_user.id)
        .order_by(models.PredictionHistory.created_at.desc())
        .first()
    )
    if not latest_prediction:
        raise HTTPException(status_code=404, detail="No predictions found")
    return latest_prediction


@router.get("/predictions", response_model=list[schemas.PredictionResponse])
def get_all_predictions(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    predictions = (
        db.query(models.PredictionHistory)
        .filter(models.PredictionHistory.user_id == current_user.id)
        .order_by(models.PredictionHistory.created_at.desc())
        .all()
    )
    return predictions


@router.get("/predictions/{prediction_id}", response_model=schemas.PredictionResponse)
def get_prediction_by_id(
    prediction_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prediction = (
        db.query(models.PredictionHistory)
        .filter(
            models.PredictionHistory.id == prediction_id,
            models.PredictionHistory.user_id == current_user.id,
        )
        .first()
    )
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction


@router.get("/predictions/analytics", response_model=schemas.PredictionAnalyticsResponse)
def get_prediction_analytics(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    aggregate = (
        db.query(
            func.count(models.PredictionHistory.id).label("total_predictions"),
            func.coalesce(
                func.sum(case((models.PredictionHistory.prediction_result == "High", 1), else_=0)),
                0,
            ).label("high_risk_count"),
            func.coalesce(
                func.sum(case((models.PredictionHistory.prediction_result == "Medium", 1), else_=0)),
                0,
            ).label("medium_risk_count"),
            func.coalesce(
                func.sum(case((models.PredictionHistory.prediction_result == "Low", 1), else_=0)),
                0,
            ).label("low_risk_count"),
            func.coalesce(func.avg(models.PredictionHistory.temperature), 0.0).label("avg_temperature"),
            func.coalesce(func.avg(models.PredictionHistory.humidity), 0.0).label("avg_humidity"),
        )
        .filter(models.PredictionHistory.user_id == current_user.id)
        .one()
    )

    total_predictions = int(aggregate.total_predictions or 0)
    high_risk_count = int(aggregate.high_risk_count or 0)
    medium_risk_count = int(aggregate.medium_risk_count or 0)
    low_risk_count = int(aggregate.low_risk_count or 0)
    avg_temperature = round(float(aggregate.avg_temperature or 0.0), 2)
    avg_humidity = round(float(aggregate.avg_humidity or 0.0), 2)

    if total_predictions == 0:
        risk_distribution = {"high": 0.0, "medium": 0.0, "low": 0.0}
    else:
        risk_distribution = {
            "high": round((high_risk_count / total_predictions) * 100, 2),
            "medium": round((medium_risk_count / total_predictions) * 100, 2),
            "low": round((low_risk_count / total_predictions) * 100, 2),
        }

    trend_rows = (
        db.query(
            models.PredictionHistory.prediction_date,
            models.PredictionHistory.temperature,
            models.PredictionHistory.humidity,
        )
        .filter(models.PredictionHistory.user_id == current_user.id)
        .order_by(models.PredictionHistory.prediction_date.asc(), models.PredictionHistory.created_at.asc())
        .all()
    )

    climate_trend = [
        {
            "prediction_date": row.prediction_date,
            "temperature": float(row.temperature),
            "humidity": float(row.humidity),
        }
        for row in trend_rows
    ]

    return {
        "total_predictions": total_predictions,
        "high_risk_count": high_risk_count,
        "medium_risk_count": medium_risk_count,
        "low_risk_count": low_risk_count,
        "avg_temperature": avg_temperature,
        "avg_humidity": avg_humidity,
        "risk_distribution": risk_distribution,
        "climate_trend": climate_trend,
    }
