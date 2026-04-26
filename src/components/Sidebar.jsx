import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { Modal, ConfirmModal } from './Modal'
import { ButtonPrimary, ButtonSecondary } from './Button'
import TextField from './TextField'
import {
  IconStatistic, IconScreenMirror, IconBuildings, IconNotification,
  IconSetting, IconInbox, IconChevronDown, IconExit,
} from './Icons'
import avatarUrl from '../assets/avatar.png'

// ─── local icons ─────────────────────────────────────────────
const IUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const ICamera = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

// ─── SIDEBAR ITEM ─────────────────────────────────────────────
function SidebarItem({ icon: IconC, label, active, choose, onClick, badge }) {
  const textColor = choose || active ? '#F9F9F9' : 'var(--color-text-base)'
  const bg = choose ? 'var(--color-blue)' : active ? 'var(--color-dark-blue)' : 'transparent'
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 'clamp(44px, 3.2vw, 56px)',
      borderRadius: 'var(--radius-lg)', background: bg,
      border: 'none', padding: '0 12px',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      transition: 'background var(--transition-fast)',
    }}
      onMouseEnter={e => { if (!choose) e.currentTarget.style.background = 'var(--color-dark-blue)' }}
      onMouseLeave={e => { if (!choose) e.currentTarget.style.background = active ? 'var(--color-dark-blue)' : 'transparent' }}
    >
      <IconC size={20} stroke={textColor} />
      <span style={{ fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 'var(--text-base)', color: textColor, flex: 1, textAlign: 'left' }}>{label}</span>
      {badge != null && (
        <span style={{ minWidth: 24, height: 24, borderRadius: 12, padding: '0 8px', background: '#E11D48', color: '#fff', fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
      )}
    </button>
  )
}

// ─── PROFILE MODAL ────────────────────────────────────────────
function ProfileModal({ open, onClose, name, photo, onSave }) {
  const [editName,  setEditName]  = useState(name)
  const [editPhoto, setEditPhoto] = useState(photo)
  const fileRef = useRef()

  useEffect(() => { if (open) { setEditName(name); setEditPhoto(photo) } }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (f) setEditPhoto({ file: f, preview: URL.createObjectURL(f) })
  }
  const handleSave = () => { onSave({ name: editName.trim() || name, photo: editPhoto }); onClose() }

  const initials = (n = '') => { const p = n.trim().split(/\s+/); return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() }
  const photoSrc = editPhoto?.preview || editPhoto

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ width: 440, borderRadius: 'var(--radius-lg)', background: 'var(--color-card)', overflow: 'hidden', boxShadow: 'var(--shadow-modal)' }}>
        {/* header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 18, color: 'var(--color-text-dark)' }}>Detail Akun</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* photo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              {photoSrc ? (
                <img src={photoSrc} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-border)' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-blue)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--color-border)' }}>
                  <span style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 24, color: '#fff' }}>{initials(editName)}</span>
                </div>
              )}
              <button onClick={() => fileRef.current.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--color-blue)', border: '2px solid var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ICamera />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>Klik ikon kamera untuk mengubah foto</span>
          </div>

          {/* name */}
          <TextField label="Nama" value={editName} onChange={setEditName} placeholder="Masukkan nama" />

          {/* password info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-base)' }}>Password</label>
            <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <svg style={{ marginTop: 1, flexShrink: 0 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              <span style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-light)', lineHeight: 1.5 }}>
                Untuk mengubah password, silakan hubungi <strong style={{ color: 'var(--color-text-base)' }}>pihak Inagata</strong> sebagai administrator sistem.
              </span>
            </div>
          </div>

          {/* role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-base)' }}>Role</label>
            <div style={{ height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
              <span style={{ fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-dark)', fontWeight: 500 }}>Administrator</span>
              <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>Ditetapkan oleh sistem</span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <ButtonSecondary onClick={onClose}>Batal</ButtonSecondary>
          <ButtonPrimary onClick={handleSave}>Simpan</ButtonPrimary>
        </div>
      </div>
    </Modal>
  )
}

// ─── MAIN SIDEBAR ─────────────────────────────────────────────
export default function Sidebar({ open, onClose, onLogout, page, setPage, onNotifOpen, notifCount }) {
  const isProfilPage    = ['gurustaf','sambutan','tentang','visimisi','struktur','akreditasi','statistik'].includes(page)
  const isInformasiPage = ['berita','agenda','dokumen','majalah','fasilitas'].includes(page)

  const [profilOpen,    setProfilOpen]    = useState(isProfilPage)
  const [informasiOpen, setInformasiOpen] = useState(isInformasiPage)
  const [userMenuOpen,  setUserMenuOpen]  = useState(false)
  const [showProfile,   setShowProfile]   = useState(false)
  const [showLogout,    setShowLogout]    = useState(false)
  const [profileName,   setProfileName]   = useState('Username')
  const [profilePhoto,  setProfilePhoto]  = useState(null)

  useEffect(() => {
    if (isProfilPage) { setProfilOpen(true); setInformasiOpen(false) }
    else if (isInformasiPage) { setInformasiOpen(true); setProfilOpen(false) }
    else { setProfilOpen(false); setInformasiOpen(false) }
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleProfil    = () => { setProfilOpen(o => !o); setInformasiOpen(false) }
  const toggleInformasi = () => { setInformasiOpen(o => !o); setProfilOpen(false) }
  const go = (p) => { setPage(p); onClose() }

  const subItem = (label, target) => (
    <button key={label} onClick={() => target && go(target)} style={{
      width: '100%', height: 'clamp(44px, 3.2vw, 56px)', borderRadius: 10, padding: '0 12px',
      border: 'none', cursor: target ? 'pointer' : 'default',
      display: 'flex', alignItems: 'center', gap: 12,
      background: page === target ? 'var(--color-blue)' : 'transparent',
      color: page === target ? '#F9F9F9' : '#97A2B0',
      fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 'clamp(13px, 0.9vw, 14px)',
      textAlign: 'left', transition: 'background var(--transition-fast)',
    }}
      onMouseEnter={e => { if (page !== target) e.currentTarget.style.background = 'var(--color-dark-blue)' }}
      onMouseLeave={e => { if (page !== target) e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: page === target ? '#fff' : '#354764', flexShrink: 0 }} />
      {label}
    </button>
  )

  const GroupBtn = ({ icon: IconC, label, open: isOpen, onToggle }) => (
    <button onClick={onToggle} style={{
      width: '100%', height: 'clamp(44px, 3.2vw, 56px)', borderRadius: 'var(--radius-lg)',
      background: isOpen ? 'var(--color-dark-blue)' : 'transparent', border: 'none',
      padding: '0 12px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      transition: 'background var(--transition-fast)',
      color: isOpen ? '#F9F9F9' : 'var(--color-text-base)',
    }}
      onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'var(--color-dark-blue)' }}
      onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
    >
      <IconC size={20} stroke="currentColor" />
      <span style={{ flex: 1, textAlign: 'left', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 'var(--text-base)' }}>{label}</span>
      <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', display: 'inline-flex' }}>
        <IconChevronDown size={16} stroke="currentColor" />
      </span>
    </button>
  )

  const photoSrc = profilePhoto?.preview || profilePhoto

  return (
    <>
      {/* mobile backdrop */}
      {open && <div onClick={onClose} className="cms-sidebar-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 'var(--z-backdrop)' }} />}

      <aside className={`cms-sidebar${open ? ' open' : ''}`} style={{
        width: 'var(--sidebar-width)', background: 'var(--sidebar-bg)',
        padding: 'clamp(24px, 2vw, 36px) clamp(16px, 1.4vw, 24px) clamp(32px, 3vw, 48px)',
        display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 2.4vw, 40px)', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#354764 transparent',
      }}>
        <div style={{ height: 'clamp(40px, 3.4vw, 56px)', padding: '0 8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Logo />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SidebarItem icon={IconStatistic} label="Analisis Web" choose={page === 'analitik'} onClick={() => go('analitik')} />
          <SidebarItem icon={IconScreenMirror} label="Slideshow" choose={page === 'slideshow'} onClick={() => go('slideshow')} />

          <GroupBtn icon={IconBuildings} label="Profil" open={profilOpen} onToggle={toggleProfil} />
          {profilOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 16, gap: 2, marginTop: 2 }}>
              {subItem('Guru & Staff', 'gurustaf')}
              {subItem('Sambutan', 'sambutan')}
              {subItem('Tentang Kami', 'tentang')}
              {subItem('Visi & Misi', 'visimisi')}
              {subItem('Struktur Organisasi', 'struktur')}
              {subItem('Akreditasi', 'akreditasi')}
              {subItem('Statistik', 'statistik')}
            </div>
          )}

          <GroupBtn icon={IconNotification} label="Informasi" open={informasiOpen} onToggle={toggleInformasi} />
          {informasiOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 16, gap: 2, marginTop: 2 }}>
              {subItem('Berita', 'berita')}
              {subItem('Agenda', 'agenda')}
              {subItem('Fasilitas', 'fasilitas')}
              {subItem('Dokumen Rilis', 'dokumen')}
              {subItem('Majalah', 'majalah')}
            </div>
          )}

          <SidebarItem icon={IconSetting} label="Kelola Akun" choose={page === 'akun'} onClick={() => go('akun')} />
        </nav>

        {/* bottom section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', paddingTop: 'clamp(16px, 1.6vw, 24px)', borderTop: '1px solid #1E2D45' }}>
          <SidebarItem icon={IconInbox} label="Pemberitahuan" badge={notifCount > 0 ? String(notifCount) : null} onClick={onNotifOpen} />

          {/* user button + dropdown */}
          <div style={{ position: 'relative' }}>

            {/* dropdown menu — appears above the user button */}
            {userMenuOpen && (
              <>
                {/* overlay to close on outside click */}
                <div onClick={() => setUserMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0,
                  background: '#162236', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  overflow: 'hidden', zIndex: 10,
                }}>
                  {/* Detail Akun */}
                  <button
                    onClick={() => { setShowProfile(true); setUserMenuOpen(false) }}
                    style={{ width: '100%', height: 44, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', color: '#C8D0DC', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, transition: 'background .12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <IUser /> Detail Akun
                  </button>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 12px' }} />

                  {/* Keluar */}
                  <button
                    onClick={() => { setShowLogout(true); setUserMenuOpen(false) }}
                    style={{ width: '100%', height: 44, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', color: '#FF7C7C', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, transition: 'background .12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,100,100,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <IconExit size={16} stroke="#FF7C7C" /> Keluar
                  </button>
                </div>
              </>
            )}

            {/* user card button */}
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              style={{
                width: '100%', height: 'clamp(56px, 4.4vw, 72px)',
                borderRadius: 'var(--radius-lg)',
                background: userMenuOpen ? '#1A2C42' : 'var(--color-dark-blue)',
                border: userMenuOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                padding: '0 12px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={e => { if (!userMenuOpen) e.currentTarget.style.background = '#1A2C42' }}
              onMouseLeave={e => { if (!userMenuOpen) e.currentTarget.style.background = 'var(--color-dark-blue)' }}
            >
              {photoSrc ? (
                <img src={photoSrc} alt="" style={{ width: 'clamp(32px, 2.4vw, 40px)', height: 'clamp(32px, 2.4vw, 40px)', borderRadius: '50%', objectFit: 'cover', border: '1px solid #97A2B0', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 'clamp(32px, 2.4vw, 40px)', height: 'clamp(32px, 2.4vw, 40px)', borderRadius: '50%', background: '#046CF2', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'clamp(11px, 0.9vw, 15px)', color: '#fff', border: '1px solid #97A2B0' }}>
                  {profileName.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')}
                </div>
              )}
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 'var(--text-base)', lineHeight: 1.4, color: '#F9F9F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileName}</div>
                <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-xs)', lineHeight: 1.5, color: '#5D6B82' }}>Administrator</div>
              </div>
              <span style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', display: 'inline-flex' }}>
                <IconChevronDown size={16} stroke="#354764" />
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Profile modal */}
      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        name={profileName}
        photo={profilePhoto}
        onSave={({ name, photo }) => { setProfileName(name); setProfilePhoto(photo) }}
      />

      {/* Logout confirm modal */}
      <ConfirmModal
        open={showLogout}
        title="Keluar dari Aplikasi"
        message="Anda akan keluar dari sesi ini. Pastikan semua perubahan sudah tersimpan sebelum melanjutkan. Yakin ingin keluar?"
        confirmLabel="Ya, Keluar"
        onConfirm={() => { setShowLogout(false); onLogout() }}
        onClose={() => setShowLogout(false)}
      />
    </>
  )
}
