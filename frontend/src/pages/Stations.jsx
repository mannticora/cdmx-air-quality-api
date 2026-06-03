import { useState } from 'react';

const STATIONS = [
  { code: 'ACO', name: 'Acolman', zone: 'Oriente' },
  { code: 'AJM', name: 'Ajusco Medio', zone: 'Sur' },
  { code: 'AJU', name: 'Ajusco', zone: 'Sur' },
  { code: 'ATI', name: 'Atizapán', zone: 'Oriente' },
  { code: 'BJU', name: 'Benito Juárez', zone: 'Centro' },
  { code: 'CAM', name: 'Camarones', zone: 'Norte' },
  { code: 'CCA', name: 'Centro de Ciencias', zone: 'Sur' },
  { code: 'CHO', name: 'Chalco', zone: 'Oriente' },
  { code: 'COY', name: 'Coyoacán', zone: 'Sur' },
  { code: 'CUA', name: 'Cuajimalpa', zone: 'Poniente' },
  { code: 'CUT', name: 'Cuautitlán', zone: 'Norte' },
  { code: 'FAC', name: 'FES Acatlán', zone: 'Noreste' },
  { code: 'FAR', name: 'FES Aragón', zone: 'Noreste' },
  { code: 'GAM', name: 'Gustavo A. Madero', zone: 'Oriente' },
  { code: 'HGM', name: 'Hospital General', zone: 'Centro' },
  { code: 'INN', name: 'Insurgentes Norte', zone: 'Norte' },
  { code: 'IZT', name: 'Iztapalapa', zone: 'Oriente' },
  { code: 'LLA', name: 'La Loma', zone: 'Norte' },
  { code: 'LPR', name: 'La Presa', zone: 'Sur' },
  { code: 'MER', name: 'Merced', zone: 'Centro' },
  { code: 'MGH', name: 'Miguel Hidalgo', zone: 'Poniente' },
  { code: 'MON', name: 'Montecillo', zone: 'Oriente' },
  { code: 'MPA', name: 'Milpa Alta', zone: 'Sur' },
  { code: 'NEZ', name: 'Nezahualcóyotl', zone: 'Oriente' },
  { code: 'PED', name: 'Pedregal', zone: 'Sur' },
  { code: 'SAC', name: 'Santiago Acahualtepec', zone: 'Oriente' },
  { code: 'SAG', name: 'San Agustín', zone: 'Norte' },
  { code: 'SFE', name: 'Santa Fe', zone: 'Poniente' },
  { code: 'SJA', name: 'San Juan Aragón', zone: 'Sur' },
  { code: 'TAH', name: 'Tláhuac', zone: 'Sur' },
  { code: 'TLA', name: 'Tlalnepantla', zone: 'Norte' },
  { code: 'TLI', name: 'Tultitlán', zone: 'Norte' },
  { code: 'UAX', name: 'UAM Xochimilco', zone: 'Sur' },
  { code: 'UIZ', name: 'UAM Iztapalapa', zone: 'Oriente' },
  { code: 'VIF', name: 'Villa de las Flores', zone: 'Norte' },
  { code: 'XAL', name: 'Xalostoc', zone: 'Noreste' },
];

const ZONE_COLORS = { Norte: '#63b3ed', Sur: '#68d391', Centro: '#f6ad55', Oriente: '#fc8181', Poniente: '#b794f4', Noreste: '#76e4f7' };

export default function Stations() {
  const [filter, setFilter] = useState('all');
  const zones = ['all', 'Norte', 'Sur', 'Centro', 'Oriente', 'Poniente', 'Noreste'];
  const filtered = filter === 'all' ? STATIONS : STATIONS.filter(s => s.zone === filter);

  return (
    <div>
      <div style={{ background: '#1e3a5f', border: '1px solid #2b6cb0', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#90cdf4' }}>
        Cada estación tiene un código de 3 letras. Aquí puedes ver qué significa cada código, el nombre completo y su zona.
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {zones.map(z => (
          <button key={z} onClick={() => setFilter(z)} style={{
            padding: '5px 12px', borderRadius: 6, border: '1px solid #2d3748', cursor: 'pointer',
            background: filter === z ? '#2d3748' : 'transparent',
            color: filter === z ? '#e2e8f0' : '#718096', fontSize: 12
          }}>
            {z === 'all' ? 'Todas' : z}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {filtered.map(s => (
          <div key={s.code} style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#63b3ed' }}>{s.code}</div>
            <div style={{ fontSize: 12, color: '#e2e8f0', marginTop: 2 }}>{s.name}</div>
            <span style={{
              display: 'inline-block', padding: '2px 7px', borderRadius: 4,
              fontSize: 10, fontWeight: 600, marginTop: 4,
              background: `${ZONE_COLORS[s.zone]}22`, color: ZONE_COLORS[s.zone]||'#718096'
            }}>{s.zone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
