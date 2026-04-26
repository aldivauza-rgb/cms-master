import { useState, useMemo, useEffect, useRef } from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { ConfirmModal } from '../../components/Modal'
import SearchInput from '../../components/SearchInput'
import StatusBadge from '../../components/StatusBadge'
import Pagination from '../../components/Pagination'
import FilterPopover from '../../components/FilterPopover'
import TextField from '../../components/TextField'
import {
  IconAdd, IconEdit, IconTrash, IconLink, IconCalendar, IconExport, IconBack,
} from '../../components/Icons'
import avatarUrl from '../../assets/avatar.png'
import coverWartaUrl from '../../assets/cover-warta.jpg'
import coverSuaraUrl from '../../assets/cover-suara.jpg'
import coverJendelaUrl from '../../assets/cover-jendela.jpg'
import coverInspirasiUrl from '../../assets/cover-inspirasi.jpg'
import coverLaporanUrl from '../../assets/cover-laporan.jpg'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const fmtDate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` }

const INITIAL_MAJALAH = [
  { id: 1, title: 'Warta Daerah', edition: 'Vol. 12 / April 2026', publisher: 'Admin Humas', date: '2026-04-10', status: 'terbit', url: 'https://drive.google.com/file/d/1aaa/view', cover: coverWartaUrl },
  { id: 2, title: 'Suara Pembangunan', edition: 'Vol. 11 / Maret 2026', publisher: 'Admin Humas', date: '2026-03-15', status: 'terbit', url: 'https://drive.google.com/file/d/2bbb/view', cover: coverSuaraUrl },
  { id: 3, title: 'Jendela Kota', edition: 'Vol. 10 / Februari 2026', publisher: 'Diskominfo', date: '2026-02-20', status: 'draf', url: '', cover: coverJendelaUrl },
  { id: 4, title: 'Inspirasi Negeri', edition: 'Vol. 9 / Januari 2026', publisher: 'Admin Humas', date: '2026-01-18', status: 'terbit', url: 'https://drive.google.com/file/d/4ddd/view', cover: coverInspirasiUrl },
  { id: 5, title: 'Laporan Tahunan 2025', edition: 'Edisi Khusus', publisher: 'Sekretariat', date: '2025-12-30', status: 'terbit', url: 'https://drive.google.com/file/d/5eee/view', cover: coverLaporanUrl },
]

const FILTER_SECTIONS = [
  {
    label: 'Majalah',
    fields: [
      { key: 'month', label: 'Bulan', placeholder: 'Pilih Bulan', options: MONTHS.map((m, i) => ({ value: String(i), label: m })) },
      { key: 'year', label: 'Tahun', placeholder: 'Pilih Tahun', options: [2026,2025,2024,2023].map(y => ({ value: String(y), label: String(y) })) },
      { key: 'status', label: 'Status', placeholder: 'Pilih Status', span: 2, options: [{ value: 'terbit', label: 'Terbit' }, { value: 'draf', label: 'Draf' }] },
    ],
  },
]

function CoverPlaceholder() {
  return (
    <div style={{
      width: 42, height: 58, borderRadius: 4,
      background: 'linear-gradient(135deg, var(--color-blue-light) 0%, #CFE3FD 100%)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      boxShadow: '0 1px 2px rgba(5,27,62,.1), inset -1px 0 0 rgba(0,0,0,.06)',
    }}>
      <svg width="18" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16v16H4z M4 4v16 M12 4v16" stroke="var(--color-blue)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function CoverUploader({ value, onChange }) {
  const inputRef = useRef()
  const [dragOver, setDragOver] = useState(false)
  const pickFile = (f) => {
    if (!f) return
    if (!/^image\/(png|jpe?g)$/i.test(f.type)) return
    onChange(URL.createObjectURL(f))
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>
        Sampul (Thumbnail) <span style={{ color: 'var(--color-error-red)' }}>*</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0]) }}
        style={{
          position: 'relative', cursor: 'pointer',
          background: dragOver ? '#F0F7FF' : 'var(--color-surface-2)',
          border: `1px dashed ${dragOver ? 'var(--color-blue)' : 'var(--color-border-2)'}`,
          borderRadius: 12, padding: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
          minHeight: 320, transition: 'all .15s ease',
        }}>
        {value ? (
          <>
            <div style={{ width: 'min(180px, 60%)', aspectRatio: '3/4', borderRadius: 6, overflow: 'hidden', boxShadow: '0 8px 24px rgba(5,27,62,.18)', position: 'relative' }}>
              <img src={value} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(to right, rgba(0,0,0,.18), transparent)' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={e => { e.stopPropagation(); inputRef.current?.click() }} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 13, fontWeight: 500, color: 'var(--color-text-base)' }}>Ganti</button>
              <button onClick={e => { e.stopPropagation(); onChange('') }} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 13, fontWeight: 500, color: 'var(--color-error)' }}>Hapus</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: 72, height: 72, borderRadius: 14, background: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="3" width="14" height="18" rx="1.5" stroke="var(--color-blue)" strokeWidth="1.6" />
                <path d="M5 3v18M9 3v18" stroke="var(--color-blue)" strokeWidth="1.2" opacity=".5" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)' }}>
                Unggah sampul, atau <span style={{ color: 'var(--color-blue)' }}>telusuri</span>
              </div>
              <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', marginTop: 4, lineHeight: 1.5 }}>
                Format portrait (rasio 3:4).<br />JPG atau PNG, maks 5MB.
              </div>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/png,image/jpeg" onChange={e => pickFile(e.target.files?.[0])} style={{ display: 'none' }} />
      </div>
    </div>
  )
}

function MajalahList({ items, onAdd, onEdit, onDelete, fireSnack, fireNotif }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ month: '', year: '', status: '' })
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [confirmDel, setConfirmDel] = useState(null)

  const filtered = useMemo(() => items.filter(n => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !(n.edition || '').toLowerCase().includes(search.toLowerCase())) return false
    const d = new Date(n.date)
    if (filters.month !== '' && d.getMonth() !== Number(filters.month)) return false
    if (filters.year !== '' && d.getFullYear() !== Number(filters.year)) return false
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
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Majalah</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Kelola majalah untuk dipublikasikan ke website.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>{items.length} total · {items.filter(n => n.status === 'terbit').length} terbit</span>
          </div>
        </div>
        <ButtonPrimary onClick={onAdd}>
          <IconAdd size={18} stroke="#fff" /> Tambah Majalah
        </ButtonPrimary>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px', minWidth: 220, maxWidth: 480 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Cari judul atau edisi" />
        </div>
        <FilterPopover
          sections={FILTER_SECTIONS}
          values={filters}
          activeCount={activeFilterCount}
          onChange={v => { setFilters(v); setPage(1) }}
          onResetAll={() => { setFilters({ month: '', year: '', status: '' }); setSearch(''); setPage(1) }}
        />
      </div>

      <div style={{ background: 'var(--color-card)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                {['Majalah', 'Tanggal', 'Dipublikasikan oleh', 'Link', 'Status', 'Aksi'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: i === 5 ? 'right' : 'left', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center', color: 'var(--color-text-light)', fontFamily: 'var(--font-base)', fontSize: 14 }}>Tidak ada majalah yang cocok dengan filter.</td></tr>
              ) : pageItems.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid var(--color-surface-3)' }}>
                  <td style={{ padding: '14px 20px', maxWidth: 420 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      {n.cover
                        ? <img src={n.cover} alt="" style={{ width: 42, height: 58, objectFit: 'cover', borderRadius: 4, flexShrink: 0, boxShadow: '0 1px 3px rgba(5,27,62,.15)' }} />
                        : <CoverPlaceholder />}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', lineHeight: 1.4 }}>{n.title}</div>
                        {n.edition && <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', marginTop: 2 }}>{n.edition}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', whiteSpace: 'nowrap' }}>{fmtDate(n.date)}</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{n.publisher}</td>
                  <td style={{ padding: '14px 20px', maxWidth: 200 }}>
                    {n.url ? (
                      <a href={n.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-blue)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <IconLink size={14} stroke="var(--color-blue)" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.url.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-base)', fontSize: 13 }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={n.status} /></td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => onEdit(n)} title="Edit" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit size={16} stroke="var(--color-text-base)" /></button>
                      <button onClick={() => setConfirmDel(n)} title="Hapus" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconTrash size={16} stroke="var(--color-error)" /></button>
                    </div>
                  </td>
                </tr>
              ))}
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

      <ConfirmModal open={!!confirmDel} title="Hapus Majalah"
        message={confirmDel ? `Apakah kamu yakin ingin menghapus "${confirmDel.title}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { onDelete(confirmDel.id); fireSnack({ type: 'success', title: 'Berhasil', message: 'Majalah telah dihapus' }); fireNotif?.({ action: 'delete', feature: 'Majalah', item: confirmDel.title }); setConfirmDel(null) }}
        onClose={() => setConfirmDel(null)} />
    </>
  )
}

function MajalahForm({ initial, onBack, onSave, fireSnack }) {
  const isEdit = !!initial?.id
  const today = new Date().toISOString().slice(0, 10)
  const [title, setTitle] = useState(initial?.title || '')
  const [edition, setEdition] = useState(initial?.edition || '')
  const [url, setUrl] = useState(initial?.url || '')
  const [cover, setCover] = useState(initial?.cover || '')
  const [confirmType, setConfirmType] = useState(null)
  const [saving, setSaving] = useState(false)

  const publisher = 'Admin Humas'
  const dateLabel = fmtDate(today)
  const isDirty = title || edition || url || cover
  const requestBack = () => { if (isDirty && !isEdit) setConfirmType('exit'); else onBack() }

  const validate = () => {
    if (!title.trim()) { fireSnack({ type: 'error', title: 'Gagal', message: 'Judul majalah wajib diisi' }); return false }
    if (!url.trim()) { fireSnack({ type: 'error', title: 'Gagal', message: 'Link dokumen wajib diisi' }); return false }
    try { new URL(url) } catch { fireSnack({ type: 'error', title: 'Gagal', message: 'Format link tidak valid' }); return false }
    if (!cover) { fireSnack({ type: 'error', title: 'Gagal', message: 'Sampul majalah wajib diunggah' }); return false }
    return true
  }

  const doSave = (status) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSave({ id: initial?.id, title: title.trim(), edition: edition.trim(), url: url.trim(), cover, publisher, date: initial?.date || today, status })
      setConfirmType(null)
    }, 700)
  }
  const triggerSave = (status) => { if (!validate()) return; setConfirmType(status) }

  return (
    <>
      <button onClick={requestBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, color: 'var(--color-text-dark)' }}>
        <IconBack size={18} stroke="var(--color-text-dark)" /> Kembali
      </button>

      <div style={{ background: 'var(--color-card)', borderRadius: 12, padding: 'clamp(20px, 2.4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, color: 'var(--color-text-dark)' }}>
          {isEdit ? 'Edit Majalah' : 'Tambah Majalah'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 24 }} className="cms-form-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <TextField label="Judul Majalah" required value={title} onChange={setTitle} placeholder="mis. Warta Daerah" />
            <TextField label="Edisi" value={edition} onChange={setEdition} placeholder="mis. Vol. 12 / April 2026" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 500, color: 'var(--color-text-base)' }}>
                Link Dokumen <span style={{ color: 'var(--color-error-red)' }}>*</span>
              </label>
              <div style={{ height: 'var(--control-h)', borderRadius: 12, background: 'var(--color-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: 48, background: 'var(--color-surface-3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--color-border)', flexShrink: 0 }}>
                  <IconLink size={18} stroke="var(--color-text-light)" />
                </div>
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://drive.google.com/..." style={{ flex: 1, height: '100%', border: 'none', outline: 'none', padding: '0 16px', fontFamily: 'var(--font-base)', fontSize: 'var(--text-sm)', color: 'var(--color-text-dark)', background: 'transparent' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', lineHeight: 1.5 }}>Link ke dokumen majalah (Google Drive, Issuu, Flipbook, dll).</div>
            </div>
          </div>

          <CoverUploader value={cover} onChange={setCover} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--color-surface-3)' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>* Majalah tersimpan sebagai draf bila tidak diterbitkan.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonSecondary onClick={requestBack}>Batal</ButtonSecondary>
            <ButtonSecondary onClick={() => triggerSave('draf')}>Simpan sebagai Draf</ButtonSecondary>
            <ButtonPrimary onClick={() => triggerSave('terbit')}>
              <IconExport size={16} stroke="#fff" /> Simpan &amp; Terbitkan
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <ConfirmModal open={confirmType === 'draf'} title="Simpan sebagai Draf" message="Majalah akan disimpan tanpa dipublikasikan." confirmLabel="Ya, Simpan" loading={saving} onConfirm={() => doSave('draf')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'terbit'} title="Terbitkan Majalah" message="Majalah akan langsung dapat diakses publik di website setelah diterbitkan." confirmLabel="Ya, Terbitkan" loading={saving} onConfirm={() => doSave('terbit')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'exit'} title="Keluar tanpa menyimpan?" message="Perubahan yang belum disimpan akan hilang." confirmLabel="Ya, Keluar" onConfirm={() => { setConfirmType(null); onBack() }} onClose={() => setConfirmType(null)} />
    </>
  )
}

export default function MajalahPage({ fireSnack, fireNotif }) {
  const [items, setItems] = useState(INITIAL_MAJALAH)
  const [editing, setEditing] = useState(null)
  const [view, setView] = useState('list')

  const openAdd = () => { setEditing(null); setView('form') }
  const openEdit = (n) => { setEditing(n); setView('form') }
  const handleDelete = (id) => setItems(prev => prev.filter(n => n.id !== id))
  const handleSave = (data) => {
    if (data.id) {
      setItems(prev => prev.map(n => n.id === data.id ? { ...n, ...data } : n))
      fireSnack({ type: 'success', title: 'Tersimpan', message: data.status === 'terbit' ? 'Majalah telah diterbitkan' : 'Majalah tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : 'draft', feature: 'Majalah', item: data.title })
    } else {
      const nextId = Math.max(0, ...items.map(n => n.id)) + 1
      setItems(prev => [{ ...data, id: nextId }, ...prev])
      fireSnack({ type: data.status === 'terbit' ? 'primary' : 'success', title: 'Berhasil', message: data.status === 'terbit' ? 'Majalah telah diterbitkan' : 'Majalah tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : 'create', feature: 'Majalah', item: data.title })
    }
    setView('list'); setEditing(null)
  }

  if (view === 'form') return <MajalahForm initial={editing} onBack={() => setView('list')} onSave={handleSave} fireSnack={fireSnack} />
  return <MajalahList items={items} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} fireSnack={fireSnack} fireNotif={fireNotif} />
}
