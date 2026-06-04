const API = 'https://cdmx-air-quality-api-production.up.railway.app';

const codeStyle = {
  background: '#0f1117', border: '1px solid #2d3748', borderRadius: 8,
  padding: 12, fontFamily: 'monospace', fontSize: 12, color: '#a0aec0',
  overflowX: 'auto', marginBottom: '1rem', whiteSpace: 'pre'
};

const endpoints = [
  { method: 'GET', path: '/measurements/', desc: 'Lista mediciones con filtros: zone, pollutant, station, start, end, page, limit', color: '#63b3ed', bg: 'rgba(99,179,237,0.15)' },
  { method: 'POST', path: '/measurements/', desc: 'Crear nueva medición', color: '#68d391', bg: 'rgba(104,211,145,0.15)' },
  { method: 'GET', path: '/measurements/{id}', desc: 'Obtener medición por ID', color: '#63b3ed', bg: 'rgba(99,179,237,0.15)' },
  { method: 'PUT', path: '/measurements/{id}', desc: 'Actualizar medición existente', color: '#f6ad55', bg: 'rgba(246,173,85,0.15)' },
  { method: 'DELETE', path: '/measurements/{id}', desc: 'Eliminar medición', color: '#fc8181', bg: 'rgba(252,129,74,0.15)' },
  { method: 'GET', path: '/stats/summary', desc: 'Estadísticas globales por variable', color: '#63b3ed', bg: 'rgba(99,179,237,0.15)' },
  { method: 'GET', path: '/stats/alerts', desc: 'Alertas OMS y NOM por contaminante', color: '#63b3ed', bg: 'rgba(99,179,237,0.15)' },
  { method: 'GET', path: '/stats/by-zone', desc: 'Estadísticas por zona geográfica', color: '#63b3ed', bg: 'rgba(99,179,237,0.15)' },
];

export default function Developers() {
  return (
    <div>
      <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 10 }}>Base URL</h3>
        <div style={codeStyle}>{API}</div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, marginTop: 16 }}>Endpoints disponibles</h3>
        {endpoints.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #2d3748' }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: e.bg, color: e.color, flexShrink: 0 }}>{e.method}</span>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0' }}>{e.path}</div>
              <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>{e.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 10 }}>JavaScript (fetch)</h3>
        <div style={codeStyle}>{`// Obtener temperatura de la zona Norte
fetch('${API}/measurements/?zone=Norte&pollutant=tmp&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));`}</div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, marginTop: 16 }}>Python (requests)</h3>
        <div style={codeStyle}>{`import requests

url = "${API}/measurements/"
params = {
    "zone": "Sur",
    "pollutant": "o3",
    "start": "2026-01-01T00:00:00",
    "limit": 50
}
response = requests.get(url, params=params)
data = response.json()`}</div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 10, marginTop: 16 }}>React (hook)</h3>
        <div style={codeStyle}>{`import { useEffect, useState } from "react";

const API = "${API}";

function AirQualityWidget() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(\`\${API}/measurements/?pollutant=o3&limit=5\`)
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <ul>
      {data.map(m => (
        <li key={m.id}>{m.station}: {m.value} ppb</li>
      ))}
    </ul>
  );
}`}</div>

        <div style={{ background: '#2d2000', border: '1px solid #744210', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f6ad55' }}>
          📄 Documentación interactiva completa en <strong>/docs</strong> — prueba todos los endpoints con Swagger UI.
        </div>
      </div>
    </div>
  );
}
