import os
from fastapi import FastAPI
from dotenv import load_dotenv
from app.database import engine
from app import models
from app.routers import measurements, stats

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=os.getenv("APP_TITLE", "CDMX Air Quality API"),
    description="API para consultar datos de calidad del aire en la Ciudad de México",
    version=os.getenv("APP_VERSION", "1.0.0")
)

app.include_router(measurements.router)
app.include_router(stats.router)

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "CDMX Air Quality API is running",
        "version": os.getenv("APP_VERSION", "1.0.0")
    }
