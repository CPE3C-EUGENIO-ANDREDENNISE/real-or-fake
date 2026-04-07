import { useState, useEffect } from "react";
import UserLayout from "../assets/components/UserLayout";
import "../styles/landing.css";

export default function LandingPage() {
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('link');

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.search-wrapper')) setShowOptions(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <UserLayout>
      <main className="landing-content">

        {/* HERO */}
        <div className="landing-hero">
          <h1 className="landing-title">What would you like to verify today?</h1>
          <p className="landing-subtitle">Enter a claim, paste a link, or upload an image</p>
        </div>

        {/* SEARCH */}
        <div className="search-wrapper">
          <div className="search-box">
            <button className="plus-btn" onClick={() => setShowOptions(!showOptions)}>+</button>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search the truth behind the headlines..." />
            <button className="check-btn">Check</button>
          </div>

          {showOptions && (
            <div className="check-dropdown">
              <div className="check-tabs">
                <button
                  className={`check-tab ${activeTab === 'link' ? 'active' : ''}`}
                  onClick={() => setActiveTab('link')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                  Link
                </button>
                <button
                  className={`check-tab ${activeTab === 'image' ? 'active' : ''}`}
                  onClick={() => setActiveTab('image')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Image
                </button>
              </div>

              {activeTab === 'link' && (
                <div className="check-tab-content">
                  <label>News Article URL</label>
                  <input type="url" placeholder="https://example.com/news" className="check-url-input"/>
                  <button className="verify-btn">Verify Link</button>
                </div>
              )}

              {activeTab === 'image' && (
                <div className="check-tab-content">
                  <div className="upload-area">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                    </svg>
                    <p>Drag & drop an image</p>
                    <span>or</span>
                    <button className="browse-btn">Browse Files</button>
                    <small>JPG, PNG, GIF, WebP</small>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PLACEHOLDER for Your Activity + Recent Checks */}
        <div className="landing-placeholder">
          <div className="placeholder-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3>No checks yet</h3>
          <p>Your activity and recent checks will appear here once you start verifying claims.</p>
        </div>

      </main>
    </UserLayout>
  );
}
