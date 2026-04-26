export function ButtonPrimary({ children, onClick, loading, disabled, full, style, type = 'button' }) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        height: 'var(--control-h)', minWidth: 78,
        padding: '0 clamp(16px, 1.4vw, 24px)', borderRadius: 'var(--radius-lg)',
        background: isDisabled ? 'var(--color-text-muted)' : 'var(--color-blue)',
        color: 'var(--color-text-white)', border: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-base)', fontWeight: 500,
        fontSize: 'var(--text-md)', lineHeight: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : undefined,
        transition: 'background var(--transition-fast)', flexShrink: 0,
        ...style,
      }}
      onMouseDown={e => { if (!isDisabled) e.currentTarget.style.background = 'var(--color-blue-hover)' }}
      onMouseUp={e => { e.currentTarget.style.background = isDisabled ? 'var(--color-text-muted)' : 'var(--color-blue)' }}
      onMouseLeave={e => { e.currentTarget.style.background = isDisabled ? 'var(--color-text-muted)' : 'var(--color-blue)' }}
    >
      {loading
        ? <span style={{
            display: 'inline-block', width: 18, height: 18, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff',
            animation: 'cms-spin .7s linear infinite',
          }}/>
        : children}
    </button>
  )
}

export function ButtonSecondary({ children, onClick, style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 'var(--control-h)', minWidth: 88,
        padding: '0 clamp(16px, 1.4vw, 24px)', borderRadius: 'var(--radius-lg)',
        background: 'transparent', color: 'var(--color-text-dark)',
        border: '1px solid var(--color-border)', cursor: 'pointer',
        fontFamily: 'var(--font-base)', fontWeight: 500,
        fontSize: 'var(--text-md)', lineHeight: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'background var(--transition-fast)', flexShrink: 0,
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </button>
  )
}
