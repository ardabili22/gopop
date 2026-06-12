// pengguna.jsx — Manajemen Pengguna screen
const { useState: usePgState, useEffect: usePgEffect } = React;

// Realistic user data with deterministic avatar palettes
const USER_ROWS = [
  {
    id: 'U-00041823',
    nama: 'Budi Raharjo',
    inisial: 'BR',
    avatar: ['#4A2D8C', '#B23A8E'],
    email: 'budi.raharjo@gmail.com',
    hp: '0812-3456-7890',
    hpMasked: '081234xxxx',
    daftar: '14 Jan 2024',
    txn: 48,
    belanja: 2_340_000,
    saldo: 125_000,
    status: 'aktif',
    tipe: 'Personal',
    verified: true,
    lastActive: '19 Mei 2026',
    history: [
      { p: 'Pulsa Telkomsel 50.000', t: '19 Mei · 14:32', s: 'sukses' },
      { p: 'Token PLN 100.000',      t: '17 Mei · 09:14', s: 'sukses' },
      { p: 'XL Paket Data 10 GB',    t: '15 Mei · 16:55', s: 'gagal' },
    ],
  },
  {
    id: 'U-00041902',
    nama: 'Sri Wahyuni',
    inisial: 'SW',
    avatar: ['#C0001A', '#F5793B'],
    email: 'sri.wahyuni88@yahoo.com',
    hp: '0856-1234-5678',
    hpMasked: '085612xxxx',
    daftar: '22 Feb 2024',
    txn: 124,
    belanja: 5_820_000,
    saldo: 540_000,
    status: 'aktif',
    tipe: 'Reseller',
    verified: true,
    lastActive: '19 Mei 2026',
    history: [
      { p: 'Pulsa Indosat 25.000', t: '19 Mei · 13:48', s: 'sukses' },
      { p: 'GoPay 200.000',        t: '18 Mei · 20:11', s: 'sukses' },
      { p: 'BPJS Kesehatan',       t: '14 Mei · 08:02', s: 'sukses' },
    ],
  },
  {
    id: 'U-00042055',
    nama: 'Andika Pratama',
    inisial: 'AP',
    avatar: ['#16A34A', '#5B7C12'],
    email: 'andika.p@outlook.com',
    hp: '0817-9876-5432',
    hpMasked: '081798xxxx',
    daftar: '03 Mar 2024',
    txn: 89,
    belanja: 3_540_000,
    saldo: 78_500,
    status: 'aktif',
    tipe: 'Personal',
    verified: true,
    lastActive: '18 Mei 2026',
    history: [
      { p: 'Mobile Legends 172 Diamond', t: '18 Mei · 22:17', s: 'sukses' },
      { p: 'Free Fire 355 Diamond',      t: '12 Mei · 21:04', s: 'sukses' },
      { p: 'Pulsa XL 50.000',            t: '08 Mei · 19:30', s: 'pending' },
    ],
  },
  {
    id: 'U-00042308',
    nama: 'Maya Sari',
    inisial: 'MS',
    avatar: ['#D4900A', '#D97706'],
    email: 'maya.sari@gmail.com',
    hp: '0813-2233-4455',
    hpMasked: '081322xxxx',
    daftar: '18 Apr 2024',
    txn: 12,
    belanja: 480_000,
    saldo: 250_000,
    status: 'suspended',
    tipe: 'Personal',
    verified: true,
    lastActive: '07 Mei 2026',
    history: [
      { p: 'Token PLN 200.000', t: '07 Mei · 11:22', s: 'sukses' },
      { p: 'Pulsa Telkomsel 100.000', t: '02 Mei · 17:08', s: 'gagal' },
      { p: 'Paket Tri 8 GB', t: '28 Apr · 09:40', s: 'sukses' },
    ],
  },
  {
    id: 'U-00042419',
    nama: 'Joko Susilo',
    inisial: 'JS',
    avatar: ['#4A2D8C', '#7B5BC0'],
    email: 'joko.susilo@gmail.com',
    hp: '0852-7766-5544',
    hpMasked: '085277xxxx',
    daftar: '02 Mei 2026',
    txn: 6,
    belanja: 75_500,
    saldo: 15_000,
    status: 'belum_verifikasi',
    tipe: 'Personal',
    verified: false,
    lastActive: '17 Mei 2026',
    history: [
      { p: 'Pulsa Tri 20.000',     t: '17 Mei · 10:11', s: 'sukses' },
      { p: 'GoPay 50.000',         t: '12 Mei · 14:33', s: 'sukses' },
      { p: 'Pulsa Telkomsel 25.000', t: '05 Mei · 18:21', s: 'sukses' },
    ],
  },
];

function Pengguna() {
  const { Card } = window.MuurahShell;
  const [selected, setSelected] = usePgState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Manajemen Pengguna
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>12.483</span> user terdaftar
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
            <input placeholder="Cari nama, nomor HP, email…"
              style={pgInputStyle({ paddingLeft: 36, width: '100%' })} />
          </div>
          <PgSelect prefix="Status:" defaultLabel="Semua"
            options={['Semua', 'Aktif', 'Suspended', 'Belum Verifikasi']} />
          <button onClick={() => window.muurahToast('Mengekspor data pengguna…', 'info')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
            height: 38, padding: '0 16px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
            transition: 'background 130ms ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F0EBFF'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
          >
            <Icons.download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...pgThStyle, paddingLeft: 20, width: 56 }}></th>
              <th style={pgThStyle}>Nama</th>
              <th style={pgThStyle}>No. HP</th>
              <th style={pgThStyle}>Tgl Daftar</th>
              <th style={{ ...pgThStyle, textAlign: 'right' }}>Total Transaksi</th>
              <th style={{ ...pgThStyle, textAlign: 'right' }}>Saldo</th>
              <th style={pgThStyle}>Status</th>
              <th style={{ ...pgThStyle, textAlign: 'right', paddingRight: 20 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {USER_ROWS.map((u) => {
              const muted = u.status === 'suspended';
              return (
                <tr key={u.id} onClick={() => setSelected(u)}
                  style={{
                    borderTop: '1px solid #F0EBFF', height: 64,
                    background: '#FFFFFF', cursor: 'pointer',
                    opacity: muted ? 0.65 : 1,
                    transition: 'background 130ms ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <td style={{ ...pgTdStyle, paddingLeft: 20, paddingRight: 0 }}>
                    <Avatar inisial={u.inisial} colors={u.avatar} size={32} />
                  </td>
                  <td style={pgTdStyle}>
                    <div style={{ fontWeight: 600, color: '#1A1228' }}>{u.nama}</div>
                    <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{u.id}</div>
                  </td>
                  <td style={{ ...pgTdStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' }}>{u.hp}</td>
                  <td style={{ ...pgTdStyle, color: '#574872' }}>{u.daftar}</td>
                  <td style={{ ...pgTdStyle, textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>{u.txn}</div>
                    <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>transaksi</div>
                  </td>
                  <td style={{ ...pgTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                    Rp {u.saldo.toLocaleString('id-ID')}
                  </td>
                  <td style={pgTdStyle}>
                    <PgStatusPill status={u.status} />
                  </td>
                  <td style={{ ...pgTdStyle, textAlign: 'right', paddingRight: 20 }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => setSelected(u)} style={pgGhostBtn('#4A2D8C')}>Detail</button>
                      {u.status === 'aktif' && (
                        <button onClick={() => window.muurahConfirm({
                          title: 'Suspend akun ' + u.nama + '?',
                          body: 'User tidak akan bisa login dan semua transaksi pending akan dibatalkan. Bisa diaktifkan kembali kapan saja.',
                          confirmLabel: 'Suspend',
                          danger: true,
                          onConfirm: () => window.muurahToast('Akun ' + u.nama + ' telah di-suspend', 'success'),
                        })} style={pgGhostBtn('#C0001A')}>Suspend</button>
                      )}
                      {(u.status === 'suspended' || u.status === 'belum_verifikasi') && (
                        <button onClick={() => window.muurahToast('Akun ' + u.nama + ' diaktifkan kembali', 'success')} style={pgGhostBtn('#16A34A')}>Aktifkan</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div style={{
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872' }}>
            Menampilkan <b style={{ color: '#1A1228' }}>1–5</b> dari <b style={{ color: '#1A1228' }}>12.483</b> pengguna
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button disabled style={pgPageBtn(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
            <button style={{ ...pgPageBtn(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
            <button style={pgPageBtn(false)}>2</button>
            <button style={pgPageBtn(false)}>3</button>
            <span style={{ color: '#9085AE', padding: '0 6px', fontSize: 12 }}>…</span>
            <button style={pgPageBtn(false)}>2.497</button>
            <button style={pgPageBtn(false)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
      </Card>

      {selected && <UserDrawer user={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ inisial, colors, size = 32, ring = false }) {
  const [c1, c2] = colors;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
      color: '#FFFFFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, letterSpacing: '-0.02em',
      boxShadow: `0 2px 6px ${c1}33`,
      border: ring ? '3px solid #FFFFFF' : 0,
      flexShrink: 0,
    }}>{inisial}</div>
  );
}

// ─── Status pill ─────────────────────────────────────────────────────────────
function PgStatusPill({ status }) {
  const map = {
    aktif:             { bg: '#F0FDF4', fg: '#16A34A', label: 'Aktif' },
    suspended:         { bg: '#FCE7E9', fg: '#C0001A', label: 'Suspended' },
    belum_verifikasi:  { bg: '#FFFBEB', fg: '#D97706', label: 'Belum Verifikasi' },
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

// ─── Drawer ──────────────────────────────────────────────────────────────────
function UserDrawer({ user, onClose }) {
  usePgEffect(() => {
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
          background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 1,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
            Detail Pengguna
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Identity hero */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar inisial={user.inisial} colors={user.avatar} size={48} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1228', letterSpacing: '-0.01em' }}>
                {user.nama}
              </div>
              <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                {user.hpMasked}
              </div>
            </div>
            <PgStatusPill status={user.status} />
          </div>

          {/* Info Akun */}
          <PgSection label="Info Akun">
            <PgKV k="Tgl Daftar" v={user.daftar} />
            <PgKV k="Email" v={user.email} />
            <PgKV k="Tipe Akun" v={user.tipe} />
            <PgKV k="Verifikasi" v={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: user.verified ? '#16A34A' : '#D97706', fontWeight: 700 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: user.verified ? '#F0FDF4' : '#FFFBEB',
                  border: `1.5px solid ${user.verified ? '#16A34A' : '#D97706'}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10,
                }}>{user.verified ? '✓' : '!'}</span>
                {user.verified ? 'Terverifikasi' : 'Belum verifikasi'}
              </span>
            } />
          </PgSection>

          {/* Statistik 2x2 */}
          <PgSection label="Statistik">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <MiniStat label="Total Transaksi" value={user.txn.toLocaleString('id-ID')} unit="txn" />
              <MiniStat label="Total Belanja" value={`Rp ${user.belanja.toLocaleString('id-ID')}`} />
              <MiniStat label="Saldo Aktif" value={`Rp ${user.saldo.toLocaleString('id-ID')}`} highlight />
              <MiniStat label="Terakhir Aktif" value={user.lastActive} />
            </div>
          </PgSection>

          {/* Riwayat Terakhir */}
          <PgSection label="Riwayat Terakhir">
            <div style={{
              background: '#FFFFFF', border: '1px solid #E0D9F5',
              borderRadius: 10, overflow: 'hidden',
            }}>
              {user.history.map((h, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto',
                  alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderTop: i === 0 ? 0 : '1px solid #F0EBFF',
                  fontSize: 12,
                }}>
                  <span style={{ color: '#1A1228', fontWeight: 500 }}>{h.p}</span>
                  <span style={{ color: '#9085AE', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{h.t}</span>
                  <MiniStatusPill status={h.s} />
                </div>
              ))}
            </div>
          </PgSection>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto', padding: '14px 20px',
          borderTop: '1px solid #E0D9F5', background: '#FFFFFF',
          position: 'sticky', bottom: 0,
          display: 'flex', gap: 8,
        }}>
          <button onClick={() => window.muurahConfirm({
            title: 'Reset PIN untuk ' + user.nama + '?',
            body: 'PIN baru akan di-generate dan dikirim via SMS ke ' + user.hp + '.',
            confirmLabel: 'Reset PIN',
            onConfirm: () => window.muurahToast('PIN berhasil direset, SMS terkirim ke ' + user.hp, 'success'),
          })} style={{
            flex: 1, height: 38, borderRadius: 10,
            background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          }}>Reset PIN</button>
          <button onClick={() => {
            const amt = window.prompt('Top-up saldo untuk ' + user.nama + ' (Rp)', '100000');
            if (amt && /^\d+$/.test(amt)) {
              window.muurahToast('Top-up Rp ' + parseInt(amt).toLocaleString('id-ID') + ' ke ' + user.nama + ' berhasil', 'success');
            }
          }} style={{
            flex: 1, height: 38, borderRadius: 10,
            background: '#4A2D8C', color: '#FFFFFF', border: 0,
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 130ms ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3A2370'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4A2D8C'}
          >Top-up Saldo</button>
          <button onClick={() => window.muurahConfirm({
            title: (user.status === 'suspended' ? 'Aktifkan' : 'Suspend') + ' akun ' + user.nama + '?',
            body: user.status === 'suspended'
              ? 'User akan bisa login dan bertransaksi kembali setelah verifikasi ulang.'
              : 'User tidak akan bisa login. Bisa diaktifkan kembali kapan saja.',
            confirmLabel: user.status === 'suspended' ? 'Aktifkan' : 'Suspend',
            danger: user.status !== 'suspended',
            onConfirm: () => {
              onClose();
              window.muurahToast(
                'Akun ' + user.nama + ' · ' + (user.status === 'suspended' ? 'aktif kembali' : 'di-suspend'),
                'success'
              );
            },
          })} style={{
            flex: 1, height: 38, borderRadius: 10,
            background: '#FCE7E9', color: '#C0001A', border: '1px solid transparent',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            transition: 'all 130ms ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#C0001A'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FCE7E9'; e.currentTarget.style.color = '#C0001A'; }}
          >
            {user.status === 'suspended' ? 'Aktifkan Akun' : 'Suspend Akun'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PgSection({ label, children }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#9085AE',
        letterSpacing: '0.6px', textTransform: 'uppercase',
        marginBottom: 10,
      }}>{label}</div>
      {children}
    </div>
  );
}

function PgKV({ k, v }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: '1px dashed #F0EBFF',
      gap: 12,
    }}>
      <span style={{ fontSize: 12, color: '#9085AE', fontWeight: 500 }}>{k}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1228', textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function MiniStat({ label, value, unit, highlight }) {
  return (
    <div style={{
      background: highlight ? '#F4FCE3' : '#F0EBFF',
      border: highlight ? '1px solid #DBEFAE' : '1px solid transparent',
      borderRadius: 10, padding: 12,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: highlight ? '#5B7C12' : '#574872',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
          fontSize: 16, color: '#1A1228', letterSpacing: '-0.01em',
        }}>{value}</div>
        {unit && <div style={{ fontSize: 11, color: '#9085AE' }}>{unit}</div>}
      </div>
    </div>
  );
}

function MiniStatusPill({ status }) {
  const map = {
    sukses:  { bg: '#F0FDF4', fg: '#16A34A', label: 'Sukses', dot: '●' },
    gagal:   { bg: '#FCE7E9', fg: '#C0001A', label: 'Gagal',  dot: '✕' },
    pending: { bg: '#FFFBEB', fg: '#D97706', label: 'Pending', dot: '○' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.fg, fontSize: 10, fontWeight: 700,
      borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 9, lineHeight: 1 }}>{s.dot}</span>
      {s.label}
    </span>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function pgInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}

function PgSelect({ defaultLabel, options, prefix }) {
  return (
    <div style={{ position: 'relative' }}>
      <select defaultValue={defaultLabel} style={{
        ...pgInputStyle({}), appearance: 'none',
        paddingLeft: prefix ? 60 : 12, paddingRight: 30,
        fontWeight: 500, cursor: 'pointer', minWidth: 160,
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {prefix && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9085AE', fontWeight: 500, pointerEvents: 'none' }}>
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

function pgGhostBtn(color) {
  return {
    background: 'transparent', border: '1px solid transparent',
    color: color, fontSize: 12, fontWeight: 600,
    padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 130ms ease',
  };
}

function pgPageBtn(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}

const pgThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const pgTdStyle = { padding: '12px 14px', verticalAlign: 'middle' };

window.MuurahPengguna = Pengguna;
