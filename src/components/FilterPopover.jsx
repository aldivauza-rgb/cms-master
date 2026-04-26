import { useState, useEffect, useRef } from 'react'
import { ButtonSecondary } from './Button'
import { IconFilter } from './Icons'
import Select from './Select'

export default function FilterPopover({ label = 'Filter', sections, values, onChange, onResetAll, activeCount }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(values)
  const anchorRef = useRef()
  const popRef = useRef()

  useEffect(() => { setDraft(values) }, [values, open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (popRef.current?.contains(e.target)) return
      if (anchorRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const resetSection = () => {
    const empty = {}
    sections.forEach(s => s.fields.forEach(f => { empty[f.key] = '' }))
    setDraft(empty)
  }
  const apply = () => { onChange(draft); setOpen(false) }
  const resetAll = () => {
    const empty = {}
    sections.forEach(s => s.fields.forEach(f => { empty[f.key] = '' }))
    setDraft(empty); onResetAll(empty); setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button ref={anchorRef} onClick={() => setOpen(o => !o)} style={{
        height: 'var(--control-h)', padding: '0 clamp(16px, 1.4vw, 24px)', borderRadius: 'var(--radius-lg)',
        border: `1px solid ${activeCount > 0 || open ? 'var(--color-blue)' : 'var(--color-border)'}`,
        background: 'var(--color-card)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 'var(--text-md)', lineHeight: 1,
        color: activeCount > 0 || open ? 'var(--color-blue)' : 'var(--color-text-base)',
        transition: 'all var(--transition-fast)',
      }}>
        <IconFilter size={18} stroke="currentColor"/>
        {label}
        {activeCount > 0 && (
          <span style={{
            background: 'var(--color-blue)', color: '#fff', borderRadius: 999,
            padding: '2px 8px', fontSize: 11, fontWeight: 600, minWidth: 20, textAlign: 'center',
          }}>{activeCount}</span>
        )}
      </button>

      {open && (
        <div ref={popRef} style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 30,
          width: 420, background: 'var(--color-card)', borderRadius: 14,
          boxShadow: '0 20px 48px rgba(5,27,62,.18), 0 2px 6px rgba(5,27,62,.08)',
          padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
          animation: 'cms-fade .15s ease',
        }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 16, color: 'var(--color-text-dark)' }}>Filter</div>

          {sections.map(section => (
            <div key={section.label} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-dark)' }}>{section.label}</div>
                <button onClick={resetSection} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-blue)', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 13 }}>Reset</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {section.fields.map(f => (
                  <div key={f.key} style={{ gridColumn: f.span === 2 ? 'span 2' : undefined }}>
                    <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <Select value={draft[f.key] ?? ''} onChange={v => setDraft(d => ({ ...d, [f.key]: v }))} placeholder={f.placeholder} full options={f.options} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ height: 1, background: 'var(--color-border)' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <ButtonSecondary onClick={resetAll}>Reset All</ButtonSecondary>
            <button onClick={apply} style={{
              height: 'var(--control-h)', padding: '0 clamp(20px, 1.8vw, 28px)', borderRadius: 'var(--radius-lg)', border: 'none',
              background: 'var(--color-blue)', color: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 'var(--text-md)', lineHeight: 1,
              boxShadow: '0 2px 8px rgba(4,108,242,.25)',
            }}>Terapkan</button>
          </div>
        </div>
      )}
    </div>
  )
}
