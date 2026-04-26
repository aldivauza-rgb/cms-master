import { useState } from 'react'
import { IconChevronDown } from './Icons'

export default function Select({ label, value, onChange, options, placeholder = 'Pilih', required, style, full, height }) {
  const [focus, setFocus] = useState(false)
  const h = height || 'var(--control-h)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: full ? '100%' : undefined, ...style }}>
      {label && (
        <label style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-xs)', fontWeight: 500, color: focus ? 'var(--color-blue)' : 'var(--color-text-base)' }}>
          {label}{required && <span style={{ color: 'var(--color-error-red)' }}> *</span>}
        </label>
      )}
      <div style={{
        position: 'relative', height: h, borderRadius: 'var(--radius-lg)',
        background: 'var(--color-card)',
        border: `1px solid ${focus ? 'var(--color-blue)' : 'var(--color-border)'}`,
        display: 'flex', alignItems: 'center',
        transition: 'border-color var(--transition-fast)',
      }}>
        <select
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
            width: '100%', height: '100%', border: 'none', outline: 'none',
            background: 'transparent', padding: '0 40px 0 16px',
            fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)',
            color: value ? 'var(--color-text-dark)' : 'var(--color-text-light)',
            cursor: 'pointer',
          }}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <IconChevronDown size={18} stroke="var(--color-text-base)" />
        </span>
      </div>
    </div>
  )
}
