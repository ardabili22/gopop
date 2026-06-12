// role-akses.jsx — Role & Akses (permission matrix + role cards) screen

const RA_PERMISSIONS_SEED = [
  { perm: 'Lihat Dashboard',            sa: true,  ao: true,  fn: true,  cs: true  },
  { perm: 'Edit Harga Produk',          sa: true,  ao: true,  fn: false, cs: false },
  { perm: 'Edit HPP',                   sa: true,  ao: false, fn: true,  cs: false },
  { perm: 'Proses Refund',              sa: true,  ao: true,  fn: false, cs: true  },
  { perm: 'Suspend Akun User',          sa: true,  ao: true,  fn: false, cs: true  },
  { perm: 'Export Laporan',             sa: true,  ao: true,  fn: true,  cs: false },
  { perm: 'Kelola Supplier',            sa: true,  ao: false, fn: true,  cs: false },
  { perm: 'Kelola Role & Akses',        sa: true,  ao: false, fn: false, cs: false },
];

const RA_ROLES_SEED = [
  { id: 'sa', label: 'Super Admin',       tone: 'purple', members: 2, desc: 'Akses penuh ke seluruh modul & RBAC. Tidak bisa dihapus.', leads: ['Adi Rahmawan', 'Wira Sanjaya'] },
  { id: 'ao', label: 'Admin Operasional', tone: 'lime',   members: 5, desc: 'Operasional harian: produk, transaksi, refund, suspend.', leads: ['Dimas Pratama', '+4 lainnya'] },
  { id: 'fn', label: 'Finance',           tone: 'green',  members: 3, desc: 'Akses penuh ke keuangan: HPP, rekonsiliasi, laporan.',     leads: ['Sari Indriani', '+2 lainnya'] },
  { id: 'cs', label: 'CS',                tone: 'gold',   members: 8, desc: 'Pendukung pelanggan: refund, suspend, lihat dashboard.',    leads: ['Andre Wijaya', '+7 lainnya'] },
];

const RA_TONES = ['purple', 'lime', 'green', 'gold', 'coral', 'blue'];

function RoleAkses() {
  const { Card } = window.MuurahShell;
  const { useState: useRaState } = React;
  const [roles, setRoles] = useRaState(RA_ROLES_SEED);
  const [permissions, setPermissions] = useRaState(RA_PERMISSIONS_SEED);
  const [creating, setCreating] = useRaState(false);
  const [managing, setManaging] = useRaState(false);
  const [configuring, setConfiguring] = useRaState(null);

  function togglePermission(roleId, permIndex) {
    const role = roles.find(r => r.id === roleId);
    if (role.id === 'sa') {
      window.muurahToast('Permission Super Admin tidak bisa diubah', 'warning');
      return;
    }
    setPermissions(prev => prev.map((p, i) => i === permIndex ? { ...p, [roleId]: !p[roleId] } : p));
    window.muurahToast('Permission "' + permissions[permIndex].perm + '" untuk ' + role.label + ' diperbarui', 'success');
  }

  function handleCreateRole(newRole, checkedPerms) {
    setRoles(prev => [...prev, newRole]);
    setPermissions(prev => prev.map(p => ({ ...p, [newRole.id]: !!checkedPerms[p.perm] })));
    setCreating(false);
    window.muurahToast('Role "' + newRole.label + '" berhasil dibuat', 'success');
  }

  function handleDeleteRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    setConfiguring(null);
    window.muurahConfirm({
      title: 'Hapus role "' + role.label + '"?',
      body: role.members + ' anggota akan dipindahkan ke role default (CS) setelah role ini dihapus.',
      confirmLabel: 'Hapus Role', danger: true,
      onConfirm: () => {
        setRoles(prev => prev.filter(r => r.id !== roleId));
        setPermissions(prev => prev.map(p => { const { [roleId]: _drop, ...rest } = p; return rest; }));
        window.muurahToast('Role "' + role.label + '" berhasil dihapus', 'success');
      },
    });
  }

  function handleUpdateRole(roleId, patch) {
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, ...patch } : r));
  }

  const [newPermLabel, setNewPermLabel] = useRaState('');
  const [renamingPerm, setRenamingPerm] = useRaState(null);

  function addPermission() {
    const label = newPermLabel.trim();
    if (!label) return;
    if (permissions.some(p => p.perm.toLowerCase() === label.toLowerCase())) {
      window.muurahToast('Permission "' + label + '" sudah ada', 'error');
      return;
    }
    const row = { perm: label, sa: true };
    roles.forEach(r => { if (r.id !== 'sa') row[r.id] = false; });
    setPermissions(prev => [...prev, row]);
    setNewPermLabel('');
    window.muurahToast('Permission "' + label + '" ditambahkan — default aktif untuk Super Admin', 'success');
  }
  function renamePermission(index, label) {
    if (!label.trim()) { setRenamingPerm(null); return; }
    setPermissions(prev => prev.map((p, i) => i === index ? { ...p, perm: label.trim() } : p));
    setRenamingPerm(null);
    window.muurahToast('Permission berhasil diperbarui', 'success');
  }
  function deletePermission(index) {
    const label = permissions[index].perm;
    window.muurahConfirm({
      title: 'Hapus permission "' + label + '"?',
      body: 'Permission ini akan dihapus dari matrix dan dari pilihan saat Buat Role Baru untuk semua role.',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setPermissions(prev => prev.filter((_, i) => i !== index));
        window.muurahToast('Permission "' + label + '" dihapus', 'success');
      },
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Role & Akses
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            Atur permission tiap role, lihat anggota tiap role di satu tempat
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={raSecondaryBtn()} onClick={() => setManaging(true)}>
            <Icons.users size={14} /> Kelola Anggota
          </button>
          <button style={raPrimaryBtn()} onClick={() => setCreating(true)}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Buat Role Baru
          </button>
        </div>
      </div>

      {/* Permission matrix */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
              Matrix Permission
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>
              Centang untuk memberikan permission ke role · perubahan tercatat di audit log
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#574872' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={raChip(true)}><Icons.check size={11} strokeWidth={2.8} /></span>
              Diizinkan
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={raChip(false)}>—</span>
              Tidak diizinkan
            </span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...raThStyle, paddingLeft: 24, width: '40%' }}>Permission</th>
              {roles.map((r) => <RaRoleHeader key={r.id} {...r} colWidth={(60 / roles.length) + '%'} />)}
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, i) => (
              <tr key={i} style={{ borderTop: '1px solid #F0EBFF', height: 52,
                transition: 'background 130ms ease',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...raTdStyle, paddingLeft: 24, color: '#1A1228', fontWeight: 500 }}>
                  {renamingPerm === i ? (
                    <input autoFocus defaultValue={p.perm}
                      onBlur={(e) => renamePermission(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') renamePermission(i, e.target.value); if (e.key === 'Escape') setRenamingPerm(null); }}
                      style={{
                        background: '#F0EBFF', border: '1px solid #C5B8EF', borderRadius: 8,
                        height: 30, padding: '0 8px', fontSize: 13, fontWeight: 500,
                        color: '#1A1228', outline: 'none', fontFamily: 'inherit', width: '90%',
                      }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{p.perm}</span>
                      <span style={{ display: 'inline-flex', gap: 2 }}>
                        <button onClick={() => setRenamingPerm(i)} title="Ubah nama" style={raIconGhostBtn()}>
                          <Icons.cog size={12} />
                        </button>
                        <button onClick={() => deletePermission(i)} title="Hapus permission" style={raIconGhostBtn('#C0001A')}>
                          <Icons.x size={12} />
                        </button>
                      </span>
                    </div>
                  )}
                </td>
                {roles.map((r) => (
                  <RaPermCell key={r.id} allowed={!!p[r.id]} onClick={() => togglePermission(r.id, i)} locked={r.id === 'sa'} />
                ))}
              </tr>
            ))}
            <tr style={{ borderTop: '1px solid #F0EBFF', height: 52 }}>
              <td style={{ ...raTdStyle, paddingLeft: 24 }} colSpan={1 + roles.length}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input value={newPermLabel} onChange={(e) => setNewPermLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addPermission(); }}
                    placeholder="Nama permission baru… (cth. Kelola Banner Homepage)"
                    style={{
                      background: '#F0EBFF', border: '1px solid transparent', borderRadius: 8,
                      height: 34, padding: '0 10px', fontSize: 13, color: '#1A1228',
                      outline: 'none', fontFamily: 'inherit', width: 320,
                    }} />
                  <button onClick={addPermission} style={raSecondaryBtn()}>
                    <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Tambah Permission Baru
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{
          padding: '14px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#FAF8FF',
        }}>
          <div style={{ fontSize: 12, color: '#574872', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Icons.clock size={13} style={{ color: '#9085AE' }} />
            Terakhir diubah <b style={{ color: '#1A1228' }}>13:55 WIB</b> oleh Dimas Pratama
          </div>
          <button style={raGhostBtn()}>
            Lihat audit log lengkap <Icons.arrowR size={13} />
          </button>
        </div>
      </Card>

      {/* Role management cards */}
      <div>
        <div style={{
          fontSize: 10, fontWeight: 700, color: '#9085AE',
          letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 10,
        }}>Daftar Role</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${roles.length}, 1fr)`, gap: 16 }}>
          {roles.map((r) => {
            const allowedCount = permissions.filter(p => p[r.id]).length;
            return <RaRoleCard key={r.id} role={r} allowedCount={allowedCount} total={permissions.length} onConfigure={() => setConfiguring(r.id)} />;
          })}
        </div>
      </div>

      {creating && (
        <CreateRoleModal
          permissions={permissions}
          existingIds={roles.map(r => r.id)}
          onClose={() => setCreating(false)}
          onCreate={handleCreateRole}
        />
      )}
      {managing && <ManageMembersModal roles={roles} onClose={() => setManaging(false)} />}
      {configuring && (
        <RoleDetailModal
          role={roles.find(r => r.id === configuring)}
          permissions={permissions}
          onClose={() => setConfiguring(null)}
          onSave={(patch) => { handleUpdateRole(configuring, patch); setConfiguring(null); window.muurahToast('Role berhasil diperbarui', 'success'); }}
          onDelete={() => handleDeleteRole(configuring)}
          onTogglePermission={(permIndex) => togglePermission(configuring, permIndex)}
        />
      )}
    </div>
  );
}

// ─── Role header ─────────────────────────────────────────────────────────────
function RaRoleHeader({ label, tone, members, colWidth }) {
  const tones = {
    purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
    lime:   { bg: '#F4FCE3', fg: '#5B7C12' },
    green:  { bg: '#F0FDF4', fg: '#16A34A' },
    gold:   { bg: '#FEF9EC', fg: '#D4900A' },
    coral:  { bg: '#FFF1ED', fg: '#FF6B4A' },
    blue:   { bg: '#EFF6FF', fg: '#3B82F6' },
  };
  const t = tones[tone] || tones.purple;
  return (
    <th style={{ ...raThStyle, textAlign: 'center', width: colWidth }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <span style={{
          background: t.bg, color: t.fg,
          padding: '2px 9px', borderRadius: 6,
          fontWeight: 700, fontSize: 11, letterSpacing: '0.04em',
        }}>{label}</span>
        <span style={{
          fontSize: 10, color: '#9085AE',
          textTransform: 'none', letterSpacing: 0,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 500,
        }}>{members} user</span>
      </div>
    </th>
  );
}

// ─── Permission cell ─────────────────────────────────────────────────────────
function RaPermCell({ allowed, onClick, locked }) {
  return (
    <td style={{ ...raTdStyle, padding: '8px 14px', textAlign: 'center' }}>
      <span onClick={onClick} title={locked ? 'Permission Super Admin terkunci' : (allowed ? 'Klik untuk cabut izin' : 'Klik untuk berikan izin')} style={{
        ...raChip(allowed),
        cursor: locked ? 'not-allowed' : 'pointer',
        transition: 'transform 100ms ease',
      }}
        onMouseEnter={(e) => { if (!locked) e.currentTarget.style.transform = 'scale(1.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {allowed
          ? <Icons.check size={15} strokeWidth={2.8} />
          : <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1 }}>—</span>}
      </span>
    </td>
  );
}

function raChip(allowed) {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 8,
    background: allowed ? '#F0FDF4' : '#F0EBFF',
    color: allowed ? '#16A34A' : '#9085AE',
  };
}

// ─── Role card ───────────────────────────────────────────────────────────────
function RaRoleCard({ role, allowedCount, total, onConfigure }) {
  const tones = {
    purple: { bg: '#EDE8FF', fg: '#4A2D8C', track: '#C5B8EF' },
    lime:   { bg: '#F4FCE3', fg: '#5B7C12', track: '#DBEFAE' },
    green:  { bg: '#F0FDF4', fg: '#16A34A', track: '#86EFAC' },
    gold:   { bg: '#FEF9EC', fg: '#D4900A', track: '#F5D89B' },
    coral:  { bg: '#FFF1ED', fg: '#FF6B4A', track: '#FFD3C4' },
    blue:   { bg: '#EFF6FF', fg: '#3B82F6', track: '#BFDBFE' },
  };
  const t = tones[role.tone] || tones.purple;
  const pct = (allowedCount / total) * 100;
  const isLocked = role.id === 'sa';

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E0D9F5',
      borderRadius: 16, padding: 18,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: 14,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: t.fg }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <span style={{
          background: t.bg, color: t.fg,
          padding: '4px 10px', borderRadius: 8,
          fontWeight: 700, fontSize: 11, letterSpacing: '0.04em',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icons.shieldlock size={11} strokeWidth={2.2} />
          {role.label}
        </span>
        {isLocked && (
          <span title="Tidak bisa dihapus" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 22, height: 22, borderRadius: 6,
            background: '#F0EBFF', color: '#9085AE',
          }}>
            <Icons.shieldlock size={12} />
          </span>
        )}
      </div>

      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
          fontSize: 28, color: '#1A1228', letterSpacing: '-0.02em', lineHeight: 1,
        }}>
          {role.members}
        </div>
        <div style={{ fontSize: 12, color: '#574872', fontWeight: 500, marginTop: 4 }}>anggota aktif</div>
        <div style={{ fontSize: 11, color: '#9085AE', marginTop: 6, lineHeight: 1.5 }}>
          {role.desc}
        </div>
      </div>

      {/* Member chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {role.leads.map((m) => (
          <span key={m} style={{
            fontSize: 10, color: '#574872', background: '#F0EBFF',
            padding: '3px 7px', borderRadius: 6, fontWeight: 600,
          }}>{m}</span>
        ))}
      </div>

      {/* Permission progress */}
      <div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontSize: 11, color: '#574872', marginBottom: 6,
        }}>
          <span style={{ fontWeight: 600 }}>Permissions</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>
            {allowedCount}/{total}
          </span>
        </div>
        <div style={{ height: 6, background: '#F0EBFF', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: t.fg, borderRadius: 4,
            transition: 'width 300ms ease',
          }} />
        </div>
      </div>

      <button onClick={onConfigure} style={{
        marginTop: 4, height: 32, borderRadius: 8,
        background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
        fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        transition: 'background 130ms ease',
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#F0EBFF'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
      >
        <Icons.cog size={12} /> Konfigurasi
      </button>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function raPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function raSecondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function raIconGhostBtn(color) {
  return {
    width: 20, height: 20, border: 0, borderRadius: 6,
    background: 'transparent', color: color || '#9085AE', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0.6, transition: 'opacity 100ms ease',
  };
}

function raGhostBtn(color) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'transparent', color: color || '#4A2D8C', border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
const raThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '14px 14px', background: '#F0EBFF',
};
const raTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

// ─── Field & input helpers ────────────────────────────────────────────────────
function RaField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
function raInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    ...over,
  };
}
const RA_TONE_META = {
  purple: { bg: '#EDE8FF', fg: '#4A2D8C', label: 'Ungu' },
  lime:   { bg: '#F4FCE3', fg: '#5B7C12', label: 'Lime' },
  green:  { bg: '#F0FDF4', fg: '#16A34A', label: 'Hijau' },
  gold:   { bg: '#FEF9EC', fg: '#D4900A', label: 'Gold' },
  coral:  { bg: '#FFF1ED', fg: '#FF6B4A', label: 'Coral' },
  blue:   { bg: '#EFF6FF', fg: '#3B82F6', label: 'Biru' },
};

// ─── Modal shell ───────────────────────────────────────────────────────────────
function RaModalShell({ onClose, eyebrow, title, subtitle, width = 560, children, footer }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width, maxHeight: 'calc(100vh - 80px)',
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{eyebrow}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {children}
        </div>

        {footer && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #E0D9F5',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal: Buat Role Baru ─────────────────────────────────────────────────────
function CreateRoleModal({ permissions, existingIds, onClose, onCreate }) {
  const { useState: useS } = React;
  const [label, setLabel] = useS('');
  const [desc, setDesc] = useS('');
  const [tone, setTone] = useS('blue');
  const [checked, setChecked] = useS(() => {
    const init = {};
    permissions.forEach(p => init[p.perm] = false);
    return init;
  });

  const isValid = label.trim().length > 0;

  function handleCreate() {
    if (!isValid) {
      window.muurahToast('Nama role wajib diisi', 'error');
      return;
    }
    let id = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 4) || 'role';
    let suffix = 1;
    let finalId = id;
    while (existingIds.includes(finalId)) { finalId = id + suffix; suffix++; }
    onCreate({ id: finalId, label: label.trim(), tone, members: 0, desc: desc.trim() || 'Role custom — atur permission sesuai kebutuhan.', leads: [] }, checked);
  }

  return (
    <RaModalShell onClose={onClose} eyebrow="Role & Akses" title="Buat Role Baru"
      subtitle="Tentukan nama, warna, dan permission awal untuk role ini"
      footer={<>
        <button onClick={onClose} style={raSecondaryBtn()}>Batal</button>
        <button onClick={handleCreate} style={{ ...raPrimaryBtn(), opacity: isValid ? 1 : 0.5 }}>
          <Icons.check size={14} strokeWidth={2.5} /> Buat Role
        </button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <RaField label="Nama Role">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="cth. Marketing"
            style={raInputStyle({ width: '100%' })} />
        </RaField>
        <RaField label="Warna Label">
          <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
            {RA_TONES.map((tn) => {
              const m = RA_TONE_META[tn];
              const active = tone === tn;
              return (
                <button key={tn} type="button" onClick={() => setTone(tn)} title={m.label} style={{
                  width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
                  background: m.bg, color: m.fg,
                  border: active ? '2px solid ' + m.fg : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active && <Icons.check size={13} strokeWidth={2.8} />}
                </button>
              );
            })}
          </div>
        </RaField>
      </div>

      <RaField label="Deskripsi Role">
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
          placeholder="cth. Mengelola konten promo, banner, dan kampanye marketing"
          rows={2}
          style={raInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
      </RaField>

      <RaField label="Permission Awal">
        <div style={{ border: '1px solid #E0D9F5', borderRadius: 10, overflow: 'hidden' }}>
          {permissions.map((p, i) => (
            <label key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', fontSize: 13, color: '#1A1228',
              borderTop: i === 0 ? 'none' : '1px solid #F0EBFF',
              cursor: 'pointer', background: checked[p.perm] ? '#FAF8FF' : '#FFFFFF',
            }}>
              {p.perm}
              <input type="checkbox" checked={!!checked[p.perm]}
                onChange={(e) => setChecked(c => ({ ...c, [p.perm]: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: '#4A2D8C', cursor: 'pointer' }} />
            </label>
          ))}
        </div>
      </RaField>
    </RaModalShell>
  );
}

// ─── Modal: Konfigurasi Role (detail/edit/delete) ──────────────────────────────
function RoleDetailModal({ role, permissions, onClose, onSave, onDelete, onTogglePermission }) {
  const { useState: useS } = React;
  const [label, setLabel] = useS(role.label);
  const [desc, setDesc] = useS(role.desc);
  const [tone, setTone] = useS(role.tone);
  const isLocked = role.id === 'sa';

  return (
    <RaModalShell onClose={onClose} eyebrow={'Role & Akses · ' + role.id.toUpperCase()} title="Konfigurasi Role"
      subtitle={isLocked ? 'Role bawaan sistem — beberapa hal tidak bisa diubah' : 'Edit detail role dan kelola permission'}
      footer={<>
        {isLocked
          ? <span />
          : <button onClick={onDelete} style={raGhostBtn('#C0001A')}><Icons.x size={13} /> Hapus Role</button>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={raSecondaryBtn()}>Tutup</button>
          <button onClick={() => onSave({ label: label.trim() || role.label, desc: desc.trim() || role.desc, tone })} style={raPrimaryBtn()}>
            <Icons.check size={14} strokeWidth={2.5} /> Simpan
          </button>
        </div>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <RaField label="Nama Role">
          <input value={label} onChange={(e) => setLabel(e.target.value)} disabled={isLocked}
            style={raInputStyle({ width: '100%', opacity: isLocked ? 0.6 : 1, cursor: isLocked ? 'not-allowed' : 'text' })} />
        </RaField>
        <RaField label="Warna Label">
          <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
            {RA_TONES.map((tn) => {
              const m = RA_TONE_META[tn];
              const active = tone === tn;
              return (
                <button key={tn} type="button" disabled={isLocked} onClick={() => setTone(tn)} title={m.label} style={{
                  width: 30, height: 30, borderRadius: 8, cursor: isLocked ? 'not-allowed' : 'pointer',
                  background: m.bg, color: m.fg,
                  border: active ? '2px solid ' + m.fg : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isLocked ? 0.6 : 1,
                }}>
                  {active && <Icons.check size={13} strokeWidth={2.8} />}
                </button>
              );
            })}
          </div>
        </RaField>
      </div>

      <RaField label="Deskripsi Role">
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} disabled={isLocked}
          rows={2}
          style={raInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit', opacity: isLocked ? 0.6 : 1, cursor: isLocked ? 'not-allowed' : 'text' })} />
      </RaField>

      <RaField label={'Permission (' + permissions.filter(p => p[role.id]).length + '/' + permissions.length + ')'}>
        <div style={{ border: '1px solid #E0D9F5', borderRadius: 10, overflow: 'hidden' }}>
          {permissions.map((p, i) => {
            const allowed = !!p[role.id];
            return (
              <div key={i} onClick={() => !isLocked && onTogglePermission(i)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', fontSize: 13, color: '#1A1228',
                borderTop: i === 0 ? 'none' : '1px solid #F0EBFF',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                background: allowed ? '#FAF8FF' : '#FFFFFF',
              }}>
                {p.perm}
                <span style={raChip(allowed)}>
                  {allowed ? <Icons.check size={13} strokeWidth={2.8} /> : <span style={{ fontWeight: 700, fontSize: 12, lineHeight: 1 }}>—</span>}
                </span>
              </div>
            );
          })}
        </div>
        {isLocked && (
          <div style={{ fontSize: 11, color: '#9085AE', marginTop: 6, lineHeight: 1.5 }}>
            Super Admin selalu memiliki akses penuh ke seluruh permission dan tidak dapat diubah.
          </div>
        )}
      </RaField>
    </RaModalShell>
  );
}

// ─── Modal: Kelola Anggota ──────────────────────────────────────────────────────
function ManageMembersModal({ roles, onClose }) {
  const { useState: useS } = React;
  const [activeRole, setActiveRole] = useS(roles[0].id);
  const [members, setMembers] = useS(() => {
    const m = {};
    roles.forEach(r => { m[r.id] = r.leads.filter(l => !l.startsWith('+')); });
    return m;
  });
  const [newName, setNewName] = useS('');
  const current = roles.find(r => r.id === activeRole);

  function addMember() {
    if (!newName.trim()) return;
    setMembers(m => ({ ...m, [activeRole]: [...m[activeRole], newName.trim()] }));
    window.muurahToast(newName.trim() + ' ditambahkan ke role ' + current.label, 'success');
    setNewName('');
  }
  function removeMember(name) {
    window.muurahConfirm({
      title: 'Keluarkan ' + name + ' dari role ' + current.label + '?',
      confirmLabel: 'Keluarkan', danger: true,
      onConfirm: () => {
        setMembers(m => ({ ...m, [activeRole]: m[activeRole].filter(n => n !== name) }));
        window.muurahToast(name + ' dikeluarkan dari role ' + current.label, 'success');
      },
    });
  }

  return (
    <RaModalShell onClose={onClose} eyebrow="Role & Akses" title="Kelola Anggota"
      subtitle="Tambah atau keluarkan anggota dari role tertentu"
      footer={<button onClick={onClose} style={raPrimaryBtn()}>Selesai</button>}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {roles.map((r) => {
          const m = RA_TONE_META[r.tone] || RA_TONE_META.purple;
          const active = activeRole === r.id;
          return (
            <button key={r.id} onClick={() => setActiveRole(r.id)} style={{
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              background: active ? m.fg : m.bg, color: active ? '#FFFFFF' : m.fg,
              border: 0, fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
            }}>{r.label}</button>
          );
        })}
      </div>

      <div style={{ border: '1px solid #E0D9F5', borderRadius: 10, overflow: 'hidden' }}>
        {members[activeRole].length === 0 && (
          <div style={{ padding: '16px 12px', fontSize: 12, color: '#9085AE', textAlign: 'center' }}>
            Belum ada anggota di role ini
          </div>
        )}
        {members[activeRole].map((name, i) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', fontSize: 13, color: '#1A1228',
            borderTop: i === 0 ? 'none' : '1px solid #F0EBFF',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.users size={13} style={{ color: '#9085AE' }} /> {name}
            </span>
            <button onClick={() => removeMember(name)} style={raGhostBtn('#C0001A')}>Keluarkan</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addMember(); }}
          placeholder={'Tambah anggota ke ' + current.label + '…'}
          style={raInputStyle({ flex: 1 })} />
        <button onClick={addMember} style={raPrimaryBtn()}><Icons.check size={14} /> Tambah</button>
      </div>
    </RaModalShell>
  );
}

window.MuurahRoleAkses = RoleAkses;
