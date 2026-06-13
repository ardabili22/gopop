// produk.jsx — Produk & Harga screen
const { useState: useProdState, useMemo: useProdMemo, useEffect: useProdEffect } = React;

const PRODUK_DATA = [
  { sku: 'TSEL-PUL-10',   nama: 'Pulsa Telkomsel 10.000',     operator: 'Telkomsel', hpp: 9_850,   jual: 10_500,  l1: 10_300, l2: 10_100, l3: 9_950,  kategori: 'pulsa', status: 'aktif',
    sumber: [
      { biller: 'Digiflazz',     hpp: 9_850,  jual: 10_500, status: 'aktif' },
      { biller: 'IAK',           hpp: 9_900,  jual: 10_600, status: 'standby' },
      { biller: 'Ayoconnect',    hpp: 9_950,  jual: 10_650, status: 'standby' },
    ] },
  { sku: 'TSEL-PUL-25',   nama: 'Pulsa Telkomsel 25.000',     operator: 'Telkomsel', hpp: 24_625,  jual: 25_500,  l1: 25_250, l2: 25_100, l3: 24_900, kategori: 'pulsa', status: 'aktif',
    sumber: [
      { biller: 'IAK',           hpp: 24_625, jual: 25_500, status: 'aktif' },
      { biller: 'Digiflazz',     hpp: 24_700, jual: 25_600, status: 'standby' },
    ] },
  { sku: 'ISAT-PUL-25',   nama: 'Pulsa Indosat 25.000',       operator: 'Indosat',   hpp: 24_500,  jual: 25_250,  l1: 25_050, l2: 24_900, l3: 24_750, kategori: 'pulsa', status: 'aktif',
    sumber: [
      { biller: 'Digiflazz',     hpp: 24_500, jual: 25_250, status: 'aktif' },
      { biller: 'Tripay PPOB',   hpp: 24_650, jual: 25_400, status: 'standby' },
      { biller: 'IAK',           hpp: 24_700, jual: 25_450, status: 'standby' },
    ] },
  { sku: 'PLN-TOK-100K',  nama: 'Token PLN 100.000',          operator: 'PLN',       hpp: 100_350, jual: 101_500, l1: 101_250, l2: 101_000, l3: 100_750, kategori: 'pln', status: 'aktif',
    sumber: [
      { biller: 'Ayoconnect',    hpp: 100_350, jual: 101_500, status: 'aktif' },
      { biller: 'Digiflazz',     hpp: 100_450, jual: 101_600, status: 'standby' },
    ] },
  { sku: 'XL-DATA-12GB',  nama: 'XL Hot Rod 12 GB 30 Hari',   operator: 'XL Axiata', hpp: 62_000,  jual: 65_000,  l1: 64_200, l2: 63_500, l3: 62_800, kategori: 'data', status: 'aktif',
    sumber: [
      { biller: 'Tripay PPOB',   hpp: 62_000, jual: 65_000, status: 'aktif' },
      { biller: 'IAK',           hpp: 62_400, jual: 65_400, status: 'standby' },
    ] },
  { sku: 'MLBB-DM-86',    nama: 'Mobile Legends 86 Diamond',  operator: 'Moonton',   hpp: 20_500,  jual: 22_000,  l1: 21_700, l2: 21_400, l3: 21_000, kategori: 'game', status: 'nonaktif',
    sumber: [
      { biller: 'IAK',           hpp: 20_500, jual: 22_000, status: 'aktif' },
      { biller: 'Digiflazz',     hpp: 20_650, jual: 22_150, status: 'standby' },
      { biller: 'Ayoconnect',    hpp: 20_800, jual: 22_300, status: 'standby' },
    ],
    gameConfig: {
      template: 'Mobile Legends',
      fields: [
        { key: 'user_id',   label: 'ID Game',   placeholder: 'cth. 123456789', tipe: 'numeric' },
        { key: 'server_id', label: 'Server ID', placeholder: 'cth. 1234',      tipe: 'numeric' },
      ],
    },
  },
  { sku: 'FF-DM-100',     nama: 'Free Fire 100 Diamond',      operator: 'Garena',    hpp: 14_200,  jual: 15_500,  l1: 15_300, l2: 15_100, l3: 14_900, kategori: 'game', status: 'aktif',
    sumber: [
      { biller: 'Digiflazz',     hpp: 14_200, jual: 15_500, status: 'aktif' },
      { biller: 'Tripay PPOB',   hpp: 14_350, jual: 15_650, status: 'standby' },
    ],
    gameConfig: {
      template: 'Free Fire',
      fields: [
        { key: 'user_id', label: 'ID Game', placeholder: 'cth. 1234567890', tipe: 'numeric' },
      ],
    },
  },
  { sku: 'PDAM-SBY-50K',  nama: 'PDAM Surya Sembada Surabaya', operator: 'PDAM',     hpp: 0,       jual: 2_500,   l1: 2_500,  l2: 2_500,  l3: 2_500,  kategori: 'tagihan', status: 'aktif',
    sumber: [
      { biller: 'Ayoconnect',    hpp: 0, jual: 2_500, status: 'aktif' },
      { biller: 'IAK',           hpp: 0, jual: 2_750, status: 'standby' },
    ],
    wilayahConfig: {
      tipeLayanan: 'PDAM',
      provider: 'PDAM Surya Sembada Surabaya',
      wilayah: [
        { kode: '01', nama: 'Surabaya Pusat', kodeTarif: 'SBY-01' },
        { kode: '02', nama: 'Surabaya Timur', kodeTarif: 'SBY-02' },
        { kode: '03', nama: 'Surabaya Barat', kodeTarif: 'SBY-03' },
      ],
    },
  },
];

const TABS = [
  { id: 'semua',   label: 'Semua Produk' },
  { id: 'pulsa',   label: 'Pulsa' },
  { id: 'pln',     label: 'PLN' },
  { id: 'data',    label: 'Paket Data' },
  { id: 'bpjs',    label: 'BPJS' },
  { id: 'game',    label: 'Game' },
  { id: 'emoney',  label: 'E-Money' },
  { id: 'tagihan', label: 'Tagihan' },
];

function Produk() {
  const { Card } = window.MuurahShell;
  const [tab, setTab] = useProdState('semua');
  const [query, setQuery] = useProdState('');
  const [operator, setOperator] = useProdState('semua');
  const [statusF, setStatusF] = useProdState('semua');
  const [editing, setEditing] = useProdState(null);
  const [adding, setAdding] = useProdState(false);
  const [mappingOpen, setMappingOpen] = useProdState(false);
  const [view, setView] = useProdState('produk');
  const [produkList, setProdukList] = useProdState(() => PRODUK_DATA.map(p => ({ ...p, sumber: p.sumber.map(s => ({ ...s })) })));
  const [sumberTarget, setSumberTarget] = useProdState(null);

  const filtered = useProdMemo(() => {
    return produkList.filter(p => {
      if (tab !== 'semua' && p.kategori !== tab) return false;
      if (operator !== 'semua' && p.operator !== operator) return false;
      if (statusF !== 'semua' && p.status !== statusF) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${p.sku} ${p.nama} ${p.operator}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [produkList, tab, query, operator, statusF]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Produk & Harga
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            Kelola katalog, HPP, dan harga jual
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setMappingOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
            height: 38, padding: '0 16px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}>
            <Icons.phone size={14} /> Mapping Operator
          </button>
          <button onClick={() => setAdding(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#4A2D8C', color: '#FFFFFF', border: 0,
            height: 38, padding: '0 16px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            transition: 'all 130ms ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3A2370'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4A2D8C'}
          >
            <span style={{ fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span> Tambah Produk
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: 4, display: 'inline-flex', gap: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <button onClick={() => setView('produk')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 16px', borderRadius: 9, border: 0, cursor: 'pointer',
          background: view === 'produk' ? '#4A2D8C' : 'transparent',
          color: view === 'produk' ? '#FFFFFF' : '#574872',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>
          <Icons.tag size={14} /> Daftar Produk
        </button>
        <button onClick={() => setView('promo')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 16px', borderRadius: 9, border: 0, cursor: 'pointer',
          background: view === 'promo' ? '#4A2D8C' : 'transparent',
          color: view === 'promo' ? '#FFFFFF' : '#574872',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>
          <Icons.percent size={14} /> Promo Harga Produk
        </button>
      </div>

      {view === 'promo' ? (
        <PromoHargaPanel />
      ) : (
      <>

      <Card padding={0} style={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #E0D9F5',
          padding: '0 20px',
        }}>
          {TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: 'transparent', border: 0, padding: '16px 14px 14px',
                fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                color: isActive ? '#4A2D8C' : '#574872',
                borderBottom: isActive ? '2px solid #4A2D8C' : '2px solid transparent',
                marginBottom: -1, fontFamily: 'inherit',
                transition: 'all 130ms ease',
              }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Filter row */}
        <div style={{
          padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center',
          borderBottom: '1px solid #E0D9F5',
        }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari SKU, nama produk…"
              style={prInputStyle({ paddingLeft: 36, width: '100%' })} />
          </div>
          <ProdSelect value={operator} onChange={setOperator} options={[
            { value: 'semua', label: 'Semua Operator' },
            { value: 'Telkomsel', label: 'Telkomsel' },
            { value: 'Indosat', label: 'Indosat' },
            { value: 'XL Axiata', label: 'XL Axiata' },
            { value: 'Tri', label: 'Tri' },
            { value: 'PLN', label: 'PLN' },
            { value: 'Moonton', label: 'Moonton' },
          ]} />
          <ProdSelect value={statusF} onChange={setStatusF} prefix="Status:" options={[
            { value: 'semua', label: 'Semua' },
            { value: 'aktif', label: 'Aktif' },
            { value: 'nonaktif', label: 'Nonaktif' },
          ]} />
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
            height: 38, padding: '0 14px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}>
            <Icons.filter size={14} /> Filter
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>
            {filtered.length} produk
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...prThStyle, width: 40, paddingLeft: 20 }}><input type="checkbox" style={prCbStyle} /></th>
              <th style={prThStyle}>SKU</th>
              <th style={prThStyle}>Nama Produk</th>
              <th style={prThStyle}>Operator</th>
              <th style={{ ...prThStyle, textAlign: 'right' }}>HPP</th>
              <th style={{ ...prThStyle, textAlign: 'right' }}>Harga Jual</th>
              <th style={{ ...prThStyle, textAlign: 'right' }}>Margin</th>
              <th style={prThStyle}>Status</th>
              <th style={{ ...prThStyle, textAlign: 'right', paddingRight: 20 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const margin = ((p.jual - p.hpp) / p.jual) * 100;
              const marginTone = margin >= 5 ? { bg: '#F0FDF4', fg: '#16A34A' }
                                : margin >= 2 ? { bg: '#FFFBEB', fg: '#D97706' }
                                : { bg: '#EDE8FF', fg: '#C0001A' };
              return (
                <tr key={p.sku} style={{ borderTop: '1px solid #F0EBFF', height: 56, transition: 'background 130ms ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...prTdStyle, paddingLeft: 20 }}>
                    <input type="checkbox" style={prCbStyle} />
                  </td>
                  <td style={prTdStyle}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#4A2D8C', fontWeight: 600 }}>
                      {p.sku}
                    </span>
                  </td>
                  <td style={{ ...prTdStyle, color: '#1A1228', fontWeight: 500 }}>{p.nama}</td>
                  <td style={prTdStyle}>
                    <span style={{
                      fontSize: 11, color: '#574872', background: '#F0EBFF',
                      padding: '3px 9px', borderRadius: 8, fontWeight: 500,
                    }}>{p.operator}</span>
                  </td>
                  <td style={{ ...prTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#574872' }}>
                    Rp {p.hpp.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...prTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                    Rp {p.jual.toLocaleString('id-ID')}
                    <div style={{ fontSize: 10, fontWeight: 500, color: '#9085AE', fontFamily: 'inherit', marginTop: 2 }}>
                      via {(p.sumber.find(s => s.status === 'aktif') || p.sumber[0]).biller}
                    </div>
                  </td>
                  <td style={{ ...prTdStyle, textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: marginTone.bg, color: marginTone.fg,
                      fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{margin.toFixed(1)}%</span>
                  </td>
                  <td style={prTdStyle}>
                    <ProdStatusPill status={p.status} />
                  </td>
                  <td style={{ ...prTdStyle, textAlign: 'right', paddingRight: 20 }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={() => setEditing(p)} style={ghostBtn('#4A2D8C')}>Edit</button>
                      <button onClick={() => setSumberTarget(p.sku)} style={ghostBtn('#4A2D8C')}>Sumber ({p.sumber.length})</button>
                      <button onClick={() => window.muurahConfirm({
                        title: (p.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan') + ' produk ' + p.sku + '?',
                        body: 'Produk "' + p.nama + '" akan ' + (p.status === 'aktif' ? 'disembunyikan' : 'ditampilkan kembali') + ' dari katalog reseller dan user.',
                        confirmLabel: p.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan',
                        danger: p.status === 'aktif',
                        onConfirm: () => window.muurahToast(
                          'Produk ' + p.sku + ' · status → ' + (p.status === 'aktif' ? 'Nonaktif' : 'Aktif'),
                          'success'
                        ),
                      })} style={ghostBtn(p.status === 'aktif' ? '#C0001A' : '#16A34A')}>
                        {p.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '60px 20px', textAlign: 'center', color: '#9085AE', fontSize: 13 }}>
                Tidak ada produk yang cocok dengan filter ini.
              </td></tr>
            )}
          </tbody>
        </table>

        {/* Footer pagination */}
        <div style={{
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872' }}>
            Menampilkan <b style={{ color: '#1A1228' }}>1–{filtered.length}</b> dari <b style={{ color: '#1A1228' }}>{filtered.length}</b> produk
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button disabled style={pageBtnStyle(true)}><Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} /></button>
            <button style={{ ...pageBtnStyle(false), background: '#4A2D8C', color: '#FFFFFF', borderColor: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>1</button>
            <button disabled style={pageBtnStyle(true)}><Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      {editing && <EditProdukModal produk={editing} onClose={() => setEditing(null)} />}
      {/* Add Modal */}
      {adding && <AddProdukModal onClose={() => setAdding(false)} />}
      {mappingOpen && <OperatorMappingModal onClose={() => setMappingOpen(false)} />}
      {sumberTarget && (
        <SumberBillerModal
          produk={produkList.find(p => p.sku === sumberTarget)}
          onClose={() => setSumberTarget(null)}
          onSwitch={(biller) => {
            const produk = produkList.find(p => p.sku === sumberTarget);
            const target = produk.sumber.find(s => s.biller === biller);
            window.muurahConfirm({
              title: 'Pindahkan sumber "' + produk.nama + '" ke ' + biller + '?',
              body: 'HPP & harga jual produk ini akan langsung berubah ke nilai dari ' + biller + ' (HPP Rp ' + target.hpp.toLocaleString('id-ID') + ', Jual Rp ' + target.jual.toLocaleString('id-ID') + ') untuk transaksi selanjutnya.',
              confirmLabel: 'Pindahkan',
              onConfirm: () => {
                setProdukList(list => list.map(p => p.sku !== sumberTarget ? p : {
                  ...p,
                  hpp: target.hpp,
                  jual: target.jual,
                  sumber: p.sumber.map(s => ({ ...s, status: s.biller === biller ? 'aktif' : 'standby' })),
                }));
                window.muurahToast('Sumber "' + produk.nama + '" dipindah ke ' + biller, 'success');
              },
            });
          }}
          onToggleAutoSwitch={(v) => {
            window.muurahConfirm({
              title: (v ? 'Aktifkan' : 'Matikan') + ' auto-switch biller untuk produk ini?',
              body: v
                ? 'Kalau biller utama produk ini masuk status Danger/Blackout (lihat Saldo & Limit Biller), sistem akan otomatis pindah ke sumber lain yang statusnya Aman, sehingga pop-up "sedang gangguan" tidak perlu muncul ke user.'
                : 'Produk ini tidak akan auto-switch lagi — kalau biller utamanya kritis, akan mengikuti aksi pop-up yang dikonfigurasi di Saldo & Limit Biller.',
              confirmLabel: v ? 'Aktifkan' : 'Matikan',
              danger: !v,
              onConfirm: () => setProdukList(list => list.map(p => p.sku !== sumberTarget ? p : { ...p, autoSwitch: v })),
            });
          }}
          onAddSumber={(data) => {
            setProdukList(list => list.map(p => p.sku !== sumberTarget ? p : { ...p, sumber: [...p.sumber, { ...data, status: 'standby' }] }));
            window.muurahToast('Sumber biller "' + data.biller + '" ditambahkan ke "' + produkList.find(p => p.sku === sumberTarget).nama + '"', 'success');
          }}
          onDeleteSumber={(biller) => {
            window.muurahConfirm({
              title: 'Hapus sumber "' + biller + '"?',
              body: 'Sumber biller ini tidak akan lagi jadi opsi untuk produk ini.',
              confirmLabel: 'Hapus', danger: true,
              onConfirm: () => {
                setProdukList(list => list.map(p => p.sku !== sumberTarget ? p : { ...p, sumber: p.sumber.filter(s => s.biller !== biller) }));
                window.muurahToast('Sumber "' + biller + '" dihapus', 'success');
              },
            });
          }}
        />
      )}
      </>
      )}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function EditProdukModal({ produk, onClose }) {
  const [form, setForm] = useProdState({
    ...produk,
    gameConfig: produk.gameConfig || DEFAULT_GAME_CONFIG(),
    wilayahConfig: produk.wilayahConfig || DEFAULT_WILAYAH_CONFIG(),
  });

  useProdEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const marginOf = (price) => ((price - form.hpp) / price) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)',
        animation: 'muurah-fade 180ms ease',
      }} />
      <div style={{
        position: 'relative', width: 560, maxHeight: 'calc(100vh - 80px)',
        background: '#FFFFFF', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(26,18,40,0.25)',
        display: 'flex', flexDirection: 'column',
        animation: 'muurah-pop 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Edit Produk
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {produk.nama}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.x size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="SKU">
            <input value={form.sku} readOnly style={prInputStyle({
              width: '100%', background: '#FAF8FF',
              color: '#574872', fontFamily: 'JetBrains Mono, monospace',
              cursor: 'not-allowed',
            })} />
          </Field>

          <Field label="Nama Produk">
            <input value={form.nama} onChange={(e) => update('nama', e.target.value)}
              style={prInputStyle({ width: '100%' })} />
          </Field>

          <Field label="Operator">
            <div style={{ position: 'relative' }}>
              <select value={form.operator} onChange={(e) => update('operator', e.target.value)} style={prInputStyle({
                width: '100%', appearance: 'none', paddingRight: 32, cursor: 'pointer',
              })}>
                {['Telkomsel','Indosat','XL Axiata','Tri','Smartfren','PLN','Moonton','Free Fire Garena'].map(o =>
                  <option key={o} value={o}>{o}</option>
                )}
              </select>
              <Icons.chevron size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
            </div>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="HPP (Cost)">
              <PriceInput value={form.hpp} onChange={(v) => update('hpp', v)} />
            </Field>
            <Field label="Harga Jual User">
              <PriceInput value={form.jual} onChange={(v) => update('jual', v)} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Harga Reseller L1">
              <PriceInput value={form.l1} onChange={(v) => update('l1', v)} />
            </Field>
            <Field label="Harga Reseller L2">
              <PriceInput value={form.l2} onChange={(v) => update('l2', v)} />
            </Field>
            <Field label="Harga Reseller L3">
              <PriceInput value={form.l3} onChange={(v) => update('l3', v)} />
            </Field>
          </div>

          <Field label="Status">
            <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
              <Radio label="Aktif" value="aktif" current={form.status} onChange={(v) => update('status', v)} />
              <Radio label="Nonaktif" value="nonaktif" current={form.status} onChange={(v) => update('status', v)} />
            </div>
          </Field>

          {produk.kategori === 'game' && (
            <GameConfigEditor config={form.gameConfig} onChange={(c) => update('gameConfig', c)} />
          )}
          {produk.kategori === 'tagihan' && (
            <WilayahConfigEditor config={form.wilayahConfig} onChange={(c) => update('wilayahConfig', c)} />
          )}

          {/* Preview margin */}
          <div style={{
            background: '#F0EBFF', borderRadius: 10, padding: 14,
            marginTop: 4,
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 10 }}>
              Preview Margin
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <MarginRow label="Jual ke User" price={form.jual} margin={marginOf(form.jual)} />
              <MarginRow label="Reseller L1" price={form.l1} margin={marginOf(form.l1)} />
              <MarginRow label="Reseller L2" price={form.l2} margin={marginOf(form.l2)} />
              <MarginRow label="Reseller L3" price={form.l3} margin={marginOf(form.l3)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
            height: 38, padding: '0 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}>Batal</button>
          <button onClick={() => { onClose(); window.muurahToast('Produk ' + produk.sku + ' berhasil diperbarui', 'success'); }} style={{
            background: '#4A2D8C', color: '#FFFFFF', border: 0,
            height: 38, padding: '0 20px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'background 130ms ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3A2370'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4A2D8C'}
          >
            <Icons.check size={14} strokeWidth={2.5} /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: '#574872',
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>{label}</label>
      {children}
    </div>
  );
}

function PriceInput({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        fontSize: 12, color: '#9085AE', fontWeight: 500,
        pointerEvents: 'none',
      }}>Rp</span>
      <input type="text"
        value={value.toLocaleString('id-ID')}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, '')) || 0;
          onChange(n);
        }}
        style={prInputStyle({
          width: '100%', paddingLeft: 34,
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
          textAlign: 'right', paddingRight: 12,
        })}
      />
    </div>
  );
}

function Radio({ label, value, current, onChange }) {
  const active = value === current;
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: 'pointer',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `1.5px solid ${active ? '#4A2D8C' : '#C5B8EF'}`,
        background: '#FFFFFF',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 130ms ease',
      }}>
        {active && <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#4A2D8C' }} />}
      </span>
      <input type="radio" checked={active} onChange={() => onChange(value)} style={{ display: 'none' }} />
      <span style={{ fontSize: 13, color: '#1A1228', fontWeight: active ? 600 : 500 }}>{label}</span>
    </label>
  );
}

function MarginRow({ label, price, margin }) {
  const tone = margin >= 5 ? '#16A34A' : margin >= 2 ? '#D97706' : '#C0001A';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#FFFFFF', borderRadius: 8, padding: '8px 12px',
    }}>
      <span style={{ fontSize: 12, color: '#574872', fontWeight: 500 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>
          Rp {price.toLocaleString('id-ID')}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: tone, fontFamily: 'JetBrains Mono, monospace' }}>
          {margin.toFixed(1)}%
        </span>
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   GAME CONFIG EDITOR (form input per produk Game/Voucher)
// ════════════════════════════════════════════════════════════════════════════
const GAME_TEMPLATES = {
  'Mobile Legends': [
    { key: 'user_id',   label: 'ID Game',   placeholder: 'cth. 123456789', tipe: 'numeric' },
    { key: 'server_id', label: 'Server ID', placeholder: 'cth. 1234',      tipe: 'numeric' },
  ],
  'Free Fire': [
    { key: 'user_id', label: 'ID Game', placeholder: 'cth. 1234567890', tipe: 'numeric' },
  ],
  'PUBG Mobile': [
    { key: 'user_id', label: 'ID Game', placeholder: 'cth. 5123456789', tipe: 'numeric' },
  ],
  'Genshin Impact': [
    { key: 'uid',    label: 'UID',     placeholder: 'cth. 800123456', tipe: 'numeric' },
    { key: 'server', label: 'Server',  placeholder: 'cth. Asia',      tipe: 'text' },
  ],
  'Custom': [],
};

function DEFAULT_GAME_CONFIG() {
  return { template: 'Mobile Legends', fields: GAME_TEMPLATES['Mobile Legends'].map(f => ({ ...f })) };
}
function DEFAULT_WILAYAH_CONFIG() {
  return {
    tipeLayanan: 'PDAM',
    provider: '',
    wilayah: [{ kode: '01', nama: '', kodeTarif: '' }],
  };
}

function GameConfigEditor({ config, onChange }) {
  const c = config || DEFAULT_GAME_CONFIG();

  function applyTemplate(tpl) {
    onChange({ template: tpl, fields: GAME_TEMPLATES[tpl].map(f => ({ ...f })) });
  }
  function updateField(idx, patch) {
    onChange({ ...c, template: 'Custom', fields: c.fields.map((f, i) => i === idx ? { ...f, ...patch } : f) });
  }
  function removeField(idx) {
    onChange({ ...c, template: 'Custom', fields: c.fields.filter((_, i) => i !== idx) });
  }
  function addField() {
    onChange({ ...c, template: 'Custom', fields: [...c.fields, { key: 'field_' + (c.fields.length + 1), label: '', placeholder: '', tipe: 'numeric' }] });
  }

  return (
    <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
        Konfigurasi Input Game
      </div>
      <div style={{ fontSize: 11, color: '#9085AE', lineHeight: 1.5, marginTop: -6 }}>
        Field ini akan tampil di halaman input nomor end-user untuk produk ini
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Object.keys(GAME_TEMPLATES).map(tpl => {
          const active = c.template === tpl;
          return (
            <button key={tpl} type="button" onClick={() => applyTemplate(tpl)} style={{
              padding: '6px 11px', borderRadius: 8, cursor: 'pointer',
              background: active ? '#4A2D8C' : '#FFFFFF',
              border: active ? '1px solid #4A2D8C' : '1px solid #E0D9F5',
              color: active ? '#FFFFFF' : '#574872',
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
            }}>{tpl}</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {c.fields.length === 0 && (
          <div style={{ fontSize: 11, color: '#9085AE', textAlign: 'center', padding: '8px 0' }}>
            Belum ada field input. Klik "Tambah Field" untuk menambah.
          </div>
        )}
        {c.fields.map((f, i) => (
          <div key={i} style={{ background: '#FFFFFF', borderRadius: 9, padding: 10, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 110px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, color: '#9085AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Label Field</span>
              <input value={f.label} onChange={(e) => updateField(i, { label: e.target.value })}
                placeholder="cth. User ID"
                style={prInputStyle({ width: '100%', height: 34 })} />
            </div>
            <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, color: '#9085AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Placeholder / Contoh</span>
              <input value={f.placeholder} onChange={(e) => updateField(i, { placeholder: e.target.value })}
                placeholder="cth. 123456789"
                style={prInputStyle({ width: '100%', height: 34 })} />
            </div>
            <div style={{ flex: '0 0 110px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, color: '#9085AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipe</span>
              <div style={{ position: 'relative' }}>
                <select value={f.tipe} onChange={(e) => updateField(i, { tipe: e.target.value })}
                  style={{ ...prInputStyle({ width: '100%', height: 34, appearance: 'none', paddingRight: 26, fontSize: 12 }), cursor: 'pointer' }}>
                  <option value="numeric">Angka</option>
                  <option value="text">Teks</option>
                </select>
                <Icons.chevron size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
              </div>
            </div>
            <button onClick={() => removeField(i)} style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid #E0D9F5',
              background: '#FFFFFF', color: '#C0001A', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><Icons.x size={14} /></button>
          </div>
        ))}
      </div>

      <button onClick={addField} style={{
        alignSelf: 'flex-start',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
        height: 32, padding: '0 12px', borderRadius: 8,
        fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
      }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Tambah Field
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   WILAYAH / KODE TARIF EDITOR (form input untuk PDAM, PBB, Internet & TV, PGN)
// ════════════════════════════════════════════════════════════════════════════
const TIPE_LAYANAN_OPTIONS = ['PDAM', 'PBB', 'Internet & TV', 'PGN'];

function WilayahConfigEditor({ config, onChange }) {
  const c = config || DEFAULT_WILAYAH_CONFIG();

  function updateRow(idx, patch) {
    onChange({ ...c, wilayah: c.wilayah.map((w, i) => i === idx ? { ...w, ...patch } : w) });
  }
  function removeRow(idx) {
    onChange({ ...c, wilayah: c.wilayah.filter((_, i) => i !== idx) });
  }
  function addRow() {
    const nextKode = String(c.wilayah.length + 1).padStart(2, '0');
    onChange({ ...c, wilayah: [...c.wilayah, { kode: nextKode, nama: '', kodeTarif: '' }] });
  }

  return (
    <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
        Konfigurasi Wilayah & Kode Tarif
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#9085AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipe Layanan</span>
          <div style={{ position: 'relative' }}>
            <select value={c.tipeLayanan} onChange={(e) => onChange({ ...c, tipeLayanan: e.target.value })}
              style={{ ...prInputStyle({ width: '100%', appearance: 'none', paddingRight: 30 }), cursor: 'pointer' }}>
              {TIPE_LAYANAN_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <Icons.chevron size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#9085AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nama Penyelenggara / Provider</span>
          <input value={c.provider} onChange={(e) => onChange({ ...c, provider: e.target.value })}
            placeholder="cth. PDAM Surya Sembada Surabaya"
            style={prInputStyle({ width: '100%' })} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 38px', gap: 8, fontSize: 10, color: '#9085AE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 2px' }}>
          <span>Kode</span><span>Nama Wilayah / Cabang</span><span>Kode Tarif</span><span />
        </div>
        {c.wilayah.map((w, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 38px', gap: 8 }}>
            <input value={w.kode} onChange={(e) => updateRow(i, { kode: e.target.value })}
              style={prInputStyle({ width: '100%', height: 34, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' })} />
            <input value={w.nama} onChange={(e) => updateRow(i, { nama: e.target.value })}
              placeholder="cth. Surabaya Pusat"
              style={prInputStyle({ width: '100%', height: 34 })} />
            <input value={w.kodeTarif} onChange={(e) => updateRow(i, { kodeTarif: e.target.value })}
              placeholder="cth. SBY-01"
              style={prInputStyle({ width: '100%', height: 34, fontFamily: 'JetBrains Mono, monospace' })} />
            <button onClick={() => removeRow(i)} style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid #E0D9F5',
              background: '#FFFFFF', color: '#C0001A', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icons.x size={14} /></button>
          </div>
        ))}
      </div>

      <button onClick={addRow} style={{
        alignSelf: 'flex-start',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
        height: 32, padding: '0 12px', borderRadius: 8,
        fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
      }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Tambah Wilayah
      </button>
    </div>
  );
}

// ─── shared bits ─────────────────────────────────────────────────────────────
function prInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}

function ProdSelect({ value, onChange, options, prefix }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        ...prInputStyle({}), appearance: 'none',
        paddingLeft: prefix ? 60 : 12, paddingRight: 30,
        fontWeight: 500, cursor: 'pointer',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {prefix && (
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 12, color: '#9085AE', fontWeight: 500, pointerEvents: 'none',
        }}>{prefix}</span>
      )}
      <Icons.chevron size={13} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: '#574872', pointerEvents: 'none',
      }} />
    </div>
  );
}

function ProdStatusPill({ status }) {
  const map = {
    aktif:    { bg: '#F0FDF4', fg: '#16A34A', label: 'Aktif' },
    nonaktif: { bg: '#EDE8FF', fg: '#574872', label: 'Nonaktif' },
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

function ghostBtn(color) {
  return {
    background: 'transparent', border: '1px solid transparent',
    color: color, fontSize: 12, fontWeight: 600,
    padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 130ms ease',
  };
}

function pageBtnStyle(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}

const prThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const prTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };
const prCbStyle = { width: 16, height: 16, accentColor: '#4A2D8C', cursor: 'pointer' };

window.MuurahProduk = Produk;

// ════════════════════════════════════════════════════════════════════════════
//   ADD PRODUK MODAL — prefilled example
// ════════════════════════════════════════════════════════════════════════════
function AddProdukModal({ onClose }) {
  const [form, setForm] = useProdState({
    sku: 'PLS-TSL-25',
    kategori: 'Pulsa',
    nama: 'Pulsa Telkomsel 25.000',
    operator: 'Telkomsel',
    status: 'aktif',
    hpp: 24_400,
    jual: 25_500,
    l1: 25_200,
    l2: 25_000,
    l3: 24_800,
    gameConfig: DEFAULT_GAME_CONFIG(),
    wilayahConfig: DEFAULT_WILAYAH_CONFIG(),
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useProdEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const marginRp = form.jual - form.hpp;
  const marginPct = (marginRp / form.jual) * 100;
  const marginTone = marginPct >= 5 ? '#16A34A' : marginPct >= 2 ? '#D97706' : '#C0001A';
  const marginBg   = marginPct >= 5 ? '#F0FDF4' : marginPct >= 2 ? '#FFFBEB' : '#FCE7E9';

  function handleSave() {
    onClose();
    window.muurahToast('Produk ' + form.sku + ' berhasil ditambahkan ke katalog', 'success');
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Tambah Produk
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              Produk PPOB Baru
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>
              Data di bawah adalah contoh. Ubah sesuai kebutuhan.
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.x size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="SKU">
              <input value={form.sku} onChange={(e) => update('sku', e.target.value)}
                style={prInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 })} />
            </Field>
            <Field label="Kategori">
              <div style={{ position: 'relative' }}>
                <select value={form.kategori} onChange={(e) => update('kategori', e.target.value)}
                  style={prInputStyle({ width: '100%', appearance: 'none', paddingRight: 32, cursor: 'pointer' })}>
                  {['Pulsa','PLN','Paket Data','BPJS','Voucher Game','E-Money','PDAM','Multifinance'].map(o =>
                    <option key={o} value={o}>{o}</option>
                  )}
                </select>
                <Icons.chevron size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
              </div>
            </Field>
          </div>

          <Field label="Nama Produk">
            <input value={form.nama} onChange={(e) => update('nama', e.target.value)}
              style={prInputStyle({ width: '100%' })} />
          </Field>

          <Field label="Operator">
            <div style={{ position: 'relative' }}>
              <select value={form.operator} onChange={(e) => update('operator', e.target.value)}
                style={prInputStyle({ width: '100%', appearance: 'none', paddingRight: 32, cursor: 'pointer' })}>
                {['Telkomsel','Indosat','XL Axiata','Tri','Smartfren','PLN','Moonton','Free Fire Garena','BPJS Kesehatan','GoPay','Dana','OVO','ShopeePay'].map(o =>
                  <option key={o} value={o}>{o}</option>
                )}
              </select>
              <Icons.chevron size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
            </div>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Harga Beli (HPP)">
              <PriceInput value={form.hpp} onChange={(v) => update('hpp', v)} />
            </Field>
            <Field label="Harga Jual User">
              <PriceInput value={form.jual} onChange={(v) => update('jual', v)} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Harga Reseller L1">
              <PriceInput value={form.l1} onChange={(v) => update('l1', v)} />
            </Field>
            <Field label="Harga Reseller L2">
              <PriceInput value={form.l2} onChange={(v) => update('l2', v)} />
            </Field>
            <Field label="Harga Reseller L3">
              <PriceInput value={form.l3} onChange={(v) => update('l3', v)} />
            </Field>
          </div>

          <Field label="Status">
            <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
              <Radio label="Aktif" value="aktif" current={form.status} onChange={(v) => update('status', v)} />
              <Radio label="Nonaktif" value="nonaktif" current={form.status} onChange={(v) => update('status', v)} />
            </div>
          </Field>

          {form.kategori === 'Voucher Game' && (
            <GameConfigEditor config={form.gameConfig} onChange={(c) => update('gameConfig', c)} />
          )}
          {(form.kategori === 'PDAM' || form.kategori === 'Multifinance') && (
            <WilayahConfigEditor config={form.wilayahConfig} onChange={(c) => update('wilayahConfig', c)} />
          )}

          {/* Preview Margin */}
          <div style={{
            background: marginBg, borderRadius: 10, padding: 14,
            marginTop: 4, border: '1px solid ' + marginTone + '33',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 10 }}>
              Preview Margin
            </div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#574872' }}>Margin User:</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: marginTone, letterSpacing: '-0.01em' }}>
                Rp {marginRp.toLocaleString('id-ID')}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: marginTone }}>
                ({marginPct.toFixed(1)}%)
              </span>
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed ' + marginTone + '55',
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              <MarginRow label="Reseller L1" price={form.l1} margin={((form.l1 - form.hpp) / form.l1) * 100} />
              <MarginRow label="Reseller L2" price={form.l2} margin={((form.l2 - form.hpp) / form.l2) * 100} />
              <MarginRow label="Reseller L3" price={form.l3} margin={((form.l3 - form.hpp) / form.l3) * 100} />
            </div>
          </div>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
            height: 38, padding: '0 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}>Batal</button>
          <button onClick={handleSave} style={{
            background: '#4A2D8C', color: '#FFFFFF', border: 0,
            height: 38, padding: '0 20px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'background 130ms ease',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3A2370'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4A2D8C'}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Tambah Produk
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   OPERATOR MAPPING (auto-detect prefix nomor → operator)
// ════════════════════════════════════════════════════════════════════════════
const OPERATOR_LIST = ['Telkomsel', 'Indosat', 'XL Axiata', 'Tri', 'Smartfren', 'Axis'];

const OPERATOR_TONES = {
  'Telkomsel': { bg: '#FCE7E9', fg: '#C0001A' },
  'Indosat':   { bg: '#FFFBEB', fg: '#D97706' },
  'XL Axiata': { bg: '#EFF6FF', fg: '#3B82F6' },
  'Tri':       { bg: '#EDE8FF', fg: '#4A2D8C' },
  'Smartfren': { bg: '#F0FDF4', fg: '#16A34A' },
  'Axis':      { bg: '#FFF1ED', fg: '#FF6B4A' },
};

const PREFIX_MAP_SEED = [
  { prefix: '0811', operator: 'Telkomsel' }, { prefix: '0812', operator: 'Telkomsel' },
  { prefix: '0813', operator: 'Telkomsel' }, { prefix: '0821', operator: 'Telkomsel' },
  { prefix: '0822', operator: 'Telkomsel' }, { prefix: '0823', operator: 'Telkomsel' },
  { prefix: '0851', operator: 'Telkomsel' }, { prefix: '0852', operator: 'Telkomsel' },
  { prefix: '0853', operator: 'Telkomsel' },
  { prefix: '0814', operator: 'Indosat' }, { prefix: '0815', operator: 'Indosat' },
  { prefix: '0816', operator: 'Indosat' }, { prefix: '0855', operator: 'Indosat' },
  { prefix: '0856', operator: 'Indosat' }, { prefix: '0857', operator: 'Indosat' },
  { prefix: '0858', operator: 'Indosat' },
  { prefix: '0817', operator: 'XL Axiata' }, { prefix: '0818', operator: 'XL Axiata' },
  { prefix: '0819', operator: 'XL Axiata' }, { prefix: '0859', operator: 'XL Axiata' },
  { prefix: '0877', operator: 'XL Axiata' }, { prefix: '0878', operator: 'XL Axiata' },
  { prefix: '0895', operator: 'Tri' }, { prefix: '0896', operator: 'Tri' },
  { prefix: '0897', operator: 'Tri' }, { prefix: '0898', operator: 'Tri' },
  { prefix: '0899', operator: 'Tri' },
  { prefix: '0881', operator: 'Smartfren' }, { prefix: '0882', operator: 'Smartfren' },
  { prefix: '0883', operator: 'Smartfren' }, { prefix: '0884', operator: 'Smartfren' },
  { prefix: '0885', operator: 'Smartfren' }, { prefix: '0886', operator: 'Smartfren' },
  { prefix: '0887', operator: 'Smartfren' }, { prefix: '0888', operator: 'Smartfren' },
  { prefix: '0889', operator: 'Smartfren' },
  { prefix: '0831', operator: 'Axis' }, { prefix: '0832', operator: 'Axis' },
  { prefix: '0833', operator: 'Axis' }, { prefix: '0838', operator: 'Axis' },
];

function OperatorMappingModal({ onClose }) {
  const { useState: useOmState } = React;
  const [rows, setRows] = useOmState(PREFIX_MAP_SEED);
  const [operators, setOperators] = useOmState(OPERATOR_LIST.map(o => ({ name: o, logo: null })));
  const [newPrefix, setNewPrefix] = useOmState('');
  const [newOperator, setNewOperator] = useOmState(OPERATOR_LIST[0]);
  const [editingPrefix, setEditingPrefix] = useOmState(null);
  const logoInputRef = React.useRef(null);
  const [logoTarget, setLogoTarget] = useOmState(null);

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const grouped = operators.map(op => ({
    operator: op.name,
    logo: op.logo,
    prefixes: rows.filter(r => r.operator === op.name).sort((a,b) => a.prefix.localeCompare(b.prefix)),
  }));

  function ensureOperator(name) {
    if (!operators.some(o => o.name.toLowerCase() === name.toLowerCase())) {
      setOperators(ops => [...ops, { name, logo: null }]);
    }
  }

  function addPrefix() {
    const p = newPrefix.trim();
    const opName = newOperator.trim();
    if (!/^08\d{2}$/.test(p)) {
      window.muurahToast('Format prefix harus 4 digit dan diawali 08, cth. 0812', 'error');
      return;
    }
    if (!opName) {
      window.muurahToast('Nama operator wajib diisi', 'error');
      return;
    }
    if (rows.some(r => r.prefix === p)) {
      window.muurahToast('Prefix ' + p + ' sudah terdaftar untuk ' + rows.find(r => r.prefix === p).operator, 'error');
      return;
    }
    ensureOperator(opName);
    setRows(rs => [...rs, { prefix: p, operator: opName }]);
    window.muurahToast('Prefix ' + p + ' ditambahkan untuk ' + opName, 'success');
    setNewPrefix('');
  }
  function changeOperator(prefix, operator) {
    setRows(rs => rs.map(r => r.prefix === prefix ? { ...r, operator } : r));
    setEditingPrefix(null);
    window.muurahToast('Prefix ' + prefix + ' dipindahkan ke ' + operator, 'success');
  }
  function deletePrefix(prefix) {
    setRows(rs => rs.filter(r => r.prefix !== prefix));
    window.muurahToast('Prefix ' + prefix + ' dihapus dari mapping', 'success');
  }
  function handleLogoFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !logoTarget) return;
    if (!file.type.startsWith('image/')) {
      window.muurahToast('File harus berupa gambar (PNG/JPG/SVG)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setOperators(ops => ops.map(o => o.name === logoTarget ? { ...o, logo: reader.result } : o));
      window.muurahToast('Logo ' + logoTarget + ' berhasil diunggah', 'success');
      setLogoTarget(null);
    };
    reader.readAsDataURL(file);
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
              Produk & Harga
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              Mapping Operator (Auto-Detect Nomor)
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>
              4 digit awal nomor HP user akan dicocokkan ke daftar ini untuk otomatis pilih produk Pulsa/Data sesuai operator
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Add new prefix */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <Field label="Prefix Baru">
              <input value={newPrefix} onChange={(e) => setNewPrefix(e.target.value.replace(/\D/g, '').slice(0,4))}
                placeholder="0812" maxLength={4}
                style={prInputStyle({ width: 100, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, textAlign: 'center' })} />
            </Field>
            <Field label="Operator">
              <input value={newOperator} onChange={(e) => setNewOperator(e.target.value)}
                placeholder="cth. Telkomsel, by.U, dst" list="operator-suggestions"
                style={prInputStyle({ width: 180 })} />
              <datalist id="operator-suggestions">
                {operators.map(o => <option key={o.name} value={o.name} />)}
              </datalist>
            </Field>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoFile} style={{ display: 'none' }} />
            <button onClick={addPrefix} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#4A2D8C', color: '#FFFFFF', border: 0,
              height: 38, padding: '0 16px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah
            </button>
          </div>

          {/* Grouped list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {grouped.map(g => {
              const t = OPERATOR_TONES[g.operator] || { bg: '#F0EBFF', fg: '#4A2D8C' };
              return (
                <div key={g.operator} style={{ border: '1px solid #E0D9F5', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', background: t.bg, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => { setLogoTarget(g.operator); logoInputRef.current.click(); }}
                      title={g.logo ? 'Ganti logo' : 'Upload logo operator'}
                      style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0, padding: 0,
                        border: g.logo ? '1px solid rgba(0,0,0,0.06)' : '1.5px dashed ' + t.fg,
                        background: g.logo ? '#FFFFFF' : 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        color: t.fg,
                      }}>
                      {g.logo
                        ? <img src={g.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        : <Icons.image size={13} />}
                    </button>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.fg, flex: 1 }}>{g.operator}</span>
                    <span style={{ fontSize: 10, color: t.fg, fontFamily: 'JetBrains Mono, monospace' }}>{g.prefixes.length} prefix</span>
                  </div>
                  <div style={{ padding: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {g.prefixes.length === 0 && <span style={{ fontSize: 11, color: '#9085AE', padding: '4px 0' }}>Belum ada prefix</span>}
                    {g.prefixes.map(r => (
                      <div key={r.prefix} style={{ position: 'relative' }}>
                        <button onClick={() => setEditingPrefix(editingPrefix === r.prefix ? null : r.prefix)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#F0EBFF', border: 0, borderRadius: 8,
                          padding: '5px 6px 5px 10px', cursor: 'pointer',
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: '#1A1228',
                        }}>
                          {r.prefix}
                          <span onClick={(e) => { e.stopPropagation(); deletePrefix(r.prefix); }} style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 18, height: 18, borderRadius: 5, color: '#9085AE',
                          }}><Icons.x size={11} /></span>
                        </button>
                        {editingPrefix === r.prefix && (
                          <div style={{
                            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 5,
                            background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 10,
                            boxShadow: '0 12px 32px rgba(26,18,40,0.12)', padding: 6,
                            display: 'flex', flexDirection: 'column', gap: 2, minWidth: 140,
                          }}>
                            {operators.filter(op => op.name !== r.operator).map(op => (
                              <button key={op.name} onClick={() => changeOperator(r.prefix, op.name)} style={{
                                textAlign: 'left', background: 'transparent', border: 0,
                                padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
                                fontSize: 12, color: '#574872', fontFamily: 'inherit',
                              }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#F0EBFF'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >Pindah ke {op.name}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: '#4A2D8C', color: '#FFFFFF', border: 0,
            height: 38, padding: '0 20px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icons.check size={14} strokeWidth={2.5} /> Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   PROMO HARGA PRODUK — diskon langsung di harga jual (per kategori/produk)
// ════════════════════════════════════════════════════════════════════════════
const PROMO_HARGA_SEED = [
  { id: 'PH-001', scope: 'kategori', target: 'pulsa', tipe: 'persen',  nilai: 5,    mulai: '2026-05-15', selesai: '2026-05-31', status: 'aktif' },
  { id: 'PH-002', scope: 'produk',   target: 'PLN-TOK-100K', tipe: 'nominal', nilai: 1_000, mulai: '2026-05-01', selesai: null, status: 'aktif' },
  { id: 'PH-003', scope: 'kategori', target: 'game',  tipe: 'persen',  nilai: 10,   mulai: '2026-06-01', selesai: '2026-06-30', status: 'nonaktif' },
];

function PromoHargaPanel() {
  const [promos, setPromos] = useProdState(PROMO_HARGA_SEED);
  const [editing, setEditing] = useProdState(null);
  const [adding, setAdding] = useProdState(false);
  const [bulkOpen, setBulkOpen] = useProdState(false);

  function targetLabel(p) {
    if (p.scope === 'kategori') {
      const t = TABS.find(x => x.id === p.target);
      return t ? t.label : p.target;
    }
    const prod = PRODUK_DATA.find(x => x.sku === p.target);
    return prod ? prod.nama : p.target;
  }
  function diskonLabel(p) {
    return p.tipe === 'persen' ? p.nilai + '%' : 'Rp ' + p.nilai.toLocaleString('id-ID');
  }
  function periodeLabel(p) {
    if (!p.mulai && !p.selesai) return 'Tanpa batas waktu';
    const fmt = (d) => (window.MuurahGlobal && window.MuurahGlobal.formatTglID) ? window.MuurahGlobal.formatTglID(d) : d;
    return p.selesai ? fmt(p.mulai) + ' – ' + fmt(p.selesai) : 'Mulai ' + fmt(p.mulai);
  }

  function savePromo(dataOrList) {
    if (editing) {
      const data = dataOrList;
      setPromos(ps => ps.map(p => p.id === editing.id ? { ...p, ...data } : p));
      window.muurahToast('Promo "' + targetLabel(data) + '" berhasil diperbarui', 'success');
    } else {
      const list = Array.isArray(dataOrList) ? dataOrList : [dataOrList];
      let nextNum = Math.max(0, ...promos.map(p => parseInt(p.id.split('-')[1]))) + 1;
      const newEntries = list.map(data => ({ ...data, id: 'PH-' + String(nextNum++).padStart(3, '0') }));
      setPromos(ps => [...ps, ...newEntries]);
      window.muurahToast(
        newEntries.length > 1
          ? newEntries.length + ' promo harga berhasil ditambahkan'
          : 'Promo harga berhasil ditambahkan',
        'success'
      );
    }
    setEditing(null);
    setAdding(false);
  }
  function deletePromo(p) {
    window.muurahConfirm({
      title: 'Hapus promo "' + targetLabel(p) + '"?',
      body: 'Harga produk akan kembali ke harga normal setelah promo ini dihapus.',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setPromos(ps => ps.filter(x => x.id !== p.id));
        window.muurahToast('Promo dihapus', 'success');
      },
    });
  }
  function toggleStatus(p) {
    const activating = p.status !== 'aktif';
    window.muurahConfirm({
      title: (activating ? 'Aktifkan' : 'Nonaktifkan') + ' promo "' + targetLabel(p) + '"?',
      body: activating
        ? 'Harga produk' + (p.scope === 'kategori' ? ' di kategori ini' : ' ini') + ' akan langsung berkurang ' + diskonLabel(p) + ' untuk transaksi baru.'
        : 'Harga akan kembali normal untuk transaksi baru.',
      confirmLabel: activating ? 'Aktifkan' : 'Nonaktifkan',
      danger: !activating,
      onConfirm: () => setPromos(ps => ps.map(x => x.id === p.id ? { ...x, status: activating ? 'aktif' : 'nonaktif' } : x)),
    });
  }

  function saveBulk({ targets, scope, tipe, nilai, mulai, selesai, status }) {
    let lastNum = Math.max(0, ...promos.map(p => parseInt(p.id.split('-')[1])));
    const newPromos = targets.map(target => {
      lastNum += 1;
      return { id: 'PH-' + String(lastNum).padStart(3, '0'), scope, target, tipe, nilai, mulai, selesai: selesai || null, status };
    });
    setPromos(ps => [...ps, ...newPromos]);
    setBulkOpen(false);
    window.muurahToast(newPromos.length + ' promo harga berhasil dibuat sekaligus', 'success');
  }

  return (
    <PanelCard2
      title="Promo Harga Produk"
      subtitle="Diskon langsung di harga jual — berbeda dari Promo & Voucher (kode kupon). Produk yang sedang kena promo harga ini hanya berlaku untuk harga normal & tidak bisa dipakai bersamaan dengan kode voucher."
      action={<div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setBulkOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
          height: 38, padding: '0 16px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <Icons.percent size={14} /> Atur Diskon Massal
        </button>
        <button onClick={() => setAdding(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#4A2D8C', color: '#FFFFFF', border: 0,
          height: 38, padding: '0 16px', borderRadius: 10,
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah Promo Harga
        </button>
      </div>}
      padded={false}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...phThStyle, paddingLeft: 24 }}>Scope</th>
            <th style={phThStyle}>Target</th>
            <th style={phThStyle}>Diskon</th>
            <th style={phThStyle}>Periode</th>
            <th style={phThStyle}>Status</th>
            <th style={{ ...phThStyle, paddingRight: 24, textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((p) => (
            <tr key={p.id} style={{ borderTop: '1px solid #F0EBFF', height: 56 }}>
              <td style={{ ...phTdStyle, paddingLeft: 24 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 6,
                  background: p.scope === 'kategori' ? '#EDE8FF' : '#FFF1ED',
                  color: p.scope === 'kategori' ? '#4A2D8C' : '#FF6B4A',
                }}>{p.scope === 'kategori' ? 'Kategori' : 'Produk'}</span>
              </td>
              <td style={{ ...phTdStyle, color: '#1A1228', fontWeight: 600 }}>{targetLabel(p)}</td>
              <td style={{ ...phTdStyle, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#16A34A' }}>
                − {diskonLabel(p)}
              </td>
              <td style={{ ...phTdStyle, fontSize: 12, color: '#574872' }}>{periodeLabel(p)}</td>
              <td style={phTdStyle}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 6,
                  background: p.status === 'aktif' ? '#F0FDF4' : '#F0EBFF',
                  color: p.status === 'aktif' ? '#16A34A' : '#9085AE',
                }}>{p.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
              </td>
              <td style={{ ...phTdStyle, paddingRight: 24, textAlign: 'right' }}>
                <button onClick={() => toggleStatus(p)} style={phGhostBtn(p.status === 'aktif' ? '#D97706' : '#16A34A')}>
                  {p.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button onClick={() => setEditing(p)} style={phGhostBtn('#4A2D8C')}>Edit</button>
                <button onClick={() => deletePromo(p)} style={phGhostBtn('#C0001A')}>Hapus</button>
              </td>
            </tr>
          ))}
          {promos.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>Belum ada promo harga. Klik "Tambah Promo Harga".</td></tr>
          )}
        </tbody>
      </table>

      {(editing || adding) && (
        <PromoHargaModal promo={editing} onClose={() => { setEditing(null); setAdding(false); }} onSave={savePromo} />
      )}
      {bulkOpen && (
        <BulkPromoModal onClose={() => setBulkOpen(false)} onSave={saveBulk} />
      )}
    </PanelCard2>
  );
}

function PanelCard2({ title, subtitle, action, children, padded = true }) {
  const { Card } = window.MuurahShell;
  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid #F0EBFF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14,
      }}>
        <div>
          {title && <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>{title}</div>}
          {subtitle && <div style={{ fontSize: 13, color: '#574872', marginTop: 4, maxWidth: 560 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={padded ? { padding: 24 } : {}}>{children}</div>
    </Card>
  );
}

function PromoHargaModal({ promo, onClose, onSave }) {
  const [form, setForm] = useProdState(promo ? { ...promo } : { scope: 'kategori', target: null, targets: [], tipe: 'persen', nilai: 5, mulai: '2026-06-13', selesai: '', status: 'aktif' });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const kategoriOptions = TABS.filter(t => t.id !== 'semua');
  const isValid = promo
    ? (form.target && form.nilai > 0 && form.mulai && (form.tipe !== 'persen' || form.nilai <= 100))
    : (form.targets.length > 0 && form.nilai > 0 && form.mulai && (form.tipe !== 'persen' || form.nilai <= 100));

  function toggleTarget(id) {
    setForm(f => ({ ...f, targets: f.targets.includes(id) ? f.targets.filter(x => x !== id) : [...f.targets, id] }));
  }

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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Promo Harga Produk</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {promo ? 'Edit Promo Harga' : 'Tambah Promo Harga'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PhField label="Berlaku Untuk">
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ id: 'kategori', label: 'Kategori' }, { id: 'produk', label: 'Produk Individual' }].map(s => {
                const active = form.scope === s.id;
                return (
                  <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, scope: s.id, target: null, targets: [] }))} style={{
                    flex: 1, padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
                    background: active ? '#EDE8FF' : '#FFFFFF',
                    border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                    color: active ? '#4A2D8C' : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>{s.label}</button>
                );
              })}
            </div>
          </PhField>

          {promo ? (
            <PhField label={form.scope === 'kategori' ? 'Kategori' : 'Produk'}>
              {form.scope === 'kategori' ? (
                <ProdSelect value={form.target} onChange={(v) => u('target', v)}
                  options={kategoriOptions.map(t => ({ value: t.id, label: t.label }))} />
              ) : (
                <ProdSelect value={form.target} onChange={(v) => u('target', v)}
                  options={PRODUK_DATA.map(p => ({ value: p.sku, label: p.nama + ' — Rp ' + p.jual.toLocaleString('id-ID') }))} />
              )}
            </PhField>
          ) : (
            <PhField label={(form.scope === 'kategori' ? 'Pilih Kategori' : 'Pilih Produk') + ' — bisa lebih dari satu, diskon yang sama akan diterapkan ke semuanya'}>
              <div style={{ border: '1px solid #E0D9F5', borderRadius: 10, maxHeight: 220, overflowY: 'auto' }}>
                {(form.scope === 'kategori'
                  ? kategoriOptions.map(t => ({ id: t.id, label: t.label, sub: null }))
                  : PRODUK_DATA.map(p => ({ id: p.sku, label: p.nama, sub: 'Rp ' + p.jual.toLocaleString('id-ID') }))
                ).map((opt, i) => {
                  const checked = form.targets.includes(opt.id);
                  return (
                    <label key={opt.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', cursor: 'pointer',
                      borderTop: i === 0 ? 'none' : '1px solid #F0EBFF',
                      background: checked ? '#F0EBFF' : 'transparent',
                    }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: checked ? 'none' : '1.5px solid #C5B8EF',
                        background: checked ? '#4A2D8C' : '#FFFFFF', color: '#FFFFFF', flexShrink: 0,
                      }}>
                        {checked && <Icons.check size={12} strokeWidth={3} />}
                      </span>
                      <span style={{ fontSize: 13, color: '#1A1228', fontWeight: checked ? 600 : 500, flex: 1 }}>{opt.label}</span>
                      {opt.sub && <span style={{ fontSize: 12, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>{opt.sub}</span>}
                      <input type="checkbox" checked={checked} onChange={() => toggleTarget(opt.id)} style={{ display: 'none' }} />
                    </label>
                  );
                })}
              </div>
              {form.targets.length > 0 && (
                <div style={{ fontSize: 12, color: '#4A2D8C', fontWeight: 600 }}>{form.targets.length} {form.scope === 'kategori' ? 'kategori' : 'produk'} dipilih</div>
              )}
            </PhField>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PhField label="Tipe Diskon">
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'persen', label: '% Persen' }, { id: 'nominal', label: 'Rp Nominal' }].map(t => {
                  const active = form.tipe === t.id;
                  return (
                    <button key={t.id} type="button" onClick={() => u('tipe', t.id)} style={{
                      flex: 1, padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
                      background: active ? '#EDE8FF' : '#FFFFFF',
                      border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                      color: active ? '#4A2D8C' : '#574872',
                      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    }}>{t.label}</button>
                  );
                })}
              </div>
            </PhField>
            <PhField label={'Nilai Diskon' + (form.tipe === 'persen' ? ' (%, maks 100)' : ' (Rp)')}>
              <input type="number" min="0" max={form.tipe === 'persen' ? 100 : undefined}
                value={form.nilai} onChange={(e) => u('nilai', parseInt(e.target.value) || 0)}
                style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PhField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PhField label="Tanggal Mulai">
              <input type="date" value={form.mulai} onChange={(e) => u('mulai', e.target.value)}
                style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PhField>
            <PhField label="Tanggal Selesai (opsional)">
              <input type="date" value={form.selesai || ''} onChange={(e) => u('selesai', e.target.value)}
                style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PhField>
          </div>

          {form.scope === 'produk' && (() => {
            const skus = promo ? [form.target] : form.targets;
            const prods = PRODUK_DATA.filter(p => skus.includes(p.sku));
            if (prods.length === 0) return null;
            return (
              <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Preview Harga</span>
                {prods.map(prod => {
                  const diskon = form.tipe === 'persen' ? Math.round(prod.jual * form.nilai / 100) : form.nilai;
                  const harga = Math.max(0, prod.jual - diskon);
                  return (
                    <div key={prod.sku} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                      <span style={{ color: '#574872' }}>{prod.nama}</span>
                      <span>
                        <span style={{ color: '#9085AE', textDecoration: 'line-through', fontFamily: 'JetBrains Mono, monospace', marginRight: 8 }}>Rp {prod.jual.toLocaleString('id-ID')}</span>
                        <span style={{ color: '#16A34A', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>Rp {harga.toLocaleString('id-ID')}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <PhField label="Status">
            <PsSelectLike value={form.status} onChange={(v) => u('status', v)} options={[{ value: 'aktif', label: 'Aktif' }, { value: 'nonaktif', label: 'Nonaktif' }]} />
          </PhField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={phSecondaryBtn()}>Batal</button>
          <button onClick={() => {
            if (!isValid) { window.muurahToast('Lengkapi target, nilai diskon (persen maks 100), dan tanggal mulai', 'error'); return; }
            const { targets, target, ...rest } = form;
            const common = { ...rest, selesai: form.selesai || null };
            if (promo) {
              const finalData = { ...common, target };
              window.muurahConfirm({
                title: 'Simpan perubahan promo ini?',
                body: 'Harga produk akan langsung berubah sesuai konfigurasi baru untuk transaksi selanjutnya.',
                confirmLabel: 'Simpan Perubahan',
                onConfirm: () => onSave(finalData),
              });
            } else {
              const list = targets.map(t => ({ ...common, scope: form.scope, target: t }));
              onSave(list);
            }
          }} style={phPrimaryBtn()}>
            <Icons.check size={14} strokeWidth={2.5} /> {promo ? 'Simpan Perubahan' : (form.targets.length > 1 ? `Tambah ${form.targets.length} Promo` : 'Tambah Promo')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PhField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}
function PsSelectLike({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={phInputStyle({ width: '100%', appearance: 'none', paddingRight: 30, cursor: 'pointer' })}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icons.chevron size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
    </div>
  );
}
function phInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    ...over,
  };
}
function phPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function phSecondaryBtn() {
  return {
    background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
    height: 38, padding: '0 18px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function phGhostBtn(color) {
  return {
    background: 'transparent', color, border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
const phThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF',
};
const phTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

// ─── Bulk Adjust Promo Harga ──────────────────────────────────────────────────
function BulkPromoModal({ onClose, onSave }) {
  const [scope, setScope] = useProdState('kategori');
  const [selectedKategori, setSelectedKategori] = useProdState([]);
  const [selectedProduk, setSelectedProduk] = useProdState([]);
  const [katFilter, setKatFilter] = useProdState('semua');
  const [tipe, setTipe] = useProdState('persen');
  const [nilai, setNilai] = useProdState(5);
  const [mulai, setMulai] = useProdState('2026-06-13');
  const [selesai, setSelesai] = useProdState('');
  const [status, setStatus] = useProdState('aktif');

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const kategoriOptions = TABS.filter(t => t.id !== 'semua');
  const produkFiltered = PRODUK_DATA.filter(p => katFilter === 'semua' || p.kategori === katFilter);

  function toggleKategori(id) {
    setSelectedKategori(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }
  function toggleProduk(sku) {
    setSelectedProduk(s => s.includes(sku) ? s.filter(x => x !== sku) : [...s, sku]);
  }
  function toggleAllVisible() {
    const visibleSkus = produkFiltered.map(p => p.sku);
    const allSelected = visibleSkus.every(sku => selectedProduk.includes(sku));
    if (allSelected) {
      setSelectedProduk(s => s.filter(sku => !visibleSkus.includes(sku)));
    } else {
      setSelectedProduk(s => [...new Set([...s, ...visibleSkus])]);
    }
  }

  const targets = scope === 'kategori' ? selectedKategori : selectedProduk;
  const isValid = targets.length > 0 && nilai > 0 && mulai && (tipe !== 'persen' || nilai <= 100);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)', animation: 'muurah-fade 180ms ease' }} />
      <div style={{
        position: 'relative', width: 640, maxHeight: 'calc(100vh - 60px)',
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Promo Harga Produk</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>Atur Diskon Massal</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>Terapkan diskon yang sama ke banyak kategori/produk sekaligus, tanpa setting satu-satu</div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Scope switch */}
          <PhField label="Terapkan ke">
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ id: 'kategori', label: 'Beberapa Kategori' }, { id: 'produk', label: 'Beberapa Produk' }].map(s => {
                const active = scope === s.id;
                return (
                  <button key={s.id} type="button" onClick={() => setScope(s.id)} style={{
                    flex: 1, padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
                    background: active ? '#EDE8FF' : '#FFFFFF',
                    border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                    color: active ? '#4A2D8C' : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>{s.label}</button>
                );
              })}
            </div>
          </PhField>

          {scope === 'kategori' ? (
            <PhField label={'Pilih Kategori (' + selectedKategori.length + ' dipilih)'}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {kategoriOptions.map(k => {
                  const active = selectedKategori.includes(k.id);
                  return (
                    <button key={k.id} type="button" onClick={() => toggleKategori(k.id)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                      background: active ? '#4A2D8C' : '#F0EBFF',
                      color: active ? '#FFFFFF' : '#574872',
                      border: 0, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    }}>
                      {active && <Icons.check size={12} strokeWidth={2.8} />} {k.label}
                    </button>
                  );
                })}
              </div>
            </PhField>
          ) : (
            <PhField label={'Pilih Produk (' + selectedProduk.length + ' dipilih)'}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {['semua', ...kategoriOptions.map(k => k.id)].map(k => {
                  const active = katFilter === k;
                  const lbl = k === 'semua' ? 'Semua' : kategoriOptions.find(x => x.id === k).label;
                  return (
                    <button key={k} type="button" onClick={() => setKatFilter(k)} style={{
                      padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                      background: active ? '#4A2D8C' : '#F0EBFF',
                      color: active ? '#FFFFFF' : '#574872',
                      border: 0, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    }}>{lbl}</button>
                  );
                })}
              </div>
              <div style={{ border: '1px solid #E0D9F5', borderRadius: 10, overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ position: 'sticky', top: 0, background: '#F0EBFF' }}>
                      <th style={{ ...phThStyle, background: '#F0EBFF', width: 40, paddingLeft: 12 }}>
                        <button onClick={toggleAllVisible} title="Pilih/batalkan semua" style={{
                          width: 18, height: 18, borderRadius: 5, border: '1.5px solid #C5B8EF',
                          background: '#FFFFFF', cursor: 'pointer', padding: 0,
                        }} />
                      </th>
                      <th style={{ ...phThStyle, background: '#F0EBFF' }}>Nama Produk</th>
                      <th style={{ ...phThStyle, background: '#F0EBFF', textAlign: 'right' }}>Harga</th>
                      <th style={{ ...phThStyle, background: '#F0EBFF', textAlign: 'right', paddingRight: 12 }}>Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produkFiltered.map(p => {
                      const checked = selectedProduk.includes(p.sku);
                      return (
                        <tr key={p.sku} onClick={() => toggleProduk(p.sku)} style={{
                          borderTop: '1px solid #F0EBFF', height: 42, cursor: 'pointer',
                          background: checked ? '#F0EBFF' : 'transparent',
                        }}>
                          <td style={{ ...phTdStyle, paddingLeft: 12 }}>
                            <span style={{
                              width: 16, height: 16, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: checked ? 'none' : '1.5px solid #C5B8EF',
                              background: checked ? '#4A2D8C' : '#FFFFFF', color: '#FFFFFF',
                            }}>{checked && <Icons.check size={10} strokeWidth={3} />}</span>
                          </td>
                          <td style={{ ...phTdStyle, color: '#1A1228', fontWeight: checked ? 600 : 500 }}>{p.nama}</td>
                          <td style={{ ...phTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#574872' }}>Rp {p.jual.toLocaleString('id-ID')}</td>
                          <td style={{ ...phTdStyle, textAlign: 'right', paddingRight: 12 }}>
                            <span style={{ fontSize: 11, color: '#574872', background: '#F0EBFF', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{kategoriOptions.find(k => k.id === p.kategori)?.label || p.kategori}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {produkFiltered.length === 0 && (
                      <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', fontSize: 12, color: '#9085AE' }}>Tidak ada produk.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </PhField>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PhField label="Tipe Diskon">
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'persen', label: '% Persen' }, { id: 'nominal', label: 'Rp Nominal' }].map(t => {
                  const active = tipe === t.id;
                  return (
                    <button key={t.id} type="button" onClick={() => setTipe(t.id)} style={{
                      flex: 1, padding: '8px 10px', borderRadius: 9, cursor: 'pointer',
                      background: active ? '#EDE8FF' : '#FFFFFF',
                      border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                      color: active ? '#4A2D8C' : '#574872',
                      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    }}>{t.label}</button>
                  );
                })}
              </div>
            </PhField>
            <PhField label={'Nilai Diskon' + (tipe === 'persen' ? ' (%, maks 100)' : ' (Rp)')}>
              <input type="number" min="0" max={tipe === 'persen' ? 100 : undefined}
                value={nilai} onChange={(e) => setNilai(parseInt(e.target.value) || 0)}
                style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PhField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PhField label="Tanggal Mulai">
              <input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)}
                style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PhField>
            <PhField label="Tanggal Selesai (opsional)">
              <input type="date" value={selesai} onChange={(e) => setSelesai(e.target.value)}
                style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </PhField>
          </div>

          <PhField label="Status">
            <PsSelectLike value={status} onChange={setStatus} options={[{ value: 'aktif', label: 'Aktif' }, { value: 'nonaktif', label: 'Nonaktif' }]} />
          </PhField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: '#9085AE' }}>
            <b style={{ color: '#4A2D8C', fontFamily: 'JetBrains Mono, monospace' }}>{targets.length}</b> {scope === 'kategori' ? 'kategori' : 'produk'} terpilih
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={phSecondaryBtn()}>Batal</button>
            <button onClick={() => {
              if (!isValid) { window.muurahToast('Pilih minimal 1 ' + (scope === 'kategori' ? 'kategori' : 'produk') + ', isi nilai diskon (persen maks 100), dan tanggal mulai', 'error'); return; }
              window.muurahConfirm({
                title: 'Buat ' + targets.length + ' promo harga sekaligus?',
                body: 'Diskon ' + (tipe === 'persen' ? nilai + '%' : 'Rp ' + nilai.toLocaleString('id-ID')) + ' akan diterapkan ke ' + targets.length + ' ' + (scope === 'kategori' ? 'kategori' : 'produk') + ' yang dipilih, mulai ' + mulai + (selesai ? ' sampai ' + selesai : ' tanpa batas waktu') + '.',
                confirmLabel: 'Buat Promo',
                onConfirm: () => onSave({ targets, scope, tipe, nilai, mulai, selesai, status }),
              });
            }} style={phPrimaryBtn()}>
              <Icons.check size={14} strokeWidth={2.5} /> Terapkan ke {targets.length || ''} Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SUMBER BILLER per produk — multi-source dengan switch aktif
// ════════════════════════════════════════════════════════════════════════════
const SUMBER_BILLER_OPTIONS = ['Digiflazz', 'IAK', 'Ayoconnect', 'Tripay PPOB'];

function SumberBillerModal({ produk, onClose, onSwitch, onToggleAutoSwitch, onAddSumber, onDeleteSumber }) {
  const [newBiller, setNewBiller] = useProdState(
    SUMBER_BILLER_OPTIONS.find(b => !produk.sumber.some(s => s.biller === b)) || SUMBER_BILLER_OPTIONS[0]
  );
  const [newHpp, setNewHpp] = useProdState(produk.hpp);
  const [newJual, setNewJual] = useProdState(produk.jual);

  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const availableToAdd = SUMBER_BILLER_OPTIONS.filter(b => !produk.sumber.some(s => s.biller === b));

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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{produk.sku}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>Sumber Biller — {produk.nama}</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>Atur dari biller mana produk ini disuplai. Switch sumber kalau biller utama bermasalah.</div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ ...phThStyle, paddingLeft: 4 }}>Biller</th>
                <th style={{ ...phThStyle, textAlign: 'right' }}>HPP</th>
                <th style={{ ...phThStyle, textAlign: 'right' }}>Jual</th>
                <th style={phThStyle}>Status</th>
                <th style={{ ...phThStyle, textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produk.sumber.map((s) => (
                <tr key={s.biller} style={{ borderTop: '1px solid #F0EBFF', height: 52 }}>
                  <td style={{ ...phTdStyle, paddingLeft: 4, color: '#1A1228', fontWeight: 600 }}>{s.biller}</td>
                  <td style={{ ...phTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#574872' }}>Rp {s.hpp.toLocaleString('id-ID')}</td>
                  <td style={{ ...phTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>Rp {s.jual.toLocaleString('id-ID')}</td>
                  <td style={phTdStyle}>
                    {s.status === 'aktif' ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '4px 9px', borderRadius: 6 }}>Aktif</span>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#9085AE', background: '#F0EBFF', padding: '4px 9px', borderRadius: 6 }}>Standby</span>
                    )}
                  </td>
                  <td style={{ ...phTdStyle, textAlign: 'right' }}>
                    {s.status === 'aktif' ? (
                      <span style={{ fontSize: 11, color: '#9085AE' }}>—</span>
                    ) : (
                      <>
                        <button onClick={() => onSwitch(s.biller)} style={phGhostBtn('#4A2D8C')}>Jadikan Aktif</button>
                        <button onClick={() => onDeleteSumber(s.biller)} style={phGhostBtn('#C0001A')}>Hapus</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tambah sumber baru */}
          {availableToAdd.length > 0 && (
            <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tambah Sumber Biller</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: 8 }}>
                <PsSelectLike value={newBiller} onChange={setNewBiller} options={availableToAdd.map(b => ({ value: b, label: b }))} />
                <input type="number" value={newHpp} onChange={(e) => setNewHpp(parseInt(e.target.value) || 0)} placeholder="HPP"
                  style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
                <input type="number" value={newJual} onChange={(e) => setNewJual(parseInt(e.target.value) || 0)} placeholder="Jual"
                  style={phInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
                <button onClick={() => onAddSumber({ biller: newBiller, hpp: newHpp, jual: newJual })} style={{ ...phPrimaryBtn(), padding: '0 14px' }}>
                  <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> Tambah
                </button>
              </div>
            </div>
          )}

          {/* Auto-switch toggle */}
          <div style={{ borderTop: '1px solid #F0EBFF', paddingTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <Toggle2 checked={!!produk.autoSwitch} onChange={onToggleAutoSwitch} />
              <span>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>Auto-switch ke biller alternatif saat biller utama kritis</div>
                <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>Berkorelasi dengan status Danger/Blackout di Saldo & Limit Biller — kalau aktif, produk ini otomatis pindah ke sumber lain yang aman sebelum pop-up gangguan ditampilkan ke user.</div>
              </span>
            </label>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #E0D9F5', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} style={phPrimaryBtn()}>
            <Icons.check size={14} strokeWidth={2.5} /> Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle2({ checked, onChange }) {
  return (
    <span onClick={() => onChange(!checked)} role="switch" aria-checked={checked} tabIndex={0}
      style={{
        position: 'relative', display: 'inline-block', marginTop: 2,
        width: 36, height: 20, borderRadius: 20,
        background: checked ? '#4A2D8C' : '#C5B8EF',
        cursor: 'pointer', transition: 'background 130ms ease',
        flexShrink: 0,
      }}>
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#FFFFFF', transition: 'left 130ms ease',
      }} />
    </span>
  );
}
