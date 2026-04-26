import { useState } from 'react'
import { IconSearch, IconCloseCircle } from './Icons'

export default function SearchInput({ value, onChange, placeholder = 'Cari...', height }) {
  const [focus, setFocus] = useState(false)
  const h = height || 'var(--control-h)'
  return (
    <div style={{
      width: '100%', height: h, borderRadius: 'var(--radius-lg)',
      background: 'var(--color-card)',
      border: `1px solid ${focus ? 'var(--color-blue)' : 'var(--color-border)'}`,
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
      transition: 'border-color var(--transition-fast)',
    }}>
      <IconSearch size={18} stroke="var(--color-text-light)" />
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', color: 'var(--color-text-dark)',
        }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <IconCloseCircle size={18} stroke="var(--color-text-light)" />
        </button>
      )}
    </div>
  )
}
