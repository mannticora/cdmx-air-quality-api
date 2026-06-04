import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(measurements.router)
app.include_router(stats.router)

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "CDMX Air Quality API is running",
        "version": os.getenv("APP_VERSION", "1.0.0")
    }

@app.get("/dashboard")
def dashboard():
    return FileResponse("app/static/index.html")
