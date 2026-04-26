import { useState, useRef, useEffect } from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import TextField from '../../components/TextField'
import SearchInput from '../../components/SearchInput'
import Select from '../../components/Select'
import StatusBadge from '../../components/StatusBadge'
import { ConfirmModal } from '../../components/Modal'
import { IconAdd, IconEdit, IconTrash, IconBack, IconImage, IconExport } from '../../components/Icons'
import { guruStafApi } from '../../lib/api'
import { uploadToStorage } from '../../lib/upload'

// ─── constants ───────────────────────────────────────────────
const CUR       = new Date().getFullYear()
const YEARS     = Array.from({ length: CUR - 1979 }, (_, i) => ({ value: String(CUR - i), label: String(CUR - i) }))
const YEARS_END = [{ value: 'sekarang', label: 'Sekarang' }, ...YEARS]
const TINGKAT_OPTS = ['Internasional','Nasional','Provinsi','Kabupaten/Kota','Kecamatan','Sekolah']
  .map(t => ({ value: t, label: t }))

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`
const blankPendidikan = () => ({ id: uid(), confirmed: false, pendidikan: '', sekolah: '', kota: '', tahun_mulai: '', tahun_selesai: '' })
const blankPengalaman = () => ({ id: uid(), confirmed: false, posisi: '', perusahaan: '', area: '', tahun_mulai: '', tahun_selesai: '' })
const blankPrestasi   = () => ({ id: uid(), confirmed: false, lomba: '', penyelenggara: '', predikat: '', tingkat: '', tahun: '' })

// ─── avatar helpers ───────────────────────────────────────────
const PALETTE = ['#4361EE','#F72585','#7209B7','#3A0CA3','#4CC9F0','#06D6A0','#FB8500']
const avatarColor = (n) => PALETTE[(n?.charCodeAt(0) || 0) % PALETTE.length]
const initials    = (n = '') => { const p = n.trim().split(/\s+/); return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() }

// ─── PHOTO UPLOADER ──────────────────────────────────────────
function PhotoUploader({ value, onChange }) {
  const ref = useRef()
  const pick = (e) => { const f = e.target.files[0]; if (f) onChange({ file: f, preview: URL.createObjectURL(f) }) }
  const del  = () => { onChange(null); if (ref.current) ref.current.value = '' }
  return (
    <div style={{ position: 'sticky', top: 24 }}>
      <div
        onClick={() => !value && ref.current.click()}
        style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', border: value ? 'none' : '1.5px dashed var(--color-border)', background: value ? 'transparent' : 'var(--color-surface-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: value ? 'default' : 'pointer', overflow: 'hidden', transition: 'border-color var(--transition-fast)' }}
        onMouseEnter={e => { if (!value) e.currentTarget.style.borderColor = 'var(--color-blue)' }}
        onMouseLeave={e => { if (!value) e.currentTarget.style.borderColor = 'var(--color-border)' }}
      >
        {value
          ? <img src={value.preview || value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <>
              <IconImage size={36} stroke="var(--color-text-light)" />
              <div style={{ marginTop: 12, textAlign: 'center', padding: '0 16px' }}>
                <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)', fontWeight: 500 }}>Unggah gambar, atau <span style={{ color: 'var(--color-blue)' }}>telusuri!</span></div>
                <div style={{ fontFamily: 'var(--font-base)', fontSize: 11, color: 'var(--color-text-light)', marginTop: 4 }}>Ukuran 300×400px. Format PNG, JPG.</div>
              </div>
            </>
        }
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={pick} />
      {value && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <ButtonSecondary onClick={() => ref.current.click()} style={{ flex: 1, height: 34, fontSize: 13 }}>Ganti</ButtonSecondary>
          <button onClick={del} style={{ flex: 1, height: 34, borderRadius: 'var(--radius-lg)', border: '1px solid #FFD6DA', background: '#FFF5F6', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-error)', cursor: 'pointer' }}>Hapus</button>
        </div>
      )}
    </div>
  )
}

// ─── CONFIRMED ENTRY ROW ─────────────────────────────────────
function ConfirmedRow({ label, onEdit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
      <span style={{ fontFamily: 'var(--font-base)', fontSize: 14, fontWeight: 500, color: 'var(--color-text-dark)' }}>{label || '(kosong)'}</span>
      <button onClick={onEdit} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <IconEdit size={15} stroke="var(--color-text-base)" />
      </button>
    </div>
  )
}

// ─── ENTRY FOOTER (trash + Tambahkan) ────────────────────────
function EntryFooter({ onRemove, onConfirm }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
      <button onClick={onRemove} style={{ width: 'var(--control-h)', height: 'var(--control-h)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconTrash size={16} stroke="var(--color-text-base)" />
      </button>
      <button onClick={onConfirm} style={{ height: 'var(--control-h)', padding: '0 20px', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--color-navy)', color: '#F9F9F9', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 'var(--text-md)', cursor: 'pointer' }}>
        Tambahkan
      </button>
    </div>
  )
}

// ─── SECTION WRAPPER ─────────────────────────────────────────
function SectionBlock({ title, onAdd, children, empty }) {
  return (
    <div>
      {/* section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 15, color: 'var(--color-text-dark)' }}>{title}</span>
        <button onClick={onAdd} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconAdd size={16} stroke="var(--color-text-base)" />
        </button>
      </div>
      {empty && (
        <p style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-light)', margin: '0 0 8px' }}>Belum ada data. Klik + untuk menambahkan.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}

// ─── ENTRY FORM (open / not confirmed) ───────────────────────
function PendidikanEntry({ e, upd, rem, confirm }) {
  return (
    <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TextField label="Pendidikan" value={e.pendidikan} onChange={v => upd('pendidikan', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <TextField label="Sekolah" placeholder="Tulis Sekolah" value={e.sekolah} onChange={v => upd('sekolah', v)} />
          <TextField label="Kota"    placeholder="Tulis Kota"    value={e.kota}    onChange={v => upd('kota', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Tahun mulai"    value={e.tahun_mulai}   onChange={v => upd('tahun_mulai', v)}   options={YEARS}     placeholder="Pilih tahun" />
          <Select label="Tahun berakhir" value={e.tahun_selesai} onChange={v => upd('tahun_selesai', v)} options={YEARS_END} placeholder="Pilih tahun" />
        </div>
        <EntryFooter onRemove={rem} onConfirm={confirm} />
      </div>
    </div>
  )
}

function PengalamanEntry({ e, upd, rem, confirm }) {
  return (
    <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TextField label="Posisi" value={e.posisi} onChange={v => upd('posisi', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <TextField label="Perusahaan Kerja" placeholder="Tulis Perusahaan" value={e.perusahaan} onChange={v => upd('perusahaan', v)} />
          <TextField label="Area"             placeholder="Tulis Area"       value={e.area}       onChange={v => upd('area', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Tahun mulai"    value={e.tahun_mulai}   onChange={v => upd('tahun_mulai', v)}   options={YEARS}     placeholder="Pilih tahun" />
          <Select label="Tahun berakhir" value={e.tahun_selesai} onChange={v => upd('tahun_selesai', v)} options={YEARS_END} placeholder="Pilih tahun" />
        </div>
        <EntryFooter onRemove={rem} onConfirm={confirm} />
      </div>
    </div>
  )
}

function PrestasiEntry({ e, upd, rem, confirm }) {
  return (
    <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TextField label="Lomba" value={e.lomba} onChange={v => upd('lomba', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <TextField label="Penyelenggara"  placeholder="Tulis Penyelenggara" value={e.penyelenggara} onChange={v => upd('penyelenggara', v)} />
          <TextField label="Predikat/Juara" placeholder="Tulis Predikat"     value={e.predikat}      onChange={v => upd('predikat', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Tingkat" value={e.tingkat} onChange={v => upd('tingkat', v)} options={TINGKAT_OPTS} placeholder="Pilih Tingkat" />
          <Select label="Tahun"   value={e.tahun}   onChange={v => upd('tahun', v)}   options={YEARS}        placeholder="Pilih tahun" />
        </div>
        <EntryFooter onRemove={rem} onConfirm={confirm} />
      </div>
    </div>
  )
}

// ─── DYNAMIC SECTION HOOKS ────────────────────────────────────
function useDynamic(init = []) {
  const [list, setList] = useState(init)
  const upd     = (id, k, v) => setList(l => l.map(e => e.id === id ? { ...e, [k]: v } : e))
  const rem     = (id)       => setList(l => l.filter(e => e.id !== id))
  const confirm = (id)       => setList(l => l.map(e => e.id === id ? { ...e, confirmed: true } : e))
  const edit    = (id)       => setList(l => l.map(e => e.id === id ? { ...e, confirmed: false } : e))
  return { list, setList, upd, rem, confirm, edit }
}

// ─── FORM VIEW ────────────────────────────────────────────────
function GuruStafForm({ initial, onBack, onSave }) {
  const isEdit = !!initial?.id
  const [nama,    setNama]    = useState(initial?.nama    || '')
  const [jabatan, setJabatan] = useState(initial?.jabatan || '')
  const [foto,    setFoto]    = useState(initial?.foto    || null)
  const [errors,  setErrors]  = useState({})
  const [confirmType, setConfirmType] = useState(null)

  const pend = useDynamic(initial?.pendidikan || [])
  const peng = useDynamic(initial?.pengalaman || [])
  const pres = useDynamic(initial?.prestasi   || [])

  const isDirty = nama || jabatan || foto || pend.list.length || peng.list.length || pres.list.length
  const requestBack = () => { if (isDirty && !isEdit) setConfirmType('exit'); else onBack() }

  const validate = () => {
    const e = {}
    if (!nama.trim())    e.nama    = 'Nama wajib diisi'
    if (!jabatan.trim()) e.jabatan = 'Jabatan wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const doSave = (status) => {
    if (!validate()) { setConfirmType(null); return }
    onSave({
      id: initial?.id || Date.now(),
      nama, jabatan, foto,
      pendidikan: pend.list,
      pengalaman: peng.list,
      prestasi:   pres.list,
      status,
    })
    setConfirmType(null)
  }

  return (
    <>
      {/* back button */}
      <button onClick={requestBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 14, color: 'var(--color-text-dark)' }}>
        <IconBack size={18} stroke="var(--color-text-dark)" /> Kembali
      </button>

      {/* main card */}
      <div style={{ background: 'var(--color-card)', borderRadius: 12, padding: 'clamp(20px, 2.4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, color: 'var(--color-text-dark)' }}>
          {isEdit ? 'Edit Data' : 'Tambah data'}
        </div>

        {/* 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 200px', gap: 'clamp(16px,2vw,28px)', alignItems: 'start' }} className="cms-form-grid">

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Biodata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 15, color: 'var(--color-text-dark)' }}>Biodata</span>
              <TextField label="Nama" required value={nama} onChange={v => { setNama(v); setErrors(p => ({ ...p, nama: undefined })) }} error={errors.nama} />
              <TextField label="Jabatan" required placeholder="Tulis Jabatan" value={jabatan} onChange={v => { setJabatan(v); setErrors(p => ({ ...p, jabatan: undefined })) }} error={errors.jabatan} />
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)' }} />

            {/* Riwayat Pendidikan */}
            <SectionBlock title="Riwayat Pendidikan" onAdd={() => pend.setList(l => [...l, blankPendidikan()])} empty={pend.list.length === 0}>
              {pend.list.map(e => e.confirmed
                ? <ConfirmedRow key={e.id} label={e.pendidikan || e.sekolah} onEdit={() => pend.edit(e.id)} />
                : <PendidikanEntry key={e.id} e={e}
                    upd={(k,v) => pend.upd(e.id,k,v)}
                    rem={() => pend.rem(e.id)}
                    confirm={() => pend.confirm(e.id)} />
              )}
            </SectionBlock>

            <div style={{ borderTop: '1px solid var(--color-border)' }} />

            {/* Pengalaman Kerja */}
            <SectionBlock title="Pengalaman Kerja" onAdd={() => peng.setList(l => [...l, blankPengalaman()])} empty={peng.list.length === 0}>
              {peng.list.map(e => e.confirmed
                ? <ConfirmedRow key={e.id} label={e.posisi || e.perusahaan} onEdit={() => peng.edit(e.id)} />
                : <PengalamanEntry key={e.id} e={e}
                    upd={(k,v) => peng.upd(e.id,k,v)}
                    rem={() => peng.rem(e.id)}
                    confirm={() => peng.confirm(e.id)} />
              )}
            </SectionBlock>

            <div style={{ borderTop: '1px solid var(--color-border)' }} />

            {/* Prestasi */}
            <SectionBlock title="Prestasi" onAdd={() => pres.setList(l => [...l, blankPrestasi()])} empty={pres.list.length === 0}>
              {pres.list.map(e => e.confirmed
                ? <ConfirmedRow key={e.id} label={e.lomba || e.penyelenggara} onEdit={() => pres.edit(e.id)} />
                : <PrestasiEntry key={e.id} e={e}
                    upd={(k,v) => pres.upd(e.id,k,v)}
                    rem={() => pres.rem(e.id)}
                    confirm={() => pres.confirm(e.id)} />
              )}
            </SectionBlock>
          </div>

          {/* RIGHT */}
          <PhotoUploader value={foto} onChange={setFoto} />
        </div>

        {/* bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--color-surface-3)' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)' }}>
            * Data tersimpan sebagai draf bila tidak diterbitkan.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonSecondary onClick={requestBack}>Batal</ButtonSecondary>
            <ButtonSecondary onClick={() => setConfirmType('draf')}>Simpan sebagai Draf</ButtonSecondary>
            <ButtonPrimary   onClick={() => setConfirmType('terbit')}>
              <IconExport size={16} stroke="#fff" /> Simpan &amp; Terbitkan
            </ButtonPrimary>
          </div>
        </div>
      </div>

      {/* confirm modals */}
      <ConfirmModal open={confirmType === 'draf'}   title="Simpan sebagai Draf"  message="Data akan disimpan tanpa dipublikasikan ke website."                   confirmLabel="Ya, Simpan"     onConfirm={() => doSave('draf')}   onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'terbit'} title="Terbitkan Data"        message="Data guru/staff akan langsung tampil di website setelah diterbitkan." confirmLabel="Ya, Terbitkan"  onConfirm={() => doSave('terbit')} onClose={() => setConfirmType(null)} />
      <ConfirmModal open={confirmType === 'exit'}   title="Keluar tanpa menyimpan?" message="Perubahan yang belum disimpan akan hilang."                          confirmLabel="Ya, Keluar"     onConfirm={() => { setConfirmType(null); onBack() }}  onClose={() => setConfirmType(null)} />
    </>
  )
}

// ─── LIST VIEW ────────────────────────────────────────────────
function GuruStafList({ items, onAdd, onEdit, onDelete }) {
  const [search,     setSearch]     = useState('')
  const [confirmDel, setConfirmDel] = useState(null)

  const filtered = items.filter(i =>
    i.nama.toLowerCase().includes(search.toLowerCase()) ||
    i.jabatan.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Guru &amp; Staff</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Data personil yang tampil di website.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>
              {items.length} total · {items.filter(i => i.status === 'terbit').length} terbit
            </span>
          </div>
        </div>
        <ButtonPrimary onClick={onAdd}><IconAdd size={18} stroke="#fff" /> Tambah Data</ButtonPrimary>
      </div>

      <div style={{ maxWidth: 400 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama atau jabatan…" />
      </div>

      <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                {['Foto & Nama','Jabatan','Status','Aksi'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: i === 3 ? 'right' : 'left', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 60, textAlign: 'center', color: 'var(--color-text-light)', fontFamily: 'var(--font-base)', fontSize: 14 }}>
                  {search ? 'Data tidak ditemukan.' : 'Belum ada data. Klik "Tambah Data" untuk memulai.'}
                </td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-surface-3)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {item.foto ? (
                        <img src={item.foto.preview || item.foto} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: avatarColor(item.nama), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 13, color: '#fff' }}>{initials(item.nama)}</span>
                        </div>
                      )}
                      <span style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)' }}>{item.nama}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>{item.jabatan}</td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={item.status} /></td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => onEdit(item)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconEdit size={16} stroke="var(--color-text-base)" />
                      </button>
                      <button onClick={() => setConfirmDel(item)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #FFD6DA', background: '#FFF5F6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconTrash size={16} stroke="var(--color-error)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!confirmDel}
        title="Hapus Data"
        message={confirmDel ? `Yakin ingin menghapus data "${confirmDel.nama}"? Tindakan ini tidak dapat dibatalkan.` : ''}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { onDelete(confirmDel.id); setConfirmDel(null) }}
        onClose={() => setConfirmDel(null)}
      />
    </>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function GuruStafPage({ fireSnack, fireNotif }) {
  const [view,     setView]     = useState('list')
  const [items,    setItems]    = useState([])
  const [editItem, setEditItem] = useState(null)
  const [loading,  setLoading]  = useState(true)

  const dbToUi = (n) => ({
    id: n.id, nama: n.nama, jabatan: n.jabatan,
    foto: n.foto_url || null,
    pendidikan: (n.riwayat_pendidikan || []).map(e => ({ ...e, id: e.id || uid(), confirmed: true })),
    pengalaman: (n.pengalaman_kerja   || []).map(e => ({ ...e, id: e.id || uid(), confirmed: true })),
    prestasi:   (n.prestasi           || []).map(e => ({ ...e, id: e.id || uid(), confirmed: true })),
    status: n.status,
  })

  const load = async () => {
    try {
      const data = await guruStafApi.getAll()
      setItems(data.map(dbToUi))
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal memuat', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd  = () => { setEditItem(null); setView('form') }
  const openEdit = (item) => { setEditItem(item); setView('form') }
  const goBack   = () => { setView('list'); setEditItem(null) }

  const handleSave = async (data) => {
    goBack()
    try {
      let fotoUrl = null
      if (data.foto) {
        if (typeof data.foto === 'string') fotoUrl = data.foto
        else if (data.foto.file) fotoUrl = await uploadToStorage(data.foto.file, 'guru-staff', 'photos/')
        else if (data.foto.preview) fotoUrl = await uploadToStorage(data.foto.preview, 'guru-staff', 'photos/')
      }
      const clean = (arr) => arr.map(({ id: _id, confirmed: _c, ...rest }) => rest) // eslint-disable-line no-unused-vars
      const payload = {
        nama: data.nama, jabatan: data.jabatan, foto_url: fotoUrl,
        riwayat_pendidikan: clean(data.pendidikan),
        pengalaman_kerja:   clean(data.pengalaman),
        prestasi:           clean(data.prestasi),
        status: data.status,
      }
      if (editItem?.id) await guruStafApi.update(editItem.id, payload)
      else await guruStafApi.create(payload)
      const fresh = await guruStafApi.getAll()
      setItems(fresh.map(dbToUi))
      fireSnack({ type: 'success', title: 'Berhasil', message: editItem ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan' })
      fireNotif?.({ action: editItem ? 'update' : 'create', feature: 'Guru & Staff', item: data.nama })
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menyimpan', message: e.message })
      guruStafApi.getAll().then(d => setItems(d.map(dbToUi))).catch(() => {})
    }
  }

  const handleDelete = async (id) => {
    const name = items.find(i => i.id === id)?.nama
    setItems(prev => prev.filter(i => i.id !== id))
    try {
      await guruStafApi.remove(id)
      fireSnack({ type: 'success', title: 'Dihapus', message: `Data ${name} telah dihapus` })
      fireNotif?.({ action: 'delete', feature: 'Guru & Staff', item: name })
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menghapus', message: e.message })
      guruStafApi.getAll().then(d => setItems(d.map(dbToUi))).catch(() => {})
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-base)', color: 'var(--color-text-light)' }}>Memuat data…</div>

  return view === 'list'
    ? <GuruStafList items={items} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} />
    : <GuruStafForm initial={editItem} onBack={goBack} onSave={handleSave} />
}
