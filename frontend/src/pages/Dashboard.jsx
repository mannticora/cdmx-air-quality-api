import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart as HBar } from 'recharts';
import { getStatsByZone } from '../services/api';
import MetricCard from '../components/MetricCard';

const COLORS = { Norte: '#63b3ed', Sur: '#68d391', Centro: '#f6ad55', Oriente: '#fc8181', Poniente: '#b794f4', Noreste: '#76e4f7', Desconocida: '#718096' };

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getStatsByZone();
      setData(res.data);
    } catch(e) {}
    setLoading(false);
  }

  const zones = [...new Set(data.map(d => d.zone))].sort();
  const totals = {};
  zones.forEach(z => {
    totals[z] = data.filter(d => d.zone === z).reduce((a, b) => a + b.total_measurements, 0);
  });

  const zoneChartData = zones.map(z => ({ zone: z, total: totals[z] }));
  const tmpData = data.filter(d => d.pollutant === 'tmp').map(d => ({ zone: d.zone, promedio: parseFloat(d.average.toFixed(1)) }));
  const o3Data = data.filter(d => d.pollutant === 'o3').map(d => ({ zone: d.zone, promedio: parseFloat(d.average.toFixed(1)) }));

  return (
    <div>
      <div style={{ background: '#1e3a5f', border: '1px solid #2b6cb0', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#90cdf4' }}>
        Dashboard en vivo con datos reales de la API. Distribución de mediciones por zona y comparativa de contaminantes.
      </div>

      <button onClick={load} style={{ width: '100%', padding: '9px 20px', borderRadius: 8, border: '1px solid #2d3748', background: '#2d3748', color: '#e2e8f0', fontSize: 13, cursor: 'pointer', marginBottom: '1rem' }}>
        {loading ? 'Cargando...' : '▶ Cargar dashboard'}
      </button>

      {data.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: '1rem' }}>
            {zones.map(z => (
              <MetricCard key={z} label={z} value={totals[z].toLocaleString()} unit="mediciones" color={COLORS[z]||'#718096'} />
            ))}
          </div>

          <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: 13, color: '#a0aec0', marginBottom: '1rem' }}>Mediciones por zona</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={zoneChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="zone" tick={{ fill: '#718096', fontSize: 11 }} />
                <YAxis tick={{ fill: '#718096', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 8 }} />
                <Bar dataKey="total" radius={[4,4,0,0]}>
                  {zoneChartData.map((d, i) => <Cell key={i} fill={COLORS[d.zone]||'#718096'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1rem' }}>
              <h3 style={{ fontSize: 13, color: '#a0aec0', marginBottom: '1rem' }}>Temperatura promedio por zona (°C)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tmpData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: '#718096', fontSize: 11 }} />
                  <YAxis dataKey="zone" type="category" tick={{ fill: '#718096', fontSize: 11 }} width={60} />
                  <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 8 }} />
                  <Bar dataKey="promedio" radius={[0,4,4,0]}>
                    {tmpData.map((d, i) => <Cell key={i} fill={COLORS[d.zone]||'#718096'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1rem' }}>
              <h3 style={{ fontSize: 13, color: '#a0aec0', marginBottom: '1rem' }}>Ozono promedio por zona (ppb)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={o3Data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: '#718096', fontSize: 11 }} />
                  <YAxis dataKey="zone" type="category" tick={{ fill: '#718096', fontSize: 11 }} width={60} />
                  <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 8 }} />
                  <Bar dataKey="promedio" radius={[0,4,4,0]}>
                    {o3Data.map((d, i) => <Cell key={i} fill={COLORS[d.zone]||'#718096'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
