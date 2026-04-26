import { useState, useMemo, useEffect, useRef } from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { ConfirmModal } from '../../components/Modal'
import SearchInput from '../../components/SearchInput'
import StatusBadge from '../../components/StatusBadge'
import Pagination from '../../components/Pagination'
import FilterPopover from '../../components/FilterPopover'
import TextField from '../../components/TextField'
import {
  IconAdd, IconEdit, IconTrash, IconCalendar, IconExport, IconBack,
  IconBuildings, IconImage, IconEye, IconExit, IconChevronLeft, IconChevronRight, IconStar, IconStarFill,
} from '../../components/Icons'
import avatarUrl from '../../assets/avatar.png'
import slideRowUrl from '../../assets/slide-row.jpg'
import slideDefaultUrl from '../../assets/slide-default.jpg'
import coverWartaUrl from '../../assets/cover-warta.jpg'
import coverSuaraUrl from '../../assets/cover-suara.jpg'
import coverJendelaUrl from '../../assets/cover-jendela.jpg'
import coverInspirasiUrl from '../../assets/cover-inspirasi.jpg'
import coverLaporanUrl from '../../assets/cover-laporan.jpg'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const fmtDate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` }

const INITIAL_FASILITAS = [
  { id: 1, title: 'Ruang Pelayanan Terpadu', publisher: 'Admin Humas', date: '2026-04-12', status: 'terbit', description: 'Ruang pelayanan satu pintu yang nyaman dan modern untuk melayani kebutuhan administrasi masyarakat.', coverIndex: 0, images: [slideRowUrl, slideDefaultUrl, coverWartaUrl, coverSuaraUrl] },
  { id: 2, title: 'Aula Serbaguna', publisher: 'Sekretariat', date: '2026-04-05', status: 'terbit', description: 'Aula multi-fungsi untuk rapat, seminar, dan kegiatan publik dengan kapasitas hingga 300 orang.', coverIndex: 1, images: [slideDefaultUrl, slideRowUrl] },
  { id: 3, title: 'Ruang Tunggu VIP', publisher: 'Admin Humas', date: '2026-03-28', status: 'draf', description: 'Ruang tunggu khusus tamu kehormatan dan pejabat daerah.', coverIndex: 0, images: [coverJendelaUrl] },
  { id: 4, title: 'Taman & Plaza Publik', publisher: 'Dinas Tata Kota', date: '2026-03-20', status: 'terbit', description: 'Area terbuka hijau yang dapat digunakan masyarakat untuk aktivitas santai dan rekreasi keluarga.', coverIndex: 2, images: [slideRowUrl, slideDefaultUrl, coverInspirasiUrl, coverLaporanUrl, coverWartaUrl] },
  { id: 5, title: 'Perpustakaan Daerah', publisher: 'Dinas Perpustakaan', date: '2026-03-10', status: 'terbit', description: 'Perpustakaan modern dengan koleksi buku fisik dan digital yang lengkap.', coverIndex: 0, images: [coverSuaraUrl, slideDefaultUrl] },
]

const FILTER_SECTIONS = [
  {
    label: 'Fasilitas',
    fields: [
      { key: 'status', label: 'Status', placeholder: 'Pilih Status', span: 2, options: [{ value: 'terbit', label: 'Terbit' }, { value: 'draf', label: 'Draf' }] },
    ],
  },
]

function GalleryUploader({ images, coverIndex, onChange, onCoverChange }) {
  const inputRef = useRef()
  const MAX = 5

  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => /^image\/(png|jpe?g)$/i.test(f.type))
    const slots = MAX - images.length
    const urls = valid.slice(0, slots).map(f => URL.createObjectURL(f))
    onChange([...images, ...urls])
  }
  const removeAt = (i) => {
    const next = images.filter((_, idx) => idx !== i)
    onChange(next)
    if (coverIndex === i) onCoverChange(0)
    else if (coverIndex > i) onCoverChange(coverIndex - 1)
  }
  const moveImg = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= images.length) return
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    if (coverIndex === i) onCoverChange(j)
    else if (coverIndex === j) onCoverChange(i)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>
          Galeri Foto <span style={{ color: 'var(--color-error-red)' }}>*</span>
        </label>
        <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>{images.length} / {MAX} foto</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {Array.from({ length: MAX }).map((_, i) => {
          const img = images[i]
          if (img) {
            const isCover = coverIndex === i
            return (
              <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', background: 'var(--color-surface-3)', boxShadow: isCover ? '0 0 0 3px #F5A623, 0 2px 8px rgba(245,166,35,.3)' : 'inset 0 0 0 1px var(--color-border)', transition: 'box-shadow .15s' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                <button type="button" onClick={() => onCoverChange(i)} title={isCover ? 'Foto utama' : 'Jadikan foto utama'} style={{ position: 'absolute', top: 6, left: 6, width: 30, height: 30, borderRadius: 8, border: 'none', background: isCover ? '#F5A623' : 'rgba(255,255,255,.92)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.15)' }}>
                  {isCover ? <IconStarFill size={16} fill="#fff" stroke="#fff" /> : <IconStar size={16} stroke="#F5A623" />}
                </button>

                <button type="button" onClick={() => removeAt(i)} title="Hapus" style={{ position: 'absolute', top: 6, right: 6, width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(255,84,92,.95)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.15)' }}>
                  <IconTrash size={15} stroke="#fff" />
                </button>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 8px 8px', background: 'linear-gradient(to top, rgba(0,0,0,.65), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" onClick={() => moveImg(i, -1)} disabled={i === 0} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: i === 0 ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.92)', cursor: i === 0 ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconChevronLeft size={14} stroke="#354764" /></button>
                    <button type="button" onClick={() => moveImg(i, 1)} disabled={i === images.length - 1} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: i === images.length - 1 ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.92)', cursor: i === images.length - 1 ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconChevronRight size={14} stroke="#354764" /></button>
                  </div>
                  {isCover && <span style={{ background: '#F5A623', color: '#fff', padding: '3px 8px', borderRadius: 999, fontFamily: 'var(--font-base)', fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' }}>Cover</span>}
                </div>
              </div>
            )
          }
          const isNext = i === images.length
          return (
            <button key={i} type="button" onClick={() => isNext && inputRef.current?.click()} disabled={!isNext}
              style={{ aspectRatio: '4/3', borderRadius: 10, border: `1px dashed ${isNext ? '#CCD4E0' : '#EEF0F4'}`, background: isNext ? 'var(--color-surface-2)' : '#FAFBFC', cursor: isNext ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: isNext ? 'var(--color-blue)' : '#CCD4E0' }}
              onMouseEnter={e => { if (isNext) { e.currentTarget.style.borderColor = 'var(--color-blue)'; e.currentTarget.style.background = '#F0F7FF' } }}
              onMouseLeave={e => { if (isNext) { e.currentTarget.style.borderColor = '#CCD4E0'; e.currentTarget.style.background = 'var(--color-surface-2)' } }}>
              <IconImage size={24} stroke="currentColor" />
              <span style={{ fontFamily: 'var(--font-base)', fontSize: 11, fontWeight: 500 }}>{isNext ? (images.length === 0 ? 'Unggah foto' : 'Tambah foto') : '—'}</span>
            </button>
          )
        })}
      </div>

      <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', lineHeight: 1.5 }}>
        Unggah 1–5 foto. Klik ikon bintang untuk memilih foto utama (thumbnail di landing page).
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" multiple onChange={e => { addFiles(e.target.files); e.target.value = '' }} style={{ display: 'none' }} />
    </div>
  )
}

function PreviewModal({ item, onClose }) {
  const [active, setActive] = useState(item?.coverIndex ?? 0)
  useEffect(() => { setActive(item?.coverIndex ?? 0) }, [item])
  if (!item) return null
  const img = item.images[active] || item.images[0]

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 'var(--z-modal)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'cms-fade .18s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(920px, 100%)', maxHeight: '90vh', overflow: 'auto', background: 'var(--color-card)', borderRadius: 16, display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,.3)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-base)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-light)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Pratinjau Landing Page</span>
            <IconEye size={14} stroke="var(--color-text-light)" />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><IconExit size={22} stroke="var(--color-text-base)" /></button>
        </div>

        <div style={{ padding: 'clamp(20px, 3vw, 32px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: 'var(--color-surface-3)' }}>
            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {item.images.length > 1 && (
              <>
                <button onClick={() => setActive(a => (a - 1 + item.images.length) % item.images.length)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.95)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.2)' }}><IconChevronLeft size={18} stroke="var(--color-text-dark)" /></button>
                <button onClick={() => setActive(a => (a + 1) % item.images.length)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,.95)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.2)' }}><IconChevronRight size={18} stroke="var(--color-text-dark)" /></button>
                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,.6)', color: '#fff', padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-base)', fontSize: 11, fontWeight: 600 }}>{active + 1} / {item.images.length}</div>
              </>
            )}
          </div>

          {item.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {item.images.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ width: 80, height: 60, borderRadius: 8, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, background: 'var(--color-surface-3)', overflow: 'hidden', boxShadow: active === i ? '0 0 0 2.5px var(--color-blue)' : 'inset 0 0 0 1px var(--color-border)', opacity: active === i ? 1 : 0.75, transition: 'all .15s' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          <div>
            <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 22, color: 'var(--color-text-dark)', lineHeight: 1.25 }}>{item.title}</div>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', marginTop: 4 }}>{fmtDate(item.date)} · {item.publisher}</div>
          </div>
          {item.description && <div style={{ fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)', lineHeight: 1.6 }}>{item.description}</div>}
        </div>
      </div>
    </div>
  )
}

function FasilitasList({ items, onAdd, onEdit, onDelete, fireSnack, fireNotif }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '' })
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [confirmDel, setConfirmDel] = useState(null)
  const [preview, setPreview] = useState(null)

  const filtered = useMemo(() => items.filter(n => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.status !== '' && n.status !== filters.status) return false
    return true
  }), [items, search, filters])

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  useEffect(() => { if (page > pageCount) setPage(1) }, [pageCount])
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)
  const from = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, filtered.length)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Fasilitas</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Kelola fasilitas publik yang ditampilkan di landing page.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>{items.length} total · {items.filter(n => n.status === 'terbit').length} terbit</span>
          </div>
        </div>
        <ButtonPrimary onClick={onAdd}>
          <IconAdd size={18} stroke="#fff" /> Tambah Fasilitas
        </ButtonPrimary>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px', minWidth: 220, maxWidth: 480 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Cari fasilitas" />
        </div>
        <FilterPopover
          sections={FILTER_SECTIONS}
          values={filters}
          activeCount={activeFilterCount}
          onChange={v => { setFilters(v); setPage(1) }}
          onResetAll={() => { setFilters({ status: '' }); setSearch(''); setPage(1) }}
        />
      </div>

      <div style={{ background: 'var(--color-card)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                {['Fasilitas', 'Foto', 'Tanggal', 'Dipublikasikan oleh', 'Status', 'Aksi'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: i === 5 ? 'right' : 'left', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center', color: 'var(--color-text-light)', fontFamily: 'var(--font-base)', fontSize: 14 }}>Tidak ada fasilitas yang cocok dengan filter.</td></tr>
              ) : pageItems.map(n => {
                const cover = n.images[n.coverIndex] || n.images[0]
                return (
                  <tr key={n.id} style={{ borderBottom: '1px solid var(--color-surface-3)' }}>
                    <td style={{ padding: '14px 20px', maxWidth: 420 }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        {cover
                          ? <img src={cover} alt="" style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                          : <div style={{ width: 72, height: 54, borderRadius: 6, background: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconBuildings size={20} stroke="var(--color-blue)" /></div>}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', lineHeight: 1.4 }}>{n.title}</div>
                          {n.description && <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{n.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--color-surface-3)', padding: '4px 10px', borderRadius: 999 }}>
                        <IconImage size={13} stroke="var(--color-text-base)" />
                        <span style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-base)', fontWeight: 500 }}>{n.images.length} foto</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', whiteSpace: 'nowrap' }}>{fmtDate(n.date)}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{n.publisher}</td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={n.status} /></td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={() => setPreview(n)} title="Pratinjau" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconEye size={16} stroke="var(--color-text-base)" /></button>
                        <button onClick={() => onEdit(n)} title="Edit" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit size={16} stroke="var(--color-text-base)" /></button>
                        <button onClick={() => setConfirmDel(n)} title="Hapus" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconTrash size={16} stroke="var(--color-error)" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>
            <span>Show</span>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }} style={{ height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', padding: '0 28px 0 10px', fontFamily: 'var(--font-base)', fontSize: 13, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23354764' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>entries · {from}–{to} dari {filtered.length}</span>
          </div>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>

      <ConfirmModal open={!!confirmDel} title="Hapus Fasilitas"
        message={confirmDel ? `Apakah kamu yakin ingin menghapus "${confirmDel.title}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { onDelete(confirmDel.id); fireSnack({ type: 'success', title: 'Berhasil', message: 'Fasilitas telah dihapus' }); fireNotif?.({ action: 'delete', feature: 'Fasilitas', item: confirmDel.title }); setConfirmDel(null) }}
        onClose={() => setConfirmDel(null)} />

      <PreviewModal item={preview} onClose={() => setPreview(null)} />
    </>
  )
}

function FasilitasForm({ initial, onBack, onSave, fireSnack }) {
  const isEdit = !!initial?.id
  const today = new Date().toISOString().slice(0, 10)
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [images, setImages] = useState(initial?.images || [])
  const [coverIndex, setCoverIndex] = useState(initial?.coverIndex ?? 0)
  const [confirmType, setConfirmType] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const publisher = 'Admin Humas'
  const dateLabel = fmtDate(today)
  const isDirty = title || description || images.length > 0
  const requestBack = () => { if (isDirty && !isEdit) setConfirmType('exit'); else onBack() }

  const validate = () => {
    if (!title.trim()) { fireSnack({ type: 'error', title: 'Gagal', message: 'Judul fasilitas wajib diisi' }); return false }
    if (images.length === 0) { fireSnack({ type: 'error', title: 'Gagal', message: 'Minimal 1 foto harus diunggah' }); return false }
    return true
  }

  const doSave = (status) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSave({ id: initial?.id, title: title.trim(), description: description.trim(), images, coverIndex, publisher, date: initial?.date || today, status })
      setConfirmType(null)
    }, 700)
  }
  const triggerSave = (status) => { if (!validate()) return; setConfirmType(status) }

  const previewItem = images.length > 0 ? { title: title || '(Judul Fasilitas)', description, images, coverIndex, publisher, date: initial?.date || today } : null

  return (
    <>
      <button onClick={requestBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, color: 'var(--color-text-dark)' }}>
        <IconBack size={18} stroke="var(--color-text-dark)" /> Kembali
      </button>

      <div style={{ background: 'var(--color-card)', borderRadius: 12, padding: 'clamp(20px, 2.4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, color: 'var(--color-text-dark)' }}>
            {isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
          </div>
          {previewItem && (
            <button onClick={() => setShowPreview(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 13, color: 'var(--color-blue)' }}>
              <IconEye size={16} stroke="var(--color-blue)" /> Pratinjau
            </button>
          )}
        </div>

        <TextField label="Judul Fasilitas" required value={title} onChange={setTitle} placeholder="mis. Ruang Pelayanan Terpadu" />
        <TextField label="Deskripsi" textarea value={description} onChange={setDescription} placeholder="Deskripsikan fasilitas ini secara singkat" helperText={`${description.length}/300 karakter`} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 600 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Dipublikasikan oleh</label>
            <div style={{ height: 'var(--control-h)', borderRadius: 12, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
              <img src={avatarUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-sm)', color: 'var(--color-text-dark)', fontWeight: 500 }}>{publisher}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>Tanggal</label>
            <div style={{ height: 'var(--control-h)', borderRadius: 12, background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
              <span style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-sm)', color: 'var(--color-text-dark)' }}>{dateLabel}</span>
              <IconCalendar size={18} stroke="var(--color-text-light)" />
            </div>
          </div>
        </div>

        <GalleryUploader images={images} coverIndex={coverIndex} onChange={setImages} onCoverChange={setCoverIndex} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--color-surface-3)' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>* Fasilitas tersimpan sebagai draf bila tidak diterbitkan.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonSecondary onClick={requestBack}>Batal</ButtonSecondary>
            <ButtonSecondary onClick={() => triggerSave('draf')}>Simpan sebagai Draf</ButtonSecondary>
            <ButtonPrimary onClick={() => triggerSave('terbit')}>
              <IconExport size={16} stroke="#fff" /> Simpan &amp; Terbitkan
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <ConfirmModal open={confirmType === 'draf'} title="Simpan sebagai Draf" message="Fasilitas akan disimpan tanpa dipublikasikan." confirmLabel="Ya, Simpan" loading={saving} onConfirm={() => doSave('draf')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'terbit'} title="Terbitkan Fasilitas" message="Fasilitas akan langsung dapat diakses publik di website setelah diterbitkan." confirmLabel="Ya, Terbitkan" loading={saving} onConfirm={() => doSave('terbit')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'exit'} title="Keluar tanpa menyimpan?" message="Perubahan yang belum disimpan akan hilang." confirmLabel="Ya, Keluar" onConfirm={() => { setConfirmType(null); onBack() }} onClose={() => setConfirmType(null)} />

      {showPreview && previewItem && <PreviewModal item={previewItem} onClose={() => setShowPreview(false)} />}
    </>
  )
}

export default function FasilitasPage({ fireSnack, fireNotif }) {
  const [items, setItems] = useState(INITIAL_FASILITAS)
  const [editing, setEditing] = useState(null)
  const [view, setView] = useState('list')

  const openAdd = () => { setEditing(null); setView('form') }
  const openEdit = (n) => { setEditing(n); setView('form') }
  const handleDelete = (id) => setItems(prev => prev.filter(n => n.id !== id))
  const handleSave = (data) => {
    if (data.id) {
      setItems(prev => prev.map(n => n.id === data.id ? { ...n, ...data } : n))
      fireSnack({ type: 'success', title: 'Tersimpan', message: data.status === 'terbit' ? 'Fasilitas telah diterbitkan' : 'Fasilitas tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : 'draft', feature: 'Fasilitas', item: data.title })
    } else {
      const nextId = Math.max(0, ...items.map(n => n.id)) + 1
      setItems(prev => [{ ...data, id: nextId }, ...prev])
      fireSnack({ type: data.status === 'terbit' ? 'primary' : 'success', title: 'Berhasil', message: data.status === 'terbit' ? 'Fasilitas telah diterbitkan' : 'Fasilitas tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : 'create', feature: 'Fasilitas', item: data.title })
    }
    setView('list'); setEditing(null)
  }

  if (view === 'form') return <FasilitasForm initial={editing} onBack={() => setView('list')} onSave={handleSave} fireSnack={fireSnack} />
  return <FasilitasList items={items} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} fireSnack={fireSnack} fireNotif={fireNotif} />
}
