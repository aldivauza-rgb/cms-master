import { useState, useMemo, useRef, useEffect } from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import TextField from '../../components/TextField'
import SearchInput from '../../components/SearchInput'
import Select from '../../components/Select'
import StatusBadge from '../../components/StatusBadge'
import { ConfirmModal } from '../../components/Modal'
import TableFooter from '../../components/TableFooter'
import FilterPopover from '../../components/FilterPopover'
import RichEditor from '../../components/RichEditor'
import { IconAdd, IconEdit, IconTrash, IconExport, IconBack, IconCalendar } from '../../components/Icons'
import avatarUrl   from '../../assets/avatar.png'
import slideRowUrl from '../../assets/slide-row.jpg'
import slideDefUrl from '../../assets/slide-default.jpg'
import { agendaApi } from '../../lib/api'
import { uploadToStorage } from '../../lib/upload'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const fmtShort = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}` }
const iso = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0,10) }
const daysUntil = (isoStr) => {
  const today = new Date(); today.setHours(0,0,0,0)
  const ev = new Date(isoStr); ev.setHours(0,0,0,0)
  return Math.round((ev - today) / 86400000)
}

const INITIAL_AGENDA = [
  { id: 1, title: 'Upacara Hari Otonomi Daerah',      organizer: 'Pemerintah Daerah',  location: 'Alun-Alun Kota',         date: iso(2),   time: '08:00', publisher: 'Admin Humas',  status: 'terbit', thumb: slideRowUrl },
  { id: 2, title: 'Musrenbang Kelurahan 2026',         organizer: 'Bappeda',            location: 'Aula Kantor Kelurahan',  date: iso(5),   time: '09:00', publisher: 'Admin Humas',  status: 'terbit', thumb: slideDefUrl },
  { id: 3, title: 'Festival Budaya Nusantara',         organizer: 'Dinas Pariwisata',   location: 'Taman Kota',             date: iso(9),   time: '16:00', publisher: 'Admin Humas',  status: 'terbit', thumb: slideRowUrl },
  { id: 4, title: 'Pelatihan UMKM Digital',            organizer: 'Dinas Koperasi',     location: 'Balai Latihan Kerja',    date: iso(12),  time: '13:00', publisher: 'Diskominfo',   status: 'terbit', thumb: slideDefUrl },
  { id: 5, title: 'Sosialisasi Program Bansos',        organizer: 'Dinas Sosial',       location: 'Balai Kota',             date: iso(18),  time: '10:00', publisher: 'Admin Humas',  status: 'draf',   thumb: '' },
  { id: 6, title: 'Lomba Kebersihan Lingkungan',       organizer: 'Dinas LH',           location: 'Seluruh Kelurahan',      date: iso(25),  time: '07:00', publisher: 'Admin Humas',  status: 'terbit', thumb: slideRowUrl },
  { id: 7, title: 'Peringatan HUT Kota ke-78',         organizer: 'Pemerintah Daerah',  location: 'Lapangan Merdeka',       date: iso(-5),  time: '19:00', publisher: 'Admin Humas',  status: 'terbit', thumb: slideDefUrl },
  { id: 8, title: 'Rapat Kerja SKPD Triwulan I',      organizer: 'Sekretariat',        location: 'Ruang Rapat Balai Kota', date: iso(-12), time: '09:00', publisher: 'Sekretariat',  status: 'terbit', thumb: '' },
]

function CountdownChip({ date }) {
  const d = daysUntil(date)
  let label, bg, color
  if (d < 0)       { label = 'Sudah lewat'; bg = '#F1F2F5'; color = '#5D6B82' }
  else if (d === 0) { label = 'Hari ini';   bg = '#FFF0E0'; color = '#B35A00' }
  else if (d <= 7)  { label = `H-${d}`;     bg = '#FFE8EA'; color = '#B3202F' }
  else if (d <= 30) { label = `${d} hari lagi`; bg = '#E8F1FE'; color = '#046CF2' }
  else               { label = `${d} hari lagi`; bg = '#F1F2F5'; color = '#354764' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, background: bg, color, fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 11, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

const FILTER_SECTIONS = [{
  label: 'Agenda',
  fields: [
    { key: 'timing', label: 'Waktu', placeholder: 'Semua Agenda', span: 2, options: [{ value: 'upcoming', label: 'Akan datang' }, { value: 'thisweek', label: 'Minggu ini (H-7)' }, { value: 'past', label: 'Sudah lewat' }] },
    { key: 'month',  label: 'Bulan Event', placeholder: 'Pilih Bulan', options: MONTHS.map((m,i) => ({ value: String(i), label: m })) },
    { key: 'year',   label: 'Tahun Event', placeholder: 'Pilih Tahun', options: [2026,2025,2024].map(y => ({ value: String(y), label: String(y) })) },
    { key: 'status', label: 'Status',      placeholder: 'Pilih Status', span: 2, options: [{ value: 'terbit', label: 'Terbit' }, { value: 'draf', label: 'Draf' }] },
  ],
}]

function AgendaList({ items, onAdd, onEdit, onDelete, fireSnack, fireNotif }) {
  const [search,   setSearch]   = useState('')
  const [filters,  setFilters]  = useState({ month: '', year: '', status: '', timing: '' })
  const [pageSize, setPageSize] = useState(10)
  const [page,     setPage]     = useState(1)
  const [confirmDel, setConfirmDel] = useState(null)

  const sorted = useMemo(() => [...items].sort((a, b) => new Date(a.date) - new Date(b.date)), [items])

  const filtered = useMemo(() => sorted.filter(n => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !(n.organizer || '').toLowerCase().includes(search.toLowerCase())) return false
    const d = new Date(n.date)
    if (filters.month !== '' && d.getMonth() !== Number(filters.month)) return false
    if (filters.year  !== '' && d.getFullYear() !== Number(filters.year)) return false
    if (filters.status !== '' && n.status !== filters.status) return false
    if (filters.timing) {
      const du = daysUntil(n.date)
      if (filters.timing === 'upcoming' && du < 0) return false
      if (filters.timing === 'thisweek' && !(du >= 0 && du <= 7)) return false
      if (filters.timing === 'past' && du >= 0) return false
    }
    return true
  }), [sorted, search, filters])

  const upcomingTop3 = useMemo(() => sorted.filter(n => n.status === 'terbit' && daysUntil(n.date) >= 0).slice(0, 3), [sorted])
  const activeCount  = Object.values(filters).filter(v => v !== '').length
  const pageCount    = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems    = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Agenda</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Kelola agenda event &amp; kegiatan.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>{items.length} total · {items.filter(n => n.status === 'terbit').length} terbit</span>
          </div>
        </div>
        <ButtonPrimary onClick={onAdd}><IconAdd size={18} stroke="#fff" /> Tambah Agenda</ButtonPrimary>
      </div>

      {/* Highlight banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-blue-light) 0%, #F5F9FF 100%)', border: '1px solid #CFE3FD', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-blue)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconCalendar size={20} stroke="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 15, color: 'var(--color-text-dark)' }}>Highlight Landing Page</div>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', lineHeight: 1.5, marginTop: 2 }}>3 agenda terdekat otomatis ditampilkan di landing page.</div>
          </div>
        </div>
        {upcomingTop3.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }} className="ag-highlight-grid">
            {upcomingTop3.map((n, i) => (
              <div key={n.id} style={{ background: 'var(--color-card)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center', border: '1px solid var(--color-border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--color-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontFamily: 'var(--font-base)', lineHeight: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{new Date(n.date).getDate()}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, marginTop: 2, opacity: .85 }}>{MONTHS[new Date(n.date).getMonth()].slice(0,3).toUpperCase()}</div>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-base)', fontSize: 10, fontWeight: 700, color: 'var(--color-text-light)', letterSpacing: '0.06em' }}>#{i+1}</span>
                    <CountdownChip date={n.date}/>
                  </div>
                  <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                  <div style={{ fontFamily: 'var(--font-base)', fontSize: 11, color: 'var(--color-text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.location}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-light)', padding: '8px 0' }}>Belum ada agenda mendatang yang terbit.</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px', minWidth: 220, maxWidth: 480 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Cari judul atau penyelenggara" />
        </div>
        <FilterPopover sections={FILTER_SECTIONS} values={filters} activeCount={activeCount}
          onChange={v => { setFilters(v); setPage(1) }}
          onResetAll={v => { setFilters(v); setSearch(''); setPage(1) }} />
      </div>

      <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1040 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                {['Agenda','Tanggal Event','Penyelenggara','Lokasi','Dipublikasikan oleh','Status','Aksi'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: i === 6 ? 'right' : 'left', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 60, textAlign: 'center', color: 'var(--color-text-light)', fontFamily: 'var(--font-base)', fontSize: 14 }}>Tidak ada agenda yang cocok dengan filter.</td></tr>
              ) : pageItems.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid var(--color-surface-3)' }}>
                  <td style={{ padding: '14px 20px', maxWidth: 320 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {n.thumb
                        ? <img src={n.thumb} alt="" style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}/>
                        : <span style={{ width: 72, height: 48, borderRadius: 6, background: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconCalendar size={18} stroke="var(--color-blue)"/></span>}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.title}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-dark)', fontWeight: 500 }}>{fmtShort(n.date)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontFamily: 'var(--font-base)', fontSize: 11, color: 'var(--color-text-light)' }}>{n.time || '—'}</span>
                      <CountdownChip date={n.date}/>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{n.organizer}</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{n.location || '—'}</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{n.publisher}</td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={n.status}/></td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => onEdit(n)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit size={16} stroke="var(--color-text-base)"/></button>
                      <button onClick={() => setConfirmDel(n)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconTrash size={16} stroke="var(--color-error)"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TableFooter page={page} pageCount={pageCount} pageSize={pageSize} filtered={filtered.length}
          onPageChange={setPage} onPageSizeChange={n => { setPageSize(n); setPage(1) }} />
      </div>

      <ConfirmModal open={!!confirmDel} title="Hapus Agenda"
        message={confirmDel ? `Apakah kamu yakin ingin menghapus "${confirmDel.title}"?` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { onDelete(confirmDel.id); fireSnack({ type: 'success', title: 'Berhasil', message: 'Agenda telah dihapus' }); fireNotif?.({ action: 'delete', feature: 'Agenda', item: confirmDel.title }); setConfirmDel(null) }}
        onClose={() => setConfirmDel(null)} />
    </>
  )
}

function AgendaForm({ initial, onBack, onSave, fireSnack }) {
  const isEdit = !!initial?.id
  const [title,     setTitle]     = useState(initial?.title     || '')
  const [organizer, setOrganizer] = useState(initial?.organizer || '')
  const [location,  setLocation]  = useState(initial?.location  || '')
  const [date,      setDate]      = useState(initial?.date      || '')
  const [time,      setTime]      = useState(initial?.time      || '')
  const [content,   setContent]   = useState(initial?.content   || '')
  const [thumb,     setThumb]     = useState(initial?.thumb     || '')
  const [dragging,  setDragging]  = useState(false)
  const [confirmType, setConfirmType] = useState(null)
  const [saving,    setSaving]    = useState(false)
  const fileRef = useRef()

  const pickFile = (f) => {
    if (!f) return
    const url = URL.createObjectURL(f)
    setThumb(url)
  }

  const isDirty = title || organizer || location || date || time || content || thumb
  const requestBack = () => { if (isDirty && !isEdit) setConfirmType('exit'); else onBack() }

  const validate = () => {
    if (!title.trim())     { fireSnack({ type: 'error', title: 'Gagal', message: 'Judul agenda wajib diisi' });     return false }
    if (!organizer.trim()) { fireSnack({ type: 'error', title: 'Gagal', message: 'Penyelenggara wajib diisi' });   return false }
    if (!date)             { fireSnack({ type: 'error', title: 'Gagal', message: 'Tanggal event wajib diisi' });   return false }
    if (!thumb)            { fireSnack({ type: 'error', title: 'Gagal', message: 'Thumbnail wajib diunggah' });    return false }
    return true
  }

  const doSave = (status) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSave({ id: initial?.id, title: title.trim(), organizer: organizer.trim(), location: location.trim(), date, time, content, thumb, publisher: 'Admin Humas', status })
      setConfirmType(null)
    }, 700)
  }

  const eventPreview = date ? (() => {
    const du = daysUntil(date)
    if (du < 0) return `${Math.abs(du)} hari yang lalu`
    if (du === 0) return 'Hari ini'
    if (du === 1) return 'Besok'
    return `${du} hari lagi`
  })() : ''

  return (
    <>
      <button onClick={requestBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, color: 'var(--color-text-dark)' }}>
        <IconBack size={18} stroke="var(--color-text-dark)"/> Kembali
      </button>
      <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: 'clamp(20px, 2.4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, color: 'var(--color-text-dark)' }}>{isEdit ? 'Edit Agenda' : 'Tambah Agenda'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 24 }} className="cms-form-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <TextField label="Judul Agenda" required value={title} onChange={setTitle} placeholder="mis. Festival Budaya Nusantara" />
            <TextField label="Penyelenggara" required value={organizer} onChange={setOrganizer} placeholder="mis. Dinas Pariwisata" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Tanggal Event <span style={{ color: 'var(--color-error-red)' }}>*</span></label>
                <div style={{ height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', background: 'var(--color-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                  <IconCalendar size={18} stroke="var(--color-text-light)"/>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', color: 'var(--color-text-dark)' }}/>
                </div>
                {eventPreview && <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-blue)', fontWeight: 500 }}>{eventPreview}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Waktu (opsional)</label>
                <div style={{ height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', background: 'var(--color-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--color-text-light)" strokeWidth="1.8"/><path d="M12 7v5l3 2" stroke="var(--color-text-light)" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', color: 'var(--color-text-dark)' }}/>
                </div>
              </div>
            </div>
            <TextField label="Lokasi" value={location} onChange={setLocation} placeholder="mis. Taman Kota" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Dipublikasikan oleh</label>
              <div style={{ height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
                <img src={avatarUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}/>
                <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', color: 'var(--color-text-dark)', fontWeight: 500 }}>Admin Humas</span>
                <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>· otomatis</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Deskripsi</label>
              <RichEditor value={content} onChange={setContent} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Thumbnail Agenda <span style={{ color: 'var(--color-error-red)' }}>*</span></label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files?.[0]) }}
                style={{ position: 'relative', cursor: 'pointer', background: dragging ? '#F0F7FF' : 'var(--color-surface-2)', border: `1px dashed ${dragging ? 'var(--color-blue)' : '#CCD4E0'}`, borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '16/9', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s ease' }}>
                {thumb ? (
                  <>
                    <img src={thumb} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent 45%)' }}/>
                    <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 8 }}>
                      <button onClick={e => { e.stopPropagation(); fileRef.current?.click() }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.95)', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 13, fontWeight: 500, color: 'var(--color-text-base)' }}>Ganti</button>
                      <button onClick={e => { e.stopPropagation(); setThumb('') }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'rgba(255,84,92,0.95)', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 13, fontWeight: 500, color: '#fff' }}>Hapus</button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 16, textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconCalendar size={26} stroke="var(--color-blue)"/>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)' }}>Unggah thumbnail, atau <span style={{ color: 'var(--color-blue)' }}>telusuri</span></div>
                      <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', marginTop: 4 }}>Rasio 16:9 · JPG/PNG · maks 5MB</div>
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={e => pickFile(e.target.files?.[0])} style={{ display: 'none' }}/>
              </div>
            </div>
            <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--color-surface-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCalendar size={16} stroke="var(--color-blue)"/>
                </div>
                <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 14, color: 'var(--color-text-dark)' }}>Tampil di Landing Page</div>
              </div>
              <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', lineHeight: 1.6 }}>Agenda yang <strong>Terbit</strong> &amp; termasuk 3 terdekat akan otomatis muncul di highlight landing page mulai <strong>H-7</strong>.</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--color-surface-3)' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>* Agenda tersimpan sebagai draf bila tidak diterbitkan.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonSecondary onClick={requestBack}>Batal</ButtonSecondary>
            <ButtonSecondary onClick={() => { if (validate()) setConfirmType('draf') }}>Simpan sebagai Draf</ButtonSecondary>
            <ButtonPrimary onClick={() => { if (validate()) setConfirmType('terbit') }}><IconExport size={16} stroke="#fff"/> Simpan &amp; Terbitkan</ButtonPrimary>
          </div>
        </div>
      </div>
      <ConfirmModal open={confirmType === 'draf'}   title="Simpan sebagai Draf"     message="Agenda akan disimpan tanpa dipublikasikan."     confirmLabel="Ya, Simpan"     loading={saving} onConfirm={() => doSave('draf')}   onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'terbit'} title="Terbitkan Agenda"         message="Agenda akan dipublikasikan ke landing page."    confirmLabel="Ya, Terbitkan" loading={saving} onConfirm={() => doSave('terbit')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'exit'}   title="Keluar tanpa menyimpan?"  message="Perubahan yang belum disimpan akan hilang."     confirmLabel="Ya, Keluar"    onConfirm={() => { setConfirmType(null); onBack() }}   onClose={() => setConfirmType(null)} />
    </>
  )
}

export default function AgendaPage({ fireSnack, fireNotif }) {
  const [items,   setItems]   = useState([])
  const [editing, setEditing] = useState(null)
  const [view,    setView]    = useState('list')
  const [loading, setLoading] = useState(true)

  const dbToUi = (n) => ({
    id: n.id, title: n.title,
    organizer: n.organizer || '',
    location: n.lokasi || '',
    date: n.tanggal || '',
    time: n.waktu || '',
    content: n.deskripsi || '',
    thumb: n.thumb_url || '',
    publisher: n.publisher || '',
    status: n.status,
  })

  const load = async () => {
    try {
      const data = await agendaApi.getAll()
      setItems(data.map(dbToUi))
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal memuat', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (data) => {
    setView('list'); setEditing(null)
    try {
      const thumbUrl = await uploadToStorage(data.thumb, 'agenda', 'thumbs/')
      const payload = {
        title: data.title, organizer: data.organizer,
        tanggal: data.date || null, waktu: data.time || null,
        lokasi: data.location, deskripsi: data.content,
        thumb_url: thumbUrl || data.thumb || null,
        publisher: data.publisher || 'Admin',
        status: data.status,
      }
      if (data.id) await agendaApi.update(data.id, payload)
      else await agendaApi.create(payload)
      const fresh = await agendaApi.getAll()
      setItems(fresh.map(dbToUi))
      fireSnack({ type: data.status === 'terbit' ? 'primary' : 'success', title: 'Berhasil', message: data.status === 'terbit' ? 'Agenda diterbitkan' : 'Agenda tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : (data.id ? 'update' : 'create'), feature: 'Agenda', item: data.title })
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menyimpan', message: e.message })
      agendaApi.getAll().then(d => setItems(d.map(dbToUi))).catch(() => {})
    }
  }

  const handleDelete = async (id) => {
    setItems(prev => prev.filter(n => n.id !== id))
    try {
      await agendaApi.remove(id)
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menghapus', message: e.message })
      agendaApi.getAll().then(d => setItems(d.map(dbToUi))).catch(() => {})
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-base)', color: 'var(--color-text-light)' }}>Memuat data…</div>

  if (view === 'form') return <AgendaForm initial={editing} onBack={() => setView('list')} onSave={handleSave} fireSnack={fireSnack} />
  return <AgendaList items={items} onAdd={() => { setEditing(null); setView('form') }} onEdit={n => { setEditing(n); setView('form') }} onDelete={handleDelete} fireSnack={fireSnack} fireNotif={fireNotif} />
}
