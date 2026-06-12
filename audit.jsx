// audit.jsx — Audit Log Sistem screen
const { useState: useAdState } = React;

const AUDIT_ROWS = [
  { waktu: '19 Mei 2026 · 14:42:18', user: 'Dimas Pratama', role: 'Admin Operasional', roleTone: 'lime',
    aksi: 'PRODUCT_UPDATE',
    detail: 'Mengubah harga jual TSEL-PUL-50 dari Rp 50.250 → Rp 50.500',
    ip: '110.139.42.18' },
  { waktu: '19 Mei 2026 · 14:38:02', user: 'Sari Indriani', role: 'Finance', roleTone: 'green',
    aksi: 'REPORT_EXPORT',
    detail: 'Mengunduh Laporan Keuangan 1–19 Mei 2026 (PDF)',
    ip: '110.139.42.22' },
  { waktu: '19 Mei 2026 · 14:32:45', user: 'Dimas Pratama', role: 'Admin Operasional', roleTone: 'lime',
    aksi: 'USER_SUSPEND',
    detail: 'Suspend user Maya Sari (U-00042308) — alasan: aktivitas mencurigakan',
    ip: '110.139.42.18' },
  { waktu: '19 Mei 2026 · 14:21:09', user: 'Andre Wijaya', role: 'CS', roleTone: 'gold',
    aksi: 'TX_REFUND',
    detail: 'Memproses refund TXN-9912832 sebesar Rp 96.000',
    ip: '110.139.42.31' },
  { waktu: '19 Mei 2026 · 13:55:14', user: 'Dimas Pratama', role: 'Admin Operasional', roleTone: 'lime',
    aksi: 'RBAC_UPDATE',
    detail: 'Menambah permission "Reproses / Refund Transaksi" untuk role CS',
    ip: '110.139.42.18' },
  { waktu: '19 Mei 2026 · 13:40:27', user: 'Sari Indriani', role: 'Finance', roleTone: 'green',
    aksi: 'RECON_APPROVE',
    detail: 'Menyetujui hasil rekonsiliasi 18 Mei 2026 (Supplier B) — 248 transaksi cocok',
    ip: '110.139.42.22' },
  { waktu: '19 Mei 2026 · 12:08:51', user: 'Adi Rahmawan', role: 'Super Admin', roleTone: 'purple',
    aksi: 'LIMIT_UPDATE',
    detail: 'Mengubah Limit Bulanan: Rp 15.000.000 → Rp 20.000.000',
    ip: '110.139.42.10' },
  { waktu: '19 Mei 2026 · 11:47:33', user: 'SYSTEM', role: 'SYSTEM', roleTone: 'red', isSystem: true,
    aksi: 'AUTH_FAILED',
    detail: '3× percobaan login gagal untuk budi.raharjo@gmail.com — IP diblok 15 menit',
    ip: '36.81.122.45' },
];

function AuditLog() {
  const { Card } = window.MuurahShell;
  const { DatePickerButton, formatTglID } = window.MuurahGlobal;
  const [query, setQuery] = useAdState('');
  const [roleF, setRoleF] = useAdState('Semua');
  const [aksiF, setAksiF] = useAdState('Semua');
  const [tgl, setTgl] = useAdState('2026-05-19');

  const filtered = AUDIT_ROWS.filter(r => {
    if (roleF !== 'Semua' && r.role !== roleF) return false;
    if (aksiF !== 'Semua') {
      const prefix = aksiF.replace('_*', '');
      if (!r.aksi.startsWith(prefix)) return false;
    }
    if (tgl && !r.waktu.startsWith(formatTglID(tgl))) return false;
    if (query && !`${r.user} ${r.aksi} ${r.detail} ${r.ip}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function reset() {
    setQuery(''); setRoleF('Semua'); setAksiF('Semua'); setTgl('2026-05-19');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Audit Log Sistem
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>4.891</span> entri tercatat · update real-time
          </div>
        </div>
        <button onClick={() => window.muurahToast('Mengekspor audit log\u2026', 'info')} style={adSecondaryBtn()}>
          <Icons.download size={15} /> Export Log
        </button>
      </div>

      {/* Info banner */}
      <div style={{
        background: '#EDE8FF', borderLeft: '4px solid #4A2D8C',
        borderRadius: 10, padding: '14px 18px',
        display: 'flex', gap: 14, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: '#FFFFFF', color: '#4A2D8C',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icons.shieldlock size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>
            Semua aktivitas admin tercatat di sini.
          </div>
          <div style={{ fontSize: 12, color: '#574872', marginTop: 2, lineHeight: 1.55 }}>
            Log bersifat <b style={{ color: '#4A2D8C' }}>immutable</b> — tidak dapat dimodifikasi atau dihapus oleh siapapun, termasuk Super Admin.
            Retensi minimum 365 hari sesuai kebijakan compliance.
          </div>
        </div>
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
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari user, aksi, detail, atau IP…"
            style={adInputStyle({ paddingLeft: 36, width: '100%' })} />
        </div>
        <AdSelect prefix="Role:" value={roleF} onChange={setRoleF}
          options={['Semua', 'Super Admin', 'Admin Operasional', 'Finance', 'CS', 'SYSTEM']} />
        <AdSelect prefix="Aksi:" value={aksiF} onChange={setAksiF}
          options={['Semua', 'USER_*', 'PRODUCT_*', 'TX_*', 'RBAC_*', 'LIMIT_*', 'AUTH_*', 'REPORT_*', 'RECON_*']} />
        <DatePickerButton value={tgl} onChange={setTgl} />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>{filtered.length} entri</div>
        <button onClick={reset} style={adGhostBtn()}>
          <Icons.x size={13} /> Reset
        </button>
      </div>

      {/* Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...adThStyle, paddingLeft: 24 }}>Waktu</th>
              <th style={adThStyle}>User</th>
              <th style={adThStyle}>Role</th>
              <th style={adThStyle}>Aksi</th>
              <th style={adThStyle}>Detail</th>
              <th style={{ ...adThStyle, paddingRight: 24, textAlign: 'right' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const rowBg = r.isSystem ? '#EDE8FF' : '#FFFFFF';
              const hoverBg = r.isSystem ? '#E5DEF8' : '#FAF8FF';
              return (
                <tr key={i} style={{
                  borderTop: '1px solid #F0EBFF',
                  background: rowBg, transition: 'background 130ms ease',
                  height: 56,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = rowBg}
                >
                  <td style={{ ...adTdStyle, paddingLeft: 24 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5,
                      color: '#574872',
                    }}>{r.waktu}</span>
                  </td>
                  <td style={adTdStyle}>
                    {r.isSystem ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#FCE7E9', color: '#C0001A',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                        fontWeight: 800, letterSpacing: '0.06em',
                        padding: '3px 9px', borderRadius: 6,
                      }}>
                        <Icons.alert size={10} strokeWidth={2.5} />
                        SYSTEM
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: '#F0EBFF', color: '#4A2D8C',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, letterSpacing: '-0.01em',
                        }}>{initialsOf(r.user)}</div>
                        <span style={{ fontWeight: 600, color: '#1A1228' }}>{r.user}</span>
                      </div>
                    )}
                  </td>
                  <td style={adTdStyle}>
                    <RoleChip role={r.role} tone={r.roleTone} />
                  </td>
                  <td style={adTdStyle}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5,
                      fontWeight: 700, color: r.isSystem ? '#C0001A' : '#4A2D8C',
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>{r.aksi}</span>
                  </td>
                  <td style={{ ...adTdStyle, color: '#1A1228', maxWidth: 0 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.detail}
                    </span>
                  </td>
                  <td style={{ ...adTdStyle, paddingRight: 24, textAlign: 'right',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#574872' }}>
                    {r.ip}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer pagination */}
        <div style={{
          padding: '14px 24px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872' }}>
            Menampilkan <b style={{ color: '#1A1228' }}>1–8</b> dari <b style={{ color: '#1A1228' }}>4.891</b> log entries
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button disabled style={adPageBtn(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
            <button style={{ ...adPageBtn(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
            <button style={adPageBtn(false)}>2</button>
            <button style={adPageBtn(false)}>3</button>
            <button style={adPageBtn(false)}>4</button>
            <span style={{ color: '#9085AE', padding: '0 6px', fontSize: 12 }}>…</span>
            <button style={adPageBtn(false)}>612</button>
            <button style={adPageBtn(false)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Role chip ───────────────────────────────────────────────────────────────
function RoleChip({ role, tone }) {
  const tones = {
    purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
    lime:   { bg: '#F4FCE3', fg: '#5B7C12' },
    green:  { bg: '#F0FDF4', fg: '#16A34A' },
    gold:   { bg: '#FEF9EC', fg: '#D4900A' },
    red:    { bg: '#FCE7E9', fg: '#C0001A' },
  };
  const t = tones[tone] || tones.purple;
  if (role === 'SYSTEM') {
    return <span style={{
      display: 'inline-flex', alignItems: 'center',
      color: '#9085AE', fontSize: 11, fontWeight: 500,
      fontFamily: 'JetBrains Mono, monospace',
    }}>—</span>;
  }
  return (
    <span style={{
      background: t.bg, color: t.fg,
      fontSize: 11, fontWeight: 700, padding: '4px 10px',
      borderRadius: 20, whiteSpace: 'nowrap',
    }}>{role}</span>
  );
}

function initialsOf(name) {
  return name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function adInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}
function AdSelect({ value, onChange, options, prefix }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        ...adInputStyle({}), appearance: 'none',
        paddingLeft: prefix ? 60 : 12, paddingRight: 30,
        fontWeight: 500, cursor: 'pointer', minWidth: 140,
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
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
function adDateBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#F0EBFF', border: '1px solid transparent',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, color: '#1A1228',
    fontFamily: 'inherit', cursor: 'pointer',
  };
}
function adSecondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
    transition: 'background 130ms ease',
  };
}
function adGhostBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'transparent', color: '#574872', border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function adPageBtn(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}
const adThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const adTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

window.MuurahAudit = AuditLog;
