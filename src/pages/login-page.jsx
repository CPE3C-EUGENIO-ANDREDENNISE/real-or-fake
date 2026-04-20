import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../assets/components/Layout";
import "../styles/auth.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3006';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  // State for 2FA flow
  const [authRequired, setAuthRequired] = useState(null); 

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Handler for standard login submission
  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.email.trim() || !form.password.trim()) {
      setStatus({ type: "error", message: "Please enter both email and password." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if 2FA is required (HTTP 403)
        if (response.status === 403 && data.error === '2FA required') {
          setAuthRequired({ 
            email: form.email.trim().toLowerCase(), 
            needs2fa: true, 
            user: { id: data.user?.id, username: data.user?.username, email: data.user?.email, role: data.user?.role }
          });
          return;
        }
        throw new Error(data.error || "Login failed. Please try again.");
      }

      // Standard login successful
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      setStatus({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(() => navigate('/landing'), 900);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handler for 2FA code submission
  const handleTwoFactorLogin = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.mfaCode.trim()) {
      setStatus({ type: "error", message: "Please enter the verification code." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authRequired.email,
          password: form.password, // Password is still needed for the initial request validation
          mfaCode: form.mfaCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "2FA login failed. Please try again.");
      }

      // 2FA successful
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      setStatus({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(() => navigate('/landing'), 900);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Render Login Form or 2FA Code Form
  const renderLoginOrTwoFaForm = () => {
    if (authRequired?.needs2fa) {
      return (
        <form className="auth-form" onSubmit={handleTwoFactorLogin}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="mfaCode">Verification Code</label>
            <input
              id="mfaCode"
              name="mfaCode"
              type="text"
              className="auth-input"
              placeholder="Enter 6-digit code"
              value={form.mfaCode}
              onChange={handleChange}
              required
            />
          </div >
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      );
    } else {
      return (
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div >

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div >

          {status.message && (
            <div className={`auth-alert ${status.type}`}>{status.message}</div >
          )}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      );
    }
  };


  return (
    <Layout hideSidebar hideTopbar hideFooter>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Login</h1>
            <p className="auth-text">Access your VeriFake account and continue verifying news.</p>
          </div >

          {renderLoginOrTwoFaForm()}
          
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div >
      </div >
    </Layout>
  );
}