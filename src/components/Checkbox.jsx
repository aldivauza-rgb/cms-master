export default function Checkbox({ checked, onChange, label, size = 18 }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span
        onClick={() => onChange(!checked)}
        style={{
          width: size, height: size, borderRadius: 4,
          border: `1.5px solid ${checked ? 'var(--color-blue)' : 'var(--color-border-2)'}`,
          background: checked ? 'var(--color-blue)' : 'var(--color-card)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all var(--transition-fast)', flexShrink: 0,
        }}
      >
        {checked && (
          <svg width={size - 6} height={size - 6} viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
            <path d="M2 6l3 3 5-6"/>
          </svg>
        )}
      </span>
      {label && (
        <span style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', userSelect: 'none' }}>
          {label}
        </span>
      )}
    </label>
  )
}
