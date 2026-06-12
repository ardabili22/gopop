// transaksi.jsx — Monitoring Transaksi screen
const { useState: useTxState, useMemo: useTxMemo, useEffect: useTxEffect } = React;

const TX_ROWS = [
  { id: 'TXN-9912841', waktu: '14:42:18', user: 'Andika Pratama', userPhone: '0812-3456-7890', produk: 'Pulsa Telkomsel 50.000', tujuan: '0812-3456-7890', nominal: 50_000,  bayar: 50_500,  supplier: 'Supplier B', status: 'sukses' },
  { id: 'TXN-9912840', waktu: '14:41:33', user: 'Sri Wahyuni',    userPhone: '0813-2233-4455', produk: 'Token PLN 100.000',     tujuan: '11223344556',      nominal: 100_000, bayar: 101_500, supplier: 'Supplier A', status: 'sukses' },
  { id: 'TXN-9912839', waktu: '14:40:51', user: 'Budi Santoso',   userPhone: '085678xxxx',     produk: 'BPJS Kesehatan Kelas 2', tujuan: '0001234567890',    nominal: 100_000, bayar: 100_500, supplier: 'Supplier C', status: 'processing' },
  { id: 'TXN-9912838', waktu: '14:39:22', user: 'Rina Kartika',   userPhone: '0856-1234-5678', produk: 'GoPay 100.000',         tujuan: '0856-1234-5678',   nominal: 100_000, bayar: 101_000, supplier: 'Supplier B', status: 'sukses' },
  { id: 'TXN-9912837', waktu: '14:38:09', user: 'Dewi Sartika',   userPhone: '0817-9876-5432', produk: 'XL Hot Rod 12 GB',      tujuan: '0817-9876-5432',   nominal: 65_000,  bayar: 65_000,  supplier: 'Supplier A', status: 'sukses' },
  { id: 'TXN-9912836', waktu: '14:37:42', user: 'Agus Salim',     userPhone: '0856-7890-1234', produk: 'Pulsa Indosat 25.000',  tujuan: '0856-7890-1234',   nominal: 25_000,  bayar: 25_250,  supplier: 'Supplier B', status: 'sukses' },
  { id: 'TXN-9912835', waktu: '14:36:18', user: 'Maya Sari',      userPhone: '0812-5544-3322', produk: 'Mobile Legends 86 Diamond', tujuan: '1234567890',    nominal: 22_000,  bayar: 22_000,  supplier: 'Supplier D', status: 'sukses' },
  { id: 'TXN-9912832', waktu: '14:31:12', user: 'Budi Santoso',   userPhone: '085678xxxx',     produk: 'Paket Data XL 10 GB',   tujuan: '085678xxxx',       nominal: 95_000,  bayar: 96_000,  supplier: 'Supplier A', status: 'gagal' },
];

function Transaksi() {
  const { Card } = window.MuurahShell;
  const [selected, setSelected] = useTxState(null);

  // Summary
  const total = 1247;
  const sukses = 1215;
  const gagal = 32;
  const pending = 0;
  const suksesPct = ((sukses / total) * 100).toFixed(1);
  const gagalPct = ((gagal / total) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Monitoring Transaksi
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>1.247</span> transaksi hari ini
          </div>
        </div>
        <button onClick={() => window.muurahToast('Mengekspor data transaksi…', 'info')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
          height: 38, padding: '0 16px', borderRadius: 10,
          fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          transition: 'all 130ms ease',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#F0EBFF'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
        >
          <Icons.download size={15} /> Export Excel
        </button>
      </div>

      {/* Filter bar */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: 12,
        display: 'flex', gap: 10, alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 320 }}>
          <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
          <input placeholder="Cari ID transaksi, user, nomor tujuan…"
            style={txInputStyle({ paddingLeft: 36, width: '100%' })} />
        </div>
        <TxSelect prefix={<Icons.calendar size={14} style={{ color: '#574872' }} />} defaultLabel="Hari Ini" options={['Hari Ini','Kemarin','7 Hari Terakhir','30 Hari Terakhir','Bulan Ini','Kustom…']} />
        <TxSelect defaultLabel="Semua Status" options={['Semua Status','Sukses','Processing','Pending','Gagal']} />
        <TxSelect defaultLabel="Semua Produk" options={['Semua Produk','Pulsa','PLN','Paket Data','BPJS','Voucher Game','E-Wallet','PDAM']} />
        <div style={{ flex: 1 }} />
        <button onClick={() => window.muurahToast('Filter diterapkan ke ' + TX_ROWS.length + ' transaksi', 'success')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#4A2D8C', color: '#FFFFFF', border: 0,
          height: 38, padding: '0 18px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          transition: 'background 130ms ease',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#3A2370'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#4A2D8C'}
        >
          Terapkan
        </button>
      </div>

      {/* Summary strip */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <SummaryItem label="Total" value={total.toLocaleString('id-ID')} />
        <SummaryDivider />
        <SummaryItem label="Sukses" value={sukses.toLocaleString('id-ID')} extra={`(${suksesPct}%)`} tone="#16A34A" />
        <SummaryDivider />
        <SummaryItem label="Gagal" value={gagal.toLocaleString('id-ID')} extra={`(${gagalPct}%)`} tone="#C0001A" />
        <SummaryDivider />
        <SummaryItem label="Pending" value={pending.toString()} extra="(0,0%)" tone="#9085AE" />
        <div style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: '#9085AE',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A',
            animation: 'muurah-pulse 1.6s ease-in-out infinite' }} />
          Live · diperbarui {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...txThStyle, paddingLeft: 20 }}>ID Transaksi</th>
              <th style={txThStyle}>Waktu</th>
              <th style={txThStyle}>User</th>
              <th style={txThStyle}>Produk</th>
              <th style={txThStyle}>Tujuan</th>
              <th style={{ ...txThStyle, textAlign: 'right' }}>Nominal</th>
              <th style={{ ...txThStyle, textAlign: 'right' }}>Harga Bayar</th>
              <th style={txThStyle}>Supplier</th>
              <th style={txThStyle}>Status</th>
              <th style={{ ...txThStyle, textAlign: 'right', paddingRight: 20 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {TX_ROWS.map((r) => {
              const rowBg = r.status === 'gagal'      ? '#FBF5F6'
                          : r.status === 'processing' ? '#EDE8FF'
                          : '#FFFFFF';
              const hoverBg = r.status === 'gagal'    ? '#F7EDEF'
                            : r.status === 'processing' ? '#E5DEF8'
                            : '#FAF8FF';
              return (
                <tr key={r.id} onClick={() => setSelected(r)}
                  style={{
                    borderTop: '1px solid #F0EBFF', height: 56,
                    background: rowBg, cursor: 'pointer',
                    transition: 'background 130ms ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = rowBg}
                >
                  <td style={{ ...txTdStyle, paddingLeft: 20 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                      color: '#4A2D8C', fontWeight: 600,
                      borderBottom: '1px dotted transparent',
                    }}>{r.id}</span>
                  </td>
                  <td style={{ ...txTdStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' }}>{r.waktu}</td>
                  <td style={{ ...txTdStyle, color: '#1A1228', fontWeight: 500 }}>{r.user}</td>
                  <td style={{ ...txTdStyle, color: '#574872' }}>{r.produk}</td>
                  <td style={{ ...txTdStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' }}>{r.tujuan}</td>
                  <td style={{ ...txTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#574872' }}>
                    Rp {r.nominal.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...txTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                    Rp {r.bayar.toLocaleString('id-ID')}
                  </td>
                  <td style={txTdStyle}>
                    <span style={{
                      fontSize: 11, color: '#574872', background: '#F0EBFF',
                      padding: '3px 9px', borderRadius: 8, fontWeight: 500,
                    }}>{r.supplier}</span>
                  </td>
                  <td style={txTdStyle}>
                    <TxStatusPill status={r.status} />
                  </td>
                  <td style={{ ...txTdStyle, textAlign: 'right', paddingRight: 20 }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => setSelected(r)} style={txGhostBtn('#4A2D8C')}>Detail</button>
                      {r.status === 'gagal' && (
                        <button onClick={() => window.muurahConfirm({
                          title: 'Proses refund transaksi ' + r.id + '?',
                          body: 'Saldo Rp ' + r.bayar.toLocaleString('id-ID') + ' akan dikembalikan ke ' + r.user + '. Tindakan ini tidak bisa dibatalkan.',
                          confirmLabel: 'Proses Refund',
                          danger: true,
                          onConfirm: () => window.muurahToast('Refund ' + r.id + ' berhasil diproses', 'success'),
                        })} style={txGhostBtn('#C0001A')}>Refund</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872' }}>
            Menampilkan <b style={{ color: '#1A1228' }}>1–8</b> dari <b style={{ color: '#1A1228' }}>1.247</b> transaksi
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button disabled style={txPageBtn(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
            <button style={{ ...txPageBtn(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
            <button style={txPageBtn(false)}>2</button>
            <button style={txPageBtn(false)}>3</button>
            <span style={{ color: '#9085AE', padding: '0 6px', fontSize: 12 }}>…</span>
            <button style={txPageBtn(false)}>156</button>
            <button style={txPageBtn(false)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
      </Card>

      {/* Drawer */}
      {selected && <DetailDrawer trx={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Summary item ────────────────────────────────────────────────────────────
function SummaryItem({ label, value, extra, tone }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#9085AE' }}>{label}:</span>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 700,
        color: tone || '#1A1228', letterSpacing: '-0.01em',
      }}>{value}</span>
      {extra && (
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
          color: tone || '#9085AE', fontWeight: 500,
        }}>{extra}</span>
      )}
    </div>
  );
}
function SummaryDivider() {
  return <span style={{ width: 1, height: 18, background: '#E0D9F5' }} />;
}

// ─── Status pill ─────────────────────────────────────────────────────────────
function TxStatusPill({ status, large }) {
  const map = {
    sukses:     { bg: '#F0FDF4', fg: '#16A34A', label: 'Sukses', icon: '✓' },
    gagal:      { bg: '#FCE7E9', fg: '#C0001A', label: 'Gagal',  icon: '✕' },
    pending:    { bg: '#FFFBEB', fg: '#D97706', label: 'Pending', icon: '○' },
    processing: { bg: '#EDE8FF', fg: '#4A2D8C', label: 'Processing', spin: true },
  };
  const s = map[status] || map.pending;
  const pad = large ? '6px 14px' : '4px 10px';
  const fontSize = large ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg, fontSize, fontWeight: 700,
      borderRadius: 20, padding: pad, whiteSpace: 'nowrap',
      letterSpacing: large ? '0.04em' : 0,
      textTransform: large ? 'uppercase' : 'none',
    }}>
      {s.spin ? (
        <span className="muurah-spin" style={{
          width: 10, height: 10, borderRadius: '50%',
          border: '1.5px solid currentColor', borderTopColor: 'transparent',
        }} />
      ) : (
        <span style={{ fontSize: large ? 13 : 11, fontWeight: 800, lineHeight: 1 }}>{s.icon}</span>
      )}
      {s.label}
    </span>
  );
}

// ─── Drawer ──────────────────────────────────────────────────────────────────
function DetailDrawer({ trx, onClose }) {
  useTxEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const isGagal = trx.status === 'gagal';
  const isProc = trx.status === 'processing';

  // Build timeline based on status. For TXN-9912832 use the spec's exact times.
  const baseT = trx.id === 'TXN-9912832' ? '14:31' : trx.waktu.slice(0, 5);
  const timeline = isGagal ? [
    { time: '14:31:12', label: 'Request diterima', state: 'done' },
    { time: '14:31:13', label: 'Dikirim ke ' + trx.supplier, state: 'done' },
    { time: '14:31:43', label: 'Timeout: tidak ada respons dari biller', state: 'error' },
    { time: '14:31:44', label: 'Status Gagal — saldo dikembalikan', state: 'error' },
  ] : isProc ? [
    { time: baseT + ':05', label: 'Request diterima', state: 'done' },
    { time: baseT + ':06', label: 'Dikirim ke ' + trx.supplier, state: 'done' },
    { time: baseT + ':07', label: 'Menunggu callback biller…', state: 'pending' },
    { time: '—',           label: 'Status final', state: 'idle' },
  ] : [
    { time: baseT + ':05', label: 'Request diterima', state: 'done' },
    { time: baseT + ':06', label: 'Dikirim ke ' + trx.supplier, state: 'done' },
    { time: baseT + ':08', label: 'Konfirmasi biller diterima', state: 'done' },
    { time: baseT + ':09', label: 'Transaksi sukses — produk terkirim', state: 'done' },
  ];

  const biaya = trx.bayar - trx.nominal;

  const logResponse = isGagal
    ? `{"status":"timeout","code":408,"msg":"Request timeout after 30s","ref":"${trx.id}","retry_count":2}`
    : isProc
    ? `{"status":"pending","code":102,"msg":"Awaiting biller callback","ref":"${trx.id}"}`
    : `{"status":"success","code":200,"msg":"Transaction completed","ref":"${trx.id}","serial":"83729018"}`;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)',
        animation: 'muurah-fade 200ms ease',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 480, background: '#FFFFFF',
        borderLeft: '1px solid #E0D9F5',
        boxShadow: '-12px 0 32px rgba(26,18,40,0.12)',
        overflowY: 'auto',
        animation: 'muurah-slide 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 1,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
            Detail Transaksi
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Status + ID */}
          <div>
            <TxStatusPill status={trx.status} large />
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 800,
              color: '#1A1228', marginTop: 12, letterSpacing: '-0.02em',
            }}>{trx.id}</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
              {trx.waktu} WIB · {trx.supplier}
            </div>
          </div>

          {/* Informasi Produk */}
          <Section label="Informasi Produk">
            <KV k="Produk" v={trx.produk} />
            <KV k="Tujuan" v={trx.tujuan} mono />
            <KV k="Nominal" v={`Rp ${trx.nominal.toLocaleString('id-ID')}`} mono />
            <KV k="Harga Bayar" v={`Rp ${trx.bayar.toLocaleString('id-ID')}`} mono strong />
            <KV k="Biaya Admin" v={`Rp ${biaya.toLocaleString('id-ID')}`} mono />
            <KV k="Supplier" v={trx.supplier} />
          </Section>

          {/* Informasi User */}
          <Section label="Informasi User">
            <KV k="Nama" v={trx.user} />
            <KV k="No. HP" v={trx.userPhone} mono />
            <KV k="Metode Bayar" v="Saldo muurah" />
            <KV
              k="Saldo Before/After"
              v={isGagal ? 'Rp 200.000 (tidak terpotong)' : `Rp 200.000 → Rp ${(200_000 - trx.bayar).toLocaleString('id-ID')}`}
              mono
            />
          </Section>

          {/* Timeline */}
          <Section label="Timeline Proses">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {timeline.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <TimelineDot state={step.state} />
                    {i < timeline.length - 1 && (
                      <div style={{
                        position: 'absolute', left: '50%', top: 22, height: 28,
                        width: 1.5, background: '#E0D9F5', transform: 'translateX(-50%)',
                      }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: step.state === 'error' ? '#C0001A'
                           : step.state === 'idle'  ? '#9085AE' : '#1A1228',
                    }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                      {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Log Response */}
          <Section label="Log Respons Biller">
            <div style={{
              background: '#1A1228', borderRadius: 10, padding: '12px 14px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5,
              color: '#E5DEF8', lineHeight: 1.6,
              wordBreak: 'break-all', overflowX: 'auto',
              position: 'relative',
            }}>
              <span style={{ color: isGagal ? '#FCA5A5' : isProc ? '#FCD34D' : '#86EFAC' }}>{'{'}</span>
              {prettyJson(logResponse).map((line, i) => (
                <div key={i} style={{ paddingLeft: 12 }}>
                  <span style={{ color: '#C5B8EF' }}>"{line.k}"</span>
                  <span style={{ color: '#9085AE' }}>: </span>
                  <span style={{ color: line.color }}>{line.v}</span>
                  {!line.last && <span style={{ color: '#9085AE' }}>,</span>}
                </div>
              ))}
              <span style={{ color: isGagal ? '#FCA5A5' : isProc ? '#FCD34D' : '#86EFAC' }}>{'}'}</span>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto', padding: '16px 24px',
          borderTop: '1px solid #E0D9F5', background: '#FFFFFF',
          position: 'sticky', bottom: 0,
          display: 'flex', gap: 10,
        }}>
          {isGagal && (
            <button onClick={() => window.muurahConfirm({
              title: 'Proses refund transaksi ' + trx.id + '?',
              body: 'Saldo Rp ' + trx.bayar.toLocaleString('id-ID') + ' akan dikembalikan ke ' + trx.user + '. Tindakan ini tidak bisa dibatalkan.',
              confirmLabel: 'Proses Refund',
              danger: true,
              onConfirm: () => { onClose(); window.muurahToast('Refund ' + trx.id + ' berhasil diproses', 'success'); },
            })} style={{
              flex: 1, height: 38, padding: '0 16px', borderRadius: 10,
              background: '#C0001A', color: '#FFFFFF', border: 0,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 130ms ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#9E0017'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#C0001A'}
            >
              <Icons.refresh size={14} /> Proses Refund
            </button>
          )}
          {isProc && (
            <button onClick={() => window.muurahConfirm({
              title: 'Tandai transaksi ' + trx.id + ' selesai?',
              body: 'Status transaksi akan diubah menjadi Sukses secara manual.',
              confirmLabel: 'Tandai Selesai',
              onConfirm: () => { onClose(); window.muurahToast('Transaksi ' + trx.id + ' ditandai selesai', 'success'); },
            })} style={{
            flex: 1, height: 38, padding: '0 16px', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icons.check size={14} strokeWidth={2.3} /> Tandai Selesai
          </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#9085AE',
        letterSpacing: '0.6px', textTransform: 'uppercase',
        marginBottom: 12,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {children}
      </div>
    </div>
  );
}

function KV({ k, v, mono, strong }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: '1px dashed #F0EBFF',
    }}>
      <span style={{ fontSize: 12, color: '#9085AE', fontWeight: 500 }}>{k}</span>
      <span style={{
        fontSize: 13, fontWeight: strong ? 700 : 600,
        color: '#1A1228',
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
        textAlign: 'right',
      }}>{v}</span>
    </div>
  );
}

function TimelineDot({ state }) {
  if (state === 'done') return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%', background: '#16A34A',
      color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 800,
    }}>✓</div>
  );
  if (state === 'error') return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%', background: '#C0001A',
      color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 800,
    }}>✕</div>
  );
  if (state === 'pending') return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%', background: '#EDE8FF',
      border: '2px solid #4A2D8C', color: '#4A2D8C',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span className="muurah-spin" style={{
        width: 9, height: 9, borderRadius: '50%',
        border: '1.5px solid currentColor', borderTopColor: 'transparent',
      }} />
    </div>
  );
  return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF',
      border: '1.5px dashed #C5B8EF',
    }} />
  );
}

function prettyJson(jsonStr) {
  try {
    const obj = JSON.parse(jsonStr);
    const entries = Object.entries(obj);
    return entries.map(([k, v], i) => {
      const last = i === entries.length - 1;
      let color = '#FCD34D'; // strings yellow
      let display = JSON.stringify(v);
      if (typeof v === 'number') color = '#86EFAC';
      if (k === 'code' && Number(v) >= 400) color = '#FCA5A5';
      if (k === 'status' && (v === 'timeout' || v === 'failed' || v === 'error')) color = '#FCA5A5';
      if (k === 'status' && v === 'success') color = '#86EFAC';
      return { k, v: display, color, last };
    });
  } catch (e) {
    return [{ k: 'raw', v: jsonStr, color: '#E5DEF8', last: true }];
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function txInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}

function TxSelect({ defaultLabel, options, prefix }) {
  return (
    <div style={{ position: 'relative' }}>
      <select defaultValue={defaultLabel} style={{
        ...txInputStyle({}), appearance: 'none',
        paddingLeft: prefix ? 34 : 12, paddingRight: 30,
        fontWeight: 500, cursor: 'pointer', minWidth: 140,
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {prefix && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          {prefix}
        </span>
      )}
      <Icons.chevron size={13} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: '#574872', pointerEvents: 'none',
      }} />
    </div>
  );
}

function txGhostBtn(color) {
  return {
    background: 'transparent', border: '1px solid transparent',
    color: color, fontSize: 12, fontWeight: 600,
    padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 130ms ease',
  };
}

function txPageBtn(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}

const txThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const txTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

window.MuurahTransaksi = Transaksi;
