import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Snackbar from '../components/Snackbar'
import Logo from '../components/Logo'
import NotificationDrawer from '../components/NotificationDrawer'
import AnalitikPage from './dashboard/AnalitikPage'
import SlideshowPage from './dashboard/SlideshowPage'
import BeritaPage from './dashboard/BeritaPage'
import AgendaPage from './dashboard/AgendaPage'
import DokumenPage from './dashboard/DokumenPage'
import MajalahPage from './dashboard/MajalahPage'
import FasilitasPage from './dashboard/FasilitasPage'
import TentangPage from './dashboard/TentangPage'
import KelolAkunPage from './dashboard/KelolAkunPage'
import GuruStafPage from './dashboard/GuruStafPage'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,6)}`

const SEED_NOTIFS = [
  { id: uid(), actor: 'Username', role: 'Administrator', action: 'publish', feature: 'Slideshow', item: null,                           timestamp: new Date(Date.now() - 5   * 60000).toISOString(), read: false },
  { id: uid(), actor: 'Username', role: 'Administrator', action: 'create',  feature: 'Berita',    item: 'Pembukaan Gedung Layanan Baru', timestamp: new Date(Date.now() - 42  * 60000).toISOString(), read: false },
  { id: uid(), actor: 'Username', role: 'Administrator', action: 'update',  feature: 'Agenda',    item: 'Festival Budaya Tahunan',       timestamp: new Date(Date.now() - 2   * 3600000).toISOString(), read: true  },
  { id: uid(), actor: 'Username', role: 'Administrator', action: 'delete',  feature: 'Dokumen',   item: 'Laporan Q1 2025',               timestamp: new Date(Date.now() - 5   * 3600000).toISOString(), read: true  },
  { id: uid(), actor: 'Username', role: 'Administrator', action: 'create',  feature: 'Majalah',   item: 'Warta Daerah Vol.12',           timestamp: new Date(Date.now() - 1   * 86400000).toISOString(), read: true  },
]

export default function Dashboard({ onLogout }) {
  const [snack,         setSnack]         = useState(null)
  const [sideOpen,      setSideOpen]      = useState(false)
  const [notifOpen,     setNotifOpen]     = useState(false)
  const [notifications, setNotifications] = useState(SEED_NOTIFS)
  // Always start at Analisis Web on every login (no localStorage persistence)
  const [page, setPage] = useState('analitik')

  const fireSnack = (s) => { setSnack(s); setTimeout(() => setSnack(null), 3000) }

  const fireNotif = ({ action, feature, item = null, actor = 'Username', role = 'Administrator' }) => {
    setNotifications(prev => [{ id: uid(), actor, role, action, feature, item, timestamp: new Date().toISOString(), read: false }, ...prev])
  }

  const markRead    = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = ()   => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const unreadCount = notifications.filter(n => !n.read).length

  const n = { fireSnack, fireNotif }

  const renderPage = () => {
    switch (page) {
      case 'analitik':   return <AnalitikPage />
      case 'slideshow':  return <SlideshowPage  {...n} />
      case 'berita':     return <BeritaPage      {...n} />
      case 'agenda':     return <AgendaPage      {...n} />
      case 'dokumen':    return <DokumenPage     {...n} />
      case 'majalah':    return <MajalahPage     {...n} />
      case 'fasilitas':  return <FasilitasPage   {...n} />
      case 'tentang':    return <TentangPage     {...n} pageKey="tentang" />
      case 'visimisi':   return <TentangPage     {...n} pageKey="visimisi" />
      case 'sambutan':   return <TentangPage     {...n} pageKey="sambutan" />
      case 'struktur':   return <TentangPage     {...n} pageKey="struktur" />
      case 'akreditasi': return <TentangPage     {...n} pageKey="akreditasi" />
      case 'statistik':  return <TentangPage     {...n} pageKey="statistik" />
      case 'akun':       return <KelolAkunPage   {...n} />
      case 'gurustaf':   return <GuruStafPage    {...n} />
      default:           return <AnalitikPage />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar
        open={sideOpen}
        onClose={() => setSideOpen(false)}
        onLogout={onLogout}
        page={page}
        setPage={setPage}
        onNotifOpen={() => setNotifOpen(true)}
        notifCount={unreadCount}
      />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="cms-mobile-bar" style={{ display: 'none', padding: '16px 20px', background: 'var(--color-navy)', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <button onClick={() => setSideOpen(true)} style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-dark-blue)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9F9F9" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Logo />
          <div style={{ width: 40 }} />
        </div>

        <div style={{ padding: 'clamp(24px, 3.5vw, 64px) clamp(20px, 3.5vw, 64px)', display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 2.4vw, 40px)', maxWidth: 1600, width: '100%', margin: '0 auto' }}>
          {renderPage()}
        </div>
      </div>

      {snack && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 'var(--z-snack)' }}>
          <Snackbar {...snack} onClose={() => setSnack(null)} />
        </div>
      )}

      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />

      <style>{`
        @media (max-width: 900px) {
          .cms-mobile-bar   { display: flex !important; }
          .cms-col-headers  { display: none !important; }
          .cms-row          { grid-template-columns: 1fr !important; }
          .cms-row > div:nth-child(3) { justify-content: flex-start !important; padding-top: 0 !important; }
          .cms-form-grid    { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .cms-thumb        { width: 120px !important; }
          .cms-akun-pw      { display: none !important; }
        }
      `}</style>
    </div>
  )
}
