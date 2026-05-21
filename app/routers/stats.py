from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud
from app.database import get_db

router = APIRouter(
    prefix="/stats",
    tags=["statistics"]
)

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    # Devuelve promedio, max y min por contaminante
    return crud.get_stats_summary(db)

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    # Devuelve mediciones que superan límites de la OMS
    return crud.get_alerts(db)
