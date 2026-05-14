from fastapi import FastAPI
from app.database import engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CDMX Air Quality API",
    description="API para consultar datos de calidad del aire en la Ciudad de México",
    version="1.0.0"
)

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "CDMX Air Quality API is running"
    }
