import { useState, useMemo, useRef } from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import TextField from '../../components/TextField'
import SearchInput from '../../components/SearchInput'
import Select from '../../components/Select'
import StatusBadge from '../../components/StatusBadge'
import { ConfirmModal } from '../../components/Modal'
import Pagination from '../../components/Pagination'
import TableFooter from '../../components/TableFooter'
import FilterPopover from '../../components/FilterPopover'
import RichEditor from '../../components/RichEditor'
import {
  IconAdd, IconEdit, IconTrash, IconExport, IconBack,
  IconTag, IconFilter, IconCalendar, IconImage,
} from '../../components/Icons'
import avatarUrl     from '../../assets/avatar.png'
import slideRowUrl   from '../../assets/slide-row.jpg'
import slideDefUrl   from '../../assets/slide-default.jpg'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const fmtDate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` }

const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'Semua', locked: true },
  { id: 'pengumuman', label: 'Pengumuman' },
  { id: 'kesehatan',  label: 'Kesehatan' },
  { id: 'acara',      label: 'Acara' },
  { id: 'pembangunan',label: 'Pembangunan' },
  { id: 'pendidikan', label: 'Pendidikan' },
]

const INITIAL_NEWS = [
  { id:  1, title: 'Pembukaan Gedung Layanan Publik Baru',            author: 'Admin Humas',       date: '2026-04-14', status: 'terbit', category: 'pengumuman',  thumb: slideRowUrl,  content: '<p>Pemerintah meresmikan gedung layanan terpadu baru.</p>' },
  { id:  2, title: 'Program Vaksinasi Lanjutan Dimulai Minggu Ini',   author: 'Redaksi',            date: '2026-04-10', status: 'terbit', category: 'kesehatan',   thumb: slideDefUrl,  content: '<p>Program vaksinasi lanjutan kembali dibuka.</p>' },
  { id:  3, title: 'Festival Budaya Tahunan Akan Digelar Bulan Depan',author: 'Admin Humas',       date: '2026-04-03', status: 'draf',   category: 'acara',       thumb: slideRowUrl,  content: '<p>Persiapan festival budaya tahunan mulai dilakukan.</p>' },
  { id:  4, title: 'Pembenahan Infrastruktur Jalan Utama',            author: 'Dinas PU',           date: '2026-03-28', status: 'terbit', category: 'pembangunan', thumb: slideDefUrl,  content: '<p>Proyek pembenahan jalan utama dijadwalkan selesai Juni.</p>' },
  { id:  5, title: 'Pendaftaran Beasiswa Pendidikan Dibuka',          author: 'Dinas Pendidikan',   date: '2026-03-22', status: 'terbit', category: 'pendidikan',  thumb: slideRowUrl,  content: '<p>Beasiswa terbuka bagi siswa berprestasi.</p>' },
  { id:  6, title: 'Sosialisasi Aplikasi Layanan Warga',              author: 'Admin Humas',       date: '2026-03-15', status: 'draf',   category: 'pengumuman',  thumb: slideDefUrl,  content: '<p>Aplikasi baru mempermudah akses layanan.</p>' },
  { id:  7, title: 'Pembaruan Jadwal Transportasi Umum',              author: 'Dinas Perhubungan',  date: '2026-03-02', status: 'terbit', category: 'pengumuman',  thumb: slideRowUrl,  content: '<p>Jadwal baru transportasi umum berlaku mulai April.</p>' },
  { id:  8, title: 'Pameran UMKM Lokal Sukses Digelar',              author: 'Redaksi',            date: '2026-02-26', status: 'terbit', category: 'acara',       thumb: slideDefUrl,  content: '<p>Pameran UMKM menarik lebih dari 5000 pengunjung.</p>' },
  { id:  9, title: 'Peluncuran Portal Data Terbuka',                  author: 'Diskominfo',         date: '2026-02-18', status: 'terbit', category: 'pengumuman',  thumb: slideRowUrl,  content: '<p>Portal data terbuka resmi diluncurkan.</p>' },
  { id: 10, title: 'Kerja Bakti Warga Pesisir',                      author: 'Admin Humas',       date: '2026-02-10', status: 'draf',   category: 'acara',       thumb: slideDefUrl,  content: '<p>Kegiatan kerja bakti dilakukan di pesisir utara.</p>' },
  { id: 11, title: 'Capaian Vaksinasi Kota Capai 95%',               author: 'Dinas Kesehatan',    date: '2026-01-30', status: 'terbit', category: 'kesehatan',   thumb: slideRowUrl,  content: '<p>Capaian vaksinasi di atas rata-rata nasional.</p>' },
  { id: 12, title: 'Rencana Taman Kota Baru',                        author: 'Dinas Tata Kota',    date: '2026-01-18', status: 'draf',   category: 'pembangunan', thumb: slideDefUrl,  content: '<p>Taman kota baru akan dibangun tahun ini.</p>' },
]

const FILTER_SECTIONS = (categories) => [{
  label: 'Berita',
  fields: [
    { key: 'month', label: 'Bulan',    placeholder: 'Pilih Bulan',     options: MONTHS.map((m,i) => ({ value: String(i), label: m })) },
    { key: 'year',  label: 'Tahun',    placeholder: 'Pilih Tahun',     options: [2026,2025,2024,2023].map(y => ({ value: String(y), label: String(y) })) },
    { key: 'status',label: 'Status',   placeholder: 'Pilih Status',    options: [{ value: 'terbit', label: 'Terbit' }, { value: 'draf', label: 'Draf' }] },
    { key: 'category', label: 'Kategori', placeholder: 'Pilih Kategori', options: categories.filter(c => c.id !== 'all').map(c => ({ value: c.id, label: c.label })) },
  ],
}]

function BeritaList({ news, categories, onAdd, onManageCategories, onEdit, onDelete, fireSnack, fireNotif }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ month: '', year: '', status: '', category: '' })
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [confirmDel, setConfirmDel] = useState(null)

  const catLabel = (id) => categories.find(c => c.id === id)?.label || id

  const filtered = useMemo(() => news.filter(n => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.author.toLowerCase().includes(search.toLowerCase())) return false
    const d = new Date(n.date)
    if (filters.month !== '' && d.getMonth() !== Number(filters.month)) return false
    if (filters.year  !== '' && d.getFullYear() !== Number(filters.year)) return false
    if (filters.status   !== '' && n.status   !== filters.status) return false
    if (filters.category !== '' && n.category !== filters.category) return false
    return true
  }), [news, search, filters])

  const activeCount = Object.values(filters).filter(v => v !== '').length
  const pageCount   = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems   = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Berita</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Kelola artikel berita yang tampil di website.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>{news.length} total · {news.filter(n => n.status === 'terbit').length} terbit</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={onManageCategories} style={{
            height: 'var(--control-h)', padding: '0 clamp(16px, 1.4vw, 24px)',
            borderRadius: 'var(--radius-lg)', border: 'none', cursor: 'pointer',
            background: 'var(--color-navy)', color: '#F9F9F9',
            fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 'var(--text-md)', lineHeight: 1,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <IconTag size={18} stroke="#F9F9F9" /> Atur Kategori
          </button>
          <ButtonPrimary onClick={onAdd}><IconAdd size={18} stroke="#fff" /> Tambah Berita</ButtonPrimary>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px', minWidth: 220, maxWidth: 480 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Cari Sesuatu" />
        </div>
        <FilterPopover
          sections={FILTER_SECTIONS(categories)}
          values={filters}
          activeCount={activeCount}
          onChange={v => { setFilters(v); setPage(1) }}
          onResetAll={v => { setFilters(v); setSearch(''); setPage(1) }}
        />
      </div>

      <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                {['Thumbnail','Judul','Tanggal','Penulis','Status','Aksi'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: i === 5 ? 'right' : 'left', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center', color: 'var(--color-text-light)', fontFamily: 'var(--font-base)', fontSize: 14 }}>Tidak ada berita yang cocok dengan filter.</td></tr>
              ) : pageItems.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid var(--color-surface-3)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ width: 80, height: 52, borderRadius: 8, background: `url(${n.thumb}) center/cover no-repeat, var(--color-border)` }}/>
                  </td>
                  <td style={{ padding: '14px 20px', maxWidth: 360 }}>
                    <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', marginBottom: 4, lineHeight: 1.4 }}>{n.title}</div>
                    <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>{catLabel(n.category)}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', whiteSpace: 'nowrap' }}>{fmtDate(n.date)}</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{n.author}</td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={n.status}/></td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => onEdit(n)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconEdit size={16} stroke="var(--color-text-base)"/>
                      </button>
                      <button onClick={() => setConfirmDel(n)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconTrash size={16} stroke="var(--color-error)"/>
                      </button>
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

      <ConfirmModal open={!!confirmDel} title="Hapus Berita"
        message={confirmDel ? `Apakah kamu yakin ingin menghapus "${confirmDel.title}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { onDelete(confirmDel.id); fireSnack({ type: 'success', title: 'Berhasil', message: 'Berita telah dihapus' }); fireNotif?.({ action: 'delete', feature: 'Berita', item: confirmDel.title }); setConfirmDel(null) }}
        onClose={() => setConfirmDel(null)} />
    </>
  )
}

function KategoriPage({ categories, news, onBack, onAdd, onDelete, fireSnack }) {
  const [newLabel, setNewLabel] = useState('')
  const [confirmDel, setConfirmDel] = useState(null)

  const counts = useMemo(() => {
    const out = {}
    for (const n of news) out[n.category] = (out[n.category] || 0) + 1
    out.all = news.length
    return out
  }, [news])

  const handleAdd = () => {
    const label = newLabel.trim()
    if (!label) { fireSnack({ type: 'error', title: 'Gagal', message: 'Nama kategori wajib diisi' }); return }
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (categories.some(c => c.id === id || c.label.toLowerCase() === label.toLowerCase())) {
      fireSnack({ type: 'error', title: 'Gagal', message: 'Kategori dengan nama tersebut sudah ada' }); return
    }
    onAdd({ id, label }); setNewLabel('')
    fireSnack({ type: 'success', title: 'Berhasil', message: `Kategori "${label}" ditambahkan` })
  }

  return (
    <>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, color: 'var(--color-text-dark)' }}>
        <IconBack size={18} stroke="var(--color-text-dark)"/> Kembali
      </button>
      <div>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Atur Kategori</div>
        <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
          Tambah atau hapus kategori berita. Saat kategori dihapus, berita di dalamnya dipindahkan ke{' '}
          <span style={{ fontWeight: 500, color: 'var(--color-text-base)' }}>"Semua"</span>.
        </div>
      </div>
      <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: 'clamp(20px, 2.4vw, 28px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)', display: 'block', marginBottom: 6 }}>Tambah Kategori Baru</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px', minWidth: 220 }}>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
                placeholder="cth. Olahraga, Pariwisata…"
                style={{ width: '100%', height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '0 16px', fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', color: 'var(--color-text-dark)', outline: 'none', background: 'var(--color-card)' }} />
            </div>
            <ButtonPrimary onClick={handleAdd}><IconAdd size={18} stroke="#fff" /> Tambah</ButtonPrimary>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--color-surface-3)' }}/>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', marginBottom: 12 }}>
            Daftar Kategori <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>· {categories.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categories.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: '1px solid var(--color-surface-3)', background: c.locked ? 'var(--color-surface-2)' : 'var(--color-card)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: c.locked ? 'var(--color-surface-3)' : 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconTag size={18} stroke={c.locked ? 'var(--color-text-base)' : 'var(--color-blue)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {c.label}
                    {c.locked && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'var(--color-surface-3)', color: 'var(--color-text-base)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Default</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', marginTop: 2 }}>{counts[c.id] || 0} berita</div>
                </div>
                {!c.locked
                  ? <button onClick={() => setConfirmDel(c)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconTrash size={16} stroke="var(--color-error)"/>
                    </button>
                  : <div style={{ fontFamily: 'var(--font-base)', fontSize: 11, color: 'var(--color-text-muted)' }}>Tidak dapat dihapus</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConfirmModal open={!!confirmDel} title="Hapus Kategori"
        message={confirmDel ? `Hapus kategori "${confirmDel.label}"? ${(counts[confirmDel.id] || 0) > 0 ? `${counts[confirmDel.id]} berita akan dipindahkan ke "Semua".` : 'Tidak ada berita di kategori ini.'}` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { onDelete(confirmDel.id); fireSnack({ type: 'success', title: 'Berhasil', message: `Kategori dihapus` }); setConfirmDel(null) }}
        onClose={() => setConfirmDel(null)} />
    </>
  )
}

function BeritaForm({ initial, categories, onBack, onSave, fireSnack }) {
  const isEdit = !!initial?.id
  const today  = new Date().toISOString().slice(0, 10)
  const [title,    setTitle]    = useState(initial?.title    || '')
  const [content,  setContent]  = useState(initial?.content  || '')
  const [category, setCategory] = useState(initial?.category || '')
  const [thumb,    setThumb]    = useState(initial?.thumb    || '')
  const [dragging, setDragging] = useState(false)
  const [confirmType, setConfirmType] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setThumb(e.target.result)
    reader.readAsDataURL(file)
  }

  const isDirty = title || content || thumb || category
  const requestBack = () => { if (isDirty && !isEdit) setConfirmType('exit'); else onBack() }

  const validate = () => {
    if (!title.trim()) { fireSnack({ type: 'error', title: 'Gagal', message: 'Judul berita wajib diisi' }); return false }
    if (!category)     { fireSnack({ type: 'error', title: 'Gagal', message: 'Kategori wajib dipilih'  }); return false }
    return true
  }

  const doSave = (status) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSave({ id: initial?.id, title: title.trim(), content, category, thumb, author: 'Admin Humas', date: initial?.date || today, status })
      setConfirmType(null)
    }, 700)
  }

  const catOpts = categories.filter(c => c.id !== 'all').map(c => ({ value: c.id, label: c.label }))

  return (
    <>
      <button onClick={requestBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, color: 'var(--color-text-dark)' }}>
        <IconBack size={18} stroke="var(--color-text-dark)"/> Kembali
      </button>
      <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: 'clamp(20px, 2.4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, color: 'var(--color-text-dark)' }}>{isEdit ? 'Edit Berita' : 'Tambah Berita'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }} className="cms-form-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <TextField label="Judul Berita" required value={title} onChange={setTitle} placeholder="Masukkan judul berita" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Penulis</label>
              <div style={{ height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
                <img src={avatarUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}/>
                <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', color: 'var(--color-text-dark)', fontWeight: 500 }}>Admin Humas</span>
                <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>· otomatis</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Tanggal</label>
                <div style={{ height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
                  <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', color: 'var(--color-text-dark)' }}>{fmtDate(today)}</span>
                  <IconCalendar size={18} stroke="var(--color-text-light)"/>
                </div>
              </div>
              <Select label="Kategori" required value={category} onChange={setCategory} options={catOpts} placeholder="Pilih kategori" full/>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Thumbnail <span style={{ color: 'var(--color-error-red)' }}>*</span></label>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]) }}
              onClick={() => fileRef.current?.click()}
              style={{ width: '100%', minHeight: 240, borderRadius: 10, background: thumb ? `url(${thumb}) center/cover no-repeat` : 'var(--color-surface-3)', border: `1.5px dashed ${dragging ? 'var(--color-blue)' : thumb ? 'transparent' : 'var(--color-border-2)'}`, position: 'relative', cursor: 'pointer', overflow: 'hidden', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!thumb && (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-base)' }}>
                  <div style={{ width: 56, height: 56, margin: '0 auto 12px', borderRadius: '50%', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconImage size={28} stroke="var(--color-text-base)"/>
                  </div>
                  <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', marginBottom: 4 }}>Unggah gambar, atau <span style={{ color: 'var(--color-blue)' }}>telusuri</span></div>
                  <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', lineHeight: 1.5 }}>Ukuran 1920×1080px · PNG atau JPG</div>
                </div>
              )}
              {thumb && (
                <div style={{ position: 'absolute', right: 12, bottom: 12, background: 'rgba(255,255,255,.95)', borderRadius: 8, padding: '8px 12px', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 12, color: 'var(--color-text-dark)', boxShadow: '0 2px 6px rgba(0,0,0,.15)' }}>Ganti gambar</div>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files?.[0])} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Konten Berita <span style={{ color: 'var(--color-error-red)' }}>*</span></label>
          <RichEditor value={content} onChange={setContent} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--color-surface-3)' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>* Data tersimpan sebagai draf bila tidak diterbitkan.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonSecondary onClick={requestBack}>Batal</ButtonSecondary>
            <ButtonSecondary onClick={() => { if (validate()) setConfirmType('draf') }}>Simpan sebagai Draf</ButtonSecondary>
            <ButtonPrimary onClick={() => { if (validate()) setConfirmType('terbit') }}><IconExport size={16} stroke="#fff"/> Simpan &amp; Terbitkan</ButtonPrimary>
          </div>
        </div>
      </div>
      <ConfirmModal open={confirmType === 'draf'}   title="Simpan sebagai Draf"   message="Berita akan disimpan tanpa dipublikasikan."                                 confirmLabel="Ya, Simpan"     loading={saving} onConfirm={() => doSave('draf')}   onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'terbit'} title="Terbitkan Berita"       message="Berita akan langsung tampil di website setelah diterbitkan."                 confirmLabel="Ya, Terbitkan" loading={saving} onConfirm={() => doSave('terbit')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'exit'}   title="Keluar tanpa menyimpan?" message="Perubahan yang belum disimpan akan hilang."                                confirmLabel="Ya, Keluar"    onConfirm={() => { setConfirmType(null); onBack() }}   onClose={() => setConfirmType(null)} />
    </>
  )
}

export default function BeritaPage({ fireSnack, fireNotif }) {
  const [news,       setNews]       = useState(INITIAL_NEWS)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [editing,    setEditing]    = useState(null)
  const [view,       setView]       = useState('list')

  const handleSave = (data) => {
    if (data.id) {
      setNews(prev => prev.map(n => n.id === data.id ? { ...n, ...data } : n))
      fireSnack({ type: 'success', title: 'Tersimpan', message: data.status === 'terbit' ? 'Berita telah diterbitkan' : 'Berita tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : 'draft', feature: 'Berita', item: data.title })
    } else {
      const nextId = Math.max(0, ...news.map(n => n.id)) + 1
      setNews(prev => [{ ...data, id: nextId }, ...prev])
      fireSnack({ type: data.status === 'terbit' ? 'primary' : 'success', title: 'Berhasil', message: data.status === 'terbit' ? 'Berita telah diterbitkan' : 'Berita tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : 'create', feature: 'Berita', item: data.title })
    }
    setView('list'); setEditing(null)
  }

  if (view === 'form')     return <BeritaForm initial={editing} categories={categories} onBack={() => setView('list')} onSave={handleSave} fireSnack={fireSnack} />
  if (view === 'kategori') return <KategoriPage categories={categories} news={news} onBack={() => setView('list')} onAdd={c => setCategories(prev => [...prev, c])} onDelete={id => { setCategories(prev => prev.filter(c => c.id !== id)); setNews(prev => prev.map(n => n.category === id ? { ...n, category: 'all' } : n)) }} fireSnack={fireSnack} />
  return <BeritaList news={news} categories={categories} onAdd={() => { setEditing(null); setView('form') }} onManageCategories={() => setView('kategori')} onEdit={n => { setEditing(n); setView('form') }} onDelete={id => setNews(prev => prev.filter(n => n.id !== id))} fireSnack={fireSnack} fireNotif={fireNotif} />
}
