import MetricCard from '../components/MetricCard';

const steps = [
  { num: 1, title: '¿Qué datos tiene?', desc: 'Temperatura, humedad, viento, Ozono (O₃), PM2.5, PM10, NO₂, CO y SO₂ — registrados cada hora por 36 estaciones de monitoreo.' },
  { num: 2, title: '¿De dónde vienen?', desc: 'Del sistema oficial AIRE CDMX (aire.cdmx.gob.mx) — redes REDMET y RAMA del gobierno de la Ciudad de México.' },
  { num: 3, title: '¿Cómo se consultan?', desc: 'Enviando peticiones HTTP a los endpoints. Esta guía te muestra cómo hacerlo de forma interactiva — sin escribir código.' },
  { num: 4, title: '¿Qué zonas cubre?', desc: 'Norte, Sur, Centro, Oriente, Poniente y Noreste — las zonas de monitoreo metropolitano de la CDMX y ZMVM.' },
];

export default function Home() {
  return (
    <div>
      <div style={{
        background: '#1e3a5f', border: '1px solid #2b6cb0',
        borderRadius: 8, padding: '10px 14px', marginBottom: '1rem',
        fontSize: 13, color: '#90cdf4', lineHeight: 1.6
      }}>
        Esta API almacena y sirve datos meteorológicos y de contaminantes reales de las estaciones
        de monitoreo REDMET y RAMA de la CDMX. Contiene más de 96,000 mediciones reales de 2026.
      </div>

      <div style={{
        background: '#1a1d27', border: '1px solid #2d3748',
        borderRadius: 10, padding: '1.25rem', marginBottom: '1rem'
      }}>
        {steps.map(s => (
          <div key={s.num} style={{ display: 'flex', gap: 12, marginBottom: '1rem' }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: '#2d3748', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 600,
              flexShrink: 0, color: '#63b3ed'
            }}>{s.num}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#718096', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        <MetricCard label="Total mediciones" value="96,494" />
        <MetricCard label="Estaciones" value="36" />
        <MetricCard label="Variables" value="10" />
        <MetricCard label="Zonas" value="6" />
        <MetricCard label="Redes" value="REDMET + RAMA" unit="Oficial CDMX" />
      </div>
    </div>
  );
}
