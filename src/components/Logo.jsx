export default function Logo({ color = '#fff' }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: `2px solid ${color}`, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, opacity: 0.35 }}/>
      </div>
      <span style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 18, color, letterSpacing: 0.5 }}>
        CMS
      </span>
    </div>
  )
}
