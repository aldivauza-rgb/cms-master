import { useState, useEffect, useRef } from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { ConfirmModal } from '../../components/Modal'
import { IconExport, IconEye, IconExit } from '../../components/Icons'
import { profilApi } from '../../lib/api'
import { uploadToStorage } from '../../lib/upload'
import slideDefaultUrl from '../../assets/slide-default.jpg'
import slideRowUrl from '../../assets/slide-row.jpg'
import coverSuaraUrl from '../../assets/cover-suara.jpg'
import coverInspirasiUrl from '../../assets/cover-inspirasi.jpg'
import coverWartaUrl from '../../assets/cover-warta.jpg'
import coverLaporanUrl from '../../assets/cover-laporan.jpg'

const uid = () => Math.random().toString(36).slice(2, 9)

const SEEDS = {
  tentang: {
    title: 'Tentang Kami',
    blocks: [
      { id: uid(), type: 'text', variant: 'heading', value: 'Mengabdi untuk Masyarakat, Berintegritas dalam Pelayanan' },
      { id: uid(), type: 'image', src: slideDefaultUrl, alt: 'Kantor pelayanan publik', layout: 'full' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Kami adalah instansi pemerintah daerah yang berkomitmen penuh untuk memberikan pelayanan terbaik kepada masyarakat. Didirikan dengan semangat transparansi dan akuntabilitas, kami terus berinovasi dalam setiap aspek pelayanan publik.' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Sejak berdirinya, kami telah melayani ribuan warga dengan standar pelayanan yang modern, cepat, dan mudah diakses.' },
    ],
  },
  visimisi: {
    title: 'Visi & Misi',
    blocks: [
      { id: uid(), type: 'text', variant: 'heading', value: 'Visi' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Menjadi instansi pemerintah daerah terdepan yang melayani dengan hati, profesional, dan berorientasi pada kepuasan masyarakat menuju tata kelola pemerintahan yang modern.' },
      { id: uid(), type: 'text', variant: 'heading', value: 'Misi' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Memberikan pelayanan publik yang prima, transparan, dan akuntabel. Membangun sistem pemerintahan berbasis digital. Meningkatkan kualitas sumber daya manusia pemerintahan.' },
    ],
  },
  sambutan: {
    title: 'Sambutan',
    blocks: [
      { id: uid(), type: 'text', variant: 'heading', value: 'Sambutan Pimpinan' },
      { id: uid(), type: 'image', src: slideRowUrl, alt: 'Foto pimpinan', layout: 'contained' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Assalamualaikum warahmatullahi wabarakatuh. Dengan mengucap syukur ke hadirat Tuhan Yang Maha Esa, kami menyambut baik kehadiran Anda di website resmi instansi kami.' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Website ini merupakan wujud komitmen kami untuk menghadirkan pelayanan publik yang lebih terbuka, modern, dan mudah diakses oleh seluruh lapisan masyarakat.' },
    ],
  },
  struktur: {
    title: 'Struktur Organisasi',
    blocks: [
      { id: uid(), type: 'text', variant: 'heading', value: 'Struktur Organisasi' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Struktur organisasi kami disusun untuk memastikan efektivitas dan akuntabilitas dalam menjalankan tugas pemerintahan.' },
      { id: uid(), type: 'image', src: slideDefaultUrl, alt: 'Bagan struktur organisasi', layout: 'full' },
    ],
  },
  akreditasi: {
    title: 'Akreditasi',
    blocks: [
      { id: uid(), type: 'text', variant: 'heading', value: 'Akreditasi & Sertifikasi' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Kami secara berkala menjalani proses akreditasi dari lembaga-lembaga independen untuk memastikan kualitas pelayanan publik yang kami berikan.' },
      { id: uid(), type: 'gallery', slides: [{ id: uid(), src: coverSuaraUrl }, { id: uid(), src: coverInspirasiUrl }, { id: uid(), src: coverWartaUrl }], layout: 'contained' },
    ],
  },
  statistik: {
    title: 'Statistik',
    blocks: [
      { id: uid(), type: 'text', variant: 'heading', value: 'Statistik & Capaian' },
      { id: uid(), type: 'text', variant: 'paragraph', value: 'Data statistik berikut menggambarkan capaian kinerja kami dalam memberikan pelayanan kepada masyarakat.' },
      { id: uid(), type: 'image', src: coverLaporanUrl, alt: 'Visualisasi data statistik', layout: 'full' },
    ],
  },
}

// ── LOCAL ICON SVGs ───────────────────────────────────────────────
const IText = ({ stroke = '#354764' }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V5h16v2M9 5v14M15 19h-6" /></svg>
const IImg = ({ stroke = '#354764' }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
const IVid = ({ stroke = '#354764' }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M10 9l5 3-5 3z" fill={stroke} /></svg>
const IGallery = ({ stroke = '#354764' }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M7 21h12a2 2 0 002-2V9" /></svg>
const IUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#354764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
const IDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#354764" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
const IDupe = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#354764" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" /></svg>
const IDel = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA4C3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>
const IPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#354764" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
const IClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#354764" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
const IChevR = ({ stroke = '#354764' }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
const ILayoutC = ({ stroke = '#354764' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4" /></svg>
const ILayoutF = ({ stroke = '#354764' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"><path d="M4 8l4-4M4 8l4 4M4 8h4M20 16l-4 4M20 16l-4-4M20 16h-4" /></svg>
const IListDot = ({ stroke = '#354764' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="2" fill={stroke} stroke="none"/><circle cx="4" cy="12" r="2" fill={stroke} stroke="none"/><circle cx="4" cy="18" r="2" fill={stroke} stroke="none"/></svg>
const IListNum = ({ stroke = '#354764' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 4v4M3 10h2a1 1 0 010 2H3l2 3H3M3 18h2" strokeWidth="1.5"/></svg>

// ── BLOCK RENDERERS ───────────────────────────────────────────────
function TextBlock({ block, onChange, onClick }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== block.value) {
      ref.current.innerText = block.value || ''
    }
  }, [block.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const common = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onInput: e => onChange({ ...block, value: e.currentTarget.innerText }),
    onClick,
    ref,
    style: { outline: 'none', cursor: 'text' },
  }
  if (block.variant === 'heading') {
    return <div {...common} data-placeholder="Heading..." style={{ ...common.style, fontFamily: 'var(--font-base)', fontSize: 'clamp(26px, 2.6vw, 36px)', fontWeight: 700, color: 'var(--color-text-dark)', lineHeight: 1.25, letterSpacing: '-0.01em' }} />
  }
  return <div {...common} data-placeholder="Paragraph..." style={{ ...common.style, fontFamily: 'var(--font-base)', fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'var(--color-text-base)', lineHeight: 1.7 }} />
}

function ImageBlock({ block, onChange }) {
  const inputRef = useRef()
  const handleFile = f => { if (f) onChange({ ...block, src: URL.createObjectURL(f) }) }
  if (!block.src) return (
    <div onClick={() => inputRef.current?.click()} style={{ width: '100%', minHeight: 260, border: '2px dashed var(--color-border-2)', borderRadius: 12, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)' }}>
      <span>Drag and drop media, or <span style={{ textDecoration: 'underline', color: 'var(--color-text-dark)', fontWeight: 500 }}>Browse</span></span>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files?.[0])} />
    </div>
  )
  return <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}><img src={block.src} alt={block.alt || ''} style={{ width: '100%', display: 'block', maxHeight: 560, objectFit: 'cover' }} /></div>
}

function VideoBlock({ block, onChange }) {
  const inputRef = useRef()
  if (!block.src) return (
    <div onClick={() => inputRef.current?.click()} style={{ width: '100%', minHeight: 260, border: '2px dashed var(--color-border-2)', borderRadius: 12, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)' }}>
      <span>Drag and drop video, or <span style={{ textDecoration: 'underline', color: 'var(--color-text-dark)', fontWeight: 500 }}>Browse</span></span>
      <input ref={inputRef} type="file" accept="video/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) onChange({ ...block, src: URL.createObjectURL(f) }) }} />
    </div>
  )
  return <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', background: '#000' }}><video src={block.src} controls style={{ width: '100%', display: 'block', maxHeight: 560 }} /></div>
}

function GalleryBlock({ block, onChange }) {
  const [active, setActive] = useState(0)
  const slides = block.slides || []
  const cur = slides[active]
  const inputRef = useRef()

  const handleUpload = f => {
    if (!f) return
    const url = URL.createObjectURL(f)
    const next = [...slides]
    next[active] = { ...next[active], src: url }
    onChange({ ...block, slides: next })
  }

  if (!slides.length) return <div style={{ width: '100%', minHeight: 260, border: '2px dashed var(--color-border-2)', borderRadius: 12, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)' }}>Tambahkan slide pertama dari panel kanan →</div>

  return (
    <div>
      {cur?.src ? (
        <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}><img src={cur.src} alt="" style={{ width: '100%', display: 'block', maxHeight: 500, objectFit: 'cover' }} /></div>
      ) : (
        <div onClick={() => inputRef.current?.click()} style={{ width: '100%', minHeight: 260, border: '2px dashed var(--color-border-2)', borderRadius: 12, background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)' }}>
          <span>Klik untuk unggah foto slide</span>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={e => handleUpload(e.target.files?.[0])} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => setActive(i)} style={{ width: 64, height: 48, borderRadius: 8, overflow: 'hidden', border: i === active ? '2px solid var(--color-blue)' : '1px solid var(--color-border)', padding: 0, background: 'var(--color-surface-2)', cursor: 'pointer' }}>
            {s.src ? <img src={s.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontFamily: 'var(--font-base)', fontSize: 10, color: 'var(--color-text-muted)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>}
          </button>
        ))}
      </div>
    </div>
  )
}

function ListBlock({ block, onChange, onClick }) {
  const items = block.items || ['']
  const style = block.listStyle || 'dot'
  const updateItem = (i, val) => {
    const next = [...items]; next[i] = val; onChange({ ...block, items: next })
  }
  const addItem = (e) => { e.stopPropagation(); onChange({ ...block, items: [...items, ''] }) }
  const removeItem = (e, i) => {
    e.stopPropagation()
    const next = items.filter((_, idx) => idx !== i)
    onChange({ ...block, items: next.length ? next : [''] })
  }
  return (
    <div onClick={onClick} style={{ cursor: 'text' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-base)', color: 'var(--color-text-dark)', minWidth: 22, textAlign: 'right', flexShrink: 0, fontSize: 'clamp(15px, 1.1vw, 17px)', lineHeight: 1.7 }}>
            {style === 'number' ? `${i + 1}.` : '•'}
          </span>
          <textarea
            value={item}
            onChange={e => { updateItem(i, e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
            placeholder={`Item ${i + 1}…`}
            onClick={e => e.stopPropagation()}
            rows={1}
            style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--font-base)', fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'var(--color-text-base)', lineHeight: 1.7, background: 'transparent', resize: 'none', overflow: 'hidden', padding: 0 }}
          />
          {items.length > 1 && (
            <button onClick={e => removeItem(e, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', color: 'var(--color-text-muted)', fontSize: 18, lineHeight: 1 }}>×</button>
          )}
        </div>
      ))}
      <button onClick={addItem} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-blue)', padding: '4px 0', fontWeight: 500, marginTop: 2 }}>+ Tambah item</button>
    </div>
  )
}

// ── BLOCK WRAPPER ─────────────────────────────────────────────────
function BlockWrapper({ block, index, total, selected, onSelect, onChange, onMove, onDuplicate, onDelete }) {
  const [hover, setHover] = useState(false)
  const show = hover || selected

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onSelect} style={{ position: 'relative', padding: '12px 0' }}>
      <div style={{ border: selected ? '2px solid var(--color-blue)' : '2px solid transparent', borderRadius: 12, padding: block.type === 'text' ? '8px 12px' : '8px', transition: 'border-color .15s' }}>
        {block.type === 'text'    && <TextBlock    block={block} onChange={onChange} onClick={onSelect} />}
        {block.type === 'list'    && <ListBlock    block={block} onChange={onChange} onClick={onSelect} />}
        {block.type === 'image'   && <ImageBlock   block={block} onChange={onChange} />}
        {block.type === 'video'   && <VideoBlock   block={block} onChange={onChange} />}
        {block.type === 'gallery' && <GalleryBlock block={block} onChange={onChange} />}
      </div>

      {show && (
        <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: -56, top: 24, display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--color-card)', borderRadius: 24, padding: 6, border: '1px solid var(--color-border)', boxShadow: '0 4px 16px rgba(1,14,35,0.08)' }}>
          <IBtn disabled={index === 0} onClick={() => onMove(-1)}><IUp /></IBtn>
          <IBtn disabled={index === total - 1} onClick={() => onMove(1)}><IDown /></IBtn>
          <div style={{ height: 1, background: 'var(--color-border)', margin: '2px 6px' }} />
          <IBtn onClick={onDuplicate}><IDupe /></IBtn>
          <IBtn onClick={onDelete}><IDel /></IBtn>
        </div>
      )}
    </div>
  )
}

const IBtn = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ width: 28, height: 28, borderRadius: 14, border: 'none', background: 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.35 : 1 }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--color-surface-3)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
    {children}
  </button>
)

// ── PROPERTIES PANEL ──────────────────────────────────────────────
function PropertiesPanel({ block, onChange, onClose }) {
  const typeLabel = { text: 'Text', list: 'List', image: 'Image', video: 'Video', gallery: 'Gallery' }[block.type]
  const typeIcon  = { text: <IText />, list: <IListDot />, image: <IImg />, video: <IVid />, gallery: <IGallery /> }[block.type]

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 340, height: '100vh', background: 'var(--color-card)', borderLeft: '1px solid var(--color-border)', zIndex: 'var(--z-drawer)', padding: '24px 28px', overflowY: 'auto', boxShadow: '-4px 0 24px rgba(1,14,35,0.06)' }}>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: 0, fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)', cursor: 'pointer', marginBottom: 20 }}>Close</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        {typeIcon}
        <div style={{ fontFamily: 'var(--font-base)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-dark)' }}>{typeLabel}</div>
      </div>

      {block.type === 'text' && (
        <>
          <PLbl>Style</PLbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <PSeg active={block.variant === 'heading'} onClick={() => onChange({ ...block, variant: 'heading' })}>Heading</PSeg>
            <PSeg active={block.variant === 'paragraph'} onClick={() => onChange({ ...block, variant: 'paragraph' })}>Paragraph</PSeg>
          </div>
        </>
      )}

      {block.type === 'list' && (
        <>
          <PLbl>Gaya Daftar</PLbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            <PSeg active={block.listStyle === 'dot'}    onClick={() => onChange({ ...block, listStyle: 'dot' })}>
              <IListDot stroke={block.listStyle === 'dot' ? 'var(--color-blue)' : '#354764'} /> Poin
            </PSeg>
            <PSeg active={block.listStyle === 'number'} onClick={() => onChange({ ...block, listStyle: 'number' })}>
              <IListNum stroke={block.listStyle === 'number' ? 'var(--color-blue)' : '#354764'} /> Nomor
            </PSeg>
          </div>
        </>
      )}

      {(block.type === 'image' || block.type === 'video') && (
        <>
          <PLbl>Media</PLbl>
          <MediaPicker block={block} onChange={onChange} />
          <PLbl style={{ marginTop: 20 }}>Alt Text</PLbl>
          <input value={block.alt || ''} onChange={e => onChange({ ...block, alt: e.target.value })} placeholder="Enter alt text..." style={{ width: '100%', height: 42, borderRadius: 8, border: '1px solid var(--color-border)', padding: '0 12px', fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-dark)', outline: 'none' }} />
          <PLbl style={{ marginTop: 20 }}>Layout</PLbl>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <PSeg active={block.layout === 'contained'} onClick={() => onChange({ ...block, layout: 'contained' })}><ILayoutC stroke={block.layout === 'contained' ? 'var(--color-blue)' : '#354764'} /></PSeg>
            <PSeg active={block.layout === 'full'} onClick={() => onChange({ ...block, layout: 'full' })}><ILayoutF stroke={block.layout === 'full' ? 'var(--color-blue)' : '#354764'} /></PSeg>
          </div>
        </>
      )}

      {block.type === 'gallery' && <GalleryProps block={block} onChange={onChange} />}
    </div>
  )
}

const PLbl = ({ children, style }) => <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: 8, ...style }}>{children}</div>
const PSeg = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{ height: 40, borderRadius: 8, border: active ? '1.5px solid var(--color-blue)' : '1px solid var(--color-border)', background: active ? 'var(--color-blue-light)' : 'var(--color-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-base)', fontSize: 14, fontWeight: 500, color: active ? 'var(--color-blue)' : 'var(--color-text-base)' }}>
    {children}
  </button>
)

function MediaPicker({ block, onChange }) {
  const inputRef = useRef()
  const accept = block.type === 'video' ? 'video/*' : 'image/*'
  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button onClick={() => inputRef.current?.click()} style={{ width: '100%', height: 38, borderRadius: 20, border: '1px solid var(--color-border)', background: 'var(--color-card)', fontFamily: 'var(--font-base)', fontSize: 14, fontWeight: 600, color: 'var(--color-text-dark)', cursor: 'pointer' }}>Select Media</button>
      <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-muted)' }}>or drop media to upload</div>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={e => { const f = e.target.files?.[0]; if (f) onChange({ ...block, src: URL.createObjectURL(f) }) }} />
    </div>
  )
}

function GalleryProps({ block, onChange }) {
  const slides = block.slides || []
  const [activeSlide, setActiveSlide] = useState(0)
  const addSlide = () => onChange({ ...block, slides: [...slides, { id: uid(), src: null }] })
  const removeSlide = (i) => {
    const next = slides.filter((_, idx) => idx !== i)
    onChange({ ...block, slides: next })
    if (activeSlide >= next.length) setActiveSlide(Math.max(0, next.length - 1))
  }
  return (
    <>
      <PLbl>Slides</PLbl>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        {slides.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setActiveSlide(i)} style={{ flex: 1, height: 38, borderRadius: 8, border: 'none', padding: '0 12px', textAlign: 'left', background: activeSlide === i ? 'var(--color-blue-light)' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 14, color: activeSlide === i ? 'var(--color-blue)' : 'var(--color-text-dark)', fontWeight: activeSlide === i ? 600 : 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Slide {i + 1}</span>
              <IChevR stroke={activeSlide === i ? 'var(--color-blue)' : '#354764'} />
            </button>
            <button onClick={() => removeSlide(i)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IDel /></button>
          </div>
        ))}
      </div>
      <button onClick={addSlide} style={{ background: 'transparent', border: 'none', padding: 0, fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-blue)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>Add slides</button>
      <PLbl style={{ marginTop: 24 }}>Layout</PLbl>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <PSeg active={block.layout === 'contained'} onClick={() => onChange({ ...block, layout: 'contained' })}><ILayoutC stroke={block.layout === 'contained' ? 'var(--color-blue)' : '#354764'} /></PSeg>
        <PSeg active={block.layout === 'full'} onClick={() => onChange({ ...block, layout: 'full' })}><ILayoutF stroke={block.layout === 'full' ? 'var(--color-blue)' : '#354764'} /></PSeg>
      </div>
    </>
  )
}

// ── INSERT PANEL ──────────────────────────────────────────────────
function InsertPanel({ open, onClose, onAddBlock, onAddManyBlocks, selectedBlock, onChangeBlock }) {
  const [submenu, setSubmenu] = useState(null)
  useEffect(() => { if (!open) setSubmenu(null) }, [open])
  if (!open) return null
  if (selectedBlock) return <PropertiesPanel block={selectedBlock} onChange={onChangeBlock} onClose={onClose} />

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 340, height: '100vh', background: 'var(--color-card)', borderLeft: '1px solid var(--color-border)', zIndex: 'var(--z-drawer)', padding: '24px 28px', overflowY: 'auto', boxShadow: '-4px 0 24px rgba(1,14,35,0.06)' }}>
      {!submenu && (
        <>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: 0, fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)', cursor: 'pointer', marginBottom: 20 }}>Close</button>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 24 }}>Insert block</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Basic</div>
          <InsItem icon={<IText />} label="Text" hasChevron onClick={() => setSubmenu('text')} />
          <InsItem icon={<IImg />} label="Image" onClick={() => onAddBlock({ type: 'image', src: null, alt: '', layout: 'contained' })} />
          <InsItem icon={<IVid />} label="Video" onClick={() => onAddBlock({ type: 'video', src: null, alt: '', layout: 'contained' })} />
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '24px 0 10px' }}>Rich media</div>
          <InsItem icon={<IGallery />} label="Gallery" onClick={() => onAddBlock({ type: 'gallery', slides: [{ id: uid(), src: null }, { id: uid(), src: null }], layout: 'contained' })} />
        </>
      )}
      {submenu === 'text' && (
        <>
          <button onClick={() => setSubmenu(null)} style={{ background: 'transparent', border: 'none', padding: 0, fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-base)', cursor: 'pointer', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</button>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 24 }}>Text</div>

          <TCard onClick={() => onAddBlock({ type: 'text', variant: 'heading', value: '' })}>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)' }}>Heading</div>
          </TCard>

          <TCard onClick={() => onAddManyBlocks([{ type: 'text', variant: 'heading', value: '' }, { type: 'text', variant: 'paragraph', value: '' }])}>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 6 }}>Heading</div>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>Pretium tempus neque, eleifend elit blandit diam…</div>
          </TCard>

          <TCard onClick={() => onAddBlock({ type: 'text', variant: 'paragraph', value: '' })}>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>Pretium tempus neque, eleifend elit blandit diam…</div>
          </TCard>

          <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '20px 0 10px' }}>Daftar</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <TCard onClick={() => onAddBlock({ type: 'list', listStyle: 'dot', items: [''] })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IListDot />
                <span style={{ fontFamily: 'var(--font-base)', fontSize: 14, fontWeight: 500, color: 'var(--color-text-dark)' }}>Poin (•)</span>
              </div>
            </TCard>
            <TCard onClick={() => onAddBlock({ type: 'list', listStyle: 'number', items: [''] })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IListNum />
                <span style={{ fontFamily: 'var(--font-base)', fontSize: 14, fontWeight: 500, color: 'var(--color-text-dark)' }}>Nomor (1.)</span>
              </div>
            </TCard>
          </div>
        </>
      )}
    </div>
  )
}

const InsItem = ({ icon, label, onClick, hasChevron }) => (
  <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-base)', fontSize: 15, color: 'var(--color-text-dark)', fontWeight: 500, textAlign: 'left' }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-2)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
    <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {hasChevron && <IChevR />}
  </button>
)

const TCard = ({ children, onClick }) => (
  <button onClick={onClick} style={{ width: '100%', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 20, marginBottom: 10, textAlign: 'left', cursor: 'pointer', transition: 'border-color .15s, box-shadow .15s' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-text-dark)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(1,14,35,0.06)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}>
    {children}
  </button>
)

// ── PREVIEW MODAL ─────────────────────────────────────────────────
function PreviewModal({ title, blocks, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(1,14,35,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(920px, 96vw)', height: 'min(88vh, 900px)', background: 'var(--color-card)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 52, borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 14, fontWeight: 600, color: 'var(--color-text-dark)' }}>Pratinjau Landing — {title}</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: '1px solid var(--color-border)', background: 'var(--color-card)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><IClose /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-surface-2)', padding: '40px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-blue)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 12 }}>Profil</div>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 40, fontWeight: 800, color: 'var(--color-text-dark)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 32 }}>{title}</div>
            {blocks.map(b => <BlockPreview key={b.id} block={b} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlockPreview({ block }) {
  if (block.type === 'text') {
    if (block.variant === 'heading') return <h2 style={{ fontFamily: 'var(--font-base)', fontSize: 28, fontWeight: 700, color: 'var(--color-text-dark)', lineHeight: 1.25, margin: '28px 0 12px', letterSpacing: '-0.01em' }}>{block.value}</h2>
    return <p style={{ fontFamily: 'var(--font-base)', fontSize: 16, color: 'var(--color-text-base)', lineHeight: 1.75, margin: '0 0 16px' }}>{block.value}</p>
  }
  if (block.type === 'list') {
    const items = (block.items || []).filter(Boolean)
    if (!items.length) return null
    const Tag = block.listStyle === 'number' ? 'ol' : 'ul'
    return <Tag style={{ fontFamily: 'var(--font-base)', fontSize: 16, color: 'var(--color-text-base)', lineHeight: 1.75, margin: '0 0 16px', paddingLeft: 28 }}>{items.map((it, i) => <li key={i}>{it}</li>)}</Tag>
  }
  if (block.type === 'image') {
    if (!block.src) return null
    return <img src={block.src} alt={block.alt || ''} style={{ width: '100%', borderRadius: 12, margin: '20px 0', display: 'block' }} />
  }
  if (block.type === 'video') {
    if (!block.src) return null
    return <video src={block.src} controls style={{ width: '100%', borderRadius: 12, margin: '20px 0', display: 'block' }} />
  }
  if (block.type === 'gallery') {
    const slides = (block.slides || []).filter(s => s.src)
    if (!slides.length) return null
    return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, margin: '20px 0' }}>{slides.map(s => <img key={s.id} src={s.src} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />)}</div>
  }
  return null
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function TentangPage({ fireSnack, fireNotif, pageKey = 'tentang' }) {
  const getSeed = (key) => SEEDS[key] || SEEDS.tentang

  const [title, setTitle] = useState(() => getSeed(pageKey).title)
  const [blocks, setBlocks] = useState(() => getSeed(pageKey).blocks)
  const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify(getSeed(pageKey).blocks))
  const [selectedId, setSelectedId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [confirmType, setConfirmType] = useState(null)
  const [saving, setSaving] = useState(false)

  const isDirty = JSON.stringify(blocks) !== initialSnapshot

  useEffect(() => {
    const seed = getSeed(pageKey)
    setTitle(seed.title)
    setBlocks(seed.blocks)
    setInitialSnapshot(JSON.stringify(seed.blocks))
    setSelectedId(null)
    setPanelOpen(false)
    profilApi.get(pageKey).then(data => {
      if (data?.blocks?.length > 0) {
        setBlocks(data.blocks)
        setInitialSnapshot(JSON.stringify(data.blocks))
      }
    }).catch(() => {})
  }, [pageKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedBlock = blocks.find(b => b.id === selectedId)

  const updateBlock = (updated) => setBlocks(bs => bs.map(b => b.id === updated.id ? updated : b))
  const moveBlock = (id, dir) => setBlocks(bs => {
    const i = bs.findIndex(b => b.id === id)
    if (i < 0) return bs
    const j = i + dir
    if (j < 0 || j >= bs.length) return bs
    const next = [...bs];
    [next[i], next[j]] = [next[j], next[i]]
    return next
  })
  const duplicateBlock = (id) => setBlocks(bs => {
    const i = bs.findIndex(b => b.id === id)
    if (i < 0) return bs
    const copy = { ...bs[i], id: uid() }
    if (bs[i].type === 'gallery') copy.slides = bs[i].slides.map(s => ({ ...s, id: uid() }))
    const next = [...bs]
    next.splice(i + 1, 0, copy)
    return next
  })
  const deleteBlock = (id) => {
    setBlocks(bs => bs.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }
  const addBlock = (block) => {
    const b = { id: uid(), ...block }
    setBlocks(bs => [...bs, b])
    setSelectedId(b.id)
    setPanelOpen(false)
  }
  const addManyBlocks = (defs) => {
    const newBlocks = defs.map(d => ({ id: uid(), ...d }))
    setBlocks(bs => [...bs, ...newBlocks])
    setSelectedId(newBlocks[newBlocks.length - 1].id)
    setPanelOpen(false)
  }
  const selectBlock = (id) => { setSelectedId(id); setPanelOpen(true) }
  const closePanel = () => { setPanelOpen(false); setSelectedId(null) }

  const doSave = async () => {
    setSaving(true)
    try {
      const processed = await Promise.all(blocks.map(async (b) => {
        if (b.type === 'image' && b.src && (b.src.startsWith('blob:') || b.src.startsWith('data:'))) {
          const url = await uploadToStorage(b.src, 'profil', 'blocks/')
          return { ...b, src: url || b.src }
        }
        if (b.type === 'gallery' && b.slides) {
          const slides = await Promise.all(b.slides.map(async (s) => {
            if (s.src && (s.src.startsWith('blob:') || s.src.startsWith('data:'))) {
              const url = await uploadToStorage(s.src, 'profil', 'blocks/')
              return { ...s, src: url || s.src }
            }
            return s
          }))
          return { ...b, slides }
        }
        return b
      }))
      setBlocks(processed)
      await profilApi.save(pageKey, processed)
      setInitialSnapshot(JSON.stringify(processed))
      fireSnack?.({ type: 'primary', title: 'Berhasil diterbitkan', message: `Halaman "${title}" sekarang tampil di website.` })
      fireNotif?.({ action: 'publish', feature: title || pageKey })
    } catch (e) {
      fireSnack?.({ type: 'error', title: 'Gagal menyimpan', message: e.message || 'Terjadi kesalahan' })
    } finally {
      setSaving(false)
      setConfirmType(null)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 'clamp(24px, 2.4vw, 40px)', paddingRight: panelOpen ? 340 : 0, transition: 'padding-right .2s' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>{title}</div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>Atur konten yang tampil di website sesuai kebutuhan.</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <ButtonSecondary onClick={() => setShowPreview(true)}>
            <IconEye size={18} stroke="var(--color-text-dark)" /> Pratinjau
          </ButtonSecondary>
          <ButtonPrimary onClick={() => setConfirmType('terbit')} disabled={!isDirty}>
            <IconExport size={16} stroke="#fff" /> Simpan &amp; Terbitkan
          </ButtonPrimary>
        </div>
      </div>

      <div style={{ paddingRight: panelOpen ? 340 : 0, transition: 'padding-right .2s' }}>
        <div style={{
          background: 'var(--color-card)', borderRadius: 'var(--radius-xl)',
          boxShadow: '0 1px 3px rgba(5,27,62,.06)',
          padding: 'clamp(24px, 3vw, 48px) clamp(24px, 4vw, 72px)',
        }}>
          <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            {blocks.map((b, i) => (
              <BlockWrapper key={b.id} block={b} index={i} total={blocks.length} selected={selectedId === b.id}
                onSelect={() => selectBlock(b.id)}
                onChange={updateBlock}
                onMove={dir => moveBlock(b.id, dir)}
                onDuplicate={() => duplicateBlock(b.id)}
                onDelete={() => deleteBlock(b.id)}
              />
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--color-border)' }} />
              <button onClick={() => { setSelectedId(null); setPanelOpen(true) }} style={{ position: 'relative', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 24, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-base)', fontSize: 14, fontWeight: 500, color: 'var(--color-text-dark)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(1,14,35,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-text-dark)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)' }}>
                <IPlus /> Insert Block
              </button>
            </div>
          </div>
        </div>
      </div>

      <InsertPanel open={panelOpen} onClose={closePanel} onAddBlock={addBlock} onAddManyBlocks={addManyBlocks} selectedBlock={selectedBlock} onChangeBlock={updateBlock} />

      {panelOpen && <div onClick={closePanel} style={{ position: 'fixed', inset: 0, background: 'rgba(1,14,35,0.15)', zIndex: 35, display: 'none' }} className="cms-tentang-overlay" />}

      {showPreview && <PreviewModal title={title} blocks={blocks} onClose={() => setShowPreview(false)} />}

      <ConfirmModal
        open={confirmType === 'terbit'}
        title={`Terbitkan ${title}`}
        message="Perubahan halaman ini akan langsung tampil di website. Pastikan konten sudah sesuai."
        confirmLabel="Ya, Terbitkan"
        loading={saving}
        onConfirm={doSave}
        onClose={() => !saving && setConfirmType(null)}
      />

      <style>{`
        [contenteditable][data-placeholder]:empty:before { content: attr(data-placeholder); color: var(--color-text-muted); pointer-events: none; }
        @media (max-width: 900px) { .cms-tentang-overlay { display: block !important; } }
      `}</style>
    </div>
  )
}
