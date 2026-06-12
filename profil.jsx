// profil.jsx — Profil & Akun screen (inner nav + 5 panels)
const { useState: usePfState, useMemo: usePfMemo, useEffect: usePfEffect, useRef: usePfRef } = React;

const PF_NAV = [
  { id: 'info',     label: 'Informasi Pribadi',    icon: 'users' },
  { id: 'security', label: 'Keamanan & Password',  icon: 'shieldlock' },
  { id: 'notif',    label: 'Preferensi Notifikasi', icon: 'bell' },
  { id: 'activity', label: 'Aktivitas Login',      icon: 'clock' },
  { id: 'sessions', label: 'Sesi Aktif',           icon: 'wifi' },
];

function Profil() {
  const { Card } = window.MuurahShell;
  const [inner, setInner] = usePfState('info');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          Pengaturan Akun
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
          Profil & Akun
        </h1>
        <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
          Kelola informasi pribadi dan keamanan akun kamu
        </div>
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'flex-start' }}>
        {/* Inner nav */}
        <Card padding={8} style={{ position: 'sticky', top: 84 }}>
          {PF_NAV.map((n) => {
            const isActive = inner === n.id;
            const IconC = Icons[n.icon];
            return (
              <button key={n.id} onClick={() => setInner(n.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '0 12px', height: 40,
                border: 0, borderLeft: isActive ? '3px solid #4A2D8C' : '3px solid transparent',
                background: isActive ? '#EDE8FF' : 'transparent',
                color: isActive ? '#4A2D8C' : '#574872',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                fontFamily: 'inherit', borderRadius: 8, marginBottom: 2,
                transition: 'all 130ms ease',
              }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#F0EBFF'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <IconC size={15} style={{ flexShrink: 0, color: isActive ? '#4A2D8C' : '#574872' }} strokeWidth={1.75} />
                <span style={{ flex: 1, lineHeight: 1 }}>{n.label}</span>
              </button>
            );
          })}

          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: '#FCE7E9', borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, background: '#FFFFFF', color: '#C0001A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </div>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#C0001A' }}>Keluar dari Sesi</span>
          </div>
        </Card>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inner === 'info'     && <InfoPanel />}
          {inner === 'security' && <SecurityPanel />}
          {inner === 'notif'    && <NotifPrefPanel />}
          {inner === 'activity' && <ActivityPanel />}
          {inner === 'sessions' && <SessionsPanel />}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   INFORMASI PRIBADI
// ════════════════════════════════════════════════════════════════════════════
function InfoPanel() {
  const [form, setForm] = usePfState({
    nama: 'Dimas Pratama',
    username: 'd.pratama',
    email: 'd.pratama@muurah.com',
    hp: '+62 812-3456-7890',
    divisi: 'Operasional',
    timezone: 'Asia/Jakarta (WIB)',
    bahasa: 'Bahasa Indonesia',
    bio: 'Operasional harian: kelola produk, pantau transaksi, support eskalasi.',
  });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [avatar, setAvatar] = React.useState(null);
  const fileRef = React.useRef(null);
  function handleAvatarFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { window.muurahToast('File harus berupa gambar', 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => { setAvatar(reader.result); window.muurahToast('Foto profil berhasil diperbarui', 'success'); };
    reader.readAsDataURL(file);
  }

  return (
    <>
      {/* Hero card */}
      <PanelCard padded={false}>
        <div style={{ padding: '20px 24px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarFile} style={{ display: 'none' }} />
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: avatar ? 'transparent' : 'linear-gradient(135deg, #4A2D8C 0%, #B8E04A 100%)',
              color: '#FFFFFF', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em',
              boxShadow: '0 4px 12px rgba(74,45,140,0.25)',
              border: '3px solid #FFFFFF',
            }}>{avatar ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'DP'}</div>
            <button title="Ganti foto" onClick={() => fileRef.current.click()} style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 26, height: 26, borderRadius: '50%',
              background: '#FFFFFF', border: '2px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(26,18,40,0.15)',
              color: '#4A2D8C', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em' }}>
                Dimas Pratama
              </h2>
              <span style={{
                background: '#EDE8FF', color: '#4A2D8C',
                padding: '3px 10px', borderRadius: 20,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
              }}>Admin Operasional</span>
              <span style={{
                background: '#F0FDF4', color: '#16A34A',
                padding: '3px 9px', borderRadius: 20,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                Verified
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#574872', marginTop: 6 }}>
              d.pratama@muurah.com · Bergabung 14 Jan 2024
            </div>
            <div style={{ fontSize: 11, color: '#9085AE', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icons.clock size={11} />
              Terakhir masuk: Selasa, 20 Mei 2026 · 21.34 WIB · Jakarta
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => fileRef.current.click()} style={pfSecondaryBtn()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Ganti Foto
            </button>
            <button onClick={() => {
              if (!avatar) { window.muurahToast('Belum ada foto custom untuk dihapus', 'info'); return; }
              setAvatar(null);
              window.muurahToast('Foto profil dihapus, kembali ke avatar default', 'success');
            }} style={{ ...pfGhostBtn(), justifyContent: 'flex-start' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </PanelCard>

      {/* Form card */}
      <PanelCard title="Informasi Pribadi" subtitle="Data yang akan tampil di profil internal dan di audit log">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <PfField label="Nama Lengkap">
            <PfInput value={form.nama} onChange={(v) => u('nama', v)} />
          </PfField>
          <PfField label="Username" hint="Tidak dapat diubah">
            <PfInput value={form.username} readOnly />
          </PfField>
          <PfField label="Email">
            <PfInput value={form.email} onChange={(v) => u('email', v)} icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>
              </svg>
            } />
          </PfField>
          <PfField label="Nomor HP">
            <PfInput value={form.hp} onChange={(v) => u('hp', v)} mono icon={<Icons.phone size={14} />} />
          </PfField>
          <PfField label="Divisi">
            <PfSelect value={form.divisi} onChange={(v) => u('divisi', v)}
              options={['Operasional','Finance','CS','IT & Security','Marketing']} />
          </PfField>
          <PfField label="Timezone">
            <PfSelect value={form.timezone} onChange={(v) => u('timezone', v)}
              options={['Asia/Jakarta (WIB)','Asia/Makassar (WITA)','Asia/Jayapura (WIT)']} />
          </PfField>
        </div>

        <div style={{ marginTop: 14 }}>
          <PfField label="Bio Singkat" hint="Maks 140 karakter — terlihat oleh tim internal">
            <textarea value={form.bio}
              onChange={(e) => u('bio', e.target.value.slice(0, 140))}
              rows={2} maxLength={140}
              style={pfInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', resize: 'vertical', minHeight: 60, lineHeight: 1.5 })} />
            <div style={{ fontSize: 11, color: '#9085AE', marginTop: 4, textAlign: 'right' }}>
              {form.bio.length}/140
            </div>
          </PfField>
        </div>

        <PfFooter editor="kamu" ago="5 menit lalu" />
      </PanelCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   KEAMANAN & PASSWORD
// ════════════════════════════════════════════════════════════════════════════
function SecurityPanel() {
  const [cur, setCur] = usePfState('');
  const [nw, setNw]   = usePfState('');
  const [cf, setCf]   = usePfState('');
  const [show, setShow] = usePfState({ cur: false, nw: false, cf: false });
  const [twofa, setTwofa] = usePfState(true);

  const strength = passwordStrength(nw);
  const strengthLabel = ['—', 'Lemah', 'Cukup', 'Bagus', 'Sangat kuat'][strength];
  const strengthColor = ['#9085AE', '#C0001A', '#D97706', '#16A34A', '#16A34A'][strength];

  return (
    <>
      {/* Ganti Password */}
      <PanelCard title="Ganti Password" subtitle="Gunakan kombinasi huruf besar, kecil, angka, dan simbol minimal 8 karakter">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
          <PfField label="Password Saat Ini">
            <PasswordInput value={cur} onChange={setCur}
              visible={show.cur} onToggle={() => setShow(s => ({ ...s, cur: !s.cur }))} />
          </PfField>
          <PfField label="Password Baru">
            <PasswordInput value={nw} onChange={setNw}
              visible={show.nw} onToggle={() => setShow(s => ({ ...s, nw: !s.nw }))} />
            {nw && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[0,1,2,3].map(i => (
                    <span key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i < strength ? strengthColor : '#E0D9F5',
                      transition: 'background 130ms ease',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>
                  Kekuatan: {strengthLabel}
                </div>
              </div>
            )}
          </PfField>
          <PfField label="Konfirmasi Password Baru" error={cf && cf !== nw ? 'Password konfirmasi tidak sama' : null}>
            <PasswordInput value={cf} onChange={setCf}
              visible={show.cf} onToggle={() => setShow(s => ({ ...s, cf: !s.cf }))}
              error={cf && cf !== nw} />
          </PfField>
        </div>

        <PfFooter saveLabel="Simpan Password" />
      </PanelCard>

      {/* PIN Admin */}
      <PanelCard padded={false}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: '#F4FCE3', color: '#5B7C12',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.shieldlock size={20} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>PIN Admin</div>
              <div style={{ fontSize: 12, color: '#574872', marginTop: 2 }}>PIN 6 digit untuk mengamankan sesi dan aksi sensitif</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} style={{
                    width: 28, height: 32, borderRadius: 6,
                    background: '#F0EBFF',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: '#4A2D8C', fontSize: 16, fontWeight: 800,
                  }}>•</span>
                ))}
                <span style={{
                  marginLeft: 8, alignSelf: 'center',
                  fontSize: 11, color: '#9085AE',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>terakhir diubah 28 hari lalu</span>
              </div>
            </div>
          </div>
          <button onClick={() => window.muurahConfirm({
            title: 'Ganti PIN admin?',
            body: 'PIN baru harus 6 digit. PIN lama akan langsung dinonaktifkan.',
            confirmLabel: 'Buat PIN Baru',
            onConfirm: () => window.muurahToast('PIN admin berhasil diperbarui', 'success'),
          })} style={pfPrimaryBtn()}>
            <Icons.refresh size={14} /> Ganti PIN
          </button>
        </div>
      </PanelCard>

      {/* 2FA */}
      <PanelCard padded={false}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, flex: 1 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: '#F0FDF4', color: '#16A34A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.shield size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>Two-Factor Authentication</div>
                <span style={{
                  background: twofa ? '#F0FDF4' : '#FCE7E9',
                  color: twofa ? '#16A34A' : '#C0001A',
                  padding: '2px 8px', borderRadius: 20,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                  {twofa ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#574872', marginTop: 4, lineHeight: 1.5 }}>
                Kode OTP dikirim ke <b style={{ color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>+62 812-xxxx-7890</b> setiap kali login.
                Disarankan tetap aktif untuk semua akun Admin.
              </div>
              <a href="#" onClick={(e) => e.preventDefault()} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                color: '#4A2D8C', fontWeight: 600, textDecoration: 'none',
                fontSize: 12, marginTop: 10,
              }}>
                Kelola perangkat 2FA <Icons.arrowR size={11} />
              </a>
            </div>
          </div>
          <Toggle checked={twofa} onChange={setTwofa} />
        </div>
      </PanelCard>

      {/* Sesi Aktif teaser */}
      <PanelCard title="Sesi Aktif" subtitle="Login aktif dari perangkat kamu — akhiri sesi lain jika ada yang tidak dikenal" padded={false}>
        <SessionsList compact />
      </PanelCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   PREFERENSI NOTIFIKASI
// ════════════════════════════════════════════════════════════════════════════
function NotifPrefPanel() {
  const PREFS = [
    { id: 'tx_gagal',     label: 'Transaksi Gagal',           desc: 'Notifikasi setiap transaksi gagal' },
    { id: 'sr_low',       label: 'Success Rate Turun',        desc: 'Saat SR harian < 95%' },
    { id: 'refund',       label: 'Refund Diproses',           desc: 'Saat ada refund yang diproses CS' },
    { id: 'deposit_low',  label: 'Deposit Supplier Hampir Habis', desc: 'Saldo deposit < Rp 5jt' },
    { id: 'audit',        label: 'Aktivitas Audit Penting',   desc: 'Perubahan limit, RBAC, harga' },
    { id: 'daily',        label: 'Ringkasan Harian',          desc: 'Setiap 23:30 WIB' },
  ];
  const [prefs, setPrefs] = usePfState(() => PREFS.map(p => ({
    ...p, email: true, push: p.id !== 'daily', inapp: true,
  })));
  const upd = (id, k, v) => setPrefs(ps => ps.map(p => p.id === id ? { ...p, [k]: v } : p));

  return (
    <PanelCard title="Preferensi Notifikasi"
      subtitle="Pilih channel untuk setiap kategori notifikasi yang kamu terima"
      padded={false}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...pfThStyle, paddingLeft: 24 }}>Notifikasi</th>
            <th style={{ ...pfThStyle, textAlign: 'center', width: 90 }}>In-app</th>
            <th style={{ ...pfThStyle, textAlign: 'center', width: 90 }}>Email</th>
            <th style={{ ...pfThStyle, textAlign: 'center', width: 90, paddingRight: 24 }}>Push HP</th>
          </tr>
        </thead>
        <tbody>
          {prefs.map((p, i) => (
            <tr key={p.id} style={{ borderTop: '1px solid #F0EBFF', height: 56 }}>
              <td style={{ ...pfTdStyle, paddingLeft: 24 }}>
                <div style={{ fontWeight: 600, color: '#1A1228' }}>{p.label}</div>
                <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>{p.desc}</div>
              </td>
              <td style={{ ...pfTdStyle, textAlign: 'center' }}>
                <Toggle checked={p.inapp} onChange={(v) => upd(p.id, 'inapp', v)} />
              </td>
              <td style={{ ...pfTdStyle, textAlign: 'center' }}>
                <Toggle checked={p.email} onChange={(v) => upd(p.id, 'email', v)} />
              </td>
              <td style={{ ...pfTdStyle, textAlign: 'center', paddingRight: 24 }}>
                <Toggle checked={p.push} onChange={(v) => upd(p.id, 'push', v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PfFooter editor="kamu" ago="1 jam lalu" />
    </PanelCard>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   AKTIVITAS LOGIN
// ════════════════════════════════════════════════════════════════════════════
function ActivityPanel() {
  const ROWS = [
    { w: '20 Mei 2026 · 21.34 WIB', dev: 'Chrome 124 · macOS', lokasi: 'Jakarta, ID', ip: '110.139.42.18', s: 'sukses' },
    { w: '20 Mei 2026 · 09.12 WIB', dev: 'Safari iOS · iPhone 14', lokasi: 'Jakarta, ID', ip: '110.139.42.18', s: 'sukses' },
    { w: '19 Mei 2026 · 18.04 WIB', dev: 'Chrome 124 · macOS', lokasi: 'Jakarta, ID', ip: '110.139.42.18', s: 'sukses' },
    { w: '19 Mei 2026 · 08.51 WIB', dev: 'Chrome 124 · macOS', lokasi: 'Jakarta, ID', ip: '110.139.42.18', s: 'sukses' },
    { w: '18 Mei 2026 · 23.12 WIB', dev: 'Chrome (Unknown)', lokasi: 'Bandung, ID', ip: '36.81.122.45', s: 'gagal', reason: 'Password salah · 2× percobaan' },
    { w: '18 Mei 2026 · 14.27 WIB', dev: 'Chrome 124 · macOS', lokasi: 'Jakarta, ID', ip: '110.139.42.18', s: 'sukses' },
    { w: '17 Mei 2026 · 10.05 WIB', dev: 'Safari iOS · iPhone 14', lokasi: 'Bogor, ID', ip: '36.74.18.222', s: 'sukses' },
    { w: '16 Mei 2026 · 22.40 WIB', dev: 'Chrome 124 · macOS', lokasi: 'Jakarta, ID', ip: '110.139.42.18', s: 'sukses' },
  ];

  return (
    <PanelCard title="Aktivitas Login"
      subtitle="100 percobaan login terakhir dari semua perangkat"
      action={<button onClick={() => window.muurahToast('Mengekspor aktivitas_login.csv', 'success')} style={pfSecondaryBtn()}><Icons.download size={13} /> Export</button>}
      padded={false}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...pfThStyle, paddingLeft: 24 }}>Waktu</th>
            <th style={pfThStyle}>Perangkat</th>
            <th style={pfThStyle}>Lokasi</th>
            <th style={pfThStyle}>IP Address</th>
            <th style={{ ...pfThStyle, paddingRight: 24 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i} style={{
              borderTop: '1px solid #F0EBFF',
              background: r.s === 'gagal' ? '#FBF5F6' : '#FFFFFF',
              height: 54,
            }}>
              <td style={{ ...pfTdStyle, paddingLeft: 24,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' }}>{r.w}</td>
              <td style={pfTdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DeviceIcon dev={r.dev} />
                  <span style={{ color: '#1A1228', fontWeight: 500 }}>{r.dev}</span>
                </div>
              </td>
              <td style={{ ...pfTdStyle, color: '#574872' }}>{r.lokasi}</td>
              <td style={{ ...pfTdStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' }}>{r.ip}</td>
              <td style={{ ...pfTdStyle, paddingRight: 24 }}>
                <LoginStatus status={r.s} reason={r.reason} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{
        padding: '14px 24px', borderTop: '1px solid #E0D9F5',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 12, color: '#574872',
      }}>
        <span>Menampilkan <b style={{ color: '#1A1228' }}>1–8</b> dari <b style={{ color: '#1A1228' }}>104</b> percobaan login</span>
        <a href="#" onClick={(e) => { e.preventDefault(); window.muurahGoTo('audit'); }} style={{ color: '#4A2D8C', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
          Lihat semua di Audit Log <Icons.arrowR size={12} />
        </a>
      </div>
    </PanelCard>
  );
}

function LoginStatus({ status, reason }) {
  if (status === 'gagal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: '#FCE7E9', color: '#C0001A',
          fontSize: 11, fontWeight: 700,
          padding: '4px 10px', borderRadius: 20, alignSelf: 'flex-start',
        }}>
          <span style={{ fontSize: 10, lineHeight: 1, fontWeight: 800 }}>✕</span> Gagal
        </span>
        {reason && <span style={{ fontSize: 10, color: '#C0001A' }}>{reason}</span>}
      </div>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#F0FDF4', color: '#16A34A',
      fontSize: 11, fontWeight: 700,
      padding: '4px 10px', borderRadius: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} /> Sukses
    </span>
  );
}

function DeviceIcon({ dev }) {
  const isPhone = /iPhone|Android|iOS|Safari iOS/.test(dev);
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: '#F0EBFF', color: '#4A2D8C',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {isPhone ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SESI AKTIF
// ════════════════════════════════════════════════════════════════════════════
function SessionsPanel() {
  return (
    <PanelCard title="Sesi Aktif"
      subtitle="Semua perangkat yang sedang login ke akun kamu"
      action={
        <button onClick={() => window.muurahConfirm({
          title: 'Akhiri semua sesi lain?',
          body: 'Semua perangkat selain perangkat ini akan logout otomatis dan perlu login ulang.',
          confirmLabel: 'Akhiri Semua Sesi', danger: true,
          onConfirm: () => window.muurahToast('Semua sesi lain berhasil diakhiri', 'success'),
        })} style={{ ...pfSecondaryBtn(), borderColor: '#FCA5A5', color: '#C0001A' }}>
          Akhiri Semua Sesi Lain
        </button>
      }
      padded={false}
    >
      <SessionsList />
    </PanelCard>
  );
}

function SessionsList({ compact }) {
  const SESSIONS = [
    { dev: 'Chrome 124 · macOS', lokasi: 'Jakarta, Indonesia', ip: '110.139.42.18',
      last: 'Aktif sekarang', current: true },
    { dev: 'Safari iOS · iPhone 14', lokasi: 'Jakarta, Indonesia', ip: '110.139.42.18',
      last: '2 jam lalu', current: false },
    { dev: 'Chrome 124 · macOS', lokasi: 'Bogor, Indonesia', ip: '36.74.18.222',
      last: '4 hari lalu', current: false, suspicious: false },
  ];
  return (
    <div>
      {SESSIONS.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 24px',
          borderTop: i === 0 ? 0 : '1px solid #F0EBFF',
          background: s.current ? '#FAF8FF' : '#FFFFFF',
        }}>
          <DeviceIcon dev={s.dev} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>{s.dev}</span>
              {s.current && (
                <span style={{
                  background: '#F0FDF4', color: '#16A34A',
                  padding: '2px 8px', borderRadius: 20,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                  PERANGKAT INI
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, display: 'inline-flex', gap: 10, fontFamily: 'JetBrains Mono, monospace' }}>
              <span>{s.lokasi}</span>
              <span>·</span>
              <span>{s.ip}</span>
              <span>·</span>
              <span>{s.last}</span>
            </div>
          </div>
          {!s.current && !compact && (
            <button onClick={() => window.muurahConfirm({
              title: 'Akhiri sesi di ' + s.dev + '?',
              body: 'Perangkat ini akan logout dan butuh login ulang untuk mengakses akun.',
              confirmLabel: 'Akhiri Sesi',
              danger: true,
              onConfirm: () => window.muurahToast('Sesi di ' + s.dev + ' diakhiri', 'success'),
            })} style={{
              background: 'transparent', border: '1px solid transparent',
              color: '#C0001A', fontSize: 12, fontWeight: 600,
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 130ms ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FCE7E9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >Akhiri Sesi</button>
          )}
          {!s.current && compact && (
            <a href="#" onClick={(e) => { e.preventDefault(); window.muurahConfirm({
              title: 'Akhiri sesi di ' + s.dev + '?',
              body: 'Perangkat ini akan logout dan butuh login ulang untuk mengakses akun.',
              confirmLabel: 'Akhiri Sesi',
              danger: true,
              onConfirm: () => window.muurahToast('Sesi di ' + s.dev + ' diakhiri', 'success'),
            }); }} style={{
              color: '#C0001A', fontSize: 12, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
            }}>Akhiri Sesi</a>
          )}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SHARED BITS
// ════════════════════════════════════════════════════════════════════════════
function PanelCard({ title, subtitle, action, children, padded = true }) {
  const { Card } = window.MuurahShell;
  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      {(title || subtitle || action) && (
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #F0EBFF',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14,
        }}>
          <div>
            {title && <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 13, color: '#574872', marginTop: 4 }}>{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      <div style={padded ? { padding: '20px 24px' } : {}}>{children}</div>
    </Card>
  );
}

function PfField({ label, hint, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontSize: 12, fontWeight: 600, color: '#1A1228',
      }}>
        <span>{label}</span>
        {hint && <span style={{ fontSize: 11, color: '#9085AE', fontWeight: 500 }}>{hint}</span>}
      </label>
      {children}
      {error && (
        <div style={{
          fontSize: 11, color: '#C0001A', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{
            width: 13, height: 13, borderRadius: '50%', background: '#C0001A',
            color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 800,
          }}>!</span>
          {error}
        </div>
      )}
    </div>
  );
}

function PfInput({ value, onChange, readOnly, icon, mono }) {
  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: '#9085AE', pointerEvents: 'none',
          display: 'inline-flex',
        }}>{icon}</span>
      )}
      <input value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        style={pfInputStyle({
          width: '100%',
          paddingLeft: icon ? 36 : 12,
          background: readOnly ? '#FAF8FF' : '#F0EBFF',
          color: readOnly ? '#9085AE' : '#1A1228',
          cursor: readOnly ? 'not-allowed' : 'text',
          fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
          fontWeight: mono ? 600 : 400,
        })} />
    </div>
  );
}

function PfSelect({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ ...pfInputStyle({ width: '100%', paddingRight: 30, appearance: 'none', cursor: 'pointer', fontWeight: 500 }) }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icons.chevron size={13} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: '#574872', pointerEvents: 'none',
      }} />
    </div>
  );
}

function PasswordInput({ value, onChange, visible, onToggle, error }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: error ? '#C0001A' : '#9085AE', display: 'inline-flex',
      }}>
        <Icons.shieldlock size={14} />
      </span>
      <input type={visible ? 'text' : 'password'} value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        style={pfInputStyle({
          width: '100%', paddingLeft: 36, paddingRight: 40,
          background: error ? '#FCE7E9' : '#F0EBFF',
          border: `1px solid ${error ? '#C0001A' : 'transparent'}`,
          letterSpacing: visible ? 0 : '0.1em',
          fontFamily: visible ? 'inherit' : 'JetBrains Mono, monospace',
        })} />
      <button type="button" onClick={onToggle}
        aria-label={visible ? 'Sembunyikan' : 'Lihat'}
        style={{
          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
          width: 28, height: 28, border: 0, background: 'transparent',
          color: '#9085AE', cursor: 'pointer', borderRadius: 6,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
        {visible ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <span onClick={() => onChange(!checked)} role="switch" aria-checked={checked} tabIndex={0}
      style={{
        position: 'relative', display: 'inline-block',
        width: 36, height: 20, borderRadius: 20,
        background: checked ? '#16A34A' : '#C5B8EF',
        cursor: 'pointer', transition: 'background 130ms ease',
        flexShrink: 0,
      }}>
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#FFFFFF', transition: 'left 130ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </span>
  );
}

function PfFooter({ editor, ago, saveLabel = 'Simpan Perubahan' }) {
  return (
    <div style={{
      padding: '14px 24px', borderTop: '1px solid #E0D9F5',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#FAF8FF', margin: '20px -24px -20px',
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#574872' }}>
        {editor && (
          <>
            <Icons.clock size={13} style={{ color: '#9085AE' }} />
            Terakhir diubah <b style={{ color: '#1A1228' }}>{ago}</b> oleh {editor}
          </>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => window.muurahToast('Perubahan dibatalkan', 'info')} style={pfSecondaryBtn()}>Batal</button>
        <button onClick={() => window.muurahToast('Profil berhasil diperbarui', 'success')} style={pfPrimaryBtn()}>
          <Icons.check size={14} strokeWidth={2.5} /> {saveLabel}
        </button>
      </div>
    </div>
  );
}

function passwordStrength(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

function pfInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}
function pfPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 18px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function pfSecondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
    height: 32, padding: '0 14px', borderRadius: 10,
    fontSize: 12, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function pfGhostBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'transparent', color: '#574872', border: 0,
    padding: '5px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
const pfThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const pfTdStyle = { padding: '12px 14px', verticalAlign: 'middle' };

window.MuurahProfil = Profil;
