// data.js — realistic Indonesian PPOB transaction data for muurah.com admin

window.MUURAH_DATA = (function () {
  const namaIndonesia = [
    'Andika Pratama', 'Sri Wahyuni', 'Budi Santoso', 'Rina Kartika', 'Dewi Sartika',
    'Agus Salim', 'Maya Sari', 'Hendra Wijaya', 'Lestari Putri', 'Joko Susilo',
    'Siti Nurhaliza', 'Bambang Iskandar', 'Fitri Anggraini', 'Reza Maulana', 'Tri Handayani',
    'Eko Prasetyo', 'Indah Permatasari', 'Wahyu Hidayat', 'Nurul Hidayah', 'Dimas Aditya',
    'Putri Ayu Lestari', 'Rangga Pratama', 'Yuni Kusuma', 'Hadi Susanto', 'Mega Wulandari',
    'Arif Rahman', 'Citra Dewi', 'Faisal Akbar', 'Dinda Pertiwi', 'Iwan Setiawan',
  ];

  const kota = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Yogyakarta', 'Denpasar', 'Palembang', 'Balikpapan'];

  // [kategori, produk[], harga range]
  const produkKatalog = [
    { kat: 'Pulsa',     icon: 'phone',   items: [
      ['Pulsa Telkomsel 25.000', 25500],
      ['Pulsa Telkomsel 50.000', 50500],
      ['Pulsa Telkomsel 100.000', 100500],
      ['Pulsa Indosat 50.000', 50250],
      ['Pulsa XL 25.000', 25400],
      ['Pulsa Tri 20.000', 20300],
    ]},
    { kat: 'Token PLN', icon: 'bolt',    items: [
      ['Token PLN 20.000', 21500],
      ['Token PLN 50.000', 51500],
      ['Token PLN 100.000', 101500],
      ['Token PLN 200.000', 201500],
      ['Token PLN 500.000', 501500],
    ]},
    { kat: 'Paket Data', icon: 'wifi',   items: [
      ['Telkomsel 8 GB 30 hari', 75000],
      ['XL 12 GB 30 hari', 65000],
      ['Indosat 25 GB 30 hari', 89000],
      ['Tri AON 10 GB', 55000],
      ['Smartfren Unlimited', 80000],
    ]},
    { kat: 'BPJS',      icon: 'shield',  items: [
      ['BPJS Kesehatan Kelas 1', 150000],
      ['BPJS Kesehatan Kelas 2', 100000],
      ['BPJS Kesehatan Kelas 3', 35000],
      ['BPJS Ketenagakerjaan', 165000],
    ]},
    { kat: 'Voucher Game', icon: 'game', items: [
      ['Mobile Legends 86 Diamond', 22000],
      ['Mobile Legends 172 Diamond', 44000],
      ['Free Fire 70 Diamond', 11000],
      ['Free Fire 355 Diamond', 50000],
      ['PUBG Mobile 60 UC', 16000],
      ['Genshin Impact 60 Genesis', 18000],
    ]},
    { kat: 'E-Wallet',  icon: 'wallet',  items: [
      ['GoPay 100.000', 101000],
      ['OVO 50.000', 51000],
      ['Dana 200.000', 201000],
      ['ShopeePay 100.000', 100750],
      ['LinkAja 50.000', 50500],
    ]},
    { kat: 'PDAM',      icon: 'drop',    items: [
      ['PDAM Jakarta', 87500],
      ['PDAM Surabaya', 64000],
      ['PDAM Bandung', 72500],
      ['PDAM Medan', 55000],
    ]},
    { kat: 'Multifinance', icon: 'card', items: [
      ['FIF Group', 985000],
      ['Adira Finance', 1250000],
      ['BAF (Bussan Auto)', 875000],
      ['Mega Auto Finance', 1450000],
    ]},
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function nrand(a, b) { return Math.floor(a + Math.random() * (b - a)); }

  function phone() {
    const pref = pick(['0812', '0813', '0821', '0822', '0852', '0856', '0857', '0877', '0878', '0895']);
    return `${pref}-${nrand(1000,9999)}-${nrand(1000,9999)}`;
  }

  function agenCode(i) {
    return 'AGN-' + String(100000 + (i * 137) % 900000).padStart(6, '0');
  }

  function rupiah(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  }

  // Seed RNG for reproducibility-ish
  let seed = 1;
  function srand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  const _orig = Math.random;
  Math.random = srand;

  // Generate 84 transactions across last 24h
  const transactions = [];
  const statuses = ['sukses','sukses','sukses','sukses','sukses','sukses','sukses','pending','pending','gagal','processing'];
  const channels = ['Web App', 'Mobile App', 'WhatsApp Bot', 'API Reseller', 'POS Outlet'];

  const now = new Date('2026-05-19T16:42:00+07:00');
  for (let i = 0; i < 84; i++) {
    const kat = pick(produkKatalog);
    const item = pick(kat.items);
    const harga = item[1];
    const fee = Math.round(harga * (0.005 + Math.random() * 0.015));
    const status = pick(statuses);
    const namaC = pick(namaIndonesia);
    const minutesAgo = Math.floor(i * 17 + Math.random() * 13);
    const t = new Date(now.getTime() - minutesAgo * 60 * 1000);
    transactions.push({
      id: 'TRX' + (240519000 + i).toString(),
      ref: 'M' + nrand(100000000, 999999999),
      produk: item[0],
      kategori: kat.kat,
      kategoriIcon: kat.icon,
      harga,
      fee,
      total: harga + fee,
      status,
      pelanggan: namaC,
      telepon: phone(),
      tujuan: kat.kat === 'Token PLN' ? '01234' + nrand(100000,999999) + nrand(1,9) :
              kat.kat === 'BPJS' ? '0001' + nrand(100000000, 999999999) :
              phone().replace(/-/g,''),
      agen: pick(['Toko Berkah Cell','Sumber Rejeki Pulsa','Indah Phone Shop','Jaya Counter','Mitra Digital','Anugerah Cell','Bintang Pulsa','Cahaya Mandiri']),
      agenCode: agenCode(i),
      kota: pick(kota),
      channel: pick(channels),
      time: t,
    });
  }

  // Revenue per day - last 30 days
  const revenueSeries = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const base = 52_000_000 + Math.sin(i * 0.4) * 8_000_000;
    const noise = (Math.random() - 0.5) * 10_000_000;
    const value = Math.max(28_000_000, Math.round(base + noise + (isWeekend ? -6_000_000 : 4_000_000)));
    revenueSeries.push({ date: d, value });
  }

  // Category breakdown for donut
  const kategoriBreakdown = [
    { name: 'Pulsa',         value: 32, color: '#4A2D8C' },
    { name: 'Token PLN',     value: 24, color: '#7B5BC0' },
    { name: 'Paket Data',    value: 18, color: '#B8E04A' },
    { name: 'Voucher Game',  value: 12, color: '#D4900A' },
    { name: 'E-Wallet',      value: 8,  color: '#16A34A' },
    { name: 'Lainnya',       value: 6,  color: '#C5B8EF' },
  ];

  // Restore Math.random
  Math.random = _orig;

  return { transactions, revenueSeries, kategoriBreakdown, rupiah };
})();
