import { useState } from 'react';
import { getMeasurements } from '../services/api';

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

const inputStyle = { width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #2d3748', background: '#0f1117', color: '#e2e8f0', fontSize: 13 };
const labelStyle = { fontSize: 12, color: '#718096', display: 'block', marginBottom: 5 };

export default function Query() {
  const [zone, setZone] = useState('');
  const [station, setStation] = useState('');
  const [pollutant, setPollutant] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [hourStart, setHourStart] = useState('');
  const [hourEnd, setHourEnd] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredStations = zone ? STATIONS.filter(s => s.zone === zone) : STATIONS;

  const buildUrl = () => {
    let url = `/measurements/?limit=${limit}&page=${page}`;
    if (zone) url += `&zone=${zone}`;
    if (station) url += `&station=${station}`;
    if (pollutant) url += `&pollutant=${pollutant}`;
    if (start) url += `&start=${start}T${hourStart || '00:00'}:00`;
    if (end) url += `&end=${end}T${hourEnd || '23:59'}:59`;
    return url;
  };

  async function runQuery() {
    setLoading(true);
    try {
      const params = { limit, page };
      if (zone) params.zone = zone;
      if (station) params.station = station;
      if (pollutant) params.pollutant = pollutant;
      if (start) params.start = `${start}T${hourStart || '00:00'}:00`;
      if (end) params.end = `${end}T${hourEnd || '23:59'}:59`;
      const res = await getMeasurements(params);
      setResults(res.data);
    } catch(e) {}
    setLoading(false);
  }

  return (
    <div>
      <div style={{ background: '#1e3a5f', border: '1px solid #2b6cb0', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem', fontSize: 13, color: '#90cdf4' }}>
        Filtra las mediciones combinando zona, estación, variable, fecha y hora. Todos los filtros son opcionales.
      </div>

      <div style={{ background: '#1a1d27', border: '1px solid #2d3748', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Zona</label>
            <select style={inputStyle} value={zone} onChange={e => { setZone(e.target.value); setStation(''); }}>
              <option value="">Todas</option>
              {['Norte','Sur','Centro','Oriente','Poniente','Noreste'].map(z => <option key={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Estación</label>
            <select style={inputStyle} value={station} onChange={e => setStation(e.target.value)}>
              <option value="">Todas</option>
              {filteredStations.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Variable</label>
            <select style={inputStyle} value={pollutant} onChange={e => setPollutant(e.target.value)}>
              <option value="">Todas</option>
              <optgroup label="Meteorológicos">
                <option value="tmp">Temperatura (°C)</option>
                <option value="rh">Humedad (%)</option>
                <option value="wsp">Vel. viento (m/s)</option>
                <option value="wdr">Dir. viento (°)</option>
              </optgroup>
              <optgroup label="Contaminantes RAMA">
                <option value="o3">Ozono (ppb)</option>
                <option value="pm25">PM2.5 (µg/m³)</option>
                <option value="pm10">PM10 (µg/m³)</option>
                <option value="no2">NO₂ (ppb)</option>
                <option value="co">CO (ppm)</option>
                <option value="so2">SO₂ (ppb)</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Fecha inicio</label>
            <input style={inputStyle} type="date" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Fecha fin</label>
            <input style={inputStyle} type="date" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Hora inicio</label>
            <input style={inputStyle} type="time" value={hourStart} onChange={e => setHourStart(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Hora fin</label>
            <input style={inputStyle} type="time" value={hourEnd} onChange={e => setHourEnd(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Resultados</label>
            <select style={inputStyle} value={limit} onChange={e => setLimit(e.target.value)}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Página</label>
            <input style={inputStyle} type="number" value={page} min="1" onChange={e => setPage(e.target.value)} />
          </div>
        </div>

        <div style={{ background: '#0f1117', borderRadius: 8, padding: '9px 12px', fontFamily: 'monospace', fontSize: 11, color: '#718096', marginBottom: '1rem', border: '1px solid #2d3748' }}>
          GET <span style={{ color: '#63b3ed' }}>{buildUrl()}</span>
        </div>

        <button onClick={runQuery} style={{ width: '100%', padding: '9px 20px', borderRadius: 8, border: '1px solid #2d3748', background: '#2d3748', color: '#e2e8f0', fontSize: 13, cursor: 'pointer' }}>
          {loading ? 'Consultando...' : '▶ Ejecutar consulta'}
        </button>
      </div>

      {results && (
        <div style={{ background: '#0f1117', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 11, color: '#a0aec0', maxHeight: 300, overflowY: 'auto', border: '1px solid #2d3748', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(results, null, 2)}
        </div>
      )}
    </div>
  );
}
