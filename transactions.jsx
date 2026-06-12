// transactions.jsx — Transaksi page (filters, table, detail drawer)
const { useState: useStateTX, useMemo: useMemoTX, useEffect: useEffectTX } = React;

function Transactions({ density, radius, accent }) {
  const { transactions } = window.MUURAH_DATA;
  const { Card, StatusBadge } = window.MuurahUI;
  const { fmtTime, btnPrimary, btnSecondary, btnGhost, thStyle, tdStyle } = window.MuurahUtils;

  const [tab, setTab] = useStateTX('semua');
  const [query, setQuery] = useStateTX('');
  const [kategoriFilter, setKategoriFilter] = useStateTX('semua');
  const [channelFilter, setChannelFilter] = useStateTX('semua');
  const [dateRange, setDateRange] = useStateTX('24h');
  const [selected, setSelected] = useStateTX(null);
  const [page, setPage] = useStateTX(1);

  const tabs = [
    { id: 'semua',      label: 'Semua' },
    { id: 'sukses',     label: 'Sukses' },
    { id: 'processing', label: 'Processing' },
    { id: 'pending',    label: 'Pending' },
    { id: 'gagal',      label: 'Gagal' },
  ];
  const tabCounts = useMemoTX(() => ({
    semua: transactions.length,
    sukses: transactions.filter(t => t.status === 'sukses').length,
    processing: transactions.filter(t => t.status === 'processing').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    gagal: transactions.filter(t => t.status === 'gagal').length,
  }), [transactions]);

  const kategoriOptions = useMemoTX(() => {
    const set = new Set(transactions.map(t => t.kategori));
    return ['semua', ...Array.from(set)];
  }, [transactions]);

  const filtered = useMemoTX(() => {
    return transactions.filter(t => {
      if (tab !== 'semua' && t.status !== tab) return false;
      if (kategoriFilter !== 'semua' && t.kategori !== kategoriFilter) return false;
      if (channelFilter !== 'semua' && t.channel !== channelFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${t.id} ${t.ref} ${t.produk} ${t.pelanggan} ${t.telepon} ${t.agen} ${t.tujuan}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tab, query, kategoriFilter, channelFilter, transactions]);

  const pageSize = density === 'compact' ? 18 : 12;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffectTX(() => { setPage(1); }, [tab, query, kategoriFilter, channelFilter]);
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const rowH = density === 'compact' ? 48 : 56;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Operasional
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em' }}>
            Transaksi
          </h1>
          <div style={{ fontSize: 13, color: '#574872', marginTop: 4 }}>
            Pantau & kelola seluruh transaksi PPOB Muurah. Klik baris untuk detail.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btnSecondary(radius)}>
            <Icons.filter size={15} /> Filter Lanjutan
          </button>
          <button style={btnPrimary(radius)}>
            <Icons.download size={15} /> Ekspor CSV
          </button>
        </div>
      </div>

      <Card radius={radius} padding={0}>
        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #E0D9F5',
          padding: '0 20px',
        }}>
          {tabs.map((t) => {
            const isActive = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: 'transparent', border: 0, padding: '16px 14px 14px',
                fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                color: isActive ? '#4A2D8C' : '#574872',
                borderBottom: isActive ? '2px solid #4A2D8C' : '2px solid transparent',
                marginBottom: -1, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 130ms ease',
              }}>
                {t.label}
                <span style={{
                  background: isActive ? '#EDE8FF' : '#F0EBFF',
                  color: isActive ? '#4A2D8C' : '#9085AE',
                  fontSize: 10, fontWeight: 700, padding: '2px 7px',
                  borderRadius: 10, fontFamily: 'JetBrains Mono, monospace',
                }}>{tabCounts[t.id]}</span>
              </button>
            );
          })}
        </div>

        {/* Filter row */}
        <div style={{
          padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center',
          borderBottom: '1px solid #E0D9F5', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200, maxWidth: 320 }}>
            <Icons.search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9085AE' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari ID, nomor tujuan, agen, pelanggan…"
              style={inputStyle({ paddingLeft: 36, width: '100%' })} />
          </div>

          <DateRangePicker value={dateRange} onChange={setDateRange} radius={radius} />

          <Select label="Kategori" value={kategoriFilter} onChange={setKategoriFilter}
            options={kategoriOptions.map(k => ({ value: k, label: k === 'semua' ? 'Semua Kategori' : k }))} />

          <Select label="Channel" value={channelFilter} onChange={setChannelFilter}
            options={[
              { value: 'semua', label: 'Semua Channel' },
              { value: 'Web App', label: 'Web App' },
              { value: 'Mobile App', label: 'Mobile App' },
              { value: 'WhatsApp Bot', label: 'WhatsApp Bot' },
              { value: 'API Reseller', label: 'API Reseller' },
              { value: 'POS Outlet', label: 'POS Outlet' },
            ]} />

          <div style={{ flex: 1 }} />

          {(query || kategoriFilter !== 'semua' || channelFilter !== 'semua') && (
            <button onClick={() => { setQuery(''); setKategoriFilter('semua'); setChannelFilter('semua'); }}
              style={{ ...btnGhost(), color: '#574872' }}>
              <Icons.x size={13} /> Reset
            </button>
          )}
          <div style={{ fontSize: 12, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>
            {filtered.length} hasil
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 36, paddingLeft: 20 }}><input type="checkbox" style={cbStyle} /></th>
                <th style={thStyle}>ID Transaksi</th>
                <th style={thStyle}>Produk</th>
                <th style={thStyle}>Pelanggan</th>
                <th style={thStyle}>Agen</th>
                <th style={thStyle}>Channel</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Nominal</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right', paddingRight: 20 }}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((t) => {
                const IconC = Icons[t.kategoriIcon] || Icons.receipt;
                const tones = {
                  Pulsa:        { bg: '#EDE8FF', fg: '#4A2D8C' },
                  'Token PLN':  { bg: '#FEF9EC', fg: '#D4900A' },
                  'Paket Data': { bg: '#F0FDF4', fg: '#16A34A' },
                  BPJS:         { bg: '#EDE8FF', fg: '#4A2D8C' },
                  'Voucher Game': { bg: '#FFFBEB', fg: '#D97706' },
                  'E-Wallet':   { bg: '#F4FCE3', fg: '#5B7C12' },
                  PDAM:         { bg: '#EDE8FF', fg: '#4A2D8C' },
                  Multifinance: { bg: '#FEF9EC', fg: '#D4900A' },
                };
                const tone = tones[t.kategori] || { bg: '#EDE8FF', fg: '#4A2D8C' };
                const isSelected = selected && selected.id === t.id;
                return (
                  <tr key={t.id} onClick={() => setSelected(t)}
                    style={{
                      borderTop: '1px solid #F0EBFF', height: rowH,
                      cursor: 'pointer',
                      background: isSelected ? '#F0EBFF' : '#FFFFFF',
                      transition: 'background 130ms ease',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#FAF8FF'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = '#FFFFFF'; }}
                  >
                    <td style={{ ...tdStyle, paddingLeft: 20 }} onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" style={cbStyle} />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#1A1228', fontWeight: 600 }}>{t.id}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#9085AE', marginTop: 2 }}>{t.ref}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: tone.bg, color: tone.fg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <IconC size={16} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 500, color: '#1A1228', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{t.produk}</div>
                          <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2 }}>{t.kategori}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500, color: '#1A1228' }}>{t.pelanggan}</div>
                      <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{t.telepon}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 12, color: '#1A1228' }}>{t.agen}</div>
                      <div style={{ fontSize: 10, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{t.agenCode} · {t.kota}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: 11, color: '#574872', background: '#F0EBFF',
                        padding: '3px 8px', borderRadius: 8, fontWeight: 500,
                      }}>{t.channel}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1A1228' }}>
                        Rp {t.total.toLocaleString('id-ID')}
                      </div>
                      <div style={{ fontSize: 10, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                        +fee Rp {t.fee.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td style={tdStyle}><StatusBadge status={t.status} /></td>
                    <td style={{ ...tdStyle, textAlign: 'right', paddingRight: 20, fontSize: 11, color: '#574872', fontFamily: 'JetBrains Mono, monospace' }}>
                      {fmtTime(t.time)}
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr><td colSpan={9} style={{ padding: '60px 20px', textAlign: 'center', color: '#9085AE', fontSize: 13 }}>
                  Tidak ada transaksi yang cocok dengan filter ini.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderTop: '1px solid #E0D9F5',
        }}>
          <div style={{ fontSize: 12, color: '#574872' }}>
            Menampilkan <b style={{ color: '#1A1228' }}>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</b> dari <b style={{ color: '#1A1228' }}>{filtered.length}</b> transaksi
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} style={pageBtn(page === 1)}>
              <Icons.chevron size={14} style={{ transform: 'rotate(90deg)' }} />
            </button>
            {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => {
              const n = i + 1;
              const isActive = page === n;
              return (
                <button key={n} onClick={() => setPage(n)} style={{
                  ...pageBtn(false),
                  background: isActive ? '#4A2D8C' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#574872',
                  borderColor: isActive ? '#4A2D8C' : '#E0D9F5',
                  fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                }}>{n}</button>
              );
            })}
            <button disabled={page === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))} style={pageBtn(page === pageCount)}>
              <Icons.chevron size={14} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        </div>
      </Card>

      {/* Detail drawer */}
      <DetailDrawer trx={selected} onClose={() => setSelected(null)} radius={radius} />
    </div>
  );
}

// ─── Drawer ──────────────────────────────────────────────────────────────────
function DetailDrawer({ trx, onClose, radius }) {
  const { Card, StatusBadge } = window.MuurahUI;
  const { btnPrimary, btnSecondary } = window.MuurahUtils;
  const [copied, setCopied] = useStateTX(false);

  useEffectTX(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (trx) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [trx, onClose]);

  if (!trx) return null;

  const timeline = [
    { time: trx.time, label: 'Transaksi dibuat', actor: trx.channel, done: true },
    { time: new Date(trx.time.getTime() + 800), label: 'Pembayaran diterima', actor: 'Sistem · ' + trx.channel, done: true },
    { time: new Date(trx.time.getTime() + 2400), label: 'Diteruskan ke biller', actor: 'API Gateway', done: trx.status !== 'pending' },
    {
      time: new Date(trx.time.getTime() + 4200),
      label: trx.status === 'sukses' ? 'Sukses diproses biller'
           : trx.status === 'gagal' ? 'Gagal · timeout biller'
           : trx.status === 'processing' ? 'Sedang diproses biller…' : 'Menunggu konfirmasi',
      actor: trx.kategori, done: trx.status === 'sukses' || trx.status === 'gagal',
      err: trx.status === 'gagal',
    },
  ];

  function copy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(26,18,40,0.45)',
        pointerEvents: 'auto', animation: 'muurah-fade 200ms ease',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 480, background: '#F5F3FF',
        borderLeft: '1px solid #E0D9F5',
        boxShadow: '-12px 0 32px rgba(26,18,40,0.12)',
        pointerEvents: 'auto', overflowY: 'auto',
        animation: 'muurah-slide 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drawer header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E0D9F5', background: '#FFFFFF',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                Detail Transaksi
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: '#1A1228' }}>{trx.id}</div>
                <button onClick={() => copy(trx.id)} style={{
                  width: 26, height: 26, border: '1px solid #E0D9F5', borderRadius: 8, background: '#FFFFFF',
                  color: '#574872', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {copied ? <Icons.check size={13} strokeWidth={2.5} /> : <Icons.copy size={13} />}
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#9085AE', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>Ref: {trx.ref}</div>
            </div>
            <button onClick={onClose} aria-label="Tutup" style={{
              width: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 10,
              background: '#FFFFFF', color: '#574872', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.x size={16} />
            </button>
          </div>
          <StatusBadge status={trx.status} />
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Amount */}
          <Card radius={radius} padding={20}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Pembayaran</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, fontWeight: 800, color: '#1A1228', letterSpacing: '-0.02em', marginTop: 6 }}>
              Rp {trx.total.toLocaleString('id-ID')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px dashed #E0D9F5' }}>
              <div>
                <div style={{ fontSize: 11, color: '#9085AE' }}>Harga produk</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#1A1228', marginTop: 2 }}>Rp {trx.harga.toLocaleString('id-ID')}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#9085AE' }}>Fee Muurah</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: '#16A34A', marginTop: 2 }}>+ Rp {trx.fee.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </Card>

          {/* Product */}
          <Card radius={radius} title="Produk" padding={20}>
            <DRow label="Nama produk" value={trx.produk} />
            <DRow label="Kategori" value={trx.kategori} />
            <DRow label="Nomor tujuan" mono value={trx.tujuan} copy={() => copy(trx.tujuan)} />
          </Card>

          {/* Pelanggan */}
          <Card radius={radius} title="Pelanggan & Agen" padding={20}>
            <DRow label="Pelanggan" value={trx.pelanggan} />
            <DRow label="No. telepon" mono value={trx.telepon} />
            <DRow label="Agen" value={`${trx.agen}`} />
            <DRow label="Kode agen" mono value={trx.agenCode} />
            <DRow label="Kota" value={trx.kota} />
            <DRow label="Channel" value={trx.channel} />
          </Card>

          {/* Timeline */}
          <Card radius={radius} title="Linimasa" padding={20}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
              {timeline.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: step.err ? '#EDE8FF' : step.done ? '#F0FDF4' : '#F0EBFF',
                      border: `2px solid ${step.err ? '#C0001A' : step.done ? '#16A34A' : '#C5B8EF'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: step.err ? '#C0001A' : step.done ? '#16A34A' : '#9085AE',
                    }}>
                      {step.err ? <Icons.x size={11} strokeWidth={3} /> : step.done ? <Icons.check size={11} strokeWidth={3} /> : (
                        <span className="muurah-spin" style={{ width: 9, height: 9, borderRadius: '50%', border: '1.5px solid currentColor', borderTopColor: 'transparent' }} />
                      )}
                    </div>
                    {i < timeline.length - 1 && (
                      <div style={{ position: 'absolute', left: '50%', top: 22, bottom: -14, width: 1.5, background: '#E0D9F5', transform: 'translateX(-50%)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: step.err ? '#C0001A' : '#1A1228' }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: '#9085AE', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                      {step.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · {step.actor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            {trx.status === 'gagal' && (
              <button style={{ ...btnPrimary(radius), flex: 1 }}>
                <Icons.refresh size={15} /> Reproses Transaksi
              </button>
            )}
            {trx.status === 'pending' && (
              <button style={{ ...btnPrimary(radius), flex: 1 }}>
                <Icons.refresh size={15} /> Cek Status Biller
              </button>
            )}
            <button style={{ ...btnSecondary(radius), flex: 1, justifyContent: 'center' }}>
              <Icons.download size={15} /> Unduh Bukti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DRow({ label, value, mono, copy }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 0', borderBottom: '1px dashed #F0EBFF',
    }}>
      <div style={{ fontSize: 12, color: '#9085AE' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#1A1228',
          fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
        }}>{value}</div>
        {copy && (
          <button onClick={copy} style={{
            width: 22, height: 22, border: 0, background: 'transparent',
            color: '#9085AE', cursor: 'pointer', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.copy size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Form bits ───────────────────────────────────────────────────────────────
function inputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 130ms ease',
    ...over,
  };
}

function Select({ label, value, options, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        ...inputStyle({}), appearance: 'none',
        paddingLeft: 12, paddingRight: 30,
        fontWeight: 500, cursor: 'pointer',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icons.chevron size={14} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        color: '#574872', pointerEvents: 'none',
      }} />
    </div>
  );
}

function DateRangePicker({ value, onChange, radius }) {
  const [open, setOpen] = useStateTX(false);
  const opts = [
    { id: '24h', label: '24 jam terakhir' },
    { id: '7d', label: '7 hari terakhir' },
    { id: '30d', label: '30 hari terakhir' },
    { id: 'mtd', label: 'Bulan ini' },
    { id: 'custom', label: 'Rentang khusus…' },
  ];
  const current = opts.find(o => o.id === value) || opts[0];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        ...inputStyle({}), display: 'inline-flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', fontWeight: 500, padding: '0 12px',
      }}>
        <Icons.calendar size={14} style={{ color: '#574872' }} />
        {current.label}
        <Icons.chevron size={13} style={{ color: '#574872' }} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0,
            background: '#FFFFFF', border: '1px solid #E0D9F5', borderRadius: 12,
            boxShadow: '0 12px 32px rgba(26,18,40,0.12)', padding: 6,
            zIndex: 21, minWidth: 220,
          }}>
            {opts.map(o => (
              <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} style={{
                width: '100%', textAlign: 'left', background: o.id === value ? '#F0EBFF' : 'transparent',
                border: 0, padding: '9px 12px', borderRadius: 8, fontSize: 13,
                color: o.id === value ? '#4A2D8C' : '#1A1228',
                fontWeight: o.id === value ? 600 : 500, cursor: 'pointer',
                fontFamily: 'inherit',
              }}>{o.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const cbStyle = { width: 16, height: 16, accentColor: '#4A2D8C', cursor: 'pointer' };

function pageBtn(disabled) {
  return {
    minWidth: 32, height: 32, border: '1px solid #E0D9F5', borderRadius: 8,
    background: '#FFFFFF', color: '#574872', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 10px', fontSize: 12, fontFamily: 'inherit',
  };
}

window.MuurahTransactions = Transactions;
