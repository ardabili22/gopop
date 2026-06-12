// notifikasi.jsx — Pengaturan Notifikasi screen
const { useState: useNfState } = React;

const NOTIF_EVENTS = [
  { id: 'tx_gagal',       label: 'Transaksi Gagal',           desc: 'Saat ada transaksi yang gagal diproses biller',     icon: 'alert',  tone: 'red',    on: true,
    channels: { email: true, whatsapp: true, inapp: true }, recipients: 'Admin Operasional + Finance' },
  { id: 'sr_low',         label: 'Success Rate < 95%',        desc: 'Saat success rate harian turun di bawah ambang batas', icon: 'trenddn', tone: 'amber', on: true,
    channels: { email: true, whatsapp: false, inapp: true }, recipients: 'Super Admin + Admin Operasional' },
  { id: 'refund',         label: 'Refund Manual Diproses',    desc: 'Saat CS atau Finance memproses refund manual',        icon: 'refresh', tone: 'purple', on: true,
    channels: { email: true, whatsapp: false, inapp: true }, recipients: 'Finance + Super Admin' },
  { id: 'deposit_low',    label: 'Deposit Supplier Hampir Habis', desc: 'Saldo deposit ke biller < Rp 5.000.000',          icon: 'wallet', tone: 'amber', on: true,
    channels: { email: true, whatsapp: true,  inapp: true }, recipients: 'Finance + Admin Operasional' },
  { id: 'user_new',       label: 'User Baru Mendaftar',       desc: 'Setiap user baru registrasi via app',                 icon: 'users',  tone: 'neutral', on: false,
    channels: { email: false, whatsapp: false, inapp: true }, recipients: 'Admin Operasional' },
  { id: 'reseller_new',   label: 'Reseller Baru Disetujui',   desc: 'Saat onboarding reseller selesai approval',           icon: 'store',  tone: 'neutral', on: false,
    channels: { email: true, whatsapp: false, inapp: true }, recipients: 'Admin Operasional' },
  { id: 'laporan_harian', label: 'Laporan Harian',            desc: 'Ringkasan KPI dikirim setiap jam 23:30 WIB',          icon: 'chart',  tone: 'green',  on: true,
    channels: { email: true, whatsapp: false, inapp: false }, recipients: 'Seluruh tim manajemen' },
];

const NF_TABS = [
  { id: 'alert',     label: 'Alert Internal',      icon: 'bell' },
  { id: 'broadcast', label: 'Broadcast ke User',    icon: 'megaphone' },
];

const BROADCAST_HISTORY_SEED = [
  { id: 'BC-014', judul: 'Promo Akhir Bulan: Cashback 5% E-Wallet', target: 'Semua User', channel: ['push','inapp'], penerima: 18_240, status: 'terkirim', tgl: '19 Mei · 09:00' },
  { id: 'BC-013', judul: 'Maintenance Sistem Malam Ini 23:00–01:00', target: 'Semua User', channel: ['push','inapp','email'], penerima: 18_120, status: 'terkirim', tgl: '17 Mei · 18:00' },
  { id: 'BC-012', judul: 'Reward Spesial untuk Reseller Gold & Platinum', target: 'Reseller Gold & Platinum', channel: ['push','whatsapp'], penerima: 16, status: 'terkirim', tgl: '15 Mei · 10:30' },
  { id: 'BC-011', judul: 'Token PLN Diskon 2% Khusus Weekend', target: 'User Aktif 30 Hari', channel: ['push','inapp'], penerima: 9_840, status: 'terjadwal', tgl: '24 Mei · 08:00' },
];

const NF_SEGMENTS = [
  { id: 'all',          label: 'Semua User',                 count: 18_412 },
  { id: 'active30',     label: 'User Aktif 30 Hari',          count: 9_840 },
  { id: 'inactive',     label: 'User Tidak Aktif > 60 Hari',  count: 3_120 },
  { id: 'reseller',     label: 'Reseller (Semua Level)',      count: 54 },
  { id: 'reseller_top', label: 'Reseller Gold & Platinum',    count: 16 },
];

function Notifikasi() {
  const { Card } = window.MuurahShell;
  const [tab, setTab] = useNfState('alert');
  const [events, setEvents] = useNfState(NOTIF_EVENTS);
  const [selectedId, setSelectedId] = useNfState('tx_gagal');
  const [broadcasts, setBroadcasts] = useNfState(BROADCAST_HISTORY_SEED);
  const selected = events.find(e => e.id === selectedId);

  function toggleEvent(id) {
    setEvents(es => es.map(e => e.id === id ? { ...e, on: !e.on } : e));
  }
  function setChannel(id, ch, v) {
    setEvents(es => es.map(e => e.id === id ? { ...e, channels: { ...e.channels, [ch]: v } } : e));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1228', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
          Notifikasi
        </h1>
        <div style={{ fontSize: 14, color: '#574872', marginTop: 4 }}>
          Atur alert internal tim, dan kirim broadcast/promo ke user
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 12, padding: 4, display: 'inline-flex', gap: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {NF_TABS.map((t) => {
          const IconC = Icons[t.icon] || Icons.bell;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 16px', borderRadius: 9, border: 0, cursor: 'pointer',
              background: active ? '#4A2D8C' : 'transparent',
              color: active ? '#FFFFFF' : '#574872',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 130ms ease',
            }}>
              <IconC size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'broadcast' ? (
        <BroadcastPanel broadcasts={broadcasts} setBroadcasts={setBroadcasts} />
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'flex-start' }}>
        {/* LEFT: events list */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0D9F5' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1228' }}>Event Notifikasi</div>
            <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2 }}>
              {events.filter(e => e.on).length} dari {events.length} event aktif
            </div>
          </div>
          <div>
            {events.map((e, idx) => {
              const isSelected = selectedId === e.id;
              const IconC = Icons[e.icon] || Icons.bell;
              const tones = {
                red:     { bg: '#FCE7E9', fg: '#C0001A' },
                amber:   { bg: '#FFFBEB', fg: '#D97706' },
                purple:  { bg: '#EDE8FF', fg: '#4A2D8C' },
                green:   { bg: '#F0FDF4', fg: '#16A34A' },
                neutral: { bg: '#F0EBFF', fg: '#574872' },
              };
              const t = tones[e.tone] || tones.neutral;
              return (
                <button key={e.id} onClick={() => setSelectedId(e.id)} style={{
                  width: '100%', padding: '14px 20px', cursor: 'pointer',
                  border: 0, borderTop: idx === 0 ? 0 : '1px solid #F0EBFF',
                  background: isSelected ? '#F0EBFF' : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 12,
                  textAlign: 'left', fontFamily: 'inherit',
                  transition: 'background 130ms ease',
                  position: 'relative',
                }}>
                  {isSelected && (
                    <span style={{
                      position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
                      borderRadius: 4, background: '#4A2D8C',
                    }} />
                  )}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: t.bg, color: t.fg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: e.on ? 1 : 0.45,
                  }}>
                    <IconC size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: e.on ? '#1A1228' : '#9085AE',
                    }}>{e.label}</div>
                    <div style={{
                      fontSize: 11, color: '#9085AE', marginTop: 2, lineHeight: 1.5,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{e.desc}</div>
                  </div>
                  <Toggle checked={e.on} onChange={() => toggleEvent(e.id)} />
                </button>
              );
            })}
          </div>
        </Card>

        {/* RIGHT: channel settings */}
        <Card padding={0} style={{ overflow: 'hidden', position: 'sticky', top: 84 }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #E0D9F5',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Channel Notifikasi
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1228', marginTop: 4, letterSpacing: '-0.01em' }}>
                {selected.label}
              </div>
              <div style={{ fontSize: 12, color: '#574872', marginTop: 2 }}>
                {selected.desc}
              </div>
            </div>
            <Toggle checked={selected.on} onChange={() => toggleEvent(selected.id)} />
          </div>

          {/* Channels */}
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
            opacity: selected.on ? 1 : 0.5, pointerEvents: selected.on ? 'auto' : 'none' }}>
            <ChannelRow
              icon="bell" tone="purple"
              title="In-App Notification"
              subtitle="Tampil di bell icon navbar & feed admin"
              checked={selected.channels.inapp}
              onChange={(v) => setChannel(selected.id, 'inapp', v)}
            />
            <ChannelRow
              icon="card" tone="gold"
              title="Email"
              subtitle="Kirim ke alamat email recipient (~30 dtk delay)"
              checked={selected.channels.email}
              onChange={(v) => setChannel(selected.id, 'email', v)}
            />
            <ChannelRow
              icon="phone" tone="green"
              title="WhatsApp"
              subtitle="Pesan WA via Twilio · per kirim Rp 240"
              checked={selected.channels.whatsapp}
              onChange={(v) => setChannel(selected.id, 'whatsapp', v)}
              meta="Twilio API"
            />

            {/* Recipients */}
            <div style={{
              background: '#F0EBFF', borderRadius: 10, padding: 14, marginTop: 4,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <Icons.users size={15} style={{ color: '#4A2D8C', marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Recipients
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228', marginTop: 4 }}>
                  {selected.recipients}
                </div>
              </div>
              <button style={{
                background: 'transparent', color: '#4A2D8C', border: 0,
                padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              }}>Ubah</button>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #E0D9F5',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#FAF8FF',
          }}>
            <div style={{ fontSize: 11, color: '#9085AE', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icons.clock size={12} /> Disimpan otomatis
            </div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
              height: 34, padding: '0 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              <Icons.bell size={13} /> Kirim Test Notification
            </button>
          </div>
        </Card>
      </div>
      )}
    </div>
  );
}

function ChannelRow({ icon, tone, title, subtitle, checked, onChange, meta }) {
  const tones = {
    purple: { bg: '#EDE8FF', fg: '#4A2D8C' },
    gold:   { bg: '#FEF9EC', fg: '#D4900A' },
    green:  { bg: '#F0FDF4', fg: '#16A34A' },
  };
  const t = tones[tone] || tones.purple;
  const IconC = Icons[icon] || Icons.bell;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 14, border: '1px solid #E0D9F5', borderRadius: 12,
      background: checked ? '#FFFFFF' : '#FAF8FF',
      transition: 'all 130ms ease',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: t.bg, color: t.fg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IconC size={17} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>{title}</span>
          {meta && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#9085AE',
              fontFamily: 'JetBrains Mono, monospace',
              padding: '2px 6px', borderRadius: 4, background: '#F0EBFF',
            }}>{meta}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#574872', marginTop: 2 }}>{subtitle}</div>
      </div>
      <Toggle checked={checked} onChange={() => onChange(!checked)} />
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <span onClick={(e) => { e.stopPropagation(); onChange(!checked); }} role="switch"
      aria-checked={checked} tabIndex={0}
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

// ─── Broadcast ke User ──────────────────────────────────────────────────────
function BroadcastPanel({ broadcasts, setBroadcasts }) {
  const { Card } = window.MuurahShell;
  const [segment, setSegment] = useNfState('all');
  const [judul, setJudul] = useNfState('');
  const [isi, setIsi] = useNfState('');
  const [channels, setChannels] = useNfState({ push: true, inapp: true, email: false, whatsapp: false });
  const [schedule, setSchedule] = useNfState('now');
  const [scheduleAt, setScheduleAt] = useNfState('');

  const seg = NF_SEGMENTS.find(s => s.id === segment);
  const isValid = judul.trim() && isi.trim() && Object.values(channels).some(Boolean);

  function toggleChannel(ch) {
    setChannels(c => ({ ...c, [ch]: !c[ch] }));
  }

  function handleSend() {
    if (!isValid) {
      window.muurahToast('Lengkapi judul, isi pesan, dan minimal 1 channel', 'error');
      return;
    }
    const willSchedule = schedule === 'later' && scheduleAt;
    window.muurahConfirm({
      title: willSchedule ? 'Jadwalkan broadcast ini?' : 'Kirim broadcast sekarang?',
      body: 'Akan dikirim ke ' + seg.label + ' (' + seg.count.toLocaleString('id-ID') + ' penerima) via ' +
        Object.entries(channels).filter(([,v]) => v).map(([k]) => BC_CHANNEL_LABEL[k]).join(', ') + '.',
      confirmLabel: willSchedule ? 'Jadwalkan' : 'Kirim Sekarang',
      onConfirm: () => {
        const newBc = {
          id: 'BC-' + Math.floor(100 + Math.random() * 900),
          judul: judul.trim(), target: seg.label,
          channel: Object.entries(channels).filter(([,v]) => v).map(([k]) => k),
          penerima: seg.count,
          status: willSchedule ? 'terjadwal' : 'terkirim',
          tgl: willSchedule ? scheduleAt : 'Baru saja',
        };
        setBroadcasts(b => [newBc, ...b]);
        setJudul(''); setIsi('');
        window.muurahToast(willSchedule ? 'Broadcast dijadwalkan' : 'Broadcast "' + newBc.judul + '" berhasil dikirim', 'success');
      },
    });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'flex-start' }}>
      {/* LEFT: composer */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0D9F5' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1228' }}>Buat Broadcast</div>
          <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2 }}>
            Kirim promo, info, atau pengumuman ke aplikasi end-user
          </div>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <NfField label="Judul Notifikasi">
            <input value={judul} onChange={(e) => setJudul(e.target.value)}
              placeholder="cth. Promo Akhir Bulan: Cashback 5% E-Wallet"
              style={nfInputStyle({ width: '100%' })} />
          </NfField>

          <NfField label="Isi Pesan">
            <textarea value={isi} onChange={(e) => setIsi(e.target.value)}
              placeholder="Tuliskan isi pesan promo/pengumuman untuk user…"
              rows={4}
              style={nfInputStyle({ width: '100%', height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical', fontFamily: 'inherit' })} />
          </NfField>

          <NfField label="Target Segmen">
            <div style={{ position: 'relative' }}>
              <select value={segment} onChange={(e) => setSegment(e.target.value)} style={nfInputStyle({
                width: '100%', appearance: 'none', paddingRight: 32, cursor: 'pointer',
              })}>
                {NF_SEGMENTS.map(s => <option key={s.id} value={s.id}>{s.label} · {s.count.toLocaleString('id-ID')} user</option>)}
              </select>
              <Icons.chevron size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#574872', pointerEvents: 'none' }} />
            </div>
          </NfField>

          <NfField label="Channel Pengiriman">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(BC_CHANNEL_LABEL).map(([id, label]) => {
                const active = channels[id];
                return (
                  <button key={id} type="button" onClick={() => toggleChannel(id)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 12px', borderRadius: 9, cursor: 'pointer',
                    background: active ? '#EDE8FF' : '#FFFFFF',
                    border: active ? '1.5px solid #4A2D8C' : '1px solid #E0D9F5',
                    color: active ? '#4A2D8C' : '#574872',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  }}>
                    {active && <Icons.check size={12} strokeWidth={2.8} />} {label}
                  </button>
                );
              })}
            </div>
          </NfField>

          <NfField label="Waktu Kirim">
            <div style={{ display: 'flex', gap: 16, paddingTop: 2, alignItems: 'center' }}>
              <NfRadio label="Kirim Sekarang" value="now" current={schedule} onChange={setSchedule} />
              <NfRadio label="Jadwalkan" value="later" current={schedule} onChange={setSchedule} />
              {schedule === 'later' && (
                <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)}
                  style={nfInputStyle({ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 })} />
              )}
            </div>
          </NfField>

          {/* Preview */}
          <div style={{ background: '#F0EBFF', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#574872', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>
              Preview Push Notification
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 10, padding: 12, display: 'flex', gap: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#4A2D8C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icons.megaphone size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1228' }}>{judul.trim() || 'Judul notifikasi…'}</div>
                <div style={{ fontSize: 11, color: '#574872', marginTop: 2, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {isi.trim() || 'Isi pesan akan tampil di sini…'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '14px 20px', borderTop: '1px solid #E0D9F5',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#FAF8FF',
        }}>
          <div style={{ fontSize: 11, color: '#9085AE' }}>
            Estimasi penerima: <b style={{ color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>{seg.count.toLocaleString('id-ID')}</b> user
          </div>
          <button onClick={handleSend} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#4A2D8C', color: '#FFFFFF', border: 0,
            height: 38, padding: '0 18px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            opacity: isValid ? 1 : 0.5,
          }}>
            <Icons.send size={14} /> {schedule === 'later' ? 'Jadwalkan' : 'Kirim Broadcast'}
          </button>
        </div>
      </Card>

      {/* RIGHT: history */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0D9F5' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1228' }}>Riwayat Broadcast</div>
          <div style={{ fontSize: 12, color: '#9085AE', marginTop: 2 }}>
            {broadcasts.length} broadcast terkirim/terjadwal
          </div>
        </div>
        <div>
          {broadcasts.map((b, idx) => (
            <div key={b.id} style={{
              padding: '14px 20px', borderTop: idx === 0 ? 0 : '1px solid #F0EBFF',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228', lineHeight: 1.4 }}>{b.judul}</div>
                <BcStatusPill status={b.status} />
              </div>
              <div style={{ fontSize: 11, color: '#574872', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Icons.users size={12} style={{ color: '#9085AE' }} /> {b.target}
                <span style={{ color: '#E0D9F5' }}>·</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{b.penerima.toLocaleString('id-ID')} penerima</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {b.channel.map(c => (
                    <span key={c} style={{
                      fontSize: 10, fontWeight: 600, color: '#574872', background: '#F0EBFF',
                      padding: '2px 7px', borderRadius: 6,
                    }}>{BC_CHANNEL_LABEL[c]}</span>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: '#9085AE', fontFamily: 'JetBrains Mono, monospace' }}>{b.tgl}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const BC_CHANNEL_LABEL = { push: 'Push Notif', inapp: 'In-App', email: 'Email', whatsapp: 'WhatsApp' };

function BcStatusPill({ status }) {
  const map = {
    terkirim:  { bg: '#F0FDF4', fg: '#16A34A', label: 'Terkirim' },
    terjadwal: { bg: '#FFFBEB', fg: '#D97706', label: 'Terjadwal' },
  };
  const m = map[status] || map.terkirim;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color: m.fg, background: m.bg,
      padding: '3px 8px', borderRadius: 6, flexShrink: 0, whiteSpace: 'nowrap',
    }}>{m.label}</span>
  );
}

function NfField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#574872', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
function nfInputStyle(over = {}) {
  return {
    background: '#F0EBFF', border: '1px solid transparent',
    borderRadius: 10, height: 38, padding: '0 12px', fontSize: 13,
    color: '#1A1228', outline: 'none', fontFamily: 'inherit',
    ...over,
  };
}
function NfRadio({ label, value, current, onChange }) {
  const active = current === value;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#1A1228', fontWeight: active ? 600 : 400 }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + (active ? '#4A2D8C' : '#C5B8EF'),
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }} onClick={() => onChange(value)}>
        {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4A2D8C' }} />}
      </span>
      <span onClick={() => onChange(value)}>{label}</span>
    </label>
  );
}

window.MuurahNotifikasi = Notifikasi;
