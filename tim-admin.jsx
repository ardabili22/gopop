// tim-admin.jsx — Tim & Admin (internal staff accounts) screen
const { useState: useTaState, useEffect: useTaEffect } = React;

// Fallback role list — actual roles come from window.MuurahRolesStore (managed in Role & Akses)
const TA_ROLES_FALLBACK = [
  { id: 'sa', label: 'Super Admin',       tone: 'purple' },
  { id: 'ao', label: 'Admin Operasional', tone: 'lime'   },
  { id: 'fn', label: 'Finance',           tone: 'green'  },
  { id: 'cs', label: 'CS',                tone: 'gold'   },
];
const TA_ROLE_TONES = {
  purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
  lime:   { bg: '#F4FCE3', fg: '#5B7C12' },
  green:  { bg: '#F0FDF4', fg: '#16A34A' },
  gold:   { bg: '#FEF9EC', fg: '#D4900A' },
  coral:  { bg: '#FFF1ED', fg: '#FF6B4A' },
  blue:   { bg: '#EFF6FF', fg: '#3B82F6' },
};

const ADMIN_SEED = [
  { id: 'ADM-0001', nama: 'Adi Rahmawan',   email: 'adi.rahmawan@muurah.com',   role: 'sa', status: 'aktif', lastLogin: '19 Mei 2026 · 12:08' },
  { id: 'ADM-0002', nama: 'Wira Sanjaya',   email: 'wira.sanjaya@muurah.com',   role: 'sa', status: 'aktif', lastLogin: '18 Mei 2026 · 21:40' },
  { id: 'ADM-0003', nama: 'Dimas Pratama',  email: 'dimas.pratama@muurah.com',  role: 'ao', status: 'aktif', lastLogin: '19 Mei 2026 · 14:42' },
  { id: 'ADM-0004', nama: 'Putri Lestari',  email: 'putri.lestari@muurah.com',  role: 'ao', status: 'aktif', lastLogin: '19 Mei 2026 · 09:15' },
  { id: 'ADM-0005', nama: 'Reza Firmansyah',email: 'reza.firmansyah@muurah.com',role: 'ao', status: 'aktif', lastLogin: '17 Mei 2026 · 16:20' },
  { id: 'ADM-0006', nama: 'Sari Indriani',  email: 'sari.indriani@muurah.com',  role: 'fn', status: 'aktif', lastLogin: '19 Mei 2026 · 13:40' },
  { id: 'ADM-0007', nama: 'Bagas Wicaksono',email: 'bagas.wicaksono@muurah.com',role: 'fn', status: 'aktif', lastLogin: '16 Mei 2026 · 10:02' },
  { id: 'ADM-0008', nama: 'Andre Wijaya',   email: 'andre.wijaya@muurah.com',   role: 'cs', status: 'aktif', lastLogin: '19 Mei 2026 · 14:21' },
  { id: 'ADM-0009', nama: 'Citra Maharani', email: 'citra.maharani@muurah.com', role: 'cs', status: 'aktif', lastLogin: '18 Mei 2026 · 22:05' },
  { id: 'ADM-0010', nama: 'Fajar Nugroho',  email: 'fajar.nugroho@muurah.com',  role: 'cs', status: 'suspended', lastLogin: '02 Mei 2026 · 08:40' },
];

function TimAdmin() {
  const { Card } = window.MuurahShell;
  const [admins, setAdmins] = useTaState(ADMIN_SEED);
  const [roleF, setRoleF] = useTaState('semua');
  const [query, setQuery] = useTaState('');
  const [adding, setAdding] = useTaState(false);
  const [roles, setRoles] = useTaState(() => (window.MuurahRolesStore ? window.MuurahRolesStore.get() : TA_ROLES_FALLBACK));

  useTaEffect(() => {
    if (!window.MuurahRolesStore) return;
    return window.MuurahRolesStore.subscribe(setRoles);
  }, []);
  const [editing, setEditing] = useTaState(null);

  const filtered = admins.filter(a => {
    if (roleF !== 'semua' && a.role !== roleF) return false;
    if (query && !`${a.nama} ${a.email}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function saveAdmin(data) {
    if (data.id && admins.some(a => a.id === data.id)) {
      setAdmins(as => as.map(a => a.id === data.id ? { ...a, ...data } : a));
      window.muurahToast('Admin "' + data.nama + '" berhasil diperbarui', 'success');
    } else {
      const newId = 'ADM-' + String(Math.max(0, ...admins.map(a => parseInt(a.id.split('-')[1]))) + 1).padStart(4, '0');
      setAdmins(as => [...as, { ...data, id: newId, status: 'aktif', lastLogin: '—' }]);
      window.muurahToast(
        data.sendInvite
          ? 'Undangan login dikirim ke ' + data.email
          : 'Admin "' + data.nama + '" berhasil ditambahkan',
        'success'
      );
    }
    setAdding(false);
    setEditing(null);
  }
  function toggleStatus(a) {
    const willSuspend = a.status === 'aktif';
    window.muurahConfirm({
      title: (willSuspend ? 'Suspend' : 'Aktifkan') + ' admin "' + a.nama + '"?',
      body: willSuspend ? 'Admin ini tidak akan bisa login ke dashboard sampai diaktifkan kembali.' : 'Admin ini akan bisa login kembali ke dashboard.',
      confirmLabel: willSuspend ? 'Suspend' : 'Aktifkan',
      danger: willSuspend,
      onConfirm: () => {
        setAdmins(as => as.map(x => x.id === a.id ? { ...x, status: willSuspend ? 'suspended' : 'aktif' } : x));
        window.muurahToast('Admin "' + a.nama + '" ' + (willSuspend ? 'disuspend' : 'diaktifkan'), 'success');
      },
    });
  }
  function deleteAdmin(a) {
    window.muurahConfirm({
      title: 'Hapus akun admin "' + a.nama + '"?',
      body: 'Akun ini akan dihapus permanen dan tidak bisa login lagi. Tindakan ini tidak bisa dibatalkan.',
      confirmLabel: 'Hapus Akun', danger: true,
      onConfirm: () => {
        setAdmins(as => as.filter(x => x.id !== a.id));
        window.muurahToast('Admin "' + a.nama + '" dihapus', 'success');
      },
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Tim & Admin
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            Kelola akun staff internal yang punya akses ke dashboard Muurah
          </div>
        </div>
        <button onClick={() => setAdding(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#4A2D8C', color: '#FFFFFF', border: 0,
          height: 38, padding: '0 16px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah Admin
        </button>
      </div>

      {/* Role summary chips */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <TaRoleChip label="Semua" count={admins.length} active={roleF === 'semua'} onClick={() => setRoleF('semua')} tone="purple" />
        {roles.map(r => (
          <TaRoleChip key={r.id} label={r.label} count={admins.filter(a => a.role === r.id).length} active={roleF === r.id} onClick={() => setRoleF(r.id)} tone={r.tone} />
        ))}
      </div>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E0D9F5' }}>
          <div style={{ position: 'relative', maxWidth: 320 }}>
            <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau email…"
              style={{
                background: '#F0EBFF', border: '1px solid transparent', borderRadius: 10,
                height: 38, padding: '0 12px 0 36px', fontSize: 13, color: '#1A1228',
                outline: 'none', fontFamily: 'inherit', width: '100%',
              }} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...taThStyle, paddingLeft: 24 }}>Nama & Email</th>
              <th style={taThStyle}>Role</th>
              <th style={taThStyle}>Status</th>
              <th style={taThStyle}>Terakhir Login</th>
              <th style={{ ...taThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const role = roles.find(r => r.id === a.role) || roles[1];
              const t = TA_ROLE_TONES[role.tone];
              return (
                <tr key={a.id} style={{ borderTop: '1px solid #F0EBFF', height: 64, opacity: a.status === 'suspended' ? 0.6 : 1 }}>
                  <td style={{ ...taTdStyle, paddingLeft: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: t.bg, color: t.fg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 12,
                      }}>{a.nama.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1A1228' }}>{a.nama}</div>
                        <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={taTdStyle}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.fg, background: t.bg, padding: '4px 9px', borderRadius: 6 }}>{role.label}</span>
                  </td>
                  <td style={taTdStyle}>
                    {a.status === 'aktif'
                      ? <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '4px 9px', borderRadius: 6 }}>Aktif</span>
                      : <span style={{ fontSize: 11, fontWeight: 700, color: '#C0001A', background: '#FCE7E9', padding: '4px 9px', borderRadius: 6 }}>Suspended</span>}
                  </td>
                  <td style={{ ...taTdStyle, fontSize: 12, color: '#574872', fontFamily: 'JetBrains Mono, monospace' }}>{a.lastLogin}</td>
                  <td style={{ ...taTdStyle, paddingRight: 24, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => setEditing(a)} style={taGhostBtn('#4A2D8C')}>Edit</button>
                      <button onClick={() => toggleStatus(a)} style={taGhostBtn(a.status === 'aktif' ? '#D97706' : '#16A34A')}>
                        {a.status === 'aktif' ? 'Suspend' : 'Aktifkan'}
                      </button>
                      <button onClick={() => deleteAdmin(a)} style={taGhostBtn('#C0001A')}>Hapus</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>Tidak ada admin yang cocok.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(adding || editing) && (
        <AdminModal admin={editing} roles={roles} onClose={() => { setAdding(false); setEditing(null); }} onSave={saveAdmin} />
      )}
    </div>
  );
}

function TaRoleChip({ label, count, active, onClick, tone }) {
  const t = TA_ROLE_TONES[tone] || TA_ROLE_TONES.purple;
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
      background: active ? t.fg : '#FFFFFF',
      border: active ? '1px solid ' + t.fg : '1px solid #E0D9F5',
      color: active ? '#FFFFFF' : '#574872',
      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
    }}>
      {label}
      <span style={{
        background: active ? 'rgba(255,255,255,0.2)' : t.bg,
        color: active ? '#FFFFFF' : t.fg,
        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
        fontFamily: 'JetBrains Mono, monospace',
      }}>{count}</span>
    </button>
  );
}

// ─── Modal: Tambah / Edit Admin ────────────────────────────────────────────────
function AdminModal({ admin, roles, onClose, onSave }) {
  const [form, setForm] = useTaState(admin ? { ...admin } : { nama: '', email: '', role: 'cs', authMethod: 'invite', password: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.nama.trim() && /^\S+@\S+\.\S+$/.test(form.email) &&
    (admin || form.authMethod === 'invite' || (form.password && form.password.length >= 8));

  useTaEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 520, maxHeight: 'calc(100vh - 80px)',
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tim & Admin</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {admin ? 'Edit Admin' : 'Tambah Admin Baru'}
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
            <TaField label="Nama Lengkap">
              <input value={form.nama} onChange={(e) => u('nama', e.target.value)}
                placeholder="cth. Budi Santoso"
                style={taInputStyle({ width: '100%' })} />
            </TaField>
            <TaField label="Email">
              <input value={form.email} onChange={(e) => u('email', e.target.value)} disabled={!!admin}
                placeholder="nama@muurah.com"
                style={taInputStyle({ width: '100%', opacity: admin ? 0.6 : 1, cursor: admin ? 'not-allowed' : 'text' })} />
            </TaField>
          </div>

          <TaField label="Role">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {roles.map(r => {
                const t = TA_ROLE_TONES[r.tone];
                const active = form.role === r.id;
                return (
                  <button key={r.id} type="button" onClick={() => u('role', r.id)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 12px', borderRadius: 9, cursor: 'pointer',
                    background: active ? t.bg : '#FFFFFF',
                    border: active ? '1.5px solid ' + t.fg : '1px solid #E0D9F5',
                    color: active ? t.fg : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>
                    {active && <Icons.check size={12} strokeWidth={2.8} />} {r.label}
                  </button>
                );
              })}
            </div>
          </TaField>

          {!admin && (
            <TaField label="Cara Login Pertama">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', padding: 10, borderRadius: 10, border: '1px solid ' + (form.authMethod === 'invite' ? '#4A2D8C' : '#E0D9F5'), background: form.authMethod === 'invite' ? '#F0EBFF' : '#FFFFFF' }}>
                  <input type="radio" checked={form.authMethod === 'invite'} onChange={() => u('authMethod', 'invite')} style={{ marginTop: 2 }} />
                  <span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>Kirim Undangan via Email</div>
                    <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>Admin baru akan menerima link untuk membuat password sendiri</div>
                  </span>
                </label>
                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', padding: 10, borderRadius: 10, border: '1px solid ' + (form.authMethod === 'manual' ? '#4A2D8C' : '#E0D9F5'), background: form.authMethod === 'manual' ? '#F0EBFF' : '#FFFFFF' }}>
                  <input type="radio" checked={form.authMethod === 'manual'} onChange={() => u('authMethod', 'manual')} style={{ marginTop: 2 }} />
                  <span style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>Set Password Manual</div>
                    <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, marginBottom: form.authMethod === 'manual' ? 8 : 0 }}>Kamu tentukan password awal, sampaikan langsung ke admin tersebut</div>
                    {form.authMethod === 'manual' && (
                      <input type="text" value={form.password} onChange={(e) => u('password', e.target.value)}
                        placeholder="Minimal 8 karakter"
                        style={taInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
                    )}
                  </span>
                </label>
              </div>
            </TaField>
          )}
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={taSecondaryBtn()}>Batal</button>
          <button onClick={() => {
            if (!isValid) { window.muurahToast('Lengkapi nama, email valid, dan password (min. 8 karakter)', 'error'); return; }
            onSave({ ...form, sendInvite: !admin && form.authMethod === 'invite' });
          }} style={{ ...taPrimaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {admin ? 'Simpan Perubahan' : 'Tambah Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TaField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
function taInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    ...over,
  };
}
function taPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function taSecondaryBtn() {
  return {
    background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
    height: 38, padding: '0 18px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function taGhostBtn(color) {
  return {
    background: 'transparent', color, border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
const taThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const taTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

window.MuurahTimAdmin = TimAdmin;
