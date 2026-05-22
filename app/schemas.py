from pydantic import BaseModel, ConfigDict
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
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    station: str
    zone: str
    pollutant: str
    value: float
    unit: str
    timestamp: datetime
