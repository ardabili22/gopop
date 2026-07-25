// cms.jsx — Konten Homepage (Banner & Artikel Tips/Promo) screen
const { useState: useCmsState, useEffect: useCmsEffect } = React;

const CMS_TABS = [
  { id: 'banner-web',    label: 'Banner Web',       icon: 'image',  platform: 'web',    type: 'banner' },
  { id: 'banner-app',   label: 'Banner Mobile App', icon: 'phone',  platform: 'app',    type: 'banner' },
  { id: 'artikel-web',  label: 'Tips & Promo Web',  icon: 'chart',  platform: 'web',    type: 'artikel' },
  { id: 'artikel-app',  label: 'Tips & Promo App',  icon: 'chart',  platform: 'app',    type: 'artikel' },
];

const BANNER_LINK_TARGETS = [
  'Bayar Pulsa', 'Paket Data', 'Token PLN', 'Voucher Game', 'Transfer E-Wallet',
  'BPJS', 'PDAM', 'PBB', 'Internet & TV', 'Reseller', 'Promo Listing',
];

const BANNER_TONES = ['purple', 'lime', 'coral', 'blue', 'gold', 'green'];
const BANNER_TONE_META = {
  purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
  lime:   { bg: '#F4FCE3', fg: '#5B7C12' },
  coral:  { bg: '#FFF1ED', fg: '#FF6B4A' },
  blue:   { bg: '#EFF6FF', fg: '#3B82F6' },
  gold:   { bg: '#FEF9EC', fg: '#D4900A' },
  green:  { bg: '#F0FDF4', fg: '#16A34A' },
};

const BANNER_SEED_WEB = [
  { id: 'w1', judul: 'Transfer E-Wallet Tanpa Ribet', subjudul: 'GoPay, OVO, Dana, ShopeePay — flat fee mulai Rp 1.000', target: '/transfer-ewallet', tone: 'purple', status: 'aktif',   imgDesktop: null, imgMobile: null },
  { id: 'w2', judul: 'Top Up Voucher Game Favorit',   subjudul: 'Mobile Legends, Free Fire, dan lainnya — proses instan',  target: '/voucher-game',       tone: 'coral',  status: 'aktif',   imgDesktop: null, imgMobile: null },
  { id: 'w3', judul: 'Bayar Pulsa & Paket Data',      subjudul: 'Semua operator, harga bersahabat',                         target: '/pulsa',               tone: 'lime',   status: 'aktif',   imgDesktop: null, imgMobile: null },
  { id: 'w4', judul: 'Token PLN 24 Jam',              subjudul: 'Isi token listrik kapan saja, langsung masuk',             target: '/pln',                 tone: 'gold',   status: 'nonaktif', imgDesktop: null, imgMobile: null },
];

const BANNER_SEED_APP = [
  { id: 'a1', judul: 'Transfer E-Wallet Muurah',      subjudul: 'Flat fee Rp 1.000 ke semua e-wallet populer',             target: 'transfer_ewallet',    tone: 'purple', status: 'aktif',   imgDesktop: null, imgMobile: null },
  { id: 'a2', judul: 'Game On! Voucher Instan',        subjudul: 'Top-up ML Diamond, FF, PUBG — langsung masuk',            target: 'game_voucher',        tone: 'coral',  status: 'aktif',   imgDesktop: null, imgMobile: null },
];

function getArtikelKategori() {
  if (window.MuurahArtikelKategoriStore) return window.MuurahArtikelKategoriStore.getAktif().map(k => k.label);
  return ['Tips', 'Promo', 'Pengumuman'];
}

const ARTIKEL_SEED = [
  { id: 1, judul: 'Cashback 5% Setiap Transfer E-Wallet Bulan Ini', kategori: 'Promo', excerpt: 'Nikmati cashback 5% untuk setiap transfer antar e-wallet minimal Rp 50.000 selama periode promo.', konten: 'Nikmati cashback 5% untuk setiap transfer antar e-wallet (GoPay, OVO, Dana, ShopeePay) dengan minimal transaksi Rp 50.000. Cashback otomatis masuk ke saldo dalam 24 jam. Berlaku selama periode promo dan kuota tersedia.', tone: 'coral', status: 'published', tgl: '2026-05-15',
    kodePromo: 'CASHBACK5', autoApply: false, scope: ['GoPay', 'OVO', 'Dana', 'ShopeePay'],
    caraKlaim: ['Buka menu Transfer E-Wallet di aplikasi Gopop', 'Pilih e-wallet tujuan (GoPay, OVO, Dana, atau ShopeePay)', 'Masukkan kode promo CASHBACK5 di halaman checkout', 'Transfer minimal Rp 50.000 — cashback masuk ke saldo dalam 24 jam'],
    faq: [
      { q: 'Apakah promo ini berlaku untuk semua e-wallet?', a: 'Berlaku untuk transfer ke GoPay, OVO, Dana, dan ShopeePay selama kuota promo masih tersedia.' },
      { q: 'Berapa maksimal cashback yang bisa didapat?', a: 'Cashback dihitung 5% dari nominal transfer tanpa batas maksimal per transaksi.' },
    ] },
  { id: 2, judul: '5 Tips Aman Transaksi PPOB di Muurah', kategori: 'Tips', excerpt: 'Pastikan nomor tujuan benar, simpan bukti transaksi, dan kenali ciri promo resmi dari Muurah.', konten: 'Berikut tips aman bertransaksi di Muurah: 1) Selalu cek ulang nomor HP/ID tujuan sebelum bayar, 2) Simpan bukti pembayaran sampai produk masuk, 3) Promo resmi Muurah hanya diinformasikan lewat aplikasi dan channel official, 4) Jangan bagikan OTP/PIN ke siapapun, 5) Hubungi CS via menu Bantuan jika ada kendala.', tone: 'purple', status: 'published', tgl: '2026-05-10' },
  { id: 3, judul: 'Maintenance Sistem Terjadwal', kategori: 'Pengumuman', excerpt: 'Akan ada maintenance sistem pada 24 Mei pukul 23:00–01:00 WIB. Beberapa layanan mungkin terganggu.', konten: 'Kami akan melakukan maintenance sistem terjadwal pada 24 Mei 2026 pukul 23:00–01:00 WIB untuk meningkatkan kualitas layanan. Selama periode tersebut, beberapa transaksi mungkin mengalami keterlambatan. Kami mohon maaf atas ketidaknyamanan ini.', tone: 'blue', status: 'terjadwal', tgl: '2026-05-24' },
  { id: 4, judul: 'Diskon Spesial Token PLN Akhir Pekan', kategori: 'Promo', excerpt: 'Dapatkan diskon 2% untuk pembelian token PLN setiap Sabtu & Minggu.', konten: 'Setiap Sabtu dan Minggu, nikmati diskon 2% (maks Rp 2.000) untuk setiap pembelian token PLN minimal Rp 20.000. Promo otomatis diterapkan saat checkout, tanpa kode promo.', tone: 'gold', status: 'draft', tgl: '2026-05-23',
    kodePromo: '', autoApply: true, scope: [],
    caraKlaim: ['Pilih menu Token PLN', 'Masukkan ID pelanggan / nomor meter', 'Pilih nominal token minimal Rp 20.000', 'Diskon otomatis terpotong saat checkout di hari Sabtu/Minggu'],
    faq: [
      { q: 'Apakah perlu kode promo?', a: 'Tidak, diskon diterapkan otomatis tanpa kode promo.' },
      { q: 'Kapan promo ini berlaku?', a: 'Setiap hari Sabtu dan Minggu selama periode promo berlangsung.' },
    ] },
];

function ImageUploadField({ value, onChange, aspect = '16/9', minW, minH }) {
  const inputRef = React.useRef(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [checking, setChecking] = React.useState(false);

  function processFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.muurahToast('File harus berupa gambar (PNG/JPG)', 'error');
      return;
    }
    setChecking(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (!minW || !minH) { setChecking(false); onChange(dataUrl); return; }
      const img = new Image();
      img.onload = () => {
        setChecking(false);
        if (img.naturalWidth < minW || img.naturalHeight < minH) {
          window.muurahToast(
            'Gambar terlalu kecil (' + img.naturalWidth + '×' + img.naturalHeight + 'px) — minimal ' + minW + '×' + minH + 'px',
            'error'
          );
          return;
        }
        onChange(dataUrl);
      };
      img.onerror = () => { setChecking(false); window.muurahToast('Gagal membaca gambar', 'error'); };
      img.src = dataUrl;
    };
    reader.onerror = () => { setChecking(false); window.muurahToast('Gagal membaca file', 'error'); };
    reader.readAsDataURL(file);
  }

  function handleFile(e) {
    processFile(e.target.files && e.target.files[0]);
    e.target.value = '';
  }
  function handleDragOver(e) { e.preventDefault(); setDragOver(true); }
  function handleDragLeave() { setDragOver(false); }
  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files && e.dataTransfer.files[0]);
  }

  const sizeHint = 'PNG/JPG, rasio ' + aspect + (minW && minH ? ' · min ' + minW + '×' + minH + 'px' : '');

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {value ? (
        <div
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: aspect, background: '#F0EBFF' }}
        >
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {dragOver && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(74,45,140,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontSize: 12, fontWeight: 700, textAlign: 'center', padding: 8,
            }}>Lepas untuk ganti gambar</div>
          )}
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => inputRef.current.click()} style={{
              background: 'rgba(26,18,40,0.6)', color: '#FFFFFF', border: 0, borderRadius: 8,
              padding: '6px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>Ganti</button>
            <button type="button" onClick={() => onChange(null)} style={{
              width: 28, height: 28, background: 'rgba(26,18,40,0.6)', color: '#FFFFFF', border: 0, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}><Icons.x size={13} /></button>
          </div>
        </div>
      ) : (
        <button
          type="button" onClick={() => inputRef.current.click()}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          style={{
            width: '100%', aspectRatio: aspect, borderRadius: 12,
            border: '1.5px dashed ' + (dragOver ? '#4A2D8C' : '#C5B8EF'),
            background: dragOver ? '#EDE8FF' : '#FAF8FF', color: dragOver ? '#4A2D8C' : '#9085AE',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 130ms ease',
          }}>
          {checking ? (
            <>
              <span className="muurah-spin" style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2px solid #C5B8EF', borderTopColor: '#4A2D8C', display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Memproses…</span>
            </>
          ) : (
            <>
              <Icons.image size={22} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{dragOver ? 'Lepas di sini' : 'Upload Gambar'}</span>
              <span style={{ fontSize: 10 }}>{sizeHint}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

function Cms() {
  const [tab, setTab] = useCmsState('banner-web');
  const cur = CMS_TABS.find(t => t.id === tab) || CMS_TABS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
          Konten Homepage
        </h1>
        <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
          Kelola banner dan artikel untuk tampilan Web dan Mobile App secara terpisah
        </div>
      </div>

      {/* Platform group tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {/* Web group */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 12, padding: 4, display: 'inline-flex', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 8px', fontSize: 10, fontWeight: 700, color: '#9085AE', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Web</span>
          {CMS_TABS.filter(t => t.platform === 'web').map(t => {
            const IconC = Icons[t.icon] || Icons.image;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 9, border: 0, cursor: 'pointer', background: active ? '#4A2D8C' : 'transparent', color: active ? '#FFFFFF' : '#574872', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
                <IconC size={14} /> {t.label.replace(' Web', '')}
              </button>
            );
          })}
        </div>
        {/* Mobile App group */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 12, padding: 4, display: 'inline-flex', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 8px', fontSize: 10, fontWeight: 700, color: '#9085AE', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mobile App</span>
          {CMS_TABS.filter(t => t.platform === 'app').map(t => {
            const IconC = Icons[t.icon] || Icons.image;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 9, border: 0, cursor: 'pointer', background: active ? '#4A2D8C' : 'transparent', color: active ? '#FFFFFF' : '#574872', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
                <IconC size={14} /> {t.label.replace(' Mobile App', '')}
              </button>
            );
          })}
        </div>
      </div>

      {cur.type === 'banner'  && <BannerPanel platform={cur.platform} />}
      {cur.type === 'artikel' && <ArtikelPanel platform={cur.platform} />}
    </div>
  );
}

// ─── Banner Homepage ────────────────────────────────────────────────────────
function BannerPanel({ platform }) {
  const { Card } = window.MuurahShell;
  const seed = platform === 'app' ? BANNER_SEED_APP : BANNER_SEED_WEB;
  const [banners, setBanners] = useCmsState(seed);
  const [editing, setEditing] = useCmsState(null);
  const [adding, setAdding] = useCmsState(false);
  const platformLabel = platform === 'app' ? 'Mobile App' : 'Web';

  function addTarget(label) {
    const v = label.trim();
    if (!v) return false;
    if (targets.some(t => t.toLowerCase() === v.toLowerCase())) {
      window.muurahToast('Halaman "' + v + '" sudah ada di daftar', 'error');
      return false;
    }
    setTargets(ts => [...ts, v]);
    window.muurahToast('Halaman tujuan "' + v + '" ditambahkan ke daftar', 'success');
    return true;
  }

  function toggleStatus(id) {
    setBanners(bs => bs.map(b => b.id === id ? { ...b, status: b.status === 'aktif' ? 'nonaktif' : 'aktif' } : b));
  }
  function move(id, dir) {
    setBanners(bs => {
      const idx = bs.findIndex(b => b.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= bs.length) return bs;
      const copy = [...bs];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }
  function deleteBanner(b) {
    window.muurahConfirm({
      title: 'Hapus banner "' + b.judul + '"?',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setBanners(bs => bs.filter(x => x.id !== b.id));
        window.muurahToast('Banner berhasil dihapus', 'success');
      },
    });
  }
  function saveBanner(data) {
    if (data.id) {
      setBanners(bs => bs.map(b => b.id === data.id ? { ...b, ...data } : b));
      window.muurahToast('Banner berhasil diperbarui', 'success');
    } else {
      const newId = Math.max(0, ...banners.map(b => b.id)) + 1;
      setBanners(bs => [...bs, { ...data, id: newId }]);
      window.muurahToast('Banner baru berhasil ditambahkan', 'success');
    }
    setEditing(null);
    setAdding(false);
  }

  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EBFF', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>Banner {platformLabel}</div>
          <div style={{ fontSize: 13, color: '#574872', marginTop: 4 }}>
            {banners.filter(b => b.status === 'aktif').length} aktif dari {banners.length} banner · urutan = urutan tampil di carousel
          </div>
        </div>
        <button onClick={() => setAdding(true)} style={cmsPrimaryBtn()}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah Banner
        </button>
      </div>

      <div>
        {banners.map((b, idx) => {
          const t = BANNER_TONE_META[b.tone] || BANNER_TONE_META.purple;
          const hasImg = b.imgDesktop || b.imgMobile;
          return (
            <div key={b.id} style={{ padding: '16px 24px', borderTop: idx === 0 ? 0 : '1px solid #F0EBFF', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={() => move(b.id, -1)} disabled={idx === 0} style={cmsIconBtn(idx === 0)}><Icons.arrowUp size={12} /></button>
                <button onClick={() => move(b.id, 1)} disabled={idx === banners.length - 1} style={cmsIconBtn(idx === banners.length - 1)}><Icons.arrowDown size={12} /></button>
              </div>

              {/* preview swatch — shows desktop image if available */}
              <div style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0, background: t.bg, color: t.fg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {b.imgDesktop ? <img src={b.imgDesktop} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icons.image size={22} />}
                {b.imgMobile && !b.imgDesktop && <img src={b.imgMobile} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1228' }}>{b.judul}</div>
                <div style={{ fontSize: 12, color: '#574872', marginTop: 3 }}>{b.subjudul}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 5 }}>
                  <span style={{ fontSize: 11, color: '#9085AE', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icons.arrowR size={11} /> <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#574872', fontWeight: 600 }}>{b.target || '—'}</span>
                  </span>
                  {(b.imgDesktop || b.imgMobile) && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#16A34A', background: '#F0FDF4', padding: '2px 6px', borderRadius: 5 }}>
                      {[b.imgDesktop && 'Desktop', b.imgMobile && 'Mobile'].filter(Boolean).join(' + ')} ✓
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <Toggle checked={b.status === 'aktif'} onChange={() => toggleStatus(b.id)} />
                <button onClick={() => setEditing(b)} style={cmsGhostBtn('#4A2D8C')}>Edit</button>
                <button onClick={() => deleteBanner(b)} style={cmsGhostBtn('#C0001A')}>Hapus</button>
              </div>
            </div>
          );
        })}
      </div>

      {(adding || editing) && (
        <BannerModal banner={editing} onClose={() => { setEditing(null); setAdding(false); }} onSave={saveBanner} platform={platform} />
      )}
    </Card>
  );
}

function BannerHomepageMockup({ form }) {
  const t = BANNER_TONE_META[form.tone] || BANNER_TONE_META.purple;
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #E0D9F5', boxShadow: '0 2px 10px rgba(26,18,40,0.06)' }}>
      {/* Mini nav bar */}
      <div style={{
        padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #F0EBFF', background: '#FFFFFF',
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1A1228' }}>gopop<span style={{ color: '#4A2D8C' }}>•</span></div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10, color: '#9085AE', fontWeight: 600 }}>
          <span style={{ color: '#4A2D8C' }}>Home</span>
          <span>Layanan</span>
          <span>Tips &amp; Promo</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF', background: '#4A2D8C', padding: '4px 12px', borderRadius: 20 }}>Masuk</div>
      </div>

      {/* Hero — gambar full-bleed nutupin seluruh lebar hero, tapi tetep ringkas tingginya */}
      <div style={{
        position: 'relative', minHeight: 150, overflow: 'hidden',
        background: t.bg,
      }}>
        {form.imgDesktop ? (
          <img src={form.imgDesktop} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#574872', fontSize: 11, textAlign: 'center', padding: 12,
          }}>Belum ada gambar</div>
        )}

        {/* Scrim biar teks tetap kebaca di atas foto */}
        {form.imgDesktop && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.6) 42%, rgba(255,255,255,0) 72%)',
          }} />
        )}

        <div style={{ position: 'relative', padding: '14px 16px 32px', maxWidth: '55%' }}>
          <div style={{ fontSize: 9, color: '#574872', fontWeight: 600, marginBottom: 3 }}>Hai, Selamat Datang! 👋</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1A1228', lineHeight: 1.25 }}>Mau bayar apa hari ini?</div>
        </div>

        {/* Floating promo card, meniru posisi di homepage asli */}
        <div style={{
          position: 'absolute', left: 14, bottom: -16, right: 14,
          background: '#FFFFFF', borderRadius: 10, padding: '7px 9px',
          boxShadow: '0 8px 20px rgba(26,18,40,0.14)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
            background: t.bg, color: t.fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.wallet size={12} /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#1A1228', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {form.judul.trim() || 'Judul banner…'}
            </div>
            <div style={{ fontSize: 9, color: '#574872', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {form.subjudul.trim() || 'Subjudul/deskripsi pendek…'}
            </div>
          </div>
          <div style={{
            fontSize: 9, fontWeight: 700, color: '#FFFFFF', background: t.fg,
            padding: '5px 9px', borderRadius: 6, flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap',
          }}>Coba <Icons.arrowR size={9} /></div>
        </div>
      </div>
      {/* Spacer biar floating card gak numpuk sama konten di bawahnya */}
      <div style={{ height: 16, background: '#FFFFFF' }} />
    </div>
  );
}

function BannerMobileMockup({ form }) {
  const t = BANNER_TONE_META[form.tone] || BANNER_TONE_META.purple;
  return (
    <div style={{
      width: 220, margin: '0 auto', borderRadius: 22, overflow: 'hidden',
      border: '1px solid #E0D9F5', boxShadow: '0 2px 10px rgba(26,18,40,0.06)',
    }}>
      {/* Mini app header */}
      <div style={{
        padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #F0EBFF', background: '#FFFFFF',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#1A1228' }}>gopop<span style={{ color: '#4A2D8C' }}>•</span></div>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: '#F0EBFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icons.bell size={11} style={{ color: '#4A2D8C' }} /></div>
      </div>

      {/* Hero — gambar mobile full-bleed */}
      <div style={{ position: 'relative', minHeight: 200, overflow: 'hidden', background: t.bg }}>
        {form.imgMobile ? (
          <img src={form.imgMobile} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#574872', fontSize: 10, textAlign: 'center', padding: 10,
          }}>Belum ada gambar</div>
        )}

        {/* Scrim biar teks atas tetap kebaca */}
        {form.imgMobile && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0) 55%)',
          }} />
        )}

        <div style={{ position: 'relative', padding: '12px 14px 0' }}>
          <div style={{ fontSize: 8, color: '#574872', fontWeight: 600, marginBottom: 2 }}>Hai, Selamat Datang! 👋</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#1A1228', lineHeight: 1.25 }}>Mau bayar apa hari ini?</div>
        </div>
      </div>

      {/* Promo card, ditaruh di bawah hero (pola umum app mobile) */}
      <div style={{ padding: 10, background: '#FFFFFF' }}>
        <div style={{
          borderRadius: 10, padding: '8px 10px', border: '1px solid #F0EBFF',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
            background: t.bg, color: t.fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.wallet size={11} /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#1A1228', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {form.judul.trim() || 'Judul banner…'}
            </div>
            <div style={{ fontSize: 8, color: '#574872', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {form.subjudul.trim() || 'Subjudul/deskripsi pendek…'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BannerModal({ banner, onClose, onSave, platform }) {
  const [form, setForm] = useCmsState(banner || { judul: '', subjudul: '', target: '', tone: 'purple', status: 'aktif', imgDesktop: null, imgMobile: null });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.judul.trim() && form.subjudul.trim();
  const platformHint = platform === 'app' ? 'deep link atau screen name (cth. transfer_ewallet)' : 'path URL (cth. /promo atau /pulsa)';

  useCmsEffect(() => {
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
              Konten Homepage
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {banner ? 'Edit Banner' : 'Tambah Banner Baru'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CmsField label="Judul Banner">
            <input value={form.judul} onChange={(e) => u('judul', e.target.value)}
              placeholder="cth. Transfer E-Wallet Tanpa Ribet"
              style={cmsInputStyle({ width: '100%' })} />
          </CmsField>
          <CmsField label="Subjudul / Deskripsi Pendek">
            <input value={form.subjudul} onChange={(e) => u('subjudul', e.target.value)}
              placeholder="cth. GoPay, OVO, Dana, ShopeePay — flat fee mulai Rp 1.000"
              style={cmsInputStyle({ width: '100%' })} />
          </CmsField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <CmsField label={'Menuju Halaman (' + platformHint + ')'}>
              <input value={form.target} onChange={(e) => u('target', e.target.value)}
                placeholder={platform === 'app' ? 'cth. transfer_ewallet' : 'cth. /transfer-ewallet'}
                style={cmsInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} />
            </CmsField>
            <CmsField label="Status">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6 }}>
                <Toggle checked={form.status === 'aktif'} onChange={() => u('status', form.status === 'aktif' ? 'nonaktif' : 'aktif')} />
                <span style={{ fontSize: 13, color: '#574872' }}>{form.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
              </div>
            </CmsField>
          </div>

          {platform === 'app' ? (
            <CmsField label="Gambar Banner — rasio 9:10, min 360×400px (cth. 720×800px)">
              <ImageUploadField value={form.imgMobile} onChange={(v) => u('imgMobile', v)} aspect="9/10" minW={360} minH={400} />
            </CmsField>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <CmsField label="Gambar Desktop — rasio 16:7, min 1280×560px (cth. 1440×630px, 1600×700px)">
                <ImageUploadField value={form.imgDesktop} onChange={(v) => u('imgDesktop', v)} aspect="16/7" minW={1280} minH={560} />
              </CmsField>
              <CmsField label="Gambar Mobile — rasio 9:10, min 360×400px (cth. 720×800px)">
                <ImageUploadField value={form.imgMobile} onChange={(v) => u('imgMobile', v)} aspect="9/10" minW={360} minH={400} />
              </CmsField>
            </div>
          )}

          {/* Preview — mockup homepage & app gopop.id, biar kebayang hasil akhirnya.
               Banner App cuma satu ukuran, jadi cuma tampil preview app-nya aja. */}
          {platform !== 'app' && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>
                Preview Web
              </div>
              <BannerHomepageMockup form={form} />
            </div>
          )}

          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>
              {platform === 'app' ? 'Preview' : 'Preview Mobile App'}
            </div>
            <BannerMobileMockup form={form} />
            <div style={{ fontSize: 10, color: '#9085AE', marginTop: 6, textAlign: 'center' }}>
              Simulasi tampilan — posisi &amp; ukuran elemen asli di web/app bisa sedikit berbeda
            </div>
          </div>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={cmsSecondaryBtn()}>Batal</button>
          <button onClick={() => isValid ? onSave(form) : window.muurahToast('Judul dan subjudul wajib diisi', 'error')}
            style={{ ...cmsPrimaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {banner ? 'Simpan Perubahan' : 'Tambah Banner'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Artikel Tips & Promo  ───────────────────────────────────────────────────
function ArtikelPanel({ platform }) {
  const { Card } = window.MuurahShell;
  const platformLabel = platform === 'app' ? 'Mobile App' : 'Web';
  const [articles, setArticles] = useCmsState(ARTIKEL_SEED);
  const [katF, setKatF] = useCmsState('semua');
  const [editing, setEditing] = useCmsState(null);
  const [adding, setAdding] = useCmsState(false);

  const filtered = articles.filter(a => katF === 'semua' || a.kategori === katF);

  function toggleStatus(id) {
    setArticles(as => as.map(a => a.id === id ? { ...a, status: a.status === 'published' ? 'draft' : 'published' } : a));
  }
  function deleteArticle(a) {
    window.muurahConfirm({
      title: 'Hapus artikel "' + a.judul + '"?',
      confirmLabel: 'Hapus', danger: true,
      onConfirm: () => {
        setArticles(as => as.filter(x => x.id !== a.id));
        window.muurahToast('Artikel berhasil dihapus', 'success');
      },
    });
  }
  function saveArticle(data) {
    if (data.id) {
      setArticles(as => as.map(a => a.id === data.id ? { ...a, ...data } : a));
      window.muurahToast('Artikel berhasil diperbarui', 'success');
    } else {
      const newId = Math.max(0, ...articles.map(a => a.id)) + 1;
      setArticles(as => [...as, { ...data, id: newId }]);
      window.muurahToast('Artikel baru berhasil ditambahkan', 'success');
    }
    setEditing(null);
    setAdding(false);
  }

  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid #F0EBFF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14,
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>Artikel Tips & Promo {platformLabel}</div>
          <div style={{ fontSize: 13, color: '#574872', marginTop: 4 }}>
            Tampil di menu Tips & Promo aplikasi end-user
          </div>
        </div>
        <button onClick={() => setAdding(true)} style={cmsPrimaryBtn()}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Tambah Artikel
        </button>
      </div>

      <div style={{ padding: '14px 24px', borderBottom: '1px solid #F0EBFF', display: 'flex', gap: 8 }}>
        {['semua', ...getArtikelKategori()].map(k => {
          const active = katF === k;
          return (
            <button key={k} onClick={() => setKatF(k)} style={{
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              background: active ? '#4A2D8C' : '#F0EBFF',
              color: active ? '#FFFFFF' : '#574872',
              border: 0, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            }}>{k === 'semua' ? 'Semua' : k}</button>
          );
        })}
      </div>

      <div>
        {filtered.map((a, idx) => {
          const t = BANNER_TONE_META[a.tone] || BANNER_TONE_META.purple;
          return (
            <div key={a.id} style={{
              padding: '16px 24px', borderTop: idx === 0 ? 0 : '1px solid #F0EBFF',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
                background: t.bg, color: t.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {a.gambar ? <img src={a.gambar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icons.image size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: t.fg, background: t.bg, padding: '2px 8px', borderRadius: 6 }}>{a.kategori}</span>
                  <ArtikelStatusPill status={a.status} />
                  <span style={{ fontSize: 11, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>{fmtTglCms(a.tgl)}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1228', lineHeight: 1.4 }}>{a.judul}</div>
                <div style={{ fontSize: 12, color: '#574872', marginTop: 4, lineHeight: 1.6 }}>{a.excerpt}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <Toggle checked={a.status === 'published'} onChange={() => toggleStatus(a.id)} />
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setEditing(a)} style={cmsGhostBtn('#4A2D8C')}>Edit</button>
                  <button onClick={() => deleteArticle(a)} style={cmsGhostBtn('#C0001A')}>Hapus</button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: '#9085AE' }}>
            Belum ada artikel di kategori ini.
          </div>
        )}
      </div>

      {(adding || editing) && (
        <ArtikelModal artikel={editing} onClose={() => { setEditing(null); setAdding(false); }} onSave={saveArticle} />
      )}
    </Card>
  );
}

function fmtTglCms(iso) {
  const [y, m, d] = iso.split('-');
  const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d} ${bulan[parseInt(m,10)-1]} ${y}`;
}

function ArtikelStatusPill({ status }) {
  const map = {
    published: { bg: '#F0FDF4', fg: '#16A34A', label: 'Published' },
    draft:     { bg: '#F0EBFF', fg: '#9085AE', label: 'Draft' },
    terjadwal: { bg: '#FFFBEB', fg: '#D97706', label: 'Terjadwal' },
  };
  const m = map[status] || map.draft;
  return <span style={{ fontSize: 10, fontWeight: 700, color: m.fg, background: m.bg, padding: '2px 8px', borderRadius: 6 }}>{m.label}</span>;
}

const PROMO_PLATFORMS = [
  { id: 'gopay', label: 'GoPay' },
  { id: 'ovo', label: 'OVO' },
  { id: 'dana', label: 'Dana' },
  { id: 'shopeepay', label: 'ShopeePay' },
  { id: 'linkaja', label: 'LinkAja' },
  { id: 'isaku', label: 'i.saku' },
];
// NOTE: dipake sama getScopeCategoryGroups() di global.jsx buat isi grup "Transfer E-Wallet"
// di dropdown "Berlaku untuk Produk" (dipake bareng Promo & Voucher + Tips & Promo Artikel).

function StepListEditor({ items, onChange, placeholder }) {
  const update = (i, v) => onChange(items.map((it, idx) => idx === i ? v : it));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%', background: '#EDE8FF', color: '#4A2D8C',
            fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{i + 1}</span>
          <input value={step} onChange={(e) => update(i, e.target.value)} placeholder={placeholder}
            style={cmsInputStyle({ flex: 1 })} />
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={cmsIconBtn(i === 0)} title="Naik"><Icons.arrowUp size={12} /></button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} style={cmsIconBtn(i === items.length - 1)} title="Turun"><Icons.arrowDown size={12} /></button>
          <button type="button" onClick={() => remove(i)} style={cmsIconBtn(false)} title="Hapus"><Icons.trash size={12} /></button>
        </div>
      ))}
      <button type="button" onClick={add} style={{ ...cmsSecondaryBtn(), alignSelf: 'flex-start', height: 32, padding: '0 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icons.plus size={13} /> Tambah Langkah
      </button>
      {items.length === 0 && <div style={{ fontSize: 12, color: '#9085AE' }}>Belum ada langkah klaim.</div>}
    </div>
  );
}

function FaqListEditor({ items, onChange }) {
  const update = (i, key, v) => onChange(items.map((it, idx) => idx === i ? { ...it, [key]: v } : it));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { q: '', a: '' }]);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ border: '1px solid #E0D9F5', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={item.q} onChange={(e) => update(i, 'q', e.target.value)} placeholder={`Pertanyaan ${i + 1}`}
              style={cmsInputStyle({ flex: 1, fontWeight: 600 })} />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={cmsIconBtn(i === 0)} title="Naik"><Icons.arrowUp size={12} /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} style={cmsIconBtn(i === items.length - 1)} title="Turun"><Icons.arrowDown size={12} /></button>
            <button type="button" onClick={() => remove(i)} style={cmsIconBtn(false)} title="Hapus"><Icons.trash size={12} /></button>
          </div>
          <textarea value={item.a} onChange={(e) => update(i, 'a', e.target.value)} placeholder="Jawaban" rows={2}
            style={cmsInputStyle({ width: '100%', height: 'auto', padding: '8px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
        </div>
      ))}
      <button type="button" onClick={add} style={{ ...cmsSecondaryBtn(), alignSelf: 'flex-start', height: 32, padding: '0 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icons.plus size={13} /> Tambah FAQ
      </button>
      {items.length === 0 && <div style={{ fontSize: 12, color: '#9085AE' }}>Belum ada FAQ.</div>}
    </div>
  );
}

function RteBtn({ onClick, title, children }) {
  return (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title} style={{
      width: 26, height: 26, border: 0, borderRadius: 6, background: 'transparent', color: '#574872',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}
function RichTextEditor({ value, onChange }) {
  const ref = React.useRef(null);
  useCmsEffect(() => {
    if (ref.current) ref.current.innerHTML = value || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const exec = (cmd, arg) => {
    if (ref.current) ref.current.focus();
    if (document.execCommand) document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };
  const handleLink = () => {
    const url = window.prompt('Masukkan URL link:');
    if (url) exec('createLink', url);
  };
  return (
    <div style={{ border: '1px solid #E0D9F5', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 2, padding: '6px 8px', background: '#F7F4FF', borderBottom: '1px solid #E0D9F5' }}>
        <RteBtn onClick={() => exec('bold')} title="Bold"><Icons.bold size={13} /></RteBtn>
        <RteBtn onClick={() => exec('italic')} title="Italic"><Icons.italic size={13} /></RteBtn>
        <RteBtn onClick={() => exec('insertUnorderedList')} title="Bullet list"><Icons.list size={13} /></RteBtn>
        <RteBtn onClick={handleLink} title="Sisipkan link"><Icons.link size={13} /></RteBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-testid="rte-body"
        style={{
          minHeight: 130, padding: '10px 12px', fontSize: 13, lineHeight: 1.6,
          color: '#1A1228', outline: 'none', fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

function ArtikelModal({ artikel, onClose, onSave }) {
  const [form, setForm] = useCmsState(artikel || {
    judul: '', kategori: getArtikelKategori()[0] || 'Tips', excerpt: '', konten: '',
    tone: 'purple', status: 'draft', tgl: '2026-06-12', gambar: null,
    kodePromo: '', autoApply: true, caraKlaim: [], faq: [], scope: [],
  });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  function toggleScope(s) {
    setForm(f => {
      if (s === 'Semua Produk') return { ...f, scope: f.scope.includes('Semua Produk') ? [] : ['Semua Produk'] };
      const next = f.scope.includes(s) ? f.scope.filter(x => x !== s) : [...f.scope.filter(x => x !== 'Semua Produk'), s];
      return { ...f, scope: next };
    });
  }
  const isPromo = form.kategori === 'Promo';
  const kontenText = (form.konten || '').replace(/<[^>]*>/g, '').trim();
  const isValid = form.judul.trim() && form.excerpt.trim() && kontenText;

  useCmsEffect(() => {
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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Tips & Promo
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
              {artikel ? 'Edit Artikel' : 'Tambah Artikel Baru'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
            background: '#FFFFFF', color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.x size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CmsField label="Thumbnail Artikel">
            <ImageUploadField value={form.gambar} onChange={(v) => u('gambar', v)} aspect="16/9" />
          </CmsField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <CmsField label="Kategori">
              <div style={{ position: 'relative' }}>
                <select value={form.kategori} onChange={(e) => u('kategori', e.target.value)} style={{
                  ...cmsInputStyle({ width: '100%' }), appearance: 'none', paddingRight: 30, cursor: 'pointer',
                }}>
                  {getArtikelKategori().map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <Icons.chevron size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
              </div>
            </CmsField>
            <CmsField label="Tanggal Tayang">
              <input type="date" value={form.tgl} onChange={(e) => u('tgl', e.target.value)}
                style={cmsInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace' })} />
            </CmsField>
            <CmsField label="Warna Tema">
              <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                {BANNER_TONES.map(tn => {
                  const m = BANNER_TONE_META[tn];
                  const active = form.tone === tn;
                  return (
                    <button key={tn} type="button" onClick={() => u('tone', tn)} style={{
                      width: 26, height: 26, borderRadius: 7, cursor: 'pointer',
                      background: m.bg, color: m.fg,
                      border: active ? '2px solid ' + m.fg : '1px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {active && <Icons.check size={11} strokeWidth={2.8} />}
                    </button>
                  );
                })}
              </div>
            </CmsField>
          </div>

          <CmsField label="Judul Artikel">
            <input value={form.judul} onChange={(e) => u('judul', e.target.value)}
              style={cmsInputStyle({ width: '100%' })} />
          </CmsField>
          <CmsField label="Ringkasan (tampil di list)">
            <textarea value={form.excerpt} onChange={(e) => u('excerpt', e.target.value)}
              rows={2}
              style={cmsInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
          </CmsField>

          {isPromo && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <CmsField label="Kode Promo">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#574872', cursor: 'pointer' }}>
                      <Toggle checked={form.autoApply} onChange={(v) => u('autoApply', v)} />
                      Otomatis diterapkan (tanpa kode)
                    </label>
                    {!form.autoApply && (
                      <input value={form.kodePromo} onChange={(e) => u('kodePromo', e.target.value.toUpperCase())}
                        placeholder="Contoh: GOPOP5"
                        style={cmsInputStyle({ width: '100%', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' })} />
                    )}
                  </div>
                </CmsField>
                <CmsField label="Berlaku untuk Produk">
                  <ProductScopeDropdown selected={form.scope} onToggle={toggleScope} />
                </CmsField>
              </div>
              <CmsField label="Cara Klaim">
                <StepListEditor items={form.caraKlaim} onChange={(v) => u('caraKlaim', v)} placeholder="Contoh: Buka menu Transfer E-Wallet" />
              </CmsField>
            </>
          )}

          <CmsField label="Isi Konten Lengkap">
            <RichTextEditor value={form.konten} onChange={(v) => u('konten', v)} />
          </CmsField>

          {isPromo && (
            <CmsField label="FAQ">
              <FaqListEditor items={form.faq} onChange={(v) => u('faq', v)} />
            </CmsField>
          )}

          <CmsField label="Status">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle checked={form.status === 'published'} onChange={() => u('status', form.status === 'published' ? 'draft' : 'published')} />
              <span style={{ fontSize: 13, color: '#574872' }}>
                {form.status === 'published' ? 'Published — tampil di aplikasi' : 'Draft — belum tampil di aplikasi'}
              </span>
            </div>
          </CmsField>
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <button onClick={onClose} style={cmsSecondaryBtn()}>Batal</button>
          <button onClick={() => isValid ? onSave(form) : window.muurahToast('Judul, ringkasan, dan konten wajib diisi', 'error')}
            style={{ ...cmsPrimaryBtn(), opacity: isValid ? 1 : 0.5 }}>
            <Icons.check size={14} strokeWidth={2.5} /> {artikel ? 'Simpan Perubahan' : 'Tambah Artikel'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── shared bits ─────────────────────────────────────────────────────────────
function CmsField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
function cmsInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    ...over,
  };
}
function cmsPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function cmsSecondaryBtn() {
  return {
    background: '#FFFFFF', color: '#574872', border: '1px solid #C5B8EF',
    height: 38, padding: '0 18px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function cmsGhostBtn(color) {
  return {
    background: 'transparent', color, border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  };
}
function cmsIconBtn(disabled) {
  return {
    width: 22, height: 22, border: '1px solid #E0D9F5', borderRadius: 6,
    background: '#FFFFFF', color: disabled ? '#E0D9F5' : '#574872',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  };
}
function Toggle({ checked, onChange }) {
  return (
    <span onClick={(e) => { e.stopPropagation(); onChange(!checked); }} role="switch" aria-checked={checked} tabIndex={0}
      style={{
        position: 'relative', display: 'inline-block',
        width: 36, height: 20, borderRadius: 20,
        background: checked ? '#4A2D8C' : '#C5B8EF',
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

window.MuurahCms = Cms;
