// komplain.jsx — Komplain & Tiket screen
const { useState: useKpState, useMemo: useKpMemo, useEffect: useKpEffect, useRef: useKpRef } = React;

const TICKETS = [
  {
    id: 'TKT-001', user: 'Budi Raharjo',  inisial: 'BR', av: ['#4A2D8C','#B23A8E'],
    hp: '081234xxxx', kategori: 'Transaksi Gagal',
    deskripsiShort: 'Token PLN tidak diterima setelah pembayaran berhasil…',
    deskripsi: 'Token PLN 50.000 tidak diterima setelah pembayaran berhasil. Saldo sudah terpotong Rp 50.800 tapi token belum masuk ke meteran.',
    tgl: '19 Mei · 14:32', status: 'baru', prioritas: 'tinggi',
    txTerkait: 'TXN-9912832',
    userStats: { txn: 48, belanja: 2_340_000, saldo: 125_000 },
    thread: [
      { who: 'user', t: '14:32', msg: 'Token listrik saya belum masuk padahal sudah bayar tadi jam 14:30' },
      { who: 'cs',   t: '14:38', who_name: 'CS Andre', msg: 'Halo Kak Budi, kami sedang cek ke sistem. Mohon tunggu sebentar ya.' },
      { who: 'user', t: '15:08', msg: 'Sudah 30 menit nih, tolong segera diproses' },
    ],
  },
  {
    id: 'TKT-002', user: 'Siti Rahayu', inisial: 'SR', av: ['#C0001A','#F5793B'],
    hp: '087654xxxx', kategori: 'Saldo Tidak Masuk',
    deskripsiShort: 'Top-up via BCA sudah 2 jam belum masuk ke saldo aplikasi…',
    deskripsi: 'Top-up via BCA VA sebesar Rp 200.000 sudah 2 jam belum masuk ke saldo aplikasi. Bukti transfer sudah terlampir.',
    tgl: '19 Mei · 13:15', status: 'diproses', prioritas: 'sedang',
    txTerkait: 'TOP-887124',
    userStats: { txn: 86, belanja: 4_200_000, saldo: 0 },
    thread: [
      { who: 'user', t: '13:15', msg: 'Saya sudah top-up Rp 200.000 via BCA VA tapi belum masuk.' },
      { who: 'cs',   t: '13:42', who_name: 'CS Andre', msg: 'Mohon kirim bukti transfer kak, sedang dicek ke Midtrans.' },
    ],
  },
  {
    id: 'TKT-003', user: 'Ahmad Fauzi', inisial: 'AF', av: ['#16A34A','#5B7C12'],
    hp: '082345xxxx', kategori: 'Produk Tidak Terkirim',
    deskripsiShort: 'Pulsa Telkomsel 50rb sudah terpotong tapi tidak masuk ke nomor…',
    deskripsi: 'Pulsa Telkomsel 50rb sudah terpotong dari saldo tapi tidak masuk ke nomor tujuan 0812xxxxxxxx.',
    tgl: '19 Mei · 12:44', status: 'diproses', prioritas: 'tinggi',
    txTerkait: 'TXN-9912780',
    userStats: { txn: 22, belanja: 1_180_000, saldo: 45_000 },
    thread: [],
  },
  {
    id: 'TKT-004', user: 'Dewi Lestari', inisial: 'DL', av: ['#D4900A','#D97706'],
    hp: '089123xxxx', kategori: 'Transaksi Gagal',
    deskripsiShort: 'BPJS gagal tapi saldo berkurang Rp 100.000…',
    deskripsi: 'Pembayaran BPJS Kesehatan gagal tetapi saldo tetap berkurang Rp 100.500.',
    tgl: '19 Mei · 11:20', status: 'selesai', prioritas: 'sedang',
    txTerkait: 'TXN-9912661',
    userStats: { txn: 134, belanja: 7_840_000, saldo: 300_000 },
    thread: [],
  },
  {
    id: 'TKT-005', user: 'Rudi Hartono', inisial: 'RH', av: ['#9085AE','#574872'],
    hp: '085678xxxx', kategori: 'Lainnya',
    deskripsiShort: 'Ingin ganti nomor HP terdaftar di akun…',
    deskripsi: 'Mohon dibantu mengganti nomor HP terdaftar di akun karena nomor lama sudah tidak aktif.',
    tgl: '18 Mei · 16:05', status: 'selesai', prioritas: 'rendah',
    txTerkait: null,
    userStats: { txn: 9, belanja: 320_000, saldo: 25_000 },
    thread: [],
  },
  {
    id: 'TKT-006', user: 'Wati Susanti', inisial: 'WS', av: ['#7B5BC0','#4A2D8C'],
    hp: '083456xxxx', kategori: 'Transaksi Gagal',
    deskripsiShort: 'Game voucher ML tidak masuk ke akun Mobile Legends…',
    deskripsi: 'Voucher Mobile Legends 172 diamond tidak masuk ke akun ID 12345678.',
    tgl: '18 Mei · 09:30', status: 'ditutup', prioritas: 'rendah',
    txTerkait: 'TXN-9912447',
    userStats: { txn: 17, belanja: 780_000, saldo: 12_000 },
    thread: [],
  },
];

function Komplain() {
  const { Card } = window.MuurahShell;
  const [selected, setSelected] = useKpState(null);
  const [query, setQuery] = useKpState('');
  const [statusF, setStatusF] = useKpState('semua');
  const [katF, setKatF] = useKpState('semua');
  const [prioF, setPrioF] = useKpState('semua');
  const [adding, setAdding] = useKpState(false);
  const [tgl, setTgl] = useKpState('2026-05-19');
  const { DatePickerButton, formatTglID } = window.MuurahGlobal;

  const filtered = useKpMemo(() => TICKETS.filter(t => {
    if (statusF !== 'semua' && t.status !== statusF) return false;
    if (katF !== 'semua' && t.kategori !== katF) return false;
    if (prioF !== 'semua' && t.prioritas !== prioF) return false;
    if (tgl) {
      const tglShort = formatTglID(tgl).split(' ').slice(0, 2).join(' ');
      if (!t.tgl.startsWith(tglShort)) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      if (!`${t.id} ${t.user} ${t.hp} ${t.deskripsi}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [statusF, katF, prioF, query, tgl]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Komplain & Tiket
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            Penanganan keluhan dan permintaan user
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={kpSecondaryBtn()}><Icons.download size={14} /> Export</button>
          <button style={kpPrimaryBtn()} onClick={() => setAdding(true)}><span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tiket Manual</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: '14px 18px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <KpiCell label="Tiket Masuk Hari Ini"    value="12"      icon="receipt" tone="purple" />
        <KpiCell label="Menunggu Respon"          value="5"       icon="clock"   tone="amber"  badge="amber" />
        <KpiCell label="Selesai Hari Ini"         value="7"       icon="check"   tone="green"  badge="green" last={false} />
        <KpiCell label="Rata-rata Waktu Respon"   value="2,4 jam" icon="trendup" tone="lime"   small last />
      </div>

      {/* Filter row */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: 12,
        display: 'flex', gap: 10, alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 360 }}>
          <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari ID tiket, user, deskripsi…"
            style={kpInputStyle({ paddingLeft: 36, width: '100%' })} />
        </div>
        <KpSelect prefix="Status:" value={statusF} onChange={setStatusF}
          options={[['semua','Semua'],['baru','Baru'],['diproses','Diproses'],['selesai','Selesai'],['ditutup','Ditutup']]} />
        <KpSelect prefix="Kategori:" value={katF} onChange={setKatF}
          options={[['semua','Semua'],['Transaksi Gagal','Transaksi Gagal'],['Saldo Tidak Masuk','Saldo Tidak Masuk'],['Produk Tidak Terkirim','Produk Tidak Terkirim'],['Lainnya','Lainnya']]} />
        <KpSelect prefix="Prioritas:" value={prioF} onChange={setPrioF}
          options={[['semua','Semua'],['tinggi','Tinggi'],['sedang','Sedang'],['rendah','Rendah']]} />
        <DatePickerButton value={tgl} onChange={setTgl} />
        {tgl && (
          <button onClick={() => setTgl('')} title="Reset tanggal" style={kpGhostBtn('#9085AE')}>
            <Icons.x size={13} />
          </button>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>
          {filtered.length} tiket
        </div>
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...kpThStyle, paddingLeft: 24 }}>ID Tiket</th>
              <th style={kpThStyle}>User</th>
              <th style={kpThStyle}>No. HP</th>
              <th style={kpThStyle}>Kategori</th>
              <th style={kpThStyle}>Deskripsi</th>
              <th style={kpThStyle}>Tgl Masuk</th>
              <th style={kpThStyle}>Status</th>
              <th style={kpThStyle}>Prioritas</th>
              <th style={{ ...kpThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const isSelected = selected && selected.id === t.id;
              return (
                <tr key={t.id} onClick={() => setSelected(t)}
                  style={{
                    borderTop: '1px solid #F0EBFF', height: 60, cursor: 'pointer',
                    background: isSelected ? '#F0EBFF' : '#FFFFFF',
                    transition: 'background 130ms ease',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#FAF8FF'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = '#FFFFFF'; }}
                >
                  <td style={{ ...kpTdStyle, paddingLeft: 24 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#4A2D8C', fontWeight: 700 }}>{t.id}</span>
                  </td>
                  <td style={kpTdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <MiniAvatar inisial={t.inisial} colors={t.av} />
                      <span style={{ fontWeight: 600, color: '#1A1228' }}>{t.user}</span>
                    </div>
                  </td>
                  <td style={{ ...kpTdStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' }}>{t.hp}</td>
                  <td style={kpTdStyle}><KategoriChip kategori={t.kategori} /></td>
                  <td style={{ ...kpTdStyle, color: '#574872', maxWidth: 240 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.deskripsiShort}
                    </span>
                  </td>
                  <td style={{ ...kpTdStyle, fontSize: 12, color: '#574872', fontFamily: 'JetBrains Mono, monospace' }}>{t.tgl}</td>
                  <td style={kpTdStyle}><StatusPill status={t.status} /></td>
                  <td style={kpTdStyle}><PrioritasPill prio={t.prioritas} /></td>
                  <td style={{ ...kpTdStyle, paddingRight: 24, textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSelected(t)} style={kpGhostBtn(t.status === 'selesai' || t.status === 'ditutup' ? '#574872' : '#4A2D8C')}>
                      {t.status === 'selesai' || t.status === 'ditutup' ? 'Lihat' : 'Buka'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{
          padding: '14px 24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872' }}>
            Menampilkan <b style={{ color: '#1A1228' }}>{filtered.length}</b> dari <b style={{ color: '#1A1228' }}>147</b> tiket aktif
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button disabled style={kpPageBtn(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
            <button style={{ ...kpPageBtn(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
            <button style={kpPageBtn(false)}>2</button>
            <button style={kpPageBtn(false)}>3</button>
            <span style={{ color: '#9085AE', padding: '0 6px', fontSize: 12 }}>…</span>
            <button style={kpPageBtn(false)}>25</button>
            <button style={kpPageBtn(false)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
      </Card>

      {selected && <TicketDrawer ticket={selected} onClose={() => setSelected(null)} />}
      {adding && <AddTicketModal onClose={() => setAdding(false)} onCreated={(t) => setSelected(t)} />}
    </div>
  );
}

// ─── KPI cell ────────────────────────────────────────────────────────────────
function KpiCell({ label, value, icon, tone, badge, small, last }) {
  const tones = {
    purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
    amber:  { bg: '#FFFBEB', fg: '#D97706' },
    green:  { bg: '#F0FDF4', fg: '#16A34A' },
    lime:   { bg: '#F4FCE3', fg: '#5B7C12' },
  };
  const t = tones[tone] || tones.purple;
  const IconC = Icons[icon] || Icons.bell;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '4px 18px',
      borderLeft: last === false || last === true ? '1px solid #F0EBFF' : 0,
      borderRight: 0,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: t.bg, color: t.fg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconC size={17} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
          fontSize: small ? 20 : 26, color: '#1A1228', lineHeight: 1.15, letterSpacing: '-0.02em',
        }}>{value}</div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: '#9085AE',
          letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 4,
        }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Pills ───────────────────────────────────────────────────────────────────
function StatusPill({ status, large }) {
  const map = {
    baru:     { bg: '#EDE8FF', fg: '#4A2D8C', label: 'Baru' },
    diproses: { bg: '#E0F2FE', fg: '#0369A1', label: 'Diproses' },
    selesai:  { bg: '#F0FDF4', fg: '#16A34A', label: 'Selesai' },
    ditutup:  { bg: '#F0EBFF', fg: '#574872', label: 'Ditutup' },
  };
  const s = map[status] || map.baru;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg,
      fontSize: large ? 11 : 11, fontWeight: 700,
      borderRadius: 20, padding: large ? '5px 12px' : '4px 10px',
      whiteSpace: 'nowrap', letterSpacing: large ? '0.06em' : 0,
      textTransform: large ? 'uppercase' : 'none',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {s.label}
    </span>
  );
}

function PrioritasPill({ prio, large }) {
  const map = {
    tinggi: { bg: '#FCE7E9', fg: '#C0001A', label: 'Tinggi' },
    sedang: { bg: '#FFFBEB', fg: '#D97706', label: 'Sedang' },
    rendah: { bg: '#F0EBFF', fg: '#574872', label: 'Rendah' },
  };
  const s = map[prio] || map.rendah;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.fg,
      fontSize: 11, fontWeight: 700,
      borderRadius: 20, padding: large ? '5px 12px' : '4px 10px',
      whiteSpace: 'nowrap', letterSpacing: large ? '0.06em' : 0,
      textTransform: large ? 'uppercase' : 'none',
    }}>
      <PrioFlame fg={s.fg} prio={prio} />
      {s.label}
    </span>
  );
}

function PrioFlame({ fg, prio }) {
  if (prio === 'tinggi') {
    return (
      <svg width="10" height="10" viewBox="0 0 12 12">
        <path d="M6 1 L9 5 L9 8 A3 3 0 0 1 3 8 L3 5 Z" fill={fg} />
      </svg>
    );
  }
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />;
}

function KategoriChip({ kategori }) {
  const map = {
    'Transaksi Gagal':         { bg: '#FCE7E9', fg: '#C0001A' },
    'Saldo Tidak Masuk':       { bg: '#FFFBEB', fg: '#D97706' },
    'Produk Tidak Terkirim':   { bg: '#EDE8FF', fg: '#4A2D8C' },
    'Lainnya':                 { bg: '#F0EBFF', fg: '#574872' },
  };
  const t = map[kategori] || map['Lainnya'];
  return (
    <span style={{
      background: t.bg, color: t.fg,
      fontSize: 11, fontWeight: 600,
      padding: '4px 9px', borderRadius: 8,
      whiteSpace: 'nowrap',
    }}>{kategori}</span>
  );
}

function MiniAvatar({ inisial, colors, size = 30 }) {
  const [c1, c2] = colors;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      color: '#FFFFFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>{inisial}</div>
  );
}

// ─── Drawer ──────────────────────────────────────────────────────────────────
function TicketDrawer({ ticket, onClose }) {
  const [statusEdit, setStatusEdit] = useKpState(ticket.status);
  const [note, setNote] = useKpState('');

  useKpEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

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
          position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Detail Tiket
            </div>
            <button onClick={onClose} aria-label="Tutup" style={{
              width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
              background: '#FFFFFF', color: '#574872', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icons.x size={16} /></button>
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 800,
            color: '#1A1228', marginTop: 8, letterSpacing: '-0.02em',
          }}>{ticket.id}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <StatusPill status={ticket.status} large />
            <PrioritasPill prio={ticket.prioritas} large />
          </div>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Info User */}
          <DrSection label="Info User">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MiniAvatar inisial={ticket.inisial} colors={ticket.av} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1228', letterSpacing: '-0.01em' }}>{ticket.user}</div>
                <div style={{ fontSize: 12, color: '#574872', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{ticket.hp}</div>
              </div>
              <button onClick={() => window.muurahOpenUserProfile(ticket.hp)} style={kpGhostBtn('#4A2D8C')}>Lihat profil</button>
            </div>
            <div style={{
              marginTop: 12, padding: 12,
              background: '#F0EBFF', borderRadius: 10,
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
            }}>
              <UserStat label="Total Transaksi" value={ticket.userStats.txn} mono />
              <Divider />
              <UserStat label="Total Belanja" value={`Rp ${(ticket.userStats.belanja/1_000_000).toFixed(2).replace('.',',')} jt`} mono />
              <Divider />
              <UserStat label="Saldo" value={`Rp ${ticket.userStats.saldo.toLocaleString('id-ID')}`} mono highlight={ticket.userStats.saldo === 0} />
            </div>
          </DrSection>

          {/* Detail Masalah */}
          <DrSection label="Detail Masalah">
            <KV k="Kategori" v={<KategoriChip kategori={ticket.kategori} />} />
            <div style={{ padding: '10px 0', borderBottom: '1px dashed #F0EBFF' }}>
              <div style={{ fontSize: 12, color: '#9085AE', fontWeight: 500, marginBottom: 6 }}>Deskripsi</div>
              <div style={{ fontSize: 13, color: '#1A1228', lineHeight: 1.6 }}>{ticket.deskripsi}</div>
            </div>
            {ticket.txTerkait && (
              <KV k="Transaksi Terkait" v={
                <a href="#" onClick={(e) => e.preventDefault()} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  color: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 700, textDecoration: 'none',
                  borderBottom: '1px dashed #4A2D8C', paddingBottom: 1,
                }}>
                  {ticket.txTerkait} <Icons.arrowR size={11} />
                </a>
              } />
            )}
            <KV k="Dibuka" v={ticket.tgl} mono />
            <KV k="SLA Respon" v={
              <span style={{ color: ticket.status === 'baru' ? '#D97706' : '#16A34A', fontWeight: 700 }}>
                {ticket.status === 'baru' ? 'Tersisa 22 menit' : 'Terpenuhi'}
              </span>
            } />
          </DrSection>

          {/* Riwayat Percakapan — live chat */}
          <DrSection label="Riwayat Percakapan">
            <LiveChat ticket={ticket} />
          </DrSection>

          {/* Aksi CS */}
          <DrSection label="Aksi CS">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Ubah Status
                </div>
                <div style={{ display: 'flex', gap: 6, padding: 3, background: '#F0EBFF', borderRadius: 10 }}>
                  {[['baru','Baru'],['diproses','Diproses'],['selesai','Selesai'],['ditutup','Ditutup']].map(([id, label]) => {
                    const active = statusEdit === id;
                    return (
                      <button key={id} onClick={() => setStatusEdit(id)} style={{
                        flex: 1, border: 0, padding: '7px 8px', borderRadius: 8, cursor: 'pointer',
                        background: active ? '#FFFFFF' : 'transparent',
                        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        color: active ? '#4A2D8C' : '#574872',
                        fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                        transition: 'all 130ms ease',
                      }}>{label}</button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ ...kpPrimaryBtn(), flex: 1, height: 38 }}>
                  <Icons.refresh size={14} /> Proses Refund
                </button>
                <button style={{ ...kpSecondaryBtn(), flex: 1, height: 38, justifyContent: 'center' }}>
                  <Icons.users size={14} /> Eskalasi ke Admin
                </button>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icons.shieldlock size={11} /> Catatan Internal (tidak terlihat user)
                </div>
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="Tulis catatan untuk tim internal…"
                  style={{
                    width: '100%', minHeight: 72, resize: 'vertical',
                    padding: 12, fontSize: 13, color: '#1A1228',
                    background: '#FFFBEB', border: '1px solid #FCD34D',
                    borderRadius: 10, outline: 'none', fontFamily: 'inherit',
                  }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: '#9085AE' }}>
                    {note.length}/500 karakter
                  </span>
                  <button style={kpPrimaryBtn()}>
                    Simpan Catatan
                  </button>
                </div>
              </div>
            </div>
          </DrSection>
        </div>
      </div>
    </div>
  );
}

function DrSection({ label, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#9085AE',
        letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 10,
      }}>{label}</div>
      {children}
    </div>
  );
}

function KV({ k, v, mono }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: '1px dashed #F0EBFF', gap: 12,
    }}>
      <span style={{ fontSize: 12, color: '#9085AE', fontWeight: 500 }}>{k}</span>
      <span style={{
        fontSize: 13, fontWeight: 600, color: '#1A1228',
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
      }}>{v}</span>
    </div>
  );
}

function UserStat({ label, value, mono, highlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 4px' }}>
      <span style={{
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
        fontWeight: 700, fontSize: 14, color: highlight ? '#C0001A' : '#1A1228',
        letterSpacing: '-0.01em', whiteSpace: 'nowrap',
      }}>{value}</span>
      <span style={{
        fontSize: 9.5, fontWeight: 600, color: '#574872',
        letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center',
      }}>{label}</span>
    </div>
  );
}

function Divider() {
  return <span style={{ width: 1, alignSelf: 'stretch', background: '#C5B8EF', margin: '4px 0' }} />;
}

function ChatBubble({ msg, ticket }) {
  // Kept for backwards-compat (used by static fallback). Live chat uses LiveBubble.
  const isUser = msg.who === 'user';
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 8,
      alignItems: 'flex-end',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: isUser ? `linear-gradient(135deg, ${ticket.av[0]} 0%, ${ticket.av[1]} 100%)`
                            : '#4A2D8C',
        color: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 10, flexShrink: 0,
      }}>{isUser ? ticket.inisial : 'CS'}</div>
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '10px 14px',
          background: isUser ? '#EDE8FF' : '#FFFFFF',
          border: isUser ? '1px solid transparent' : '1px solid #E0D9F5',
          color: '#1A1228',
          borderRadius: 12,
          borderTopRightRadius: isUser ? 4 : 12,
          borderTopLeftRadius: isUser ? 12 : 4,
          fontSize: 13, lineHeight: 1.5,
        }}>{msg.msg}</div>
        <div style={{
          fontSize: 10, color: '#9085AE',
          marginTop: 4, textAlign: isUser ? 'right' : 'left',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {isUser ? ticket.user.split(' ')[0] : (msg.who_name || 'CS')} · {msg.t}
        </div>
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function kpInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}
function KpSelect({ value, onChange, options, prefix }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        ...kpInputStyle({}), appearance: 'none',
        paddingLeft: prefix ? 78 : 12, paddingRight: 30,
        fontWeight: 500, cursor: 'pointer', minWidth: 150,
      }}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      {prefix && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 12, color: '#9085AE', fontWeight: 500, pointerEvents: 'none' }}>{prefix}</span>
      )}
      <Icons.chevron size={13} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: '#574872', pointerEvents: 'none',
      }} />
    </div>
  );
}
function kpDateBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#F0EBFF', border: '1px solid transparent',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, color: '#1A1228',
    fontFamily: 'inherit', cursor: 'pointer',
  };
}
function kpPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function kpSecondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function kpGhostBtn(color) {
  return {
    background: 'transparent', color, border: 0,
    padding: '6px 12px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function kpPageBtn(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}
const kpThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const kpTdStyle = { padding: '12px 14px', verticalAlign: 'middle' };

// ─── Modal: Tambah Tiket Manual ───────────────────────────────────────────────
function AddTicketModal({ onClose, onCreated }) {
  const [form, setForm] = useKpState({
    user: '', hp: '', kategori: 'Transaksi Gagal', prioritas: 'sedang',
    channel: 'wa', txTerkait: '', deskripsi: '',
  });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useKpEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const isValid = form.user.trim() && form.hp.trim() && form.deskripsi.trim();

  function handleSave() {
    if (!isValid) {
      window.muurahToast('Lengkapi nama, no. HP, dan deskripsi terlebih dahulu', 'error');
      return;
    }
    const initials = form.user.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const newTicket = {
      id: 'TKT-' + Math.floor(100 + Math.random() * 900),
      user: form.user, inisial: initials || 'CS', av: ['#4A2D8C', '#7B5BC0'],
      hp: form.hp, kategori: form.kategori,
      deskripsiShort: form.deskripsi.slice(0, 80),
      deskripsi: form.deskripsi,
      tgl: 'Hari ini · ' + nowStr(), status: 'baru', prioritas: form.prioritas,
      txTerkait: form.txTerkait || null,
      userStats: { txn: 0, belanja: 0, saldo: 0 },
      thread: [
        { who: 'cs', t: nowStr(), who_name: 'CS Admin',
          msg: 'Tiket dibuat manual via ' + CHANNEL_LABEL[form.channel] + '. ' + form.deskripsi },
      ],
    };
    TICKETS.unshift(newTicket);
    onClose();
    window.muurahToast('Tiket ' + newTicket.id + ' berhasil dibuat', 'success');
    onCreated && onCreated(newTicket);
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
              Tiket Manual
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              Buat Tiket Baru
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>
              Untuk komplain yang masuk via WA, telepon, atau walk-in
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <KpField label="Nama User">
              <input value={form.user} onChange={(e) => u('user', e.target.value)}
                placeholder="cth. Budi Santoso"
                style={kpInputStyle({ width: '100%' })} />
            </KpField>
            <KpField label="No. HP">
              <input value={form.hp} onChange={(e) => u('hp', e.target.value)}
                placeholder="cth. 081234xxxxxx"
                style={kpInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 })} />
            </KpField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <KpField label="Kategori">
              <KpSelect value={form.kategori} onChange={(v) => u('kategori', v)}
                options={[
                  ['Transaksi Gagal', 'Transaksi Gagal'],
                  ['Saldo Tidak Masuk', 'Saldo Tidak Masuk'],
                  ['Produk Tidak Terkirim', 'Produk Tidak Terkirim'],
                  ['Lainnya', 'Lainnya'],
                ]} />
            </KpField>
            <KpField label="Prioritas">
              <KpSelect value={form.prioritas} onChange={(v) => u('prioritas', v)}
                options={[['tinggi','Tinggi'],['sedang','Sedang'],['rendah','Rendah']]} />
            </KpField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <KpField label="Channel Masuk">
              <KpSelect value={form.channel} onChange={(v) => u('channel', v)}
                options={[['wa','WhatsApp'],['telepon','Telepon'],['walkin','Walk-in / Tatap Muka'],['email','Email']]} />
            </KpField>
            <KpField label="ID Transaksi Terkait (opsional)">
              <input value={form.txTerkait} onChange={(e) => u('txTerkait', e.target.value)}
                placeholder="cth. TXN-9912832"
                style={kpInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </KpField>
          </div>

          <KpField label="Deskripsi Keluhan">
            <textarea value={form.deskripsi} onChange={(e) => u('deskripsi', e.target.value)}
              placeholder="Tuliskan detail keluhan yang disampaikan user…"
              rows={4}
              style={kpInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
          </KpField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={kpSecondaryBtn()}>Batal</button>
          <button onClick={handleSave} style={{ ...kpPrimaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> Buat Tiket
          </button>
        </div>
      </div>
    </div>
  );
}

const CHANNEL_LABEL = { wa: 'WhatsApp', telepon: 'Telepon', walkin: 'Walk-in', email: 'Email' };

function KpField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

window.MuurahKomplain = Komplain;

// ════════════════════════════════════════════════════════════════════════════
//   LIVE CHAT (drawer)
// ════════════════════════════════════════════════════════════════════════════
function LiveChat({ ticket }) {
  // Seed messages from the ticket thread, but give each one a stable id + status.
  const [messages, setMessages] = useKpState(() => ticket.thread.map((m, i) => ({
    id: `seed-${ticket.id}-${i}`, who: m.who, who_name: m.who_name,
    t: m.t, msg: m.msg, status: m.who === 'user' ? 'read' : null,
  })));
  const [input, setInput] = useKpState('');
  const [csTyping, setCsTyping] = useKpState(false);
  const [soundOn, setSoundOn] = useKpState(true);
  const [csOnline] = useKpState(true);
  const [notifPerm, setNotifPerm] = useKpState('default');
  const scrollRef = useKpRef(null);
  const inputRef = useKpRef(null);
  const replyTimerRef = useKpRef(null);

  // Notification permission on first mount
  useKpEffect(() => {
    if ('Notification' in window) {
      setNotifPerm(Notification.permission);
      if (Notification.permission === 'default') {
        // ask quietly; ignore rejection
        try { Notification.requestPermission().then(setNotifPerm).catch(() => {}); } catch (e) {}
      }
    }
  }, []);

  // Autoscroll on new messages / typing
  useKpEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, csTyping]);

  // Cleanup pending CS reply on unmount
  useKpEffect(() => () => { if (replyTimerRef.current) clearTimeout(replyTimerRef.current); }, []);

  const quickReplies = [
    'Saya sudah transfer',
    'Tolong dicek ulang',
    'Kapan selesainya?',
    'Terima kasih',
  ];

  function playPing() {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      o.start(); o.stop(ctx.currentTime + 0.2);
      setTimeout(() => { try { ctx.close(); } catch (_) {} }, 300);
    } catch (e) {}
  }

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = 'u-' + Date.now();
    const userMsg = { id, who: 'user', t: nowStr(), msg: trimmed, status: 'sending' };
    setMessages(ms => [...ms, userMsg]);
    setInput('');

    // Progress receipts: sending → sent → delivered → read
    setTimeout(() => setMessages(ms => ms.map(m => m.id === id ? { ...m, status: 'sent' } : m)), 280);
    setTimeout(() => setMessages(ms => ms.map(m => m.id === id ? { ...m, status: 'delivered' } : m)), 700);
    setTimeout(() => setMessages(ms => ms.map(m => m.id === id ? { ...m, status: 'read' } : m)), 1500);

    // Schedule CS reply
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    replyTimerRef.current = setTimeout(async () => {
      setCsTyping(true);
      let reply = '';
      try {
        const ctx = ticket.thread.concat(messages).slice(-6).map(m =>
          `${m.who === 'user' ? ticket.user : 'CS'}: ${m.msg || m}`
        ).join('\n');
        const prompt = `Kamu adalah Dimas Pratama, agen Customer Service di muurah.com (platform PPOB Indonesia).
Tiket #${ticket.id} · Kategori: ${ticket.kategori}
Keluhan awal user: ${ticket.deskripsi}

Riwayat singkat:
${ctx}

User barusan menulis: "${trimmed}"

Balas singkat dalam Bahasa Indonesia (1–2 kalimat, maks 30 kata), empati, profesional, dan spesifik untuk keluhannya. Jangan sapa "Halo Kak" jika ini lanjutan percakapan. Jangan pakai emoji.`;
        reply = await window.claude.complete(prompt);
        reply = (reply || '').trim();
        if (!reply) throw new Error('empty');
      } catch (e) {
        const canned = [
          'Mohon ditunggu sebentar ya kak, kami sedang cek ke sistem biller.',
          'Baik kak, saya eskalasi ke tim teknis sekarang juga.',
          'Terima kasih konfirmasinya, kami proses dalam 1×24 jam kerja.',
          'Kami sudah catat ya kak, update status akan dikirim via notifikasi.',
        ];
        reply = canned[Math.floor(Math.random() * canned.length)];
      }
      setCsTyping(false);
      const csMsg = {
        id: 'cs-' + Date.now(), who: 'cs', who_name: 'Dimas Pratama',
        t: nowStr(), msg: reply, status: null,
      };
      setMessages(ms => [...ms, csMsg]);
      playPing();
      // Browser notification if window not focused
      if (notifPerm === 'granted' && document.visibilityState !== 'visible') {
        try { new Notification('Balasan baru · ' + ticket.id, { body: reply, silent: !soundOn }); } catch (e) {}
      }
    }, 1600 + Math.random() * 1400);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  // Group consecutive messages by time period (Pagi/Siang/Sore/Malam)
  const grouped = [];
  let cur = null;
  messages.forEach((m) => {
    const period = periodLabel(m.t);
    if (!cur || cur.period !== period) {
      cur = { period, msgs: [m] };
      grouped.push(cur);
    } else {
      cur.msgs.push(m);
    }
  });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: '#FAF8FF', border: '1px solid #E0D9F5',
      borderRadius: 12, overflow: 'hidden',
    }}>
      {/* Status header */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid #E0D9F5',
        background: '#FFFFFF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: csOnline ? '#16A34A' : '#9085AE',
            boxShadow: csOnline ? '0 0 0 3px rgba(22,163,74,0.2)' : 'none',
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1228' }}>
            {csOnline ? 'Online' : 'Away'}
          </span>
          <span style={{ fontSize: 11, color: '#9085AE' }}>· avg respon 2 menit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {notifPerm === 'granted' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, color: '#16A34A', fontWeight: 600,
            }}>
              <Icons.check size={10} strokeWidth={3} /> Push aktif
            </span>
          )}
          <button onClick={() => setSoundOn(s => !s)} title={soundOn ? 'Matikan suara' : 'Nyalakan suara'}
            style={{
              width: 30, height: 30, border: 0, borderRadius: 8,
              background: soundOn ? '#EDE8FF' : 'transparent',
              color: soundOn ? '#4A2D8C' : '#9085AE',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 130ms ease',
            }}>
            {soundOn ? <Icons.bell size={14} /> : <BellOffIcon size={14} />}
          </button>
        </div>
      </div>

      {/* Message stream */}
      <div ref={scrollRef} style={{
        padding: '14px', maxHeight: 340, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {grouped.length === 0 && !csTyping && (
          <div style={{ textAlign: 'center', color: '#9085AE', fontSize: 12, padding: '24px 0' }}>
            Belum ada percakapan. Mulai chat dengan user.
          </div>
        )}
        {grouped.map((g, gi) => (
          <React.Fragment key={gi}>
            <PeriodSeparator label={g.period} />
            {g.msgs.map((m) => <LiveBubble key={m.id} msg={m} ticket={ticket} />)}
          </React.Fragment>
        ))}
        {csTyping && <TypingIndicator ticket={ticket} />}
      </div>

      {/* Quick reply chips */}
      <div style={{
        padding: '8px 12px', display: 'flex', gap: 6, overflowX: 'auto',
        borderTop: '1px solid #E0D9F5', background: '#FFFFFF',
        scrollbarWidth: 'thin',
      }}>
        {quickReplies.map((q) => (
          <button key={q} onClick={() => { setInput(q); inputRef.current && inputRef.current.focus(); }}
            style={{
              border: '1px solid #C5B8EF', background: '#FFFFFF', color: '#4A2D8C',
              padding: '5px 11px', borderRadius: 20,
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 130ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EDE8FF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
          >{q}</button>
        ))}
      </div>

      {/* Input area */}
      <div style={{
        padding: '10px 12px', background: '#FFFFFF',
        borderTop: '1px solid #E0D9F5',
        display: 'flex', gap: 8, alignItems: 'flex-end',
      }}>
        <button title="Lampirkan screenshot" style={{
          width: 38, height: 38, border: 0, borderRadius: 10,
          background: '#F0EBFF', color: '#4A2D8C', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'background 130ms ease',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#E0D9F5'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#F0EBFF'}
        >
          <PaperclipIcon size={15} />
        </button>
        <textarea ref={inputRef} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder="Ketik pesan…"
          style={{
            flex: 1, background: '#F0EBFF', border: '1px solid transparent',
            borderRadius: 10, padding: '9px 12px',
            fontSize: 13, color: '#1A1228', outline: 'none',
            fontFamily: 'inherit', resize: 'none',
            minHeight: 38, maxHeight: 100, lineHeight: 1.4,
            transition: 'border-color 130ms ease',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#4A2D8C'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'} />
        <button onClick={() => send(input)} disabled={!input.trim()}
          title="Kirim (Enter)"
          style={{
            width: 38, height: 38, border: 0, borderRadius: 10,
            background: input.trim() ? '#4A2D8C' : '#C5B8EF',
            color: '#FFFFFF', cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'background 130ms ease',
          }}>
          <SendIcon size={15} />
        </button>
      </div>
    </div>
  );
}

function LiveBubble({ msg, ticket }) {
  const isUser = msg.who === 'user';
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 8, alignItems: 'flex-end',
      animation: 'muurah-msg-in 220ms ease',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: isUser ? `linear-gradient(135deg, ${ticket.av[0]} 0%, ${ticket.av[1]} 100%)` : '#4A2D8C',
        color: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 10, flexShrink: 0,
      }}>{isUser ? ticket.inisial : 'DP'}</div>
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '9px 13px',
          background: isUser ? '#EDE8FF' : '#FFFFFF',
          border: isUser ? '1px solid transparent' : '1px solid #E0D9F5',
          color: '#1A1228',
          borderRadius: 12,
          borderTopRightRadius: isUser ? 4 : 12,
          borderTopLeftRadius: isUser ? 12 : 4,
          fontSize: 13, lineHeight: 1.5,
          boxShadow: '0 1px 2px rgba(26,18,40,0.04)',
        }}>{msg.msg}</div>
        <div style={{
          fontSize: 10, color: '#9085AE',
          marginTop: 4,
          display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
          alignItems: 'center', gap: 5,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span>{isUser ? ticket.user.split(' ')[0] : (msg.who_name || 'Dimas Pratama')} (CS)·{msg.t}</span>
          {isUser && <ReadReceipt status={msg.status} />}
        </div>
      </div>
    </div>
  );
}

function ReadReceipt({ status }) {
  if (!status || status === 'sending') {
    return (
      <span title="Mengirim" style={{ display: 'inline-flex', color: '#9085AE' }}>
        <span className="muurah-spin" style={{
          width: 9, height: 9, borderRadius: '50%',
          border: '1.5px solid currentColor', borderTopColor: 'transparent',
        }} />
      </span>
    );
  }
  if (status === 'sent') return <TickIcon count={1} color="#9085AE" title="Terkirim" />;
  if (status === 'delivered') return <TickIcon count={2} color="#9085AE" title="Sampai" />;
  if (status === 'read') return <TickIcon count={2} color="#0369A1" title="Dibaca" />;
  return null;
}

function TickIcon({ count, color, title }) {
  return (
    <span title={title} style={{ display: 'inline-flex', color }}>
      <svg width={count === 2 ? 14 : 10} height="9" viewBox={count === 2 ? '0 0 14 9' : '0 0 10 9'} fill="none">
        <path d="M1 5l2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {count === 2 && <path d="M5 5l2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </span>
  );
}

function TypingIndicator({ ticket }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', animation: 'muurah-msg-in 220ms ease' }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', background: '#4A2D8C',
        color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 10, flexShrink: 0,
      }}>DP</div>
      <div>
        <div style={{
          padding: '10px 14px',
          background: '#FFFFFF', border: '1px solid #E0D9F5',
          borderRadius: 12, borderTopLeftRadius: 4,
          display: 'inline-flex', gap: 4, alignItems: 'center',
        }}>
          <Dot delay="0s" /><Dot delay="0.18s" /><Dot delay="0.36s" />
        </div>
        <div style={{
          fontSize: 10, color: '#4A2D8C', fontWeight: 600,
          marginTop: 4, fontFamily: 'JetBrains Mono, monospace',
        }}>
          Dimas Pratama sedang mengetik…
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span style={{
      width: 6, height: 6, borderRadius: '50%', background: '#9085AE',
      animation: 'muurah-typing 1.2s ease-in-out infinite',
      animationDelay: delay,
      display: 'inline-block',
    }} />
  );
}

function PeriodSeparator({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
      <span style={{ flex: 1, height: 1, background: '#E0D9F5' }} />
      <span style={{
        fontSize: 10, fontWeight: 700, color: '#9085AE',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: '#E0D9F5' }} />
    </div>
  );
}

// inline icons not in Icons
function BellOffIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14M18 8a6 6 0 0 0-9.33-5"/><path d="M1 1l22 22"/>
    </svg>
  );
}
function PaperclipIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}
function SendIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>
    </svg>
  );
}

function nowStr() {
  const d = new Date();
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}
function periodLabel(hm) {
  const h = parseInt((hm || '12:00').split(':')[0], 10);
  if (h < 11) return 'Pagi';
  if (h < 15) return 'Siang';
  if (h < 18) return 'Sore';
  return 'Malam';
}
