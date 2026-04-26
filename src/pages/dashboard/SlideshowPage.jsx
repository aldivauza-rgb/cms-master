import { useState, useRef, useEffect } from 'react'
import Toggle from '../../components/Toggle'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import TextField from '../../components/TextField'
import { ConfirmModal } from '../../components/Modal'
import { IconEdit, IconExport, IconExit } from '../../components/Icons'
import slideRow     from '../../assets/slide-row.jpg'
import slideDefault from '../../assets/slide-default.jpg'
import { slidesApi } from '../../lib/api'
import { uploadToStorage } from '../../lib/upload'

const INITIAL_SLIDES = [
  { id: 1, title: 'Slideshow-01', desc: 'Selamat datang di website resmi kami. Kami hadir untuk melayani masyarakat dengan lebih baik.', img: slideRow,     active: true  },
  { id: 2, title: 'Slideshow-02', desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',                  img: slideDefault, active: true  },
  { id: 3, title: 'Slideshow-03', desc: 'Jelajahi beragam fitur dan informasi terbaru melalui platform digital kami.',                  img: slideRow,     active: false },
]

function SlideshowRow({ slide, onEdit, onToggle }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cms-row"
      style={{
        width: '100%', borderRadius: 'clamp(10px, 0.8vw, 16px)', background: 'var(--color-card)',
        display: 'grid', gridTemplateColumns: 'minmax(300px, 32%) 1fr auto',
        alignItems: 'center', gap: 0,
        transition: 'box-shadow var(--transition-base), transform var(--transition-base)',
        boxShadow: hover ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Thumbnail + title */}
      <div className="cms-row-left" style={{ display: 'flex', gap: 'var(--space-lg)', padding: 'var(--space-md) var(--space-lg)', alignItems: 'center', minWidth: 0 }}>
        <div
          className="cms-thumb"
          style={{
            width: 'clamp(140px, 14vw, 240px)', aspectRatio: '16/9',
            borderRadius: 'clamp(8px, 0.6vw, 12px)', flexShrink: 0,
            background: `url(${slide.img}) center/cover no-repeat, #D9D9D9`,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 'clamp(14px, 1.05vw, 18px)', lineHeight: 1.4, color: 'var(--color-text-dark)' }}>
            {slide.title}
          </div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-sm)', lineHeight: 1.4, color: 'var(--color-text-light)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: slide.active ? '#007955' : '#97A2B0', flexShrink: 0 }}/>
            {slide.active ? 'Aktif' : 'Nonaktif'}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: 'var(--space-md) var(--space-lg)', minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-base)', fontSize: 'clamp(13px, 0.95vw, 17px)', lineHeight: 1.55,
          color: 'var(--color-text-base)',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {slide.desc}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'clamp(8px, 0.8vw, 14px)', padding: 'var(--space-md) var(--space-lg)', alignItems: 'center', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onEdit(slide)}
          title="Edit"
          style={{
            width: 'clamp(36px, 2.5vw, 44px)', height: 'clamp(36px, 2.5vw, 44px)',
            borderRadius: 'clamp(8px, 0.6vw, 10px)', border: '1px solid var(--color-border)',
            background: 'var(--color-card)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-card)'}
        >
          <IconEdit size={18} stroke="var(--color-text-base)" />
        </button>
        <Toggle on={slide.active} onChange={v => onToggle(slide.id, v)} />
      </div>
    </div>
  )
}

function EditSlideshowDrawer({ slide, onClose, onSave }) {
  const [desc, setDesc] = useState(slide?.desc || '')
  const [img, setImg]   = useState(slide?.img || '')
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving]     = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    setDesc(slide?.desc || '')
    setImg(slide?.img || '')
  }, [slide?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!slide) return null

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setImg(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); onSave({ ...slide, desc, img }) }, 700)
  }

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        zIndex: 'var(--z-drawer-bd)', animation: 'cms-fade .2s ease',
      }}/>
      <div style={{
        position: 'fixed', top: 24, right: 24, bottom: 24,
        width: 'min(512px, calc(100vw - 48px))',
        background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: 32,
        display: 'flex', flexDirection: 'column', gap: 24,
        zIndex: 'var(--z-drawer)',
        boxShadow: 'var(--shadow-drawer)',
        animation: 'cms-slide-in .25s cubic-bezier(.2,.8,.2,1)',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 20, lineHeight: 1.4, color: '#09002E' }}>
            Edit Slideshow
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <IconExit size={24} stroke="var(--color-text-dark)" />
          </button>
        </div>

        {/* Thumbnail uploader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-base)' }}>
            Thumbnail <span style={{ color: 'var(--color-error-red)' }}>*</span>
          </label>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]) }}
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-lg)',
              background: img ? `url(${img}) center/cover no-repeat` : 'var(--color-surface-2)',
              border: `1.5px dashed ${dragging ? 'var(--color-blue)' : 'var(--color-border)'}`,
              position: 'relative', cursor: 'pointer', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {img && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,.45))' }}/>}
            <div style={{
              position: 'absolute', right: 12, bottom: 12, zIndex: 2,
              background: 'rgba(255,255,255,.95)', borderRadius: 8, padding: '8px 12px',
              display: 'inline-flex', gap: 6, alignItems: 'center',
              fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 12, color: 'var(--color-text-dark)',
              boxShadow: '0 2px 6px rgba(0,0,0,.12)',
            }}>
              <IconExport size={16} stroke="var(--color-text-dark)" />
              {img ? 'Ganti Gambar' : 'Unggah Gambar'}
            </div>
            {!img && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-light)', fontFamily: 'var(--font-base)', fontSize: 13, lineHeight: 1.5, padding: 24 }}>
                <IconExport size={32} stroke="var(--color-text-light)" style={{ margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: 4 }}>Seret &amp; lepas gambar</div>
                <div style={{ fontSize: 12 }}>atau klik untuk memilih · PNG, JPG · maks 5MB</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files?.[0])} />
          </div>
        </div>

        <TextField
          label="Deskripsi" required textarea value={desc} onChange={setDesc}
          placeholder="Masukkan deskripsi slideshow"
          helperText={`${desc.length}/200 karakter`}
        />

        <div style={{ flex: 1 }}/>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <ButtonSecondary onClick={onClose}>Batal</ButtonSecondary>
          <ButtonPrimary onClick={handleSave} loading={saving}>Simpan Perubahan</ButtonPrimary>
        </div>
      </div>
    </>
  )
}

export default function SlideshowPage({ fireSnack, fireNotif }) {
  const [slides, setSlides]               = useState([])
  const [editing, setEditing]             = useState(null)
  const [confirmPublish, setConfirmPublish] = useState(false)
  const [publishing, setPublishing]       = useState(false)
  const [loading, setLoading]             = useState(true)

  const dbToUi = (s) => ({ id: s.id, title: s.title || '', desc: s.description || '', img: s.image_url || '', active: s.is_active, order: s.order ?? 0 })

  const load = async () => {
    try {
      const data = await slidesApi.getAll()
      setSlides(data.map(dbToUi))
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal memuat', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async (id, value) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, active: value } : s))
    try {
      await slidesApi.update(id, { is_active: value })
      fireSnack({ type: 'success', title: 'Yeah!', message: value ? 'Slideshow berhasil diaktifkan' : 'Slideshow dinonaktifkan' })
      fireNotif?.({ action: 'toggle', feature: 'Slideshow' })
    } catch (e) {
      setSlides(prev => prev.map(s => s.id === id ? { ...s, active: !value } : s))
      fireSnack({ type: 'error', title: 'Gagal', message: e.message })
    }
  }

  const handleSave = async (updated) => {
    setEditing(null)
    try {
      const imgUrl = await uploadToStorage(updated.img, 'slides', 'images/')
      const finalImg = imgUrl || updated.img
      await slidesApi.update(updated.id, { image_url: finalImg, description: updated.desc })
      setSlides(prev => prev.map(s => s.id === updated.id ? { ...s, img: finalImg, desc: updated.desc } : s))
      fireSnack({ type: 'success', title: 'Yeah!', message: 'Data berhasil diperbarui' })
      fireNotif?.({ action: 'update', feature: 'Slideshow' })
    } catch (e) {
      fireSnack({ type: 'error', title: 'Gagal menyimpan', message: e.message })
      load()
    }
  }

  const handlePublish = () => {
    setPublishing(true)
    setTimeout(() => {
      setPublishing(false)
      setConfirmPublish(false)
      fireSnack({ type: 'primary', title: 'Data diterbitkan', message: 'Perubahan slideshow sudah tayang di website' })
      fireNotif?.({ action: 'publish', feature: 'Slideshow' })
    }, 900)
  }

  const activeCount = slides.filter(s => s.active).length

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-base)', color: 'var(--color-text-light)' }}>Memuat data…</div>

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Slideshow</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
            Kelola gambar hero yang tampil di beranda website.{' '}
            <span style={{ color: 'var(--color-text-base)', fontWeight: 500 }}>{activeCount} dari {slides.length} aktif</span>
          </div>
        </div>
        <ButtonPrimary onClick={() => setConfirmPublish(true)}>
          <IconExport size={18} stroke="#fff" /> Terbitkan
        </ButtonPrimary>
      </div>

      <div className="cms-col-headers" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'minmax(300px, 32%) 1fr auto', padding: '0 var(--space-lg)', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 'clamp(11px, 0.8vw, 14px)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <div>Slide</div><div>Deskripsi</div><div style={{ textAlign: 'right', minWidth: 100 }}>Aksi</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.2vw, 20px)' }}>
        {slides.length === 0
          ? <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-muted)', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)' }}>Belum ada slide. Tambahkan lewat Supabase Dashboard → Table Editor → slides.</div>
          : slides.map(s => <SlideshowRow key={s.id} slide={s} onEdit={setEditing} onToggle={handleToggle} />)
        }
      </div>

      {editing && <EditSlideshowDrawer slide={editing} onClose={() => setEditing(null)} onSave={handleSave} />}

      <ConfirmModal open={confirmPublish} title="Terbitkan Data" message="Apakah anda yakin ingin menerbitkan data ini? Perubahan akan langsung tampil di website." confirmLabel="Ya, Terbitkan" onConfirm={handlePublish} onClose={() => setConfirmPublish(false)} loading={publishing} />
    </>
  )
}
