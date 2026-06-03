import { useState } from 'react';
import { getAlerts } from '../services/api';

const NAMES = { o3: 'Ozono', pm25: 'PM2.5', pm10: 'PM10', no2: 'NO₂', co: 'CO', so2: 'SO₂' };

export default function Alerts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getAlerts();
      setData(res.data);
    } catch(e) {}
    setLoading(false);
  }

  return (
    <div>
      <div style={{ background: '#1e3a5f', border: '1px solid #2b6cb0', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#90cdf4' }}>
        Detecta mediciones que superan los límites de la OMS y las Normas Oficiales Mexicanas (NOM). 
        Verde ✅ = cumple NOM. Rojo ❌ = supera NOM.
      </div>

      <button onClick={load} style={{ width: '100%', padding: '9px 20px', borderRadius: 8, border: '1px solid #2d3748', background: '#2d3748', color: '#e2e8f0', fontSize: 13, cursor: 'pointer', marginBottom: '1rem' }}>
        {loading ? 'Cargando...' : '▶ Ver alertas'}
      </button>

      {data.length > 0 && (
        <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 6, fontSize: 11, color: '#718096', padding: '6px 0', borderBottom: '1px solid #2d3748', fontWeight: 600 }}>
            <span>Estación</span><span>Variable</span><span>Valor</span><span>vs OMS</span><span>vs NOM</span>
          </div>
          {data.slice(0, 20).map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 6, padding: '8px 0', borderBottom: '1px solid #2d3748', fontSize: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, color: '#e2e8f0' }}>{a.station}</div>
                <div style={{ fontSize: 11, color: '#718096' }}>{a.zone}</div>
              </div>
              <span style={{ color: '#a0aec0' }}>{NAMES[a.pollutant]||a.pollutant} ({a.unit})</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{a.value}</span>
              <span style={{ color: '#fc814a' }}>+{a.exceeded_by_who?.toFixed(1)}</span>
              <span style={{ color: a.exceeds_nom ? '#fc8181' : '#68d391' }}>
                {a.exceeds_nom ? `+${a.exceeded_by_nom?.toFixed(1)} ❌` : '✅ Cumple'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
