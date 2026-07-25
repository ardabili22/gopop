// global.jsx — toast system, confirm dialog, nav events, bell dropdown helpers
const { useState: useGbState, useEffect: useGbEffect, useRef: useGbRef } = React;

// ════════════════════════════════════════════════════════════════════════════
//   PUBLIC API
//
//   window.muurahToast(message, variant?)
//     variant: 'info' | 'success' | 'warning' | 'error' (default 'info')
//
//   window.muurahConfirm({ title, body, confirmLabel, cancelLabel, danger, onConfirm })
//     onConfirm() runs after user confirms.
//
//   window.muurahGoTo(screenId)
//     Fires nav event consumed by App.
//
//   window.muurahOpenTrxDetail(trxId?)  — opens transaksi screen + drawer (best effort)
// ════════════════════════════════════════════════════════════════════════════

window.muurahToast = (message, variant = 'info', opts = {}) => {
  window.dispatchEvent(new CustomEvent('muurah-toast', { detail: { message, variant, ...opts } }));
};
window.muurahConfirm = (opts) => {
  window.dispatchEvent(new CustomEvent('muurah-confirm', { detail: opts }));
};
window.muurahGoTo = (screenId) => {
  window.dispatchEvent(new CustomEvent('muurah-goto', { detail: screenId }));
};
window.muurahOpenUserProfile = (hp) => {
  window.dispatchEvent(new CustomEvent('muurah-open-user', { detail: { hp } }));
  window.muurahGoTo('pengguna');
};

// ════════════════════════════════════════════════════════════════════════════
//   ROLES STORE — shared role list (Role & Akses is the source of truth)
//
//   window.MuurahRolesStore.get()        -> current roles array
//   window.MuurahRolesStore.set(roles)   -> publish new roles array
//   window.MuurahRolesStore.subscribe(fn)-> fn(roles) on every update, returns unsubscribe
// ════════════════════════════════════════════════════════════════════════════
window.MuurahRolesStore = (() => {
  let roles = [
    { id: 'sa', label: 'Super Admin',       tone: 'purple' },
    { id: 'ao', label: 'Admin Operasional', tone: 'lime'   },
    { id: 'fn', label: 'Finance',           tone: 'green'  },
    { id: 'cs', label: 'CS',                tone: 'gold'   },
  ];
  const listeners = new Set();
  return {
    get: () => roles,
    set: (next) => {
      roles = next;
      listeners.forEach(fn => fn(roles));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
//   KATEGORI STORE — master kategori produk (Pengaturan Sistem is source of truth)
//
//   window.MuurahKategoriStore.get()          -> current kategori array
//   window.MuurahKategoriStore.set(list)      -> publish new list
//   window.MuurahKategoriStore.subscribe(fn)  -> fn(list) on every update, returns unsubscribe
// ════════════════════════════════════════════════════════════════════════════
window.MuurahKategoriStore = (() => {
  let kategori = [
    { id: 'pulsa',   label: 'Pulsa',      ikon: 'phone',    warna: 'purple', urutan: 1, aktif: true },
    { id: 'pln',     label: 'PLN',        ikon: 'bolt',     warna: 'gold',   urutan: 2, aktif: true },
    { id: 'data',    label: 'Paket Data', ikon: 'wifi',     warna: 'blue',   urutan: 3, aktif: true },
    { id: 'bpjs',    label: 'BPJS',       ikon: 'shieldlock', warna: 'green', urutan: 4, aktif: true },
    { id: 'game',    label: 'Game',       ikon: 'game',     warna: 'coral',  urutan: 5, aktif: true },
    { id: 'emoney',  label: 'E-Money',    ikon: 'card',     warna: 'lime',   urutan: 6, aktif: true },
    { id: 'tagihan', label: 'Tagihan',    ikon: 'receipt',  warna: 'green',  urutan: 7, aktif: true },
  ];
  const listeners = new Set();
  return {
    get: () => kategori,
    set: (next) => {
      kategori = next;
      listeners.forEach(fn => fn(kategori));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
//   PROMO STORE — master voucher/promo (Pengaturan > Promo & Voucher is source of truth)
//
//   window.MuurahPromoStore.get()          -> current promo array
//   window.MuurahPromoStore.set(list)      -> publish new list
//   window.MuurahPromoStore.subscribe(fn)  -> fn(list) on every update, returns unsubscribe
//
//   Dipake juga sama Tips & Promo Artikel (VoucherPicker di cms.jsx) buat nge-link
//   artikel kategori Promo ke voucher yang beneran ada, alih-alih isi ulang kode & scope manual.
// ════════════════════════════════════════════════════════════════════════════
window.MuurahPromoStore = (() => {
  let promos = [
    { id: 1, kode: 'CASHBACK5EW', nama: 'Cashback 5% Transfer E-Wallet', tipe: 'percent', nilai: 5, maksDiskon: 5_000, minTransaksi: 50_000, scope: ['Transfer E-Wallet'], mulai: '2026-05-15', akhir: '2026-05-31', kuota: 5000, terpakai: 1842, perUser: 3, status: 'aktif' },
    { id: 2, kode: 'PLNWEEKEND2', nama: 'Token PLN Diskon 2% Weekend', tipe: 'percent', nilai: 2, maksDiskon: 2_000, minTransaksi: 20_000, scope: ['Token PLN'], mulai: '2026-05-23', akhir: '2026-06-30', kuota: 10000, terpakai: 0, perUser: 1, status: 'terjadwal' },
    { id: 3, kode: 'GAMEHEMAT10K', nama: 'Potongan Rp10.000 Voucher Game', tipe: 'nominal', nilai: 10_000, maksDiskon: null, minTransaksi: 50_000, scope: ['Game & Voucher'], mulai: '2026-05-01', akhir: '2026-05-20', kuota: 2000, terpakai: 2000, perUser: 1, status: 'habis' },
    { id: 4, kode: 'NEWUSER25', nama: 'Diskon 25% Pengguna Baru (Semua Produk)', tipe: 'percent', nilai: 25, maksDiskon: 15_000, minTransaksi: 10_000, scope: ['Semua Produk'], mulai: '2026-01-01', akhir: '2026-12-31', kuota: 50000, terpakai: 8120, perUser: 1, status: 'aktif' },
    { id: 5, kode: 'PULSALEBARAN', nama: 'Promo Lebaran Pulsa & Paket Data', tipe: 'nominal', nilai: 3_000, maksDiskon: null, minTransaksi: 25_000, scope: ['Pulsa', 'Paket Data'], mulai: '2026-03-01', akhir: '2026-04-10', kuota: 8000, terpakai: 7960, perUser: 2, status: 'nonaktif' },
  ];
  const listeners = new Set();
  return {
    get: () => promos,
    set: (next) => {
      promos = next;
      listeners.forEach(fn => fn(promos));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
//   PRODUCT SCOPE PICKER — shared "Berlaku untuk Produk" dropdown
//   Used by: Promo & Voucher (Pengaturan) and Tips & Promo Artikel (CMS)
//
//   Kategori (Pulsa, Paket Data, dst) are non-clickable group headers only —
//   the actual selectable leaves are individual produk, sourced from the real
//   PRODUK_DATA catalog (produk.jsx) so this never drifts from real product data.
//   Layanan tanpa SKU per-produk (Transfer E-Wallet, eSIM) get their own group;
//   Transfer E-Wallet reuses PROMO_PLATFORMS (cms.jsx) as its produk list.
//   Kategori yang belum punya produk terdaftar tetap tampil, jujur nampilin
//   "Belum ada produk terdaftar" alih-alih dikarang.
// ════════════════════════════════════════════════════════════════════════════
function getScopeCategoryGroups() {
  const katList = window.MuurahKategoriStore ? window.MuurahKategoriStore.get().filter(k => k.aktif) : [];
  const katalog = (typeof PRODUK_DATA !== 'undefined') ? PRODUK_DATA : [];

  const kategoriGroups = katList.map(k => ({
    group: k.label,
    items: katalog.filter(p => (p.kategori || '').toLowerCase() === k.id.toLowerCase() && p.status !== 'nonaktif').map(p => p.nama),
  }));

  const ewalletItems = (typeof PROMO_PLATFORMS !== 'undefined') ? PROMO_PLATFORMS.map(p => p.label) : [];

  return [
    { group: 'Umum', items: ['Semua Produk'] },
    ...kategoriGroups,
    { group: 'Transfer E-Wallet', items: ewalletItems },
    { group: 'eSIM', items: [] },
  ];
}

function ProductScopeDropdown({ selected, onToggle }) {
  const [open, setOpen] = useGbState(false);
  const [query, setQuery] = useGbState('');
  const wrapRef = useGbRef(null);
  const searchRef = useGbRef(null);

  useGbEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setQuery(''); }
    }
    function onKey(e) { if (e.key === 'Escape') { setOpen(false); setQuery(''); } }
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useGbEffect(() => { if (open && searchRef.current) searchRef.current.focus(); }, [open]);

  const q = query.trim().toLowerCase();
  const filteredGroups = getScopeCategoryGroups()
    .map(g => ({ ...g, items: g.items.filter(s => s.toLowerCase().includes(q)) }))
    .filter(g => (q === '' ? true : g.items.length > 0));

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        background: '#F0EBFF', border: open ? '1px solid #4A2D8C' : '1px solid transparent',
        borderRadius: 10, minHeight: 38, padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, cursor: 'pointer',
      }}>
        {selected.length === 0 && (
          <span style={{ fontSize: 13, color: '#9085AE' }}>Pilih produk...</span>
        )}
        {selected.map((s) => (
          <span key={s} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 6px 4px 10px', borderRadius: 7,
            background: '#FFFFFF', border: '1px solid #4A2D8C',
            color: '#4A2D8C', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {s}
            <span onClick={(e) => { e.stopPropagation(); onToggle(s); }}
              style={{ cursor: 'pointer', display: 'inline-flex', opacity: 0.6 }}>
              <Icons.x size={11} strokeWidth={2.5} />
            </span>
          </span>
        ))}
        <Icons.chevron size={13} style={{
          color: '#574872', flexShrink: 0, marginLeft: 'auto',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 130ms ease',
        }} />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
          background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 12,
          boxShadow: '0 12px 32px rgba(26,18,40,0.16)', overflow: 'hidden',
          animation: 'muurah-pop 160ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{ padding: 8, borderBottom: '1px solid #E0D9F5' }}>
            <div style={{ position: 'relative' }}>
              <Icons.search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
              <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk..."
                style={{
                  width: '100%', height: 34, paddingLeft: 30, paddingRight: 12,
                  background: '#FAF8FF', border: '1px solid transparent', borderRadius: 10,
                  fontSize: 13, color: '#1A1228', outline: 'none', fontFamily: 'inherit',
                }} />
            </div>
          </div>

          <div style={{ maxHeight: 260, overflowY: 'auto', padding: '6px 0' }}>
            {filteredGroups.length === 0 && (
              <div style={{ padding: '14px 12px', fontSize: 12, color: '#9085AE', textAlign: 'center' }}>
                Produk tidak ditemukan
              </div>
            )}
            {filteredGroups.map((g) => (
              <div key={g.group}>
                <div style={{ padding: '8px 12px 4px', fontSize: 10, fontWeight: 700, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {g.group}
                </div>
                {g.items.length === 0 && (
                  <div style={{ padding: '2px 12px 10px', fontSize: 12, color: '#9085AE', fontStyle: 'italic' }}>
                    Belum ada produk terdaftar
                  </div>
                )}
                {g.items.map((s) => {
                  const active = selected.includes(s);
                  return (
                    <div key={s} onClick={() => onToggle(s)}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#FAF8FF'; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', cursor: 'pointer', fontSize: 13,
                        color: active ? '#4A2D8C' : '#1A1228', fontWeight: active ? 600 : 500,
                        background: active ? '#F5F2FF' : 'transparent',
                      }}>
                      {s}
                      {active && <Icons.check size={13} strokeWidth={2.8} style={{ color: '#4A2D8C', flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   TOAST CONTAINER
// ════════════════════════════════════════════════════════════════════════════
function ToastContainer() {
  const [toasts, setToasts] = useGbState([]);
  const idRef = useGbRef(0);

  useGbEffect(() => {
    function handler(e) {
      const id = ++idRef.current;
      const t = { id, ...e.detail };
      setToasts((ts) => [...ts, t]);
      setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), e.detail.duration || 3200);
    }
    window.addEventListener('muurah-toast', handler);
    return () => window.removeEventListener('muurah-toast', handler);
  }, []);

  function dismiss(id) {
    setToasts((ts) => ts.filter((x) => x.id !== id));
  }

  const variants = {
    info:    { bg: '#FFFFFF', bd: '#C5B8EF', ic: '#4A2D8C', iconBg: '#EDE8FF' },
    success: { bg: '#FFFFFF', bd: '#86EFAC', ic: '#16A34A', iconBg: '#F0FDF4' },
    warning: { bg: '#FFFFFF', bd: '#FCD34D', ic: '#D97706', iconBg: '#FFFBEB' },
    error:   { bg: '#FFFFFF', bd: '#FCA5A5', ic: '#C0001A', iconBg: '#FCE7E9' },
  };

  return (
    <div style={{
      position: 'fixed', top: 76, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none', maxWidth: 380,
    }}>
      {toasts.map((t) => {
        const v = variants[t.variant] || variants.info;
        return (
          <div key={t.id} style={{
            background: v.bg, border: `1px solid ${v.bd}`,
            borderRadius: 12, padding: '12px 14px',
            boxShadow: '0 12px 32px rgba(26,18,40,0.12)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            pointerEvents: 'auto',
            animation: 'muurah-toast-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            minWidth: 260,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: v.iconBg, color: v.ic,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ToastIcon variant={t.variant} />
            </div>
            <div style={{ flex: 1, fontSize: 13, color: '#1A1228', lineHeight: 1.5, paddingTop: 5 }}>
              {t.message}
            </div>
            <button onClick={() => dismiss(t.id)} aria-label="Tutup" style={{
              width: 24, height: 24, border: 0, background: 'transparent',
              color: '#9085AE', cursor: 'pointer', borderRadius: 6, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.x size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ToastIcon({ variant }) {
  if (variant === 'success') return <Icons.check size={15} strokeWidth={2.8} />;
  if (variant === 'warning') return <Icons.alert size={14} strokeWidth={2.3} />;
  if (variant === 'error')   return <Icons.x size={15} strokeWidth={2.8} />;
  return <Icons.bell size={14} />;
}

// ════════════════════════════════════════════════════════════════════════════
//   CONFIRM DIALOG
// ════════════════════════════════════════════════════════════════════════════
function ConfirmHost() {
  const [opts, setOpts] = useGbState(null);

  useGbEffect(() => {
    function handler(e) { setOpts(e.detail); }
    window.addEventListener('muurah-confirm', handler);
    return () => window.removeEventListener('muurah-confirm', handler);
  }, []);

  useGbEffect(() => {
    if (!opts) return;
    const h = (e) => { if (e.key === 'Escape') setOpts(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [opts]);

  if (!opts) return null;
  const danger = !!opts.danger;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={() => setOpts(null)} style={{
        position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)',
        animation: 'muurah-fade 180ms ease',
      }} />
      <div style={{
        position: 'relative', width: 420, background: '#FFFFFF',
        borderRadius: 16, boxShadow: '0 24px 60px rgba(26,18,40,0.25)',
        padding: 24, animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: danger ? '#FCE7E9' : '#EDE8FF',
            color: danger ? '#C0001A' : '#4A2D8C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {danger ? <Icons.alert size={20} strokeWidth={2.2} /> : <Icons.shieldlock size={20} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1228', letterSpacing: '-0.01em' }}>
              {opts.title || 'Konfirmasi tindakan'}
            </div>
            {opts.body && (
              <div style={{ fontSize: 13, color: '#574872', marginTop: 6, lineHeight: 1.55 }}>
                {opts.body}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={() => setOpts(null)} style={{
            background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
            height: 38, padding: '0 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}>{opts.cancelLabel || 'Batal'}</button>
          <button onClick={() => { setOpts(null); opts.onConfirm && opts.onConfirm(); }} style={{
            background: danger ? '#C0001A' : '#4A2D8C', color: '#FFFFFF', border: 0,
            height: 38, padding: '0 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {opts.confirmLabel || 'Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   BELL DROPDOWN (mounted inside Navbar)
// ════════════════════════════════════════════════════════════════════════════
function BellDropdown({ onClose }) {
  const items = [
    { id: 'n1', tone: 'red',    icon: 'alert',  title: 'Transaksi TXN-9912832 gagal',
      desc: '3 transaksi menunggu refund manual', time: '5 menit lalu', goto: 'transaksi' },
    { id: 'n2', tone: 'amber',  icon: 'trenddn', title: 'BPJS success rate turun ke 82%',
      desc: 'Threshold SLA 95% terlewati', time: '32 menit lalu', goto: 'dashboard' },
    { id: 'n3', tone: 'gold',   icon: 'wallet', title: 'Deposit Supplier A hampir habis',
      desc: 'Rp 45.000 tersisa · top-up sebelum jam 18.00', time: '1 jam lalu', goto: 'rekon' },
  ];
  const tones = {
    red:   { bg: '#FCE7E9', fg: '#C0001A' },
    amber: { bg: '#FFFBEB', fg: '#D97706' },
    gold:  { bg: '#FEF9EC', fg: '#D4900A' },
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
      <div style={{
        position: 'absolute', right: 0, top: 'calc(100% + 6px)',
        width: 360, background: '#FFFFFF',
        border: '1px solid #E0D9F5', borderRadius: 12,
        boxShadow: '0 12px 32px rgba(26,18,40,0.12)',
        zIndex: 31, overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 14px', borderBottom: '1px solid #F0EBFF',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1228' }}>Notifikasi</div>
            <div style={{ fontSize: 11, color: '#9085AE', marginTop: 1 }}>3 belum dibaca</div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', color: '#4A2D8C', border: 0,
            fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>Tandai semua dibaca</button>
        </div>
        <div>
          {items.map((n) => {
            const t = tones[n.tone];
            const IconC = Icons[n.icon];
            return (
              <button key={n.id} onClick={() => { onClose(); window.muurahGoTo(n.goto); }}
                style={{
                  width: '100%', display: 'flex', gap: 10,
                  padding: '12px 14px', border: 0,
                  borderBottom: '1px solid #F0EBFF',
                  background: '#FFFFFF', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  transition: 'background 130ms ease',
                  alignItems: 'flex-start',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: t.bg, color: t.fg, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>
                  <IconC size={14} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228', lineHeight: 1.35 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: '#574872', marginTop: 3, lineHeight: 1.5 }}>{n.desc}</div>
                  <div style={{ fontSize: 10, color: '#9085AE', marginTop: 5, fontFamily: 'JetBrains Mono, monospace' }}>{n.time}</div>
                </div>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C0001A', flexShrink: 0, marginTop: 6 }} />
              </button>
            );
          })}
        </div>
        <button onClick={() => { onClose(); window.muurahGoTo('audit'); }}
          style={{
            width: '100%', padding: '12px 14px', border: 0,
            background: '#FAF8FF', color: '#4A2D8C',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
          Lihat semua notifikasi <Icons.arrowR size={13} />
        </button>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   DATE PICKER BUTTON — styled button wrapping a native date input
// ════════════════════════════════════════════════════════════════════════════
const ID_BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function formatTglID(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d,10)} ${ID_BULAN[parseInt(m,10)-1]} ${y}`;
}
function DatePickerButton({ value, onChange, style = {} }) {
  const inputRef = useGbRef(null);
  return (
    <button type="button" onClick={() => inputRef.current && (inputRef.current.showPicker ? inputRef.current.showPicker() : inputRef.current.click())}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#F0EBFF', border: '1px solid transparent',
        height: 38, padding: '0 14px', borderRadius: 10,
        fontSize: 13, fontWeight: 600, color: '#1A1228',
        fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
        ...style,
      }}>
      <Icons.calendar size={14} style={{ color: '#4A2D8C' }} />
      {formatTglID(value) || 'Pilih Tanggal'}
      <Icons.chevron size={13} style={{ color: '#574872' }} />
      <input ref={inputRef} type="date" value={value || ''} onChange={(e) => onChange(e.target.value)}
        style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', border: 0 }} />
    </button>
  );
}

window.MuurahGlobal = { ToastContainer, ConfirmHost, BellDropdown, DatePickerButton, formatTglID };

// ════════════════════════════════════════════════════════════════════════════
//   OPERATOR STORE — list operator dari Master Data
// ════════════════════════════════════════════════════════════════════════════
window.MuurahOperatorStore = (() => {
  let data = [
    { id: 'telkomsel', nama: 'Telkomsel',  prefix: ['0811','0812','0813','0821','0822','0823','0852','0853','0851'], logo: '🔴', aktif: true },
    { id: 'indosat',   nama: 'Indosat',    prefix: ['0814','0815','0816','0855','0856','0857','0858'], logo: '🟡', aktif: true },
    { id: 'xl',        nama: 'XL Axiata',  prefix: ['0817','0818','0819','0859','0877','0878'], logo: '🔵', aktif: true },
    { id: 'tri',       nama: 'Tri',        prefix: ['0895','0896','0897','0898','0899'], logo: '⚫', aktif: true },
    { id: 'smartfren', nama: 'Smartfren',  prefix: ['0881','0882','0883','0884','0885','0886','0887','0888','0889'], logo: '🟢', aktif: true },
    { id: 'axis',      nama: 'Axis',       prefix: ['0831','0832','0833','0838'], logo: '🟣', aktif: true },
    { id: 'pln',       nama: 'PLN',        prefix: [], logo: '⚡', aktif: true },
    { id: 'bpjs',      nama: 'BPJS',       prefix: [], logo: '🩺', aktif: true },
  ];
  const listeners = new Set();
  return {
    get: () => data,
    getAktif: () => data.filter(o => o.aktif),
    set: (next) => { data = next; listeners.forEach(fn => fn(data)); },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
//   SUPPLIER STORE — list supplier/biller dari Master Data
// ════════════════════════════════════════════════════════════════════════════
window.MuurahSupplierStore = (() => {
  let data = [
    { id: 'digiflazz', name: 'Digiflazz',   kat: ['Pulsa', 'Token PLN', 'Paket Data'], status: 'aktif', sr: 99.1, endpoint: 'https://api.digiflazz.com/v1',  apiKey: 'sk_live_a1b2c3' },
    { id: 'iak',        name: 'IAK',          kat: ['Voucher Game', 'Pulsa'],            status: 'aktif', sr: 97.2, endpoint: 'https://api.iak.id/v2',          apiKey: 'sk_live_f6g7h8' },
    { id: 'ayoconnect', name: 'Ayoconnect',   kat: ['BPJS', 'PDAM', 'Token PLN'],       status: 'aktif', sr: 98.7, endpoint: 'https://api.ayoconnect.id/v1',  apiKey: 'sk_live_k1l2m3' },
    { id: 'tripay',     name: 'Tripay PPOB',  kat: ['Paket Data', 'E-Wallet'],           status: 'gangguan', sr: 84.5, endpoint: 'https://api.tripay.co.id/v1', apiKey: 'sk_live_p6q7r8' },
  ];
  const listeners = new Set();
  return {
    get: () => data,
    getAktif: () => data.filter(s => s.status === 'aktif'),
    set: (next) => { data = next; listeners.forEach(fn => fn(data)); },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
//   BANK STORE
// ════════════════════════════════════════════════════════════════════════════
window.MuurahBankStore = (() => {
  let data = [
    { id: 'bca',     nama: 'BCA',     kode: '014', logo: '🔵', aktif: true },
    { id: 'bni',     nama: 'BNI',     kode: '009', logo: '🟠', aktif: true },
    { id: 'bri',     nama: 'BRI',     kode: '002', logo: '🔵', aktif: true },
    { id: 'mandiri', nama: 'Mandiri', kode: '008', logo: '🟡', aktif: true },
    { id: 'cimb',    nama: 'CIMB Niaga', kode: '022', logo: '🔴', aktif: true },
    { id: 'permata', nama: 'Permata', kode: '013', logo: '🟢', aktif: true },
    { id: 'bsi',     nama: 'BSI',     kode: '451', logo: '⚫', aktif: true },
    { id: 'danamon', nama: 'Danamon', kode: '011', logo: '🔴', aktif: false },
  ];
  const listeners = new Set();
  return {
    get: () => data,
    getAktif: () => data.filter(b => b.aktif),
    set: (next) => { data = next; listeners.forEach(fn => fn(data)); },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
//   ARTIKEL KATEGORI STORE
// ════════════════════════════════════════════════════════════════════════════
window.MuurahArtikelKategoriStore = (() => {
  let data = [
    { id: 'tips',          label: 'Tips',          aktif: true },
    { id: 'promo',         label: 'Promo',         aktif: true },
    { id: 'pengumuman',    label: 'Pengumuman',    aktif: true },
    { id: 'tutorial',      label: 'Tutorial',      aktif: true },
    { id: 'update-fitur',  label: 'Update Fitur',  aktif: true },
  ];
  const listeners = new Set();
  return {
    get: () => data,
    getAktif: () => data.filter(k => k.aktif),
    set: (next) => { data = next; listeners.forEach(fn => fn(data)); },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
//   FAQ KATEGORI STORE
// ════════════════════════════════════════════════════════════════════════════
window.MuurahFaqKategoriStore = (() => {
  let data = [
    { id: 'umum',        label: 'Umum',               aktif: true },
    { id: 'pembayaran',  label: 'Pembayaran',          aktif: true },
    { id: 'pulsa-data',  label: 'Pulsa & Data',        aktif: true },
    { id: 'game',        label: 'Game & Voucher',      aktif: true },
    { id: 'bpjs',        label: 'BPJS & Tagihan',      aktif: true },
    { id: 'reseller',    label: 'Reseller',            aktif: true },
    { id: 'akun',        label: 'Akun & Keamanan',     aktif: true },
  ];
  const listeners = new Set();
  return {
    get: () => data,
    getAktif: () => data.filter(k => k.aktif),
    set: (next) => { data = next; listeners.forEach(fn => fn(data)); },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();
