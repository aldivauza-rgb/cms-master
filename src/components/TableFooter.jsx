import Pagination from './Pagination'

export default function TableFooter({ page, pageCount, pageSize, onPageChange, onPageSizeChange, filtered }) {
  const from = filtered === 0 ? 0 : (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, filtered)

  return (
    <div style={{
      padding: '16px 20px', borderTop: '1px solid var(--color-border)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-base)' }}>
        <span>Show</span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          style={{
            height: 34, borderRadius: 8, border: '1px solid var(--color-border)',
            background: 'var(--color-card)', padding: '0 28px 0 10px',
            fontFamily: 'var(--font-base)', fontSize: 13, cursor: 'pointer',
            appearance: 'none', WebkitAppearance: 'none',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23354764' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
          }}
        >
          {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span>entries · {from}–{to} dari {filtered}</span>
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={onPageChange} />
    </div>
  )
}
