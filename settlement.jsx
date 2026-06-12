// settlement.jsx — Settlement Supplier screen
const { useState: useStState } = React;

const SETTLEMENT_ROWS_SEED = [
  { supplier: 'Supplier A', periode: '1 – 15 Mei 2026',  txn: 8423, tagihan: 78_520_000, status: 'lunas',       jatuhTempo: '16 Mei 2026', daysLeft: -3 },
  { supplier: 'Supplier B', periode: '1 – 15 Mei 2026',  txn: 5218, tagihan: 42_850_000, status: 'lunas',       jatuhTempo: '17 Mei 2026', daysLeft: -2 },
  { supplier: 'Supplier C', periode: '1 – 15 Mei 2026',  txn: 3182, tagihan: 26_830_000, status: 'menunggu',    jatuhTempo: '22 Mei 2026', daysLeft: 3  },
  { supplier: 'Supplier D', periode: '1 – 15 Mei 2026',  txn: 2114, tagihan: 18_450_000, status: 'menunggu',    jatuhTempo: '25 Mei 2026', daysLeft: 6  },
  { supplier: 'Supplier E', periode: '16 – 30 Apr 2026', txn: 638,  tagihan: 5_730_000,  status: 'jatuh_tempo', jatuhTempo: '17 Mei 2026', daysLeft: -2 },
];

function Settlement() {
  const { Card } = window.MuurahShell;
  const [rows, setRows] = useStState(SETTLEMENT_ROWS_SEED);
  const [periodeF, setPeriodeF] = useStState('semua');
  const [detail, setDetail] = useStState(null);

  const periodeOptions = [...new Set(SETTLEMENT_ROWS_SEED.map(r => r.periode))];
  const filtered = periodeF === 'semua' ? rows : rows.filter(r => r.periode === periodeF);

  function bayarSekarang(r) {
    window.muurahConfirm({
      title: 'Bayar tagihan ' + r.supplier + '?',
      body: 'Rp ' + r.tagihan.toLocaleString('id-ID') + ' untuk periode ' + r.periode + ' akan ditandai lunas.',
      confirmLabel: 'Bayar Sekarang',
      onConfirm: () => {
        setRows(rs => rs.map(x => x.supplier === r.supplier && x.periode === r.periode ? { ...x, status: 'lunas', daysLeft: -1 } : x));
        window.muurahToast('Tagihan ' + r.supplier + ' (' + r.periode + ') ditandai lunas', 'success');
      },
    });
  }
  function sinkronkan() {
    window.muurahToast('Menyinkronkan data settlement dari rekonsiliasi…', 'info');
    setTimeout(() => window.muurahToast('Settlement berhasil disinkronkan — data terbaru', 'success'), 900);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Settlement Supplier
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>Periode Mei 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <select value={periodeF} onChange={(e) => setPeriodeF(e.target.value)} style={{
              ...stSecondaryBtn(), appearance: 'none', paddingRight: 30, cursor: 'pointer',
            }}>
              <option value="semua">Semua Periode</option>
              {periodeOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <Icons.chevron size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
          </div>
          <button onClick={() => window.muurahToast('Mengekspor tagihan_settlement_' + (periodeF === 'semua' ? 'semua_periode' : periodeF.replace(/\s/g,'_')) + '.csv', 'success')} style={stPrimaryBtn()}>
            <Icons.download size={14} /> Export Tagihan
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StSummary label="Total Tagihan"   value="Rp 172.380.000" icon="card"   tone="purple" sub="5 supplier · Mei 2026" />
        <StSummary label="Sudah Dibayar"   value="Rp 148.200.000" icon="check"  tone="green"  sub="2 dari 5 supplier · 86% terselesaikan" />
        <StSummary label="Belum Dibayar"   value="Rp 24.180.000"  icon="wallet" tone="gold"   sub="3 supplier menunggu pembayaran" />
        <StSummary label="Jatuh Tempo"     value="3 hari"          icon="clock"  tone="red"    sub="Supplier C jatuh tempo 22 Mei 2026" pulse />
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '16px 24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #E0D9F5',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
              Daftar Tagihan
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2 }}>
              Otomatis dibuat dari rekonsiliasi · update tiap 2 minggu
            </div>
          </div>
          <button onClick={sinkronkan} style={{ ...stGhostBtn(), color: '#4A2D8C' }}>
            <Icons.refresh size={13} /> Sinkronkan
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...stThStyle, paddingLeft: 24 }}>Supplier</th>
              <th style={stThStyle}>Periode</th>
              <th style={{ ...stThStyle, textAlign: 'right' }}>Total Transaksi</th>
              <th style={{ ...stThStyle, textAlign: 'right' }}>Jumlah Tagihan</th>
              <th style={stThStyle}>Status</th>
              <th style={stThStyle}>Jatuh Tempo</th>
              <th style={{ ...stThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const rowBg = r.status === 'jatuh_tempo' ? '#FBF5F6' : '#FFFFFF';
              const hoverBg = r.status === 'jatuh_tempo' ? '#F7EDEF' : '#FAF8FF';
              return (
                <tr key={r.supplier} style={{
                  borderTop: '1px solid #F0EBFF', height: 60,
                  background: rowBg, transition: 'background 130ms ease',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = rowBg}
                >
                  <td style={{ ...stTdStyle, paddingLeft: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: '#F0EBFF', color: '#4A2D8C',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 12,
                      }}>{r.supplier.split(' ')[1] || r.supplier[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1A1228' }}>{r.supplier}</div>
                        <div style={{ fontSize: 10, color: '#9085AE', marginTop: 2 }}>Biller multi-kategori</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...stTdStyle, color: '#574872' }}>{r.periode}</td>
                  <td style={{ ...stTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#574872' }}>
                    {r.txn.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...stTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>
                    Rp {r.tagihan.toLocaleString('id-ID')}
                  </td>
                  <td style={stTdStyle}><SettlementStatus status={r.status} /></td>
                  <td style={stTdStyle}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#1A1228', fontWeight: 600 }}>{r.jatuhTempo}</div>
                    <DueLabel daysLeft={r.daysLeft} status={r.status} />
                  </td>
                  <td style={{ ...stTdStyle, paddingRight: 24, textAlign: 'right' }}>
                    {r.status === 'lunas' ? (
                      <button onClick={() => setDetail(r)} style={stGhostBtn()}>Detail</button>
                    ) : (
                      <button onClick={() => bayarSekarang(r)} style={r.status === 'jatuh_tempo' ? stDangerBtn() : stPrimaryBtnSmall()}>
                        Bayar Sekarang
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {detail && <SettlementDetailModal row={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function SettlementDetailModal({ row, onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 480, background: '#FFFFFF', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(26,18,40,0.25)',
        display: 'flex', flexDirection: 'column',
        animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Settlement</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>{row.supplier}</div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DetailRow label="Periode" value={row.periode} />
          <DetailRow label="Total Transaksi" value={row.txn.toLocaleString('id-ID')} />
          <DetailRow label="Jumlah Tagihan" value={'Rp ' + row.tagihan.toLocaleString('id-ID')} />
          <DetailRow label="Status" value={row.status === 'lunas' ? 'Lunas' : row.status === 'jatuh_tempo' ? 'Jatuh Tempo' : 'Menunggu'} />
          <DetailRow label="Jatuh Tempo" value={row.jatuhTempo} />
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E0D9F5', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={stPrimaryBtnSmall()}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: '#9085AE' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
    </div>
  );
}

function StSummary({ label, value, icon, tone, sub, pulse }) {
  const tones = {
    purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
    green:  { bg: '#F0FDF4', fg: '#16A34A' },
    gold:   { bg: '#FEF9EC', fg: '#D4900A' },
    red:    { bg: '#FCE7E9', fg: '#C0001A' },
  };
  const t = tones[tone] || tones.purple;
  const IconC = Icons[icon] || Icons.chart;
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E0D9F5',
      borderRadius: 16, padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: t.bg, color: t.fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <IconC size={18} />
        {pulse && (
          <span style={{
            position: 'absolute', inset: -4, borderRadius: 14,
            border: `1px solid ${t.fg}`, opacity: 0.4,
            animation: 'muurah-pulse 1.6s ease-in-out infinite',
          }} />
        )}
      </div>
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
          fontSize: 22, color: '#1A1228', letterSpacing: '-0.02em',
          lineHeight: 1.15, whiteSpace: 'nowrap',
        }}>{value}</div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: '#9085AE',
          letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 8,
        }}>{label}</div>
        <div style={{ fontSize: 11, color: '#574872', marginTop: 4, lineHeight: 1.5 }}>{sub}</div>
      </div>
    </div>
  );
}

function SettlementStatus({ status }) {
  const map = {
    lunas:       { bg: '#F0FDF4', fg: '#16A34A', label: 'Lunas',       icon: '✓' },
    menunggu:    { bg: '#FFFBEB', fg: '#D97706', label: 'Menunggu',    icon: '○' },
    jatuh_tempo: { bg: '#FCE7E9', fg: '#C0001A', label: 'Jatuh Tempo', icon: '⚠' },
  };
  const s = map[status] || map.menunggu;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg, fontSize: 11, fontWeight: 700,
      borderRadius: 20, padding: '4px 10px', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 10, fontWeight: 800 }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

function DueLabel({ daysLeft, status }) {
  if (status === 'lunas') {
    return <div style={{ fontSize: 10, color: '#16A34A', marginTop: 2, fontWeight: 600 }}>Sudah dibayar tepat waktu</div>;
  }
  if (daysLeft < 0) {
    return <div style={{ fontSize: 10, color: '#C0001A', marginTop: 2, fontWeight: 700 }}>Telat {Math.abs(daysLeft)} hari</div>;
  }
  const color = daysLeft <= 3 ? '#D97706' : '#574872';
  return <div style={{ fontSize: 10, color, marginTop: 2, fontWeight: 600 }}>{daysLeft} hari lagi</div>;
}

function stSecondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function stPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function stPrimaryBtnSmall() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 32, padding: '0 14px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function stDangerBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: '#C0001A', color: '#FFFFFF', border: 0,
    height: 32, padding: '0 14px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function stGhostBtn() {
  return {
    background: 'transparent', color: '#574872', border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 5,
  };
}
const stThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const stTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

window.MuurahSettlement = Settlement;
