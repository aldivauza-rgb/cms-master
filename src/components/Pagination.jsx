import { IconChevronLeft, IconChevronRight } from './Icons'

export default function Pagination({ page, pageCount, onChange }) {
  const pages = []
  const maxButtons = 5
  let start = Math.max(1, page - 2)
  let end = Math.min(pageCount, start + maxButtons - 1)
  start = Math.max(1, end - maxButtons + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  const Btn = ({ children, disabled, active, onClick, title }) => (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      minWidth: 36, height: 36, borderRadius: 8, padding: '0 10px',
      border: `1px solid ${active ? 'var(--color-blue)' : 'var(--color-border)'}`,
      background: active ? 'var(--color-blue)' : 'var(--color-card)',
      color: active ? '#fff' : disabled ? 'var(--color-text-muted)' : 'var(--color-text-base)',
      fontFamily: 'var(--font-base)', fontWeight: 500, fontSize: 13,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}>{children}</button>
  )

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <Btn disabled={page <= 1} onClick={() => onChange(page - 1)} title="Sebelumnya">
        <IconChevronLeft size={16} stroke={page <= 1 ? 'var(--color-text-muted)' : 'var(--color-text-base)'} />
      </Btn>
      {start > 1 && (
        <>
          <Btn onClick={() => onChange(1)}>1</Btn>
          {start > 2 && <span style={{ color: 'var(--color-text-muted)' }}>…</span>}
        </>
      )}
      {pages.map(p => <Btn key={p} active={p === page} onClick={() => onChange(p)}>{p}</Btn>)}
      {end < pageCount && (
        <>
          {end < pageCount - 1 && <span style={{ color: 'var(--color-text-muted)' }}>…</span>}
          <Btn onClick={() => onChange(pageCount)}>{pageCount}</Btn>
        </>
      )}
      <Btn disabled={page >= pageCount} onClick={() => onChange(page + 1)} title="Selanjutnya">
        <IconChevronRight size={16} stroke={page >= pageCount ? 'var(--color-text-muted)' : 'var(--color-text-base)'} />
      </Btn>
    </div>
  )
}
