// master-data.jsx — Menu Master Data
// Sub-menu: Kategori Produk, Operator, Supplier & Biller, Channel Komplain
const { useState: useMdState, useEffect: useMdEffect, useRef: useMdRef } = React;

const MD_NAV = [
  { id: 'kategori',  label: 'Kategori Produk',    icon: 'tag' },
  { id: 'operator',  label: 'Master Operator',     icon: 'phone' },
  { id: 'supplier',  label: 'Supplier & Biller',   icon: 'store' },
  { id: 'channel',   label: 'Channel Komplain',    icon: 'megaphone' },
];

// ─── Shared helpers (isolated to avoid conflict with pengaturan.jsx) ─────────
function mdBtn(over = {}) {
  return { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#4A2D8C', color: '#FFFFFF', border: 0, height: 38, padding: '0 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', ...over };
}
function mdSecBtn() { return { background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF', height: 38, padding: '0 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }; }
function mdGhost(color) { return { background: 'transparent', color, border: 0, padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }; }
function mdInput(over = {}) { return { background: '#F0EBFF', border: '1px solid transparent', borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13, color: '#1A1228', outline: 'none', fontFamily: 'inherit', ...over }; }
const mdTh = { textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 14px', background: '#F0EBFF' };
const mdTd = { padding: '14px 14px', verticalAlign: 'middle' };

function MdCard({ title, subtitle, action, children, padded = true }) {
  const { Card } = window.MuurahShell;
  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EBFF', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
        <div>
          {title && <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 13, color: '#574872', marginTop: 4 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={padded ? { padding: '20px 24px' } : {}}>{children}</div>
    </Card>
  );
}

function MdModal({ onClose, eyebrow, title, subtitle, children, footer, width = 480 }) {
  useMdEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{ position: 'relative', width, maxHeight: 'calc(100vh - 80px)', background: '#FFFFFF', borderRadius: 16, boxShadow: '0 24px 60px rgba(26,18,40,0.25)', display: 'flex', flexDirection: 'column', animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
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
        {footer && <div style={{ padding: '16px 24px', borderTop: '1px solid #E0D9F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}

function MdField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   ROOT
// ════════════════════════════════════════════════════════════════════════════
function MasterData() {
  const [innerNav, setInnerNav] = useMdState('kategori');
  const cur = MD_NAV.find(n => n.id === innerNav) || MD_NAV[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>Master Data</h1>
        <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>Kelola referensi data yang dipakai di seluruh modul dashboard</div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, background: '#FFFFFF', borderRadius: 14, border: '1px solid #E0D9F5', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {MD_NAV.map((n, i) => {
            const active = innerNav === n.id;
            const IconC = Icons[n.icon] || Icons.tag;
            return (
              <button key={n.id} onClick={() => setInnerNav(n.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', border: 0, cursor: 'pointer', textAlign: 'left',
                background: active ? '#F0EBFF' : 'transparent',
                color: active ? '#4A2D8C' : '#574872',
                fontWeight: active ? 700 : 500, fontSize: 13, fontFamily: 'inherit',
                borderLeft: active ? '3px solid #4A2D8C' : '3px solid transparent',
                borderTop: i === 0 ? 0 : '1px solid #F0EBFF',
              }}>
                <IconC size={15} />
                {n.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {innerNav === 'kategori' && <MdKategoriPanel />}
          {innerNav === 'operator' && <MdOperatorPanel />}
          {innerNav === 'supplier' && <MdSupplierPanel />}
          {innerNav === 'channel'  && <MdChannelPanel />}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   1. KATEGORI PRODUK (moved from Pengaturan Sistem)
// ════════════════════════════════════════════════════════════════════════════
const KAT_WARNA_META = {
  purple: { bg: '#EDE8FF', fg: '#4A2D8C' }, gold:   { bg: '#FEF9EC', fg: '#D4900A' },
  blue:   { bg: '#EFF6FF', fg: '#3B82F6' }, green:  { bg: '#F0FDF4', fg: '#16A34A' },
  coral:  { bg: '#FFF1ED', fg: '#FF6B4A' }, lime:   { bg: '#F4FCE3', fg: '#5B7C12' },
};
const KAT_WARNA_OPT = Object.keys(KAT_WARNA_META);
const KAT_IKON_OPT = ['phone','bolt','wifi','shieldlock','game','card','receipt','tag','wallet','store','users','image','percent','chart','clock','bell','bank','shield'];

function MdKategoriPanel() {
  const [list, setList] = useMdState(() => window.MuurahKategoriStore ? window.MuurahKategoriStore.get() : []);
  const [editing, setEditing] = useMdState(null);
  const [adding, setAdding] = useMdState(false);
  const isFirst = useMdRef(true);

  useMdEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (window.MuurahKategoriStore) window.MuurahKategoriStore.set(list);
  }, [list]);

  function save(data) {
    if (data.id && list.some(k => k.id === data.id)) {
      setList(ls => ls.map(k => k.id === data.id ? { ...k, ...data } : k));
      window.muurahToast('Kategori "' + data.label + '" berhasil diperbarui', 'success');
    } else {
      const id = data.label.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 12) || 'kat' + Date.now();
      setList(ls => [...ls, { ...data, id, urutan: ls.length + 1, aktif: true }]);
      window.muurahToast('Kategori "' + data.label + '" ditambahkan', 'success');
    }
    setEditing(null); setAdding(false);
  }
  function del(k) {
    window.muurahConfirm({ title: 'Hapus kategori "' + k.label + '"?', body: 'Kategori akan hilang dari semua dropdown dan filter produk.', confirmLabel: 'Hapus', danger: true, onConfirm: () => { setList(ls => ls.filter(x => x.id !== k.id).map((x, i) => ({ ...x, urutan: i + 1 }))); window.muurahToast('Kategori dihapus', 'success'); } });
  }
  function toggle(k) {
    window.muurahConfirm({ title: (k.aktif ? 'Nonaktifkan' : 'Aktifkan') + ' "' + k.label + '"?', body: k.aktif ? 'Tidak akan muncul di filter dan dropdown produk.' : 'Akan kembali muncul di semua pilihan.', confirmLabel: k.aktif ? 'Nonaktifkan' : 'Aktifkan', danger: k.aktif, onConfirm: () => setList(ls => ls.map(x => x.id === k.id ? { ...x, aktif: !x.aktif } : x)) });
  }
  function move(i, dir) {
    setList(ls => {
      const a = [...ls]; const j = i + dir;
      if (j < 0 || j >= a.length) return ls;
      [a[i], a[j]] = [a[j], a[i]];
      return a.map((x, k) => ({ ...x, urutan: k + 1 }));
    });
  }

  return (
    <MdCard title="Kategori Produk" subtitle="Dipakai di filter produk, dropdown tambah produk, dan scope promo harga">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map((k, i) => {
          const t = KAT_WARNA_META[k.warna] || KAT_WARNA_META.purple;
          const IconC = Icons[k.ikon] || Icons.tag;
          return (
            <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1px solid ' + (k.aktif ? '#E0D9F5' : '#F0EBFF'), background: k.aktif ? '#FFFFFF' : '#FAF8FF', opacity: k.aktif ? 1 : 0.65 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <button onClick={() => move(i, -1)} disabled={i === 0} style={{ width: 16, height: 16, border: 0, background: 'transparent', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#D0C8E8' : '#9085AE', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.arrowUp size={10} /></button>
                <button onClick={() => move(i, 1)} disabled={i === list.length - 1} style={{ width: 16, height: 16, border: 0, background: 'transparent', cursor: i === list.length - 1 ? 'not-allowed' : 'pointer', color: i === list.length - 1 ? '#D0C8E8' : '#9085AE', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.arrowDown size={10} /></button>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IconC size={15} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>{k.label}</div>
                <div style={{ fontSize: 10, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace', marginTop: 1 }}>id: {k.id} · urutan: {k.urutan}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, background: k.aktif ? '#F0FDF4' : '#F0EBFF', color: k.aktif ? '#16A34A' : '#9085AE', padding: '3px 8px', borderRadius: 5 }}>{k.aktif ? 'Aktif' : 'Nonaktif'}</span>
              <button onClick={() => toggle(k)} style={mdGhost(k.aktif ? '#D97706' : '#16A34A')}>{k.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
              <button onClick={() => setEditing(k)} style={mdGhost('#4A2D8C')}>Edit</button>
              <button onClick={() => del(k)} style={mdGhost('#C0001A')}>Hapus</button>
            </div>
          );
        })}
        <button onClick={() => setAdding(true)} style={{ height: 42, borderRadius: 10, border: '2px dashed #C5B8EF', background: 'transparent', color: '#574872', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4A2D8C'; e.currentTarget.style.color = '#4A2D8C'; e.currentTarget.style.background = '#F0EBFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C5B8EF'; e.currentTarget.style.color = '#574872'; e.currentTarget.style.background = 'transparent'; }}>
          + Tambah Kategori Baru
        </button>
      </div>
      {(adding || editing) && <KatModal kat={editing} onClose={() => { setAdding(false); setEditing(null); }} onSave={save} />}
    </MdCard>
  );
}

function KatModal({ kat, onClose, onSave }) {
  const [form, setForm] = useMdState(kat ? { ...kat } : { label: '', ikon: 'tag', warna: 'purple' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const t = KAT_WARNA_META[form.warna] || KAT_WARNA_META.purple;
  const PreviewIcon = Icons[form.ikon] || Icons.tag;
  return (
    <MdModal onClose={onClose} eyebrow="Kategori Produk" title={kat ? 'Edit Kategori' : 'Tambah Kategori'}
      footer={<><button onClick={onClose} style={mdSecBtn()}>Batal</button><button onClick={() => { if (!form.label.trim()) { window.muurahToast('Nama wajib diisi', 'error'); return; } onSave(form); }} style={mdBtn()}>
        <Icons.check size={14} strokeWidth={2.5} /> {kat ? 'Simpan' : 'Tambah'}
      </button></>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: '#F0EBFF' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PreviewIcon size={17} /></div>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1228' }}>{form.label || 'Nama Kategori'}</span>
      </div>
      <MdField label="Nama Kategori"><input value={form.label} onChange={(e) => u('label', e.target.value)} autoFocus placeholder="cth. Internet & TV" style={mdInput({ width: '100%' })} /></MdField>
      <MdField label="Warna">
        <div style={{ display: 'flex', gap: 8 }}>
          {KAT_WARNA_OPT.map(w => { const wt = KAT_WARNA_META[w]; const active = form.warna === w; return (
            <button key={w} type="button" onClick={() => u('warna', w)} style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer', background: wt.bg, color: wt.fg, border: active ? '2.5px solid ' + wt.fg : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {active && <Icons.check size={13} strokeWidth={2.8} />}
            </button>
          ); })}
        </div>
      </MdField>
      <MdField label="Ikon">
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {KAT_IKON_OPT.map(ik => { const IkIcon = Icons[ik] || Icons.tag; const active = form.ikon === ik; return (
            <button key={ik} type="button" onClick={() => u('ikon', ik)} title={ik} style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer', background: active ? '#4A2D8C' : '#F0EBFF', color: active ? '#FFFFFF' : '#574872', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IkIcon size={14} />
            </button>
          ); })}
        </div>
      </MdField>
    </MdModal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   2. MASTER OPERATOR
// ════════════════════════════════════════════════════════════════════════════
const OPERATOR_SEED = [
  { id: 'telkomsel', nama: 'Telkomsel',  prefix: ['0811','0812','0813','0821','0822','0823','0852','0853','0851'], logo: '🔴', aktif: true },
  { id: 'indosat',   nama: 'Indosat',    prefix: ['0814','0815','0816','0855','0856','0857','0858'], logo: '🟡', aktif: true },
  { id: 'xl',        nama: 'XL Axiata',  prefix: ['0817','0818','0819','0859','0877','0878'], logo: '🔵', aktif: true },
  { id: 'tri',       nama: 'Tri',        prefix: ['0895','0896','0897','0898','0899'], logo: '⚫', aktif: true },
  { id: 'smartfren', nama: 'Smartfren',  prefix: ['0881','0882','0883','0884','0885','0886','0887','0888','0889'], logo: '🟢', aktif: true },
  { id: 'axis',      nama: 'Axis',       prefix: ['0831','0832','0833','0838'], logo: '🟣', aktif: true },
  { id: 'pln',       nama: 'PLN',        prefix: [], logo: '⚡', aktif: true },
  { id: 'bpjs',      nama: 'BPJS',       prefix: [], logo: '🩺', aktif: true },
];

function MdOperatorPanel() {
  const [list, setList] = useMdState(OPERATOR_SEED);
  const [editing, setEditing] = useMdState(null);
  const [adding, setAdding] = useMdState(false);

  function save(data) {
    if (data.id && list.some(o => o.id === data.id)) {
      setList(ls => ls.map(o => o.id === data.id ? { ...o, ...data } : o));
      window.muurahToast('Operator "' + data.nama + '" diperbarui', 'success');
    } else {
      const id = data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16) || 'op' + Date.now();
      setList(ls => [...ls, { ...data, id, aktif: true }]);
      window.muurahToast('Operator "' + data.nama + '" ditambahkan', 'success');
    }
    setEditing(null); setAdding(false);
  }
  function del(o) {
    window.muurahConfirm({ title: 'Hapus operator "' + o.nama + '"?', body: 'Operator ini tidak bisa dipilih lagi di produk baru.', confirmLabel: 'Hapus', danger: true, onConfirm: () => { setList(ls => ls.filter(x => x.id !== o.id)); window.muurahToast('Operator dihapus', 'success'); } });
  }
  function toggle(o) {
    window.muurahConfirm({ title: (o.aktif ? 'Nonaktifkan' : 'Aktifkan') + ' "' + o.nama + '"?', body: o.aktif ? 'Tidak bisa dipilih di produk baru.' : 'Kembali bisa dipilih di produk.', confirmLabel: o.aktif ? 'Nonaktifkan' : 'Aktifkan', danger: o.aktif, onConfirm: () => setList(ls => ls.map(x => x.id === o.id ? { ...x, aktif: !x.aktif } : x)) });
  }

  return (
    <MdCard title="Master Operator" subtitle="Daftar operator/provider yang tersedia sebagai pilihan operator produk" action={<button onClick={() => setAdding(true)} style={mdBtn()}><span style={{ fontSize: 15 }}>+</span> Tambah Operator</button>} padded={false}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...mdTh, paddingLeft: 24 }}>Operator</th>
            <th style={mdTh}>Prefix Nomor</th>
            <th style={mdTh}>Status</th>
            <th style={{ ...mdTh, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map(o => (
            <tr key={o.id} style={{ borderTop: '1px solid #F0EBFF', height: 56, opacity: o.aktif ? 1 : 0.65 }}>
              <td style={{ ...mdTd, paddingLeft: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{o.logo}</span>
                  <span style={{ fontWeight: 600, color: '#1A1228' }}>{o.nama}</span>
                </div>
              </td>
              <td style={mdTd}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {o.prefix.slice(0, 5).map(p => (
                    <span key={p} style={{ fontSize: 10, color: '#574872', background: '#F0EBFF', padding: '2px 6px', borderRadius: 5, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{p}</span>
                  ))}
                  {o.prefix.length > 5 && <span style={{ fontSize: 10, color: '#9085AE' }}>+{o.prefix.length - 5} lagi</span>}
                  {o.prefix.length === 0 && <span style={{ fontSize: 11, color: '#9085AE' }}>—</span>}
                </div>
              </td>
              <td style={mdTd}>
                <span style={{ fontSize: 11, fontWeight: 700, background: o.aktif ? '#F0FDF4' : '#F0EBFF', color: o.aktif ? '#16A34A' : '#9085AE', padding: '4px 9px', borderRadius: 6 }}>{o.aktif ? 'Aktif' : 'Nonaktif'}</span>
              </td>
              <td style={{ ...mdTd, paddingRight: 24, textAlign: 'right' }}>
                <button onClick={() => toggle(o)} style={mdGhost(o.aktif ? '#D97706' : '#16A34A')}>{o.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
                <button onClick={() => setEditing(o)} style={mdGhost('#4A2D8C')}>Edit</button>
                <button onClick={() => del(o)} style={mdGhost('#C0001A')}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(adding || editing) && <OperatorModal op={editing} onClose={() => { setAdding(false); setEditing(null); }} onSave={save} />}
    </MdCard>
  );
}

function OperatorModal({ op, onClose, onSave }) {
  const [form, setForm] = useMdState(op ? { ...op, prefixStr: (op.prefix || []).join(', ') } : { nama: '', logo: '📱', prefixStr: '', aktif: true });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.nama.trim();
  return (
    <MdModal onClose={onClose} eyebrow="Master Operator" title={op ? 'Edit Operator' : 'Tambah Operator'}
      footer={<><button onClick={onClose} style={mdSecBtn()}>Batal</button><button onClick={() => { if (!isValid) { window.muurahToast('Nama wajib diisi', 'error'); return; } onSave({ ...form, prefix: form.prefixStr.split(',').map(s => s.trim()).filter(Boolean) }); }} style={{ ...mdBtn(), opacity: isValid ? 1 : 0.5 }}>
        <Icons.check size={14} strokeWidth={2.5} /> {op ? 'Simpan' : 'Tambah'}
      </button></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
        <MdField label="Logo/Emoji"><input value={form.logo} onChange={(e) => u('logo', e.target.value)} style={mdInput({ width: '100%', fontSize: 20, textAlign: 'center' })} maxLength={2} /></MdField>
        <MdField label="Nama Operator"><input value={form.nama} onChange={(e) => u('nama', e.target.value)} autoFocus placeholder="cth. Telkomsel" style={mdInput({ width: '100%' })} /></MdField>
      </div>
      <MdField label="Prefix Nomor (pisahkan dengan koma)">
        <textarea value={form.prefixStr} onChange={(e) => u('prefixStr', e.target.value)}
          placeholder="cth. 0811, 0812, 0813, 0821"
          rows={2} style={{ ...mdInput({ width: '100%', height: 'auto', padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', resize: 'vertical', lineHeight: 1.6 }) }} />
        <div style={{ fontSize: 11, color: '#9085AE' }}>Kosongkan untuk operator non-GSM (PLN, BPJS, dll)</div>
      </MdField>
    </MdModal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   3. SUPPLIER & BILLER (moved from Pengaturan Sistem)
// ════════════════════════════════════════════════════════════════════════════
const SUPPLIER_SEED = [
  { id: 'digiflazz', name: 'Digiflazz',   kat: ['Pulsa', 'Token PLN', 'Paket Data'], status: 'aktif',       sr: 99.1, endpoint: 'https://api.digiflazz.com/v1',  apiKey: 'sk_live_a1b2c3d4e5' },
  { id: 'iak',        name: 'IAK',          kat: ['Voucher Game', 'Pulsa'],            status: 'aktif',       sr: 97.2, endpoint: 'https://api.iak.id/v2',          apiKey: 'sk_live_f6g7h8i9j0' },
  { id: 'ayoconnect', name: 'Ayoconnect',   kat: ['BPJS', 'PDAM', 'Token PLN'],       status: 'aktif',       sr: 98.7, endpoint: 'https://api.ayoconnect.id/v1',  apiKey: 'sk_live_k1l2m3n4o5' },
  { id: 'tripay',     name: 'Tripay PPOB',  kat: ['Paket Data', 'E-Wallet'],           status: 'gangguan',    sr: 84.5, endpoint: 'https://api.tripay.co.id/v1',   apiKey: 'sk_live_p6q7r8s9t0' },
];
const SUPPLIER_KAT = ['Pulsa', 'Token PLN', 'Paket Data', 'Voucher Game', 'E-Wallet', 'BPJS', 'PDAM', 'Multifinance'];
const SUPPLIER_STATUS_MAP = {
  aktif:       { bg: '#F0FDF4', fg: '#16A34A', label: 'Aktif' },
  gangguan:    { bg: '#FCE7E9', fg: '#C0001A', label: 'Gangguan' },
  maintenance: { bg: '#FFFBEB', fg: '#D97706', label: 'Maintenance' },
};

function MdSupplierPanel() {
  const [suppliers, setSuppliers] = useMdState(SUPPLIER_SEED);
  const [editing, setEditing] = useMdState(null);
  const [adding, setAdding] = useMdState(false);

  function save(data) {
    if (data.id && suppliers.some(s => s.id === data.id)) {
      if (data._isEdit) {
        window.muurahConfirm({ title: 'Simpan perubahan konfigurasi "' + data.name + '"?', body: 'API key dan endpoint yang baru akan langsung dipakai untuk transaksi selanjutnya.', confirmLabel: 'Simpan Perubahan', onConfirm: () => { setSuppliers(ss => ss.map(s => s.id === data.id ? { ...s, ...data } : s)); window.muurahToast('Supplier berhasil diperbarui', 'success'); setEditing(null); } });
        return;
      }
    } else {
      const id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16) || 'sup' + Date.now();
      setSuppliers(ss => [...ss, { ...data, id, sr: 100 }]);
      window.muurahToast('Supplier "' + data.name + '" ditambahkan', 'success');
    }
    setAdding(false); setEditing(null);
  }
  function test(s) {
    window.muurahToast('Menghubungi ' + s.name + '…', 'info');
    setTimeout(() => { s.status === 'gangguan' ? window.muurahToast('Koneksi ke ' + s.name + ' gagal — periksa endpoint/API key', 'error') : window.muurahToast('Koneksi ke ' + s.name + ' berhasil — latency 184ms', 'success'); }, 900);
  }

  return (
    <MdCard title="Supplier & Biller" subtitle="Penyedia layanan PPOB yang terhubung ke Muurah — endpoint, API key, dan performa koneksi" action={<button onClick={() => setAdding(true)} style={mdBtn()}><span style={{ fontSize: 15 }}>+</span> Tambah Supplier</button>} padded={false}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...mdTh, paddingLeft: 24 }}>Supplier</th>
            <th style={mdTh}>Kategori</th>
            <th style={mdTh}>Status</th>
            <th style={{ ...mdTh, textAlign: 'right' }}>Success Rate</th>
            <th style={{ ...mdTh, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, idx) => {
            const st = SUPPLIER_STATUS_MAP[s.status] || SUPPLIER_STATUS_MAP.aktif;
            return (
              <tr key={s.id} style={{ borderTop: '1px solid #F0EBFF', height: 56, background: s.status === 'gangguan' ? '#FBF5F6' : s.status === 'maintenance' ? '#FFFBEB' : '#FFFFFF' }}>
                <td style={{ ...mdTd, paddingLeft: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F0EBFF', color: '#4A2D8C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{s.name[0]}</div>
                    <span style={{ fontWeight: 600, color: '#1A1228' }}>{s.name}</span>
                  </div>
                </td>
                <td style={mdTd}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{s.kat.map(k => <span key={k} style={{ fontSize: 11, color: '#574872', background: '#F0EBFF', padding: '2px 7px', borderRadius: 5, fontWeight: 500 }}>{k}</span>)}</div></td>
                <td style={mdTd}><span style={{ fontSize: 11, fontWeight: 700, background: st.bg, color: st.fg, padding: '4px 9px', borderRadius: 6 }}>{st.label}</span></td>
                <td style={{ ...mdTd, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: s.sr >= 95 ? '#16A34A' : s.sr >= 90 ? '#D97706' : '#C0001A' }}>{s.sr.toFixed(1)}%</span>
                    <div style={{ width: 72, height: 4, background: '#F0EBFF', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: s.sr + '%', height: '100%', background: s.sr >= 95 ? '#16A34A' : s.sr >= 90 ? '#D97706' : '#C0001A' }} /></div>
                  </div>
                </td>
                <td style={{ ...mdTd, paddingRight: 24, textAlign: 'right' }}>
                  <button onClick={() => setEditing({ ...s, _isEdit: true })} style={mdGhost('#4A2D8C')}>Konfigurasi</button>
                  <button onClick={() => test(s)} style={mdGhost('#574872')}>Test</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {(adding || editing) && <SupplierModal2 sup={editing} katOptions={SUPPLIER_KAT} onClose={() => { setAdding(false); setEditing(null); }} onSave={save} />}
    </MdCard>
  );
}

function SupplierModal2({ sup, katOptions, onClose, onSave }) {
  const [form, setForm] = useMdState(sup || { name: '', kat: [], status: 'aktif', endpoint: '', apiKey: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.name.trim() && form.kat.length > 0 && form.endpoint.trim();
  return (
    <MdModal onClose={onClose} eyebrow="Supplier & Biller" title={sup ? 'Konfigurasi ' + sup.name : 'Tambah Supplier'} width={520}
      footer={<><button onClick={onClose} style={mdSecBtn()}>Batal</button><button onClick={() => isValid ? onSave(form) : window.muurahToast('Lengkapi nama, kategori, dan endpoint', 'error')} style={{ ...mdBtn(), opacity: isValid ? 1 : 0.5 }}>
        <Icons.check size={14} strokeWidth={2.5} /> {sup ? 'Simpan Perubahan' : 'Tambah Supplier'}
      </button></>}>
      <MdField label="Nama Supplier"><input value={form.name} onChange={(e) => u('name', e.target.value)} autoFocus placeholder="cth. Digiflazz" style={mdInput({ width: '100%' })} /></MdField>
      <MdField label="Kategori Produk yang Disupport">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {katOptions.map(k => { const active = form.kat.includes(k); return (
            <button key={k} type="button" onClick={() => u('kat', active ? form.kat.filter(x => x !== k) : [...form.kat, k])} style={{ padding: '6px 12px', borderRadius: 8, border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5', background: active ? '#EDE8FF' : '#FFFFFF', color: active ? '#4A2D8C' : '#574872', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>{k}</button>
          ); })}
        </div>
      </MdField>
      <MdField label="Endpoint URL"><input value={form.endpoint} onChange={(e) => u('endpoint', e.target.value)} placeholder="https://api.supplier.com/v1" style={mdInput({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} /></MdField>
      <MdField label="API Key"><input value={form.apiKey} onChange={(e) => u('apiKey', e.target.value)} placeholder="sk_live_..." style={mdInput({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} /></MdField>
      <MdField label="Status Koneksi">
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(SUPPLIER_STATUS_MAP).map(([id, s]) => { const active = form.status === id; return (
            <button key={id} type="button" onClick={() => u('status', id)} style={{ flex: 1, padding: '8px', borderRadius: 9, border: active ? '1.5px solid ' + s.fg : '1px solid #E0D9F5', background: active ? s.bg : '#FFFFFF', color: active ? s.fg : '#574872', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>{s.label}</button>
          ); })}
        </div>
      </MdField>
    </MdModal>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   4. CHANNEL KOMPLAIN
// ════════════════════════════════════════════════════════════════════════════
const CHANNEL_SEED = [
  { id: 'whatsapp', nama: 'WhatsApp',   ikon: 'send',   warna: '#25D366', aktif: true,  desc: 'Komplain masuk via WA Business' },
  { id: 'email',    nama: 'Email',      ikon: 'send',   warna: '#4A2D8C', aktif: true,  desc: 'cs@muurah.com' },
  { id: 'telegram', nama: 'Telegram',   ikon: 'send',   warna: '#0088CC', aktif: true,  desc: '@MuurahCS_bot' },
  { id: 'form-web', nama: 'Form Web',   ikon: 'image',  warna: '#FF6B4A', aktif: true,  desc: 'Form di halaman bantuan muurah.com' },
  { id: 'manual',   nama: 'Manual CS',  ikon: 'users',  warna: '#574872', aktif: true,  desc: 'Dibuat langsung oleh CS di dashboard' },
];

function MdChannelPanel() {
  const [list, setList] = useMdState(CHANNEL_SEED);
  const [editing, setEditing] = useMdState(null);
  const [adding, setAdding] = useMdState(false);

  function save(data) {
    if (data.id && list.some(c => c.id === data.id)) {
      setList(ls => ls.map(c => c.id === data.id ? { ...c, ...data } : c));
      window.muurahToast('Channel "' + data.nama + '" diperbarui', 'success');
    } else {
      const id = data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20) || 'ch' + Date.now();
      setList(ls => [...ls, { ...data, id, aktif: true }]);
      window.muurahToast('Channel "' + data.nama + '" ditambahkan', 'success');
    }
    setEditing(null); setAdding(false);
  }
  function del(c) {
    window.muurahConfirm({ title: 'Hapus channel "' + c.nama + '"?', body: 'Channel ini tidak bisa dipilih lagi sebagai sumber tiket baru.', confirmLabel: 'Hapus', danger: true, onConfirm: () => { setList(ls => ls.filter(x => x.id !== c.id)); window.muurahToast('Channel dihapus', 'success'); } });
  }
  function toggle(c) {
    window.muurahConfirm({ title: (c.aktif ? 'Nonaktifkan' : 'Aktifkan') + ' channel "' + c.nama + '"?', body: c.aktif ? 'Tidak bisa dipilih sebagai sumber tiket baru.' : 'Kembali bisa dipilih.', confirmLabel: c.aktif ? 'Nonaktifkan' : 'Aktifkan', danger: c.aktif, onConfirm: () => setList(ls => ls.map(x => x.id === c.id ? { ...x, aktif: !x.aktif } : x)) });
  }

  return (
    <MdCard title="Channel Komplain" subtitle="Sumber/channel dari mana tiket komplain bisa masuk — dipakai di form tiket dan filter komplain" action={<button onClick={() => setAdding(true)} style={mdBtn()}><span style={{ fontSize: 15 }}>+</span> Tambah Channel</button>} padded={false}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...mdTh, paddingLeft: 24 }}>Channel</th>
            <th style={mdTh}>Deskripsi / Kontak</th>
            <th style={mdTh}>Status</th>
            <th style={{ ...mdTh, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.map(c => (
            <tr key={c.id} style={{ borderTop: '1px solid #F0EBFF', height: 56, opacity: c.aktif ? 1 : 0.65 }}>
              <td style={{ ...mdTd, paddingLeft: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: c.warna + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.warna, display: 'inline-block' }} />
                  </div>
                  <span style={{ fontWeight: 600, color: '#1A1228' }}>{c.nama}</span>
                </div>
              </td>
              <td style={{ ...mdTd, color: '#574872', fontSize: 12 }}>{c.desc || '—'}</td>
              <td style={mdTd}><span style={{ fontSize: 11, fontWeight: 700, background: c.aktif ? '#F0FDF4' : '#F0EBFF', color: c.aktif ? '#16A34A' : '#9085AE', padding: '4px 9px', borderRadius: 6 }}>{c.aktif ? 'Aktif' : 'Nonaktif'}</span></td>
              <td style={{ ...mdTd, paddingRight: 24, textAlign: 'right' }}>
                <button onClick={() => toggle(c)} style={mdGhost(c.aktif ? '#D97706' : '#16A34A')}>{c.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
                <button onClick={() => setEditing(c)} style={mdGhost('#4A2D8C')}>Edit</button>
                <button onClick={() => del(c)} style={mdGhost('#C0001A')}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(adding || editing) && <ChannelModal ch={editing} onClose={() => { setAdding(false); setEditing(null); }} onSave={save} />}
    </MdCard>
  );
}

function ChannelModal({ ch, onClose, onSave }) {
  const [form, setForm] = useMdState(ch ? { ...ch } : { nama: '', warna: '#4A2D8C', desc: '' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const PRESET_COLORS = ['#25D366','#0088CC','#4A2D8C','#FF6B4A','#D97706','#16A34A','#574872','#C0001A'];
  return (
    <MdModal onClose={onClose} eyebrow="Channel Komplain" title={ch ? 'Edit Channel' : 'Tambah Channel'}
      footer={<><button onClick={onClose} style={mdSecBtn()}>Batal</button><button onClick={() => { if (!form.nama.trim()) { window.muurahToast('Nama wajib diisi', 'error'); return; } onSave(form); }} style={mdBtn()}>
        <Icons.check size={14} strokeWidth={2.5} /> {ch ? 'Simpan' : 'Tambah'}
      </button></>}>
      <MdField label="Nama Channel"><input value={form.nama} onChange={(e) => u('nama', e.target.value)} autoFocus placeholder="cth. Instagram DM" style={mdInput({ width: '100%' })} /></MdField>
      <MdField label="Warna Identitas">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {PRESET_COLORS.map(c => (
            <button key={c} type="button" onClick={() => u('warna', c)} style={{ width: 28, height: 28, borderRadius: 7, cursor: 'pointer', background: c, border: form.warna === c ? '3px solid #1A1228' : '2px solid transparent' }} />
          ))}
          <input type="color" value={form.warna} onChange={(e) => u('warna', e.target.value)} style={{ width: 28, height: 28, borderRadius: 7, cursor: 'pointer', border: '1px solid #E0D9F5', padding: 2 }} />
        </div>
      </MdField>
      <MdField label="Deskripsi / Info Kontak"><input value={form.desc} onChange={(e) => u('desc', e.target.value)} placeholder="cth. cs@muurah.com atau @MuurahBot" style={mdInput({ width: '100%' })} /></MdField>
    </MdModal>
  );
}

// Publish MuurahChannelStore so other screens (e.g. komplain.jsx) can read channels
window.MuurahChannelStore = (() => {
  let channels = CHANNEL_SEED;
  const listeners = new Set();
  return {
    get: () => channels,
    set: (next) => { channels = next; listeners.forEach(fn => fn(channels)); },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();

window.MuurahMasterData = MasterData;
