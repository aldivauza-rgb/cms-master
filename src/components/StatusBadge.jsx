const map = {
  terbit:   { bg: '#EAF8F4', fg: '#007955', label: 'Terbit',   dot: '#007955' },
  draf:     { bg: '#FFF7E6', fg: '#946A00', label: 'Draf',     dot: '#D79B00' },
  aktif:    { bg: '#EAF8F4', fg: '#007955', label: 'Aktif',    dot: '#007955' },
  nonaktif: { bg: '#F1F2F5', fg: '#5D6B82', label: 'Nonaktif', dot: '#97A2B0' },
}

export default function StatusBadge({ status }) {
  const s = map[status] || map.draf
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999, background: s.bg,
      fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: s.fg,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }}/>
      {s.label}
    </span>
  )
}
