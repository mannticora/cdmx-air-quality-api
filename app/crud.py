from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from datetime import datetime
from typing import Optional

def get_measurements(
    db: Session,
    zone: Optional[str] = None,
    pollutant: Optional[str] = None,
    station: Optional[str] = None,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    page: int = 1,
    limit: int = 50
):
    # Inicia la consulta base
    query = db.query(models.Measurement)

    # Aplica filtros solo si fueron enviados
    if zone:
        query = query.filter(models.Measurement.zone == zone)
    if station:
        query = query.filter(models.Measurement.station == station)
    if pollutant:
        query = query.filter(models.Measurement.pollutant == pollutant)
    if start:
        query = query.filter(models.Measurement.timestamp >= start)
    if end:
        query = query.filter(models.Measurement.timestamp <= end)

    # Aplica paginación
    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()

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
    # Límites OMS y NOM por contaminante
    limits = {
        "o3":   {"unit": "ppb",    "who": 51,   "nom": 95},
        "pm25": {"unit": "µg/m³",  "who": 15,   "nom": 45},
        "pm10": {"unit": "µg/m³",  "who": 45,   "nom": 120},
        "no2":  {"unit": "ppb",    "who": 13,   "nom": 210},
        "co":   {"unit": "ppm",    "who": 4,    "nom": 11},
        "so2":  {"unit": "ppb",    "who": 40,   "nom": 200},
    }

    alerts = []
    for pollutant, info in limits.items():
        results = db.query(models.Measurement).filter(
            models.Measurement.pollutant == pollutant,
            models.Measurement.value > info["who"]
        ).limit(50).all()

        for r in results:
            exceeds_nom = r.value > info["nom"]
            alerts.append({
                "id": r.id,
                "station": r.station,
                "zone": r.zone,
                "pollutant": r.pollutant,
                "value": r.value,
                "unit": info["unit"],
                "limit_who": info["who"],
                "limit_nom": info["nom"],
                "exceeded_by_who": round(r.value - info["who"], 2),
                "exceeds_nom": exceeds_nom,
                "exceeded_by_nom": round(r.value - info["nom"], 2) if exceeds_nom else 0,
                "timestamp": r.timestamp
            })

    return alerts

def update_measurement(db: Session, measurement_id: int, measurement: schemas.MeasurementCreate):
    # Busca la medición existente
    db_measurement = db.query(models.Measurement).filter(
    models.Measurement.id == measurement_id
).first()
    if not db_measurement:
        return None
    
    # Actualiza los campos
    db_measurement.station = measurement.station
    db_measurement.zone = measurement.zone
    db_measurement.pollutant = measurement.pollutant
    db_measurement.value = measurement.value
    db_measurement.unit = measurement.unit
    if measurement.timestamp:
        db_measurement.timestamp = measurement.timestamp
    
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

def get_stats_by_zone(db: Session):
    # Calcula promedio por zona y contaminante
    results = db.query(
        models.Measurement.zone,
        models.Measurement.pollutant,
        func.avg(models.Measurement.value).label("average"),
        func.max(models.Measurement.value).label("maximum"),
        func.min(models.Measurement.value).label("minimum"),
        func.count(models.Measurement.id).label("total")
    ).group_by(
        models.Measurement.zone,
        models.Measurement.pollutant
    ).order_by(
        models.Measurement.zone,
        models.Measurement.pollutant
    ).all()

    return [
        {
            "zone": r.zone,
            "pollutant": r.pollutant,
            "average": round(r.average, 2),
            "maximum": r.maximum,
            "minimum": r.minimum,
            "total_measurements": r.total
        }
        for r in results
    ]
