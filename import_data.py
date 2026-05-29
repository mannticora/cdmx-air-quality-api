import pandas as pd
from datetime import datetime
from app.database import SessionLocal
from app import models

# Mapeo de estaciones a zonas de CDMX
STATION_ZONES = {
    "ACO": "Oriente",   # Acolman
    "AJM": "Sur",       # Ajusco Medio
    "AJU": "Sur",       # Ajusco
    "BJU": "Centro",    # Benito Juárez
    "CHO": "Oriente",   # Chalco
    "CUA": "Poniente",  # Cuajimalpa
    "CUT": "Norte",     # Cuautitlán
    "FAC": "Noreste",   # FES Acatlán
    "FAR": "Noreste",   # FES Aragón
    "GAM": "Oriente",   # Gustavo A. Madero
    "HGM": "Centro",    # Hospital General
    "INN": "Norte",     # Insurgentes Norte
    "LAA": "Sur",       # Los Alpes Ajusco
    "MER": "Centro",    # Merced
    "MGH": "Poniente",  # Miguel Hidalgo
    "MON": "Oriente",   # Montecillo
    "MPA": "Sur",       # Milpa Alta
    "NEZ": "Oriente",   # Nezahualcóyotl
    "PED": "Sur",       # Pedregal
    "SAC": "Oriente",   # Santiago Acahualtepec
    "SAG": "Norte",     # San Agustín
    "SFE": "Poniente",  # Santa Fe
    "TAH": "Sur",       # Tláhuac
    "TLA": "Norte",     # Tlalnepantla
    "UAX": "Sur",       # UAM Xochimilco
    "UIZ": "Oriente",   # UAM Iztapalapa
    "VIF": "Norte",     # Villa de las Flores
    "XAL": "Noreste",   # Xalostoc
}
# Mapeo de archivos a tipo de medición
FILE_CONFIG = {
    "2026TMP.csv": {"pollutant": "tmp", "unit": "°C"},
    "2026RH.csv":  {"pollutant": "rh",  "unit": "%"},
    "2026WSP.csv": {"pollutant": "wsp", "unit": "m/s"},
    "2026WDR.csv": {"pollutant": "wdr", "unit": "°"},
}

def import_csv(filepath: str, pollutant: str, unit: str, db):
    df = pd.read_csv(filepath, encoding="utf-8-sig")
    stations = [col for col in df.columns if col not in ["FECHA", "HORA"]]
    count = 0

    for _, row in df.iterrows():
        try:
            date_str = f"{row['FECHA']} {int(row['HORA']):02d}:00:00"
            timestamp = datetime.strptime(date_str, "%d/%m/%Y %H:%M:%S")
        except:
            continue

        for station in stations:
            value = row[station]
            if value == -99 or pd.isna(value):
                continue

            measurement = models.Measurement(
                station=station,
                zone=STATION_ZONES.get(station, "Desconocida"),
                pollutant=pollutant,
                value=float(value),
                unit=unit,
                timestamp=timestamp
            )
            db.add(measurement)
            count += 1

    db.commit()
    print(f"✅ {pollutant}: {count} mediciones importadas")

if __name__ == "__main__":
    db = SessionLocal()
    base_path = "/mnt/e/cdmx air/project/26REDMET_CSV"

    for filename, config in FILE_CONFIG.items():
        filepath = f"{base_path}/{filename}"
        print(f"Importando {filename}...")
        import_csv(filepath, config["pollutant"], config["unit"], db)

    db.close()
    print("\n🎉 Importación completa")
