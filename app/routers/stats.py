from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud
from app.database import get_db
from app.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(
    prefix="/stats",
    tags=["statistics"]
)

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    logger.info("GET /stats/summary requested")
    results = crud.get_stats_summary(db)
    logger.info(f"Summary returned {len(results)} pollutant groups")
    return results

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    logger.info("GET /stats/alerts requested")
    results = crud.get_alerts(db)
    logger.info(f"Alerts returned {len(results)} exceeded measurements")
    return results
