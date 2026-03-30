// API Tester Component - Tests all endpoints in the real-or-fake API
// Base URL: http://localhost:3006

import { useState, useEffect, useCallback, useRef } from 'react'
import './css/apitester.css'

const API_BASE = 'http://localhost:3006'

// ==================== REUSABLE API CALL FUNCTION ====================
const callApi = async (method, endpoint, body = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    }
    if (body) {
      options.body = JSON.stringify(body)
    }
    const res = await fetch(`${API_BASE}${endpoint}`, options)
    const data = await res.json()
    if (!res.ok) {
      return { data: null, error: data.error || `HTTP ${res.status}` }
    }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err.message || 'Request failed' }
  }
}

// ==================== MAIN COMPONENT ====================
function apiTester() {
  const [activeTab, setActiveTab] = useState('health')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  // Refs for scrolling
  const resultRef = useRef(null)
  const contentStartRef = useRef(null)

  // Form states - defined at component level to prevent re-render focus loss
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' })
  const [sentimentForm, setSentimentForm] = useState({ text: '' })
  const [batchTexts, setBatchTexts] = useState('')
  const [guardianSearchForm, setGuardianSearchForm] = useState({
    q: '', section: '', fromDate: '', toDate: '', page: '1', pageSize: '10'
  })
  const [articleId, setArticleId] = useState('')

  // RSS Feed forms
  const [rssSearchForm, setRssSearchForm] = useState({ q: '' })
  const [rssSourcesSelected, setRssSourcesSelected] = useState('')
  const [rssArticleId, setRssArticleId] = useState('')

  // Fake News Analysis forms
  const [fakeNewsForm, setFakeNewsForm] = useState({
    title: '',
    description: '',
    bodyText: '',
    link: '',
    source: '',
    byline: ''
  })
  const [compareArticles, setCompareArticles] = useState('')
  const [batchArticles, setBatchArticles] = useState('')

  // Auto-run health check on mount
  useEffect(() => {
    handleRequest('GET', '/api/health')
  }, [])

  // Reusable request handler with scroll to results
  const handleRequest = useCallback(async (method, endpoint, body = null) => {
    setLoading(true)
    setResponse(null)
    setError(null)

    const { data, error } = await callApi(method, endpoint, body)

    if (error) {
      setError(error)
    } else {
      setResponse(data)
    }
    setLoading(false)
    
    // Scroll to results after state update (allow time for rendering)
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, [])

  // ==================== RENDER ====================
  return (
    <div className="page-container">
      <div className="main-card">
        {/* Header */}
        <header className="header">
          <h1 className="title">API Tester</h1>
          <p className="subtitle">Test and explore the Real-or-Fake API endpoints</p>
          <div className="base-url-badge">{API_BASE}</div>
        </header>

        {/* Tab Navigation - Full width, scrollable on mobile */}
        <nav className="tabs" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResponse(null); setError(null) }}
              className={activeTab === tab.id ? 'tab active' : 'tab'}
              style={{
                borderTopColor: activeTab === tab.id ? tab.color : 'transparent',
                backgroundColor: activeTab === tab.id ? '#fff' : '#f8f9fa',
                color: activeTab === tab.id ? tab.color : '#6c757d'
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Hidden element to mark content start for scrolling reference */}
        <div ref={contentStartRef}></div>

        {/* Tab Content */}
        <main className="content">
          {activeTab === 'health' && (
            <HealthSection handleRequest={handleRequest} loading={loading} />
          )}
          {activeTab === 'auth' && (
            <AuthSection
              handleRequest={handleRequest}
              loading={loading}
              loginForm={loginForm}
              setLoginForm={setLoginForm}
              registerForm={registerForm}
              setRegisterForm={setRegisterForm}
            />
          )}
          {activeTab === 'sentiment' && (
            <SentimentSection
              handleRequest={handleRequest}
              loading={loading}
              sentimentForm={sentimentForm}
              setSentimentForm={setSentimentForm}
              batchTexts={batchTexts}
              setBatchTexts={setBatchTexts}
            />
          )}
          {activeTab === 'news' && (
            <NewsSection
              handleRequest={handleRequest}
              loading={loading}
              guardianSearchForm={guardianSearchForm}
              setGuardianSearchForm={setGuardianSearchForm}
              articleId={articleId}
              setArticleId={setArticleId}
            />
          )}
          {activeTab === 'rss' && (
            <RssSection
              handleRequest={handleRequest}
              loading={loading}
              rssSearchForm={rssSearchForm}
              setRssSearchForm={setRssSearchForm}
              rssSourcesSelected={rssSourcesSelected}
              setRssSourcesSelected={setRssSourcesSelected}
              rssArticleId={rssArticleId}
              setRssArticleId={setRssArticleId}
            />
          )}
          {activeTab === 'fakenews' && (
            <FakeNewsSection
              handleRequest={handleRequest}
              loading={loading}
              fakeNewsForm={fakeNewsForm}
              setFakeNewsForm={setFakeNewsForm}
              compareArticles={compareArticles}
              setCompareArticles={setCompareArticles}
              batchArticles={batchArticles}
              setBatchArticles={setBatchArticles}
            />
          )}
        </main>

        {/* Response / Error Display with ref for scrolling */}
        {(loading || response || error) && (
          <div ref={resultRef} className="result-section">
            {loading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Processing your request...</p>
              </div>
            )}
            {error && (
              <div className="error-box">
                <strong>⚠️ Error</strong>
                <p>{error}</p>
              </div>
            )}
            {response && (
              <div className="success-box">
                <strong>✓ Response</strong>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* API Documentation */}
        <footer className="doc-section">
          <h3 className="doc-title">API Quick Reference</h3>
          <div className="doc-grid">
            <DocColumn
              title="Health"
              color="#27ae60"
              endpoints={[{ method: 'GET', path: '/api/health' }]}
            />
            <DocColumn
              title="Authentication"
              color="#3498db"
              endpoints={[
                { method: 'POST', path: '/api/auth/register' },
                { method: 'POST', path: '/api/auth/login' }
              ]}
            />
            <DocColumn
              title="Sentiment"
              color="#9b59b6"
              endpoints={[
                { method: 'POST', path: '/api/sentiment/analyze' },
                { method: 'POST', path: '/api/sentiment/analyze-batch' },
                { method: 'POST', path: '/api/sentiment/aggregate' }
              ]}
            />
            <DocColumn
              title="News (Guardian)"
              color="#e67e22"
              endpoints={[
                { method: 'GET', path: '/api/news/guardian/search' },
                { method: 'GET', path: '/api/news/guardian/search-with-sentiment' },
                { method: 'GET', path: '/api/news/guardian/search-with-analysis' },
                { method: 'GET', path: '/api/news/guardian/latest/:section' },
                { method: 'GET', path: '/api/news/guardian/article/:id' },
                { method: 'GET', path: '/api/news/guardian/sections' }
              ]}
            />
            <DocColumn
              title="RSS Feeds"
              color="#2ecc71"
              endpoints={[
                { method: 'GET', path: '/api/news/rss/search' },
                { method: 'GET', path: '/api/news/rss/feeds' },
                { method: 'GET', path: '/api/news/rss/sources' },
                { method: 'GET', path: '/api/news/rss/article/:id' }
              ]}
            />
            <DocColumn
              title="Fake News Analysis"
              color="#e74c3c"
              endpoints={[
                { method: 'POST', path: '/api/news/analyze/fake-score' },
                { method: 'POST', path: '/api/news/analyze/compare' },
                { method: 'POST', path: '/api/news/analyze/batch' }
              ]}
            />
          </div>
        </footer>
      </div>
    </div>
  )
}

// ==================== RSS SECTION COMPONENT ====================
function RssSection({ handleRequest, loading, rssSearchForm, setRssSearchForm, rssSourcesSelected, setRssSourcesSelected, rssArticleId, setRssArticleId }) {
  const [availableSources, setAvailableSources] = useState([])
  const [loadingSources, setLoadingSources] = useState(false)

  // Fetch available RSS sources on mount
  useEffect(() => {
    const fetchSources = async () => {
      setLoadingSources(true)
      const { data, error } = await callApi('GET', '/api/news/rss/sources')
      if (!error && data?.data) {
        setAvailableSources(data.data)
      }
      setLoadingSources(false)
    }
    fetchSources()
  }, [])

  return (
    <>
      <section className="section">
        <h2 className="section-title"><b>📡 Get Available RSS Sources</b></h2>
        <p className="section-desc">List all available RSS feed sources with their credibility scores.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/rss/sources</div>

        <button
          onClick={() => handleRequest('GET', '/api/news/rss/sources')}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Fetching...' : 'Get RSS Sources'}
        </button>

        {availableSources.length > 0 && (
          <div className="sources-preview">
            <h4>Available Sources ({availableSources.length})</h4>
            <div className="source-grid">
              {availableSources.slice(0, 6).map(source => (
                <div key={source.key} className="source-card">
                  <strong>{source.name}</strong>
                  <span className={`credibility-badge ${source.credibility >= 90 ? 'high' : source.credibility >= 70 ? 'medium' : 'low'}`}>
                    {source.credibility}%
                  </span>
                  <span className="country-badge">{source.country}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title"><b>🔍 Search RSS Feeds</b></h2>
        <p className="section-desc">Search across all RSS feeds for articles matching your keyword.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/rss/search</div>

        <div className="form-group">
          <label className="label">Search Query *</label>
          <input
            type="text"
            placeholder="e.g., technology, climate, AI"
            value={rssSearchForm.q}
            onChange={(e) => setRssSearchForm({ ...rssSearchForm, q: e.target.value })}
            className="input"
          />
        </div>

        <button
          onClick={() => {
            const params = new URLSearchParams({ q: rssSearchForm.q })
            handleRequest('GET', `/api/news/rss/search?${params}`)
          }}
          disabled={loading || !rssSearchForm.q}
          className="btn-primary"
        >
          {loading ? 'Searching...' : 'Search RSS Feeds'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>📰 Get RSS Feeds by Sources</b></h2>
        <p className="section-desc">Get articles from specific RSS sources. Leave empty to get all sources.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/rss/feeds</div>

        <div className="form-group">
          <label className="label">Source Keys (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g., bbc, reuters, ap_news"
            value={rssSourcesSelected}
            onChange={(e) => setRssSourcesSelected(e.target.value)}
            className="input"
          />
          <small className="help-text">
            Available: bbc, bbc_world, reuters, ap_news, npr, dw
          </small>
        </div>

        <button
          onClick={() => {
            const params = rssSourcesSelected ? `?sources=${rssSourcesSelected}` : ''
            handleRequest('GET', `/api/news/rss/feeds${params}`)
          }}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Fetching...' : 'Get RSS Feeds'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>📄 Get RSS Article by ID</b></h2>
        <p className="section-desc">Fetch a specific RSS article by its unique ID.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/rss/article/:id</div>

        <div className="form-group">
          <label className="label">Article ID</label>
          <input
            type="text"
            placeholder="e.g., bbc-abc123def456"
            value={rssArticleId}
            onChange={(e) => setRssArticleId(e.target.value)}
            className="input"
          />
          <small className="help-text">
            Article IDs can be found in the search or feeds response
          </small>
        </div>

        <button
          onClick={() => handleRequest('GET', `/api/news/rss/article/${rssArticleId}`)}
          disabled={loading || !rssArticleId}
          className="btn-primary"
        >
          {loading ? 'Fetching...' : 'Get Article'}
        </button>
      </section>
    </>
  )
}

// ==================== FAKE NEWS ANALYSIS SECTION ====================
function FakeNewsSection({ handleRequest, loading, fakeNewsForm, setFakeNewsForm, compareArticles, setCompareArticles, batchArticles, setBatchArticles }) {
  return (
    <>
      <section className="section">
        <h2 className="section-title"><b>🔍 Analyze Single Article (Fake News Score)</b></h2>
        <p className="section-desc">Analyze a single article for fake news probability based on multiple factors.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/news/analyze/fake-score</div>

        <div className="form-group">
          <label className="label">Title *</label>
          <input
            type="text"
            placeholder="Article title"
            value={fakeNewsForm.title}
            onChange={(e) => setFakeNewsForm({ ...fakeNewsForm, title: e.target.value })}
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="label">Description / Summary</label>
          <textarea
            placeholder="Article description or summary"
            value={fakeNewsForm.description}
            onChange={(e) => setFakeNewsForm({ ...fakeNewsForm, description: e.target.value })}
            rows={3}
            className="textarea"
          />
        </div>

        <div className="form-group">
          <label className="label">Body Text</label>
          <textarea
            placeholder="Full article text (optional but improves accuracy)"
            value={fakeNewsForm.bodyText}
            onChange={(e) => setFakeNewsForm({ ...fakeNewsForm, bodyText: e.target.value })}
            rows={5}
            className="textarea"
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="label">Article URL / Link</label>
            <input
              type="text"
              placeholder="https://example.com/article"
              value={fakeNewsForm.link}
              onChange={(e) => setFakeNewsForm({ ...fakeNewsForm, link: e.target.value })}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Source / Author</label>
            <input
              type="text"
              placeholder="Source name or byline"
              value={fakeNewsForm.source}
              onChange={(e) => setFakeNewsForm({ ...fakeNewsForm, source: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Byline (Author)</label>
          <input
            type="text"
            placeholder="Author name"
            value={fakeNewsForm.byline}
            onChange={(e) => setFakeNewsForm({ ...fakeNewsForm, byline: e.target.value })}
            className="input"
          />
        </div>

        <button
          onClick={() => handleRequest('POST', '/api/news/analyze/fake-score', {
            title: fakeNewsForm.title,
            description: fakeNewsForm.description,
            bodyText: fakeNewsForm.bodyText,
            link: fakeNewsForm.link,
            source: fakeNewsForm.source,
            byline: fakeNewsForm.byline
          })}
          disabled={loading || !fakeNewsForm.title}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Calculate Fake News Score'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>🔄 Compare Multiple Articles</b></h2>
        <p className="section-desc">Compare multiple articles to verify facts and find consensus.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/news/analyze/compare</div>

        <div className="form-group">
          <label className="label">Articles (JSON format)</label>
          <textarea
            placeholder='[
  {"title": "Breaking News: Important Event", "source": "BBC", "description": "..."},
  {"title": "Breaking News: Important Event", "source": "Reuters", "description": "..."}
]'
            value={compareArticles}
            onChange={(e) => setCompareArticles(e.target.value)}
            rows={8}
            className="textarea"
          />
          <small className="help-text">
            Enter articles as JSON array. Each article should have at least a title.
          </small>
        </div>

        <button
          onClick={() => {
            try {
              const articles = JSON.parse(compareArticles)
              handleRequest('POST', '/api/news/analyze/compare', { articles })
            } catch (e) {
              alert('Invalid JSON format. Please check your input.')
            }
          }}
          disabled={loading || !compareArticles}
          className="btn-primary"
        >
          {loading ? 'Comparing...' : 'Compare Articles'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>📊 Batch Analyze Articles</b></h2>
        <p className="section-desc">Analyze multiple articles individually and get scores for each.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/news/analyze/batch</div>

        <div className="form-group">
          <label className="label">Articles (JSON format)</label>
          <textarea
            placeholder='[
  {"title": "Amazing discovery that will shock you!", "source": "Suspicious Site"},
  {"title": "Scientists find new treatment for disease", "source": "Science Daily"},
  {"title": "Government hides shocking truth", "source": "Conspiracy News"}
]'
            value={batchArticles}
            onChange={(e) => setBatchArticles(e.target.value)}
            rows={8}
            className="textarea"
          />
          <small className="help-text">
            Enter articles as JSON array. Each article will receive an individual fake news score.
          </small>
        </div>

        <button
          onClick={() => {
            try {
              const articles = JSON.parse(batchArticles)
              handleRequest('POST', '/api/news/analyze/batch', { articles })
            } catch (e) {
              alert('Invalid JSON format. Please check your input.')
            }
          }}
          disabled={loading || !batchArticles}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Batch Analyze'}
        </button>
      </section>

      {/* Example Articles Section */}
      <section className="section example-section">
        <h2 className="section-title"><b>📝 Example Articles to Try</b></h2>
        <div className="example-grid">
          <div className="example-card">
            <h4>Suspicious Article Example</h4>
            <pre>{`{
  "title": "SHOCKING: Government Hides Miracle Cure for Cancer!",
  "description": "Doctors hate this one weird trick that cures all diseases",
  "source": "NaturalHealthDaily.com",
  "byline": ""
}`}</pre>
            <button
              onClick={() => {
                setFakeNewsForm({
                  title: "SHOCKING: Government Hides Miracle Cure for Cancer!",
                  description: "Doctors hate this one weird trick that cures all diseases",
                  bodyText: "",
                  link: "https://naturalhealthdaily.com/miracle-cure",
                  source: "NaturalHealthDaily.com",
                  byline: ""
                })
              }}
              className="btn-example"
            >
              Load Example
            </button>
          </div>

          <div className="example-card">
            <h4>Credible Article Example</h4>
            <pre>{`{
  "title": "Scientists discover promising new treatment for cancer",
  "description": "Researchers at Stanford University have found a new compound...",
  "source": "Reuters",
  "byline": "Dr. Sarah Johnson"
}`}</pre>
            <button
              onClick={() => {
                setFakeNewsForm({
                  title: "Scientists discover promising new treatment for cancer",
                  description: "Researchers at Stanford University have found a new compound that shows promise in early-stage clinical trials for treating pancreatic cancer.",
                  bodyText: "The study, published in Nature Medicine, involved 150 patients...",
                  link: "https://reuters.com/science/cancer-treatment",
                  source: "Reuters",
                  byline: "Dr. Sarah Johnson"
                })
              }}
              className="btn-example"
            >
              Load Example
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

// ==================== EXISTING SUB-COMPONENTS ====================

function HealthSection({ handleRequest, loading }) {
  return (
    <section className="section">
      <h2 className="section-title">🏥 Health Check</h2>
      <p className="section-desc">Verify that the API server and database connection are working properly.</p>
      <div className="endpoint-badge"><span className="badge-get">GET</span> /api/health</div>
      <button
        onClick={() => handleRequest('GET', '/api/health')}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Checking...' : 'Run Health Check'}
      </button>
    </section>
  )
}

function AuthSection({ handleRequest, loading, loginForm, setLoginForm, registerForm, setRegisterForm }) {
  return (
    <>
      <section className="section">
        <h2 className="section-title"><b>Register New User</b></h2>
        <p className="section-desc">Create a new user account with username, email, and password.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/auth/register</div>

        <div className="form-group">
          <label className="label">Username</label>
          <input
            type="text"
            placeholder="johndoe"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="label">Password (min 8 characters)</label>
          <input
            type="password"
            placeholder="••••••••"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            className="input"
          />
        </div>

        <button
          onClick={() => handleRequest('POST', '/api/auth/register', registerForm)}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Registering...' : 'Register User'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Login User</b></h2>
        <p className="section-desc">Authenticate with email and password to receive a JWT token.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/auth/login</div>

        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            className="input"
          />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className="input"
          />
        </div>

        <button
          onClick={() => handleRequest('POST', '/api/auth/login', loginForm)}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </section>
    </>
  )
}

function SentimentSection({ handleRequest, loading, sentimentForm, setSentimentForm, batchTexts, setBatchTexts }) {
  return (
    <>
      <section className="section">
        <h2 className="section-title"><b>Analyze Single Text</b></h2>
        <p className="section-desc">Analyze the sentiment of a single piece of text.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/sentiment/analyze</div>

        <div className="form-group">
          <label className="label">Text to analyze</label>
          <textarea
            placeholder="Enter text here, e.g., 'I love this product! It works amazing.'"
            value={sentimentForm.text}
            onChange={(e) => setSentimentForm({ ...sentimentForm, text: e.target.value })}
            rows={4}
            className="textarea"
          />
        </div>

        <button
          onClick={() => handleRequest('POST', '/api/sentiment/analyze', sentimentForm)}
          disabled={loading || !sentimentForm.text}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Batch Sentiment Analysis</b></h2>
        <p className="section-desc">Analyze multiple texts at once. Enter each text on a new line.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/sentiment/analyze-batch</div>

        <div className="form-group">
          <label className="label">Texts (one per line)</label>
          <textarea
            placeholder="I love this!&#10;This is terrible.&#10;Pretty good overall."
            value={batchTexts}
            onChange={(e) => setBatchTexts(e.target.value)}
            rows={6}
            className="textarea"
          />
        </div>

        <button
          onClick={() => handleRequest('POST', '/api/sentiment/analyze-batch', {
            texts: batchTexts.split('\n').filter(t => t.trim())
          })}
          disabled={loading || !batchTexts.trim()}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze All Texts'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Aggregate Sentiment Stats</b></h2>
        <p className="section-desc">Get aggregate statistics including distribution and percentages.</p>
        <div className="endpoint-badge"><span className="badge-post">POST</span> /api/sentiment/aggregate</div>

        <div className="form-group">
          <label className="label">Texts (one per line)</label>
          <textarea
            placeholder="Great product!&#10;Not worth the money.&#10;It's okay, nothing special."
            value={batchTexts}
            onChange={(e) => setBatchTexts(e.target.value)}
            rows={6}
            className="textarea"
          />
        </div>

        <button
          onClick={() => handleRequest('POST', '/api/sentiment/aggregate', {
            texts: batchTexts.split('\n').filter(t => t.trim())
          })}
          disabled={loading || !batchTexts.trim()}
          className="btn-primary"
        >
          {loading ? 'Calculating...' : 'Get Aggregate Stats'}
        </button>
      </section>
    </>
  )
}

function NewsSection({ handleRequest, loading, guardianSearchForm, setGuardianSearchForm, articleId, setArticleId }) {
  return (
    <>
      <section className="section">
        <h2 className="section-title"><b>Search Guardian Articles</b></h2>
        <p className="section-desc">Search articles from The Guardian API by keyword.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/guardian/search</div>

        <div className="form-grid">
          <div className="form-group">
            <label className="label">Search Query *</label>
            <input
              type="text"
              placeholder="e.g., artificial intelligence"
              value={guardianSearchForm.q}
              onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, q: e.target.value })}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Section</label>
            <select
              value={guardianSearchForm.section}
              onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, section: e.target.value })}
              className="select"
            >
              <option value="">All Sections</option>
              <option value="technology">Technology</option>
              <option value="politics">Politics</option>
              <option value="business">Business</option>
              <option value="science">Science</option>
              <option value="sport">Sport</option>
              <option value="world">World News</option>
              <option value="uk-news">UK News</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="label">From Date</label>
            <input
              type="date"
              value={guardianSearchForm.fromDate}
              onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, fromDate: e.target.value })}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">To Date</label>
            <input
              type="date"
              value={guardianSearchForm.toDate}
              onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, toDate: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="label">Page</label>
            <input
              type="number"
              min="1"
              value={guardianSearchForm.page}
              onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, page: e.target.value })}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Page Size</label>
            <input
              type="number"
              min="1"
              max="50"
              value={guardianSearchForm.pageSize}
              onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, pageSize: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <button
          onClick={() => {
            const params = new URLSearchParams({
              q: guardianSearchForm.q,
              page: guardianSearchForm.page,
              pageSize: guardianSearchForm.pageSize
            })
            if (guardianSearchForm.section) params.append('section', guardianSearchForm.section)
            if (guardianSearchForm.fromDate) params.append('from-date', guardianSearchForm.fromDate)
            if (guardianSearchForm.toDate) params.append('to-date', guardianSearchForm.toDate)
            handleRequest('GET', `/api/news/guardian/search?${params}`)
          }}
          disabled={loading || !guardianSearchForm.q}
          className="btn-primary"
        >
          {loading ? 'Searching...' : 'Search Articles'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Search with Sentiment</b></h2>
        <p className="section-desc">Search articles and automatically analyze sentiment for each result.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/guardian/search-with-sentiment</div>

        <div className="form-group">
          <label className="label">Search Query</label>
          <input
            type="text"
            placeholder="e.g., climate change"
            value={guardianSearchForm.q}
            onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, q: e.target.value })}
            className="input"
          />
        </div>

        <button
          onClick={() => {
            const params = new URLSearchParams({ q: guardianSearchForm.q, pageSize: '5' })
            handleRequest('GET', `/api/news/guardian/search-with-sentiment?${params}`)
          }}
          disabled={loading || !guardianSearchForm.q}
          className="btn-primary"
        >
          {loading ? 'Searching...' : 'Search + Analyze'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Search with Full Analysis</b></h2>
        <p className="section-desc">Search articles and get both sentiment analysis AND fake news scoring.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/guardian/search-with-analysis</div>

        <div className="form-group">
          <label className="label">Search Query</label>
          <input
            type="text"
            placeholder="e.g., AI breakthrough"
            value={guardianSearchForm.q}
            onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, q: e.target.value })}
            className="input"
          />
        </div>

        <button
          onClick={() => {
            const params = new URLSearchParams({ q: guardianSearchForm.q, pageSize: '5' })
            handleRequest('GET', `/api/news/guardian/search-with-analysis?${params}`)
          }}
          disabled={loading || !guardianSearchForm.q}
          className="btn-primary"
        >
          {loading ? 'Searching...' : 'Search + Full Analysis'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Get Article by ID</b></h2>
        <p className="section-desc">Fetch a specific Guardian article with sentiment analysis.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/guardian/article/:id</div>

        <div className="form-group">
          <label className="label">Article ID</label>
          <input
            type="text"
            placeholder="e.g., technology/2024/jan/15/ai-revolution"
            value={articleId}
            onChange={(e) => setArticleId(e.target.value)}
            className="input"
          />
        </div>

        <button
          onClick={() => handleRequest('GET', `/api/news/guardian/article/${articleId}`)}
          disabled={loading || !articleId}
          className="btn-primary"
        >
          {loading ? 'Fetching...' : 'Get Article'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Get Latest by Section</b></h2>
        <p className="section-desc">Get the most recent articles from a specific section.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/guardian/latest/:section</div>

        <div className="form-group">
          <label className="label">Select Section</label>
          <select
            value={guardianSearchForm.section}
            onChange={(e) => setGuardianSearchForm({ ...guardianSearchForm, section: e.target.value })}
            className="select"
          >
            <option value="">Choose a section...</option>
            <option value="technology">Technology</option>
            <option value="politics">Politics</option>
            <option value="business">Business</option>
            <option value="science">Science</option>
            <option value="sport">Sport</option>
            <option value="world">World News</option>
            <option value="uk-news">UK News</option>
            <option value="environment">Environment</option>
          </select>
        </div>

        <button
          onClick={() => handleRequest('GET', `/api/news/guardian/latest/${guardianSearchForm.section}?pageSize=10`)}
          disabled={loading || !guardianSearchForm.section}
          className="btn-primary"
        >
          {loading ? 'Fetching...' : 'Get Latest Articles'}
        </button>
      </section>

      <section className="section">
        <h2 className="section-title"><b>Get Available Sections</b></h2>
        <p className="section-desc">List all available sections from The Guardian API.</p>
        <div className="endpoint-badge"><span className="badge-get">GET</span> /api/news/guardian/sections</div>

        <button
          onClick={() => handleRequest('GET', '/api/news/guardian/sections')}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Fetching...' : 'Get All Sections'}
        </button>
      </section>
    </>
  )
}

function DocColumn({ title, color, endpoints }) {
  return (
    <div className="doc-column">
      <h4 className="doc-column-title" style={{ color }}>{title}</h4>
      <ul className="doc-list">
        {endpoints.map((ep, i) => (
          <li key={i} className="doc-item">
            <span className={ep.method === 'GET' ? 'badge-get' : 'badge-post'}>{ep.method}</span>
            {ep.path}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ==================== TABS CONFIG ====================
const tabs = [
  { id: 'health', label: 'Health', icon: '🏥', color: '#27ae60' },
  { id: 'auth', label: 'Auth', icon: '👤', color: '#3498db' },
  { id: 'sentiment', label: 'Sentiment', icon: '😊', color: '#9b59b6' },
  { id: 'news', label: 'Guardian', icon: '📰', color: '#e67e22' },
  { id: 'rss', label: 'RSS Feeds', icon: '📡', color: '#2ecc71' },
  { id: 'fakenews', label: 'Fake News', icon: '🔍', color: '#e74c3c' }
]

export default apiTester