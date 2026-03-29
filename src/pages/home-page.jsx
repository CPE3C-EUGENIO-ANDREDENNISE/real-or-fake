import { useState, useEffect } from "react";
import Layout from "../assets/components/Layout";
import "../styles/homePage.css";

export default function HomePage() {
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('link');

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.search-wrapper')) {
        setShowOptions(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <Layout>
      <main className="content">

        <h1>Search the truth behind the headlines</h1>
        <p className="subtitle">
          News fact-checking that cuts through misinformation
        </p>

        {/* SEARCH */}
        <div className="search-wrapper">
          <div className="search-box">
            <div className="plus-btn" onClick={() => setShowOptions(!showOptions)}>
              +
            </div>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input placeholder="Search the truth behind the headlines..." />
            <button className="check-btn">Check</button>
          </div>

          {/* DROPDOWN */}
          {showOptions && (
            <div className="check-dropdown">
              {/* TABS */}
              <div className="check-tabs">
                <button
                  className={`check-tab ${activeTab === 'link' ? 'active' : ''}`}
                  onClick={() => setActiveTab('link')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  Link
                </button>
                <button
                  className={`check-tab ${activeTab === 'image' ? 'active' : ''}`}
                  onClick={() => setActiveTab('image')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Image
                </button>
              </div>

              {/* LINK TAB */}
              {activeTab === 'link' && (
                <div className="check-tab-content">
                  <label>News Article URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/news"
                    className="check-url-input"
                  />
                  <button className="verify-btn">Verify Link</button>
                </div>
              )}

              {/* IMAGE TAB */}
              {activeTab === 'image' && (
                <div className="check-tab-content">
                  <div className="upload-area">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
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

        {/* STATS */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <div className="stat-label">
              <h3>Multi-Source Verification</h3>
              <p>Check all the sources</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>
            <div className="stat-label">
              <h3>Real-Time Alerts</h3>
              <p>Get notified of breaking news</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div className="stat-label">
              <h3>95% Accuracy Rate</h3>
              <p>Reliable fact-checking results</p>
            </div>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className="categories">
          <span className="active">All</span>
          <span>Politics</span>
          <span>Health</span>
          <span>Science</span>
          <span>Technology</span>
          <span>Climate</span>
          <span>Economy</span>
          <span>Viral</span>
          <span>Entertainment</span>
        </div>

      </main>
    </Layout>
  );
}
