import { useState } from "react";
import Layout from "../assets/components/Layout";
import "../styles/contact.css";
import emailjs from '@emailjs/browser';


export default function ContactPage() {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [errors, setErrors] = useState({ email: '', message: '' });
  const [sent, setSent] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = () => {
    const newErrors = { email: '', message: '' };
    let hasError = false;

    if (!formData.email) {
      newErrors.email = 'Email is required.';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g. you@example.com).';
      hasError = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty.';
      hasError = true;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message is too short. Please write at least 10 characters.';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    emailjs.send(
      'YOUR_SERVICE_ID',     // from EmailJS dashboard
      'YOUR_TEMPLATE_ID',    // from EmailJS dashboard
      {
        from_email: formData.email,
        message: formData.message,
        to_email: 'verifake@gmail.com',
      },
      'YOUR_PUBLIC_KEY'      // from EmailJS dashboard
    ).then(() => {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setFormData({ email: '', message: '' });
      setErrors({ email: '', message: '' });
    }).catch(() => {
      alert('Failed to send message. Please try again.');
    });
  };

  return (
    <Layout>
      <main className="contact-content">

        {/* HERO */}
        <div className="contact-hero">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">Get in touch with our team</p>
        </div>

        <div className="contact-body">

          {/* LEFT — INFO */}
          <div className="contact-info">
            <div className="contact-info-card">
              <p className="contact-tagline">We'd love to hear from you!</p>

              <div className="contact-info-group">
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-info-label">General Inquiries</p>
                    <a href="mailto:verifake@gmail.com" className="contact-info-value">verifake@gmail.com</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-info-label">Technical Support</p>
                    <a href="mailto:supportverifake@gmail.com" className="contact-info-value">supportverifake@gmail.com</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-info-label">Business & Partnerships</p>
                    <a href="mailto:busverifake@gmail.com" className="contact-info-value">busverifake@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="contact-divider" />

              <div className="contact-social">
                <p className="contact-info-label">Follow us on social media</p>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                    @VeriFake
                  </a>
                  <a href="#" className="social-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    VeriFake
                  </a>
                  <a href="#" className="social-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                    </svg>
                    verifake
                  </a>
                </div>
              </div>

              <div className="contact-divider" />

              <div className="contact-response">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <div>
                  <p className="contact-info-label">Response Time</p>
                  <p className="contact-info-value">We typically respond within 24–48 hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div className="contact-form-wrap">
            <div className="contact-form-card">
              <h2 className="form-title">Send us a message</h2>
              <p className="form-subtitle">Fill out the form and we'll get back to you shortly.</p>

              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="denver@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                />
                {errors.email && (
                  <div className="error-msg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                  placeholder="Write your message here..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                />
                {errors.message && (
                  <div className="error-msg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.message}
                  </div>
                )}
              </div>
            </div>

            <button
              className={`form-send-btn ${sent ? 'sent' : ''}`}
              onClick={handleSend}
            >
              {sent ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Message Sent!
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </Layout >
  );
}
