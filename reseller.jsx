// reseller.jsx — Manajemen Reseller screen
const { useState: useRsState } = React;

const RESELLER_ROWS = [
  { id: 'RES-PLT-0001', nama: 'Toko Berkah Cell',     inisial: 'TB', av: ['#4A2D8C','#B23A8E'], level: 'platinum', deposit: 8_450_000, omzet: 124_500_000, komisi: 3_112_500, status: 'aktif', kota: 'Surabaya', joined: '18 bulan' },
  { id: 'RES-GLD-0042', nama: 'Sumber Rejeki Pulsa',  inisial: 'SR', av: ['#D4900A','#D97706'], level: 'gold',     deposit: 2_180_000, omzet: 48_200_000,  komisi: 964_000,   status: 'aktif', kota: 'Jakarta',  joined: '11 bulan' },
  { id: 'RES-SLV-0118', nama: 'Indah Phone Shop',     inisial: 'IP', av: ['#16A34A','#5B7C12'], level: 'silver',   deposit: 145_000,   omzet: 12_840_000,  komisi: 192_600,   status: 'aktif', kota: 'Bandung',  joined: '4 bulan',  lowDeposit: true },
  { id: 'RES-SLV-0089', nama: 'Bintang Pulsa',        inisial: 'BP', av: ['#9085AE','#574872'], level: 'silver',   deposit: 0,         omzet: 0,           komisi: 0,         status: 'suspended', kota: 'Medan', joined: '8 bulan' },
];

const RESELLER_TABS = [
  { id: 'semua',    label: 'Semua' },
  { id: 'silver',   label: 'Silver – Level 1' },
  { id: 'gold',     label: 'Gold – Level 2' },
  { id: 'platinum', label: 'Platinum – Level 3' },
];

const PAYOUT_SEED = [
  { id: 'WD-2031', resellerId: 'RES-PLT-0001', nama: 'Toko Berkah Cell', inisial: 'TB', av: ['#4A2D8C','#B23A8E'], jumlah: 1_500_000, metode: 'Transfer Bank', rekening: 'BCA · 1234567890 a.n. Toko Berkah Cell', tgl: '19 Mei · 10:12', status: 'pending' },
  { id: 'WD-2030', resellerId: 'RES-GLD-0042', nama: 'Sumber Rejeki Pulsa', inisial: 'SR', av: ['#D4900A','#D97706'], jumlah: 500_000, metode: 'GoPay', rekening: '0857xxxx231 a.n. Sumber Rejeki', tgl: '19 Mei · 08:40', status: 'pending' },
  { id: 'WD-2028', resellerId: 'RES-PLT-0001', nama: 'Toko Berkah Cell', inisial: 'TB', av: ['#4A2D8C','#B23A8E'], jumlah: 2_000_000, metode: 'Transfer Bank', rekening: 'BCA · 1234567890 a.n. Toko Berkah Cell', tgl: '17 Mei · 14:02', status: 'approved' },
  { id: 'WD-2025', resellerId: 'RES-SLV-0118', nama: 'Indah Phone Shop', inisial: 'IP', av: ['#16A34A','#5B7C12'], jumlah: 150_000, metode: 'Dana', rekening: '0813xxxx442 a.n. Indah Phone Shop', tgl: '15 Mei · 09:18', status: 'rejected', alasan: 'Saldo komisi tidak mencukupi' },
];

function Reseller() {
  const { Card } = window.MuurahShell;
  const [tab, setTab] = useRsState('semua');
  const [adding, setAdding] = useRsState(false);
  const [view, setView] = useRsState('daftar');
  const [payouts, setPayouts] = useRsState(PAYOUT_SEED);
  const pendingCount = payouts.filter(p => p.status === 'pending').length;

  const [resellers, setResellers] = useRsState(RESELLER_ROWS);
  const [detailReseller, setDetailReseller] = useRsState(null);
  const [topupReseller, setTopupReseller] = useRsState(null);
  const filtered = tab === 'semua' ? resellers : resellers.filter(r => r.level === tab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Manajemen Reseller
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>54</span> reseller aktif
          </div>
        </div>
        <button onClick={() => setAdding(true)} style={primaryBtn()}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah Reseller
        </button>
      </div>

      {/* View toggle */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: 4, display: 'inline-flex', gap: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <button onClick={() => setView('daftar')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 16px', borderRadius: 9, border: 0, cursor: 'pointer',
          background: view === 'daftar' ? '#4A2D8C' : 'transparent',
          color: view === 'daftar' ? '#FFFFFF' : '#574872',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>
          <Icons.users size={14} /> Daftar Reseller
        </button>
        <button onClick={() => setView('payout')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 16px', borderRadius: 9, border: 0, cursor: 'pointer',
          background: view === 'payout' ? '#4A2D8C' : 'transparent',
          color: view === 'payout' ? '#FFFFFF' : '#574872',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          position: 'relative',
        }}>
          <Icons.wallet size={14} /> Pencairan Komisi
          {pendingCount > 0 && (
            <span style={{
              background: view === 'payout' ? '#FFFFFF' : '#C0001A',
              color: view === 'payout' ? '#4A2D8C' : '#FFFFFF',
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
              fontFamily: 'JetBrains Mono, monospace',
            }}>{pendingCount}</span>
          )}
        </button>
      </div>

      {view === 'payout' ? (
        <PayoutPanel payouts={payouts} setPayouts={setPayouts} />
      ) : (
      <>

      {/* Level summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <LevelCard tone="silver"   accent="#9085AE" name="Silver"   level="L1" count={38} komisi="1,5%" txt="Komisi 1,5% per transaksi · syarat omzet < Rp 25jt/bln"
          onClick={() => setTab('silver')} active={tab === 'silver'} />
        <LevelCard tone="gold"     accent="#D4900A" name="Gold"     level="L2" count={12} komisi="2,0%" txt="Komisi 2,0% per transaksi · syarat omzet Rp 25–100jt/bln"
          onClick={() => setTab('gold')} active={tab === 'gold'} />
        <LevelCard tone="platinum" accent="#4A2D8C" name="Platinum" level="L3" count={4}  komisi="2,5%" txt="Komisi 2,5% per transaksi · syarat omzet > Rp 100jt/bln"
          onClick={() => setTab('platinum')} active={tab === 'platinum'} />
      </div>

      {/* Table card */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E0D9F5', padding: '0 20px' }}>
          {RESELLER_TABS.map((t) => {
            const isActive = tab === t.id;
            const count = t.id === 'semua' ? resellers.length : resellers.filter(r => r.level === t.id).length;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: 'transparent', border: 0, padding: '16px 14px 14px',
                fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                color: isActive ? '#4A2D8C' : '#574872',
                borderBottom: isActive ? '2px solid #4A2D8C' : '2px solid transparent',
                marginBottom: -1, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 130ms ease',
              }}>
                {t.label}
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

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, paddingLeft: 20, width: 56 }}></th>
              <th style={thStyle}>Nama & Kode</th>
              <th style={thStyle}>Level</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Saldo Deposit</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Omzet Bulan Ini</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Komisi Earned</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right', paddingRight: 20 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const muted = r.status === 'suspended';
              return (
                <tr key={r.id} style={{
                  borderTop: '1px solid #F0EBFF', height: 68,
                  opacity: muted ? 0.65 : 1, cursor: 'pointer',
                  transition: 'background 130ms ease',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <td style={{ ...tdStyle, paddingLeft: 20, paddingRight: 0 }}>
                    <ResellerAvatar inisial={r.inisial} colors={r.av} />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: '#1A1228' }}>{r.nama}</div>
                    <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                      {r.id} · {r.kota} · {r.joined}
                    </div>
                  </td>
                  <td style={tdStyle}><LevelChip level={r.level} /></td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: r.lowDeposit ? '#D97706' : '#1A1228' }}>
                        Rp {r.deposit.toLocaleString('id-ID')}
                      </span>
                      {r.lowDeposit && (
                        <span title="Saldo rendah" style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#FFFBEB', color: '#D97706',
                        }}>
                          <Icons.alert size={11} strokeWidth={2.4} />
                        </span>
                      )}
                    </div>
                    {r.lowDeposit && (
                      <div style={{ fontSize: 10, color: '#D97706', marginTop: 2, fontWeight: 600 }}>
                        Saldo rendah · perlu top-up
                      </div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                    Rp {r.omzet.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#16A34A' }}>
                    + Rp {r.komisi.toLocaleString('id-ID')}
                  </td>
                  <td style={tdStyle}><GenericStatusPill status={r.status} /></td>
                  <td style={{ ...tdStyle, textAlign: 'right', paddingRight: 20 }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => setDetailReseller(r)} style={ghostBtn('#4A2D8C')}>Detail</button>
                      <button onClick={() => setTopupReseller(r)} style={ghostBtn('#4A2D8C')}>Top-up</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872' }}>
            Menampilkan <b style={{ color: '#1A1228' }}>{filtered.length}</b> dari <b style={{ color: '#1A1228' }}>54</b> reseller
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button disabled style={pageBtn(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
            <button style={{ ...pageBtn(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
            <button style={pageBtn(false)}>2</button>
            <button style={pageBtn(false)}>3</button>
            <button style={pageBtn(false)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
      </Card>
      </>
      )}

      {adding && <AddResellerModal onClose={() => setAdding(false)} />}
      {detailReseller && (
        <ResellerDetailDrawer
          reseller={detailReseller}
          onClose={() => setDetailReseller(null)}
          onTopUp={() => { setDetailReseller(null); setTopupReseller(detailReseller); }}
          onToggleStatus={() => {
            setResellers(rs => rs.map(x => x.id === detailReseller.id ? { ...x, status: x.status === 'suspended' ? 'aktif' : 'suspended' } : x));
            window.muurahToast((detailReseller.status === 'suspended' ? 'Aktivasi' : 'Suspend') + ' reseller ' + detailReseller.nama + ' berhasil', 'success');
            setDetailReseller(null);
          }}
        />
      )}
      {topupReseller && (
        <ResellerTopupModal
          reseller={topupReseller}
          onClose={() => setTopupReseller(null)}
          onSave={(nominal, metode) => {
            setResellers(rs => rs.map(x => x.id === topupReseller.id ? { ...x, deposit: x.deposit + nominal, lowDeposit: (x.deposit + nominal) < 200_000 } : x));
            window.muurahToast('Top-up Rp ' + nominal.toLocaleString('id-ID') + ' via ' + metode + ' ke ' + topupReseller.nama + ' berhasil', 'success');
            setTopupReseller(null);
          }}
        />
      )}
    </div>
  );
}

function LevelCard({ tone, accent, name, level, count, komisi, txt, onClick, active }) {
  return (
    <div onClick={onClick} style={{
      background: '#FFFFFF', border: '1px solid ' + (active ? accent : '#E0D9F5'),
      borderRadius: 16, padding: 20,
      boxShadow: active ? '0 4px 14px ' + accent + '40' : '0 2px 8px rgba(0,0,0,0.05)',
      position: 'relative', overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 130ms ease',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: accent }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: accent + '18', color: accent,
          padding: '5px 10px', borderRadius: 8,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
        }}>
          <LevelGem accent={accent} /> {name.toUpperCase()} · {level}
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          fontSize: 13, color: accent,
        }}>{komisi}</div>
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
        fontSize: 28, color: '#1A1228', letterSpacing: '-0.02em', lineHeight: 1.1,
      }}>{count}</div>
      <div style={{ fontSize: 13, color: '#574872', fontWeight: 600, marginTop: 4 }}>reseller aktif</div>
      <div style={{ fontSize: 11, color: '#9085AE', marginTop: 8, lineHeight: 1.5 }}>{txt}</div>
    </div>
  );
}

function LevelGem({ accent }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12">
      <path d="M6 1 L11 5 L6 11 L1 5 Z" fill={accent} />
    </svg>
  );
}

function ResellerAvatar({ inisial, colors }) {
  const [c1, c2] = colors;
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      color: '#FFFFFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em',
      boxShadow: `0 2px 6px ${c1}33`,
    }}>{inisial}</div>
  );
}

function LevelChip({ level }) {
  const map = {
    silver:   { bg: '#F0EBFF', fg: '#574872', label: 'Silver',   border: '#C5B8EF' },
    gold:     { bg: '#FEF9EC', fg: '#D4900A', label: 'Gold',     border: '#F5D89B' },
    platinum: { bg: '#EDE8FF', fg: '#4A2D8C', label: 'Platinum', border: '#C5B8EF' },
  };
  const t = map[level] || map.silver;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: t.bg, color: t.fg,
      fontSize: 11, fontWeight: 700, padding: '4px 10px',
      borderRadius: 20, border: `1px solid ${t.border}`,
      whiteSpace: 'nowrap',
    }}>
      <LevelGem accent={t.fg} /> {t.label}
    </span>
  );
}

function GenericStatusPill({ status }) {
  const map = {
    aktif:     { bg: '#F0FDF4', fg: '#16A34A', label: 'Aktif' },
    suspended: { bg: '#FCE7E9', fg: '#C0001A', label: 'Suspended' },
  };
  const s = map[status] || map.aktif;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg, fontSize: 11, fontWeight: 600,
      borderRadius: 20, padding: '4px 10px', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {s.label}
    </span>
  );
}

// shared helpers (re-declared per-file for scope safety)
function primaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
    transition: 'background 130ms ease',
  };
}
function ghostBtn(color) {
  return {
    background: 'transparent', border: 0,
    color: color, fontSize: 12, fontWeight: 600,
    padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'inherit',
  };
}
function pageBtn(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}
const thStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const tdStyle = { padding: '12px 14px', verticalAlign: 'middle' };

// ─── Pencairan Komisi (Payout) ────────────────────────────────────────────────
function PayoutPanel({ payouts, setPayouts }) {
  const { Card } = window.MuurahShell;
  const [statusF, setStatusF] = useRsState('semua');

  const filtered = statusF === 'semua' ? payouts : payouts.filter(p => p.status === statusF);
  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.jumlah, 0);

  function approve(p) {
    window.muurahConfirm({
      title: 'Setujui pencairan ' + p.id + '?',
      body: 'Rp ' + p.jumlah.toLocaleString('id-ID') + ' akan ditransfer ke ' + p.nama + ' via ' + p.metode + ' (' + p.rekening + ').',
      confirmLabel: 'Setujui & Proses',
      onConfirm: () => {
        setPayouts(ps => ps.map(x => x.id === p.id ? { ...x, status: 'approved' } : x));
        window.muurahToast('Pencairan ' + p.id + ' disetujui — diproses ke ' + p.metode, 'success');
      },
    });
  }
  function reject(p) {
    window.muurahConfirm({
      title: 'Tolak pencairan ' + p.id + '?',
      body: 'Komisi Rp ' + p.jumlah.toLocaleString('id-ID') + ' milik ' + p.nama + ' akan dikembalikan ke saldo komisi reseller.',
      confirmLabel: 'Tolak Pencairan', danger: true,
      onConfirm: () => {
        setPayouts(ps => ps.map(x => x.id === p.id ? { ...x, status: 'rejected', alasan: 'Ditolak oleh admin' } : x));
        window.muurahToast('Pencairan ' + p.id + ' ditolak', 'success');
      },
    });
  }
  function markPaid(p) {
    setPayouts(ps => ps.map(x => x.id === p.id ? { ...x, status: 'paid' } : x));
    window.muurahToast('Pencairan ' + p.id + ' ditandai selesai (dana sudah terkirim)', 'success');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <PayoutSummary label="Menunggu Persetujuan" value={payouts.filter(p => p.status === 'pending').length + ' request'} amount={'Rp ' + totalPending.toLocaleString('id-ID')} tone="amber" icon="clock" />
        <PayoutSummary label="Disetujui — Belum Selesai" value={payouts.filter(p => p.status === 'approved').length + ' request'} amount="Diproses ke bank/e-wallet" tone="purple" icon="refresh" />
        <PayoutSummary label="Selesai Bulan Ini" value={payouts.filter(p => p.status === 'paid').length + ' request'} amount="Dana sudah terkirim" tone="green" icon="check" />
      </div>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #E0D9F5',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>Pencairan Komisi Reseller</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2 }}>Persetujuan permintaan withdraw komisi ke bank/e-wallet reseller</div>
          </div>
          <div style={{ position: 'relative' }}>
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)} style={{
              background: '#F0EBFF', border: '1px solid transparent', borderRadius: 10,
              height: 38, padding: '0 30px 0 12px', fontSize: 13, color: '#1A1228',
              outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer', fontWeight: 500,
            }}>
              <option value="semua">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="paid">Selesai</option>
              <option value="rejected">Ditolak</option>
            </select>
            <Icons.chevron size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, paddingLeft: 20 }}>ID Pencairan</th>
              <th style={thStyle}>Reseller</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Jumlah</th>
              <th style={thStyle}>Metode & Rekening</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: 'right', paddingRight: 20 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #F0EBFF', height: 64 }}>
                <td style={{ ...tdStyle, paddingLeft: 20, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#4A2D8C' }}>{p.id}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ResellerAvatar inisial={p.inisial} colors={p.av} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1A1228' }}>{p.nama}</div>
                      <div style={{ fontSize: 11, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>{p.resellerId}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>
                  Rp {p.jumlah.toLocaleString('id-ID')}
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600, color: '#1A1228' }}>{p.metode}</div>
                  <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>{p.rekening}</div>
                  {p.status === 'rejected' && p.alasan && (
                    <div style={{ fontSize: 11, color: '#C0001A', marginTop: 2 }}>Alasan: {p.alasan}</div>
                  )}
                </td>
                <td style={{ ...tdStyle, fontSize: 12, color: '#574872', fontFamily: 'JetBrains Mono, monospace' }}>{p.tgl}</td>
                <td style={tdStyle}><PayoutStatusPill status={p.status} /></td>
                <td style={{ ...tdStyle, textAlign: 'right', paddingRight: 20 }}>
                  {p.status === 'pending' && (
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => approve(p)} style={ghostBtn('#16A34A')}>Setujui</button>
                      <button onClick={() => reject(p)} style={ghostBtn('#C0001A')}>Tolak</button>
                    </div>
                  )}
                  {p.status === 'approved' && (
                    <button onClick={() => markPaid(p)} style={ghostBtn('#4A2D8C')}>Tandai Selesai</button>
                  )}
                  {(p.status === 'paid' || p.status === 'rejected') && (
                    <span style={{ fontSize: 11, color: '#9085AE' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>Tidak ada permintaan pencairan.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PayoutSummary({ label, value, amount, tone, icon }) {
  const tones = {
    amber:  { bg: '#FFFBEB', bd: '#FCD34D', fg: '#D97706', accent: '#B45309' },
    purple: { bg: '#EDE8FF', bd: '#C5B8EF', fg: '#4A2D8C', accent: '#3A2370' },
    green:  { bg: '#F0FDF4', bd: '#86EFAC', fg: '#16A34A', accent: '#15803D' },
  };
  const t = tones[tone];
  const IconC = Icons[icon] || Icons.wallet;
  return (
    <div style={{
      background: t.bg, border: `1px solid ${t.bd}`,
      borderRadius: 16, padding: 18,
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: '#FFFFFF', color: t.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><IconC size={18} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: t.fg, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: t.accent, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{value}</div>
        <div style={{ fontSize: 11, color: '#574872', marginTop: 2 }}>{amount}</div>
      </div>
    </div>
  );
}

function PayoutStatusPill({ status }) {
  const map = {
    pending:  { bg: '#FFFBEB', fg: '#D97706', label: 'Pending' },
    approved: { bg: '#EDE8FF', fg: '#4A2D8C', label: 'Diproses' },
    paid:     { bg: '#F0FDF4', fg: '#16A34A', label: 'Selesai' },
    rejected: { bg: '#FCE7E9', fg: '#C0001A', label: 'Ditolak' },
  };
  const m = map[status] || map.pending;
  return <span style={{ fontSize: 11, fontWeight: 700, color: m.fg, background: m.bg, padding: '4px 9px', borderRadius: 6 }}>{m.label}</span>;
}

// ─── Detail Reseller (drawer) ──────────────────────────────────────────────────
const RESELLER_TX_HISTORY = [
  { tgl: '19 Mei · 09:12', produk: 'Pulsa Telkomsel 50.000', jumlah: 51_500, status: 'sukses' },
  { tgl: '18 Mei · 16:40', produk: 'Token PLN 100.000', jumlah: 101_500, status: 'sukses' },
  { tgl: '18 Mei · 11:05', produk: 'Voucher ML 86 Diamond', jumlah: 22_000, status: 'sukses' },
  { tgl: '17 Mei · 14:22', produk: 'Paket Data XL 12GB', jumlah: 65_000, status: 'gagal' },
];

function ResellerDetailDrawer({ reseller: r, onClose, onTopUp, onToggleStatus }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 440, maxWidth: '100%', height: '100%',
        background: '#FFFFFF', boxShadow: '-12px 0 40px rgba(26,18,40,0.18)',
        display: 'flex', flexDirection: 'column',
        animation: 'muurah-slide 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E0D9F5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ResellerAvatar inisial={r.inisial} colors={r.av} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1228' }}>{r.nama}</div>
              <div style={{ fontSize: 11, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{r.id} · {r.kota}</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <LevelChip level={r.level} />
            <GenericStatusPill status={r.status} />
            <span style={{ fontSize: 12, color: '#9085AE', marginLeft: 'auto' }}>Bergabung {r.joined} lalu</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <DetailStatBox label="Saldo Deposit" value={'Rp ' + r.deposit.toLocaleString('id-ID')} warn={r.lowDeposit} />
            <DetailStatBox label="Omzet Bulan Ini" value={'Rp ' + r.omzet.toLocaleString('id-ID')} />
            <DetailStatBox label="Komisi Earned" value={'Rp ' + r.komisi.toLocaleString('id-ID')} positive />
            <DetailStatBox label="Total Transaksi" value={RESELLER_TX_HISTORY.length + ' (terakhir 4 hari)'} />
          </div>

          {r.lowDeposit && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 10, padding: 12, fontSize: 12, color: '#D97706', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Icons.alert size={14} strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 1 }} />
              Saldo deposit reseller ini rendah — pertimbangkan untuk melakukan top-up.
            </div>
          )}

          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9085AE', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>
              Transaksi Terakhir
            </div>
            <div style={{ border: '1px solid #F0EBFF', borderRadius: 10, overflow: 'hidden' }}>
              {RESELLER_TX_HISTORY.map((t, i) => (
                <div key={i} style={{
                  padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: i === 0 ? 0 : '1px solid #F0EBFF', fontSize: 12,
                }}>
                  <div>
                    <div style={{ color: '#1A1228', fontWeight: 600 }}>{t.produk}</div>
                    <div style={{ color: '#9085AE', fontSize: 11, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{t.tgl}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>Rp {t.jumlah.toLocaleString('id-ID')}</div>
                    <div style={{ fontSize: 11, color: t.status === 'sukses' ? '#16A34A' : '#C0001A', marginTop: 2, fontWeight: 600 }}>{t.status === 'sukses' ? 'Sukses' : 'Gagal'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #E0D9F5', display: 'flex', gap: 8 }}>
          <button onClick={onToggleStatus} style={{ ...secondaryBtn(), flex: 1, color: r.status === 'suspended' ? '#16A34A' : '#C0001A', borderColor: r.status === 'suspended' ? '#86EFAC' : '#FCA5A5' }}>
            {r.status === 'suspended' ? 'Aktifkan Reseller' : 'Suspend Reseller'}
          </button>
          <button onClick={onTopUp} style={{ ...primaryBtn(), flex: 1, justifyContent: 'center' }}>
            <Icons.wallet size={14} /> Top-up Saldo
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailStatBox({ label, value, warn, positive }) {
  return (
    <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#9085AE', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontSize: 15, fontWeight: 800, marginTop: 4, fontFamily: 'JetBrains Mono, monospace',
        color: warn ? '#D97706' : positive ? '#16A34A' : '#1A1228',
      }}>{value}</div>
    </div>
  );
}

// ─── Top-up Saldo Reseller ──────────────────────────────────────────────────────
const RS_TOPUP_METODE = ['Transfer Bank', 'Saldo Internal', 'Tunai'];
const RS_TOPUP_QUICK = [100_000, 500_000, 1_000_000, 5_000_000];

function ResellerTopupModal({ reseller: r, onClose, onSave }) {
  const [nominal, setNominal] = useRsState(500_000);
  const [metode, setMetode] = useRsState(RS_TOPUP_METODE[0]);

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const isValid = nominal > 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 460, background: '#FFFFFF', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(26,18,40,0.25)',
        display: 'flex', flexDirection: 'column',
        animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top-up Saldo Reseller</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>{r.nama}</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Saldo saat ini: Rp {r.deposit.toLocaleString('id-ID')}</div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Nominal Top-up</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9085AE', fontWeight: 600 }}>Rp</span>
              <input type="text" value={nominal.toLocaleString('id-ID')}
                onChange={(e) => setNominal(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                style={{
                  width: '100%', background: '#F0EBFF', border: '1px solid transparent', borderRadius: 10,
                  height: 42, padding: '0 12px 0 34px', fontSize: 16, fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace', color: '#1A1228', outline: 'none',
                }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {RS_TOPUP_QUICK.map(a => (
                <button key={a} type="button" onClick={() => setNominal(a)} style={{
                  flex: 1, padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                  background: nominal === a ? '#4A2D8C' : '#F0EBFF',
                  color: nominal === a ? '#FFFFFF' : '#574872',
                  border: 0, fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
                }}>{a >= 1_000_000 ? (a / 1_000_000) + 'jt' : (a / 1_000) + 'rb'}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Metode</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {RS_TOPUP_METODE.map(m => {
                const active = metode === m;
                return (
                  <button key={m} type="button" onClick={() => setMetode(m)} style={{
                    flex: 1, padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
                    background: active ? '#EDE8FF' : '#FFFFFF',
                    border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                    color: active ? '#4A2D8C' : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>{m}</button>
                );
              })}
            </div>
          </div>

          <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 12, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#574872' }}>Saldo setelah top-up</span>
            <span style={{ fontWeight: 700, color: '#16A34A', fontFamily: 'JetBrains Mono, monospace' }}>Rp {(r.deposit + nominal).toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={onClose} style={secondaryBtn()}>Batal</button>
          <button onClick={() => isValid && onSave(nominal, metode)} style={{ ...primaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> Konfirmasi Top-up
          </button>
        </div>
      </div>
    </div>
  );
}

window.MuurahReseller = Reseller;

// ═════════════════════════════════════════════════════════════════════════
//   ADD RESELLER MODAL — prefilled example
// ═════════════════════════════════════════════════════════════════════════
const { useEffect: useRsEffect } = React;

function AddResellerModal({ onClose }) {
  const [form, setForm] = useRsState({
    nama: 'Agus Permadi',
    hp: '081298765432',
    email: 'agus.permadi@gmail.com',
    kota: 'Surabaya',
    level: 'silver',
    deposit: 200_000,
    referral: 'RSL-00212',
    status: 'aktif',
  });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useRsEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const levelMeta = {
    silver:   { label: 'Silver – Level 1',   bg: '#F0EBFF', fg: '#574872', komisi: '1,5%', accent: '#9085AE' },
    gold:     { label: 'Gold – Level 2',     bg: '#FEF9EC', fg: '#D4900A', komisi: '2,0%', accent: '#D4900A' },
    platinum: { label: 'Platinum – Level 3', bg: '#EDE8FF', fg: '#4A2D8C', komisi: '2,5%', accent: '#4A2D8C' },
  };
  const currentLevel = levelMeta[form.level];

  function handleSave() {
    onClose();
    window.muurahToast('Reseller "' + form.nama + '" berhasil ditambahkan', 'success');
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 560, maxHeight: 'calc(100vh - 80px)',
        background: '#FFFFFF', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(26,18,40,0.25)',
        display: 'flex', flexDirection: 'column',
        animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Tambah Reseller
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              Daftarkan Reseller Baru
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>
              Data di bawah adalah contoh. Ubah sesuai kebutuhan.
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ArField label="Nama Lengkap">
            <input value={form.nama} onChange={(e) => u('nama', e.target.value)} style={arInputStyle({ width: '100%' })} />
          </ArField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <ArField label="Nomor HP">
              <input value={form.hp} onChange={(e) => u('hp', e.target.value)}
                style={arInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 })} />
            </ArField>
            <ArField label="Kota">
              <div style={{ position: 'relative' }}>
                <select value={form.kota} onChange={(e) => u('kota', e.target.value)}
                  style={arInputStyle({ width: '100%', appearance: 'none', paddingRight: 32, cursor: 'pointer' })}>
                  {['Jakarta','Surabaya','Bandung','Medan','Semarang','Makassar','Yogyakarta','Denpasar','Palembang','Balikpapan','Bogor','Bekasi'].map(o =>
                    <option key={o} value={o}>{o}</option>
                  )}
                </select>
                <Icons.chevron size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
              </div>
            </ArField>
          </div>

          <ArField label="Email">
            <input value={form.email} onChange={(e) => u('email', e.target.value)} type="email" style={arInputStyle({ width: '100%' })} />
          </ArField>

          <ArField label="Level Reseller">
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.entries(levelMeta).map(([id, m]) => {
                const active = form.level === id;
                return (
                  <button key={id} type="button" onClick={() => u('level', id)} style={{
                    flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: active ? m.bg : '#FFFFFF',
                    border: active ? '1.5px solid ' + m.accent : '1px solid #E0D9F5',
                    color: active ? m.fg : '#574872',
                    fontSize: 12, fontWeight: active ? 700 : 500, fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 130ms ease',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{m.label}</span>
                      {active && <Icons.check size={13} strokeWidth={2.8} />}
                    </div>
                    <div style={{ fontSize: 10, color: '#9085AE', marginTop: 4, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
                      Komisi {m.komisi}
                    </div>
                  </button>
                );
              })}
            </div>
          </ArField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <ArField label="Deposit Awal">
              <ArPriceInput value={form.deposit} onChange={(v) => u('deposit', v)} />
            </ArField>
            <ArField label="Kode Referral">
              <input value={form.referral} onChange={(e) => u('referral', e.target.value)}
                style={arInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 })} />
            </ArField>
          </div>

          <ArField label="Status">
            <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
              <ArRadio label="Aktif" value="aktif" current={form.status} onChange={(v) => u('status', v)} />
              <ArRadio label="Nonaktif" value="nonaktif" current={form.status} onChange={(v) => u('status', v)} />
            </div>
          </ArField>

          {/* Summary preview */}
          <div style={{
            background: currentLevel.bg, borderRadius: 10, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
            border: '1px solid ' + currentLevel.accent + '40',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#FFFFFF', color: currentLevel.fg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icons.store size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: currentLevel.fg, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {currentLevel.label}
              </div>
              <div style={{ fontSize: 12, color: '#574872', marginTop: 2 }}>
                {form.nama} · {form.kota} · Komisi {currentLevel.komisi} per transaksi
              </div>
            </div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
              fontSize: 14, color: currentLevel.fg, letterSpacing: '-0.01em',
            }}>
              Rp {form.deposit.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
            height: 38, padding: '0 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}>Batal</button>
          <button onClick={handleSave} style={{
            background: '#4A2D8C', color: '#FFFFFF', border: 0,
            height: 38, padding: '0 20px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'background 130ms ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3A2370'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4A2D8C'}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Tambah Reseller
          </button>
        </div>
      </div>
    </div>
  );
}

function ArField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

function ArPriceInput({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9085AE', fontWeight: 500, pointerEvents: 'none' }}>Rp</span>
      <input type="text" value={value.toLocaleString('id-ID')}
        onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
        style={arInputStyle({ width: '100%', paddingLeft: 34, paddingRight: 12,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, textAlign: 'right' })} />
    </div>
  );
}

function ArRadio({ label, value, current, onChange }) {
  const active = value === current;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: '1.5px solid ' + (active ? '#4A2D8C' : '#C5B8EF'),
        background: '#FFFFFF',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 130ms ease',
      }}>
        {active && <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#4A2D8C' }} />}
      </span>
      <input type="radio" checked={active} onChange={() => onChange(value)} style={{ display: 'none' }} />
      <span style={{ fontSize: 13, color: '#1A1228', fontWeight: active ? 600 : 500 }}>{label}</span>
    </label>
  );
}

function arInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}
