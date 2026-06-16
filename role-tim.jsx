// role-tim.jsx — Role & Tim (gabungan Role & Akses + Tim & Admin)
// Tab 1: Daftar Role — kelola role, anggota per role, tambah/hapus role
// Tab 2: Anggota Tim — tabel seluruh admin, filter by role, CRUD admin
const { useState: useRtState, useEffect: useRtEffect } = React;

// ─── Shared constants ────────────────────────────────────────────────────────
const RT_ROLES_SEED = [
  { id: 'sa', label: 'Super Admin',       tone: 'purple', members: 2, desc: 'Akses penuh ke seluruh modul & RBAC. Tidak bisa dihapus.', leads: ['Adi Rahmawan', 'Wira Sanjaya'] },
  { id: 'ao', label: 'Admin Operasional', tone: 'lime',   members: 5, desc: 'Operasional harian: produk, transaksi, refund, suspend.', leads: ['Dimas Pratama', '+4 lainnya'] },
  { id: 'fn', label: 'Finance',           tone: 'green',  members: 3, desc: 'Akses penuh ke keuangan: HPP, rekonsiliasi, laporan.',     leads: ['Sari Indriani', '+2 lainnya'] },
  { id: 'cs', label: 'CS',                tone: 'gold',   members: 8, desc: 'Pendukung pelanggan: refund, suspend, lihat dashboard.',    leads: ['Andre Wijaya', '+7 lainnya'] },
];

const RT_ADMINS_SEED = [
  { id: 'ADM-0001', nama: 'Adi Rahmawan',    email: 'adi.rahmawan@muurah.com',    role: 'sa', status: 'aktif',     lastLogin: '19 Mei 2026 · 12:08' },
  { id: 'ADM-0002', nama: 'Wira Sanjaya',    email: 'wira.sanjaya@muurah.com',    role: 'sa', status: 'aktif',     lastLogin: '18 Mei 2026 · 21:40' },
  { id: 'ADM-0003', nama: 'Dimas Pratama',   email: 'dimas.pratama@muurah.com',   role: 'ao', status: 'aktif',     lastLogin: '19 Mei 2026 · 14:42' },
  { id: 'ADM-0004', nama: 'Putri Lestari',   email: 'putri.lestari@muurah.com',   role: 'ao', status: 'aktif',     lastLogin: '19 Mei 2026 · 09:15' },
  { id: 'ADM-0005', nama: 'Reza Firmansyah', email: 'reza.firmansyah@muurah.com', role: 'ao', status: 'aktif',     lastLogin: '17 Mei 2026 · 16:20' },
  { id: 'ADM-0006', nama: 'Sari Indriani',   email: 'sari.indriani@muurah.com',   role: 'fn', status: 'aktif',     lastLogin: '19 Mei 2026 · 13:40' },
  { id: 'ADM-0007', nama: 'Bagas Wicaksono', email: 'bagas.wicaksono@muurah.com', role: 'fn', status: 'aktif',     lastLogin: '16 Mei 2026 · 10:02' },
  { id: 'ADM-0008', nama: 'Andre Wijaya',    email: 'andre.wijaya@muurah.com',    role: 'cs', status: 'aktif',     lastLogin: '19 Mei 2026 · 14:21' },
  { id: 'ADM-0009', nama: 'Citra Maharani',  email: 'citra.maharani@muurah.com',  role: 'cs', status: 'aktif',     lastLogin: '18 Mei 2026 · 22:05' },
  { id: 'ADM-0010', nama: 'Fajar Nugroho',   email: 'fajar.nugroho@muurah.com',   role: 'cs', status: 'suspended', lastLogin: '02 Mei 2026 · 08:40' },
];

const RT_TONES = ['purple', 'lime', 'green', 'gold', 'coral', 'blue'];
const RT_TONE_META = {
  purple: { bg: '#EDE8FF', fg: '#4A2D8C',  label: 'Ungu'  },
  lime:   { bg: '#F4FCE3', fg: '#5B7C12',  label: 'Lime'  },
  green:  { bg: '#F0FDF4', fg: '#16A34A',  label: 'Hijau' },
  gold:   { bg: '#FEF9EC', fg: '#D4900A',  label: 'Gold'  },
  coral:  { bg: '#FFF1ED', fg: '#FF6B4A',  label: 'Coral' },
  blue:   { bg: '#EFF6FF', fg: '#3B82F6',  label: 'Biru'  },
};
function rtTone(tone) { return RT_TONE_META[tone] || RT_TONE_META.purple; }

// ════════════════════════════════════════════════════════════════════════════
//   ROOT COMPONENT
// ════════════════════════════════════════════════════════════════════════════
function RoleTim() {
  const [tab, setTab] = useRtState('role');
  const [roles, setRoles] = useRtState(RT_ROLES_SEED);
  const [admins, setAdmins] = useRtState(RT_ADMINS_SEED);

  // Publish to shared store whenever roles changes
  useRtEffect(() => {
    if (window.MuurahRolesStore) window.MuurahRolesStore.set(roles);
  }, [roles]);

  // Shared handlers (used by both tabs)
  function addRole(newRole) {
    setRoles(rs => [...rs, { ...newRole, members: 0, leads: [] }]);
    window.muurahToast('Role "' + newRole.label + '" berhasil dibuat', 'success');
  }
  function updateRole(id, patch) {
    setRoles(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
  }
  function deleteRole(id) {
    const role = roles.find(r => r.id === id);
    window.muurahConfirm({
      title: 'Hapus role "' + role.label + '"?',
      body: admins.filter(a => a.role === id).length + ' anggota akan direset ke role CS setelah role ini dihapus.',
      confirmLabel: 'Hapus Role', danger: true,
      onConfirm: () => {
        setAdmins(as => as.map(a => a.role === id ? { ...a, role: 'cs' } : a));
        setRoles(rs => rs.filter(r => r.id !== id));
        window.muurahToast('Role "' + role.label + '" dihapus', 'success');
      },
    });
  }
  function addAdmin(data) {
    const newId = 'ADM-' + String(Math.max(0, ...admins.map(a => parseInt(a.id.split('-')[1]))) + 1).padStart(4, '0');
    setAdmins(as => [...as, { ...data, id: newId, status: 'aktif', lastLogin: '—' }]);
    // Update members count on role
    setRoles(rs => rs.map(r => r.id === data.role ? { ...r, members: r.members + 1 } : r));
    window.muurahToast(data.sendInvite ? 'Undangan login dikirim ke ' + data.email : 'Admin "' + data.nama + '" berhasil ditambahkan', 'success');
  }
  function updateAdmin(data) {
    const prev = admins.find(a => a.id === data.id);
    setAdmins(as => as.map(a => a.id === data.id ? { ...a, ...data } : a));
    if (prev && prev.role !== data.role) {
      setRoles(rs => rs.map(r => {
        if (r.id === prev.role) return { ...r, members: Math.max(0, r.members - 1) };
        if (r.id === data.role) return { ...r, members: r.members + 1 };
        return r;
      }));
    }
    window.muurahToast('Admin "' + data.nama + '" berhasil diperbarui', 'success');
  }
  function removeAdminFromRole(adminId, roleId) {
    setAdmins(as => as.map(a => a.id === adminId ? { ...a, role: 'cs' } : a));
    setRoles(rs => rs.map(r => {
      if (r.id === roleId) return { ...r, members: Math.max(0, r.members - 1) };
      if (r.id === 'cs') return { ...r, members: r.members + 1 };
      return r;
    }));
    window.muurahToast('Anggota dipindahkan ke role CS', 'success');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Role & Tim
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            Kelola role akses dan anggota tim internal dalam satu tempat
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: 4, display: 'inline-flex', gap: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {[
          { id: 'role', label: 'Daftar Role', icon: 'shieldlock' },
          { id: 'tim',  label: 'Anggota Tim', icon: 'users' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 9, border: 0, cursor: 'pointer',
            background: tab === t.id ? '#4A2D8C' : 'transparent',
            color: tab === t.id ? '#FFFFFF' : '#574872',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}>
            {t.id === 'role' ? <Icons.shieldlock size={14} /> : <Icons.users size={14} />}
            {t.label}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
              background: tab === t.id ? 'rgba(255,255,255,0.2)' : '#F0EBFF',
              color: tab === t.id ? '#FFFFFF' : '#4A2D8C',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {t.id === 'role' ? roles.length : admins.length}
            </span>
          </button>
        ))}
      </div>

      {tab === 'role' && (
        <TabDaftarRole roles={roles} admins={admins}
          onAdd={addRole} onUpdate={updateRole} onDelete={deleteRole}
          onRemoveMember={removeAdminFromRole}
          onGoToTim={(roleId) => setTab('tim')} />
      )}
      {tab === 'tim' && (
        <TabAnggotaTim roles={roles} admins={admins}
          onAdd={addAdmin} onUpdate={updateAdmin}
          onDeleteAdmin={(a) => {
            window.muurahConfirm({
              title: 'Hapus akun admin "' + a.nama + '"?',
              body: 'Akun ini akan dihapus permanen dan tidak bisa login lagi.',
              confirmLabel: 'Hapus Akun', danger: true,
              onConfirm: () => {
                setAdmins(as => as.filter(x => x.id !== a.id));
                setRoles(rs => rs.map(r => r.id === a.role ? { ...r, members: Math.max(0, r.members - 1) } : r));
                window.muurahToast('Admin "' + a.nama + '" dihapus', 'success');
              },
            });
          }}
          onToggleStatus={(a) => {
            const willSuspend = a.status === 'aktif';
            window.muurahConfirm({
              title: (willSuspend ? 'Suspend' : 'Aktifkan') + ' admin "' + a.nama + '"?',
              body: willSuspend ? 'Admin ini tidak akan bisa login ke dashboard sampai diaktifkan kembali.' : 'Admin ini akan bisa login kembali.',
              confirmLabel: willSuspend ? 'Suspend' : 'Aktifkan', danger: willSuspend,
              onConfirm: () => {
                setAdmins(as => as.map(x => x.id === a.id ? { ...x, status: willSuspend ? 'suspended' : 'aktif' } : x));
                window.muurahToast('Admin "' + a.nama + '" ' + (willSuspend ? 'disuspend' : 'diaktifkan'), 'success');
              },
            });
          }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   TAB 1: DAFTAR ROLE
// ════════════════════════════════════════════════════════════════════════════
function TabDaftarRole({ roles, admins, onAdd, onUpdate, onDelete, onRemoveMember, onGoToTim }) {
  const { Card } = window.MuurahShell;
  const [creating, setCreating] = useRtState(false);
  const [configuring, setConfiguring] = useRtState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setCreating(true)} style={rtPrimaryBtn()}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Buat Role Baru
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(roles.length, 4)}, 1fr)`, gap: 14 }}>
        {roles.map(r => (
          <RoleCard key={r.id} role={r}
            memberCount={admins.filter(a => a.role === r.id).length}
            onConfigure={() => setConfiguring(r.id)}
            onGoToTim={() => onGoToTim(r.id)} />
        ))}
      </div>

      {creating && (
        <CreateRoleModal existingIds={roles.map(r => r.id)}
          onClose={() => setCreating(false)}
          onCreate={(newRole) => { onAdd(newRole); setCreating(false); }} />
      )}
      {configuring && (
        <KonfigurasiRoleModal
          role={roles.find(r => r.id === configuring)}
          members={admins.filter(a => a.role === configuring)}
          onClose={() => setConfiguring(null)}
          onSave={(patch) => { onUpdate(configuring, patch); setConfiguring(null); window.muurahToast('Role berhasil diperbarui', 'success'); }}
          onDelete={() => { setConfiguring(null); onDelete(configuring); }}
          onRemoveMember={(adminId) => onRemoveMember(adminId, configuring)}
        />
      )}
    </div>
  );
}

function RoleCard({ role, memberCount, onConfigure, onGoToTim }) {
  const t = rtTone(role.tone);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
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
          <span title="Tidak bisa dihapus" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, background: '#F0EBFF', color: '#9085AE' }}>
            <Icons.shieldlock size={12} />
          </span>
        )}
      </div>

      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: 28, color: '#1A1228', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {memberCount}
        </div>
        <div style={{ fontSize: 12, color: '#574872', fontWeight: 500, marginTop: 4 }}>anggota aktif</div>
        <div style={{ fontSize: 11, color: '#9085AE', marginTop: 6, lineHeight: 1.5 }}>{role.desc}</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {role.leads.map(m => (
          <span key={m} style={{ fontSize: 10, color: '#574872', background: '#F0EBFF', padding: '3px 7px', borderRadius: 6, fontWeight: 600 }}>{m}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onConfigure} style={{
          flex: 1, height: 32, borderRadius: 8,
          background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
          fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#F0EBFF'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
        >
          <Icons.cog size={12} /> Konfigurasi
        </button>
        <button onClick={onGoToTim} title="Lihat anggota di tab Tim" style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#FFFFFF', color: '#574872', border: '1px solid #E0D9F5',
          fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#F0EBFF'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
        >
          <Icons.users size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Modal Buat Role Baru ────────────────────────────────────────────────────
function CreateRoleModal({ existingIds, onClose, onCreate }) {
  const [label, setLabel] = useRtState('');
  const [desc, setDesc] = useRtState('');
  const [tone, setTone] = useRtState('blue');
  const isValid = label.trim().length > 0;

  useRtEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function handleCreate() {
    if (!isValid) { window.muurahToast('Nama role wajib diisi', 'error'); return; }
    let id = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 6) || 'role';
    let suffix = 1; let finalId = id;
    while (existingIds.includes(finalId)) { finalId = id + suffix; suffix++; }
    onCreate({ id: finalId, label: label.trim(), tone, desc: desc.trim() || 'Role custom — atur permission di Pengaturan Sistem.', leads: [] });
  }

  return (
    <RtModal onClose={onClose} eyebrow="Role & Tim" title="Buat Role Baru"
      subtitle="Nama, warna, dan deskripsi — permission diatur di Pengaturan Sistem"
      footer={<>
        <button onClick={onClose} style={rtSecondaryBtn()}>Batal</button>
        <button onClick={handleCreate} style={{ ...rtPrimaryBtn(), opacity: isValid ? 1 : 0.5 }}>
          <Icons.check size={14} strokeWidth={2.5} /> Buat Role
        </button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <RtField label="Nama Role">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="cth. Marketing"
            style={rtInputStyle({ width: '100%' })} autoFocus />
        </RtField>
        <RtField label="Warna Label">
          <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
            {RT_TONES.map(tn => {
              const m = RT_TONE_META[tn]; const active = tone === tn;
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
        </RtField>
      </div>
      <RtField label="Deskripsi Role">
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
          placeholder="cth. Mengelola konten promo, banner, dan kampanye marketing"
          rows={2} style={rtInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
      </RtField>
    </RtModal>
  );
}

// ─── Modal Konfigurasi Role (edit + lihat anggota) ───────────────────────────
function KonfigurasiRoleModal({ role, members, onClose, onSave, onDelete, onRemoveMember }) {
  const [label, setLabel] = useRtState(role.label);
  const [desc, setDesc] = useRtState(role.desc);
  const [tone, setTone] = useRtState(role.tone);
  const [innerTab, setInnerTab] = useRtState('detail');
  const isLocked = role.id === 'sa';
  const t = rtTone(role.tone);

  useRtEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <RtModal onClose={onClose} eyebrow={'Role — ' + role.label} title="Konfigurasi Role"
      subtitle={isLocked ? 'Role bawaan sistem — tidak bisa dihapus' : 'Edit detail dan kelola anggota role ini'}
      footer={<>
        {!isLocked
          ? <button onClick={onDelete} style={rtGhostBtn('#C0001A')}><Icons.x size={13} /> Hapus Role</button>
          : <span />}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={rtSecondaryBtn()}>Tutup</button>
          {innerTab === 'detail' && !isLocked && (
            <button onClick={() => {
              window.muurahConfirm({
                title: 'Simpan perubahan role "' + role.label + '"?',
                body: 'Nama, warna, dan deskripsi role akan diperbarui.',
                confirmLabel: 'Simpan',
                onConfirm: () => onSave({ label: label.trim() || role.label, desc: desc.trim() || role.desc, tone }),
              });
            }} style={rtPrimaryBtn()}>
              <Icons.check size={14} strokeWidth={2.5} /> Simpan
            </button>
          )}
        </div>
      </>}
    >
      {/* Inner tab switcher */}
      <div style={{ display: 'flex', gap: 4, padding: 3, background: '#F0EBFF', borderRadius: 10, marginBottom: 4 }}>
        {[{ id: 'detail', label: 'Detail Role' }, { id: 'anggota', label: 'Anggota (' + members.length + ')' }].map(it => (
          <button key={it.id} onClick={() => setInnerTab(it.id)} style={{
            flex: 1, border: 0, padding: '7px 8px', borderRadius: 8, cursor: 'pointer',
            background: innerTab === it.id ? '#FFFFFF' : 'transparent',
            boxShadow: innerTab === it.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            color: innerTab === it.id ? '#4A2D8C' : '#574872',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
          }}>{it.label}</button>
        ))}
      </div>

      {innerTab === 'detail' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <RtField label="Nama Role">
              <input value={label} onChange={(e) => setLabel(e.target.value)} disabled={isLocked}
                style={rtInputStyle({ width: '100%', opacity: isLocked ? 0.6 : 1, cursor: isLocked ? 'not-allowed' : 'text' })} />
            </RtField>
            <RtField label="Warna Label">
              <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                {RT_TONES.map(tn => {
                  const m = RT_TONE_META[tn]; const active = tone === tn;
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
            </RtField>
          </div>
          <RtField label="Deskripsi Role">
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} disabled={isLocked} rows={2}
              style={rtInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit', opacity: isLocked ? 0.6 : 1 })} />
          </RtField>
          {isLocked && (
            <div style={{ fontSize: 11, color: '#9085AE', lineHeight: 1.5 }}>
              Super Admin selalu memiliki akses penuh dan tidak bisa diedit atau dihapus.
            </div>
          )}
        </>
      )}

      {innerTab === 'anggota' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {members.length === 0 && (
            <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>
              Belum ada anggota di role ini.
            </div>
          )}
          {members.map(a => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              borderRadius: 10, background: '#F0EBFF',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: t.bg, color: t.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12,
              }}>{a.nama.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1A1228' }}>{a.nama}</div>
                <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>{a.email}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: a.status === 'aktif' ? '#F0FDF4' : '#FCE7E9',
                color: a.status === 'aktif' ? '#16A34A' : '#C0001A',
                padding: '3px 8px', borderRadius: 6,
              }}>{a.status === 'aktif' ? 'Aktif' : 'Suspended'}</span>
              {!isLocked && (
                <button onClick={() => window.muurahConfirm({
                  title: 'Keluarkan "' + a.nama + '" dari role ini?',
                  body: 'Anggota ini akan dipindahkan ke role CS (default).',
                  confirmLabel: 'Keluarkan',
                  onConfirm: () => onRemoveMember(a.id),
                })} style={{ ...rtGhostBtn('#C0001A'), padding: '4px 8px', fontSize: 11 }}>Keluarkan</button>
              )}
            </div>
          ))}
        </div>
      )}
    </RtModal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   TAB 2: ANGGOTA TIM
// ════════════════════════════════════════════════════════════════════════════
function TabAnggotaTim({ roles, admins, onAdd, onUpdate, onDeleteAdmin, onToggleStatus }) {
  const { Card } = window.MuurahShell;
  const [roleF, setRoleF] = useRtState('semua');
  const [query, setQuery] = useRtState('');
  const [adding, setAdding] = useRtState(false);
  const [editing, setEditing] = useRtState(null);

  const filtered = admins.filter(a => {
    if (roleF !== 'semua' && a.role !== roleF) return false;
    if (query && !`${a.nama} ${a.email}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function handleSave(data) {
    if (data.id && admins.some(a => a.id === data.id)) onUpdate(data);
    else onAdd(data);
    setAdding(false); setEditing(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Role filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <RtFilterChip label="Semua" count={admins.length} active={roleF === 'semua'} tone="purple" onClick={() => setRoleF('semua')} />
          {roles.map(r => (
            <RtFilterChip key={r.id} label={r.label} count={admins.filter(a => a.role === r.id).length} active={roleF === r.id} tone={r.tone} onClick={() => setRoleF(r.id)} />
          ))}
        </div>
        <button onClick={() => setAdding(true)} style={rtPrimaryBtn()}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Tambah Admin
        </button>
      </div>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E0D9F5' }}>
          <div style={{ position: 'relative', maxWidth: 320 }}>
            <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau email…"
              style={rtInputStyle({ paddingLeft: 36, width: '100%' })} />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...rtThStyle, paddingLeft: 24 }}>Nama & Email</th>
              <th style={rtThStyle}>Role</th>
              <th style={rtThStyle}>Status</th>
              <th style={rtThStyle}>Terakhir Login</th>
              <th style={{ ...rtThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const role = roles.find(r => r.id === a.role) || roles[roles.length - 1];
              const t = rtTone(role.tone);
              return (
                <tr key={a.id} style={{ borderTop: '1px solid #F0EBFF', height: 64, opacity: a.status === 'suspended' ? 0.65 : 1 }}>
                  <td style={{ ...rtTdStyle, paddingLeft: 24 }}>
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
                  <td style={rtTdStyle}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.fg, background: t.bg, padding: '4px 9px', borderRadius: 6 }}>{role.label}</span>
                  </td>
                  <td style={rtTdStyle}>
                    {a.status === 'aktif'
                      ? <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '4px 9px', borderRadius: 6 }}>Aktif</span>
                      : <span style={{ fontSize: 11, fontWeight: 700, color: '#C0001A', background: '#FCE7E9', padding: '4px 9px', borderRadius: 6 }}>Suspended</span>}
                  </td>
                  <td style={{ ...rtTdStyle, fontSize: 12, color: '#574872', fontFamily: 'JetBrains Mono, monospace' }}>{a.lastLogin}</td>
                  <td style={{ ...rtTdStyle, paddingRight: 24, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => setEditing(a)} style={rtGhostBtn('#4A2D8C')}>Edit</button>
                      <button onClick={() => onToggleStatus(a)} style={rtGhostBtn(a.status === 'aktif' ? '#D97706' : '#16A34A')}>
                        {a.status === 'aktif' ? 'Suspend' : 'Aktifkan'}
                      </button>
                      <button onClick={() => onDeleteAdmin(a)} style={rtGhostBtn('#C0001A')}>Hapus</button>
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
        <AdminFormModal admin={editing} roles={roles}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={handleSave} />
      )}
    </div>
  );
}

function RtFilterChip({ label, count, active, tone, onClick }) {
  const t = rtTone(tone);
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

// ─── Modal Tambah / Edit Admin ────────────────────────────────────────────────
function AdminFormModal({ admin, roles, onClose, onSave }) {
  const [form, setForm] = useRtState(admin ? { ...admin } : { nama: '', email: '', role: roles[roles.length - 1]?.id || 'cs', authMethod: 'invite', password: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.nama.trim() && /^\S+@\S+\.\S+$/.test(form.email) &&
    (admin || form.authMethod === 'invite' || (form.password && form.password.length >= 8));

  useRtEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <RtModal onClose={onClose} eyebrow="Anggota Tim" title={admin ? 'Edit Admin' : 'Tambah Admin Baru'}
      footer={<>
        <button onClick={onClose} style={rtSecondaryBtn()}>Batal</button>
        <button onClick={() => {
          if (!isValid) { window.muurahToast('Lengkapi nama, email valid, dan password (min. 8 karakter)', 'error'); return; }
          const data = { ...form, sendInvite: !admin && form.authMethod === 'invite' };
          if (admin) {
            window.muurahConfirm({
              title: 'Simpan perubahan untuk "' + form.nama + '"?',
              body: form.role !== admin.role ? 'Role akan diubah dari ' + (roles.find(r=>r.id===admin.role)||{label:admin.role}).label + ' ke ' + (roles.find(r=>r.id===form.role)||{label:form.role}).label + '.' : 'Detail admin akan diperbarui.',
              confirmLabel: 'Simpan Perubahan',
              onConfirm: () => onSave(data),
            });
          } else {
            onSave(data);
          }
        }} style={{ ...rtPrimaryBtn(), opacity: isValid ? 1 : 0.5 }}>
          <Icons.check size={14} strokeWidth={2.5} /> {admin ? 'Simpan Perubahan' : 'Tambah Admin'}
        </button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <RtField label="Nama Lengkap">
          <input value={form.nama} onChange={(e) => u('nama', e.target.value)}
            placeholder="cth. Budi Santoso" style={rtInputStyle({ width: '100%' })} autoFocus />
        </RtField>
        <RtField label="Email">
          <input value={form.email} onChange={(e) => u('email', e.target.value)} disabled={!!admin}
            placeholder="nama@muurah.com"
            style={rtInputStyle({ width: '100%', opacity: admin ? 0.6 : 1, cursor: admin ? 'not-allowed' : 'text' })} />
        </RtField>
      </div>

      <RtField label="Role">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {roles.map(r => {
            const t = rtTone(r.tone); const active = form.role === r.id;
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
      </RtField>

      {!admin && (
        <RtField label="Cara Login Pertama">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ id: 'invite', title: 'Kirim Undangan via Email', sub: 'Admin baru menerima link untuk membuat password sendiri' },
              { id: 'manual', title: 'Set Password Manual', sub: 'Kamu tentukan password awal' }
            ].map(opt => (
              <label key={opt.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', padding: 10, borderRadius: 10, border: '1px solid ' + (form.authMethod === opt.id ? '#4A2D8C' : '#E0D9F5'), background: form.authMethod === opt.id ? '#F0EBFF' : '#FFFFFF' }}>
                <input type="radio" checked={form.authMethod === opt.id} onChange={() => u('authMethod', opt.id)} style={{ marginTop: 2 }} />
                <span style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>{opt.title}</div>
                  <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>{opt.sub}</div>
                  {opt.id === 'manual' && form.authMethod === 'manual' && (
                    <input type="text" value={form.password} onChange={(e) => u('password', e.target.value)}
                      placeholder="Minimal 8 karakter" style={rtInputStyle({ width: '100%', marginTop: 8, fontFamily: 'JetBrains Mono, monospace' })} />
                  )}
                </span>
              </label>
            ))}
          </div>
        </RtField>
      )}
    </RtModal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SHARED HELPERS
// ════════════════════════════════════════════════════════════════════════════
function RtModal({ onClose, eyebrow, title, subtitle, children, footer, width = 560 }) {
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
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E0D9F5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            {eyebrow && <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{eyebrow}</div>}
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10, background: '#FFFFFF', color: '#574872', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icons.x size={16} />
          </button>
        </div>
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
        {footer && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E0D9F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function RtField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}
function rtInputStyle(over = {}) {
  return { background: '#F0EBFF', border: '1px solid transparent', borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13, color: '#1A1228', outline: 'none', fontFamily: 'inherit', ...over };
}
function rtPrimaryBtn() {
  return { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#4A2D8C', color: '#FFFFFF', border: 0, height: 38, padding: '0 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' };
}
function rtSecondaryBtn() {
  return { background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF', height: 38, padding: '0 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' };
}
function rtGhostBtn(color) {
  return { background: 'transparent', color, border: 0, padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' };
}
const rtThStyle = { textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 14px', background: '#F0EBFF' };
const rtTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

window.MuurahRoleTim = RoleTim;
