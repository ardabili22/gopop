// components.jsx — shell-focused: Logo, Sidebar (grouped), Navbar, Card.
// Brand: soft red #C0001A for logo + active nav; purple #4A2D8C reserved for
// "PRODUCTION" env badge and accent details. All other tokens unchanged.

const { useState, useMemo, useEffect, useRef } = React;

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 12, background: '#4A2D8C',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 17, letterSpacing: '-0.04em',
        boxShadow: '0 2px 6px rgba(74,45,140,0.25)',
        flexShrink: 0, color: "rgb(184, 224, 74)"
      }}>M</div>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1228', letterSpacing: '-0.015em' }}>muurah</span>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.015em', color: "rgb(184, 224, 74)" }}>.com</span>
        </div>
        <div style={{ fontSize: 11, color: '#9085AE', fontWeight: 500, marginTop: 2 }}>Admin Panel</div>
      </div>
    </div>);

}

// ─── Sidebar nav data ────────────────────────────────────────────────────────
const NAV_GROUPS = [
{ label: 'Overview', items: [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' }]
},
{ label: 'Operasional', items: [
  { id: 'produk', label: 'Produk & Harga', icon: 'tag' },
  { id: 'transaksi', label: 'Transaksi', icon: 'receipt' },
  { id: 'pengguna', label: 'Pengguna', icon: 'users' },
  { id: 'reseller', label: 'Reseller', icon: 'store' },
  { id: 'komplain', label: 'Komplain & Tiket', icon: 'alert' }]
},
{ label: 'Marketing', items: [
  { id: 'cms', label: 'Konten Homepage', icon: 'image' }]
},
{ label: 'Keuangan', items: [
  { id: 'laporan', label: 'Laporan Keuangan', icon: 'chart' },
  { id: 'rekon', label: 'Rekonsiliasi', icon: 'scale' },
  { id: 'settlement', label: 'Settlement', icon: 'bank' }]
},
{ label: 'Konfigurasi', items: [
  { id: 'master',     label: 'Master Data',      icon: 'store' },
  { id: 'pengaturan', label: 'Pengaturan Sistem', icon: 'cog' },
  { id: 'notifikasi', label: 'Notifikasi', icon: 'bell' },
  { id: 'role-tim', label: 'Role & Tim', icon: 'shieldlock' },
  { id: 'audit', label: 'Audit Log', icon: 'clock' }]
}];


// flat lookup for current page title
const NAV_FLAT = NAV_GROUPS.flatMap((g) => g.items);

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onSelect, badges = {}, onProfile }) {
  return (
    <aside style={{
      width: 240, flex: '0 0 240px', background: '#FFFFFF',
      borderRight: '1px solid #E0D9F5', height: '100vh',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, alignSelf: 'flex-start'
    }}>
      {/* Logo area: 60px, divider below */}
      <div style={{
        height: 60, padding: '0 16px',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid #E0D9F5', flexShrink: 0
      }}>
        <button onClick={() => onSelect('dashboard')} title="Ke Dashboard" style={{
          background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}>
          <Logo />
        </button>
      </div>

      {/* Nav body */}
      <nav style={{ padding: '4px 12px 12px', flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group, gi) =>
        <div key={group.label}>
            <div style={{
            fontSize: 10, fontWeight: 600, color: '#9085AE',
            letterSpacing: '0.6px', textTransform: 'uppercase',
            paddingTop: 20, paddingLeft: 12, paddingBottom: 8
          }}>{group.label}</div>
            {group.items.map((n) => {
            const IconC = Icons[n.icon];
            const isActive = active === n.id;
            const badge = badges[n.id];
            return (
              <button key={n.id} onClick={() => onSelect(n.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: '0 12px',
                height: 40, border: 0, borderRadius: 10,
                marginBottom: 2,
                background: isActive ? '#EDE8FF' : 'transparent',
                color: isActive ? '#4A2D8C' : '#574872',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: 500,
                fontFamily: 'inherit',
                transition: 'background 130ms ease, color 130ms ease'
              }}
              onMouseEnter={(e) => {if (!isActive) e.currentTarget.style.background = '#F0EBFF';}}
              onMouseLeave={(e) => {if (!isActive) e.currentTarget.style.background = 'transparent';}}>
                
                  <IconC size={16} style={{ flexShrink: 0, color: isActive ? '#4A2D8C' : '#574872' }} strokeWidth={1.75} />
                  <span style={{ flex: 1, lineHeight: 1 }}>{n.label}</span>
                  {badge ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 18, height: 18, padding: '0 6px',
                      borderRadius: 9, background: '#C0001A', color: '#FFFFFF',
                      fontSize: 10, fontWeight: 800, lineHeight: 1,
                      fontFamily: 'JetBrains Mono, monospace',
                      boxShadow: isActive ? '0 0 0 2px #EDE8FF' : '0 0 0 2px #FFFFFF',
                    }}>{badge > 9 ? '9+' : badge}</span>
                  ) : null}
                </button>);

          })}
          </div>
        )}
      </nav>

      {/* User footer */}
      <div style={{ padding: 12, borderTop: '1px solid #E0D9F5' }}>
        <button onClick={onProfile} title="Profil & Akun" style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '4px 4px', border: 0,
          background: active === 'profil' ? '#EDE8FF' : 'transparent',
          borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 130ms ease',
        }}
        onMouseEnter={(e) => { if (active !== 'profil') e.currentTarget.style.background = '#F0EBFF'; }}
        onMouseLeave={(e) => { if (active !== 'profil') e.currentTarget.style.background = 'transparent'; }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4A2D8C 0%, #B8E04A 100%)',
            color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(74,45,140,0.20)'
          }}>DP</div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1228', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dimas Pratama</div>
            <div style={{ fontSize: 11, color: '#9085AE', marginTop: 1 }}>Admin Operasional</div>
          </div>
          <span aria-hidden style={{
            width: 24, height: 24,
            color: '#9085AE',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><Icons.more size={14} /></span>
        </button>
      </div>
    </aside>);

}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ pageTitle, onProfile }) {
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  return (
    <header style={{
      height: 60, background: '#FFFFFF', borderBottom: '1px solid #E0D9F5',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      flexShrink: 0, position: 'sticky', top: 0, zIndex: 5
    }}>
      {/* Left: page title */}
      <div style={{ minWidth: 200 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>
          {pageTitle}
        </span>
      </div>

      {/* Center: search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 320 }}>
          <Icons.search size={15} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: '#9085AE'
          }} />
          <input
            placeholder="Cari transaksi, agen, produk…"
            style={{
              width: '100%', height: 38, padding: '0 60px 0 36px',
              background: '#F0EBFF', border: '1px solid transparent',
              borderRadius: 10, fontSize: 13, color: '#1A1228',
              outline: 'none', fontFamily: 'inherit',
              transition: 'border-color 130ms ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#C5B8EF'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'} />
          
          <span style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '3px 7px', borderRadius: 6,
            background: '#FFFFFF', border: '1px solid #E0D9F5',
            fontSize: 11, fontWeight: 600, color: '#574872',
            fontFamily: 'JetBrains Mono, monospace',
            pointerEvents: 'none'
          }}>⌘K</span>
        </div>
      </div>

      {/* Right: env badge, bell, user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 200, justifyContent: 'flex-end' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#EDE8FF', color: '#4A2D8C',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
          padding: '5px 10px', borderRadius: 20
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A2D8C' }} />
          PRODUCTION
        </span>

        <span style={{ width: 1, height: 24, background: '#E0D9F5' }} />

        <div style={{ position: 'relative' }}>
          <button aria-label="Notifikasi" onClick={() => setBellOpen(o => !o)} style={{
            width: 38, height: 38, borderRadius: 10,
            border: '1px solid transparent', background: bellOpen ? '#F0EBFF' : 'transparent',
            color: '#574872', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', transition: 'background 130ms ease'
          }}
          onMouseEnter={(e) => { if (!bellOpen) e.currentTarget.style.background = '#F0EBFF'; }}
          onMouseLeave={(e) => { if (!bellOpen) e.currentTarget.style.background = 'transparent'; }}>
            <Icons.bell size={18} />
            <span style={{
              position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%',
              background: '#C0001A', border: '2px solid #FFFFFF'
            }} />
          </button>
          {bellOpen && window.MuurahGlobal && (
            <window.MuurahGlobal.BellDropdown onClose={() => setBellOpen(false)} />
          )}
        </div>

        <span style={{ width: 1, height: 24, background: '#E0D9F5' }} />

        <div style={{ position: 'relative' }}>
          <button onClick={() => setOpen(o => !o)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: open ? '#F0EBFF' : 'transparent', border: 0, padding: '4px 4px 4px 4px',
            borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 130ms ease'
          }}
          onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = '#F0EBFF'; }}
          onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #4A2D8C 0%, #B8E04A 100%)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 12, letterSpacing: '-0.01em',
              boxShadow: '0 2px 6px rgba(74,45,140,0.20)'
            }}>DP</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1228' }}>Dimas Pratama</span>
            <Icons.chevron size={14} style={{ color: '#9085AE', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 130ms ease' }} />
          </button>
          {open && (
            <>
              <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                width: 240, background: '#FFFFFF',
                border: '1px solid #E0D9F5', borderRadius: 12,
                boxShadow: '0 12px 32px rgba(26,18,40,0.12)',
                zIndex: 31, padding: 6,
              }}>
                <div style={{
                  padding: '10px 12px', borderBottom: '1px solid #F0EBFF',
                  marginBottom: 4,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1228' }}>Dimas Pratama</div>
                  <div style={{ fontSize: 11, color: '#9085AE', marginTop: 1, fontFamily: 'JetBrains Mono, monospace' }}>d.pratama@muurah.com</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: '#EDE8FF', color: '#4A2D8C',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                    padding: '2px 8px', borderRadius: 20, marginTop: 6,
                  }}>Admin Operasional</span>
                </div>
                <DropdownItem icon={<Icons.users size={14} />} label="Profil & Akun" onClick={() => { setOpen(false); onProfile && onProfile(); }} />
                <DropdownItem icon={<Icons.shieldlock size={14} />} label="Keamanan & Password" onClick={() => { setOpen(false); onProfile && onProfile('security'); }} />
                <DropdownItem icon={<Icons.bell size={14} />} label="Preferensi Notifikasi" onClick={() => { setOpen(false); onProfile && onProfile('notif'); }} />
                <DropdownItem icon={<Icons.clock size={14} />} label="Aktivitas Login" onClick={() => { setOpen(false); onProfile && onProfile('activity'); }} />
                <div style={{ height: 1, background: '#F0EBFF', margin: '4px 8px' }} />
                <DropdownItem
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>}
                  label="Keluar" danger
                  onClick={() => { setOpen(false); window.location.href = 'login.html'; }} />
              </div>
            </>
          )}
        </div>
      </div>
    </header>);

}

function DropdownItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', border: 0, borderRadius: 8,
      background: 'transparent', color: danger ? '#C0001A' : '#1A1228',
      cursor: 'pointer', textAlign: 'left',
      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
      transition: 'background 130ms ease',
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = danger ? '#FCE7E9' : '#F0EBFF'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: danger ? '#C0001A' : '#574872', display: 'inline-flex' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}

// ─── Card wrapper (reused) ───────────────────────────────────────────────────
function Card({ title, subtitle, action, children, radius = 16, padding = 20, style }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E0D9F5',
      borderRadius: radius, padding,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      ...style
    }}>
      {(title || action) &&
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 16
      }}>
          <div>
            {title && <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 12, color: '#9085AE', marginTop: 4 }}>{subtitle}</div>}
          </div>
          {action}
        </div>
      }
      {children}
    </div>);

}

window.MuurahShell = { Logo, Sidebar, Navbar, Card, NAV_GROUPS, NAV_FLAT };