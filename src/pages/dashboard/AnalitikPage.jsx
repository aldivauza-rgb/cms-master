export default function AnalitikPage() {
  const stats = [
    { label: 'Total Pengunjung',    value: '—',  sub: 'bulan ini' },
    { label: 'Halaman Dilihat',     value: '—',  sub: 'bulan ini' },
    { label: 'Pengunjung Baru',     value: '—',  sub: 'vs bulan lalu' },
    { label: 'Rata-rata Durasi',    value: '—',  sub: 'per sesi' },
  ]

  return (
    <>
      {/* header */}
      <div>
        <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'var(--text-h)', lineHeight: 1.15, color: '#000' }}>Analisis Web</div>
        <div style={{ fontFamily: 'var(--font-base)', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--color-text-light)', marginTop: 6 }}>
          Pantau performa dan trafik website secara real-time.
        </div>
      </div>

      {/* placeholder stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 28, fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-base)', fontSize: 12, color: 'var(--color-text-light)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* main under-development card */}
      <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'clamp(40px, 6vw, 80px) 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}>
        {/* illustration */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-blue-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
          </svg>
        </div>

        {/* badge */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, background: '#FFF7ED', border: '1px solid #FED7AA', fontFamily: 'var(--font-base)', fontWeight: 600, fontSize: 12, color: '#C2410C' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', display: 'inline-block' }} />
          Sedang Dikembangkan
        </span>

        <div>
          <div style={{ fontFamily: 'var(--font-base)', fontWeight: 700, fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--color-text-dark)', marginBottom: 10 }}>
            Fitur Analisis Web Segera Hadir
          </div>
          <div style={{ fontFamily: 'var(--font-base)', fontSize: 14, color: 'var(--color-text-light)', lineHeight: 1.7, maxWidth: 520 }}>
            Halaman ini akan menampilkan statistik kunjungan website secara real-time, grafik trafik pengunjung, halaman terpopuler, data demografi, serta laporan performa konten yang telah diterbitkan.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Grafik Trafik Real-time','Halaman Terpopuler','Demografi Pengunjung','Laporan Konten'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-base)', fontSize: 13, color: 'var(--color-text-light)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              {f}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
