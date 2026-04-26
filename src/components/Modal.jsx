import { useEffect } from 'react'
import { ButtonPrimary, ButtonSecondary } from './Button'
import { IconExit } from './Icons'

export function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
        background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'cms-fade .2s ease',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ animation: 'cms-scale .22s cubic-bezier(.2,.8,.2,1)' }}>
        {children}
      </div>
    </div>
  )
}

export function ConfirmModal({ open, title, message, confirmLabel = 'Simpan', onConfirm, onClose, loading }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{
        width: 500, borderRadius: 'var(--radius-lg)', background: 'var(--color-card)',
        overflow: 'hidden', boxShadow: 'var(--shadow-modal)',
      }}>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 30 }}>
            <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, lineHeight: 1.3, color: '#000' }}>
              {title}
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <IconExit size={24} stroke="var(--color-text-dark)" />
            </button>
          </div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 14, lineHeight: 1.5, color: '#666E7A' }}>
            {message}
          </div>
        </div>
        <div style={{
          borderTop: '1px solid var(--color-border)', padding: '24px 32px',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>
          <ButtonSecondary onClick={onClose}>Batal</ButtonSecondary>
          <ButtonPrimary onClick={onConfirm} loading={loading}>{confirmLabel}</ButtonPrimary>
        </div>
      </div>
    </Modal>
  )
}
