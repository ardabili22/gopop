// dashboard.jsx — Dashboard Overview content (lives inside the shell content area).
const { useState: useDashState, useMemo: useDashMemo, useRef: useDashRef } = React;

function Dashboard() {
  const { Card } = window.MuurahShell;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DashHeader />
      <KPIRow />
      <BillerStatus />
      <div style={{ display: 'grid', gridTemplateColumns: '62fr 38fr', gap: 16 }}>
        <VolumeChartCard />
        <BreakdownCard />
      </div>
      <RecentTransactionsCard />
    </div>);

}

// ─── Header ──────────────────────────────────────────────────────────────────
function DashHeader() {
  return (
    <div>
      <h1 style={{
        fontSize: 22, fontWeight: 700, color: '#1A1228',
        margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2
      }}>Dashboard</h1>
      <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
        Ringkasan operasional hari ini
      </div>
    </div>);

}

// ─── KPI Row ─────────────────────────────────────────────────────────────────
function KPIRow() {
  const cards = [
  {
    label: 'Transaksi Hari Ini',
    value: '201.018',
    icon: 'receipt',
    iconBg: '#EDE8FF', iconFg: '#4A2D8C',
    trend: { value: '+12% vs kemarin', dir: 'up', tone: 'green' }
  },
  {
    label: 'Revenue Hari Ini',
    value: 'Rp 48.230.500',
    icon: 'wallet',
    iconBg: '#F0FDF4', iconFg: '#16A34A',
    trend: { value: '+8,3%', dir: 'up', tone: 'green' }
  },
  {
    label: 'Success Rate',
    value: '97,4%',
    icon: 'check',
    iconBg: '#F0FDF4', iconFg: '#16A34A',
    trend: { value: '-0,3%', dir: 'down', tone: 'red' }
  },
  {
    label: 'Transaksi Gagal',
    value: '32',
    icon: 'alert',
    iconBg: '#EDE8FF', iconFg: '#C0001A',
    trend: { value: '+4', dir: 'up', tone: 'red' },
    valueColor: '#C0001A'
  }];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {cards.map((c, i) => <KPICard key={i} {...c} />)}
    </div>);

}

function KPICard({ label, value, icon, iconBg, iconFg, trend, valueColor }) {
  const IconC = Icons[icon] || Icons.chart;
  const trendUp = trend.dir === 'up';
  const trendStyle = trend.tone === 'green' ?
  { bg: '#F0FDF4', fg: '#16A34A' } :
  { bg: '#EDE8FF', fg: '#C0001A' };

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E0D9F5',
      borderRadius: 16, padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: 16, fontFamily: "Inter"
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: iconBg, color: iconFg,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <IconC size={18} />
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: trendStyle.bg, color: trendStyle.fg,
          fontSize: 11, fontWeight: 600,
          borderRadius: 20, padding: '4px 9px',
          whiteSpace: 'nowrap'
        }}>
          {trendUp ? <Icons.trendup size={11} strokeWidth={2.3} /> : <Icons.trenddn size={11} strokeWidth={2.3} />}
          {trend.value}
        </span>
      </div>
      <div>
        <div style={{
          fontWeight: 800,
          fontSize: 32, color: valueColor || '#1A1228',
          lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: "Inter"
        }}>{value}</div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: '#9085AE',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 8
        }}>{label}</div>
      </div>
    </div>);

}

// ─── Biller Status Bar ───────────────────────────────────────────────────────
function BillerStatus() {
  const billers = [
  { name: 'PLN', status: 'aktif' },
  { name: 'Telkomsel', status: 'aktif' },
  { name: 'Indosat', status: 'aktif' },
  { name: 'BPJS', status: 'lambat' },
  { name: 'XL', status: 'aktif' },
  { name: 'GoPay', status: 'aktif' }];

  return (
    <div style={{
      background: '#F0EBFF', borderRadius: 10, padding: 12,
      display: 'flex', alignItems: 'center', gap: 16
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: '#574872',
        letterSpacing: '0.6px', textTransform: 'uppercase',
        flexShrink: 0
      }}>Status Koneksi Biller</div>
      <div style={{ flex: 1, display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {billers.map((b) => {
          const aktif = b.status === 'aktif';
          const dotColor = aktif ? '#16A34A' : '#D97706';
          const labelText = aktif ? 'Aktif' : 'Lambat';
          const labelColor = aktif ? '#16A34A' : '#D97706';
          return (
            <span key={b.name} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#FFFFFF', border: '1px solid #E0D9F5',
              borderRadius: 20, padding: '5px 11px',
              fontSize: 12
            }}>
              {aktif ?
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, boxShadow: '0 0 0 3px ' + dotColor + '22' }} /> :

              <Icons.alert size={11} strokeWidth={2.3} style={{ color: dotColor }} />
              }
              <span style={{ fontWeight: 600, color: '#1A1228' }}>{b.name}</span>
              <span style={{ color: labelColor, fontWeight: 500, fontSize: 11 }}>· {labelText}</span>
            </span>);

        })}
      </div>
    </div>);

}

// ─── Volume Chart Card ───────────────────────────────────────────────────────
function VolumeChartCard() {
  const [range, setRange] = useDashState('Hari Ini');
  const ranges = ['Hari Ini', '7 Hari', '30 Hari'];

  // Realistic hourly volume curve — quiet overnight, builds AM, lunch peak, evening peak
  const todayData = [
  14, 9, 6, 4, 5, 9, 22, 41, 58, 72, 86, 94,
  102, 88, 76, 84, 92, 105, 118, 128, 116, 92, 64, 38];

  const yestData = [
  18, 11, 7, 5, 6, 11, 26, 38, 52, 64, 78, 82,
  90, 80, 70, 76, 82, 94, 102, 110, 98, 80, 56, 32];


  return (
    <Card title="Volume Transaksi Per Jam"
    subtitle="Jumlah transaksi per jam vs hari sebelumnya"
    action={
    <div style={{ display: 'flex', gap: 4, padding: 3, background: '#F0EBFF', borderRadius: 10 }}>
          {ranges.map((r) => {
        const active = r === range;
        return (
          <button key={r} onClick={() => setRange(r)} style={{
            border: 0, padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
            background: active ? '#FFFFFF' : 'transparent',
            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            color: active ? '#4A2D8C' : '#574872',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            transition: 'all 130ms ease'
          }}>{r}</button>);

      })}
        </div>
    }>
      
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 12 }}>
        <Legend dot="#C0001A" dashed={false} label="Hari Ini" />
        <Legend dot="#9085AE" dashed={true} label="Kemarin" />
      </div>
      <VolumeLineChart today={todayData} yesterday={yestData} />
    </Card>);

}

function Legend({ dot, dashed, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="22" height="10" viewBox="0 0 22 10">
        <line x1="0" y1="5" x2="22" y2="5" stroke={dot} strokeWidth="2.5"
        strokeDasharray={dashed ? '4 3' : '0'} strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 12, color: '#574872', fontWeight: 500 }}>{label}</span>
    </div>);

}

function VolumeLineChart({ today, yesterday }) {
  const W = 680,H = 240,PAD_L = 38,PAD_R = 12,PAD_T = 10,PAD_B = 28;
  const innerW = W - PAD_L - PAD_R,innerH = H - PAD_T - PAD_B;
  const max = Math.max(...today, ...yesterday) * 1.15;
  const x = (i, n) => PAD_L + i / (n - 1) * innerW;
  const y = (v) => PAD_T + innerH - v / max * innerH;

  const todayPath = today.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i, today.length)} ${y(v)}`).join(' ');
  const yestPath = yesterday.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i, yesterday.length)} ${y(v)}`).join(' ');
  const areaPath = `${todayPath} L ${x(today.length - 1, today.length)} ${PAD_T + innerH} L ${PAD_L} ${PAD_T + innerH} Z`;

  const [hover, setHover] = useDashState(null);
  const svgRef = useDashRef(null);

  function onMove(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width * W;
    const i = Math.max(0, Math.min(today.length - 1, Math.round((px - PAD_L) / innerW * (today.length - 1))));
    setHover(i);
  }

  // Y-axis grid
  const gridLines = 4;
  const yLabels = [];
  for (let i = 0; i <= gridLines; i++) {
    const v = Math.round(max * (1 - i / gridLines));
    yLabels.push({ y: PAD_T + innerH * i / gridLines, v });
  }

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}
    onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <defs>
        <linearGradient id="volGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#C0001A" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#C0001A" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {yLabels.map((l, i) =>
      <g key={i}>
          <line x1={PAD_L} x2={W - PAD_R} y1={l.y} y2={l.y} stroke="#F0EBFF" strokeWidth="1" />
          <text x={PAD_L - 8} y={l.y + 3} textAnchor="end" fontSize="10" fill="#9085AE"
        fontFamily="JetBrains Mono, monospace">{l.v}</text>
        </g>
      )}
      <path d={areaPath} fill="url(#volGrad)" />
      <path d={yestPath} fill="none" stroke="#9085AE" strokeWidth="1.75" strokeDasharray="4 3" strokeLinejoin="round" strokeLinecap="round" />
      <path d={todayPath} fill="none" stroke="#C0001A" strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />

      {/* X labels every 3h */}
      {today.map((_, i) => (i % 3 === 0 || i === today.length - 1) &&
      <text key={i} x={x(i, today.length)} y={H - 8} textAnchor="middle" fontSize="10" fill="#9085AE"
      fontFamily="JetBrains Mono, monospace">{String(i).padStart(2, '0')}</text>
      )}

      {hover !== null &&
      <g>
          <line x1={x(hover, today.length)} x2={x(hover, today.length)} y1={PAD_T} y2={PAD_T + innerH}
        stroke="#4A2D8C" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <circle cx={x(hover, today.length)} cy={y(yesterday[hover])} r="3.5" fill="#FFFFFF" stroke="#9085AE" strokeWidth="2" />
          <circle cx={x(hover, today.length)} cy={y(today[hover])} r="4.5" fill="#FFFFFF" stroke="#C0001A" strokeWidth="2.5" />
          <g transform={`translate(${Math.min(x(hover, today.length) + 12, W - 150)}, ${Math.max(y(today[hover]) - 50, PAD_T)})`}>
            <rect width="140" height="58" rx="8" fill="#1A1228" />
            <text x="10" y="16" fontSize="10" fill="#C5B8EF" fontFamily="JetBrains Mono, monospace">
              {String(hover).padStart(2, '0')}:00 – {String(hover).padStart(2, '0')}:59
            </text>
            <circle cx="14" cy="32" r="3" fill="#C0001A" />
            <text x="22" y="36" fontSize="11" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontWeight="700">{today[hover]} txn</text>
            <circle cx="14" cy="48" r="3" fill="#9085AE" />
            <text x="22" y="52" fontSize="11" fill="#C5B8EF" fontFamily="JetBrains Mono, monospace">{yesterday[hover]} txn</text>
          </g>
        </g>
      }
    </svg>);

}

// ─── Breakdown Card ──────────────────────────────────────────────────────────
function BreakdownCard() {
  const rows = [
  { name: 'Pulsa', txn: 4234, rev: 88_200_000, pct: 47, color: '#4A2D8C' },
  { name: 'PLN Token', txn: 1892, rev: 51_400_000, pct: 28, color: '#7B5BC0' },
  { name: 'Paket Data', txn: 2341, rev: 31_200_000, pct: 18, color: '#B8E04A' },
  { name: 'BPJS', txn: 432, rev: 10_800_000, pct: 7, color: '#D4900A' }];

  const totalTxn = rows.reduce((s, r) => s + r.txn, 0);
  const totalRev = rows.reduce((s, r) => s + r.rev, 0);

  return (
    <Card title="Breakdown Kategori"
    subtitle="Distribusi 7 hari terakhir">
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <DonutChart data={rows} size={180} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={miniThStyle}>Kategori</th>
            <th style={{ ...miniThStyle, textAlign: 'right' }}>Txn</th>
            <th style={{ ...miniThStyle, textAlign: 'right' }}>Revenue</th>
            <th style={{ ...miniThStyle, textAlign: 'right' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) =>
          <tr key={r.name} style={{ borderTop: '1px solid #F0EBFF' }}>
              <td style={miniTdStyle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
                  <span style={{ color: '#1A1228', fontWeight: 500 }}>{r.name}</span>
                </span>
              </td>
              <td style={{ ...miniTdStyle, textAlign: 'right', color: '#574872', fontFamily: "Inter" }}>
                {r.txn.toLocaleString('id-ID')}
              </td>
              <td style={{ ...miniTdStyle, textAlign: 'right', fontWeight: 600, color: '#1A1228', fontFamily: "Inter" }}>
                Rp {(r.rev / 1_000_000).toFixed(1)}jt
              </td>
              <td style={{ ...miniTdStyle, textAlign: 'right', color: '#574872', fontFamily: "Inter" }}>
                {r.pct}%
              </td>
            </tr>
          )}
          <tr style={{ borderTop: '2px solid #E0D9F5' }}>
            <td style={{ ...miniTdStyle, fontWeight: 700, color: '#1A1228' }}>Total</td>
            <td style={{ ...miniTdStyle, textAlign: 'right', fontWeight: 700, color: '#1A1228', fontFamily: "Inter" }}>
              {totalTxn.toLocaleString('id-ID')}
            </td>
            <td style={{ ...miniTdStyle, textAlign: 'right', fontWeight: 700, color: '#1A1228', fontFamily: "Inter" }}>
              Rp {(totalRev / 1_000_000).toFixed(1)}jt
            </td>
            <td style={{ ...miniTdStyle, textAlign: 'right', fontWeight: 700, color: '#1A1228', fontFamily: "Inter" }}>
              100%
            </td>
          </tr>
        </tbody>
      </table>
    </Card>);

}

const miniThStyle = {
  textAlign: 'left', fontSize: 10, fontWeight: 600,
  color: '#9085AE', textTransform: 'uppercase', letterSpacing: '0.06em',
  padding: '8px 10px', background: '#F0EBFF'
};
const miniTdStyle = { padding: '10px 10px', verticalAlign: 'middle' };

function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.pct, 0);
  const R = size / 2 - 8,r = R - 22,cx = size / 2,cy = size / 2;
  let acc = 0;
  const arcs = data.map((d) => {
    const a0 = acc / total * Math.PI * 2 - Math.PI / 2;
    acc += d.pct;
    const a1 = acc / total * Math.PI * 2 - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + R * Math.cos(a0),y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1),y1 = cy + R * Math.sin(a1);
    const xi0 = cx + r * Math.cos(a0),yi0 = cy + r * Math.sin(a0);
    const xi1 = cx + r * Math.cos(a1),yi1 = cy + r * Math.sin(a1);
    return { ...d, path: `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} 0 ${xi0} ${yi0} Z` };
  });
  const totalTxn = data.reduce((s, d) => s + d.txn, 0);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} />)}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#9085AE">Total Transaksi</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="20" fontFamily="JetBrains Mono, monospace" fontWeight="800" fill="#1A1228" letterSpacing="-0.02em">
        {totalTxn.toLocaleString('id-ID')}
      </text>
    </svg>);

}

// ─── Recent Transactions ─────────────────────────────────────────────────────
function RecentTransactionsCard() {
  const rows = [
  { id: 'TRX240519104', user: 'Andika Pratama', produk: 'Pulsa Telkomsel 50.000', nominal: 50500, waktu: 'baru saja', status: 'sukses' },
  { id: 'TRX240519103', user: 'Sri Wahyuni', produk: 'Token PLN 100.000', nominal: 101500, waktu: '2 menit lalu', status: 'sukses' },
  { id: 'TRX240519102', user: 'Budi Santoso', produk: 'BPJS Kesehatan Kelas 2', nominal: 100000, waktu: '4 menit lalu', status: 'pending' },
  { id: 'TRX240519101', user: 'Rina Kartika', produk: 'GoPay 100.000', nominal: 101000, waktu: '7 menit lalu', status: 'sukses' },
  { id: 'TRX240519100', user: 'Dewi Sartika', produk: 'XL Paket Data 12 GB', nominal: 65000, waktu: '9 menit lalu', status: 'gagal' }];

  return (
    <Card padding={0}
    style={{ overflow: 'hidden' }}>
      
      <div style={{
        padding: '20px 24px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
            Transaksi Terbaru
          </div>
          <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>
            5 transaksi paling baru di seluruh kanal
          </div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); window.muurahGoTo('transaksi'); }} style={{
          fontSize: 13, fontWeight: 600, color: '#4A2D8C',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
          cursor: 'pointer',
        }}>
          Lihat Semua <Icons.arrowR size={14} />
        </a>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ ...recentThStyle, paddingLeft: 24 }}>ID Transaksi</th>
            <th style={recentThStyle}>User</th>
            <th style={recentThStyle}>Produk</th>
            <th style={{ ...recentThStyle, textAlign: 'right' }}>Nominal</th>
            <th style={recentThStyle}>Waktu</th>
            <th style={{ ...recentThStyle, paddingRight: 24 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) =>
          <tr key={r.id}
          onClick={() => window.muurahGoTo('transaksi')}
          style={{
            borderTop: '1px solid #F0EBFF',
            transition: 'background 130ms ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            
              <td style={{ ...recentTdStyle, paddingLeft: 24 }}>
                <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                color: '#4A2D8C', fontWeight: 600
              }}>{r.id}</span>
              </td>
              <td style={recentTdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: '#F0EBFF', color: '#4A2D8C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700
                }}>{initials(r.user)}</div>
                  <span style={{ fontWeight: 500, color: '#1A1228' }}>{r.user}</span>
                </div>
              </td>
              <td style={{ ...recentTdStyle, color: '#574872' }}>{r.produk}</td>
              <td style={{ ...recentTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                Rp {r.nominal.toLocaleString('id-ID')}
              </td>
              <td style={{ ...recentTdStyle, color: '#9085AE', fontSize: 12 }}>{r.waktu}</td>
              <td style={{ ...recentTdStyle, paddingRight: 24 }}>
                <StatusPill status={r.status} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>);

}

function initials(name) {
  return name.split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase();
}

const recentThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF'
};
const recentTdStyle = { padding: '14px 14px', verticalAlign: 'middle', height: 56 };

function StatusPill({ status }) {
  const map = {
    sukses: { bg: '#F0FDF4', fg: '#16A34A', label: 'Sukses' },
    pending: { bg: '#FFFBEB', fg: '#D97706', label: 'Pending' },
    gagal: { bg: '#EDE8FF', fg: '#C0001A', label: 'Gagal' },
    processing: { bg: '#EDE8FF', fg: '#4A2D8C', label: 'Processing' }
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.fg, fontSize: 11, fontWeight: 600,
      borderRadius: 20, padding: '4px 10px', whiteSpace: 'nowrap'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {s.label}
    </span>);

}

window.MuurahDashboard = Dashboard;