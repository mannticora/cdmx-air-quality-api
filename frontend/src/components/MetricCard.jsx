export default function MetricCard({ label, value, unit, color = '#63b3ed' }) {
  return (
    <div style={{
      background: '#0f1117',
      border: '1px solid #2d3748',
      borderRadius: 8,
      padding: 12,
    }}>
      <div style={{ fontSize: 11, color: '#718096', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color }}>{value}</div>
      {unit && <div style={{ fontSize: 11, color: '#718096' }}>{unit}</div>}
    </div>
  );
}
