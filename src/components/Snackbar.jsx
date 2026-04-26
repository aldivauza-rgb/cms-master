import { IconTickCircle, IconInfoCircle, IconCloseCircle } from './Icons'

const palette = {
  success: { bg: '#EAF8F4', accent: '#007955', Icon: IconTickCircle },
  error:   { bg: '#FFEEEF', accent: '#B3202F', Icon: IconInfoCircle },
  primary: { bg: '#E6F0FE', accent: '#046CF2', Icon: IconTickCircle },
}

export default function Snackbar({ type = 'success', title, message, onClose, style }) {
  const p = palette[type] || palette.success
  const PIcon = p.Icon
  return (
    <div style={{
      width: 360, borderRadius: 8, background: p.bg,
      boxShadow: 'var(--shadow-snack)', padding: 16,
      display: 'flex', gap: 12, alignItems: 'flex-start',
      animation: 'cms-fade .2s ease',
      ...style,
    }}>
      <PIcon size={24} stroke={p.accent} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 14, lineHeight: 1.2, color: p.accent }}>
          {title}
        </div>
        {message && (
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, lineHeight: 1.5, color: 'var(--color-text-base)' }}>
            {message}
          </div>
        )}
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <IconCloseCircle size={18} stroke="var(--color-text-dark)" />
      </button>
    </div>
  )
}
