import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStatsSummary } from '../services/api';
import MetricCard from '../components/MetricCard';

const LABELS = { tmp: 'Temperatura', rh: 'Humedad', wsp: 'Vel. viento', wdr: 'Dir. viento', o3: 'Ozono', pm25: 'PM2.5', pm10: 'PM10', no2: 'NO₂', co: 'CO', so2: 'SO₂' };
const UNITS = { tmp: '°C', rh: '%', wsp: 'm/s', wdr: '°', o3: 'ppb', pm25: 'µg/m³', pm10: 'µg/m³', no2: 'ppb', co: 'ppm', so2: 'ppb' };
const COLORS = ['#63b3ed','#68d391','#f6ad55','#fc8181','#b794f4','#76e4f7','#f687b3','#fbd38d','#9ae6b4','#bee3f8'];

export default function Stats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getStatsSummary();
      setData(res.data);
    } catch(e) {}
    setLoading(false);
  }

  const chartData = data.map(d => ({
    name: LABELS[d.pollutant] || d.pollutant,
    promedio: parseFloat(d.average.toFixed(2)),
    maximo: d.maximum,
    minimo: d.minimum,
  }));

  return (
    <div>
      <div style={{ background: '#1e3a5f', border: '1px solid #2b6cb0', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#90cdf4' }}>
        Estadísticas calculadas automáticamente sobre todas las mediciones disponibles.
      </div>

      <button onClick={load} style={{ width: '100%', padding: '9px 20px', borderRadius: 8, border: '1px solid #2d3748', background: '#2d3748', color: '#e2e8f0', fontSize: 13, cursor: 'pointer', marginBottom: '1rem' }}>
        {loading ? 'Cargando...' : '▶ Cargar estadísticas'}
      </button>

      {data.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: '1rem' }}>
            {data.map((d, i) => (
              <MetricCard
                key={d.pollutant}
                label={`${LABELS[d.pollutant]||d.pollutant} promedio`}
                value={d.average.toFixed(1)}
                unit={UNITS[d.pollutant]||''}
                color={COLORS[i % COLORS.length]}
              />
            ))}
          </div>

          <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: 13, color: '#a0aec0', marginBottom: '1rem' }}>Promedio por variable</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#718096', fontSize: 11 }} />
                <YAxis tick={{ fill: '#718096', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 8 }} />
                <Bar dataKey="promedio" radius={[4,4,0,0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
