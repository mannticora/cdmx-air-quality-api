from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from datetime import datetime
from typing import Optional

def get_measurements(
    db: Session,
    zone: Optional[str] = None,
    pollutant: Optional[str] = None,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None
):
    # Inicia la consulta base
    query = db.query(models.Measurement)

    # Aplica filtros solo si fueron enviados
    if zone:
        query = query.filter(models.Measurement.zone == zone)
    if pollutant:
        query = query.filter(models.Measurement.pollutant == pollutant)
    if start:
        query = query.filter(models.Measurement.timestamp >= start)
    if end:
        query = query.filter(models.Measurement.timestamp <= end)

    return query.all()

def get_measurement(db: Session, measurement_id: int):
    return db.query(models.Measurement).filter(
        models.Measurement.id == measurement_id
    ).first()

def create_measurement(db: Session, measurement: schemas.MeasurementCreate):
    db_measurement = models.Measurement(
        station=measurement.station,
        zone=measurement.zone,
        pollutant=measurement.pollutant,
        value=measurement.value,
        unit=measurement.unit,
        timestamp=measurement.timestamp or datetime.utcnow()
    )
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

def delete_measurement(db: Session, measurement_id: int):
    db_measurement = get_measurement(db, measurement_id)
    if db_measurement:
        db.delete(db_measurement)
        db.commit()
    return db_measurement

def get_stats_summary(db: Session):
    # Calcula promedio, max y min agrupado por contaminante
    results = db.query(
        models.Measurement.pollutant,
        func.avg(models.Measurement.value).label("average"),
        func.max(models.Measurement.value).label("maximum"),
        func.min(models.Measurement.value).label("minimum"),
        func.count(models.Measurement.id).label("total")
    ).group_by(models.Measurement.pollutant).all()

    return [
        {
            "pollutant": r.pollutant,
            "average": round(r.average, 2),
            "maximum": r.maximum,
            "minimum": r.minimum,
            "total_measurements": r.total
        }
        for r in results
    ]

def get_alerts(db: Session):
    # Límites de la OMS para contaminantes (µg/m³)
    limits = {
        "o3": 100,
        "pm25": 15,
        "no2": 25,
        "co": 4000
    }

    alerts = []
    for pollutant, limit in limits.items():
        results = db.query(models.Measurement).filter(
            models.Measurement.pollutant == pollutant,
            models.Measurement.value > limit
        ).all()
        for r in results:
            alerts.append({
                "id": r.id,
                "station": r.station,
                "zone": r.zone,
                "pollutant": r.pollutant,
                "value": r.value,
                "limit_who": limit,
                "exceeded_by": round(r.value - limit, 2),
                "timestamp": r.timestamp
            })

    return alerts
