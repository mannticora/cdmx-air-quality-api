# 🌆 CDMX Air Quality API

A RESTful API built with **Python + FastAPI** to ingest, store, and query real-time and historical air quality data from Mexico City (CDMX) monitoring stations.

Designed for environmental monitoring systems, research dashboards, and public health applications.

---

## 🚀 Features

- 📥 Ingest air quality measurements (O₃, PM2.5, NO₂, CO) by station and timestamp
- 📊 Query historical data by pollutant, zone, and date range
- 🗺️ Filter by geographic zone (Norte, Sur, Centro, Oriente, Poniente)
- ⚡ Fast async responses with FastAPI
- 🐳 Fully containerized with Docker & Docker Compose
- ☁️ Deployed on Azure App Service

---

## 🛠️ Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Language     | Python 3.11             |
| Framework    | FastAPI                 |
| ORM          | SQLAlchemy              |
| Database     | PostgreSQL              |
| Container    | Docker + Docker Compose |
| Cloud        | Azure App Service       |
| Docs         | Swagger UI (built-in)   |
| Version Control | Git + GitHub         |

---

## 📡 API Endpoints

| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | `/`                             | Health check                         |
| GET    | `/measurements`                 | List all measurements                |
| GET    | `/measurements/{id}`            | Get measurement by ID                |
| POST   | `/measurements`                 | Create a new measurement             |
| GET    | `/measurements/zone/{zone}`     | Filter measurements by zone          |
| GET    | `/measurements/pollutant/{type}`| Filter by pollutant (o3, pm25, no2)  |
| DELETE | `/measurements/{id}`            | Delete a measurement                 |

---

## 📦 Example Request

```bash
POST /measurements
Content-Type: application/json

{
  "station": "Pedregal",
  "zone": "Sur",
  "pollutant": "o3",
  "value": 142.5,
  "unit": "µg/m³",
  "timestamp": "2024-05-10T14:00:00"
}
```

---

## 🐳 Run Locally with Docker

```bash
git clone https://github.com/mannticora/cdmx-air-quality-api.git
cd cdmx-air-quality-api
docker compose up --build
```

API available at: `http://localhost:8000`  
Interactive docs at: `http://localhost:8000/docs`

---

## 🗂️ Project Structure

```
cdmx-air-quality-api/
├── app/
│   ├── main.py          # FastAPI app entry point
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # DB connection setup
│   └── routers/
│       └── measurements.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## 👨‍💻 Author

**Ricardo** — Environmental Engineering student at IPN, Mexico City  
Focused on backend development, cloud infrastructure, and environmental data systems.

🔗 [GitHub: mannticora](https://github.com/mannticora)

---

## 📄 License

MIT License
