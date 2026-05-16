from sqlalchemy.orm import Session
from app import models, schemas
from datetime import datetime

def get_measurements(db: Session):
    # Consulta todos los registros de la tabla measurements
    return db.query(models.Measurement).all()

def get_measurement(db: Session, measurement_id: int):
    # Consulta un registro por su ID
    return db.query(models.Measurement).filter(
        models.Measurement.id == measurement_id
    ).first()

def create_measurement(db: Session, measurement: schemas.MeasurementCreate):
    # Crea un nuevo registro en la base de datos
    db_measurement = models.Measurement(
        station=measurement.station,
        zone=measurement.zone,
        pollutant=measurement.pollutant,
        value=measurement.value,
        unit=measurement.unit,
        timestamp=measurement.timestamp or datetime.utcnow()
    )
    db.add(db_measurement)       # Agrega el objeto a la sesión
    db.commit()                  # Guarda los cambios en la BD
    db.refresh(db_measurement)   # Actualiza el objeto con los datos de la BD (como el ID)
    return db_measurement

def delete_measurement(db: Session, measurement_id: int):
    # Busca y elimina un registro por ID
    db_measurement = get_measurement(db, measurement_id)
    if db_measurement:
        db.delete(db_measurement)
        db.commit()
    return db_measurement
