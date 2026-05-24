from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import crud, schemas
from app.database import get_db
from app.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(
    prefix="/measurements",
    tags=["measurements"]
)

@router.get("/", response_model=List[schemas.MeasurementResponse])
def get_measurements(
    zone: Optional[str] = Query(None),
    pollutant: Optional[str] = Query(None),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(50, ge=1, le=500, description="Resultados por página (máx 500)"),
    db: Session = Depends(get_db)
):
    logger.info(f"GET /measurements | zone={zone} pollutant={pollutant} page={page} limit={limit}")
    results = crud.get_measurements(db, zone=zone, pollutant=pollutant, start=start, end=end, page=page, limit=limit)
    logger.info(f"Returned {len(results)} measurements")
    return results

@router.post("/", response_model=schemas.MeasurementResponse)
def create_measurement(measurement: schemas.MeasurementCreate, db: Session = Depends(get_db)):
    logger.info(f"POST /measurements | station={measurement.station} pollutant={measurement.pollutant} value={measurement.value}")
    result = crud.create_measurement(db, measurement)
    logger.info(f"Created measurement id={result.id}")
    return result

@router.delete("/{measurement_id}")
def delete_measurement(measurement_id: int, db: Session = Depends(get_db)):
    logger.info(f"DELETE /measurements/{measurement_id}")
    measurement = crud.delete_measurement(db, measurement_id)
    if not measurement:
        logger.warning(f"Measurement {measurement_id} not found for deletion")
        raise HTTPException(status_code=404, detail="Measurement not found")
    logger.info(f"Deleted measurement id={measurement_id}")
    return {"message": "Measurement deleted successfully"}

@router.put("/{measurement_id}", response_model=schemas.MeasurementResponse)
def update_measurement(measurement_id: int, measurement: schemas.MeasurementCreate, db: Session = Depends(get_db)):
    logger.info(f"PUT /measurements/{measurement_id}")
    result = crud.update_measurement(db, measurement_id, measurement)
    if not result:
        logger.warning(f"Measurement {measurement_id} not found for update")
        raise HTTPException(status_code=404, detail="Measurement not found")
    logger.info(f"Updated measurement id={measurement_id}")
    return result
