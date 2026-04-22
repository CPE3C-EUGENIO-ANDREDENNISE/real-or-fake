import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/resource-layout.css";
import logo from "../../assets/images/logo.png";

export default function ResourcesLayout({ children }) {
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize); };
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contacts", label: "Contacts" },
  ];

  return (
    <div className="public-layout">
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* HEADER */}
      <header className="public-nav">
        <Link to="/" className="public-nav-logo">
          <img src={logo} alt="VeriFake" className="public-logo-img" />
          <span className="public-logo-text">VeriFake</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="public-nav-links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`public-nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-spacer" />

        <div className="public-nav-btns">
          <button className="btn-login" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-signup" onClick={() => navigate('/signup')}>Sign up</button>
        </div>

        {/* HAMBURGER */}
        <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

      {/* MOBILE SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="public-nav-logo sidebar-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="VeriFake" className="public-logo-img" />
          <span className="public-logo-text">VeriFake</span>
        </Link>
        <nav>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-item ${location.pathname === to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-auth">
          <button className="btn-login" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Log in</button>
          <button className="btn-signup" onClick={() => { navigate('/signup'); setMenuOpen(false); }}>Sign up</button>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <div className="public-content">
        {children}
      </div>
    </div>
  );
}
