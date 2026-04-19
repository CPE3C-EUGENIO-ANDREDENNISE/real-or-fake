import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserLayout from '../assets/components/UserLayout';
import '../styles/results.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3006';

function ExternalLinkIcon({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'text';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sources');
  const navigate = useNavigate();

  // Update verdict in database after results load
  const updateVerdict = async (verdict) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/checks/update-verdict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query: q, verdict })
      });
    } catch (err) {
      console.error('Failed to update verdict:', err);
    }
  };

  function mapRiskToVerdict(risk) {
    if (!risk) return 'mixed';
    const r = risk.toUpperCase();
    if (r === 'LOW' || r === 'HIGHLY_VERIFIED') return 'verified';
    if (r === 'MODERATE' || r === 'VERIFIED' || r === 'PARTIALLY_VERIFIED') return 'mixed';
    if (r === 'HIGH' || r === 'VERY_HIGH' || r === 'UNVERIFIED') return 'disputed';
    return 'mixed';
  }

  // Calculate overall verdict from all articles
  const getOverallVerdict = (articles) => {
    if (!articles.length) return 'mixed';
    const counts = { verified: 0, mixed: 0, disputed: 0 };
    articles.forEach(a => counts[a.verdict] = (counts[a.verdict] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(null);

    // Handle Guardian URL
    try {
      const maybeUrl = new URL(q);
      const hostname = maybeUrl.hostname.toLowerCase();
      if (hostname.includes('guardian') || hostname.includes('theguardian.com')) {
        const articleId = maybeUrl.pathname.replace(/^\//, '');
        axios.get(`/api/news/guardian/article/${encodeURIComponent(articleId)}`)
          .then(res => {
            const article = res.data && res.data.data ? res.data.data : null;
            if (!article) { setArticles([]); return; }
            axios.post(`/api/news/analyze/fake-score`, {
              title: article.webTitle,
              description: article.trailText,
              bodyText: article.bodyText,
              link: article.webUrl,
              source: article.sectionName || 'The Guardian',
              byline: article.byline
            })
              .then(scoreRes => {
                const scoreData = scoreRes.data && scoreRes.data.data ? scoreRes.data.data : null;
                const verdict = scoreData && scoreData.riskLevel ? mapRiskToVerdict(scoreData.riskLevel) : 'mixed';
                const result = [{
                  source: article.sectionName || 'The Guardian',
                  title: article.webTitle,
                  url: article.webUrl,
                  credibility: 90,
                  sentiment: article.sentiment || 'neutral',
                  date: article.publicationDate || article.pubDate || 'recent',
                  excerpt: article.trailText || '',
                  verdict,
                  fakeNewsScore: scoreData
                }];
                setArticles(result);
                updateVerdict(verdict);
              })
              .catch(() => {
                setArticles([{
                  source: article.sectionName || 'The Guardian',
                  title: article.webTitle,
                  url: article.webUrl,
                  credibility: 90,
                  sentiment: 'neutral',
                  date: article.publicationDate || 'recent',
                  excerpt: article.trailText || '',
                  verdict: 'mixed'
                }]);
                updateVerdict('mixed');
              })
              .finally(() => setLoading(false));
          })
          .catch(err => {
            setError(err.message || 'failed to fetch article');
            setLoading(false);
          });
        return;
      }
    } catch (e) {
      // not a URL, treat as search term
    }

    // Default search
    axios.get(`/api/news/guardian/search-with-analysis`, { params: { q, pageSize: 10 } })
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
          const mapped = res.data.data.map(a => ({
            source: a.source || a.sectionName || a.byline || 'Guardian',
            title: a.webTitle || a.title || a.name,
            url: a.webUrl || a.url || '#',
            credibility: a.credibility || 80,
            // Use real sentiment from sentimentService
            sentiment: a.sentiment?.label || a.sentiment || 'neutral',
            date: a.webPublicationDate || a.pubDate || 'recent',
            excerpt: a.trailText || a.description || '',
            // Use real risk level from fakeNewsScoringService
            verdict: a.fakeNewsScore?.riskLevel
              ? mapRiskToVerdict(a.fakeNewsScore.riskLevel)
              : a.verdict || 'mixed',
            // Store the breakdown for potential display
            fakeScore: a.fakeNewsScore?.fakeProbability,
            riskLevel: a.fakeNewsScore?.riskLevel,
            flags: a.fakeNewsScore?.flags || [],
          }));
          setArticles(mapped);
          updateVerdict(getOverallVerdict(mapped));
        } else {
          setArticles([]);
        }
      })
      .catch(err => setError(err.message || 'failed'))
      .finally(() => setLoading(false));
  }, [q]);

  const sentimentData = articles.map(a => {
    const s = a.sentiment?.toLowerCase() || 'neutral';
    const isPositive = s === 'positive';
    const isNegative = s === 'negative';
    return {
      source: (a.source || 'Unknown').substring(0, 15),
      positive: isPositive ? 70 : 20,
      neutral: !isPositive && !isNegative ? 70 : 20,
      negative: isNegative ? 70 : 10,
    };
  });

  const positiveCount = articles.filter(a => a.sentiment?.toLowerCase() === 'positive').length;
  const negativeCount = articles.filter(a => a.sentiment?.toLowerCase() === 'negative').length;
  const neutralCount = articles.filter(a => !a.sentiment || a.sentiment?.toLowerCase() === 'neutral').length;
  const total = articles.length || 1;

  // If all zeros (no sentiment data), show placeholder distribution
  const hasRealSentiment = positiveCount + negativeCount + neutralCount > 0;

  const overallSentiment = hasRealSentiment ? [
    { name: 'Positive', value: Math.round((positiveCount / total) * 100), color: '#22c55e' },
    { name: 'Neutral', value: Math.round((neutralCount / total) * 100), color: '#64748b' },
    { name: 'Negative', value: Math.round((negativeCount / total) * 100), color: '#ef4444' },
  ] : [
    { name: 'Positive', value: 33, color: '#22c55e' },
    { name: 'Neutral', value: 34, color: '#64748b' },
    { name: 'Negative', value: 33, color: '#ef4444' },
  ];

  const getVerdictBadge = (verdict) => {
    if (verdict === 'verified') return <span className="badge badge-green">Verified</span>;
    if (verdict === 'mixed') return <span className="badge badge-yellow">Mixed Evidence</span>;
    if (verdict === 'disputed') return <span className="badge badge-red">Disputed</span>;
    return null;
  };

  const getCredibilityColor = (score) => {
    if (score >= 90) return 'cred-green';
    if (score >= 70) return 'cred-yellow';
    return 'cred-red';
  };

  return (
    <UserLayout>
      <div className="results-page">

        {/* HEADER */}
        <div className="results-header">
          <h1 className="results-title">Fact-Check Results</h1>
          <p className="results-query">Analyzing "<strong>{q}</strong>" across multiple sources</p>
        </div>

        {/* OVERALL ASSESSMENT */}
        {!loading && articles.length > 0 && (
          <div className="assessment-bar">
            <p className="assessment-label">Overall verdict</p>
            <p className="assessment-verdict">
              {getVerdictBadge(getOverallVerdict(articles))}
            </p>
            <span className="assessment-sources">
              Based on {articles.length} source{articles.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Analyzing sources...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="error-state">
            Error: {error}
          </div>
        )}

        {/* TABS */}
        {!loading && (
          <section>
            <div className="tab-list">
              <button
                className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
                onClick={() => setActiveTab('sources')}
              >
                Source Comparison
              </button>
              <button
                className={`tab ${activeTab === 'sentiment' ? 'active' : ''}`}
                onClick={() => setActiveTab('sentiment')}
              >
                Sentiment Analysis
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'sources' && (
                <div className="sources">
                  {articles.length === 0 && (
                    <div className="muted">No articles found for this query.</div>
                  )}
                  {articles.map((article, idx) => (
                    <article key={idx} className="source-card">
                      <header>
                        <div className="left">
                          <h4>{article.source}</h4>
                          <span className={`cred ${getCredibilityColor(article.credibility)}`}>
                            {article.credibility}% credibility
                          </span>
                        </div>
                        <div className="right">
                          {getVerdictBadge(article.verdict)}
                        </div>
                      </header>
                      <p className="excerpt">{article.title}</p>
                      {article.excerpt && (
                        <p className="excerpt small">{article.excerpt}</p>
                      )}

                      {article.fakeScore !== undefined && (
                        <div className="fake-score-bar">
                          <span className="fake-score-label">
                            Misinformation risk: {Math.round(article.fakeScore)}%
                          </span>
                          <div className="fake-score-track">
                            <div
                              className="fake-score-fill"
                              style={{
                                width: `${article.fakeScore}%`,
                                background: article.fakeScore > 60
                                  ? '#ef4444'
                                  : article.fakeScore > 40
                                    ? '#fbbf24'
                                    : '#4ade80'
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {article.flags && article.flags.length > 0 && (
                        <div className="flags-list">
                          {article.flags.slice(0, 3).map((flag, fi) => (
                            <span key={fi} className="flag-tag">{flag}</span>
                          ))}
                        </div>
                      )}
                      <div className="meta">
                        <span className="date">
                          {new Date(article.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          }) || article.date}
                        </span>
                        <a href={article.url} target="_blank" rel="noreferrer" className="read">
                          Read full article <ExternalLinkIcon className="icon" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeTab === 'sentiment' && (
                <div className="sentiment">
                  <div className="chart-card">
                    <h4>Overall Sentiment Distribution</h4>
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={overallSentiment}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            stroke="none"
                            label={({ name, value }) => `${name}: ${value}%`}
                            labelLine={false}
                          >
                            {overallSentiment.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(8,14,35,0.95)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: '#e2e8f0'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-card">
                    <h4>Overall Sentiment Distribution</h4>
                    <div style={{ width: '100%', height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={overallSentiment}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            stroke="none"
                            label={({ name, value }) => `${name}: ${value}%`}
                            labelLine={true}
                          >
                            {overallSentiment.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(8,14,35,0.95)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: '#e2e8f0'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </UserLayout>
  );
}
