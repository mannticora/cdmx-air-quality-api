from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/measurements",
    tags=["measurements"]
)

@router.get("/", response_model=List[schemas.MeasurementResponse])
def get_measurements(
    zone: Optional[str] = Query(None, description="Filtrar por zona (Norte, Sur, Centro, Oriente, Poniente)"),
    pollutant: Optional[str] = Query(None, description="Filtrar por contaminante (o3, pm25, no2, co)"),
    start: Optional[datetime] = Query(None, description="Fecha inicio (YYYY-MM-DDTHH:MM:SS)"),
    end: Optional[datetime] = Query(None, description="Fecha fin (YYYY-MM-DDTHH:MM:SS)"),
    db: Session = Depends(get_db)
):
    # Devuelve mediciones con filtros opcionales
    return crud.get_measurements(db, zone=zone, pollutant=pollutant, start=start, end=end)

@router.get("/{measurement_id}", response_model=schemas.MeasurementResponse)
def get_measurement(measurement_id: int, db: Session = Depends(get_db)):
    measurement = crud.get_measurement(db, measurement_id)
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return measurement

@router.post("/", response_model=schemas.MeasurementResponse)
def create_measurement(measurement: schemas.MeasurementCreate, db: Session = Depends(get_db)):
    return crud.create_measurement(db, measurement)

@router.delete("/{measurement_id}")
def delete_measurement(measurement_id: int, db: Session = Depends(get_db)):
    measurement = crud.delete_measurement(db, measurement_id)
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return {"message": "Measurement deleted successfully"}
