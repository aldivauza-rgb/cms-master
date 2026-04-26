import { useEffect } from 'react'

// ─── helpers ─────────────────────────────────────────────────
const ROLE_COLOR = {
  Administrator: { bg: '#EBF4FF', color: '#1D6FEB' },
  Operator:      { bg: '#F3EEFF', color: '#7C3AED' },
  User:          { bg: '#ECFDF5', color: '#059669' },
}

const ACTION_LABEL = {
  create:  'menambahkan',
  update:  'memperbarui',
  delete:  'menghapus',
  publish: 'menerbitkan',
  draft:   'menyimpan sebagai draf',
  toggle:  'mengubah status',
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'Baru saja'
  if (m < 60)  return `${m} menit lalu`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h} jam lalu`
  const d = Math.floor(h / 24)
  if (d < 7)   return `${d} hari lalu`
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const PALETTE = ['#4361EE','#F72585','#7209B7','#3A0CA3','#4CC9F0','#06D6A0','#FB8500']
const avatarBg  = (n) => PALETTE[(n?.charCodeAt(0) || 0) % PALETTE.length]
const initials  = (n = '') => { const p = n.trim().split(/\s+/); return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() }

const buildText = ({ actor, role, action, feature, item }) => (
  <>
    <strong style={{ color: 'var(--color-text-dark)' }}>{actor}</strong>
    {' '}
    <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 999, background: ROLE_COLOR[role]?.bg || '#F1F5F9', color: ROLE_COLOR[role]?.color || '#5D6B82', fontWeight: 600, verticalAlign: 'middle', marginRight: 2 }}>{role}</span>
    {' '}
    {ACTION_LABEL[action] || action}{' '}
    <strong style={{ color: 'var(--color-text-dark)' }}>{feature}</strong>
    {item ? <> — <span style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>{item}</span></> : (action === 'create' ? ' baru' : '')}
  </>
)

// ─── SINGLE NOTIFICATION ITEM ────────────────────────────────
function NotifItem({ notif, onMarkRead }) {
  const bg = avatarBg(notif.actor)
  return (
    <div
      onClick={() => !notif.read && onMarkRead(notif.id)}
      style={{ display: 'flex', gap: 12, padding: '14px 20px', cursor: notif.read ? 'default' : 'pointer', background: notif.read ? 'transparent' : 'rgba(29,111,235,0.04)', borderBottom: '1px solid var(--color-border)', transition: 'background .15s' }}
      onMouseEnter={e => { if (!notif.read) e.currentTarget.style.background = 'rgba(29,111,235,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(29,111,235,0.04)' }}
    >
      {/* avatar */}
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <span style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 13, color: '#fff' }}>{initials(notif.actor)}</span>
      </div>

      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', lineHeight: 1.55, margin: '0 0 4px' }}>
          {buildText(notif)}
        </p>
        <span style={{ fontFamily: 'var(--font-base)', fontSize: 11, color: 'var(--color-text-light)' }}>{timeAgo(notif.timestamp)}</span>
      </div>

      {/* unread dot */}
      {!notif.read && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-blue)', flexShrink: 0, marginTop: 6 }} />
      )}
    </div>
  )
}

// ─── DRAWER ──────────────────────────────────────────────────
export default function NotificationDrawer({ open, onClose, notifications, onMarkRead, onMarkAllRead }) {
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (!open) return
    const fn = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.2)', backdropFilter: 'blur(2px)', zIndex: 'calc(var(--z-modal) - 1)', animation: 'cms-fade .2s ease' }} />

      {/* drawer */}
      <div className="cms-notif-drawer" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'clamp(320px, 30vw, 400px)', background: 'var(--color-card)', zIndex: 'var(--z-modal)', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 32px rgba(0,0,0,.12)', animation: 'cms-slide-right .22s cubic-bezier(.2,.8,.2,1)' }}>

        {/* header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 16, color: 'var(--color-text-dark)' }}>Pemberitahuan</span>
            {unread > 0 && (
              <span style={{ minWidth: 22, height: 22, borderRadius: 11, padding: '0 6px', background: 'var(--color-blue)', color: '#fff', fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {unread > 0 && (
              <button onClick={onMarkAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-blue)', padding: '4px 0' }}>
                Tandai semua dibaca
              </button>
            )}
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* list */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' }}>
          {notifications.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: 40 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span style={{ fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-light)' }}>Belum ada aktivitas</span>
            </div>
          ) : notifications.map(n => (
            <NotifItem key={n.id} notif={n} onMarkRead={onMarkRead} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes cms-slide-right {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes cms-slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (max-width: 640px) {
          .cms-notif-drawer {
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            max-height: 85vh !important;
            border-radius: 20px 20px 0 0 !important;
            animation: cms-slide-up .25s cubic-bezier(.2,.8,.2,1) !important;
          }
        }
      `}</style>
    </>
  )
}
