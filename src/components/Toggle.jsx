export default function Toggle({ on, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      style={{
        width: 45, height: 28, borderRadius: 200, border: 'none',
        background: on ? 'var(--color-blue)' : 'var(--color-border-2)',
        padding: 0, cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative', transition: 'background var(--transition-fast)',
        opacity: disabled ? 0.5 : 1, flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 4, left: on ? 21 : 4,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s cubic-bezier(.4,0,.2,1)',
        boxShadow: '0 1px 2px rgba(0,0,0,.12)',
      }}/>
    </button>
  )
}
