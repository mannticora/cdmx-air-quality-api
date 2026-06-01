import pandas as pd
from datetime import datetime
from app.database import SessionLocal
from app import models
import os

STATION_ZONES = {
    "ACO": "Oriente", "AJM": "Sur", "AJU": "Sur", "ATI": "Oriente",
    "BJU": "Centro", "CAM": "Norte", "CCA": "Sur", "CHO": "Oriente",
    "COY": "Sur", "CUA": "Poniente", "CUT": "Norte", "FAC": "Noreste",
    "FAR": "Noreste", "GAM": "Oriente", "HGM": "Centro", "INN": "Norte",
    "IZT": "Oriente", "LLA": "Norte", "LPR": "Sur", "MER": "Centro",
    "MGH": "Poniente", "MON": "Oriente", "MPA": "Sur", "NEZ": "Oriente",
    "PED": "Sur", "SAC": "Oriente", "SAG": "Norte", "SFE": "Poniente",
    "SJA": "Sur", "TAH": "Sur", "TLA": "Norte", "TLI": "Norte",
    "UAX": "Sur", "UIZ": "Oriente", "VIF": "Norte", "XAL": "Noreste",
}

REDMET_FILES = {
    "2026TMP.csv": {"pollutant": "tmp", "unit": "°C"},
    "2026RH.csv":  {"pollutant": "rh",  "unit": "%"},
    "2026WSP.csv": {"pollutant": "wsp", "unit": "m/s"},
    "2026WDR.csv": {"pollutant": "wdr", "unit": "°"},
}

RAMA_FILES = {
    "2026O3.csv":   {"pollutant": "o3",   "unit": "ppb"},
    "2026PM25.csv": {"pollutant": "pm25", "unit": "µg/m³"},
    "2026PM10.csv": {"pollutant": "pm10", "unit": "µg/m³"},
    "2026NO2.csv":  {"pollutant": "no2",  "unit": "ppb"},
    "2026CO.csv":   {"pollutant": "co",   "unit": "ppm"},
    "2026SO2.csv":  {"pollutant": "so2",  "unit": "ppb"},
}

def import_csv(filepath, pollutant, unit, db):
    try:
        df = pd.read_csv(filepath, encoding="utf-8-sig")
    except:
        df = pd.read_csv(filepath, encoding="latin-1")
    
    stations = [col for col in df.columns if col not in ["FECHA", "HORA"]]
    count = 0

    for _, row in df.iterrows():
        try:
            hora = int(row['HORA'])
            if hora == 24:
                hora = 0
            date_str = f"{row['FECHA']} {hora:02d}:00:00"
            timestamp = datetime.strptime(date_str, "%d/%m/%Y %H:%M:%S")
        except:
            continue

        for station in stations:
            value = row[station]
            if value == -99 or pd.isna(value):
                continue
            try:
                value = float(value)
            except:
                continue

            measurement = models.Measurement(
                station=station,
                zone=STATION_ZONES.get(station, "Desconocida"),
                pollutant=pollutant,
                value=value,
                unit=unit,
                timestamp=timestamp
            )
            db.add(measurement)
            count += 1

    db.commit()
    print(f"✅ {pollutant}: {count} mediciones importadas")

if __name__ == "__main__":
    db = SessionLocal()
    
    redmet_path = "/mnt/e/cdmx air/project/26REDMET_CSV"
    rama_path = "/mnt/e/cdmx air/RAMA/26RAMA/CSVRAMA"

    print("=== Importando REDMET (meteorológicos) ===")
    for filename, config in REDMET_FILES.items():
        filepath = f"{redmet_path}/{filename}"
        if os.path.exists(filepath):
            print(f"Importando {filename}...")
            import_csv(filepath, config["pollutant"], config["unit"], db)
        else:
            print(f"⚠️  No encontrado: {filepath}")

    print("\n=== Importando RAMA (contaminantes) ===")
    for filename, config in RAMA_FILES.items():
        filepath = f"{rama_path}/{filename}"
        if os.path.exists(filepath):
            print(f"Importando {filename}...")
            import_csv(filepath, config["pollutant"], config["unit"], db)
        else:
            print(f"⚠️  No encontrado: {filepath}")

    db.close()
    print("\n🎉 Importación completa")
