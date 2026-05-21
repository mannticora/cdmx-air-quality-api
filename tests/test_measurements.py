import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    # Verifica que la API está corriendo
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_create_measurement():
    # Verifica que se puede crear una medición
    payload = {
        "station": "Test Station",
        "zone": "Centro",
        "pollutant": "o3",
        "value": 95.0,
        "unit": "µg/m³",
        "timestamp": "2024-01-01T10:00:00"
    }
    response = client.post("/measurements/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["station"] == "Test Station"
    assert data["pollutant"] == "o3"
    assert data["value"] == 95.0

def test_get_measurements():
    # Verifica que se pueden obtener mediciones
    response = client.get("/measurements/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_measurement_not_found():
    # Verifica que devuelve 404 si no existe
    response = client.get("/measurements/99999")
    assert response.status_code == 404

def test_get_stats_summary():
    # Verifica que el endpoint de estadísticas responde
    response = client.get("/stats/summary")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_alerts():
    # Verifica que el endpoint de alertas responde
    response = client.get("/stats/alerts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
