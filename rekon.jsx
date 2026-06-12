// rekon.jsx — Rekonsiliasi Transaksi screen
const { useState: useRkState, useEffect: useRkEffect } = React;

const REKON_ROWS = [
  { id: 'TRX-9912841', waktu: '14:42:18', produk: 'Pulsa Telkomsel 50.000',     supplier: 'Supplier B', nMuurah: 50_500,  nSupplier: 50_500,  status: 'cocok' },
  { id: 'TRX-9912835', waktu: '14:36:18', produk: 'Mobile Legends 86 Diamond',  supplier: 'Supplier D', nMuurah: 22_000,  nSupplier: 22_500,  status: 'selisih' },
  { id: 'TRX-9912828', waktu: '14:25:04', produk: 'Token PLN 100.000',          supplier: 'Supplier A', nMuurah: 101_500, nSupplier: null,    status: 'tidak_ada' },
  { id: 'TRX-9912820', waktu: '14:18:51', produk: 'XL Hot Rod 12 GB',           supplier: 'Supplier A', nMuurah: 65_000,  nSupplier: 65_000,  status: 'cocok' },
  { id: 'TRX-9912812', waktu: '14:11:32', produk: 'GoPay 100.000',              supplier: 'Supplier B', nMuurah: 101_000, nSupplier: 100_750, status: 'selisih' },
];

const REKON_TABS = ['Semua Supplier', 'Supplier A', 'Supplier B', 'Supplier C'];

function Rekonsiliasi() {
  const { Card } = window.MuurahShell;
  const [tab, setTab] = useRkState('Semua Supplier');
  const [tgl, setTgl] = useRkState('2026-05-19');
  const { DatePickerButton } = window.MuurahGlobal;

  const filtered = tab === 'Semua Supplier' ? REKON_ROWS : REKON_ROWS.filter(r => r.supplier === tab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Rekonsiliasi Transaksi
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            Cocokkan transaksi muurah dengan laporan dari biller/supplier
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <DatePickerButton value={tgl} onChange={(v) => { setTgl(v); window.muurahToast('Menampilkan rekonsiliasi tanggal ' + window.MuurahGlobal.formatTglID(v), 'info'); }} />
          <button onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.xlsx,.xls';
            input.onchange = (ev) => {
              const file = ev.target.files && ev.target.files[0];
              if (file) window.muurahToast('Mengunggah "' + file.name + '"…', 'info');
              setTimeout(() => window.muurahToast('Laporan supplier ter-upload — 248 baris diproses', 'success'), 1200);
            };
            input.click();
          }} style={rkSecondaryBtn()}>
            <Icons.download size={14} style={{ transform: 'rotate(180deg)' }} /> Upload Laporan Supplier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E0D9F5' }}>
        {REKON_TABS.map((t) => {
          const isActive = tab === t;
          const count = t === 'Semua Supplier' ? REKON_ROWS.length : REKON_ROWS.filter(r => r.supplier === t).length;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'transparent', border: 0,
              padding: '10px 16px 12px',
              fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
              color: isActive ? '#4A2D8C' : '#574872',
              borderBottom: isActive ? '2px solid #4A2D8C' : '2px solid transparent',
              marginBottom: -1, fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'all 130ms ease',
            }}>
              {t}
              <span style={{
                background: isActive ? '#EDE8FF' : '#F0EBFF',
                color: isActive ? '#4A2D8C' : '#9085AE',
                fontSize: 10, fontWeight: 700, padding: '2px 7px',
                borderRadius: 10, fontFamily: 'JetBrains Mono, monospace',
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <ReconStatusCard
          tone="green"
          icon={<CheckBadge />}
          count="1.234"
          amount="Rp 48.100.000"
          label="Sudah diverifikasi"
          sublabel="Transaksi cocok antara muurah & supplier"
        />
        <ReconStatusCard
          tone="amber"
          icon={<WarnBadge />}
          count="12"
          amount="Rp 450.000 selisih"
          label="Perlu review manual"
          sublabel="Nominal supplier ≠ nominal muurah"
        />
        <ReconStatusCard
          tone="red"
          icon={<XBadge />}
          count="3"
          amount="Perlu investigasi"
          label="Tidak ada di laporan supplier"
          sublabel="Transaksi muurah tidak terbukukan supplier"
        />
      </div>

      {/* Recon table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '16px 24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #E0D9F5',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
              Detail Rekonsiliasi
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2 }}>
              Menampilkan {filtered.length} transaksi · {tab}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => window.muurahToast('Mencocokkan ulang transaksi…', 'info')} style={rkGhostBtn('#4A2D8C')}><Icons.refresh size={13} /> Cocokkan Ulang</button>
            <button onClick={() => window.muurahToast('Mengekspor selisih ke CSV…', 'success')} style={rkGhostBtn('#574872')}><Icons.download size={13} /> Ekspor Selisih</button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...rkThStyle, paddingLeft: 24 }}>ID Txn muurah</th>
              <th style={rkThStyle}>Waktu</th>
              <th style={rkThStyle}>Produk</th>
              <th style={rkThStyle}>Supplier</th>
              <th style={{ ...rkThStyle, textAlign: 'right' }}>Nominal muurah</th>
              <th style={{ ...rkThStyle, textAlign: 'right' }}>Nominal Supplier</th>
              <th style={{ ...rkThStyle, textAlign: 'right' }}>Selisih</th>
              <th style={{ ...rkThStyle, paddingRight: 24 }}>Status Rekon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const rowBg = r.status === 'selisih'   ? '#FFFBEB'
                          : r.status === 'tidak_ada' ? '#FBF5F6'
                          : '#FFFFFF';
              const hoverBg = r.status === 'selisih'    ? '#FBF1D9'
                            : r.status === 'tidak_ada'  ? '#F7EDEF'
                            : '#FAF8FF';
              const selisih = r.nSupplier === null ? null : r.nSupplier - r.nMuurah;
              return (
                <tr key={r.id} style={{
                  borderTop: '1px solid #F0EBFF', height: 56,
                  background: rowBg, transition: 'background 130ms ease', cursor: 'pointer',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = rowBg}
                >
                  <td style={{ ...rkTdStyle, paddingLeft: 24 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#4A2D8C', fontWeight: 600 }}>{r.id}</span>
                  </td>
                  <td style={{ ...rkTdStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' }}>{r.waktu}</td>
                  <td style={{ ...rkTdStyle, color: '#1A1228', fontWeight: 500 }}>{r.produk}</td>
                  <td style={rkTdStyle}>
                    <span style={{
                      fontSize: 11, color: '#574872', background: '#F0EBFF',
                      padding: '3px 9px', borderRadius: 8, fontWeight: 500,
                    }}>{r.supplier}</span>
                  </td>
                  <td style={{ ...rkTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                    Rp {r.nMuurah.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...rkTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: r.nSupplier === null ? '#9085AE' : '#1A1228', fontWeight: 600 }}>
                    {r.nSupplier === null ? '—' : `Rp ${r.nSupplier.toLocaleString('id-ID')}`}
                  </td>
                  <td style={{ ...rkTdStyle, textAlign: 'right' }}>
                    <SelisihValue selisih={selisih} />
                  </td>
                  <td style={{ ...rkTdStyle, paddingRight: 24 }}>
                    <ReconStatusPill status={r.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872', display: 'inline-flex', alignItems: 'center', gap: 16 }}>
            <span>Last sync: <b style={{ color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>19 Mei 2026 · 15:30 WIB</b></span>
            <span style={{ width: 1, height: 14, background: '#E0D9F5' }} />
            <span>Sumber: laporan_supplier_19052026.xlsx</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button disabled style={rkPageBtn(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
            <button style={{ ...rkPageBtn(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
            <button style={rkPageBtn(false)}>2</button>
            <button style={rkPageBtn(false)}>3</button>
            <span style={{ color: '#9085AE', padding: '0 6px', fontSize: 12 }}>…</span>
            <button style={rkPageBtn(false)}>250</button>
            <button style={rkPageBtn(false)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Status summary cards ────────────────────────────────────────────────────
function ReconStatusCard({ tone, icon, count, amount, label, sublabel }) {
  const tones = {
    green: { bg: '#F0FDF4', bd: '#86EFAC', fg: '#16A34A', accent: '#15803D' },
    amber: { bg: '#FFFBEB', bd: '#FCD34D', fg: '#D97706', accent: '#B45309' },
    red:   { bg: '#FCE7E9', bd: '#FCA5A5', fg: '#C0001A', accent: '#9E0017' },
  };
  const t = tones[tone];
  return (
    <div style={{
      background: t.bg, border: `1px solid ${t.bd}`,
      borderRadius: 16, padding: 20,
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: '#FFFFFF', color: t.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
            fontSize: 28, color: t.accent, lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>{count}</div>
          <div style={{ fontSize: 12, color: t.fg, fontWeight: 600, marginTop: 2 }}>transaksi</div>
        </div>
      </div>
      <div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: t.accent,
          fontFamily: 'JetBrains Mono, monospace',
        }}>{amount}</div>
        <div style={{ fontSize: 13, color: '#1A1228', fontWeight: 600, marginTop: 6, letterSpacing: '-0.005em' }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: '#574872', marginTop: 2, lineHeight: 1.5 }}>
          {sublabel}
        </div>
      </div>
    </div>
  );
}

// Icon badges
function CheckBadge() { return <Icons.check size={22} strokeWidth={2.8} />; }
function WarnBadge()  { return <Icons.alert size={22} strokeWidth={2.2} />; }
function XBadge()     { return <Icons.x size={22} strokeWidth={2.8} />; }

// ─── Selisih cell ────────────────────────────────────────────────────────────
function SelisihValue({ selisih }) {
  if (selisih === null) {
    return <span style={{ color: '#C0001A', fontWeight: 700, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>—</span>;
  }
  if (selisih === 0) {
    return <span style={{ color: '#16A34A', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>Rp 0</span>;
  }
  const sign = selisih > 0 ? '+' : '−';
  const abs = Math.abs(selisih);
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
      color: '#D97706', fontSize: 12,
    }}>{sign} Rp {abs.toLocaleString('id-ID')}</span>
  );
}

// ─── Status pill ─────────────────────────────────────────────────────────────
function ReconStatusPill({ status }) {
  const map = {
    cocok:     { bg: '#F0FDF4', fg: '#16A34A', label: 'Cocok', icon: '✓' },
    selisih:   { bg: '#FFFBEB', fg: '#D97706', label: 'Selisih', icon: '⚠' },
    tidak_ada: { bg: '#FCE7E9', fg: '#C0001A', label: 'Tidak Ada', icon: '✕' },
  };
  const s = map[status] || map.cocok;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg, fontSize: 11, fontWeight: 700,
      borderRadius: 20, padding: '4px 10px', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 10, lineHeight: 1, fontWeight: 800 }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function rkSecondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
    transition: 'all 130ms ease',
  };
}
function rkDateBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#F0EBFF', border: '1px solid transparent',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, color: '#1A1228',
    fontFamily: 'inherit', cursor: 'pointer',
  };
}
function rkGhostBtn(color) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: 'transparent', color: color, border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
    transition: 'background 130ms ease',
  };
}
function rkPageBtn(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}

const rkThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const rkTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

window.MuurahRekon = Rekonsiliasi;

