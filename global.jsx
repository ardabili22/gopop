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
