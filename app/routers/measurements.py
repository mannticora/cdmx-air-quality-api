from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db

router = APIRouter(
    prefix="/measurements",
    tags=["measurements"]
)

@router.get("/", response_model=List[schemas.MeasurementResponse])
def get_measurements(db: Session = Depends(get_db)):
    # Devuelve todas las mediciones
    return crud.get_measurements(db)

@router.get("/{measurement_id}", response_model=schemas.MeasurementResponse)
def get_measurement(measurement_id: int, db: Session = Depends(get_db)):
    # Busca una medición por ID
    measurement = crud.get_measurement(db, measurement_id)
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return measurement

@router.post("/", response_model=schemas.MeasurementResponse)
def create_measurement(measurement: schemas.MeasurementCreate, db: Session = Depends(get_db)):
    # Crea una nueva medición
    return crud.create_measurement(db, measurement)

@router.delete("/{measurement_id}")
def delete_measurement(measurement_id: int, db: Session = Depends(get_db)):
    # Elimina una medición por ID
    measurement = crud.delete_measurement(db, measurement_id)
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return {"message": "Measurement deleted successfully"}
