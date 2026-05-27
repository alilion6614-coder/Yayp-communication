import { useState, useEffect, useRef } from "react";

// ─── Google Auth Simulation & Firebase-like Storage ───────────────────────────
const STORAGE_KEY = "yayp_users";
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};
const saveUser = (u) => {
  const users = getUsers();
  const exists = users.find(x => x.email === u.email);
  if (!exists) users.push(u);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: "Sarah Mitchell", role: "Operations Director, TechNova UK", stars: 5, text: "Yayp Communication transformed our customer support pipeline. Their call center agents are professional, responsive, and genuinely care about resolution quality. We saw a 40% increase in CSAT within 3 months." },
  { name: "Ahmed Al-Rashidi", role: "CEO, Gulf Fintech Solutions", stars: 5, text: "Outstanding outsourcing partner. The software development team delivered our fintech portal ahead of schedule. Shabi and Humayo are hands-on leaders who ensure every project exceeds expectations." },
  { name: "Priya Nair", role: "Head of Digital, RetailMax India", stars: 5, text: "We outsourced our entire CRM development to Yayp. The communication was seamless, deadlines met, and the quality was enterprise-grade. Cannot recommend them highly enough." },
  { name: "James Okwuosa", role: "Founder, Logix Africa", stars: 5, text: "Exceptional BPO services. Yayp's call center handled our overflow traffic during peak season flawlessly. Their agents sound local and treat every customer with care." },
  { name: "Lisa Chen", role: "VP Technology, Pacific Commerce", stars: 5, text: "Phenomenal software house. Built our e-commerce platform from scratch with modern architecture. The team is talented, communicative, and truly invested in your success." },
  { name: "Rami Kassem", role: "Director, MENA Digital Group", stars: 5, text: "I've worked with many outsourcing firms. Yayp stands apart — complete transparency, no hidden costs, and a leadership team that's available around the clock." },
];

const SERVICES = [
  { icon: "📞", title: "Inbound Call Center", desc: "24/7 professional inbound support with trained agents handling customer queries, complaints, and escalations with empathy and speed." },
  { icon: "📤", title: "Outbound Campaigns", desc: "Results-driven outbound calling for sales, surveys, lead generation, and customer retention with real-time reporting dashboards." },
  { icon: "💻", title: "Software Development", desc: "Full-stack web and mobile development — from MVPs to enterprise platforms. We build scalable, secure, and beautiful software." },
  { icon: "🌐", title: "BPO & Outsourcing", desc: "End-to-end business process outsourcing covering data entry, back-office operations, live chat, and virtual assistant services." },
  { icon: "🤖", title: "AI & Automation", desc: "Intelligent automation solutions including chatbots, workflow automation, and AI-powered analytics to reduce costs and boost efficiency." },
  { icon: "📊", title: "CRM & Analytics", desc: "Custom CRM solutions and deep analytics dashboards that give you a 360° view of your customer journey and business performance." },
];

const NAV_ITEMS = ["Home", "Services", "About", "Reviews", "Contact"];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Particle Background ──────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1, alpha: Math.random() * 0.4 + 0.1
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,198,255,${p.alpha})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,198,255,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── Floating Orbs ────────────────────────────────────────────────────────────
function Orbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ ...orbStyle, width: 600, height: 600, top: -200, left: -200, background: "radial-gradient(circle, rgba(0,100,255,0.07) 0%, transparent 70%)", animation: "orbFloat1 12s ease-in-out infinite" }} />
      <div style={{ ...orbStyle, width: 500, height: 500, bottom: -150, right: -150, background: "radial-gradient(circle, rgba(0,198,255,0.06) 0%, transparent 70%)", animation: "orbFloat2 15s ease-in-out infinite" }} />
      <div style={{ ...orbStyle, width: 300, height: 300, top: "50%", left: "60%", background: "radial-gradient(circle, rgba(120,0,255,0.04) 0%, transparent 70%)", animation: "orbFloat3 10s ease-in-out infinite" }} />
    </div>
  );
}
const orbStyle = { position: "absolute", borderRadius: "50%" };

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("Home");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: "", email: "" });
  const [loginError, setLoginError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("yayp_session");
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto rotate reviews
  useEffect(() => {
    const t = setInterval(() => setReviewIdx(i => (i + 1) % REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const handleGoogleLogin = () => {
    const { name, email } = loginForm;
    if (!name.trim() || !email.includes("@")) { setLoginError("Please enter a valid name and email."); return; }
    const u = { name, email, avatar: name[0].toUpperCase(), loginTime: new Date().toISOString() };
    saveUser(u);
    localStorage.setItem("yayp_session", JSON.stringify(u));
    setUser(u);
    setShowLogin(false);
    setLoginError("");
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem("yayp_session"); };

  const sendContact = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    const msgs = JSON.parse(localStorage.getItem("yayp_messages") || "[]");
    msgs.push({ ...contactForm, time: new Date().toISOString() });
    localStorage.setItem("yayp_messages", JSON.stringify(msgs));
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setContactSent(false), 4000);
  };

  const openWhatsApp = (number) => {
    window.open(`https://wa.me/${number.replace(/\D/g, "")}`, "_blank");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#050a14;color:#e8edf5;font-family:'Inter',sans-serif;overflow-x:hidden}
        h1,h2,h3{font-family:'Syne',sans-serif}
        .nav-link{color:#8899aa;text-decoration:none;font-size:14px;letter-spacing:.5px;transition:.2s;cursor:pointer;background:none;border:none;padding:4px 0}
        .nav-link:hover,.nav-link.active{color:#00c6ff}
        .btn-primary{background:linear-gradient(135deg,#0064ff,#00c6ff);color:#fff;border:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;cursor:pointer;transition:.2s;font-family:'Inter',sans-serif}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,198,255,0.3)}
        .btn-outline{background:transparent;color:#00c6ff;border:1px solid rgba(0,198,255,0.4);padding:10px 24px;border-radius:8px;font-weight:500;font-size:14px;cursor:pointer;transition:.2s;font-family:'Inter',sans-serif}
        .btn-outline:hover{background:rgba(0,198,255,0.08);border-color:#00c6ff}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(0,198,255,0.1);border-radius:16px;backdrop-filter:blur(10px);transition:.3s}
        .card:hover{border-color:rgba(0,198,255,0.3);background:rgba(0,198,255,0.04);transform:translateY(-4px)}
        .gradient-text{background:linear-gradient(135deg,#00c6ff,#0064ff,#7b2fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .input-field{background:rgba(255,255,255,0.05);border:1px solid rgba(0,198,255,0.15);border-radius:8px;padding:12px 16px;color:#e8edf5;font-size:14px;font-family:'Inter',sans-serif;width:100%;outline:none;transition:.2s}
        .input-field:focus{border-color:rgba(0,198,255,0.5);background:rgba(0,198,255,0.04)}
        .whatsapp-btn{background:#25d366;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;transition:.2s;font-family:'Inter',sans-serif}
        .whatsapp-btn:hover{background:#1ebe5d;transform:scale(1.03)}
        .section{position:relative;z-index:1}
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,30px) scale(1.05)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,-40px) scale(1.08)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-30px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        .animate-fade-up{animation:fadeUp .7s ease forwards}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(0,198,255,0.1);border:1px solid rgba(0,198,255,0.25);padding:6px 16px;border-radius:24px;font-size:13px;color:#00c6ff;margin-bottom:24px}
        .badge-dot{width:8px;height:8px;border-radius:50%;background:#00c6ff;animation:pulse 1.5s infinite}
        .stat-card{text-align:center;padding:28px 20px}
        .stat-num{font-family:'Syne',sans-serif;font-size:42px;font-weight:800;background:linear-gradient(135deg,#00c6ff,#7b2fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .stat-label{color:#6b7a8d;font-size:14px;margin-top:4px}
        .review-card{padding:32px;position:relative}
        .stars{color:#f5a623;font-size:16px;margin-bottom:12px}
        .review-text{color:#b8c5d0;font-size:15px;line-height:1.7;font-style:italic}
        .reviewer-name{font-weight:600;font-size:14px;color:#e8edf5;margin-top:16px}
        .reviewer-role{font-size:12px;color:#6b7a8d;margin-top:2px}
        .team-card{padding:28px;text-align:center}
        .avatar-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#0064ff,#00c6ff);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:28px;font-weight:800;margin:0 auto 16px;border:3px solid rgba(0,198,255,0.3)}
        .floating-label{position:absolute;top:-12px;left:16px;background:#050a14;padding:0 8px;font-size:11px;color:#00c6ff;letter-spacing:1px;text-transform:uppercase}
        .login-modal{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
        .login-box{background:#0b1628;border:1px solid rgba(0,198,255,0.2);border-radius:20px;padding:40px;width:420px;max-width:90vw;position:relative}
        .google-btn{background:#fff;color:#333;border:none;padding:12px 24px;border-radius:8px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;width:100%;font-size:15px;transition:.2s;font-family:'Inter',sans-serif}
        .google-btn:hover{background:#f5f5f5;transform:translateY(-1px)}
        .divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:#4a5568;font-size:12px}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.08)}
        .progress-bar{height:3px;background:linear-gradient(90deg,#0064ff,#00c6ff);border-radius:2px;transition:.3s}
        .nav-glass{position:fixed;top:0;left:0;right:0;z-index:100;transition:.3s;padding:0 5vw}
        .footer-link{color:#6b7a8d;font-size:13px;text-decoration:none;display:block;margin-bottom:8px;transition:.2s}
        .footer-link:hover{color:#00c6ff}
        .mobile-menu{display:none}
        @media(max-width:768px){
          .desktop-nav{display:none}
          .mobile-menu{display:flex}
          .hero-grid{grid-template-columns:1fr!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .services-grid{grid-template-columns:1fr!important}
          .team-grid{grid-template-columns:1fr!important}
          .contact-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      <ParticleCanvas />
      <Orbs />

      {/* Navigation */}
      <nav className="nav-glass" style={{ background: scrolled ? "rgba(5,10,20,0.95)" : "transparent", borderBottom: scrolled ? "1px solid rgba(0,198,255,0.08)" : "none" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0064ff,#00c6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 16 }}>Y</div>
            <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: ".5px" }}>Yayp <span style={{ color: "#00c6ff" }}>Communication</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV_ITEMS.map(n => (
              <button key={n} className={`nav-link${section === n ? " active" : ""}`} onClick={() => setSection(n)}>{n}</button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#0064ff,#00c6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{user.avatar}</div>
                <span style={{ fontSize: 13, color: "#b8c5d0", display: "none" }}>{user.name.split(" ")[0]}</span>
                <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }} onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => setShowLogin(true)}>Sign In</button>
            )}
            <button className="mobile-menu" style={{ background: "none", border: "none", color: "#e8edf5", fontSize: 22, cursor: "pointer" }} onClick={() => setMobileMenu(!mobileMenu)}>☰</button>
          </div>
        </div>
        {/* Mobile dropdown */}
        {mobileMenu && (
          <div style={{ background: "rgba(5,10,20,0.98)", padding: "16px 0", borderTop: "1px solid rgba(0,198,255,0.1)" }}>
            {NAV_ITEMS.map(n => (
              <button key={n} className="nav-link" style={{ display: "block", padding: "12px 24px", width: "100%", textAlign: "left", fontSize: 15 }} onClick={() => { setSection(n); setMobileMenu(false); }}>{n}</button>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {section === "Home" && <HomeSection setSection={setSection} openWhatsApp={openWhatsApp} reviewIdx={reviewIdx} setReviewIdx={setReviewIdx} />}
        {section === "Services" && <ServicesSection />}
        {section === "About" && <AboutSection openWhatsApp={openWhatsApp} />}
        {section === "Reviews" && <ReviewsSection reviewIdx={reviewIdx} setReviewIdx={setReviewIdx} />}
        {section === "Contact" && <ContactSection contactForm={contactForm} setContactForm={setContactForm} contactSent={contactSent} sendContact={sendContact} openWhatsApp={openWhatsApp} user={user} />}
      </div>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(0,198,255,0.08)", padding: "60px 5vw 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: "linear-gradient(135deg,#0064ff,#00c6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 14 }}>Y</div>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>Yayp Communication</span>
              </div>
              <p style={{ color: "#6b7a8d", fontSize: 13, lineHeight: 1.7 }}>Your global partner for call center excellence and cutting-edge software development.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "#00c6ff", marginBottom: 16 }}>Navigate</p>
              {NAV_ITEMS.map(n => <a key={n} className="footer-link" href="#" onClick={e => { e.preventDefault(); setSection(n); window.scrollTo(0, 0); }}>{n}</a>)}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "#00c6ff", marginBottom: 16 }}>Services</p>
              {["Call Center", "BPO Outsourcing", "Software Dev", "AI Solutions", "CRM Systems"].map(s => <span key={s} className="footer-link" style={{ cursor: "default" }}>{s}</span>)}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "#00c6ff", marginBottom: 16 }}>Contact</p>
              <p style={{ color: "#6b7a8d", fontSize: 13, marginBottom: 8 }}>📍 Rawalpindi, Punjab, Pakistan</p>
              <p style={{ color: "#6b7a8d", fontSize: 13, marginBottom: 8 }}>📧 info@yaypcommunication.com</p>
              <p style={{ color: "#6b7a8d", fontSize: 13 }}>🕐 24/7 Support Available</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#4a5568", fontSize: 13 }}>© 2025 Yayp Communication. All rights reserved.</p>
            <p style={{ color: "#4a5568", fontSize: 13 }}>Built with ❤️ in Pakistan</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="login-modal" onClick={e => e.target === e.currentTarget && setShowLogin(false)}>
          <div className="login-box animate-fade-up">
            <button onClick={() => setShowLogin(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#6b7a8d", fontSize: 20, cursor: "pointer" }}>✕</button>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg,#0064ff,#00c6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 24, margin: "0 auto 16px" }}>Y</div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontSize: 22, marginBottom: 6 }}>Welcome Back</h2>
              <p style={{ color: "#6b7a8d", fontSize: 14 }}>Sign in to access your portal</p>
            </div>

            <div style={{ marginBottom: 16, position: "relative" }}>
              <div className="floating-label">Full Name</div>
              <input className="input-field" placeholder="Your full name" value={loginForm.name} onChange={e => setLoginForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 20, position: "relative" }}>
              <div className="floating-label">Email</div>
              <input className="input-field" type="email" placeholder="your@email.com" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleGoogleLogin()} />
            </div>
            {loginError && <p style={{ color: "#ff4757", fontSize: 13, marginBottom: 12 }}>{loginError}</p>}

            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"/><path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"/><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Home Section ─────────────────────────────────────────────────────────────
function HomeSection({ setSection, openWhatsApp, reviewIdx, setReviewIdx }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 5vw 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div className="animate-fade-up">
              <div className="hero-badge"><span className="badge-dot" />Global BPO & Software Partner</div>
              <h1 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
                <span className="gradient-text">Elevate</span> Your<br />
                Business With<br />
                <span style={{ color: "#fff" }}>World-Class</span> Support
              </h1>
              <p style={{ color: "#8899aa", fontSize: 17, lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>
                Yayp Communication delivers enterprise-grade call center services, custom software development, and full-scale BPO outsourcing — all from one trusted partner.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => setSection("Contact")}>Get Started Today</button>
                <button className="btn-outline" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => setSection("Services")}>Explore Services</button>
              </div>
            </div>
            <div style={{ position: "relative", animation: "fadeUp .9s ease .2s both" }}>
              {/* Glowing card */}
              <div style={{ background: "rgba(0,100,255,0.05)", border: "1px solid rgba(0,198,255,0.15)", borderRadius: 24, padding: 36, backdropFilter: "blur(20px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00c853", boxShadow: "0 0 8px #00c853" }} />
                  <span style={{ fontSize: 13, color: "#8899aa" }}>Live Operations — Online</span>
                </div>
                {[
                  { label: "Customer Satisfaction", val: 98, color: "#00c6ff" },
                  { label: "Project Delivery Rate", val: 100, color: "#7b2fff" },
                  { label: "Client Retention", val: 95, color: "#00e676" },
                ].map(m => (
                  <div key={m.label} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "#8899aa" }}>{m.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{m.val}%</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${m.val}%`, background: m.color, borderRadius: 4, boxShadow: `0 0 8px ${m.color}66`, animation: "shimmer 2s infinite", backgroundSize: "200% 100%" }} />
                    </div>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 28 }}>
                  {[{ n: "500+", l: "Clients Served" }, { n: "24/7", l: "Support Hours" }, { n: "50+", l: "Agents Active" }, { n: "12+", l: "Countries" }].map(s => (
                    <div key={s.l} style={{ background: "rgba(0,198,255,0.06)", borderRadius: 10, padding: "14px", textAlign: "center" }}>
                      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 22, color: "#00c6ff" }}>{s.n}</div>
                      <div style={{ fontSize: 11, color: "#6b7a8d", marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "60px 5vw", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {[{ n: 500, s: "+", l: "Global Clients" }, { n: 98, s: "%", l: "CSAT Score" }, { n: 12, s: "+", l: "Countries Served" }, { n: 7, s: " yrs", l: "Industry Experience" }].map(s => (
              <div key={s.l} className="card stat-card">
                <div className="stat-num"><Counter end={s.n} suffix={s.s} /></div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services preview */}
      <div style={{ padding: "60px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#00c6ff", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>What We Offer</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Comprehensive <span className="gradient-text">Solutions</span></h2>
            <p style={{ color: "#6b7a8d", maxWidth: 520, margin: "0 auto" }}>From inbound support to full-scale software delivery — every solution tailored to your business goals.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {SERVICES.slice(0, 3).map(s => (
              <div key={s.title} className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "#6b7a8d", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button className="btn-outline" onClick={() => setSection("Services")}>View All Services →</button>
          </div>
        </div>
      </div>

      {/* Featured Review */}
      <div style={{ padding: "60px 5vw", background: "rgba(0,100,255,0.02)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#00c6ff", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 32 }}>What Clients Say</p>
          <div className="card review-card" style={{ padding: "40px 48px" }}>
            <div className="stars">{"★".repeat(5)}</div>
            <p className="review-text" style={{ fontSize: 17 }}>"{REVIEWS[reviewIdx].text}"</p>
            <p className="reviewer-name" style={{ marginTop: 24 }}>{REVIEWS[reviewIdx].name}</p>
            <p className="reviewer-role">{REVIEWS[reviewIdx].role}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
              {REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIdx(i)} style={{ width: i === reviewIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === reviewIdx ? "#00c6ff" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: ".3s" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ padding: "80px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg,rgba(0,100,255,0.15),rgba(0,198,255,0.08))", border: "1px solid rgba(0,198,255,0.2)", borderRadius: 24, padding: "60px 48px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 }}>Ready to Scale Your <span className="gradient-text">Operations?</span></h2>
            <p style={{ color: "#8899aa", fontSize: 17, marginBottom: 36, maxWidth: 540, margin: "0 auto 36px" }}>Partner with Yayp Communication and experience the difference of a truly dedicated team. Let's talk today.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: "14px 36px" }} onClick={() => setSection("Contact")}>Book a Free Consultation</button>
              <button className="whatsapp-btn" onClick={() => openWhatsApp("923006043913")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────
function ServicesSection() {
  return (
    <div style={{ padding: "120px 5vw 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#00c6ff", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Our Expertise</p>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, marginBottom: 20 }}>End-to-End <span className="gradient-text">Business Solutions</span></h2>
          <p style={{ color: "#6b7a8d", maxWidth: 580, margin: "0 auto", fontSize: 16, lineHeight: 1.8 }}>We are a fully integrated communications and technology company delivering measurable outcomes for businesses worldwide.</p>
        </div>
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 24 }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} className="card" style={{ padding: 32, animation: `fadeUp .6s ease ${i * .1}s both` }}>
              <div style={{ fontSize: 40, marginBottom: 20 }}>{s.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>{s.title}</h3>
              </div>
              <p style={{ color: "#6b7a8d", fontSize: 15, lineHeight: 1.75 }}>{s.desc}</p>
              <div style={{ marginTop: 24, height: 2, background: "linear-gradient(90deg,#0064ff,transparent)", borderRadius: 1 }} />
            </div>
          ))}
        </div>

        {/* Outsourcing highlight */}
        <div style={{ marginTop: 60, background: "linear-gradient(135deg,rgba(0,100,255,0.1),rgba(123,47,255,0.08))", border: "1px solid rgba(0,198,255,0.15)", borderRadius: 24, padding: "48px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div>
              <p style={{ color: "#00c6ff", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Outsourcing Partner</p>
              <h3 style={{ fontSize: 30, fontWeight: 800, marginBottom: 16 }}>Why Outsource to <span className="gradient-text">Yayp?</span></h3>
              <p style={{ color: "#8899aa", lineHeight: 1.8, marginBottom: 24 }}>Cut operational costs by up to 60% while accessing world-class talent, infrastructure, and expertise. We handle everything — you focus on growth.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["Cost Efficiency", "Skilled Workforce", "Scalable Teams", "Quality Assurance", "24/7 Coverage", "Data Security"].map(t => (
                  <span key={t} style={{ background: "rgba(0,198,255,0.1)", border: "1px solid rgba(0,198,255,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 13, color: "#00c6ff" }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[{ n: "60%", l: "Cost Reduction" }, { n: "3x", l: "Faster Delivery" }, { n: "99.9%", l: "Uptime SLA" }, { n: "50+", l: "Expert Agents" }].map(s => (
                <div key={s.l} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 20, textAlign: "center", border: "1px solid rgba(0,198,255,0.1)" }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 28, color: "#00c6ff", marginBottom: 6 }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: "#6b7a8d" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection({ openWhatsApp }) {
  return (
    <div style={{ padding: "120px 5vw 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#00c6ff", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Our Story</p>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, marginBottom: 20 }}>Meet the <span className="gradient-text">Leadership</span></h2>
          <p style={{ color: "#6b7a8d", maxWidth: 560, margin: "0 auto", fontSize: 16, lineHeight: 1.8 }}>Driven by a passion for excellence, our founders built Yayp Communication from the ground up to redefine what a BPO and software house can achieve.</p>
        </div>

        <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, maxWidth: 900, margin: "0 auto 80px" }}>
          {[
            { name: "Humayo", role: "Chief Executive Officer", init: "HM", phone: "923006043913", desc: "Visionary leader with deep expertise in telecommunications and business operations. Humayo drives Yayp's global strategy and client partnerships with unmatched dedication." },
            { name: "Shabi Kazmi", role: "Co-Founder & Director", init: "SK", phone: "923355508463", desc: "Technology innovator and operations expert. Shabi oversees software delivery and BPO excellence, ensuring every client receives world-class service and technical solutions." }
          ].map(p => (
            <div key={p.name} className="card team-card">
              <div className="avatar-circle" style={{ fontSize: 24 }}>{p.init}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{p.name}</h3>
              <p style={{ color: "#00c6ff", fontSize: 13, marginBottom: 16, letterSpacing: .5 }}>{p.role}</p>
              <p style={{ color: "#6b7a8d", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{p.desc}</p>
              <button className="whatsapp-btn" style={{ margin: "0 auto" }} onClick={() => openWhatsApp(p.phone)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp: +{p.phone.replace("92", "92 ")}
              </button>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40 }}>Our Core <span className="gradient-text">Values</span></h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
          {[
            { icon: "🎯", title: "Results-Driven", desc: "Every engagement is measured by the impact we create for your business." },
            { icon: "🔐", title: "Trust & Integrity", desc: "Transparent pricing, honest communication, and zero compromise on ethics." },
            { icon: "🚀", title: "Innovation First", desc: "We continuously adopt cutting-edge technology to keep your business ahead." },
            { icon: "🤝", title: "Client Partnership", desc: "We don't just serve clients — we become an extension of your team." },
          ].map(v => (
            <div key={v.title} className="card" style={{ padding: 28, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{v.title}</h4>
              <p style={{ color: "#6b7a8d", fontSize: 13, lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ reviewIdx, setReviewIdx }) {
  return (
    <div style={{ padding: "120px 5vw 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#00c6ff", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Social Proof</p>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, marginBottom: 20 }}>Trusted by <span className="gradient-text">Businesses Globally</span></h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
            {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#f5a623", fontSize: 24 }}>{s}</span>)}
          </div>
          <p style={{ color: "#6b7a8d" }}>4.9/5 from over 200+ client reviews</p>
        </div>

        {/* Featured */}
        <div style={{ maxWidth: 700, margin: "0 auto 60px", position: "relative" }}>
          <div className="card review-card" style={{ padding: "40px 48px", minHeight: 260 }}>
            <div className="stars" style={{ fontSize: 20 }}>{"★".repeat(5)}</div>
            <p className="review-text" style={{ fontSize: 17 }}>"{REVIEWS[reviewIdx].text}"</p>
            <p className="reviewer-name">{REVIEWS[reviewIdx].name}</p>
            <p className="reviewer-role">{REVIEWS[reviewIdx].role}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setReviewIdx(i)} style={{ width: i === reviewIdx ? 28 : 8, height: 8, borderRadius: 4, background: i === reviewIdx ? "#00c6ff" : "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", transition: ".3s" }} />
            ))}
          </div>
        </div>

        {/* All reviews grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className="card" style={{ padding: 28, cursor: "pointer", border: reviewIdx === i ? "1px solid rgba(0,198,255,0.4)" : undefined }} onClick={() => setReviewIdx(i)}>
              <div className="stars">{"★".repeat(r.stars)}</div>
              <p style={{ color: "#8899aa", fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{r.text.slice(0, 120)}..."</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0064ff,#00c6ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{r.name[0]}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</p>
                  <p style={{ color: "#6b7a8d", fontSize: 11 }}>{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection({ contactForm, setContactForm, contactSent, sendContact, openWhatsApp, user }) {
  return (
    <div style={{ padding: "120px 5vw 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#00c6ff", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Get In Touch</p>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, marginBottom: 20 }}>Start Your <span className="gradient-text">Partnership</span></h2>
          <p style={{ color: "#6b7a8d", maxWidth: 520, margin: "0 auto", fontSize: 16 }}>Ready to transform your business? Our team is standing by to discuss your needs and craft the perfect solution.</p>
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* Form */}
          <div className="card" style={{ padding: 40 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Send a Message</h3>
            <p style={{ color: "#6b7a8d", fontSize: 14, marginBottom: 28 }}>
              {user ? `Signed in as ${user.name} — your message will be saved.` : "Sign in for faster response tracking."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <div className="floating-label">Your Name</div>
                <input className="input-field" placeholder="Full name" value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={{ position: "relative" }}>
                <div className="floating-label">Email Address</div>
                <input className="input-field" type="email" placeholder="your@email.com" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div style={{ position: "relative" }}>
                <div className="floating-label">Message</div>
                <textarea className="input-field" rows={5} placeholder="Tell us about your project..." value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
              {contactSent ? (
                <div style={{ background: "rgba(0,200,83,0.1)", border: "1px solid rgba(0,200,83,0.3)", borderRadius: 8, padding: 16, color: "#00c853", textAlign: "center", fontSize: 14 }}>
                  ✅ Message sent! We'll get back to you within 24 hours.
                </div>
              ) : (
                <button className="btn-primary" style={{ fontSize: 15, padding: 16 }} onClick={sendContact}>Send Message →</button>
              )}
            </div>
          </div>

          {/* Contact info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Direct Contact</h3>
              {[
                { name: "Humayo — CEO", phone: "923006043913", display: "+92 300 6043913" },
                { name: "Shabi Kazmi — Director", phone: "923355508463", display: "+92 335 5508463" }
              ].map(c => (
                <div key={c.name} style={{ marginBottom: 20 }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{c.name}</p>
                  <p style={{ color: "#6b7a8d", fontSize: 13, marginBottom: 10 }}>{c.display}</p>
                  <button className="whatsapp-btn" onClick={() => openWhatsApp(c.phone)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Now
                  </button>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Company Details</h3>
              {[
                { icon: "📍", label: "Headquarters", val: "Rawalpindi, Punjab, Pakistan" },
                { icon: "📧", label: "Email", val: "info@yaypcommunication.com" },
                { icon: "🕐", label: "Hours", val: "24/7 — Always Online" },
                { icon: "🌐", label: "Coverage", val: "Global — 12+ Countries" },
              ].map(d => (
                <div key={d.label} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18 }}>{d.icon}</span>
                  <div>
                    <p style={{ fontSize: 11, color: "#6b7a8d", letterSpacing: .5, textTransform: "uppercase", marginBottom: 2 }}>{d.label}</p>
                    <p style={{ fontSize: 14, color: "#e8edf5" }}>{d.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24, background: "linear-gradient(135deg,rgba(0,198,255,0.06),rgba(123,47,255,0.04))" }}>
              <p style={{ fontSize: 13, color: "#00c6ff", fontWeight: 600, marginBottom: 8 }}>⚡ Average Response Time</p>
              <p style={{ fontFamily: "Syne,sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{"< 2 Hours"}</p>
              <p style={{ color: "#6b7a8d", fontSize: 13 }}>During business hours. 24hr on weekends.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
