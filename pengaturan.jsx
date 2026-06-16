// pengaturan.jsx — Pengaturan Sistem with 8 wired sub-screens
const { useState: usePsState } = React;

const PS_NAV = [
  { id: 'umum',     label: 'Umum',                 icon: 'cog' },
  { id: 'pg',       label: 'Payment Gateway',      icon: 'card' },
  { id: 'notif',    label: 'Notifikasi',           icon: 'bell' },
  { id: 'faq',      label: 'FAQ & Bantuan',        icon: 'help' },
  { id: 'promo',    label: 'Promo & Voucher',      icon: 'tag' },
  { id: 'seo',      label: 'SEO',                  icon: 'search' },
  { id: 'limit',    label: 'Saldo & Limit Biller', icon: 'wallet' },
  { id: 'fee',      label: 'Fee & Biaya Admin',    icon: 'wallet' },
  { id: 'rbac',     label: 'Role & Akses',         icon: 'shieldlock' },
  { id: 'audit',    label: 'Audit Log',            icon: 'clock' },
];

function Pengaturan() {
  const { Card } = window.MuurahShell;
  const [innerNav, setInnerNav] = usePsState('limit');
  const [perms, setPerms] = usePsState(() => [
    { perm: 'Lihat Dashboard',     sa: true, ao: true,  fn: true,  cs: true  },
    { perm: 'Edit Harga Produk',   sa: true, ao: true,  fn: false, cs: false },
    { perm: 'Edit HPP',            sa: true, ao: false, fn: true,  cs: false },
    { perm: 'Proses Refund',       sa: true, ao: true,  fn: false, cs: true  },
    { perm: 'Suspend Akun User',   sa: true, ao: true,  fn: false, cs: true  },
    { perm: 'Export Laporan',      sa: true, ao: true,  fn: true,  cs: false },
    { perm: 'Kelola Supplier',     sa: true, ao: false, fn: true,  cs: false },
    { perm: 'Kelola Role & Akses', sa: true, ao: false, fn: false, cs: false },
  ]);
  const togglePerm = (i, role) => {
    if (role === 'sa') {
      window.muurahToast('Super Admin selalu punya akses penuh', 'warning');
      return;
    }
    setPerms(ps => ps.map((p, idx) => idx === i ? { ...p, [role]: !p[role] } : p));
  };
  const addPerm = (label) => {
    if (!label.trim()) return;
    if (perms.some(p => p.perm.toLowerCase() === label.toLowerCase())) {
      window.muurahToast('Permission "' + label + '" sudah ada', 'error'); return;
    }
    setPerms(ps => [...ps, { perm: label.trim(), sa: true, ao: false, fn: false, cs: false }]);
    window.muurahToast('Permission "' + label.trim() + '" ditambahkan — aktif untuk Super Admin', 'success');
  };
  const renamePerm = (i, label) => {
    if (!label.trim()) return;
    setPerms(ps => ps.map((p, idx) => idx === i ? { ...p, perm: label.trim() } : p));
    window.muurahToast('Permission diperbarui', 'success');
  };
  const deletePerm = (i) => {
    const label = perms[i].perm;
    window.muurahConfirm({
      title: 'Hapus permission "' + label + '"?',
      body: 'Permission ini akan dihapus dari matrix dan tidak bisa digunakan lagi.',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setPerms(ps => ps.filter((_, idx) => idx !== i));
        window.muurahToast('Permission "' + label + '" dihapus', 'success');
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
          Pengaturan Sistem
        </h1>
        <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
          Atur perilaku platform, integrasi, dan kontrol akses
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'flex-start' }}>
        {/* Inner sidebar */}
        <Card padding={8} style={{ position: 'sticky', top: 84 }}>
          {PS_NAV.map((n) => {
            const isActive = innerNav === n.id;
            const IconC = Icons[n.icon];
            return (
              <button key={n.id} onClick={() => setInnerNav(n.id)} style={{
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
        </Card>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {innerNav === 'umum'     && <UmumPanel />}
          {innerNav === 'pg'       && <PaymentGatewayPanel />}
          {innerNav === 'notif'    && <NotifSubPanel />}
          {innerNav === 'faq'      && <FaqPanel />}
          {innerNav === 'promo'    && <PromoPanel />}
          {innerNav === 'seo'      && <SeoPanel />}
          {innerNav === 'limit'    && <SaldoLimitPanel />}
          {innerNav === 'fee'      && <FeePanel />}
          {innerNav === 'rbac'     && <RbacPanel perms={perms} onToggle={togglePerm} onAdd={addPerm} onRename={renamePerm} onDelete={deletePerm} />}
          {innerNav === 'audit'    && <AuditPanel />}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   UMUM
// ════════════════════════════════════════════════════════════════════════════
function UmumPanel() {
  const { Card } = window.MuurahShell;
  const [form, setForm] = usePsState({
    name: 'muurah.com',
    timezone: 'Asia/Jakarta (WIB)',
    env: 'production',
    currency: 'IDR — Rupiah',
    language: 'Bahasa Indonesia',
    maintenance: false,
    publicStatus: true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <PanelCard title="Pengaturan Umum" subtitle="Identitas platform, zona waktu, dan mode operasional">
      <FormSection title="Identitas">
        <FormRow>
          <PsField label="Nama Platform"><PsTextInput value={form.name} onChange={(v) => set('name', v)} /></PsField>
          <PsField label="Mata Uang Default">
            <PsSelect value={form.currency} onChange={(v) => set('currency', v)}
              options={['IDR — Rupiah','USD — US Dollar','SGD — Singapore Dollar']} />
          </PsField>
        </FormRow>
      </FormSection>

      <FormSection title="Zona Waktu & Bahasa">
        <FormRow>
          <PsField label="Zona Waktu"><PsSelect value={form.timezone} onChange={(v) => set('timezone', v)}
            options={['Asia/Jakarta (WIB)','Asia/Makassar (WITA)','Asia/Jayapura (WIT)']} /></PsField>
          <PsField label="Bahasa Default"><PsSelect value={form.language} onChange={(v) => set('language', v)}
            options={['Bahasa Indonesia','English','Mixed']} /></PsField>
        </FormRow>
      </FormSection>

      <FormSection title="Environment">
        <PsField label="Default Environment">
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {['production','staging','development'].map((e) => (
              <EnvChip key={e} value={e} current={form.env} onClick={() => set('env', e)} />
            ))}
          </div>
        </PsField>
      </FormSection>

      <FormSection title="Mode Operasional" last>
        <BigToggleRow
          label="Maintenance Mode"
          desc="Tampilkan halaman maintenance ke seluruh user. Admin tetap dapat akses."
          checked={form.maintenance} onChange={(v) => set('maintenance', v)}
          danger
        />
        <BigToggleRow
          label="Status API Publik"
          desc="Endpoint publik (status.muurah.com) menampilkan health & uptime real-time."
          checked={form.publicStatus} onChange={(v) => set('publicStatus', v)}
        />
      </FormSection>

      <FooterBar editor="Adi Rahmawan" ago="1 jam lalu" />
    </PanelCard>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SUPPLIER & BILLER
// ════════════════════════════════════════════════════════════════════════════
function SupplierPanel() {
  const { Card } = window.MuurahShell;
  const SUPPLIER_KATEGORI = ['Pulsa', 'Token PLN', 'Paket Data', 'Voucher Game', 'E-Wallet', 'BPJS', 'Multifinance', 'PDAM'];
  const [suppliers, setSuppliers] = usePsState([
    { name: 'Supplier A — Mobile Pulsa', kat: ['Pulsa', 'Token PLN'],          status: 'aktif',       sr: 98.7, endpoint: 'https://api.mobilepulsa.id/v1', apiKey: 'sk_live_a1b2c3d4e5f6' },
    { name: 'Supplier B — IAK',          kat: ['Voucher Game', 'E-Wallet'],    status: 'aktif',       sr: 97.2, endpoint: 'https://api.iak.id/v2', apiKey: 'sk_live_g7h8i9j0k1l2' },
    { name: 'Supplier C — Linkqu',       kat: ['BPJS', 'Multifinance'],        status: 'gangguan',    sr: 84.5, endpoint: 'https://api.linkqu.id/v1', apiKey: 'sk_live_m3n4o5p6q7r8' },
    { name: 'Supplier D — Digiflazz',    kat: ['Paket Data', 'Pulsa'],         status: 'maintenance', sr: 99.1, endpoint: 'https://api.digiflazz.com/v1', apiKey: 'sk_live_s9t0u1v2w3x4' },
  ]);
  const [adding, setAdding] = usePsState(false);
  const [editing, setEditing] = usePsState(null);

  function saveSupplier(data) {
    if (data._editIndex != null) {
      setSuppliers(ss => ss.map((s, i) => i === data._editIndex ? { ...s, ...data } : s));
      window.muurahToast('Supplier "' + data.name + '" berhasil diperbarui', 'success');
    } else {
      setSuppliers(ss => [...ss, { ...data, sr: 100 }]);
      window.muurahToast('Supplier "' + data.name + '" berhasil ditambahkan', 'success');
    }
    setAdding(false);
    setEditing(null);
  }
  function testConnection(s) {
    window.muurahToast('Menghubungi ' + s.name + '…', 'info');
    setTimeout(() => {
      if (s.status === 'gangguan') {
        window.muurahToast('Koneksi ke ' + s.name + ' gagal (timeout) — periksa endpoint/API key', 'error');
      } else {
        window.muurahToast('Koneksi ke ' + s.name + ' berhasil — latency 184ms', 'success');
      }
    }, 900);
  }

  return (
    <PanelCard title="Supplier & Biller"
      subtitle="Daftar penyedia produk PPOB yang terhubung ke Muurah"
      action={<button onClick={() => setAdding(true)} style={primaryBtn()}><span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Tambah Supplier</button>}
      padded={false}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...psThStyle, paddingLeft: 24 }}>Nama Supplier</th>
            <th style={psThStyle}>Kategori Produk</th>
            <th style={psThStyle}>Status Koneksi</th>
            <th style={{ ...psThStyle, textAlign: 'right' }}>Success Rate</th>
            <th style={{ ...psThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, idx) => {
            const rowBg = s.status === 'gangguan' ? '#FBF5F6' : s.status === 'maintenance' ? '#FFFBEB' : '#FFFFFF';
            return (
              <tr key={s.name} style={{ borderTop: '1px solid #F0EBFF', height: 56, background: rowBg }}>
                <td style={{ ...psTdStyle, paddingLeft: 24, fontWeight: 600, color: '#1A1228' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: '#F0EBFF', color: '#4A2D8C',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13,
                    }}>{s.name.split(' — ')[0].split(' ')[1] || s.name[0]}</div>
                    <span>{s.name}</span>
                  </div>
                </td>
                <td style={psTdStyle}>
                  <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
                    {s.kat.map((k) => (
                      <span key={k} style={{
                        fontSize: 11, color: '#574872', background: '#F0EBFF',
                        padding: '3px 8px', borderRadius: 6, fontWeight: 500,
                      }}>{k}</span>
                    ))}
                  </span>
                </td>
                <td style={psTdStyle}><SupplierStatus status={s.status} /></td>
                <td style={{ ...psTdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                      color: s.sr >= 95 ? '#16A34A' : s.sr >= 90 ? '#D97706' : '#C0001A',
                    }}>{s.sr.toFixed(1)}%</span>
                    <div style={{ width: 80, height: 4, background: '#F0EBFF', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${s.sr}%`, height: '100%',
                        background: s.sr >= 95 ? '#16A34A' : s.sr >= 90 ? '#D97706' : '#C0001A',
                      }} />
                    </div>
                  </div>
                </td>
                <td style={{ ...psTdStyle, paddingRight: 24, textAlign: 'right' }}>
                  <button onClick={() => setEditing({ ...s, _editIndex: idx })} style={ghostBtn('#4A2D8C')}>Konfigurasi</button>
                  <button onClick={() => testConnection(s)} style={ghostBtn('#574872')}>Test</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {(adding || editing) && (
        <SupplierModal
          supplier={editing}
          kategoriOptions={SUPPLIER_KATEGORI}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSave={saveSupplier}
        />
      )}
    </PanelCard>
  );
}

function SupplierModal({ supplier, kategoriOptions, onClose, onSave }) {
  const [form, setForm] = usePsState(supplier || { name: '', kat: [], status: 'aktif', endpoint: '', apiKey: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.name.trim() && form.kat.length > 0 && form.endpoint.trim();

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function toggleKat(k) {
    setForm(f => ({ ...f, kat: f.kat.includes(k) ? f.kat.filter(x => x !== k) : [...f.kat, k] }));
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Supplier & Biller</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {supplier ? 'Konfigurasi Supplier' : 'Tambah Supplier Baru'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PsField label="Nama Supplier">
            <PsTextInput value={form.name} onChange={(v) => u('name', v)} />
          </PsField>

          <PsField label="Kategori Produk">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {kategoriOptions.map(k => {
                const active = form.kat.includes(k);
                return (
                  <button key={k} type="button" onClick={() => toggleKat(k)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 11px', borderRadius: 8, cursor: 'pointer',
                    background: active ? '#EDE8FF' : '#FFFFFF',
                    border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                    color: active ? '#4A2D8C' : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>
                    {active && <Icons.check size={12} strokeWidth={2.8} />} {k}
                  </button>
                );
              })}
            </div>
          </PsField>

          <PsField label="API Endpoint">
            <input value={form.endpoint} onChange={(e) => u('endpoint', e.target.value)}
              placeholder="https://api.supplier.com/v1"
              style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} />
          </PsField>

          <PsField label="API Key / Secret">
            <input value={form.apiKey} onChange={(e) => u('apiKey', e.target.value)}
              placeholder="sk_live_xxxxxxxxxxxx"
              style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} />
          </PsField>

          <PsField label="Status Koneksi">
            <PsSelect value={
              form.status === 'aktif' ? 'Aktif' : form.status === 'gangguan' ? 'Gangguan' : 'Maintenance'
            } onChange={(v) => u('status', v === 'Aktif' ? 'aktif' : v === 'Gangguan' ? 'gangguan' : 'maintenance')}
              options={['Aktif', 'Gangguan', 'Maintenance']} />
          </PsField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={secondaryBtn()}>Batal</button>
          <button onClick={() => {
            if (!isValid) { window.muurahToast('Lengkapi nama, kategori, dan endpoint', 'error'); return; }
            if (supplier) {
              window.muurahConfirm({
                title: 'Simpan perubahan konfigurasi "' + form.name + '"?',
                body: 'Endpoint, API key, dan status koneksi yang baru akan langsung dipakai untuk transaksi ke supplier ini.',
                confirmLabel: 'Simpan Perubahan',
                onConfirm: () => onSave(form),
              });
            } else {
              onSave(form);
            }
          }} style={{ ...primaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {supplier ? 'Simpan Perubahan' : 'Tambah Supplier'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SupplierStatus({ status }) {
  const map = {
    aktif:       { bg: '#F0FDF4', fg: '#16A34A', label: 'Aktif' },
    gangguan:    { bg: '#FCE7E9', fg: '#C0001A', label: 'Gangguan' },
    maintenance: { bg: '#FFFBEB', fg: '#D97706', label: 'Maintenance' },
  };
  const s = map[status] || map.aktif;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg, fontSize: 11, fontWeight: 700,
      borderRadius: 20, padding: '4px 10px',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {s.label}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   PAYMENT GATEWAY
// ════════════════════════════════════════════════════════════════════════════
const PG_TONES = {
  purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
  green:  { bg: '#F0FDF4', fg: '#16A34A' },
  blue:   { bg: '#EFF6FF', fg: '#3B82F6' },
  coral:  { bg: '#FFF1ED', fg: '#FF6B4A' },
  gold:   { bg: '#FEF9EC', fg: '#D4900A' },
};
const PG_TONE_LIST = Object.keys(PG_TONES);

const PG_SEED = [
  { id: 'midtrans', name: 'Midtrans', initial: 'M', tone: 'purple', keyMask: 'MID-sk-prod-•••••••••••••8A2D', webhook: 'https://api.muurah.com/v1/webhook/midtrans', feeText: 'Rp 1.500 + 0,5% per transaksi (VA / CC)', on: true, lastCheck: '5m lalu · 124ms' },
  { id: 'xendit',   name: 'Xendit',   initial: 'X', tone: 'green',  keyMask: 'xnd-prod-•••••••••••••K9F2',     webhook: 'https://api.muurah.com/v1/webhook/xendit',   feeText: 'Rp 1.000 + 0,4% per transaksi (VA / e-wallet)', on: true, lastCheck: '12m lalu · 98ms' },
];

function PaymentGatewayPanel() {
  const [gateways, setGateways] = usePsState(PG_SEED);
  const [editing, setEditing] = usePsState(null);
  const [adding, setAdding] = usePsState(false);

  function testConnection(gw) {
    window.muurahToast('Menghubungi ' + gw.name + '…', 'info');
    setTimeout(() => {
      if (!gw.on) {
        window.muurahToast('Test gagal — ' + gw.name + ' sedang nonaktif', 'error');
        return;
      }
      const ms = 80 + Math.floor(Math.random() * 150);
      setGateways(gs => gs.map(x => x.id === gw.id ? { ...x, lastCheck: 'Baru saja · ' + ms + 'ms' } : x));
      window.muurahToast('Koneksi ke ' + gw.name + ' berhasil — ' + ms + 'ms', 'success');
    }, 800);
  }
  function saveGateway(data) {
    if (data.id && gateways.some(g => g.id === data.id)) {
      setGateways(gs => gs.map(g => g.id === data.id ? { ...g, ...data } : g));
      window.muurahToast('Konfigurasi ' + data.name + ' berhasil disimpan', 'success');
    } else {
      const id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      setGateways(gs => [...gs, { ...data, id, lastCheck: '—' }]);
      window.muurahToast('Payment gateway "' + data.name + '" berhasil ditambahkan', 'success');
    }
    setEditing(null);
    setAdding(false);
  }
  function deleteGateway(gw) {
    window.muurahConfirm({
      title: 'Hapus payment gateway "' + gw.name + '"?',
      body: 'Transaksi yang menggunakan ' + gw.name + ' akan otomatis dialihkan ke gateway lain yang aktif.',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setGateways(gs => gs.filter(g => g.id !== gw.id));
        window.muurahToast('Payment gateway "' + gw.name + '" dihapus', 'success');
      },
    });
  }
  function toggleGateway(gw) {
    const turningOff = gw.on;
    window.muurahConfirm({
      title: (turningOff ? 'Matikan' : 'Aktifkan') + ' payment gateway "' + gw.name + '"?',
      body: turningOff
        ? 'Transaksi baru tidak akan bisa menggunakan ' + gw.name + ' lagi. Pastikan ada gateway lain yang aktif sebagai pengganti.'
        : gw.name + ' akan kembali bisa dipakai untuk transaksi baru.',
      confirmLabel: turningOff ? 'Matikan' : 'Aktifkan',
      danger: turningOff,
      onConfirm: () => setGateways(gs => gs.map(g => g.id === gw.id ? { ...g, on: !g.on } : g)),
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setAdding(true)} style={primaryBtn()}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Tambah Payment Gateway
        </button>
      </div>
      {gateways.map((gw) => (
        <GatewayCard key={gw.id} gw={gw}
          onToggle={() => toggleGateway(gw)}
          onTest={() => testConnection(gw)}
          onEdit={() => setEditing(gw)}
        />
      ))}
      {(editing || adding) && (
        <GatewayModal gateway={editing} onClose={() => { setEditing(null); setAdding(false); }} onSave={saveGateway} onDelete={editing ? () => { deleteGateway(editing); setEditing(null); } : null} />
      )}
    </div>
  );
}

function GatewayCard({ gw, onToggle, onTest, onEdit }) {
  const [revealed, setRevealed] = usePsState(false);
  const [copied, setCopied] = usePsState(false);
  const [copiedWebhook, setCopiedWebhook] = usePsState(false);
  const t = PG_TONES[gw.tone] || PG_TONES.purple;
  const on = gw.on;
  const keyMask = gw.keyMask;
  const webhook = gw.webhook;

  return (
    <PanelCard padded={false}>
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F0EBFF' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: t.bg, color: t.fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.04em' }}>{gw.initial}</span></div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>{gw.name}</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2 }}>{gw.feeText}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: on ? '#F0FDF4' : '#F0EBFF',
            color: on ? '#16A34A' : '#9085AE',
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
            {on ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <Toggle checked={on} onChange={onToggle} />
        </div>
      </div>

      <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14, opacity: on ? 1 : 0.55, transition: 'opacity 130ms ease' }}>
        <PsField label="API Key (Server)">
          <div style={{ position: 'relative' }}>
            <input value={revealed ? keyMask.replace(/•/g, 'X') : keyMask} readOnly
              style={psInputStyle({ width: '100%', paddingRight: 80, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' })} />
            <div style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
              <button onClick={() => setRevealed(r => !r)} style={iconBtnStyle()} title={revealed ? 'Sembunyikan' : 'Lihat'}>
                <Icons.shieldlock size={13} />
              </button>
              <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }} style={iconBtnStyle()}>
                {copied ? <Icons.check size={13} strokeWidth={2.5} /> : <Icons.copy size={13} />}
              </button>
            </div>
          </div>
        </PsField>

        <PsField label="Webhook URL">
          <div style={{ position: 'relative' }}>
            <input value={webhook} readOnly
              style={psInputStyle({ width: '100%', paddingRight: 38, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#574872' })} />
            <button onClick={() => { setCopiedWebhook(true); setTimeout(() => setCopiedWebhook(false), 1200); }}
              style={{ ...iconBtnStyle(), position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)' }}>
              {copiedWebhook ? <Icons.check size={13} strokeWidth={2.5} /> : <Icons.copy size={13} />}
            </button>
          </div>
        </PsField>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div style={{ fontSize: 11, color: '#9085AE', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icons.check size={12} style={{ color: '#16A34A' }} strokeWidth={2.5} />
            Last health check: <b style={{ color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>{gw.lastCheck}</b>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onTest} style={secondaryBtn()}><Icons.refresh size={13} /> Test Koneksi</button>
            <button onClick={onEdit} style={ghostBtn('#4A2D8C')}>Edit Konfigurasi</button>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

function GatewayModal({ gateway, onClose, onSave, onDelete }) {
  const [form, setForm] = usePsState(gateway ? { ...gateway } : { name: '', initial: '', tone: 'blue', keyMask: '', webhook: '', feeText: '', on: true });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.name.trim() && form.keyMask.trim() && form.webhook.trim();

  React.useEffect(() => {
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Payment Gateway</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {gateway ? 'Edit Konfigurasi — ' + gateway.name : 'Tambah Payment Gateway'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!gateway && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <PsField label="Nama Gateway">
                <PsTextInput value={form.name} onChange={(v) => u('name', v.slice(0, 24))} />
              </PsField>
              <PsField label="Warna Tema">
                <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                  {PG_TONE_LIST.map(tn => {
                    const m = PG_TONES[tn];
                    const active = form.tone === tn;
                    return (
                      <button key={tn} type="button" onClick={() => u('tone', tn)} style={{
                        width: 30, height: 30, borderRadius: 9, cursor: 'pointer',
                        background: m.bg, color: m.fg,
                        border: active ? '2px solid ' + m.fg : '1px solid transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {active && <Icons.check size={13} strokeWidth={2.8} />}
                      </button>
                    );
                  })}
                </div>
              </PsField>
            </div>
          )}

          <PsField label="API Key (Server)">
            <input value={form.keyMask} onChange={(e) => u('keyMask', e.target.value)}
              placeholder="cth. xxx-sk-prod-xxxxxxxxxxxxxxxxxxxx"
              style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} />
          </PsField>

          <PsField label="Webhook URL">
            <input value={form.webhook} onChange={(e) => u('webhook', e.target.value)}
              placeholder="https://api.muurah.com/v1/webhook/..."
              style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} />
          </PsField>

          <PsField label="Keterangan Fee (tampil di kartu)">
            <PsTextInput value={form.feeText} onChange={(v) => u('feeText', v)} />
          </PsField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          {onDelete ? <button onClick={onDelete} style={ghostBtn('#C0001A')}>Hapus Gateway</button> : <span />}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={secondaryBtn()}>Batal</button>
            <button onClick={() => {
              if (!isValid) { window.muurahToast('Lengkapi nama, API key, dan webhook URL', 'error'); return; }
              const initial = form.initial || form.name.trim()[0]?.toUpperCase() || '?';
              const finalData = { ...form, initial };
              if (gateway) {
                window.muurahConfirm({
                  title: 'Simpan perubahan konfigurasi ' + gateway.name + '?',
                  body: 'API key dan webhook URL yang baru akan langsung dipakai untuk transaksi pembayaran selanjutnya. Pastikan kredensial sudah benar.',
                  confirmLabel: 'Simpan Perubahan',
                  onConfirm: () => onSave(finalData),
                });
              } else {
                onSave(finalData);
              }
            }} style={primaryBtn()}>
              <Icons.check size={14} strokeWidth={2.5} /> {gateway ? 'Simpan Perubahan' : 'Tambah Gateway'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   NOTIFIKASI sub-panel
// ════════════════════════════════════════════════════════════════════════════
function NotifSubPanel() {
  const EVENTS = [
    { id: 'tx_gagal',    label: 'Transaksi Gagal',           desc: 'Saat transaksi gagal di sisi biller/supplier',  email: true,  wa: true,  app: true,  tone: 'red' },
    { id: 'sr_low',      label: 'Success Rate < 95%',        desc: 'Saat SR harian turun di bawah ambang batas',    email: true,  wa: false, app: true,  tone: 'amber' },
    { id: 'deposit_low', label: 'Deposit Hampir Habis',      desc: 'Saldo deposit ke biller < Rp 5.000.000',         email: true,  wa: true,  app: true,  tone: 'amber' },
    { id: 'refund',      label: 'Refund Manual',             desc: 'Saat CS/Finance memproses refund manual',       email: true,  wa: false, app: true,  tone: 'purple' },
    { id: 'user_new',    label: 'User Baru',                 desc: 'Setiap user baru mendaftar via aplikasi',       email: false, wa: false, app: true,  tone: 'neutral' },
    { id: 'laporan',     label: 'Laporan Harian',            desc: 'Ringkasan harian dikirim setiap 23:30 WIB',     email: true,  wa: false, app: false, tone: 'green' },
  ];
  const [events, setEvents] = usePsState(EVENTS);
  const setCh = (id, ch, v) => setEvents(es => es.map(e => e.id === id ? { ...e, [ch]: v } : e));

  return (
    <PanelCard title="Notifikasi Sistem" subtitle="Atur channel pengiriman per event" padded={false}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...psThStyle, paddingLeft: 24 }}>Event</th>
            <th style={{ ...psThStyle, textAlign: 'center', width: 90 }}>In-app</th>
            <th style={{ ...psThStyle, textAlign: 'center', width: 90 }}>Email</th>
            <th style={{ ...psThStyle, textAlign: 'center', width: 90, paddingRight: 24 }}>WhatsApp</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => {
            const tones = {
              red:     { bg: '#FCE7E9', fg: '#C0001A' },
              amber:   { bg: '#FFFBEB', fg: '#D97706' },
              purple:  { bg: '#EDE8FF', fg: '#4A2D8C' },
              green:   { bg: '#F0FDF4', fg: '#16A34A' },
              neutral: { bg: '#F0EBFF', fg: '#574872' },
            };
            const t = tones[e.tone] || tones.neutral;
            return (
              <tr key={e.id} style={{ borderTop: '1px solid #F0EBFF', height: 60 }}>
                <td style={{ ...psTdStyle, paddingLeft: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', background: t.fg, flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1A1228' }}>{e.label}</div>
                      <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>{e.desc}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...psTdStyle, textAlign: 'center' }}>
                  <Toggle checked={e.app}   onChange={(v) => setCh(e.id, 'app', v)} />
                </td>
                <td style={{ ...psTdStyle, textAlign: 'center' }}>
                  <Toggle checked={e.email} onChange={(v) => setCh(e.id, 'email', v)} />
                </td>
                <td style={{ ...psTdStyle, textAlign: 'center', paddingRight: 24 }}>
                  <Toggle checked={e.wa}    onChange={(v) => setCh(e.id, 'wa', v)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <FooterBar editor="Sari Indriani" ago="6 jam lalu" testBtn />
    </PanelCard>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   LIMIT TRANSAKSI
// ════════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════════
//   SALDO & LIMIT BILLER (zonasi saldo + limit transaksi, per biller)
// ════════════════════════════════════════════════════════════════════════════
const ZONA_META = {
  blackout: { label: 'Blackout', bg: '#F0EBFF', bd: '#574872', fg: '#574872', dot: '#1A1228' },
  danger:   { label: 'Danger',   bg: '#FCE7E9', bd: '#FCA5A5', fg: '#C0001A', dot: '#C0001A' },
  warning:  { label: 'Warning',  bg: '#FFFBEB', bd: '#FCD34D', fg: '#D97706', dot: '#F59E0B' },
  aman:     { label: 'Aman',     bg: '#F0FDF4', bd: '#86EFAC', fg: '#16A34A', dot: '#16A34A' },
};
const ZONA_ORDER = ['blackout', 'danger', 'warning', 'aman'];

const MAINTENANCE_DEFAULT = { aman: false, warning: false, danger: true, blackout: true };

const BILLER_SALDO_SEED = [
  { id: 'sb-a', nama: 'Supplier A', saldo: 750_000,    mode: 'manual',   t1: 500_000, t2: 1_000_000, t3: 3_000_000, avgHarian: 1_500_000, autoThrottle: false, throttleLimit: 500_000,
    maintenance: { aman: false, warning: false, danger: true, blackout: true },
    produkAffected: ['PDAM Surya Sembada Surabaya', 'Token Listrik PLN 100.000', 'Pulsa Telkomsel 10.000'] },
  { id: 'sb-b', nama: 'Supplier B', saldo: 32_400_000, mode: 'manual',   t1: 500_000, t2: 1_000_000, t3: 3_000_000, avgHarian: 6_000_000, autoThrottle: false, throttleLimit: 500_000,
    maintenance: { aman: false, warning: false, danger: true, blackout: true },
    produkAffected: ['Mobile Legends 86 Diamond', 'Free Fire 100 Diamond'] },
  { id: 'sb-c', nama: 'Supplier C', saldo: 4_500_000,  mode: 'otomatis', t1: null,    t2: null,      t3: null,      avgHarian: 1_800_000, autoThrottle: false, throttleLimit: 500_000,
    maintenance: { aman: false, warning: true, danger: true, blackout: true },
    produkAffected: ['BPJS Kesehatan', 'Internet & TV Indihome'] },
  { id: 'sb-d', nama: 'Supplier D', saldo: 320_000,    mode: 'manual',   t1: 500_000, t2: 1_000_000, t3: 3_000_000, avgHarian: 10_000_000, autoThrottle: true,  throttleLimit: 200_000,
    maintenance: { aman: false, warning: true, danger: true, blackout: true },
    produkAffected: ['Pulsa Telkomsel 100.000', 'Token Listrik PLN 100.000', 'XL Hot Rod 12GB 30 Hari'] },
];

const BILLER_TOPUP_HISTORY_SEED = [
  { id: 'TU-3014', supplier: 'Supplier B', nominal: 20_000_000, metode: 'Transfer Bank',   tgl: '18 Mei · 11:20', oleh: 'Sari Indriani' },
  { id: 'TU-3009', supplier: 'Supplier A', nominal: 10_000_000, metode: 'Virtual Account', tgl: '15 Mei · 09:05', oleh: 'Sari Indriani' },
  { id: 'TU-3001', supplier: 'Supplier C', nominal: 15_000_000, metode: 'Transfer Bank',   tgl: '10 Mei · 16:42', oleh: 'Dimas Pratama' },
];

function getThresholds(b) {
  if (b.mode === 'otomatis') {
    const base = b.avgHarian || 1;
    return { t1: Math.round(base * 0.25), t2: Math.round(base * 0.5), t3: Math.round(base * 1.5) };
  }
  return { t1: b.t1, t2: b.t2, t3: b.t3 };
}
function computeZona(b) {
  const { t1, t2, t3 } = getThresholds(b);
  let zona = 'aman';
  if (b.saldo < t1) zona = 'blackout';
  else if (b.saldo < t2) zona = 'danger';
  else if (b.saldo < t3) zona = 'warning';
  const hoursLeft = b.avgHarian > 0 ? (b.saldo / b.avgHarian) * 24 : Infinity;
  return { zona, t1, t2, t3, hoursLeft, highBurn: hoursLeft < 6 };
}

function SaldoLimitPanel() {
  const [billers, setBillers] = usePsState(BILLER_SALDO_SEED);
  const [history, setHistory] = usePsState(BILLER_TOPUP_HISTORY_SEED);
  const [topupTarget, setTopupTarget] = usePsState(null);
  const [produkModalTarget, setProdukModalTarget] = usePsState(null);
  const [limitForm, setLimitForm] = usePsState({
    minTxn: 5_000, maxTxn: 2_000_000,
    maxHarianTxn: 20, maxHarianNominal: 5_000_000,
    maxBulanan: 20_000_000,
    minTopUp: 10_000, maxTopUp: 10_000_000,
  });
  const ul = (k, v) => setLimitForm(f => ({ ...f, [k]: v }));

  function updateBiller(id, patch) {
    setBillers(bs => bs.map(b => b.id === id ? { ...b, ...patch } : b));
  }
  function saveTopup(nominal, metode) {
    setBillers(bs => bs.map(b => b.id === topupTarget.id ? { ...b, saldo: b.saldo + nominal } : b));
    setHistory(hs => [{ id: 'TU-' + Math.floor(3000 + Math.random() * 999), supplier: topupTarget.nama, nominal, metode, tgl: 'Baru saja', oleh: 'Anda' }, ...hs]);
    window.muurahToast('Top-up Rp ' + nominal.toLocaleString('id-ID') + ' ke ' + topupTarget.nama + ' berhasil', 'success');
    setTopupTarget(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PanelCard title="Saldo & Zonasi Biller" subtitle="Saldo prepaid Muurah di tiap aggregator/biller, zonasi alert, dan top-up" padded={false}>
        {/* Legend */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F0EBFF', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#9085AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status Saldo:</span>
          {ZONA_ORDER.map((key) => {
            const m = ZONA_META[key];
            return (
              <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#574872', fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: m.dot }} />
                {m.label}
              </span>
            );
          })}
          <span style={{ fontSize: 11, color: '#9085AE', marginLeft: 'auto' }}>
            ⚠️ Badge "Traffic Tinggi" muncul kalau prediksi saldo habis &lt; 6 jam
          </span>
        </div>

        {/* Active maintenance summary */}
        {(() => {
          const activeMaint = billers.flatMap(b => {
            const { zona } = computeZona(b);
            return (b.maintenance[zona] && b.produkAffected.length > 0)
              ? [{ biller: b.nama, zona, produk: b.produkAffected }]
              : [];
          });
          if (activeMaint.length === 0) return null;
          return (
            <div style={{ padding: '12px 24px', background: '#FFFBEB', borderBottom: '1px solid #FCD34D', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706', letterSpacing: '0.6px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icons.alert size={12} strokeWidth={2.6} /> Produk Sedang Menampilkan Pop-up di End-User App
              </span>
              {activeMaint.map((a) => (
                <div key={a.biller} style={{ fontSize: 12, color: '#574872' }}>
                  <span style={{ fontWeight: 700, color: ZONA_META[a.zona].fg }}>{ZONA_META[a.zona].label}</span>
                  {' · ' + a.biller + ' — '}
                  <span style={{ color: '#1A1228' }}>{a.produk.join(', ')}</span>
                </div>
              ))}
            </div>
          );
        })()}

        <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: `repeat(${billers.length}, 1fr)`, gap: 14 }}>
          {billers.map((b) => (
            <BillerSaldoCard key={b.id} biller={b}
              onUpdate={(patch) => updateBiller(b.id, patch)}
              onTopUp={() => setTopupTarget(b)}
              onOpenProdukModal={() => setProdukModalTarget(b.id)} />
          ))}
        </div>

        {history.length > 0 && (
          <div style={{ borderTop: '1px solid #F0EBFF' }}>
            <div style={{ padding: '10px 24px', fontSize: 10, fontWeight: 700, color: '#9085AE', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Riwayat Top-up Terakhir
            </div>
            {history.slice(0, 3).map((h, idx) => (
              <div key={h.id} style={{
                padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderTop: idx === 0 ? 0 : '1px solid #F0EBFF', fontSize: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4A2D8C', fontWeight: 700 }}>{h.id}</span>
                  <span style={{ color: '#574872' }}>{h.supplier}</span>
                  <span style={{ color: '#9085AE' }}>via {h.metode}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#16A34A' }}>+ Rp {h.nominal.toLocaleString('id-ID')}</span>
                  <span style={{ color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>{h.tgl}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelCard>

      <PanelCard title="Limit Transaksi" subtitle="Atur batas minimum dan maksimum transaksi untuk semua user — berlaku global di semua biller">
        <FormSection title="Limit Per Transaksi" subtitle2="Berlaku untuk semua pembelian PPOB">
          <FormRow>
            <PsField label="Minimal pembelian"><PsPriceInput value={limitForm.minTxn} onChange={(v) => ul('minTxn', v)} /></PsField>
            <PsField label="Maksimal per transaksi"><PsPriceInput value={limitForm.maxTxn} onChange={(v) => ul('maxTxn', v)} /></PsField>
          </FormRow>
        </FormSection>
        <FormSection title="Limit Harian Per User" subtitle2="Akumulasi seluruh transaksi user dalam 1 hari">
          <FormRow>
            <PsField label="Maks transaksi / hari"><PsNumberInput value={limitForm.maxHarianTxn} onChange={(v) => ul('maxHarianTxn', v)} suffix="transaksi" /></PsField>
            <PsField label="Maks nominal / hari"><PsPriceInput value={limitForm.maxHarianNominal} onChange={(v) => ul('maxHarianNominal', v)} /></PsField>
          </FormRow>
        </FormSection>
        <FormSection title="Limit Bulanan" subtitle2="Akumulasi seluruh transaksi user dalam 1 bulan kalender">
          <FormRow single>
            <PsField label="Maks nominal / bulan"><PsPriceInput value={limitForm.maxBulanan} onChange={(v) => ul('maxBulanan', v)} /></PsField>
          </FormRow>
        </FormSection>
        <FormSection title="Limit Top-Up Saldo" subtitle2="Berlaku untuk semua top-up melalui channel pembayaran" last>
          <FormRow>
            <PsField label="Minimal top-up"><PsPriceInput value={limitForm.minTopUp} onChange={(v) => ul('minTopUp', v)} /></PsField>
            <PsField label="Maksimal top-up"><PsPriceInput value={limitForm.maxTopUp} onChange={(v) => ul('maxTopUp', v)} /></PsField>
          </FormRow>
        </FormSection>
        <FooterBar editor="Dimas Pratama" ago="3 jam lalu" confirmCrucial="Limit Transaksi" />
      </PanelCard>

      {topupTarget && (
        <BillerTopUpModal biller={topupTarget} onClose={() => setTopupTarget(null)} onSave={saveTopup} />
      )}
      {produkModalTarget && (
        <ProdukTerdampakModal biller={billers.find(x => x.id === produkModalTarget)} onClose={() => setProdukModalTarget(null)}
          onChange={(list) => updateBiller(produkModalTarget, { produkAffected: list })} />
      )}
    </div>
  );
}

function BillerSaldoCard({ biller: b, onUpdate, onTopUp, onOpenProdukModal }) {
  const { zona, t1, t2, t3, hoursLeft, highBurn } = computeZona(b);
  const m = ZONA_META[zona];

  // visual scale: blackout/danger/warning each take 22% width, aman takes remaining 34%
  const scaleMax = t3 * 1.4;
  const segWidths = [t1, t2 - t1, t3 - t2, scaleMax - t3].map(w => Math.max(0, (w / scaleMax) * 100));
  const markerPct = Math.min(98, (b.saldo / scaleMax) * 100);

  return (
    <div style={{
      border: `1px solid ${m.bd}`, borderRadius: 12, padding: 14,
      background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative',
    }}>
      {highBurn && (
        <div title={'Estimasi saldo habis dalam ~' + hoursLeft.toFixed(1) + ' jam'} style={{
          position: 'absolute', top: -8, right: 10,
          background: '#1A1228', color: '#FFD3C4', fontSize: 10, fontWeight: 700,
          padding: '3px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4,
          boxShadow: '0 2px 6px rgba(26,18,40,0.25)',
        }}>
          <Icons.alert size={11} strokeWidth={2.6} /> Traffic Tinggi
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1228' }}>{b.nama}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, color: m.fg, background: m.bg,
          padding: '3px 9px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: m.dot }} />
          {m.label}
        </span>
      </div>

      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em', color: '#1A1228' }}>
        Rp {b.saldo.toLocaleString('id-ID')}
      </div>

      {/* Segmented status bar with current-saldo marker */}
      <div style={{ position: 'relative', paddingTop: 10 }}>
        <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
          {ZONA_ORDER.map((key, i) => (
            <div key={key} style={{ width: segWidths[i] + '%', background: ZONA_META[key].dot, opacity: zona === key ? 1 : 0.35 }} />
          ))}
        </div>
        <div style={{
          position: 'absolute', top: 0, left: `calc(${markerPct}% - 5px)`,
          width: 0, height: 0,
          borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
          borderTop: `7px solid ${m.dot}`,
        }} title={'Saldo saat ini'} />
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['manual', 'otomatis'].map(md => {
          const active = b.mode === md;
          return (
            <button key={md} type="button" onClick={() => {
              if (md === b.mode) return;
              window.muurahConfirm({
                title: 'Ubah mode threshold ' + b.nama + ' ke "' + md + '"?',
                body: md === 'otomatis'
                  ? 'Threshold T1/T2/T3 akan dihitung otomatis dari rata-rata transaksi harian, menggantikan nilai manual yang sudah diatur.'
                  : 'Threshold akan kembali ke nilai manual yang diatur sebelumnya (atau default jika belum pernah diisi).',
                confirmLabel: 'Ya, Ubah Mode',
                onConfirm: () => onUpdate({ mode: md, ...(md === 'manual' && b.t1 == null ? { t1: 500_000, t2: 1_000_000, t3: 3_000_000 } : {}) }),
              });
            }} style={{
              flex: 1, padding: '5px 8px', borderRadius: 7, cursor: 'pointer',
              background: active ? '#4A2D8C' : '#F0EBFF',
              color: active ? '#FFFFFF' : '#574872',
              border: 0, fontSize: 11, fontWeight: 600, fontFamily: 'inherit', textTransform: 'capitalize',
            }}>{md}</button>
          );
        })}
      </div>

      {b.mode === 'manual' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <BillerThresholdInput swatchFrom="blackout" swatchTo="danger" value={b.t1} onChange={(v) => onUpdate({ t1: v })} />
          <BillerThresholdInput swatchFrom="danger" swatchTo="warning" value={b.t2} onChange={(v) => onUpdate({ t2: v })} />
          <BillerThresholdInput swatchFrom="warning" swatchTo="aman" value={b.t3} onChange={(v) => onUpdate({ t3: v })} />
        </div>
      ) : (
        <div style={{ fontSize: 11, lineHeight: 1.7, color: '#574872', background: '#F0EBFF', borderRadius: 8, padding: '8px 10px' }}>
          Rata-rata harian: <b style={{ fontFamily: 'JetBrains Mono, monospace' }}>Rp {b.avgHarian.toLocaleString('id-ID')}</b>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
            <ThresholdPreviewLine swatchFrom="blackout" swatchTo="danger" value={t1} />
            <ThresholdPreviewLine swatchFrom="danger" swatchTo="warning" value={t2} />
            <ThresholdPreviewLine swatchFrom="warning" swatchTo="aman" value={t3} />
          </div>
        </div>
      )}

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, cursor: 'pointer', color: '#574872' }}>
        <Toggle checked={b.autoThrottle} onChange={(v) => {
          window.muurahConfirm({
            title: (v ? 'Aktifkan' : 'Matikan') + ' auto-turunkan limit untuk ' + b.nama + '?',
            body: v
              ? 'Saat status biller masuk Danger atau Blackout, limit maksimum per transaksi untuk produk dari biller ini akan otomatis diturunkan ke nilai yang diatur.'
              : 'Limit transaksi untuk biller ini akan kembali mengikuti Limit Transaksi global, walaupun status sedang Danger/Blackout.',
            confirmLabel: v ? 'Aktifkan' : 'Matikan',
            danger: !v,
            onConfirm: () => onUpdate({ autoThrottle: v }),
          });
        }} />
        Auto-turunkan limit saat Danger/Blackout
      </label>
      {b.autoThrottle && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: '#9085AE', fontWeight: 600 }}>Limit maks per transaksi saat kritis</span>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#9085AE' }}>Rp</span>
            <input type="text" value={b.throttleLimit.toLocaleString('id-ID')}
              onChange={(e) => onUpdate({ throttleLimit: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
              style={{
                width: '100%', background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 7,
                height: 28, padding: '0 8px 0 28px', fontSize: 11, fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace', color: '#1A1228', outline: 'none',
              }} />
          </div>
        </div>
      )}

      {/* Pop-up actions per status */}
      <div style={{ borderTop: '1px solid #F0EBFF', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#9085AE', letterSpacing: '0.6px', textTransform: 'uppercase' }}>Aksi Pop-up per Status</span>
        {ZONA_ORDER.map((key) => {
          const zm = ZONA_META[key];
          const isAman = key === 'aman';
          const isActive = zona === key && b.maintenance[key];
          return (
            <label key={key} style={{
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
              cursor: isAman ? 'default' : 'pointer',
              padding: '4px 6px', borderRadius: 6,
              background: isActive ? zm.bg : 'transparent',
            }}>
              <Toggle checked={b.maintenance[key]} disabled={isAman}
                onChange={(v) => {
                  window.muurahConfirm({
                    title: (v ? 'Aktifkan' : 'Matikan') + ' pop-up saat status "' + zm.label + '" untuk ' + b.nama + '?',
                    body: v
                      ? 'Saat ' + b.nama + ' berstatus ' + zm.label + ', semua produk di daftar "Produk Terdampak" (' + b.produkAffected.length + ' produk) akan menampilkan pop-up ke end-user.'
                      : 'Pop-up tidak akan muncul ke end-user lagi saat ' + b.nama + ' berstatus ' + zm.label + ', meskipun produk masih ada di daftar terdampak.',
                    confirmLabel: v ? 'Aktifkan' : 'Matikan',
                    danger: !v && key !== 'aman',
                    onConfirm: () => onUpdate({ maintenance: { ...b.maintenance, [key]: v } }),
                  });
                }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: zm.dot, flexShrink: 0 }} />
              <span style={{ color: isAman ? '#9085AE' : '#574872' }}>
                Tampilkan pop-up saat <b>{zm.label}</b>
              </span>
              {isActive && (
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: zm.fg, background: '#FFFFFF', padding: '2px 6px', borderRadius: 4 }}>AKTIF</span>
              )}
            </label>
          );
        })}
      </div>

      {/* Produk terdampak */}
      <button onClick={() => onOpenProdukModal()} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        width: '100%', background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 8,
        height: 34, padding: '0 10px', fontSize: 12, fontWeight: 600, color: '#574872',
        fontFamily: 'inherit', cursor: 'pointer',
      }}>
        <span>Kelola Produk Terdampak Pop-up</span>
        <span style={{
          background: '#F0EBFF', color: '#4A2D8C', fontSize: 11, fontWeight: 700,
          padding: '2px 8px', borderRadius: 10, fontFamily: 'JetBrains Mono, monospace',
        }}>{b.produkAffected.length}</span>
      </button>

      <button onClick={onTopUp} style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
        height: 32, borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
      }}>
        <Icons.wallet size={13} /> Top-up Saldo
      </button>
    </div>
  );
}

const PRODUK_CATALOG_KATEGORI = ['Semua', 'Pulsa', 'Paket Data', 'Token PLN', 'Voucher Game', 'E-Wallet', 'BPJS', 'PDAM', 'Internet & TV', 'Kartu Kredit'];
const PRODUK_CATALOG = [
  { nama: 'Pulsa Telkomsel 10.000', kategori: 'Pulsa' },
  { nama: 'Pulsa Telkomsel 25.000', kategori: 'Pulsa' },
  { nama: 'Pulsa Telkomsel 50.000', kategori: 'Pulsa' },
  { nama: 'Pulsa Telkomsel 100.000', kategori: 'Pulsa' },
  { nama: 'Pulsa Indosat 25.000', kategori: 'Pulsa' },
  { nama: 'Pulsa Indosat 50.000', kategori: 'Pulsa' },
  { nama: 'Pulsa XL 25.000', kategori: 'Pulsa' },
  { nama: 'Pulsa Tri 25.000', kategori: 'Pulsa' },
  { nama: 'XL Hot Rod 12GB 30 Hari', kategori: 'Paket Data' },
  { nama: 'Telkomsel OMG 17GB', kategori: 'Paket Data' },
  { nama: 'Indosat Freedom 15GB', kategori: 'Paket Data' },
  { nama: 'Token Listrik PLN 20.000', kategori: 'Token PLN' },
  { nama: 'Token Listrik PLN 50.000', kategori: 'Token PLN' },
  { nama: 'Token Listrik PLN 100.000', kategori: 'Token PLN' },
  { nama: 'Token Listrik PLN 200.000', kategori: 'Token PLN' },
  { nama: 'Mobile Legends 86 Diamond', kategori: 'Voucher Game' },
  { nama: 'Mobile Legends 172 Diamond', kategori: 'Voucher Game' },
  { nama: 'Free Fire 100 Diamond', kategori: 'Voucher Game' },
  { nama: 'PUBG Mobile 60 UC', kategori: 'Voucher Game' },
  { nama: 'GoPay 50.000', kategori: 'E-Wallet' },
  { nama: 'GoPay 100.000', kategori: 'E-Wallet' },
  { nama: 'OVO 50.000', kategori: 'E-Wallet' },
  { nama: 'Dana 100.000', kategori: 'E-Wallet' },
  { nama: 'ShopeePay 50.000', kategori: 'E-Wallet' },
  { nama: 'BPJS Kesehatan', kategori: 'BPJS' },
  { nama: 'BPJS Ketenagakerjaan', kategori: 'BPJS' },
  { nama: 'PDAM Surya Sembada Surabaya', kategori: 'PDAM' },
  { nama: 'PDAM Tirta Asasta Depok', kategori: 'PDAM' },
  { nama: 'Internet & TV Indihome', kategori: 'Internet & TV' },
  { nama: 'Internet & TV MNC Play', kategori: 'Internet & TV' },
  { nama: 'Kartu Kredit BCA', kategori: 'Kartu Kredit' },
  { nama: 'Kartu Kredit Mandiri', kategori: 'Kartu Kredit' },
];

function ProdukTerdampakModal({ biller, onClose, onChange }) {
  const [katFilter, setKatFilter] = usePsState('Semua');
  const [query, setQuery] = usePsState('');
  const products = biller.produkAffected;

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function toggle(nama) {
    if (products.includes(nama)) {
      onChange(products.filter(x => x !== nama));
    } else {
      onChange([...products, nama]);
    }
  }

  const filtered = PRODUK_CATALOG.filter(p => {
    if (katFilter !== 'Semua' && p.kategori !== katFilter) return false;
    if (query && !p.nama.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 600, maxHeight: 'calc(100vh - 80px)',
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{biller.nama}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>Produk Terdampak Pop-up</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>Pilih produk yang akan menampilkan pop-up ke user saat status biller masuk kondisi yang di-toggle aktif</div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><Icons.x size={16} /></button>
        </div>

        {/* Filter row */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #F0EBFF', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari produk…"
              style={{
                background: '#F0EBFF', border: '1px solid transparent', borderRadius: 10,
                height: 38, padding: '0 12px 0 36px', fontSize: 13, color: '#1A1228',
                outline: 'none', fontFamily: 'inherit', width: '100%',
              }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PRODUK_CATALOG_KATEGORI.map(k => {
              const active = katFilter === k;
              return (
                <button key={k} type="button" onClick={() => setKatFilter(k)} style={{
                  padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                  background: active ? '#4A2D8C' : '#F0EBFF',
                  color: active ? '#FFFFFF' : '#574872',
                  border: 0, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                }}>{k}</button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 1 }}>
                <th style={{ ...psThStyle, width: 44, paddingLeft: 24 }}></th>
                <th style={psThStyle}>Nama Produk</th>
                <th style={{ ...psThStyle, textAlign: 'right', paddingRight: 24 }}>Kategori</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const checked = products.includes(p.nama);
                return (
                  <tr key={p.nama} onClick={() => toggle(p.nama)} style={{
                    borderTop: '1px solid #F0EBFF', height: 46, cursor: 'pointer',
                    background: checked ? '#F0EBFF' : 'transparent',
                  }}
                    onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = '#FAF8FF'; }}
                    onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ ...psTdStyle, paddingLeft: 24 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: checked ? 'none' : '1.5px solid #C5B8EF',
                        background: checked ? '#4A2D8C' : '#FFFFFF',
                        color: '#FFFFFF',
                      }}>
                        {checked && <Icons.check size={12} strokeWidth={3} />}
                      </span>
                    </td>
                    <td style={{ ...psTdStyle, color: '#1A1228', fontWeight: checked ? 600 : 500 }}>{p.nama}</td>
                    <td style={{ ...psTdStyle, textAlign: 'right', paddingRight: 24 }}>
                      <span style={{ fontSize: 11, color: '#574872', background: '#F0EBFF', padding: '3px 9px', borderRadius: 6, fontWeight: 600 }}>{p.kategori}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={3} style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>Produk tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: '#9085AE' }}>
            <b style={{ color: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace' }}>{products.length}</b> produk dipilih
          </span>
          <button onClick={onClose} style={primaryBtn()}>
            <Icons.check size={14} strokeWidth={2.5} /> Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

function BillerThresholdInput({ swatchFrom, swatchTo, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: ZONA_META[swatchFrom].dot }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: ZONA_META[swatchTo].dot }} />
      </span>
      <div style={{ position: 'relative', flex: 1 }}>
        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#9085AE' }}>Rp</span>
        <input type="text" value={value.toLocaleString('id-ID')}
          onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
          style={{
            width: '100%', background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 7,
            height: 28, padding: '0 8px 0 28px', fontSize: 11, fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace', color: '#1A1228', outline: 'none',
          }} />
      </div>
    </div>
  );
}

function ThresholdPreviewLine({ swatchFrom, swatchTo, value }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: ZONA_META[swatchFrom].dot }} />
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: ZONA_META[swatchTo].dot }} />
      </span>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>Rp {value.toLocaleString('id-ID')}</span>
    </span>
  );
}

const BILLER_TOPUP_METODE = ['Transfer Bank', 'Virtual Account', 'Saldo Internal'];
const BILLER_TOPUP_QUICK = [5_000_000, 10_000_000, 25_000_000, 50_000_000];

function BillerTopUpModal({ biller, onClose, onSave }) {
  const [nominal, setNominal] = usePsState(10_000_000);
  const [metode, setMetode] = usePsState(BILLER_TOPUP_METODE[0]);

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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top-up Saldo Biller</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>{biller.nama}</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Saldo saat ini: Rp {biller.saldo.toLocaleString('id-ID')}</div>
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
              {BILLER_TOPUP_QUICK.map(a => (
                <button key={a} type="button" onClick={() => setNominal(a)} style={{
                  flex: 1, padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                  background: nominal === a ? '#4A2D8C' : '#F0EBFF',
                  color: nominal === a ? '#FFFFFF' : '#574872',
                  border: 0, fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
                }}>{(a / 1_000_000) + 'jt'}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Metode</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {BILLER_TOPUP_METODE.map(md => {
                const active = metode === md;
                return (
                  <button key={md} type="button" onClick={() => setMetode(md)} style={{
                    flex: 1, padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
                    background: active ? '#EDE8FF' : '#FFFFFF',
                    border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                    color: active ? '#4A2D8C' : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>{md}</button>
                );
              })}
            </div>
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

// ════════════════════════════════════════════════════════════════════════════
//   FEE & BIAYA ADMIN
// ════════════════════════════════════════════════════════════════════════════
const FEE_CHANNELS = ['Semua Channel', 'Hanya Aplikasi', 'Hanya Reseller API'];
const FEE_KATEGORI_OPTIONS = ['Pulsa', 'Token PLN', 'Paket Data', 'BPJS Kesehatan', 'BPJS Ketenagakerjaan', 'Voucher Game', 'E-Wallet', 'PDAM', 'PBB', 'Internet & TV', 'Kartu Kredit', 'Cicilan', 'eSIM'];

const FEES_SEED = [
  { kat: 'Pulsa',          fixed: 500,   pct: 0.5, channel: 'Semua Channel' },
  { kat: 'Token PLN',      fixed: 1500,  pct: 0.8, channel: 'Semua Channel' },
  { kat: 'Paket Data',     fixed: 1000,  pct: 0.6, channel: 'Semua Channel' },
  { kat: 'BPJS Kesehatan', fixed: 2500,  pct: null, channel: 'Hanya Aplikasi' },
  { kat: 'Voucher Game',   fixed: 0,     pct: 1.5, channel: 'Semua Channel' },
  { kat: 'E-Wallet',       fixed: 1000,  pct: 0.3, channel: 'Semua Channel' },
];

function FeePanel() {
  const [fees, setFees] = usePsState(FEES_SEED);
  const [editing, setEditing] = usePsState(null);
  const [adding, setAdding] = usePsState(false);

  function deleteFee(kat) {
    window.muurahConfirm({
      title: 'Hapus konfigurasi fee "' + kat + '"?',
      body: 'Transaksi kategori ini akan menggunakan fee default (0) sampai dikonfigurasi ulang.',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setFees(fs => fs.filter(f => f.kat !== kat));
        window.muurahToast('Fee untuk "' + kat + '" dihapus', 'success');
      },
    });
  }
  function saveFee(data) {
    if (fees.some(f => f.kat === data.kat) && (!editing || editing.kat !== data.kat)) {
      window.muurahToast('Kategori "' + data.kat + '" sudah punya konfigurasi fee', 'error');
      return;
    }
    if (editing) {
      setFees(fs => fs.map(f => f.kat === editing.kat ? data : f));
      window.muurahToast('Fee "' + data.kat + '" berhasil diperbarui', 'success');
    } else {
      setFees(fs => [...fs, data]);
      window.muurahToast('Fee untuk "' + data.kat + '" berhasil ditambahkan', 'success');
    }
    setEditing(null);
    setAdding(false);
  }

  return (
    <PanelCard title="Fee & Biaya Admin" subtitle="Biaya tambahan yang dikenakan Muurah di atas harga produk, per kategori dan channel"
      action={<>
        <button onClick={() => setAdding(true)} style={{ ...secondaryBtn(), marginRight: 8 }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Tambah Kategori Fee
        </button>
        <button onClick={() => window.muurahConfirm({
          title: 'Simpan semua perubahan Fee & Biaya Admin?',
          body: 'Perubahan fee per kategori ini akan langsung berlaku untuk transaksi baru di semua channel yang dikonfigurasi.',
          confirmLabel: 'Simpan Semua',
          onConfirm: () => window.muurahToast('Semua konfigurasi fee berhasil disimpan', 'success'),
        })} style={primaryBtn()}>Simpan Semua</button>
      </>} padded={false}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...psThStyle, paddingLeft: 24 }}>Kategori Produk</th>
            <th style={{ ...psThStyle, textAlign: 'right' }}>Fee per Transaksi (Rp)</th>
            <th style={{ ...psThStyle, textAlign: 'right' }}>Fee Persentase (%)</th>
            <th style={psThStyle}>Berlaku Untuk</th>
            <th style={{ ...psThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((f) => (
            <tr key={f.kat} style={{ borderTop: '1px solid #F0EBFF', height: 56 }}>
              <td style={{ ...psTdStyle, paddingLeft: 24, color: '#1A1228', fontWeight: 600 }}>{f.kat}</td>
              <td style={{ ...psTdStyle, textAlign: 'right' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#F0EBFF', borderRadius: 8, padding: '5px 10px',
                }}>
                  <span style={{ fontSize: 11, color: '#9085AE', fontWeight: 500 }}>Rp</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>{f.fixed.toLocaleString('id-ID')}</span>
                </span>
              </td>
              <td style={{ ...psTdStyle, textAlign: 'right' }}>
                {f.pct === null ? (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9085AE' }}>—</span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#F0EBFF', borderRadius: 8, padding: '5px 10px',
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>{f.pct.toFixed(1)}</span>
                    <span style={{ fontSize: 11, color: '#9085AE' }}>%</span>
                  </span>
                )}
              </td>
              <td style={psTdStyle}>
                <span style={{
                  fontSize: 11, color: f.channel === 'Hanya Aplikasi' ? '#4A2D8C' : '#574872',
                  background: f.channel === 'Hanya Aplikasi' ? '#EDE8FF' : '#F0EBFF',
                  padding: '4px 10px', borderRadius: 8, fontWeight: 600,
                }}>{f.channel}</span>
              </td>
              <td style={{ ...psTdStyle, paddingRight: 24, textAlign: 'right' }}>
                <button onClick={() => setEditing(f)} style={ghostBtn('#4A2D8C')}>Edit</button>
                <button onClick={() => deleteFee(f.kat)} style={ghostBtn('#C0001A')}>Hapus</button>
              </td>
            </tr>
          ))}
          {fees.length === 0 && (
            <tr><td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>Belum ada konfigurasi fee. Klik "Tambah Kategori Fee".</td></tr>
          )}
        </tbody>
      </table>

      {(editing || adding) && (
        <FeeModal fee={editing} existingKategori={fees.map(f => f.kat)} onClose={() => { setEditing(null); setAdding(false); }} onSave={saveFee} />
      )}
    </PanelCard>
  );
}

function FeeModal({ fee, existingKategori, onClose, onSave }) {
  const [form, setForm] = usePsState(fee ? { ...fee, pct: fee.pct === null ? '' : fee.pct } : { kat: '', fixed: 0, pct: '', channel: FEE_CHANNELS[0] });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const availableKategori = FEE_KATEGORI_OPTIONS.filter(k => k === form.kat || !existingKategori.includes(k));
  const isValid = form.kat;

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 480, background: '#FFFFFF', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(26,18,40,0.25)',
        display: 'flex', flexDirection: 'column',
        animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Fee & Biaya Admin</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {fee ? 'Edit Fee Kategori' : 'Tambah Kategori Fee'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PsField label="Kategori Produk">
            {fee ? (
              <input value={form.kat} disabled style={psInputStyle({ width: '100%', opacity: 0.6, cursor: 'not-allowed' })} />
            ) : (
              <PsSelect value={form.kat || availableKategori[0] || ''} onChange={(v) => u('kat', v)} options={availableKategori} />
            )}
          </PsField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PsField label="Fee per Transaksi (Rp)">
              <PsPriceInput value={form.fixed} onChange={(v) => u('fixed', v)} />
            </PsField>
            <PsField label="Fee Persentase (%) — kosongkan jika tidak ada">
              <input type="number" step="0.1" min="0" value={form.pct} onChange={(e) => u('pct', e.target.value)}
                placeholder="cth. 0.5"
                style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PsField>
          </div>

          <PsField label="Berlaku Untuk">
            <PsSelect value={form.channel} onChange={(v) => u('channel', v)} options={FEE_CHANNELS} />
          </PsField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={onClose} style={secondaryBtn()}>Batal</button>
          <button onClick={() => {
            if (!isValid) { window.muurahToast('Pilih kategori produk terlebih dahulu', 'error'); return; }
            onSave({ ...form, kat: form.kat || availableKategori[0], pct: form.pct === '' ? null : parseFloat(form.pct) });
          }} style={primaryBtn()}>
            <Icons.check size={14} strokeWidth={2.5} /> {fee ? 'Simpan Perubahan' : 'Tambah Fee'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   ROLE & AKSES (sub-panel: permission matrix)
// ════════════════════════════════════════════════════════════════════════════
function RbacPanel({ perms, onToggle, onAdd, onRename, onDelete }) {
  const { useState: usePsLocal, useEffect: usePsLocalEffect } = React;
  const [roles, setRoles] = usePsLocal(() => window.MuurahRolesStore ? window.MuurahRolesStore.get() : [
    { id: 'sa', label: 'Super Admin', tone: 'purple', members: 2 },
    { id: 'ao', label: 'Admin Ops',   tone: 'lime',   members: 5 },
    { id: 'fn', label: 'Finance',     tone: 'green',  members: 3 },
    { id: 'cs', label: 'CS',          tone: 'gold',   members: 8 },
  ]);
  const [newPerm, setNewPerm] = usePsLocal('');
  const [renamingIdx, setRenamingIdx] = usePsLocal(null);

  usePsLocalEffect(() => {
    if (!window.MuurahRolesStore) return;
    return window.MuurahRolesStore.subscribe(setRoles);
  }, []);

  return (
    <PanelCard title="Matrix Hak Akses (RBAC)" subtitle="Centang untuk memberikan permission ke role — kolom role otomatis sync dari menu Role & Tim" padded={false}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...psThStyle, paddingLeft: 24, width: '35%' }}>Permission</th>
            {roles.map(r => <RbacRoleHeader key={r.id} role={r} />)}
            <th style={{ ...psThStyle, width: 44 }}></th>
          </tr>
        </thead>
        <tbody>
          {perms.map((p, i) => (
            <tr key={i} style={{ borderTop: '1px solid #F0EBFF', height: 52 }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ ...psTdStyle, paddingLeft: 24, color: '#1A1228', fontWeight: 500 }}>
                {renamingIdx === i ? (
                  <input autoFocus defaultValue={p.perm}
                    onBlur={(e) => { onRename(i, e.target.value); setRenamingIdx(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { onRename(i, e.target.value); setRenamingIdx(null); } if (e.key === 'Escape') setRenamingIdx(null); }}
                    style={{ background: '#F0EBFF', border: '1px solid #C5B8EF', borderRadius: 8, height: 30, padding: '0 8px', fontSize: 13, color: '#1A1228', outline: 'none', fontFamily: 'inherit', width: '90%' }} />
                ) : p.perm}
              </td>
              {roles.map(r => (
                <PermCell key={r.id} allowed={!!p[r.id]} onClick={() => onToggle(i, r.id)} locked={r.id === 'sa'} />
              ))}
              <td style={{ ...psTdStyle, textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', gap: 2 }}>
                  <button onClick={() => setRenamingIdx(i)} title="Ubah nama" style={{ width: 22, height: 22, border: 0, borderRadius: 6, background: 'transparent', color: '#9085AE', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.cog size={12} />
                  </button>
                  <button onClick={() => onDelete(i)} title="Hapus" style={{ width: 22, height: 22, border: 0, borderRadius: 6, background: 'transparent', color: '#C0001A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.x size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {/* Add permission row */}
          <tr style={{ borderTop: '1px solid #F0EBFF', height: 52 }}>
            <td style={{ ...psTdStyle, paddingLeft: 24 }} colSpan={2 + roles.length}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input value={newPerm} onChange={(e) => setNewPerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(newPerm); setNewPerm(''); } }}
                  placeholder="Nama permission baru… (cth. Kelola Banner Homepage)"
                  style={{ background: '#F0EBFF', border: '1px solid transparent', borderRadius: 8, height: 34, padding: '0 10px', fontSize: 13, color: '#1A1228', outline: 'none', fontFamily: 'inherit', width: 340 }} />
                <button onClick={() => { onAdd(newPerm); setNewPerm(''); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF', height: 34, padding: '0 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Tambah Permission
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ padding: '14px 24px', borderTop: '1px solid #E0D9F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#574872' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={permChip(true)}>✓</span> Diizinkan
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={permChip(false)}>—</span> Tidak diizinkan
          </span>
        </div>
        <button onClick={() => window.muurahGoTo('role-tim')} style={ghostBtn('#4A2D8C')}>
          Kelola Role & Tim <Icons.arrowR size={13} />
        </button>
      </div>
    </PanelCard>
  );
}

function RbacRoleHeader({ role }) {
  const tones = {
    purple:{bg:'#EDE8FF',fg:'#4A2D8C'}, lime:{bg:'#F4FCE3',fg:'#5B7C12'},
    green:{bg:'#F0FDF4',fg:'#16A34A'}, gold:{bg:'#FEF9EC',fg:'#D4900A'},
    coral:{bg:'#FFF1ED',fg:'#FF6B4A'}, blue:{bg:'#EFF6FF',fg:'#3B82F6'},
  };
  const t = tones[role.tone] || tones.purple;
  return (
    <th style={{ ...psThStyle, textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <span style={{ background: t.bg, color: t.fg, padding: '2px 9px', borderRadius: 6, fontWeight: 700, fontSize: 11, letterSpacing: '0.04em' }}>{role.label}</span>
        <span style={{ fontSize: 10, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace', textTransform: 'none', letterSpacing: 0 }}>{role.members} user</span>
      </div>
    </th>
  );
}

function PermCell({ allowed, onClick, locked }) {
  return (
    <td style={{ ...psTdStyle, padding: '8px 14px', textAlign: 'center' }}>
      <button onClick={onClick} style={{
        ...permChip(allowed),
        border: 0, cursor: 'pointer',
        outline: locked ? '1.5px dashed ' + (allowed ? '#86EFAC' : '#C5B8EF') : 'none',
        outlineOffset: -2,
      }} title={locked ? 'Super Admin selalu punya akses penuh' : (allowed ? 'Klik untuk cabut' : 'Klik untuk izinkan')}>
        {allowed ? <Icons.check size={15} strokeWidth={2.8} /> : <span style={{ fontWeight: 700, fontSize: 13 }}>—</span>}
      </button>
    </td>
  );
}

function permChip(allowed) {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 8,
    background: allowed ? '#F0FDF4' : '#F0EBFF',
    color: allowed ? '#16A34A' : '#9085AE',
  };
}

// ════════════════════════════════════════════════════════════════════════════
//   AUDIT LOG (sub-panel)
// ════════════════════════════════════════════════════════════════════════════
function AuditPanel() {
  const ROWS = [
    { w: '19 Mei 2026 · 14:42:18', u: 'Dimas Pratama', r: 'Admin Operasional', rt: 'lime',   a: 'PRODUCT_UPDATE', d: 'Mengubah harga jual TSEL-PUL-50 dari Rp 50.250 → Rp 50.500',            ip: '110.139.42.18' },
    { w: '19 Mei 2026 · 14:38:02', u: 'Sari Indriani', r: 'Finance',           rt: 'green',  a: 'REPORT_EXPORT',  d: 'Mengunduh Laporan Keuangan 1–19 Mei 2026 (PDF)',                       ip: '110.139.42.22' },
    { w: '19 Mei 2026 · 14:32:45', u: 'Dimas Pratama', r: 'Admin Operasional', rt: 'lime',   a: 'USER_SUSPEND',   d: 'Suspend user Maya Sari (U-00042308) — alasan: aktivitas mencurigakan',  ip: '110.139.42.18' },
    { w: '19 Mei 2026 · 14:21:09', u: 'Andre Wijaya',  r: 'CS',                rt: 'gold',   a: 'TX_REFUND',      d: 'Memproses refund TXN-9912832 sebesar Rp 96.000',                      ip: '110.139.42.31' },
    { w: '19 Mei 2026 · 13:55:14', u: 'Dimas Pratama', r: 'Admin Operasional', rt: 'lime',   a: 'RBAC_UPDATE',    d: 'Menambah permission "Reproses / Refund" untuk role CS',                ip: '110.139.42.18' },
    { w: '19 Mei 2026 · 13:40:27', u: 'Sari Indriani', r: 'Finance',           rt: 'green',  a: 'RECON_APPROVE',  d: 'Menyetujui hasil rekonsiliasi 18 Mei 2026 (Supplier B)',               ip: '110.139.42.22' },
    { w: '19 Mei 2026 · 12:08:51', u: 'Adi Rahmawan',  r: 'Super Admin',       rt: 'purple', a: 'LIMIT_UPDATE',   d: 'Mengubah Limit Bulanan: Rp 15.000.000 → Rp 20.000.000',               ip: '110.139.42.10' },
    { w: '19 Mei 2026 · 11:47:33', u: 'SYSTEM',        r: 'SYSTEM',            rt: 'red',    a: 'AUTH_FAILED',    d: '3× percobaan login gagal untuk budi.raharjo@gmail.com — IP diblok',  ip: '36.81.122.45', sys: true },
  ];

  return (
    <PanelCard title="Audit Log Sistem" subtitle="Semua aktivitas admin tercatat di sini · immutable, read-only"
      action={<button style={secondaryBtn()}><Icons.download size={13} /> Export Log</button>} padded={false}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...psThStyle, paddingLeft: 24 }}>Waktu</th>
            <th style={psThStyle}>User</th>
            <th style={psThStyle}>Role</th>
            <th style={psThStyle}>Aksi</th>
            <th style={psThStyle}>Detail</th>
            <th style={{ ...psThStyle, paddingRight: 24, textAlign: 'right' }}>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i} style={{ borderTop: '1px solid #F0EBFF', background: r.sys ? '#EDE8FF' : '#FFFFFF', height: 52 }}>
              <td style={{ ...psTdStyle, paddingLeft: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#574872' }}>{r.w}</td>
              <td style={psTdStyle}>
                {r.sys ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#FCE7E9', color: '#C0001A',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 800,
                    padding: '3px 9px', borderRadius: 6, letterSpacing: '0.06em',
                  }}>
                    <Icons.alert size={10} strokeWidth={2.5} /> SYSTEM
                  </span>
                ) : (
                  <span style={{ fontWeight: 600, color: '#1A1228' }}>{r.u}</span>
                )}
              </td>
              <td style={psTdStyle}><RoleHeaderChip role={r.r} tone={r.rt} /></td>
              <td style={psTdStyle}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, fontWeight: 700,
                  color: r.sys ? '#C0001A' : '#4A2D8C',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>{r.a}</span>
              </td>
              <td style={{ ...psTdStyle, color: '#1A1228', maxWidth: 0 }}>
                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.d}</span>
              </td>
              <td style={{ ...psTdStyle, paddingRight: 24, textAlign: 'right',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#574872' }}>{r.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '14px 24px', borderTop: '1px solid #E0D9F5', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#574872' }}>
          Menampilkan <b style={{ color: '#1A1228' }}>1–8</b> dari <b style={{ color: '#1A1228' }}>4.891</b> log entries
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button disabled style={pageBtn(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
          <button style={{ ...pageBtn(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
          <button style={pageBtn(false)}>2</button>
          <button style={pageBtn(false)}>3</button>
          <span style={{ color: '#9085AE', padding: '0 6px', fontSize: 12 }}>…</span>
          <button style={pageBtn(false)}>612</button>
          <button style={pageBtn(false)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
        </div>
      </div>
    </PanelCard>
  );
}

function RoleHeaderChip({ role, tone }) {
  const tones = { purple:{bg:'#EDE8FF',fg:'#4A2D8C'}, lime:{bg:'#F4FCE3',fg:'#5B7C12'},
    green:{bg:'#F0FDF4',fg:'#16A34A'}, gold:{bg:'#FEF9EC',fg:'#D4900A'}, red:{bg:'#FCE7E9',fg:'#C0001A'} };
  const t = tones[tone] || tones.purple;
  if (role === 'SYSTEM') return <span style={{ color: '#9085AE', fontSize: 11 }}>—</span>;
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>{role}</span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SHARED PANEL BITS
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
      <div style={padded ? { padding: '20px 24px' } : {}}>
        {children}
      </div>
    </Card>
  );
}

function FormSection({ title, subtitle2, children, last }) {
  return (
    <div style={{
      paddingBottom: 20, marginBottom: 20,
      borderBottom: last ? 0 : '1px solid #F0EBFF',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: '#9085AE',
        letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 4,
      }}>{title}</div>
      {subtitle2 && <div style={{ fontSize: 12, color: '#574872', marginBottom: 14 }}>{subtitle2}</div>}
      {!subtitle2 && <div style={{ height: 6 }} />}
      {children}
    </div>
  );
}

function FormRow({ children, single }) {
  return <div style={{ display: 'grid', gridTemplateColumns: single ? '1fr 1fr' : '1fr 1fr', gap: 14 }}>{children}</div>;
}

function PsField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#1A1228' }}>{label}</label>
      {children}
    </div>
  );
}

function PsTextInput({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} style={psInputStyle({ width: '100%' })} />;
}

function PsPriceInput({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        fontSize: 12, color: '#9085AE', fontWeight: 600, pointerEvents: 'none' }}>Rp</span>
      <input type="text" value={value.toLocaleString('id-ID')}
        onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
        style={psInputStyle({ width: '100%', paddingLeft: 34, paddingRight: 12,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, textAlign: 'right' })} />
    </div>
  );
}

function PsNumberInput({ value, onChange, suffix }) {
  return (
    <div style={{ position: 'relative' }}>
      <input type="text" value={value}
        onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
        style={psInputStyle({ width: '100%', paddingRight: suffix ? 84 : 12,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 })} />
      {suffix && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        fontSize: 12, color: '#9085AE', pointerEvents: 'none' }}>{suffix}</span>}
    </div>
  );
}

function PsSelect({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        ...psInputStyle({ width: '100%' }), appearance: 'none',
        paddingRight: 30, cursor: 'pointer', fontWeight: 500,
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icons.chevron size={13} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: '#574872', pointerEvents: 'none',
      }} />
    </div>
  );
}

function EnvChip({ value, current, onClick }) {
  const active = value === current;
  const tones = {
    production:  { bg: '#FCE7E9', fg: '#C0001A', label: 'Production', dot: '#C0001A' },
    staging:     { bg: '#FFFBEB', fg: '#D97706', label: 'Staging',    dot: '#D97706' },
    development: { bg: '#EDE8FF', fg: '#4A2D8C', label: 'Development', dot: '#4A2D8C' },
  };
  const t = tones[value];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', borderRadius: 10,
      border: active ? `1px solid ${t.fg}` : '1px solid #E0D9F5',
      background: active ? t.bg : '#FFFFFF',
      color: active ? t.fg : '#574872',
      fontSize: 13, fontWeight: active ? 700 : 500,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'all 130ms ease',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot }} />
      {t.label}
    </button>
  );
}

function BigToggleRow({ label, desc, checked, onChange, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
      padding: 14, border: '1px solid #E0D9F5', borderRadius: 12,
      background: danger && checked ? '#FBF5F6' : '#FFFFFF',
      marginBottom: 8,
    }}>
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 600, color: danger && checked ? '#C0001A' : '#1A1228',
        }}>
          {danger && checked && <Icons.alert size={13} strokeWidth={2.3} />}
          {label}
        </div>
        <div style={{ fontSize: 12, color: '#574872', marginTop: 2 }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <span onClick={(e) => { e.stopPropagation(); if (!disabled) onChange(!checked); }} role="switch" aria-checked={checked} tabIndex={0}
      style={{
        position: 'relative', display: 'inline-block',
        width: 36, height: 20, borderRadius: 20,
        background: checked ? '#4A2D8C' : '#C5B8EF',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 130ms ease',
        flexShrink: 0, opacity: disabled ? 0.5 : 1,
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

function FooterBar({ editor, ago, testBtn, confirmCrucial }) {
  const handleSave = () => {
    if (confirmCrucial) {
      window.muurahConfirm({
        title: 'Simpan perubahan ' + confirmCrucial + '?',
        body: 'Perubahan ini akan langsung berlaku untuk semua user dan transaksi baru.',
        confirmLabel: 'Simpan Perubahan',
        onConfirm: () => window.muurahToast('Pengaturan berhasil disimpan', 'success'),
      });
      return;
    }
    window.muurahToast('Pengaturan berhasil disimpan', 'success');
  };
  const handleTest = () => window.muurahToast('Test notification dikirim ke admin@muurah.com', 'info');
  return (
    <div style={{
      padding: '14px 24px', borderTop: '1px solid #E0D9F5',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#FAF8FF', margin: '20px -24px -20px',
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#574872' }}>
        <Icons.clock size={13} style={{ color: '#9085AE' }} />
        Terakhir diubah <b style={{ color: '#1A1228' }}>{ago}</b> oleh {editor}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {testBtn && <button onClick={handleTest} style={secondaryBtn()}><Icons.bell size={13} /> Kirim Test</button>}
        <button onClick={() => window.muurahToast('Perubahan dibatalkan', 'info')} style={secondaryBtn()}>Batal</button>
        <button onClick={handleSave} style={primaryBtn()}>
          <Icons.check size={14} strokeWidth={2.5} /> Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

// shared button helpers
function primaryBtn() {
  return { background: '#4A2D8C', color: '#FFFFFF', border: 0, height: 38, padding: '0 18px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6 };
}
function secondaryBtn() {
  return { background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF', height: 38, padding: '0 14px',
    borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6 };
}
function ghostBtn(color) {
  return { background: 'transparent', color, border: 0, padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' };
}
function iconBtnStyle() {
  return { width: 26, height: 26, border: '1px solid #E0D9F5', borderRadius: 7,
    background: '#FFFFFF', color: '#574872', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 };
}
function pageBtn(disabled) {
  return { minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit' };
}

function psInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}

const psThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const psTdStyle = { padding: '12px 14px', verticalAlign: 'middle' };

// ════════════════════════════════════════════════════════════════════════════
//   FAQ & BANTUAN
// ════════════════════════════════════════════════════════════════════════════
const FAQ_CATEGORIES = ['Umum', 'Pembayaran', 'Pulsa & Data', 'Game & Voucher', 'BPJS & Tagihan', 'Reseller', 'Akun & Keamanan'];

const FAQ_SEED = [
  { id: 1, kategori: 'Umum', pertanyaan: 'Apa itu Muurah?', jawaban: 'Muurah adalah platform PPOB (Payment Point Online Bank) yang memudahkan kamu membeli pulsa, paket data, token listrik, voucher game, transfer e-wallet, dan membayar berbagai tagihan langsung dari HP.', status: 'published' },
  { id: 2, kategori: 'Pembayaran', pertanyaan: 'Berapa lama proses transfer e-wallet (GoPay/OVO/Dana/ShopeePay)?', jawaban: 'Transfer antar e-wallet biasanya diproses dalam hitungan detik hingga maksimal 5 menit. Jika lebih dari 15 menit belum masuk, hubungi CS melalui menu Bantuan.', status: 'published' },
  { id: 3, kategori: 'Pembayaran', pertanyaan: 'Metode pembayaran apa saja yang tersedia?', jawaban: 'Saat ini tersedia QRIS, Virtual Account (BCA, BNI, BRI, Mandiri, Permata), E-Wallet (GoPay, OVO, Dana, ShopeePay, LinkAja), dan pembayaran di gerai retail (Alfamart, Indomaret).', status: 'published' },
  { id: 4, kategori: 'Pulsa & Data', pertanyaan: 'Kenapa pulsa/paket data saya belum masuk setelah bayar?', jawaban: 'Umumnya pulsa/paket data masuk dalam 1-5 menit. Jika lebih dari 30 menit belum masuk, mohon screenshot bukti pembayaran dan buat tiket di menu Bantuan agar tim kami bisa membantu cek lebih lanjut.', status: 'published' },
  { id: 5, kategori: 'Game & Voucher', pertanyaan: 'Bagaimana cara mengisi voucher game seperti Mobile Legends atau Free Fire?', jawaban: 'Masukkan User ID dan Server/Zone ID akun game kamu (bisa dilihat di profil game), pilih nominal diamond/voucher, lalu lakukan pembayaran. Voucher akan otomatis masuk ke akun game dalam beberapa menit.', status: 'published' },
  { id: 6, kategori: 'BPJS & Tagihan', pertanyaan: 'Bagaimana cara membayar BPJS Kesehatan/Ketenagakerjaan?', jawaban: 'Pilih layanan BPJS, masukkan nomor peserta/KPJ, sistem akan menampilkan jumlah tunggakan yang harus dibayar, lalu lanjutkan ke pembayaran.', status: 'published' },
  { id: 7, kategori: 'Reseller', pertanyaan: 'Bagaimana cara menjadi reseller Muurah?', jawaban: 'Buka menu Reseller di aplikasi, lengkapi data diri, dan ajukan pendaftaran. Tim kami akan melakukan verifikasi dalam 1-2 hari kerja sebelum akun reseller diaktifkan.', status: 'draft' },
  { id: 8, kategori: 'Akun & Keamanan', pertanyaan: 'Bagaimana jika saya lupa kata sandi/PIN?', jawaban: 'Gunakan fitur "Lupa PIN" di halaman login. Kami akan mengirimkan kode OTP ke nomor HP terdaftar untuk reset PIN.', status: 'published' },
];

function FaqPanel() {
  const [faqs, setFaqs] = usePsState(FAQ_SEED);
  const [katF, setKatF] = usePsState('semua');
  const [query, setQuery] = usePsState('');
  const [editing, setEditing] = usePsState(null);
  const [adding, setAdding] = usePsState(false);

  const filtered = faqs.filter(f => {
    if (katF !== 'semua' && f.kategori !== katF) return false;
    if (query && !`${f.pertanyaan} ${f.jawaban}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function toggleStatus(id) {
    setFaqs(fs => fs.map(f => f.id === id ? { ...f, status: f.status === 'published' ? 'draft' : 'published' } : f));
  }
  function deleteFaq(f) {
    window.muurahConfirm({
      title: 'Hapus pertanyaan ini?',
      body: f.pertanyaan,
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setFaqs(fs => fs.filter(x => x.id !== f.id));
        window.muurahToast('FAQ berhasil dihapus', 'success');
      },
    });
  }
  function saveFaq(data) {
    if (data.id) {
      setFaqs(fs => fs.map(f => f.id === data.id ? { ...f, ...data } : f));
      window.muurahToast('FAQ berhasil diperbarui', 'success');
    } else {
      const newId = Math.max(0, ...faqs.map(f => f.id)) + 1;
      setFaqs(fs => [...fs, { ...data, id: newId }]);
      window.muurahToast('FAQ baru berhasil ditambahkan', 'success');
    }
    setEditing(null);
    setAdding(false);
  }

  return (
    <PanelCard
      title="FAQ & Bantuan"
      subtitle="Kelola pertanyaan yang sering diajukan — tampil di menu Bantuan aplikasi end-user"
      action={<button onClick={() => setAdding(true)} style={primaryBtn()}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah FAQ
      </button>}
      padded={false}
    >
      {/* Filter row */}
      <div style={{ padding: '16px 24px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid #F0EBFF' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 320 }}>
          <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan atau jawaban…"
            style={psInputStyle({ paddingLeft: 36, width: '100%' })} />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={katF} onChange={(e) => setKatF(e.target.value)} style={{
            ...psInputStyle({}), appearance: 'none', paddingRight: 30, cursor: 'pointer', minWidth: 170, fontWeight: 500,
          }}>
            <option value="semua">Semua Kategori</option>
            {FAQ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Icons.chevron size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>
          {filtered.length} dari {faqs.length} FAQ · {faqs.filter(f => f.status === 'published').length} published
        </div>
      </div>

      {/* List */}
      <div>
        {filtered.length === 0 && (
          <div style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>
            Tidak ada FAQ yang cocok dengan filter.
          </div>
        )}
        {filtered.map((f, idx) => (
          <div key={f.id} style={{
            padding: '16px 24px', borderTop: idx === 0 ? 0 : '1px solid #F0EBFF',
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: '#4A2D8C', background: '#EDE8FF',
                  padding: '2px 8px', borderRadius: 6, letterSpacing: '0.02em',
                }}>{f.kategori}</span>
                {f.status === 'draft' && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#D97706', background: '#FFFBEB',
                    padding: '2px 8px', borderRadius: 6,
                  }}>Draft</span>
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1228', lineHeight: 1.4 }}>{f.pertanyaan}</div>
              <div style={{ fontSize: 12, color: '#574872', marginTop: 4, lineHeight: 1.6 }}>{f.jawaban}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <Toggle checked={f.status === 'published'} onChange={() => toggleStatus(f.id)} />
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setEditing(f)} style={ghostBtn('#4A2D8C')}>Edit</button>
                <button onClick={() => deleteFaq(f)} style={ghostBtn('#C0001A')}>Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <FaqModal faq={editing} onClose={() => { setEditing(null); setAdding(false); }} onSave={saveFaq} />
      )}
    </PanelCard>
  );
}

function FaqModal({ faq, onClose, onSave }) {
  const [form, setForm] = usePsState(faq || { kategori: FAQ_CATEGORIES[0], pertanyaan: '', jawaban: '', status: 'published' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.pertanyaan.trim() && form.jawaban.trim();

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

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
              FAQ & Bantuan
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {faq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PsField label="Kategori">
            <PsSelect value={form.kategori} onChange={(v) => u('kategori', v)} options={FAQ_CATEGORIES} />
          </PsField>
          <PsField label="Pertanyaan">
            <PsTextInput value={form.pertanyaan} onChange={(v) => u('pertanyaan', v)} />
          </PsField>
          <PsField label="Jawaban">
            <textarea value={form.jawaban} onChange={(e) => u('jawaban', e.target.value)}
              rows={5}
              style={psInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
          </PsField>
          <PsField label="Status">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle checked={form.status === 'published'} onChange={() => u('status', form.status === 'published' ? 'draft' : 'published')} />
              <span style={{ fontSize: 13, color: '#574872' }}>
                {form.status === 'published' ? 'Published — tampil di aplikasi' : 'Draft — belum tampil di aplikasi'}
              </span>
            </div>
          </PsField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={secondaryBtn()}>Batal</button>
          <button onClick={() => isValid ? onSave(form) : window.muurahToast('Pertanyaan dan jawaban wajib diisi', 'error')}
            style={{ ...primaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {faq ? 'Simpan Perubahan' : 'Tambah FAQ'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   PROMO & VOUCHER
// ════════════════════════════════════════════════════════════════════════════
const PROMO_SCOPES = ['Semua Produk', 'Pulsa', 'Paket Data', 'Token PLN', 'BPJS', 'Game & Voucher', 'E-Money', 'Transfer E-Wallet', 'Tagihan (PDAM/PBB/Internet&TV)'];

const PROMO_SEED = [
  { id: 1, kode: 'CASHBACK5EW', nama: 'Cashback 5% Transfer E-Wallet', tipe: 'percent', nilai: 5, maksDiskon: 5_000, minTransaksi: 50_000, scope: ['Transfer E-Wallet'], mulai: '2026-05-15', akhir: '2026-05-31', kuota: 5000, terpakai: 1842, perUser: 3, status: 'aktif' },
  { id: 2, kode: 'PLNWEEKEND2', nama: 'Token PLN Diskon 2% Weekend', tipe: 'percent', nilai: 2, maksDiskon: 2_000, minTransaksi: 20_000, scope: ['Token PLN'], mulai: '2026-05-23', akhir: '2026-06-30', kuota: 10000, terpakai: 0, perUser: 1, status: 'terjadwal' },
  { id: 3, kode: 'GAMEHEMAT10K', nama: 'Potongan Rp10.000 Voucher Game', tipe: 'nominal', nilai: 10_000, maksDiskon: null, minTransaksi: 50_000, scope: ['Game & Voucher'], mulai: '2026-05-01', akhir: '2026-05-20', kuota: 2000, terpakai: 2000, perUser: 1, status: 'habis' },
  { id: 4, kode: 'NEWUSER25', nama: 'Diskon 25% Pengguna Baru (Semua Produk)', tipe: 'percent', nilai: 25, maksDiskon: 15_000, minTransaksi: 10_000, scope: ['Semua Produk'], mulai: '2026-01-01', akhir: '2026-12-31', kuota: 50000, terpakai: 8120, perUser: 1, status: 'aktif' },
  { id: 5, kode: 'PULSALEBARAN', nama: 'Promo Lebaran Pulsa & Paket Data', tipe: 'nominal', nilai: 3_000, maksDiskon: null, minTransaksi: 25_000, scope: ['Pulsa', 'Paket Data'], mulai: '2026-03-01', akhir: '2026-04-10', kuota: 8000, terpakai: 7960, perUser: 2, status: 'nonaktif' },
];

function PromoPanel() {
  const [promos, setPromos] = usePsState(PROMO_SEED);
  const [statusF, setStatusF] = usePsState('semua');
  const [query, setQuery] = usePsState('');
  const [editing, setEditing] = usePsState(null);
  const [adding, setAdding] = usePsState(false);

  const filtered = promos.filter(p => {
    if (statusF !== 'semua' && p.status !== statusF) return false;
    if (query && !`${p.kode} ${p.nama}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function toggleStatus(id) {
    setPromos(ps => ps.map(p => {
      if (p.id !== id) return p;
      if (p.status === 'habis') {
        window.muurahToast('Kuota promo ini sudah habis, tidak bisa diaktifkan kembali', 'warning');
        return p;
      }
      return { ...p, status: p.status === 'aktif' ? 'nonaktif' : 'aktif' };
    }));
  }
  function deletePromo(p) {
    window.muurahConfirm({
      title: 'Hapus promo "' + p.kode + '"?',
      body: p.nama,
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setPromos(ps => ps.filter(x => x.id !== p.id));
        window.muurahToast('Promo berhasil dihapus', 'success');
      },
    });
  }
  function savePromo(data) {
    if (data.id) {
      setPromos(ps => ps.map(p => p.id === data.id ? { ...p, ...data } : p));
      window.muurahToast('Promo "' + data.kode + '" berhasil diperbarui', 'success');
    } else {
      const newId = Math.max(0, ...promos.map(p => p.id)) + 1;
      setPromos(ps => [...ps, { ...data, id: newId, terpakai: 0 }]);
      window.muurahToast('Promo "' + data.kode + '" berhasil dibuat', 'success');
    }
    setEditing(null);
    setAdding(false);
  }

  return (
    <PanelCard
      title="Promo & Voucher"
      subtitle="Kelola kode promo, periode aktif, dan produk yang berlaku"
      action={<button onClick={() => setAdding(true)} style={primaryBtn()}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Buat Promo
      </button>}
      padded={false}
    >
      <div style={{ padding: '16px 24px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid #F0EBFF' }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 320 }}>
          <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode atau nama promo…"
            style={psInputStyle({ paddingLeft: 36, width: '100%' })} />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} style={{
            ...psInputStyle({}), appearance: 'none', paddingRight: 30, cursor: 'pointer', minWidth: 150, fontWeight: 500,
          }}>
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="terjadwal">Terjadwal</option>
            <option value="nonaktif">Nonaktif</option>
            <option value="habis">Kuota Habis</option>
          </select>
          <Icons.chevron size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>
          {filtered.length} dari {promos.length} promo
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...psThStyle, paddingLeft: 24 }}>Kode</th>
            <th style={psThStyle}>Nama & Scope</th>
            <th style={psThStyle}>Diskon</th>
            <th style={psThStyle}>Periode</th>
            <th style={psThStyle}>Kuota</th>
            <th style={psThStyle}>Status</th>
            <th style={{ ...psThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} style={{ borderTop: '1px solid #F0EBFF', height: 64 }}>
              <td style={{ ...psTdStyle, paddingLeft: 24 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: '#4A2D8C', background: '#EDE8FF', padding: '4px 8px', borderRadius: 6 }}>{p.kode}</span>
              </td>
              <td style={psTdStyle}>
                <div style={{ fontWeight: 600, color: '#1A1228' }}>{p.nama}</div>
                <div style={{ fontSize: 11, color: '#9085AE', marginTop: 3 }}>{p.scope.join(', ')}</div>
              </td>
              <td style={{ ...psTdStyle, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                {p.tipe === 'percent' ? `${p.nilai}%` : 'Rp ' + p.nilai.toLocaleString('id-ID')}
                {p.maksDiskon ? <div style={{ fontSize: 10, color: '#9085AE', fontWeight: 500, marginTop: 2 }}>maks Rp {p.maksDiskon.toLocaleString('id-ID')}</div> : null}
                <div style={{ fontSize: 10, color: '#9085AE', fontWeight: 500, marginTop: 2 }}>min Rp {p.minTransaksi.toLocaleString('id-ID')}</div>
              </td>
              <td style={{ ...psTdStyle, fontSize: 11, color: '#574872', fontFamily: 'JetBrains Mono, monospace' }}>
                {fmtTglPromo(p.mulai)}<br/>– {fmtTglPromo(p.akhir)}
              </td>
              <td style={psTdStyle}>
                <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#574872', marginBottom: 4 }}>
                  {p.terpakai.toLocaleString('id-ID')} / {p.kuota.toLocaleString('id-ID')}
                </div>
                <div style={{ height: 5, background: '#F0EBFF', borderRadius: 4, overflow: 'hidden', width: 80 }}>
                  <div style={{ width: `${Math.min(100, (p.terpakai / p.kuota) * 100)}%`, height: '100%', background: '#4A2D8C', borderRadius: 4 }} />
                </div>
              </td>
              <td style={psTdStyle}><PromoStatusPill status={p.status} /></td>
              <td style={{ ...psTdStyle, paddingRight: 24, textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Toggle checked={p.status === 'aktif'} onChange={() => toggleStatus(p.id)} />
                  <button onClick={() => setEditing(p)} style={ghostBtn('#4A2D8C')}>Edit</button>
                  <button onClick={() => deletePromo(p)} style={ghostBtn('#C0001A')}>Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(adding || editing) && (
        <PromoModal promo={editing} onClose={() => { setEditing(null); setAdding(false); }} onSave={savePromo} />
      )}
    </PanelCard>
  );
}

function fmtTglPromo(iso) {
  const [y, m, d] = iso.split('-');
  const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d} ${bulan[parseInt(m,10)-1]} ${y}`;
}

function PromoStatusPill({ status }) {
  const map = {
    aktif:     { bg: '#F0FDF4', fg: '#16A34A', label: 'Aktif' },
    terjadwal: { bg: '#FFFBEB', fg: '#D97706', label: 'Terjadwal' },
    nonaktif:  { bg: '#F0EBFF', fg: '#9085AE', label: 'Nonaktif' },
    habis:     { bg: '#FCE7E9', fg: '#C0001A', label: 'Kuota Habis' },
  };
  const m = map[status] || map.nonaktif;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: m.fg, background: m.bg, padding: '4px 9px', borderRadius: 6, whiteSpace: 'nowrap' }}>{m.label}</span>
  );
}

function PromoModal({ promo, onClose, onSave }) {
  const [form, setForm] = usePsState(promo ? { ...promo } : {
    kode: '', nama: '', tipe: 'percent', nilai: 0, maksDiskon: 0, minTransaksi: 0,
    scope: ['Semua Produk'], mulai: '2026-06-12', akhir: '2026-06-30', kuota: 1000, perUser: 1, status: 'terjadwal',
  });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.kode.trim() && form.nama.trim() && form.nilai > 0 && form.scope.length > 0 && form.mulai && form.akhir;

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function toggleScope(s) {
    setForm(f => {
      if (s === 'Semua Produk') return { ...f, scope: ['Semua Produk'] };
      let next = f.scope.includes(s) ? f.scope.filter(x => x !== s) : [...f.scope.filter(x => x !== 'Semua Produk'), s];
      if (next.length === 0) next = ['Semua Produk'];
      return { ...f, scope: next };
    });
  }

  function handleSave() {
    if (!isValid) {
      window.muurahToast('Lengkapi kode, nama, nilai diskon, periode, dan scope produk', 'error');
      return;
    }
    onSave({ ...form, kode: form.kode.trim().toUpperCase(), maksDiskon: form.tipe === 'percent' ? (form.maksDiskon || null) : null });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 620, maxHeight: 'calc(100vh - 80px)',
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
              Promo & Voucher
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {promo ? 'Edit Promo' : 'Buat Promo Baru'}
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
            <PsField label="Kode Promo">
              <input value={form.kode} onChange={(e) => u('kode', e.target.value.toUpperCase())}
                placeholder="cth. CASHBACK5EW"
                style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.04em' })} />
            </PsField>
            <PsField label="Nama Promo">
              <PsTextInput value={form.nama} onChange={(v) => u('nama', v)} />
            </PsField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <PsField label="Tipe Diskon">
              <PsSelect value={form.tipe === 'percent' ? 'Persentase (%)' : 'Nominal (Rp)'}
                onChange={(v) => u('tipe', v.startsWith('Persentase') ? 'percent' : 'nominal')}
                options={['Persentase (%)', 'Nominal (Rp)']} />
            </PsField>
            <PsField label={form.tipe === 'percent' ? 'Nilai Diskon (%)' : 'Nilai Diskon (Rp)'}>
              {form.tipe === 'percent'
                ? <PsNumberInput value={form.nilai} onChange={(v) => u('nilai', v)} suffix="%" />
                : <PsPriceInput value={form.nilai} onChange={(v) => u('nilai', v)} />}
            </PsField>
            <PsField label="Maks Diskon (Rp)">
              <PsPriceInput value={form.tipe === 'percent' ? (form.maksDiskon || 0) : 0}
                onChange={(v) => u('maksDiskon', v)} />
              {form.tipe === 'nominal' && <div style={{ fontSize: 10, color: '#9085AE', marginTop: 4 }}>Tidak berlaku untuk tipe nominal</div>}
            </PsField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <PsField label="Min. Transaksi (Rp)">
              <PsPriceInput value={form.minTransaksi} onChange={(v) => u('minTransaksi', v)} />
            </PsField>
            <PsField label="Kuota Total">
              <PsNumberInput value={form.kuota} onChange={(v) => u('kuota', v)} />
            </PsField>
            <PsField label="Limit per User">
              <PsNumberInput value={form.perUser} onChange={(v) => u('perUser', v)} suffix="x" />
            </PsField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PsField label="Periode Mulai">
              <input type="date" value={form.mulai} onChange={(e) => u('mulai', e.target.value)}
                style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PsField>
            <PsField label="Periode Akhir">
              <input type="date" value={form.akhir} onChange={(e) => u('akhir', e.target.value)}
                style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PsField>
          </div>

          <PsField label="Berlaku untuk Produk">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PROMO_SCOPES.map((s) => {
                const active = form.scope.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleScope(s)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 12px', borderRadius: 9, cursor: 'pointer',
                    background: active ? '#EDE8FF' : '#FFFFFF',
                    border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                    color: active ? '#4A2D8C' : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>
                    {active && <Icons.check size={12} strokeWidth={2.8} />} {s}
                  </button>
                );
              })}
            </div>
          </PsField>

          {promo && (
            <PsField label="Status">
              <PsSelect value={
                form.status === 'aktif' ? 'Aktif' :
                form.status === 'terjadwal' ? 'Terjadwal' :
                form.status === 'habis' ? 'Kuota Habis' : 'Nonaktif'
              } onChange={(v) => u('status', v === 'Aktif' ? 'aktif' : v === 'Terjadwal' ? 'terjadwal' : v === 'Kuota Habis' ? 'habis' : 'nonaktif')}
                options={['Aktif', 'Terjadwal', 'Nonaktif', 'Kuota Habis']} />
            </PsField>
          )}
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={secondaryBtn()}>Batal</button>
          <button onClick={handleSave} style={{ ...primaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {promo ? 'Simpan Perubahan' : 'Buat Promo'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SEO
// ════════════════════════════════════════════════════════════════════════════
const SEO_PAGES_SEED = [
  { id: 1, halaman: 'Homepage', slug: '/', metaTitle: 'Muurah — Bayar Pulsa, Token Listrik, Transfer E-Wallet & Tagihan Online', metaDesc: 'Platform PPOB terpercaya untuk bayar pulsa, paket data, token PLN, transfer GoPay/OVO/Dana/ShopeePay, voucher game, BPJS, dan tagihan lainnya dengan harga murah.' },
  { id: 2, halaman: 'Transfer E-Wallet', slug: '/transfer-ewallet', metaTitle: 'Transfer Saldo GoPay, OVO, Dana, ShopeePay — Flat Fee | Muurah', metaDesc: 'Transfer antar e-wallet GoPay, OVO, Dana, ShopeePay, LinkAja dengan biaya flat dan proses instan di Muurah.' },
  { id: 3, halaman: 'Bayar Pulsa & Paket Data', slug: '/pulsa-data', metaTitle: 'Beli Pulsa & Paket Data Semua Operator Murah | Muurah', metaDesc: 'Isi pulsa dan paket data Telkomsel, Indosat, XL, Tri, Smartfren dengan harga termurah dan proses otomatis.' },
  { id: 4, halaman: 'Token Listrik PLN', slug: '/token-listrik', metaTitle: 'Beli Token Listrik PLN Online 24 Jam | Muurah', metaDesc: 'Beli token listrik PLN prabayar kapan saja, langsung masuk ke meteran. Proses cepat dan aman.' },
  { id: 5, halaman: 'Voucher Game', slug: '/voucher-game', metaTitle: 'Top Up Voucher Game Mobile Legends, Free Fire, dll | Muurah', metaDesc: 'Top up diamond Mobile Legends, Free Fire, PUBG Mobile dan voucher game lainnya, proses instan dan aman.' },
  { id: 6, halaman: 'BPJS', slug: '/bpjs', metaTitle: 'Bayar BPJS Kesehatan & Ketenagakerjaan Online | Muurah', metaDesc: 'Cek dan bayar tagihan BPJS Kesehatan dan BPJS Ketenagakerjaan dengan mudah dan cepat di Muurah.' },
  { id: 7, halaman: 'Tips & Promo', slug: '/tips-promo', metaTitle: 'Tips & Promo Terbaru Muurah', metaDesc: 'Dapatkan info promo cashback, diskon, dan tips transaksi PPOB terbaru dari Muurah.' },
];

function SeoPanel() {
  const [global, setGlobal] = usePsState({
    siteTitle: 'Muurah — PPOB Online Terpercaya',
    siteDesc: 'Bayar pulsa, paket data, token PLN, transfer e-wallet, voucher game, BPJS, dan tagihan lainnya dalam satu aplikasi.',
    domain: 'https://muurah.com',
    gaId: 'G-XXXXXXXXXX',
    gscVerification: '',
    robotsIndex: true,
    sitemapEnabled: true,
  });
  const [pages, setPages] = usePsState(SEO_PAGES_SEED);
  const [editing, setEditing] = usePsState(null);
  const [adding, setAdding] = usePsState(false);

  const u = (k, v) => setGlobal(g => ({ ...g, [k]: v }));

  function savePage(data) {
    if (data.id) {
      setPages(ps => ps.map(p => p.id === data.id ? { ...p, ...data } : p));
      window.muurahToast('Meta SEO untuk "' + data.halaman + '" berhasil disimpan', 'success');
    } else {
      const newId = Math.max(0, ...pages.map(p => p.id)) + 1;
      setPages(ps => [...ps, { ...data, id: newId }]);
      window.muurahToast('Meta SEO untuk "' + data.halaman + '" berhasil ditambahkan', 'success');
    }
    setEditing(null);
    setAdding(false);
  }
  function deletePage(p) {
    window.muurahConfirm({
      title: 'Hapus meta SEO untuk "' + p.halaman + '"?',
      body: 'Halaman ini akan kembali memakai Site Title & Meta Description default.',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setPages(ps => ps.filter(x => x.id !== p.id));
        window.muurahToast('Meta SEO "' + p.halaman + '" dihapus', 'success');
      },
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PanelCard title="Pengaturan Umum SEO" subtitle="Berlaku sebagai default untuk seluruh halaman yang belum punya meta khusus">
        <FormSection title="Identitas Situs">
          <FormRow>
            <PsField label="Site Title Default">
              <PsTextInput value={global.siteTitle} onChange={(v) => u('siteTitle', v)} />
            </PsField>
            <PsField label="Domain Kanonikal">
              <PsTextInput value={global.domain} onChange={(v) => u('domain', v)} />
            </PsField>
          </FormRow>
          <div style={{ marginTop: 14 }}>
            <PsField label="Meta Description Default">
              <textarea value={global.siteDesc} onChange={(e) => u('siteDesc', e.target.value)}
                rows={2}
                style={psInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
            </PsField>
          </div>
        </FormSection>

        <FormSection title="Tracking & Verifikasi" subtitle2="Untuk integrasi Google Analytics dan Google Search Console">
          <FormRow>
            <PsField label="Google Analytics ID">
              <PsTextInput value={global.gaId} onChange={(v) => u('gaId', v)} />
            </PsField>
            <PsField label="Google Search Console — Meta Tag Verifikasi">
              <input value={global.gscVerification} onChange={(e) => u('gscVerification', e.target.value)}
                placeholder='cth. <meta name="google-site-verification" content="..." />'
                style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} />
            </PsField>
          </FormRow>
        </FormSection>

        <FormSection title="Indexing & Sitemap" last>
          <BigToggleRow
            label="Izinkan Mesin Pencari Mengindeks Situs"
            desc="Jika dimatikan, robots.txt akan men-disallow seluruh halaman (mode Disallow: /)"
            checked={global.robotsIndex}
            onChange={(v) => u('robotsIndex', v)}
          />
          <BigToggleRow
            label="Generate sitemap.xml Otomatis"
            desc={"Sitemap diperbarui otomatis setiap ada halaman/produk baru di " + global.domain + "/sitemap.xml"}
            checked={global.sitemapEnabled}
            onChange={(v) => u('sitemapEnabled', v)}
          />
        </FormSection>
      </PanelCard>

      <PanelCard
        title="Meta Tag per Halaman"
        subtitle="Override title & description default untuk halaman-halaman utama"
        action={<button onClick={() => setAdding(true)} style={primaryBtn()}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Tambah Halaman
        </button>}
        padded={false}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...psThStyle, paddingLeft: 24 }}>Halaman</th>
              <th style={psThStyle}>Meta Title</th>
              <th style={psThStyle}>Meta Description</th>
              <th style={{ ...psThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #F0EBFF', height: 64 }}>
                <td style={{ ...psTdStyle, paddingLeft: 24 }}>
                  <div style={{ fontWeight: 600, color: '#1A1228' }}>{p.halaman}</div>
                  <div style={{ fontSize: 11, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>{global.domain}{p.slug}</div>
                </td>
                <td style={{ ...psTdStyle, color: '#574872', maxWidth: 260 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.metaTitle}</span>
                  <span style={{ fontSize: 11, color: p.metaTitle.length > 60 ? '#D97706' : '#9085AE' }}>{p.metaTitle.length}/60 karakter</span>
                </td>
                <td style={{ ...psTdStyle, color: '#574872', maxWidth: 320 }}>
                  <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>{p.metaDesc}</span>
                  <span style={{ fontSize: 11, color: p.metaDesc.length > 160 ? '#D97706' : '#9085AE' }}>{p.metaDesc.length}/160 karakter</span>
                </td>
                <td style={{ ...psTdStyle, paddingRight: 24, textAlign: 'right' }}>
                  <button onClick={() => setEditing(p)} style={ghostBtn('#4A2D8C')}>Edit</button>
                  <button onClick={() => deletePage(p)} style={ghostBtn('#C0001A')}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelCard>

      {(editing || adding) && <SeoPageModal page={editing} domain={global.domain} onClose={() => { setEditing(null); setAdding(false); }} onSave={savePage} />}
    </div>
  );
}

function SeoPageModal({ page, domain, onClose, onSave }) {
  const [form, setForm] = usePsState(page ? { ...page } : { halaman: '', slug: '/', metaTitle: '', metaDesc: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.halaman.trim() && form.slug.trim() && form.metaTitle.trim() && form.metaDesc.trim();

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 600, maxHeight: 'calc(100vh - 80px)',
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>SEO</div>
            {page ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>{form.halaman}</div>
                <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{domain}{form.slug}</div>
              </>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>Tambah Halaman Baru</div>
            )}
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!page && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <PsField label="Nama Halaman">
                <PsTextInput value={form.halaman} onChange={(v) => u('halaman', v)} />
              </PsField>
              <PsField label="Slug URL">
                <input value={form.slug} onChange={(e) => u('slug', e.target.value.startsWith('/') ? e.target.value : '/' + e.target.value)}
                  placeholder="/halaman-baru"
                  style={psInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
              </PsField>
            </div>
          )}
          <PsField label={'Meta Title (' + form.metaTitle.length + '/60)'}>
            <PsTextInput value={form.metaTitle} onChange={(v) => u('metaTitle', v)} />
          </PsField>
          <PsField label={'Meta Description (' + form.metaDesc.length + '/160)'}>
            <textarea value={form.metaDesc} onChange={(e) => u('metaDesc', e.target.value)}
              rows={3}
              style={psInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
          </PsField>

          {/* Google preview */}
          <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>
              Preview Hasil Pencarian Google
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#16A34A' }}>{domain}{form.slug}</div>
              <div style={{ fontSize: 15, color: '#1a0dab', marginTop: 2, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.metaTitle}</div>
              <div style={{ fontSize: 12, color: '#574872', marginTop: 2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{form.metaDesc}</div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={secondaryBtn()}>Batal</button>
          <button onClick={() => isValid ? onSave(form) : window.muurahToast('Lengkapi semua field yang wajib diisi', 'error')}
            style={{ ...primaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {page ? 'Simpan' : 'Tambah Halaman'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   MASTER KATEGORI PRODUK
// ════════════════════════════════════════════════════════════════════════════
const KAT_WARNA_META = {
  purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
  gold:   { bg: '#FEF9EC', fg: '#D4900A' },
  blue:   { bg: '#EFF6FF', fg: '#3B82F6' },
  green:  { bg: '#F0FDF4', fg: '#16A34A' },
  coral:  { bg: '#FFF1ED', fg: '#FF6B4A' },
  lime:   { bg: '#F4FCE3', fg: '#5B7C12' },
};
const KAT_WARNA_OPTIONS = Object.keys(KAT_WARNA_META);
const KAT_IKON_OPTIONS = ['phone','bolt','wifi','shieldlock','game','card','receipt','tag','wallet','store','users','image','percent','chart','clock','bell','bank','shield'];

function KategoriPanel() {
  const { useState: useKtState, useEffect: useKtEffect, useRef: useKtRef } = React;
  const [list, setList] = useKtState(() => window.MuurahKategoriStore ? window.MuurahKategoriStore.get() : []);
  const [editing, setEditing] = useKtState(null);
  const [adding, setAdding] = useKtState(false);
  const isFirstRender = useKtRef(true);

  // Publish to store when list changes (skip initial mount to avoid loop)
  useKtEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (window.MuurahKategoriStore) window.MuurahKategoriStore.set(list);
  }, [list]);

  function saveKat(data) {
    if (data.id && list.some(k => k.id === data.id)) {
      setList(ls => ls.map(k => k.id === data.id ? { ...k, ...data } : k));
      window.muurahToast('Kategori "' + data.label + '" berhasil diperbarui', 'success');
    } else {
      const newId = data.label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 12) || 'kat' + Date.now();
      const urutan = list.length + 1;
      setList(ls => [...ls, { ...data, id: newId, urutan, aktif: true }]);
      window.muurahToast('Kategori "' + data.label + '" berhasil ditambahkan', 'success');
    }
    setEditing(null); setAdding(false);
  }

  function deleteKat(k) {
    window.muurahConfirm({
      title: 'Hapus kategori "' + k.label + '"?',
      body: 'Kategori ini akan hilang dari filter produk, dropdown tambah produk, dan scope promo harga.',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setList(ls => ls.filter(x => x.id !== k.id).map((x, i) => ({ ...x, urutan: i + 1 })));
        window.muurahToast('Kategori "' + k.label + '" dihapus', 'success');
      },
    });
  }

  function toggleAktif(k) {
    window.muurahConfirm({
      title: (k.aktif ? 'Nonaktifkan' : 'Aktifkan') + ' kategori "' + k.label + '"?',
      body: k.aktif
        ? 'Kategori ini tidak akan muncul di filter produk dan pilihan dropdown saat tambah produk baru.'
        : 'Kategori ini akan kembali muncul di filter produk dan dropdown.',
      confirmLabel: k.aktif ? 'Nonaktifkan' : 'Aktifkan',
      danger: k.aktif,
      onConfirm: () => setList(ls => ls.map(x => x.id === k.id ? { ...x, aktif: !x.aktif } : x)),
    });
  }

  function moveUp(i) { if (i === 0) return; setList(ls => { const a = [...ls]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a.map((x, j) => ({ ...x, urutan: j + 1 })); }); }
  function moveDown(i) { if (i === list.length - 1) return; setList(ls => { const a = [...ls]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a.map((x, j) => ({ ...x, urutan: j + 1 })); }); }

  return (
    <PanelCard title="Master Kategori Produk" subtitle="Kelola daftar kategori yang dipakai di produk, filter tab, dan scope promo harga — perubahan langsung berlaku di semua menu">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((k, i) => {
          const t = KAT_WARNA_META[k.warna] || KAT_WARNA_META.purple;
          const IconC = Icons[k.ikon] || Icons.tag;
          return (
            <div key={k.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderRadius: 12, border: '1px solid ' + (k.aktif ? '#E0D9F5' : '#F0EBFF'),
              background: k.aktif ? '#FFFFFF' : '#FAF8FF',
              opacity: k.aktif ? 1 : 0.65,
            }}>
              {/* Drag handle / reorder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={() => moveUp(i)} disabled={i === 0} style={{
                  width: 18, height: 18, border: 0, background: 'transparent', cursor: i === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: i === 0 ? '#D0C8E8' : '#9085AE',
                }}><Icons.arrowUp size={11} /></button>
                <button onClick={() => moveDown(i)} disabled={i === list.length - 1} style={{
                  width: 18, height: 18, border: 0, background: 'transparent', cursor: i === list.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: i === list.length - 1 ? '#D0C8E8' : '#9085AE',
                }}><Icons.arrowDown size={11} /></button>
              </div>

              {/* Icon badge */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: t.bg, color: t.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconC size={16} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1228' }}>{k.label}</div>
                <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>id: {k.id} · urutan: {k.urutan}</div>
              </div>

              {/* Status badge */}
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: k.aktif ? '#F0FDF4' : '#F0EBFF',
                color: k.aktif ? '#16A34A' : '#9085AE',
                padding: '4px 9px', borderRadius: 6,
              }}>{k.aktif ? 'Aktif' : 'Nonaktif'}</span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => toggleAktif(k)} style={ghostBtn(k.aktif ? '#D97706' : '#16A34A')}>
                  {k.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button onClick={() => setEditing(k)} style={ghostBtn('#4A2D8C')}>Edit</button>
                <button onClick={() => deleteKat(k)} style={ghostBtn('#C0001A')}>Hapus</button>
              </div>
            </div>
          );
        })}

        <button onClick={() => setAdding(true)} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          height: 44, borderRadius: 12, border: '2px dashed #C5B8EF',
          background: '#FFFFFF', color: '#574872',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          transition: 'all 130ms ease',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4A2D8C'; e.currentTarget.style.color = '#4A2D8C'; e.currentTarget.style.background = '#F0EBFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C5B8EF'; e.currentTarget.style.color = '#574872'; e.currentTarget.style.background = '#FFFFFF'; }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah Kategori Baru
        </button>
      </div>

      {(adding || editing) && (
        <KategoriModal kat={editing} onClose={() => { setAdding(false); setEditing(null); }} onSave={saveKat} />
      )}
    </PanelCard>
  );
}

function KategoriModal({ kat, onClose, onSave }) {
  const { useState: useKmState, useEffect: useKmEffect } = React;
  const [form, setForm] = useKmState(kat
    ? { ...kat }
    : { label: '', ikon: 'tag', warna: 'purple', aktif: true }
  );
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.label.trim().length > 0;

  useKmEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const t = KAT_WARNA_META[form.warna] || KAT_WARNA_META.purple;
  const PreviewIcon = Icons[form.ikon] || Icons.tag;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 480,
        background: '#FFFFFF', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(26,18,40,0.25)',
        display: 'flex', flexDirection: 'column',
        animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Master Kategori</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {kat ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10, background: '#FFFFFF', color: '#574872', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.x size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: '#F0EBFF' }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PreviewIcon size={18} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1228' }}>{form.label || 'Nama Kategori'}</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: t.fg, background: t.bg, padding: '4px 10px', borderRadius: 6 }}>Preview</span>
          </div>

          <PsField label="Nama Kategori">
            <input value={form.label} onChange={(e) => u('label', e.target.value)} autoFocus
              placeholder="cth. Internet & TV" style={psInputStyle({ width: '100%' })} />
          </PsField>

          <PsField label="Warna">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {KAT_WARNA_OPTIONS.map(w => {
                const wt = KAT_WARNA_META[w]; const active = form.warna === w;
                return (
                  <button key={w} type="button" onClick={() => u('warna', w)} style={{
                    width: 34, height: 34, borderRadius: 9, cursor: 'pointer',
                    background: wt.bg, color: wt.fg,
                    border: active ? '2.5px solid ' + wt.fg : '2px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <Icons.check size={14} strokeWidth={2.8} />}
                  </button>
                );
              })}
            </div>
          </PsField>

          <PsField label="Ikon">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {KAT_IKON_OPTIONS.map(ik => {
                const IkIcon = Icons[ik] || Icons.tag; const active = form.ikon === ik;
                return (
                  <button key={ik} type="button" onClick={() => u('ikon', ik)} title={ik} style={{
                    width: 34, height: 34, borderRadius: 9, cursor: 'pointer',
                    background: active ? '#4A2D8C' : '#F0EBFF',
                    color: active ? '#FFFFFF' : '#574872',
                    border: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IkIcon size={15} />
                  </button>
                );
              })}
            </div>
          </PsField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={onClose} style={secondaryBtn()}>Batal</button>
          <button onClick={() => { if (!isValid) { window.muurahToast('Nama kategori wajib diisi', 'error'); return; } onSave(form); }}
            style={{ ...primaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {kat ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.MuurahPengaturan = Pengaturan;
