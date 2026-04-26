import { useState, useRef, useEffect } from 'react'
import Toggle from '../../components/Toggle'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { ConfirmModal } from '../../components/Modal'
import TextField from '../../components/TextField'
import { IconAdd, IconEdit, IconTrash, IconExit, IconEye, IconEyeSlash } from '../../components/Icons'
import { akunApi } from '../../lib/api'

// ── helpers ───────────────────────────────────────────────────────
const genPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nums  = '0123456789'
  const syms  = '@#$!'
  const all   = chars + upper + nums + syms
  const rand  = (str) => str[Math.floor(Math.random() * str.length)]
  let pw = rand(upper) + rand(nums) + rand(syms)
  for (let i = 0; i < 7; i++) pw += rand(all)
  return pw.split('').sort(() => Math.random() - .5).join('')
}

const initials = (name) =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')

const ROLE_COLORS = {
  operator: { bg: '#EAF0FE', color: '#2B5BE8', label: 'Operator' },
  user:     { bg: '#F0F9F4', color: '#007955', label: 'User' },
}

const AVATAR_PALETTES = [
  '#046CF2','#7C3AED','#DB2777','#D97706','#059669','#DC2626','#0891B2',
]
const avatarColor = (name) => AVATAR_PALETTES[name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_PALETTES.length]

const INITIAL_ACCOUNTS = [
  { id: 1, name: 'Budi Santoso',   username: 'budi.santoso',   password: 'Budi@2026#',  role: 'operator', active: true  },
  { id: 2, name: 'Sari Dewi',      username: 'sari.dewi',      password: 'SariD@0911!', role: 'user',     active: true  },
  { id: 3, name: 'Rian Prasetyo',  username: 'rian.prasetyo',  password: 'Rian#7743$',  role: 'user',     active: false },
]

const ROLE_OPTIONS = [
  { value: 'operator', label: 'Operator' },
  { value: 'user',     label: 'User' },
]

const ROLE_DESC = {
  operator: {
    title: 'Operator',
    items: [
      'Akses penuh ke seluruh menu konten',
      'Dapat menambah & mengelola akun (level User)',
      'Tidak dapat mengubah password sendiri',
      'Tidak dapat menghapus akun Operator lain',
    ],
  },
  user: {
    title: 'User',
    items: [
      'Akses menu Profil (Sambutan, Tentang, dll.)',
      'Akses menu Informasi (Berita, Agenda, dll.)',
      'Tidak dapat mengakses Kelola Akun & Slideshow',
      'Fokus pengisian konten saja',
    ],
  },
}

// ── RoleBadge ─────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.user
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: c.bg, color: c.color,
      padding: '3px 10px', borderRadius: 999,
      fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12,
    }}>{c.label}</span>
  )
}

// ── AccountRow ────────────────────────────────────────────────────
function AccountRow({ account, onEdit, onDelete, onToggle }) {
  const [hover, setHover] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const color = avatarColor(account.name)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', borderRadius: 'clamp(10px,.8vw,16px)',
        background: 'var(--color-card)',
        display: 'grid',
        gridTemplateColumns: 'minmax(260px,38%) 1fr auto',
        alignItems: 'center',
        transition: 'box-shadow var(--transition-base), transform var(--transition-base)',
        boxShadow: hover ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Avatar + name + role */}
      <div style={{ display: 'flex', gap: 'clamp(12px,1.2vw,20px)', padding: 'var(--space-md) var(--space-lg)', alignItems: 'center', minWidth: 0 }}>
        <div style={{
          width: 'clamp(40px,3.2vw,52px)', height: 'clamp(40px,3.2vw,52px)',
          borderRadius: '50%', background: color, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-base)', fontWeight: 700,
          fontSize: 'clamp(14px,1.1vw,18px)', color: '#fff',
        }}>
          {initials(account.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 'clamp(14px,1.05vw,17px)', color: 'var(--color-text-dark)', lineHeight: 1.3 }}>
            {account.name}
          </div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-light)', marginTop: 2 }}>
            @{account.username}
          </div>
          <div style={{ marginTop: 6 }}>
            <RoleBadge role={account.role} />
          </div>
        </div>
      </div>

      {/* Password (masked) */}
      <div className="cms-akun-pw" style={{ padding: 'var(--space-md) var(--space-lg)', minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Password</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--color-text-base)', letterSpacing: '.05em' }}>
            {showPw ? account.password : '•'.repeat(Math.min(account.password.length, 12))}
          </span>
          <button
            onClick={() => setShowPw(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'inline-flex', alignItems: 'center' }}
          >
            {showPw
              ? <IconEyeSlash size={16} stroke="var(--color-text-muted)" />
              : <IconEye     size={16} stroke="var(--color-text-muted)" />}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'clamp(8px,.8vw,14px)', padding: 'var(--space-md) var(--space-lg)', alignItems: 'center', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onEdit(account)}
          title="Edit"
          style={{ width: 'clamp(36px,2.5vw,44px)', height: 'clamp(36px,2.5vw,44px)', borderRadius: 'clamp(8px,.6vw,10px)', border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--transition-fast)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-card)'}
        >
          <IconEdit size={17} stroke="var(--color-text-base)" />
        </button>
        <button
          onClick={() => onDelete(account)}
          title="Hapus"
          style={{ width: 'clamp(36px,2.5vw,44px)', height: 'clamp(36px,2.5vw,44px)', borderRadius: 'clamp(8px,.6vw,10px)', border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--transition-fast)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FFEAEC'}
          onMouseLeave={e => e.currentTarget.style.background = '#FFF5F6'}
        >
          <IconTrash size={17} stroke="var(--color-error)" />
        </button>
        <Toggle on={account.active} onChange={v => onToggle(account.id, v)} />
      </div>
    </div>
  )
}

// ── AccountDrawer ─────────────────────────────────────────────────
function AccountDrawer({ account, onClose, onSave }) {
  const isEdit = !!account?.id
  const [name,     setName]     = useState(account?.name     || '')
  const [username, setUsername] = useState(account?.username || '')
  const [password, setPassword] = useState(account?.password || genPassword())
  const [role,     setRole]     = useState(account?.role     || 'user')
  const [showPw,   setShowPw]   = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim())     e.name     = 'Nama wajib diisi'
    if (!username.trim()) e.username = 'Username wajib diisi'
    if (username.includes(' ')) e.username = 'Username tidak boleh mengandung spasi'
    if (password.length < 8)   e.password  = 'Password minimal 8 karakter'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSave({ id: account?.id, name: name.trim(), username: username.trim().toLowerCase(), password, role })
    }, 700)
  }

  const color = avatarColor(name || 'A')

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 'var(--z-drawer-bd)', animation: 'cms-fade .2s ease' }} />
      <div style={{ position: 'fixed', top: 24, right: 24, bottom: 24, width: 'min(480px, calc(100vw - 48px))', background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: 32, display: 'flex', flexDirection: 'column', gap: 24, zIndex: 'var(--z-drawer)', boxShadow: 'var(--shadow-drawer)', animation: 'cms-slide-in .25s cubic-bezier(.2,.8,.2,1)', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, color: 'var(--color-text-dark)' }}>
            {isEdit ? 'Edit Akun' : 'Tambah Akun'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <IconExit size={24} stroke="var(--color-text-dark)" />
          </button>
        </div>

        {/* Avatar preview */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 28, color: '#fff' }}>
            {initials(name) || '?'}
          </div>
        </div>

        {/* Fields */}
        <TextField label="Nama Lengkap" required value={name} onChange={v => { setName(v); setErrors(e => ({ ...e, name: '' })) }} placeholder="mis. Budi Santoso" error={errors.name} />

        <TextField label="Username" required value={username} onChange={v => { setUsername(v); setErrors(e => ({ ...e, username: '' })) }} placeholder="mis. budi.santoso" helperText="Huruf kecil, tanpa spasi. Digunakan untuk login." error={errors.username} />

        {/* Password row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>
            Password <span style={{ color: 'var(--color-error-red)' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', border: `1px solid ${errors.password ? 'var(--color-error)' : 'var(--color-border)'}`, background: 'var(--color-card)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(ev => ({ ...ev, password: '' })) }}
                style={{ flex: 1, height: '100%', border: 'none', outline: 'none', padding: '0 14px', fontFamily: 'monospace', fontSize: 14, color: 'var(--color-text-dark)', background: 'transparent', letterSpacing: showPw ? '.05em' : '.15em' }}
              />
              <button onClick={() => setShowPw(v => !v)} style={{ padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                {showPw ? <IconEyeSlash size={18} stroke="var(--color-text-muted)" /> : <IconEye size={18} stroke="var(--color-text-muted)" />}
              </button>
            </div>
            <button
              onClick={() => setPassword(genPassword())}
              title="Generate password baru"
              style={{ height: 'var(--control-h)', padding: '0 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', cursor: 'pointer', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 13, color: 'var(--color-text-base)', whiteSpace: 'nowrap', transition: 'background var(--transition-fast)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
            >
              Generate
            </button>
          </div>
          {errors.password
            ? <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-error)' }}>{errors.password}</span>
            : <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-muted)' }}>Hanya admin master yang dapat mengatur password ini.</span>}
        </div>

        {/* Role select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Role</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ROLE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setRole(opt.value)}
                style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left',
                  border: `1.5px solid ${role === opt.value ? 'var(--color-blue)' : 'var(--color-border)'}`,
                  background: role === opt.value ? 'var(--color-blue-light)' : 'var(--color-card)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: role === opt.value ? 'var(--color-blue)' : 'var(--color-text-dark)', marginBottom: 2 }}>{opt.label}</div>
                <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: role === opt.value ? 'var(--color-blue)' : 'var(--color-text-muted)' }}>
                  {opt.value === 'operator' ? 'Akses penuh' : 'Konten saja'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Role description card */}
        <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', border: '1px solid var(--color-surface-3)' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-dark)', marginBottom: 8 }}>
            Akses role <RoleBadge role={role} />
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ROLE_DESC[role].items.map((item, i) => (
              <li key={i} style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-base)', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <ButtonSecondary onClick={onClose}>Batal</ButtonSecondary>
          <ButtonPrimary onClick={handleSave} loading={saving}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Akun'}
          </ButtonPrimary>
        </div>
      </div>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function KelolAkunPage({ fireSnack, fireNotif }) {
  const [accounts,   setAccounts]   = useState([])
  const [drawer,     setDrawer]     = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [loading,    setLoading]    = useState(true)

  const dbToUi = (a) => ({ id: a.id, name: a.name, username: a.username, password: a.password, role: a.role, active: a.is_active })

  const load = async () => {
    try {
      const data = await akunApi.getAll()
      setAccounts(data.map(dbToUi))
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal memuat', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd     = () => setDrawer({ isNew: true })
  const openEdit    = (acc) => setDrawer(acc)
  const closeDrawer = () => setDrawer(null)

  const handleToggle = async (id, value) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, active: value } : a))
    const acct = accounts.find(a => a.id === id)
    try {
      await akunApi.update(id, { is_active: value })
      fireSnack({ type: 'success', title: 'Berhasil', message: value ? 'Akun diaktifkan' : 'Akun dinonaktifkan' })
      fireNotif?.({ action: 'toggle', feature: 'Kelola Akun', item: acct?.username || '' })
    } catch (e) {
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, active: !value } : a))
      fireSnack({ type: 'error', title: 'Gagal', message: e.message })
    }
  }

  const handleSave = async (data) => {
    closeDrawer()
    try {
      const payload = { name: data.name, username: data.username, password: data.password, role: data.role, is_active: data.active ?? true }
      if (data.id) {
        await akunApi.update(data.id, payload)
        fireSnack({ type: 'success', title: 'Tersimpan', message: 'Data akun berhasil diperbarui' })
        fireNotif?.({ action: 'update', feature: 'Kelola Akun', item: data.username })
      } else {
        await akunApi.create(payload)
        fireSnack({ type: 'primary', title: 'Akun dibuat', message: `Akun @${data.username} berhasil ditambahkan` })
        fireNotif?.({ action: 'create', feature: 'Kelola Akun', item: data.username })
      }
      const fresh = await akunApi.getAll()
      setAccounts(fresh.map(dbToUi))
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menyimpan', message: e.message })
      akunApi.getAll().then(d => setAccounts(d.map(dbToUi))).catch(() => {})
    }
  }

  const handleDelete = async () => {
    const { id, username } = confirmDel
    setConfirmDel(null)
    setAccounts(prev => prev.filter(a => a.id !== id))
    try {
      await akunApi.remove(id)
      fireSnack({ type: 'success', title: 'Dihapus', message: `Akun @${username} telah dihapus` })
      fireNotif?.({ action: 'delete', feature: 'Kelola Akun', item: username })
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menghapus', message: e.message })
      akunApi.getAll().then(d => setAccounts(d.map(dbToUi))).catch(() => {})
    }
  }

  const activeCount = accounts.filter(a => a.active).length

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-base)', color: 'var(--color-text-light)' }}>Memuat data…</div>

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>
            Kelola Akun
          </div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Kelola akun operator & user untuk pengisian konten.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>
              {accounts.length} akun · {activeCount} aktif
            </span>
          </div>
        </div>
        <ButtonPrimary onClick={openAdd}>
          <IconAdd size={18} stroke="#fff" /> Tambah Akun
        </ButtonPrimary>
      </div>

      {/* Column headers */}
      <div className="cms-col-headers" style={{
        width: '100%', display: 'grid',
        gridTemplateColumns: 'minmax(260px,38%) 1fr auto',
        padding: '0 var(--space-lg)',
        fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 'clamp(11px,.8vw,14px)',
        color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        <div>Akun</div>
        <div className="cms-akun-pw">Password</div>
        <div style={{ textAlign: 'right', minWidth: 120 }}>Aksi</div>
      </div>

      {/* Account list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,1.2vw,20px)' }}>
        {accounts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-muted)' }}>
            Belum ada akun. Tambah akun pertama untuk memulai.
          </div>
        ) : accounts.map(acc => (
          <AccountRow
            key={acc.id}
            account={acc}
            onEdit={openEdit}
            onDelete={setConfirmDel}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Drawer */}
      {drawer && (
        <AccountDrawer
          account={drawer.isNew ? null : drawer}
          onClose={closeDrawer}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      <ConfirmModal
        open={!!confirmDel}
        title="Hapus Akun"
        message={confirmDel ? `Hapus akun @${confirmDel.username}? Tindakan ini tidak dapat dibatalkan.` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
        onClose={() => setConfirmDel(null)}
      />
    </>
  )
}
