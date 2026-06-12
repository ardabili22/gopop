// login.jsx — Muurah admin login flow (form → 2FA → PIN → success), plus forgot-password
const { useState, useEffect, useRef } = React;

// ─── Icons (inline, lucide-style) ────────────────────────────────────────────
const Icon = ({ size = 18, sw = 1.75, children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>{children}</svg>
);
const IUser    = (p) => <Icon {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>;
const ILock    = (p) => <Icon {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>;
const IEye     = (p) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></Icon>;
const IEyeOff  = (p) => <Icon {...p}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/></Icon>;
const IPhone   = (p) => <Icon {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></Icon>;
const IShield  = (p) => <Icon {...p}><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/></Icon>;
const IRadar   = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></Icon>;
const IUsers   = (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const IScale   = (p) => <Icon {...p}><path d="M12 3v18M5 7h14M6 7l-3 7a4 4 0 0 0 6 0zM18 7l-3 7a4 4 0 0 0 6 0z"/></Icon>;
const ICheck   = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>;
const IArrowL  = (p) => <Icon {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></Icon>;
const IArrowR  = (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>;
const IMail    = (p) => <Icon {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></Icon>;
const IPin     = (p) => <Icon {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>;

// ════════════════════════════════════════════════════════════════════════════
//   APP — step state machine
// ════════════════════════════════════════════════════════════════════════════
function App() {
  // 'login' | 'otp' | 'pin' | 'success' | 'forgot' | 'forgot_sent'
  const [step, setStep] = useState('login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: 1440 }}>
      <BrandPanel />
      <main style={{
        flex: 1, background: '#F5F3FF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', position: 'relative',
      }}>
        {/* Step indicator (3 auth steps) */}
        {(step === 'login' || step === 'otp' || step === 'pin' || step === 'success') && (
          <StepIndicator step={step} />
        )}

        <div key={step} className="muurah-step" style={{
          width: 360, background: '#FFFFFF',
          border: '1px solid #E0D9F5', borderRadius: 16,
          boxShadow: '0 10px 40px rgba(26,18,40,0.06), 0 2px 8px rgba(0,0,0,0.04)',
          padding: 32,
        }}>
          {step === 'login'       && <LoginForm onSubmit={() => setStep('otp')} onForgot={() => setStep('forgot')} />}
          {step === 'otp'         && <OTPForm onSubmit={() => setStep('pin')} onBack={() => setStep('login')} />}
          {step === 'pin'         && <PINForm onSubmit={() => setStep('success')} onBack={() => setStep('otp')} />}
          {step === 'success'     && <SuccessState />}
          {step === 'forgot'      && <ForgotForm onSubmit={() => setStep('forgot_sent')} onBack={() => setStep('login')} />}
          {step === 'forgot_sent' && <ForgotSent onBack={() => setStep('login')} />}
        </div>

        {/* footer */}
        <div style={{
          position: 'absolute', bottom: 20, left: 0, right: 0,
          textAlign: 'center', fontSize: 11, color: '#9085AE',
        }}>
          © 2026 muurah.com · <a href="#" style={{ color: '#574872', textDecoration: 'none' }}>Privacy</a> · <a href="#" style={{ color: '#574872', textDecoration: 'none' }}>Terms</a> · <a href="#" style={{ color: '#574872', textDecoration: 'none' }}>Status</a>
        </div>
      </main>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   LEFT BRAND PANEL
// ════════════════════════════════════════════════════════════════════════════
function BrandPanel() {
  const features = [
    { icon: IShield, title: 'Keamanan enterprise',   desc: '2FA + audit log setiap aksi admin' },
    { icon: IRadar,  title: 'Monitoring realtime',   desc: 'Pantau transaksi & success rate live' },
    { icon: IUsers,  title: 'Multi-role RBAC',       desc: 'Kontrol akses per divisi (Ops, Finance, CS)' },
    { icon: IScale,  title: 'Rekonsiliasi otomatis', desc: 'Matching transaksi dengan laporan supplier' },
  ];
  return (
    <aside style={{
      width: 280, flex: '0 0 280px',
      background: '#4A2D8C',
      color: '#FFFFFF',
      display: 'flex', flexDirection: 'column',
      padding: '28px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* subtle dot grid overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        animation: 'muurah-bg 30s linear infinite',
        pointerEvents: 'none',
      }} />
      {/* glow */}
      <div aria-hidden style={{
        position: 'absolute', bottom: -120, right: -80, width: 320, height: 320,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,224,74,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 12,
          background: '#B8E04A', color: '#1A1228',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 17, letterSpacing: '-0.04em',
          boxShadow: '0 2px 6px rgba(184,224,74,0.35)',
        }}>M</div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>muurah</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginLeft: 1 }}>.com</span>
        </div>
      </div>

      {/* tagline */}
      <div style={{ marginTop: 36, position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#B8E04A',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>Admin Panel</div>
        <h1 style={{
          margin: '8px 0 10px', fontSize: 18, fontWeight: 700,
          color: '#FFFFFF', lineHeight: 1.4, letterSpacing: '-0.01em',
        }}>
          Platform PPOB terpercaya untuk tim operasional
        </h1>
        <p style={{
          fontSize: 12, color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.6, margin: 0,
        }}>
          Kelola transaksi, produk, pengguna, dan laporan keuangan dari satu dashboard.
        </p>
      </div>

      {/* features */}
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
        {features.map((f) => (
          <div key={f.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(184,224,74,0.15)', color: '#B8E04A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <f.icon size={15} sw={2} />
            </div>
            <div style={{ flex: 1, paddingTop: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* footer */}
      <div style={{
        marginTop: 24, paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.4)',
          fontFamily: 'JetBrains Mono, monospace',
        }}>muurah Admin v2.4.1 · 2026</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#86EFAC',
            boxShadow: '0 0 0 2px rgba(134,239,172,0.25)',
          }} />
          All systems normal
        </div>
      </div>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   STEP INDICATOR
// ════════════════════════════════════════════════════════════════════════════
function StepIndicator({ step }) {
  const order = ['login', 'otp', 'pin', 'success'];
  const idx = Math.min(order.indexOf(step), 2);
  return (
    <div style={{
      position: 'absolute', top: 32, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {[0, 1, 2].map((i) => {
          const isDone = i < idx || step === 'success';
          const isCurrent = i === idx && step !== 'success';
          const labels = ['Kredensial', 'Verifikasi', 'PIN'];
          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: isDone ? '#4A2D8C' : isCurrent ? '#FFFFFF' : '#F0EBFF',
                  border: isCurrent ? '2px solid #4A2D8C' : isDone ? 0 : '1.5px solid #C5B8EF',
                  color: isDone ? '#FFFFFF' : '#4A2D8C',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 130ms ease',
                  animation: isCurrent ? 'muurah-pulse 1.6s ease-in-out infinite' : 'none',
                }}>
                  {isDone ? <ICheck size={11} sw={3} /> : i + 1}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: isDone || isCurrent ? '#4A2D8C' : '#9085AE',
                }}>{labels[i]}</span>
              </div>
              {i < 2 && (
                <div style={{
                  width: 32, height: 2, background: isDone ? '#4A2D8C' : '#E0D9F5',
                  borderRadius: 2, marginBottom: 18,
                  transition: 'background 200ms ease',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   STEP 1 — Login Form
// ════════════════════════════════════════════════════════════════════════════
function LoginForm({ onSubmit, onForgot }) {
  const [email, setEmail] = useState('dimas.pratama@muurah.com');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = 'Email atau username wajib diisi';
    if (!pwd) errs.pwd = 'Password wajib diisi';
    else if (pwd.length < 6) errs.pwd = 'Password minimal 6 karakter';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onSubmit(); }, 800);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 style={titleStyle}>Masuk ke Admin Panel</h2>
      <p style={subtitleStyle}>Gunakan akun admin yang sudah terdaftar di Muurah.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
        <Field label="Email atau username" error={errors.email}>
          <IconInput icon={<IUser size={15} />} value={email} onChange={(e) => setEmail(e.target.value)}
            error={errors.email} placeholder="admin@muurah.com" autoComplete="username" />
        </Field>

        <Field label="Password" error={errors.pwd}>
          <IconInput
            icon={<ILock size={15} />}
            type={showPwd ? 'text' : 'password'}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            error={errors.pwd}
            placeholder="Masukkan password"
            autoComplete="current-password"
            trailing={
              <button type="button" onClick={() => setShowPwd(s => !s)}
                aria-label={showPwd ? 'Sembunyikan password' : 'Lihat password'}
                style={{
                  background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
                  color: '#9085AE', display: 'inline-flex',
                }}>
                {showPwd ? <IEyeOff size={15} /> : <IEye size={15} />}
              </button>
            }
          />
        </Field>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: '#574872', cursor: 'pointer', fontWeight: 500,
          }}>
            <Checkbox checked={remember} onChange={() => setRemember(r => !r)} />
            Ingat saya
          </label>
          <button type="button" onClick={onForgot} style={linkBtn()}>
            Lupa password?
          </button>
        </div>

        <button type="submit" disabled={submitting} style={{ ...primaryBtn(), marginTop: 4 }}>
          {submitting ? (
            <>
              <span className="muurah-spin" style={{
                width: 14, height: 14, borderRadius: '50%',
                border: '2px solid #FFFFFF', borderTopColor: 'transparent',
                display: 'inline-block',
              }} />
              Memverifikasi…
            </>
          ) : (
            <>Masuk <IArrowR size={15} /></>
          )}
        </button>

        <Divider label="atau" />

        <button type="button" style={secondaryBtn()}>
          <SSOLogo /> Masuk dengan SSO
        </button>
      </div>

      <div style={{
        marginTop: 20, padding: '10px 12px',
        background: '#F0EBFF', borderRadius: 10,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontSize: 11, color: '#574872', width: '100%',
      }}>
        <IShield size={13} style={{ color: '#4A2D8C', flexShrink: 0 }} />
        Koneksi terenkripsi · IP kamu tercatat di audit log.
      </div>
    </form>
  );
}

function SSOLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M2 12h20" stroke="#4A2D8C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" fill="#4A2D8C" />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   STEP 2 — OTP
// ════════════════════════════════════════════════════════════════════════════
function OTPForm({ onSubmit, onBack }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0] && refs.current[0].focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  function setDigit(i, v) {
    v = v.replace(/\D/g, '').slice(0, 1);
    setDigits(ds => {
      const next = [...ds];
      next[i] = v;
      return next;
    });
    if (v && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
    if (error) setError('');
  }

  function onKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1] && refs.current[i - 1].focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1] && refs.current[i - 1].focus();
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
  }

  function onPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (text.length) {
      e.preventDefault();
      const next = ['', '', '', '', '', ''];
      text.forEach((c, i) => { next[i] = c; });
      setDigits(next);
      const idx = Math.min(text.length, 5);
      refs.current[idx] && refs.current[idx].focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onSubmit(); }, 700);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHero icon={<IPhone size={26} />} bg="#EDE8FF" fg="#4A2D8C" />

      <h2 style={{ ...titleStyle, textAlign: 'center', marginTop: 18 }}>Verifikasi 2FA</h2>
      <p style={{ ...subtitleStyle, textAlign: 'center', marginTop: 6 }}>
        Kode OTP dikirim ke
        <br />
        <b style={{ color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>+62 812-xxxx-3847</b>
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 22 }} onPaste={onPaste}>
        {digits.map((d, i) => (
          <input key={i}
            ref={(el) => (refs.current[i] = el)}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            style={{
              width: 44, height: 52, borderRadius: 10,
              background: error ? '#FCE7E9' : d ? '#FFFFFF' : '#F0EBFF',
              border: `1.5px solid ${error ? '#C0001A' : d ? '#4A2D8C' : 'transparent'}`,
              textAlign: 'center', fontSize: 22, fontWeight: 700,
              color: '#1A1228', outline: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              transition: 'all 130ms ease',
            }}
          />
        ))}
      </div>

      {error && <ErrorMsg style={{ textAlign: 'center', marginTop: 10 }}>{error}</ErrorMsg>}

      <button type="submit" disabled={submitting} style={{ ...primaryBtn(), marginTop: 22, width: '100%' }}>
        {submitting ? (
          <>
            <span className="muurah-spin" style={spinnerStyle} />
            Memverifikasi…
          </>
        ) : 'Verifikasi'}
      </button>

      <div style={{
        marginTop: 14, textAlign: 'center', fontSize: 12, color: '#574872',
      }}>
        {seconds > 0 ? (
          <>Kirim ulang dalam <b style={{ color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>{seconds}s</b></>
        ) : (
          <button type="button" onClick={() => setSeconds(60)} style={linkBtn({ fontSize: 12 })}>
            Kirim ulang kode
          </button>
        )}
      </div>

      <button type="button" onClick={onBack} style={{
        ...linkBtn(), marginTop: 18, width: '100%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <IArrowL size={13} /> Kembali ke login
      </button>
    </form>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   STEP 3 — PIN
// ════════════════════════════════════════════════════════════════════════════
function PINForm({ onSubmit, onBack }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const refs = useRef([]);

  useEffect(() => { refs.current[0] && refs.current[0].focus(); }, []);

  function setDigit(i, v) {
    v = v.replace(/\D/g, '').slice(0, 1);
    setDigits(ds => { const next = [...ds]; next[i] = v; return next; });
    if (v && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
    if (error) setError('');
  }
  function onKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) { setError('PIN harus 6 digit'); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onSubmit(); }, 700);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHero icon={<ILock size={26} />} bg="#F4FCE3" fg="#5B7C12" />

      <h2 style={{ ...titleStyle, textAlign: 'center', marginTop: 18 }}>Masukkan PIN</h2>
      <p style={{ ...subtitleStyle, textAlign: 'center', marginTop: 6 }}>
        PIN 6 digit untuk mengamankan sesi admin
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 22 }}>
        {digits.map((d, i) => (
          <input key={i}
            ref={(el) => (refs.current[i] = el)}
            inputMode="numeric"
            type="password"
            autoComplete="off"
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            style={{
              width: 44, height: 52, borderRadius: 10,
              background: error ? '#FCE7E9' : d ? '#FFFFFF' : '#F0EBFF',
              border: `1.5px solid ${error ? '#C0001A' : d ? '#4A2D8C' : 'transparent'}`,
              textAlign: 'center', fontSize: 22, fontWeight: 700,
              color: '#1A1228', outline: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              transition: 'all 130ms ease',
              caretColor: '#4A2D8C',
            }}
          />
        ))}
      </div>

      {error && <ErrorMsg style={{ textAlign: 'center', marginTop: 10 }}>{error}</ErrorMsg>}

      <div style={{
        marginTop: 16, padding: '10px 12px',
        background: '#F0EBFF', borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11, color: '#574872',
      }}>
        <IShield size={13} style={{ color: '#4A2D8C', flexShrink: 0 }} />
        PIN tidak pernah dikirim ke server — diverifikasi di sisi browser.
      </div>

      <button type="submit" disabled={submitting} style={{ ...primaryBtn(), marginTop: 18, width: '100%' }}>
        {submitting ? (<><span className="muurah-spin" style={spinnerStyle} /> Mengonfirmasi…</>) : 'Konfirmasi'}
      </button>

      <button type="button" onClick={onBack} style={{
        ...linkBtn(), marginTop: 14, width: '100%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <IArrowL size={13} /> Kembali
      </button>
    </form>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   SUCCESS STATE
// ════════════════════════════════════════════════════════════════════════════
function SuccessState() {
  const [countdown, setCountdown] = useState(2);
  useEffect(() => {
    const i = setInterval(() => setCountdown(c => c - 1), 1000);
    const t = setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    return () => { clearInterval(i); clearTimeout(t); };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: '#F0FDF4', color: '#16A34A',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        margin: '4px auto 0',
        animation: 'muurah-pop 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 0 0 8px rgba(22,163,74,0.08)',
      }}>
        <ICheck size={32} sw={3} />
      </div>

      <h2 style={{ ...titleStyle, marginTop: 16 }}>Login berhasil!</h2>
      <p style={{ ...subtitleStyle, marginTop: 6 }}>
        Selamat datang kembali, <b style={{ color: '#1A1228' }}>Dimas Pratama</b>
      </p>

      <div style={{
        marginTop: 22, padding: 16,
        background: '#F0EBFF', borderRadius: 12,
        display: 'flex', flexDirection: 'column', gap: 8,
        textAlign: 'left',
      }}>
        <SessionRow label="Role" value="Admin Operasional" tone="lime" />
        <SessionRow label="Waktu" value="21 Mei 2026 · 09:14 WIB" mono />
        <SessionRow label="Lokasi" value="Jakarta, Indonesia (IP 110.139.42.18)" mono />
      </div>

      <div style={{
        marginTop: 18, padding: '12px 14px',
        background: '#FFFFFF', border: '1px solid #E0D9F5',
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 12, color: '#574872',
      }}>
        <div style={{ position: 'relative', width: 22, height: 22 }}>
          <svg viewBox="0 0 24 24" width="22" height="22">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#E0D9F5" strokeWidth="3" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="#4A2D8C" strokeWidth="3"
              strokeDasharray="62.8" strokeDashoffset={62.8 * (countdown / 2)}
              transform="rotate(-90 12 12)"
              style={{ transition: 'stroke-dashoffset 900ms linear' }} />
          </svg>
        </div>
        <span style={{ flex: 1 }}>
          Mengarahkan ke Dashboard dalam <b style={{ color: '#1A1228', fontFamily: 'JetBrains Mono, monospace' }}>{Math.max(0, countdown)}s</b>…
        </span>
      </div>

      <button onClick={() => { window.location.href = 'index.html'; }} style={{
        ...linkBtn(), marginTop: 12, width: '100%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        Buka sekarang <IArrowR size={13} />
      </button>
    </div>
  );
}

function SessionRow({ label, value, mono, tone }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#9085AE', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      {tone === 'lime' ? (
        <span style={{
          background: '#F4FCE3', color: '#5B7C12',
          padding: '3px 9px', borderRadius: 6,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        }}>{value}</span>
      ) : (
        <span style={{
          fontSize: 12, fontWeight: 600, color: '#1A1228',
          fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
        }}>{value}</span>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   FORGOT PASSWORD
// ════════════════════════════════════════════════════════════════════════════
function ForgotForm({ onSubmit, onBack }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { setError('Email wajib diisi'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Format email tidak valid'); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onSubmit(); }, 700);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <button type="button" onClick={onBack} style={{
        ...linkBtn(), marginBottom: 16, padding: 0,
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <IArrowL size={13} /> Kembali ke login
      </button>

      <StepHero icon={<IMail size={26} />} bg="#FEF9EC" fg="#D4900A" />

      <h2 style={{ ...titleStyle, textAlign: 'center', marginTop: 18 }}>Lupa password?</h2>
      <p style={{ ...subtitleStyle, textAlign: 'center', marginTop: 6 }}>
        Masukkan email akun admin kamu — kami akan kirim link untuk reset password.
      </p>

      <div style={{ marginTop: 22 }}>
        <Field label="Email" error={error}>
          <IconInput icon={<IMail size={15} />} value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
            error={error} type="email" placeholder="admin@muurah.com" />
        </Field>
      </div>

      <button type="submit" disabled={submitting} style={{ ...primaryBtn(), marginTop: 18, width: '100%' }}>
        {submitting ? (<><span className="muurah-spin" style={spinnerStyle} /> Mengirim…</>) : 'Kirim Link Reset'}
      </button>
    </form>
  );
}

function ForgotSent({ onBack }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: '#F0FDF4', color: '#16A34A',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto',
        animation: 'muurah-pop 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 0 0 8px rgba(22,163,74,0.08)',
      }}>
        <IMail size={28} sw={2} />
      </div>
      <h2 style={{ ...titleStyle, marginTop: 18 }}>Link reset dikirim!</h2>
      <p style={{ ...subtitleStyle, marginTop: 6 }}>
        Cek email kamu. Link akan kadaluwarsa dalam <b style={{ color: '#1A1228' }}>15 menit</b>.
        Jika tidak diterima, cek folder spam.
      </p>

      <div style={{
        marginTop: 20, padding: '12px 14px',
        background: '#F0EBFF', borderRadius: 10,
        fontSize: 11, color: '#574872',
        display: 'flex', alignItems: 'flex-start', gap: 8, textAlign: 'left',
      }}>
        <IShield size={13} style={{ color: '#4A2D8C', flexShrink: 0, marginTop: 2 }} />
        <span>
          Tidak menerima email setelah 2 menit?
          <a href="#" style={{ color: '#4A2D8C', fontWeight: 600, textDecoration: 'none', marginLeft: 4 }}>
            Hubungi admin IT
          </a>
        </span>
      </div>

      <button onClick={onBack} style={{ ...primaryBtn(), marginTop: 18, width: '100%' }}>
        Kembali ke Login
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//   Shared bits
// ════════════════════════════════════════════════════════════════════════════
function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#574872',
        letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      {children}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  );
}

function IconInput({ icon, trailing, error, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: error ? '#C0001A' : focused ? '#4A2D8C' : '#9085AE',
        pointerEvents: 'none',
        transition: 'color 130ms ease',
      }}>{icon}</span>
      <input {...rest}
        onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
        style={{
          width: '100%', height: 42,
          padding: '0 38px 0 38px',
          background: error ? '#FCE7E9' : '#F0EBFF',
          border: `1.5px solid ${error ? '#C0001A' : focused ? '#4A2D8C' : 'transparent'}`,
          borderRadius: 10, fontSize: 13,
          color: '#1A1228', outline: 'none',
          fontFamily: 'inherit',
          transition: 'all 130ms ease',
        }}
      />
      {trailing && (
        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
          {trailing}
        </span>
      )}
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <span onClick={onChange} role="checkbox" aria-checked={checked} tabIndex={0}
      style={{
        width: 16, height: 16, borderRadius: 5,
        background: checked ? '#4A2D8C' : '#FFFFFF',
        border: `1.5px solid ${checked ? '#4A2D8C' : '#C5B8EF'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#FFFFFF',
        transition: 'all 130ms ease',
      }}>
      {checked && <ICheck size={11} sw={3.5} />}
    </span>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
      <span style={{ flex: 1, height: 1, background: '#E0D9F5' }} />
      <span style={{ fontSize: 11, color: '#9085AE', fontWeight: 500 }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: '#E0D9F5' }} />
    </div>
  );
}

function ErrorMsg({ children, style }) {
  return (
    <div style={{
      fontSize: 11, color: '#C0001A', fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 5,
      ...(style || {}),
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: '50%', background: '#C0001A',
        color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 800,
      }}>!</span>
      {children}
    </div>
  );
}

function StepHero({ icon, bg, fg }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '4px auto 0',
    }}>
      {icon}
    </div>
  );
}

// shared styles
const titleStyle = {
  fontSize: 20, fontWeight: 700, color: '#1A1228',
  letterSpacing: '-0.015em', margin: 0, lineHeight: 1.25,
};
const subtitleStyle = {
  fontSize: 13, color: '#574872', margin: 0, lineHeight: 1.55,
};
const spinnerStyle = {
  width: 14, height: 14, borderRadius: '50%',
  border: '2px solid #FFFFFF', borderTopColor: 'transparent',
  display: 'inline-block',
};

function primaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: '#4A2D8C', color: '#FFFFFF', border: 0,
    height: 42, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background 130ms ease, transform 80ms ease',
    width: '100%',
  };
}
function secondaryBtn() {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: '#FFFFFF', color: '#4A2D8C', border: '1px solid #C5B8EF',
    height: 42, padding: '0 16px', borderRadius: 10,
    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background 130ms ease',
    width: '100%',
  };
}
function linkBtn(over = {}) {
  return {
    background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
    color: '#4A2D8C', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
    ...over,
  };
}

ReactDOM.createRoot(document.getElementById('login-root')).render(<App />);
