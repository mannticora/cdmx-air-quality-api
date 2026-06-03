import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: '¿Qué es?' },
  { to: '/stations', label: 'Estaciones' },
  { to: '/query', label: 'Consultar datos' },
  { to: '/stats', label: 'Estadísticas' },
  { to: '/alerts', label: 'Alertas OMS' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/developers', label: 'Desarrolladores' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <div style={{ background: '#1a1d27', borderBottom: '1px solid #2d3748' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.2rem 2rem' }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#63b3ed', marginBottom: 4 }}>
          🌆 CDMX Air Quality API
        </h1>
        <p style={{ fontSize: 13, color: '#718096' }}>
          Guía interactiva — datos reales de calidad del aire de la Ciudad de México y ZMVM
        </p>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingBottom: 8 }}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                fontSize: 12,
                textDecoration: 'none',
                background: pathname === link.to ? '#2d3748' : 'transparent',
                color: pathname === link.to ? '#e2e8f0' : '#718096',
                fontWeight: pathname === link.to ? 500 : 400,
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
