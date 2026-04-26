import { useState } from 'react'
import { IconInfoCircle } from './Icons'

export default function TextField({
  label, value, onChange, type = 'text', placeholder,
  icon, onIconClick, error, helperText, required, autoFocus, textarea,
}) {
  const [focused, setFocused] = useState(false)
  const isError = !!error
  const borderColor = isError ? 'var(--color-error-light)' : focused ? 'var(--color-blue)' : 'var(--color-border)'
  const labelColor  = isError ? 'var(--color-error)' : focused ? 'var(--color-blue)' : 'var(--color-text-base)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-xs)', fontWeight: 500, color: labelColor }}>
          {label}{required && <span style={{ color: 'var(--color-error-red)' }}> *</span>}
        </label>
      )}
      <div style={{
        minHeight: textarea ? 120 : 'var(--control-h)', borderRadius: 'var(--radius-lg)',
        background: 'var(--color-card)', border: `1px solid ${borderColor}`,
        display: 'flex', alignItems: textarea ? 'flex-start' : 'center', gap: 8,
        padding: textarea ? '14px 16px' : '0 14px 0 16px',
        transition: 'border-color var(--transition-fast)',
      }}>
        {textarea ? (
          <textarea
            value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} rows={4}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              flex: 1, border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'var(--font-base)', fontSize: 14, lineHeight: 1.5,
              color: 'var(--color-text-dark)', background: 'transparent',
            }}
          />
        ) : (
          <input
            type={type} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} autoFocus={autoFocus}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontFamily: 'var(--font-base)', fontSize: 14, lineHeight: 1.5,
              color: 'var(--color-text-dark)', background: 'transparent',
            }}
          />
        )}
        {icon && (
          <button type="button" onClick={onIconClick} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center',
            color: isError ? 'var(--color-error-light)' : 'var(--color-text-base)',
          }}>
            {icon}
          </button>
        )}
      </div>
      {(helperText || error) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-base)', fontSize: 'var(--text-xs)', lineHeight: 1.5,
          color: isError ? 'var(--color-error)' : 'var(--color-text-base)',
        }}>
          {isError && <IconInfoCircle size={14} stroke="var(--color-error)" />}
          {error || helperText}
        </div>
      )}
    </div>
  )
}
