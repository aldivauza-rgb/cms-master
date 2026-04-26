import { useState, useMemo, useEffect } from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { ConfirmModal } from '../../components/Modal'
import SearchInput from '../../components/SearchInput'
import StatusBadge from '../../components/StatusBadge'
import Pagination from '../../components/Pagination'
import Select from '../../components/Select'
import TextField from '../../components/TextField'
import FilterPopover from '../../components/FilterPopover'
import {
  IconAdd, IconEdit, IconTrash, IconDocument, IconLink, IconCalendar,
  IconExport, IconBack, IconFilter,
} from '../../components/Icons'
import avatarUrl from '../../assets/avatar.png'
import { dokumenApi } from '../../lib/api'

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const fmtDate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` }

const INITIAL_DOKUMEN = [
  { id: 1, title: 'Laporan Kinerja Tahunan 2025', publisher: 'Admin Humas', date: '2026-04-12', status: 'terbit', url: 'https://drive.google.com/file/d/1abc/view' },
  { id: 2, title: 'Peraturan Daerah No. 14 Tahun 2026', publisher: 'Sekretariat', date: '2026-04-08', status: 'terbit', url: 'https://drive.google.com/file/d/2def/view' },
  { id: 3, title: 'SOP Pelayanan Terpadu', publisher: 'Admin Humas', date: '2026-04-01', status: 'draf', url: '' },
  { id: 4, title: 'Rencana Kerja Pemerintah Daerah 2027', publisher: 'Bappeda', date: '2026-03-25', status: 'terbit', url: 'https://drive.google.com/file/d/4ghi/view' },
  { id: 5, title: 'Laporan Anggaran Triwulan I', publisher: 'Keuangan', date: '2026-03-18', status: 'terbit', url: 'https://drive.google.com/file/d/5jkl/view' },
  { id: 6, title: 'Panduan Perizinan Online', publisher: 'Diskominfo', date: '2026-03-10', status: 'draf', url: '' },
  { id: 7, title: 'Surat Edaran Hari Libur Nasional', publisher: 'Sekretariat', date: '2026-02-28', status: 'terbit', url: 'https://drive.google.com/file/d/7mno/view' },
  { id: 8, title: 'Data Statistik Kependudukan 2025', publisher: 'Dukcapil', date: '2026-02-20', status: 'terbit', url: 'https://drive.google.com/file/d/8pqr/view' },
]

const FILTER_SECTIONS = [
  {
    label: 'Dokumen',
    fields: [
      { key: 'month', label: 'Bulan', placeholder: 'Pilih Bulan', options: MONTHS.map((m, i) => ({ value: String(i), label: m })) },
      { key: 'year', label: 'Tahun', placeholder: 'Pilih Tahun', options: [2026,2025,2024,2023].map(y => ({ value: String(y), label: String(y) })) },
      { key: 'status', label: 'Status', placeholder: 'Pilih Status', span: 2, options: [{ value: 'terbit', label: 'Terbit' }, { value: 'draf', label: 'Draf' }] },
    ],
  },
]

function DokumenList({ docs, onAdd, onEdit, onDelete, fireSnack, fireNotif }) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ month: '', year: '', status: '' })
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [confirmDel, setConfirmDel] = useState(null)

  const filtered = useMemo(() => docs.filter(n => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.publisher.toLowerCase().includes(search.toLowerCase())) return false
    const d = new Date(n.date)
    if (filters.month !== '' && d.getMonth() !== Number(filters.month)) return false
    if (filters.year !== '' && d.getFullYear() !== Number(filters.year)) return false
    if (filters.status !== '' && n.status !== filters.status) return false
    return true
  }), [docs, search, filters])

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
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Dokumen Rilis</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Unggah dan kelola dokumen resmi untuk diakses publik.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>{docs.length} total · {docs.filter(n => n.status === 'terbit').length} terbit</span>
          </div>
        </div>
        <ButtonPrimary onClick={onAdd}>
          <IconAdd size={18} stroke="#fff" /> Tambah Dokumen
        </ButtonPrimary>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px', minWidth: 220, maxWidth: 480 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Cari judul atau penerbit" />
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                {['Dokumen', 'Tanggal', 'Dipublikasikan oleh', 'Link', 'Status', 'Aksi'].map((h, i) => (
                  <th key={h} style={{
                    padding: '14px 20px', textAlign: i === 5 ? 'right' : 'left',
                    fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: 'var(--color-text-light)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center', color: 'var(--color-text-light)', fontFamily: 'var(--font-base)', fontSize: 14 }}>
                  Tidak ada dokumen yang cocok dengan filter.
                </td></tr>
              ) : pageItems.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid var(--color-surface-3)' }}>
                  <td style={{ padding: '14px 20px', maxWidth: 380 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{
                        width: 40, height: 44, borderRadius: 8, background: 'var(--color-blue-light)', flexShrink: 0,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconDocument size={20} stroke="var(--color-blue)" />
                      </div>
                      <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)', lineHeight: 1.4 }}>{n.title}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', whiteSpace: 'nowrap' }}>{fmtDate(n.date)}</td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{n.publisher}</td>
                  <td style={{ padding: '14px 20px', maxWidth: 220 }}>
                    {n.url ? (
                      <a href={n.url} target="_blank" rel="noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%',
                        fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-blue)',
                        textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        <IconLink size={14} stroke="var(--color-blue)" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.url.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-base)', fontSize: 13 }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={n.status} /></td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => onEdit(n)} title="Edit" style={{
                        width: 34, height: 34, borderRadius: 8, border: '1px solid var(--color-border)',
                        background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}><IconEdit size={16} stroke="var(--color-text-base)" /></button>
                      <button onClick={() => setConfirmDel(n)} title="Hapus" style={{
                        width: 34, height: 34, borderRadius: 8, border: '1px solid #FFD6DA',
                        background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}><IconTrash size={16} stroke="var(--color-error)" /></button>
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
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }} style={{
              height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)',
              padding: '0 28px 0 10px', fontFamily: 'var(--font-base)', fontSize: 13, cursor: 'pointer',
              appearance: 'none', WebkitAppearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23354764' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
            }}>
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>entries · {from}–{to} dari {filtered.length}</span>
          </div>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>

      <ConfirmModal
        open={!!confirmDel}
        title="Hapus Dokumen"
        message={confirmDel ? `Apakah kamu yakin ingin menghapus "${confirmDel.title}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { onDelete(confirmDel.id); fireSnack({ type: 'success', title: 'Berhasil', message: 'Dokumen telah dihapus' }); fireNotif?.({ action: 'delete', feature: 'Dokumen', item: confirmDel.title }); setConfirmDel(null) }}
        onClose={() => setConfirmDel(null)}
      />
    </>
  )
}

function DokumenForm({ initial, onBack, onSave, fireSnack }) {
  const isEdit = !!initial?.id
  const today = new Date().toISOString().slice(0, 10)
  const [title, setTitle] = useState(initial?.title || '')
  const [url, setUrl] = useState(initial?.url || '')
  const [confirmType, setConfirmType] = useState(null)
  const [saving, setSaving] = useState(false)

  const publisher = 'Admin Humas'
  const dateLabel = fmtDate(today)

  const isDirty = title || url
  const requestBack = () => { if (isDirty && !isEdit) setConfirmType('exit'); else onBack() }

  const validate = () => {
    if (!title.trim()) { fireSnack({ type: 'error', title: 'Gagal', message: 'Judul dokumen wajib diisi' }); return false }
    if (!url.trim()) { fireSnack({ type: 'error', title: 'Gagal', message: 'Link dokumen wajib diisi' }); return false }
    try { new URL(url) } catch { fireSnack({ type: 'error', title: 'Gagal', message: 'Format link tidak valid' }); return false }
    return true
  }

  const doSave = (status) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSave({ id: initial?.id, title: title.trim(), url: url.trim(), publisher, date: initial?.date || today, status })
      setConfirmType(null)
    }, 700)
  }
  const triggerSave = (status) => { if (!validate()) return; setConfirmType(status) }

  return (
    <>
      <button onClick={requestBack} style={{
        alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0',
        fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, color: 'var(--color-text-dark)',
      }}>
        <IconBack size={18} stroke="var(--color-text-dark)" /> Kembali
      </button>

      <div style={{ background: 'var(--color-card)', borderRadius: 12, padding: 'clamp(20px, 2.4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, color: 'var(--color-text-dark)' }}>
          {isEdit ? 'Edit Dokumen' : 'Tambah Dokumen'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }} className="cms-form-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <TextField label="Judul Dokumen" required value={title} onChange={setTitle} placeholder="Masukkan judul dokumen" />

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
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://drive.google.com/..." style={{
                  flex: 1, height: '100%', border: 'none', outline: 'none',
                  padding: '0 16px', fontFamily: 'var(--font-base)', fontSize: 'var(--text-sm)', color: 'var(--color-text-dark)', background: 'transparent',
                }} />
              </div>
              <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', lineHeight: 1.5 }}>
                Gunakan link Google Drive, Dropbox, atau URL file eksternal (PDF, DOCX, dll).
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, border: '1px solid var(--color-surface-3)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconDocument size={28} stroke="var(--color-blue)" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 15, color: 'var(--color-text-dark)', marginBottom: 6 }}>Tips Publikasi Dokumen</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-light)', lineHeight: 1.6 }}>
                <li>Pastikan file di Google Drive diatur "Siapa saja dengan link" agar dapat diakses publik.</li>
                <li>Beri judul deskriptif &amp; mudah dicari.</li>
                <li>Dokumen berstatus <strong>Draf</strong> tidak tampil di website.</li>
                <li>Dokumen berstatus <strong>Terbit</strong> langsung dapat diakses audiens.</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--color-surface-3)' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>
            * Dokumen tersimpan sebagai draf bila tidak diterbitkan.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonSecondary onClick={requestBack}>Batal</ButtonSecondary>
            <ButtonSecondary onClick={() => triggerSave('draf')}>Simpan sebagai Draf</ButtonSecondary>
            <ButtonPrimary onClick={() => triggerSave('terbit')}>
              <IconExport size={16} stroke="#fff" /> Simpan &amp; Terbitkan
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <ConfirmModal open={confirmType === 'draf'} title="Simpan sebagai Draf" message="Dokumen akan disimpan tanpa dipublikasikan." confirmLabel="Ya, Simpan" loading={saving} onConfirm={() => doSave('draf')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'terbit'} title="Terbitkan Dokumen" message="Dokumen akan langsung dapat diakses publik di website setelah diterbitkan." confirmLabel="Ya, Terbitkan" loading={saving} onConfirm={() => doSave('terbit')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'exit'} title="Keluar tanpa menyimpan?" message="Perubahan yang belum disimpan akan hilang." confirmLabel="Ya, Keluar" onConfirm={() => { setConfirmType(null); onBack() }} onClose={() => setConfirmType(null)} />
    </>
  )
}

export default function DokumenPage({ fireSnack, fireNotif }) {
  const [docs,    setDocs]    = useState([])
  const [editing, setEditing] = useState(null)
  const [view,    setView]    = useState('list')
  const [loading, setLoading] = useState(true)

  const dbToUi = (n) => ({ id: n.id, title: n.title, publisher: n.publisher || '', date: n.tanggal || '', url: n.link_url || '', status: n.status })

  const load = async () => {
    try {
      const data = await dokumenApi.getAll()
      setDocs(data.map(dbToUi))
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
      const payload = { title: data.title, publisher: data.publisher || 'Admin', tanggal: data.date || null, link_url: data.url, status: data.status }
      if (data.id) await dokumenApi.update(data.id, payload)
      else await dokumenApi.create(payload)
      const fresh = await dokumenApi.getAll()
      setDocs(fresh.map(dbToUi))
      fireSnack({ type: data.status === 'terbit' ? 'primary' : 'success', title: 'Berhasil', message: data.status === 'terbit' ? 'Dokumen telah diterbitkan' : 'Dokumen tersimpan sebagai draf' })
      fireNotif?.({ action: data.status === 'terbit' ? 'publish' : (data.id ? 'update' : 'create'), feature: 'Dokumen', item: data.title })
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menyimpan', message: e.message })
      dokumenApi.getAll().then(d => setDocs(d.map(dbToUi))).catch(() => {})
    }
  }

  const handleDelete = async (id) => {
    setDocs(prev => prev.filter(n => n.id !== id))
    try {
      await dokumenApi.remove(id)
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menghapus', message: e.message })
      dokumenApi.getAll().then(d => setDocs(d.map(dbToUi))).catch(() => {})
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-base)', color: 'var(--color-text-light)' }}>Memuat data…</div>

  if (view === 'form') return <DokumenForm initial={editing} onBack={() => setView('list')} onSave={handleSave} fireSnack={fireSnack} />
  return <DokumenList docs={docs} onAdd={() => { setEditing(null); setView('form') }} onEdit={n => { setEditing(n); setView('form') }} onDelete={handleDelete} fireSnack={fireSnack} fireNotif={fireNotif} />
}
