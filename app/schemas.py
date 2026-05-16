from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MeasurementCreate(BaseModel):
    station: str
    zone: str
    pollutant: str
    value: float
    unit: str
    timestamp: Optional[datetime] = None

class MeasurementResponse(BaseModel):
    id: int
    station: str
    zone: str
    pollutant: str
    value: float
    unit: str
    timestamp: datetime

    class Config:
        from_attributes = True
