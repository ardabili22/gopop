// app.jsx — Navigation shell + routing + global UI hosts
const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const { Sidebar, Navbar, NAV_FLAT } = window.MuurahShell;
  const G = window.MuurahGlobal;
  const [active, setActive] = useStateApp('dashboard');
  const [komplainUnread, setKomplainUnread] = useStateApp(3);

  useEffectApp(() => {
    if (active === 'komplain') setKomplainUnread(0);
  }, [active]);

  useEffectApp(() => {
    window.muurahBumpKomplainUnread = (delta = 1) => {
      setKomplainUnread((c) => Math.max(0, c + delta));
    };
    return () => { delete window.muurahBumpKomplainUnread; };
  }, []);

  // Listen for global nav events
  useEffectApp(() => {
    function handler(e) {
      const target = e.detail;
      if (typeof target === 'string') setActive(target);
    }
    window.addEventListener('muurah-goto', handler);
    return () => window.removeEventListener('muurah-goto', handler);
  }, []);

  const current = NAV_FLAT.find(n => n.id === active) || NAV_FLAT[0];
  const pageTitle = active === 'profil' ? 'Profil & Akun' : current.label;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F3FF', width: '100%', minWidth: 1440 }}>
      <Sidebar active={active} onSelect={setActive}
        badges={{ komplain: komplainUnread }}
        onProfile={() => setActive('profil')} />

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Navbar pageTitle={pageTitle} onProfile={() => setActive('profil')} />

        <div style={{ flex: 1, background: '#F5F3FF', padding: 24 }}>
          {active === 'dashboard'  ? <window.MuurahDashboard /> :
           active === 'produk'     ? <window.MuurahProduk /> :
           active === 'reseller'   ? <window.MuurahReseller /> :
           active === 'cms'        ? <window.MuurahCms /> :
           active === 'komplain'   ? <window.MuurahKomplain /> :
           active === 'transaksi'  ? <window.MuurahTransaksi /> :
           active === 'pengguna'   ? <window.MuurahPengguna /> :
           active === 'laporan'    ? <window.MuurahLaporan /> :
           active === 'rekon'      ? <window.MuurahRekon /> :
           active === 'settlement' ? <window.MuurahSettlement /> :
           active === 'pengaturan' ? <window.MuurahPengaturan /> :
           active === 'notifikasi' ? <window.MuurahNotifikasi /> :
           active === 'akses'      ? <window.MuurahRoleAkses /> :
           active === 'tim-admin'  ? <window.MuurahTimAdmin /> :
           active === 'audit'      ? <window.MuurahAudit /> :
           active === 'profil'     ? <window.MuurahProfil /> :
           <Placeholder current={current} />}
        </div>
      </main>

      {G && <G.ToastContainer />}
      {G && <G.ConfirmHost />}
    </div>
  );
}

function Placeholder({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 480 }}>
      <div style={{
        width: '100%', maxWidth: 720, minHeight: 360,
        border: '1.5px dashed #C5B8EF', borderRadius: 16,
        background: 'rgba(255,255,255,0.4)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 40, textAlign: 'center', gap: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Content Area</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1228', letterSpacing: '-0.01em' }}>{current.label}</div>
        <div style={{ fontSize: 13, color: '#574872', maxWidth: 420, lineHeight: 1.6 }}>
          Halaman ini akan dibangun berikutnya menggunakan shell & sistem desain yang sama.
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app-root')).render(<App />);
