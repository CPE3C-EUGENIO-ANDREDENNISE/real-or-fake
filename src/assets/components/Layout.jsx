import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/layout.css";
import Footer from "./Footer";

export default function Layout({ children, hideSidebar = false, hideTopbar = false, hideFooter = false }) {
  const canvasRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const COLORS = ['#38bdf8', '#818cf8', '#6366f1', '#22d3ee', '#a78bfa'];
    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      baseAlpha: Math.random() * 0.28 + 0.10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.3 + 0.08),
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.006,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.twinkle += p.twinkleSpeed;
        const a = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.twinkle));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = a;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    {
      to: "/",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      to: "/about",
      label: "About",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    {
      to: "/contacts",
      label: "Contacts",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
  ];
  const logoIcon = (
    <div className="logo-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    </div>
  );

  return (
    <div className="layout">
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* MOBILE TOPBAR */}
      {!hideTopbar && (
        <div className="topbar">
          <Link to="/" className="logo-wrap">
            {logoIcon}
            <span className="logo-text">VeriFake</span>
          </Link>
          <div className="topbar-right">
            <button className="btn-login" onClick={() => navigate('/login')}>Log in</button>
            <button className="btn-signup" onClick={() => navigate('/signup')}>Sign up</button>
          </div>
          <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      {/* BODY ROW */}
      <div className="layout-body">
        {/* SIDEBAR */}
        {!hideSidebar && (
          <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
            <Link to="/" className="logo-wrap">
              {logoIcon}
              <span className="logo-text">VeriFake</span>
            </Link>
            <nav>
              {navLinks.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`nav-item ${location.pathname === to ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* PAGE CONTENT */}
        <div className="page-content">
          {!hideTopbar && (
            <header className="site-header">
              <div className="header-right">
                <button className="btn-login" onClick={() => navigate('/login')}>Log in</button>
                <button className="btn-signup" onClick={() => navigate('/signup')}>Sign up</button>
              </div>
            </header>
          )}
          <main className="page-main">
            {children}
            {!hideFooter && <Footer />}
          </main>
        </div>

      </div>
    </div>
  );
}
