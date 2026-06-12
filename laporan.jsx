// laporan.jsx — Laporan Keuangan (Financial Report) screen
const { useState: useLpState, useMemo: useLpMemo, useRef: useLpRef } = React;

// Daily Revenue vs HPP for 1–19 Mei 2026 (in rupiah, in juta for chart)
// Sums tie to KPI: Revenue 186.42M, HPP 172.38M, GP 14.04M, Margin 7.53%.
const DAILY = [
// [day, revenueM, hppM]
[1, 8.92, 8.24], [2, 9.45, 8.71], [3, 9.10, 8.42], [4, 8.65, 7.98], [5, 10.32, 9.55],
[6, 11.18, 10.30], [7, 10.84, 10.04], [8, 9.96, 9.18], [9, 9.40, 8.66], [10, 10.21, 9.43],
[11, 9.78, 9.02], [12, 10.55, 9.74], [13, 11.02, 10.18], [14, 10.46, 9.66], [15, 9.85, 9.10],
[16, 9.32, 8.62], [17, 8.94, 8.28], [18, 9.18, 8.50], [19, 9.29, 8.77]];


const BREAKDOWN = [
{ kategori: 'Pulsa', txn: 12_482, hpp: 79_230_000, revenue: 82_400_000 },
{ kategori: 'Token PLN', txn: 6_823, hpp: 63_480_000, revenue: 64_180_000 },
{ kategori: 'Paket Data', txn: 4_215, hpp: 24_250_000, revenue: 27_820_000 },
{ kategori: 'Voucher Game', txn: 2_847, hpp: 4_180_000, revenue: 7_420_000 },
{ kategori: 'BPJS', txn: 1_124, hpp: 1_240_000, revenue: 4_600_000 }];


function Laporan() {
  const { Card } = window.MuurahShell;
  const { formatTglID } = window.MuurahGlobal;
  const [range, setRange] = useLpState('Harian');
  const [dateFrom, setDateFrom] = useLpState('2026-05-01');
  const [dateTo, setDateTo] = useLpState('2026-05-19');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
            Laporan Keuangan
          </h1>
          <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
            Ringkasan revenue, HPP, dan margin untuk periode terpilih
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <DateRangeButton from={dateFrom} to={dateTo} onFrom={setDateFrom} onTo={setDateTo} />
          <button onClick={() => window.muurahToast('Generating laporan keuangan ' + formatTglID(dateFrom) + ' – ' + formatTglID(dateTo) + '…', 'info')} style={lpSecondaryBtn()}>
            <Icons.refresh size={14} /> Generate
          </button>
          <button onClick={() => window.muurahToast('Mengunduh laporan_keuangan_' + dateFrom + '_' + dateTo + '.pdf', 'success')} style={lpSecondaryBtn()}>
            <Icons.download size={14} /> Export PDF
          </button>
          <button onClick={() => window.muurahToast('Mengunduh laporan_keuangan_1-19_Mei_2026.xlsx', 'success')} style={lpPrimaryBtn()}>
            <Icons.download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <LpKpi label="Total Revenue" value="Rp 186.420.000" icon="wallet" tone="purple"
        trend={{ value: '+8,2%', dir: 'up', tone: 'green' }} />
        <LpKpi label="Total HPP" value="Rp 172.380.000" icon="card" tone="gold"
        trend={{ value: '+7,9%', dir: 'up', tone: 'neutral' }} />
        <LpKpi label="Gross Profit" value="Rp 14.040.000" icon="trendup" tone="green"
        trend={{ value: '+12,1%', dir: 'up', tone: 'green' }} />
        <LpKpi label="Margin Rata-rata" value="7,53%" icon="scale" tone="lime"
        trend={{ value: '+0,3pp', dir: 'up', tone: 'green' }} />
      </div>

      {/* Chart card */}
      <Card title="Revenue vs HPP Harian"
      subtitle="Periode 1 – 19 Mei 2026 · nilai dalam juta rupiah"
      action={
      <div style={{ display: 'flex', gap: 4, padding: 3, background: '#F0EBFF', borderRadius: 10 }}>
            {['Harian', 'Mingguan', 'Bulanan'].map((r) => {
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
        
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 12 }}>
          <BarLegend color="#C0001A" label="Revenue" />
          <BarLegend color="#C5B8EF" label="HPP" />
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#9085AE' }}>Σ Revenue</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#1A1228' }}>
              Rp 186,42jt
            </span>
            <span style={{ width: 1, height: 14, background: '#E0D9F5' }} />
            <span style={{ fontSize: 11, color: '#9085AE' }}>Σ HPP</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#1A1228' }}>
              Rp 172,38jt
            </span>
          </div>
        </div>
        <GroupedBarChart data={DAILY} />
      </Card>

      {/* Breakdown table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
              Breakdown per Kategori
            </div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>
              Rincian volume dan profitabilitas tiap kategori produk
            </div>
          </div>
          <button onClick={() => window.muurahGoTo('produk')} style={lpGhostBtn()}>
            Lihat per Produk <Icons.arrowR size={13} />
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...lpThStyle, paddingLeft: 24 }}>Kategori</th>
              <th style={{ ...lpThStyle, textAlign: 'right' }}>Jumlah Txn</th>
              <th style={{ ...lpThStyle, textAlign: 'right' }}>Volume HPP</th>
              <th style={{ ...lpThStyle, textAlign: 'right' }}>Revenue</th>
              <th style={{ ...lpThStyle, textAlign: 'right' }}>Gross Profit</th>
              <th style={{ ...lpThStyle, textAlign: 'right', paddingRight: 24 }}>Margin</th>
            </tr>
          </thead>
          <tbody>
            {BREAKDOWN.map((r) => {
              const gp = r.revenue - r.hpp;
              const margin = gp / r.revenue * 100;
              return (
                <tr key={r.kategori} style={{ borderTop: '1px solid #F0EBFF', height: 56, transition: 'background 130ms ease' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8FF'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  
                  <td style={{ ...lpTdStyle, paddingLeft: 24, fontWeight: 500, color: '#1A1228' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: 2,
                        background: kategoriColor(r.kategori)
                      }} />
                      {r.kategori}
                    </span>
                  </td>
                  <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#574872' }}>
                    {r.txn.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: '#574872' }}>
                    Rp {r.hpp.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#1A1228' }}>
                    Rp {r.revenue.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#16A34A' }}>
                    + Rp {gp.toLocaleString('id-ID')}
                  </td>
                  <td style={{ ...lpTdStyle, textAlign: 'right', paddingRight: 24 }}>
                    <MarginPill margin={margin} />
                  </td>
                </tr>);

            })}
            <tr style={{ borderTop: '2px solid #C5B8EF', background: '#F0EBFF' }}>
              <td style={{ ...lpTdStyle, paddingLeft: 24, fontWeight: 800, color: '#1A1228', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 12 }}>
                Total
              </td>
              <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#1A1228' }}>
                {BREAKDOWN.reduce((s, r) => s + r.txn, 0).toLocaleString('id-ID')}
              </td>
              <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#1A1228' }}>
                Rp {BREAKDOWN.reduce((s, r) => s + r.hpp, 0).toLocaleString('id-ID')}
              </td>
              <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#1A1228' }}>
                Rp {BREAKDOWN.reduce((s, r) => s + r.revenue, 0).toLocaleString('id-ID')}
              </td>
              <td style={{ ...lpTdStyle, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#16A34A' }}>
                + Rp {BREAKDOWN.reduce((s, r) => s + (r.revenue - r.hpp), 0).toLocaleString('id-ID')}
              </td>
              <td style={{ ...lpTdStyle, textAlign: 'right', paddingRight: 24, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#16A34A' }}>
                7,53%
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>);

}

// ─── KPI card ────────────────────────────────────────────────────────────────
function LpKpi({ label, value, icon, tone, trend }) {
  const tones = {
    purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
    green: { bg: '#F0FDF4', fg: '#16A34A' },
    gold: { bg: '#FEF9EC', fg: '#D4900A' },
    lime: { bg: '#F4FCE3', fg: '#5B7C12' }
  };
  const t = tones[tone] || tones.purple;
  const IconC = Icons[icon] || Icons.chart;
  const trendUp = trend.dir === 'up';
  const trendTone = trend.tone === 'green' ? { bg: '#F0FDF4', fg: '#16A34A' } :
  trend.tone === 'red' ? { bg: '#FCE7E9', fg: '#C0001A' } :
  /* neutral */{ bg: '#F0EBFF', fg: '#574872' };

  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E0D9F5',
      borderRadius: 16, padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: 16
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: t.bg, color: t.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <IconC size={18} />
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: trendTone.bg, color: trendTone.fg,
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
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
          fontSize: 26, color: '#1A1228',
          lineHeight: 1.15, letterSpacing: '-0.02em',
          whiteSpace: 'nowrap'
        }}>{value}</div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: '#9085AE',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginTop: 8
        }}>{label}</div>
      </div>
    </div>);

}

// ─── Date range button ───────────────────────────────────────────────────────
function DateRangeButton({ from, to, onFrom, onTo }) {
  const [open, setOpen] = useLpState(false);
  const ref = useLpRef(null);
  const { formatTglID } = window.MuurahGlobal;

  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#F0EBFF', border: '1px solid transparent',
        height: 38, padding: '0 14px', borderRadius: 10,
        fontSize: 13, fontWeight: 600, color: '#1A1228',
        fontFamily: 'inherit', cursor: 'pointer',
        transition: 'border-color 130ms ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C5B8EF'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
        <Icons.calendar size={14} style={{ color: '#4A2D8C' }} />
        {formatTglID(from)} – {formatTglID(to)}
        <Icons.chevron size={13} style={{ color: '#574872' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 20,
          background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 12,
          boxShadow: '0 12px 32px rgba(26,18,40,0.12)', padding: 14,
          display: 'flex', flexDirection: 'column', gap: 10, minWidth: 220,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: '#9085AE', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Dari</label>
            <input type="date" value={from} onChange={(e) => onFrom(e.target.value)}
              style={{ background: '#F0EBFF', border: '1px solid transparent', borderRadius: 8, height: 34, padding: '0 10px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: '#9085AE', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Sampai</label>
            <input type="date" value={to} onChange={(e) => onTo(e.target.value)}
              style={{ background: '#F0EBFF', border: '1px solid transparent', borderRadius: 8, height: 34, padding: '0 10px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
          </div>
          <button onClick={() => setOpen(false)} style={{
            background: '#4A2D8C', color: '#FFFFFF', border: 0, height: 32, borderRadius: 8,
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          }}>Terapkan</button>
        </div>
      )}
    </div>
  );
}

// ─── Grouped Bar Chart ───────────────────────────────────────────────────────
function GroupedBarChart({ data }) {
  const W = 1080,H = 280,PAD_L = 56,PAD_R = 12,PAD_T = 12,PAD_B = 28;
  const innerW = W - PAD_L - PAD_R,innerH = H - PAD_T - PAD_B;
  const max = Math.max(...data.flatMap((d) => [d[1], d[2]])) * 1.15;

  const groupCount = data.length;
  const groupW = innerW / groupCount;
  const barW = 14;
  const gap = 3;
  // each group: bar1 + gap + bar2 centered in groupW

  const x = (i) => PAD_L + i * groupW + (groupW - (barW * 2 + gap)) / 2;
  const y = (v) => PAD_T + innerH - v / max * innerH;
  const barH = (v) => v / max * innerH;

  const [hover, setHover] = useLpState(null);

  const gridLines = 4;
  const yLabels = [];
  for (let i = 0; i <= gridLines; i++) {
    const v = max * (1 - i / gridLines);
    yLabels.push({ y: PAD_T + innerH * i / gridLines, v });
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}
    onMouseLeave={() => setHover(null)}>
      {yLabels.map((l, i) =>
      <g key={i}>
          <line x1={PAD_L} x2={W - PAD_R} y1={l.y} y2={l.y} stroke="#F0EBFF" strokeWidth="1" />
          <text x={PAD_L - 8} y={l.y + 3} textAnchor="end" fontSize="10" fill="#9085AE"
        fontFamily="JetBrains Mono, monospace">{l.v.toFixed(0)}jt</text>
        </g>
      )}
      {data.map(([d, rev, hpp], i) => {
        const isHover = hover === i;
        return (
          <g key={d} onMouseEnter={() => setHover(i)} style={{ cursor: 'default' }}>
            {/* invisible hover band */}
            <rect x={PAD_L + i * groupW} y={PAD_T} width={groupW} height={innerH} fill="transparent" />
            <rect x={x(i)} y={y(rev)} width={barW} height={barH(rev)} fill="#C0001A" rx="2" opacity={isHover ? 1 : 0.95} style={{ fill: "rgb(22, 163, 74)" }} />
            <rect x={x(i) + barW + gap} y={y(hpp)} width={barW} height={barH(hpp)} fill="#C5B8EF" rx="2" opacity={isHover ? 1 : 0.95} />
            <text x={x(i) + barW + gap / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#9085AE"
            fontFamily="JetBrains Mono, monospace">{d}</text>
            {isHover &&
            <g transform={`translate(${Math.min(x(i) + 24, W - 150)}, ${PAD_T + 8})`}>
                <rect width="140" height="62" rx="8" fill="#1A1228" />
                <text x="10" y="16" fontSize="10" fill="#C5B8EF" fontFamily="JetBrains Mono, monospace">{d} Mei 2026</text>
                <circle cx="14" cy="32" r="3" fill="#C0001A" />
                <text x="22" y="36" fontSize="11" fill="#FFFFFF" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                  Rev Rp {rev.toFixed(2)}jt
                </text>
                <circle cx="14" cy="50" r="3" fill="#C5B8EF" />
                <text x="22" y="54" fontSize="11" fill="#C5B8EF" fontFamily="JetBrains Mono, monospace">
                  HPP Rp {hpp.toFixed(2)}jt
                </text>
              </g>
            }
          </g>);

      })}
    </svg>);

}

function BarLegend({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 12, color: '#574872', fontWeight: 500 }}>{label}</span>
    </div>);

}

// ─── Margin pill ─────────────────────────────────────────────────────────────
function MarginPill({ margin }) {
  const tone = margin >= 6 ? { bg: '#F0FDF4', fg: '#16A34A' } :
  margin >= 4 ? { bg: '#FFFBEB', fg: '#D97706' } :
  { bg: '#FCE7E9', fg: '#C0001A' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: tone.bg, color: tone.fg,
      fontSize: 12, fontWeight: 700, padding: '4px 11px', borderRadius: 20,
      fontFamily: 'JetBrains Mono, monospace'
    }}>{margin.toFixed(1)}%</span>);

}

function kategoriColor(k) {
  const map = {
    'Pulsa': '#4A2D8C',
    'Token PLN': '#D4900A',
    'Paket Data': '#16A34A',
    'Voucher Game': '#D97706',
    'BPJS': '#7B5BC0'
  };
  return map[k] || '#4A2D8C';
}

// ─── Buttons ─────────────────────────────────────────────────────────────────
function lpSecondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
    height: 38, padding: '0 14px', borderRadius: 10,
    fontSize: 13, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
    transition: 'all 130ms ease'
  };
}
function lpPrimaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 38, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
    transition: 'background 130ms ease'
  };
}
function lpGhostBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'transparent', color: '#4A2D8C', border: 0,
    padding: '6px 10px', borderRadius: 8,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
  };
}

const lpThStyle = {
  textAlign: 'left', fontSize: 11, fontWeight: 600,
  color: '#574872', textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '12px 14px', background: '#F0EBFF'
};
const lpTdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

window.MuurahLaporan = Laporan;