'use client';
import { useState } from 'react';

const FACTOR_ICONS = {
  'Title keywords': '🏷️',
  'Photo quality': '📸',
  'Description': '📝',
  'Amenities': '✨',
  'Response rate': '⚡',
  'Pricing': '💰',
  'Instant book': '🔓',
  'Review keywords': '⭐'
};

const FACTOR_TIPS = {
  'Title keywords': 'Listings with location + unique feature in title get 23% more clicks',
  'Photo quality': 'Listings with 20+ photos get 40% more bookings',
  'Description': 'Emotional language in the first 2 sentences increases conversion',
  'Amenities': 'Wifi, parking and kitchen are the top 3 booking decision factors',
  'Response rate': 'Superhosts respond within 1 hour — it directly affects ranking',
  'Pricing': 'Being within 10% of area average maximizes your visibility',
  'Instant book': 'Instant book listings rank up to 40% higher in search',
  'Review keywords': 'Reviews with specific location praise boost local search ranking'
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFactor, setExpandedFactor] = useState(null);

  async function runAudit() {
    if (!url.includes('airbnb')) {
      setError('Please enter a valid Airbnb listing URL.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setActiveTab('overview');
    } catch (e) {
      setError('Audit failed. Please check the URL and try again.');
    }
    setLoading(false);
  }

  async function saveResult() {
    if (!email) return;
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, url, result }),
    });
    setSaved(true);
  }

  const getColor = (s) => s >= 7 ? '#16a34a' : s >= 4 ? '#d97706' : '#dc2626';
  const getBg = (s) => s >= 7 ? '#f0fdf4' : s >= 4 ? '#fffbeb' : '#fef2f2';
  const getBorder = (s) => s >= 7 ? '#bbf7d0' : s >= 4 ? '#fde68a' : '#fecaca';
  const getLabel = (s) => s >= 7 ? 'Good' : s >= 4 ? 'Needs work' : 'Critical';
  const getOverallColor = (s) => s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';
  const getGrade = (s) => s >= 85 ? 'A' : s >= 75 ? 'B' : s >= 60 ? 'C' : s >= 50 ? 'D' : 'F';
  const getGradeColor = (s) => s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';

  const criticalCount = result?.factors?.filter(f => f.score < 4).length || 0;
  const goodCount = result?.factors?.filter(f => f.score >= 7).length || 0;
  const needsWorkCount = result?.factors?.filter(f => f.score >= 4 && f.score < 7).length || 0;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #f8fafc; min-height: 100vh; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes scoreReveal { from { stroke-dasharray: 0 302; } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.2s ease both; }
        .fade-up-4 { animation: fadeUp 0.5s 0.3s ease both; }
        .factor-card { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 18px; cursor: pointer; transition: all 0.2s; }
        .factor-card:hover { border-color: #475569; transform: translateY(-2px); background: #243044; }
        .factor-card.expanded { border-color: #3b82f6; background: #1a2744; }
        .tab { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
        .tab.active { background: #3b82f6; color: white; }
        .tab.inactive { background: transparent; color: #94a3b8; }
        .tab.inactive:hover { color: #f8fafc; background: #1e293b; }
        .primary-btn { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; letter-spacing: -0.01em; }
        .primary-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,0.4); }
        .primary-btn:active { transform: scale(0.98); }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
        .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; }
        .fix-card { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; transition: border-color 0.2s; }
        .fix-card:hover { border-color: #475569; }
        input { background: #1e293b; border: 1.5px solid #334155; color: #f8fafc; border-radius: 10px; padding: 13px 16px; font-size: 15px; outline: none; transition: border-color 0.2s; width: 100%; }
        input::placeholder { color: #475569; }
        input:focus { border-color: #3b82f6; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1e293b; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #1e293b', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>ListingLens</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#64748b', background: '#1e293b', border: '1px solid #334155', padding: '5px 12px', borderRadius: 99 }}>Free forever</span>
          {result && (
            <button onClick={() => { setResult(null); setUrl(''); setSaved(false); }} style={{ fontSize: 13, color: '#94a3b8', background: 'transparent', border: '1px solid #334155', padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}>
              New audit
            </button>
          )}
        </div>
      </nav>

      {/* HERO — only shown before results */}
      {!result && (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', padding: '6px 16px', borderRadius: 99, fontSize: 13, color: '#94a3b8', marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            AI-powered · Free · No signup needed
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 20, maxWidth: 760 }}>
            Find out why your Airbnb
            <br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              isn't ranking higher
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}>
            Get an AI audit across 8 ranking factors with your 3 most impactful fixes — in 30 seconds, completely free.
          </p>

          <div style={{ width: '100%', maxWidth: 620, marginBottom: 24 }}>
            <div style={{ background: '#1e293b', border: '1.5px solid #334155', borderRadius: 16, padding: 8, display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runAudit()}
                placeholder="Paste your Airbnb listing URL here..."
                style={{ flex: 1, border: 'none', background: 'transparent', borderRadius: 8, padding: '10px 14px' }}
              />
              <button className="primary-btn" onClick={runAudit} disabled={loading} style={{ padding: '12px 28px', fontSize: 15, borderRadius: 10 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTop: '2.5px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span>
                    Analyzing...
                  </span>
                ) : 'Audit my listing →'}
              </button>
            </div>
            {error && <div style={{ color: '#f87171', fontSize: 14, background: '#1e293b', border: '1px solid #dc2626', borderRadius: 8, padding: '10px 16px' }}>{error}</div>}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['500+', 'Listings audited'], ['8', 'Ranking factors'], ['30s', 'Avg audit time']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.03em' }}>{n}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>

          {/* Re-audit bar */}
          <div className="fade-up" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1, padding: '9px 14px', fontSize: 13, borderRadius: 8 }} placeholder="Airbnb listing URL..." />
            <button className="primary-btn" onClick={runAudit} disabled={loading} style={{ padding: '10px 22px', fontSize: 14, borderRadius: 9, flexShrink: 0 }}>
              {loading ? 'Analyzing...' : 'Re-audit'}
            </button>
          </div>

          {/* Score + grade hero */}
          <div className="fade-up" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 20, padding: '32px', marginBottom: 16, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Circle score */}
            <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#334155" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke={getOverallColor(result.overall)} strokeWidth="10"
                  strokeDasharray={`${(result.overall / 100) * 314} 314`}
                  strokeLinecap="round" strokeDashoffset="78.5"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: getOverallColor(result.overall), lineHeight: 1, letterSpacing: '-0.04em' }}>{result.overall}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>/100</span>
              </div>
            </div>

            {/* Title + summary */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ background: getBg(result.overall / 10), color: getColor(result.overall / 10), border: `1px solid ${getBorder(result.overall / 10)}`, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                  {result.overall >= 75 ? 'Good standing' : result.overall >= 50 ? 'Needs improvement' : 'Critical issues found'}
                </span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em', color: '#f1f5f9' }}>
                {result.title}
              </h2>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['🟢', goodCount, 'Good'], ['🟡', needsWorkCount, 'Needs work'], ['🔴', criticalCount, 'Critical']].map(([e, c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8' }}>
                    <span style={{ fontSize: 10 }}>{e}</span>{c} {l}
                  </div>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: getBg(result.overall / 10), border: `2px solid ${getBorder(result.overall / 10)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: getGradeColor(result.overall), letterSpacing: '-0.04em' }}>
                {getGrade(result.overall)}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, fontWeight: 600 }}>GRADE</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="fade-up-2" style={{ display: 'flex', gap: 6, marginBottom: 16, background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 6 }}>
            {['overview', 'factors', 'fixes'].map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : 'inactive'}`} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '10px', textTransform: 'capitalize', borderRadius: 8, fontSize: 14 }}>
                {tab === 'overview' ? '📊 Overview' : tab === 'factors' ? '🎯 8 Factors' : '🔧 3 Fixes'}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="fade-up-2">
              {/* Mini stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                <div className="stat-card">
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', letterSpacing: '-0.03em' }}>{goodCount}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Factors in good shape</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.03em' }}>{needsWorkCount}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Factors needing work</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444', letterSpacing: '-0.03em' }}>{criticalCount}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Critical factors</div>
                </div>
              </div>

              {/* Horizontal bar chart */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: '24px', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>Score breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {result.factors && result.factors.map((f, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 40px', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, color: '#94a3b8', textAlign: 'right' }}>{f.name}</span>
                      <div style={{ height: 8, background: '#334155', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: 8, width: `${f.score * 10}%`, background: getColor(f.score), borderRadius: 99, transition: `width ${0.5 + i * 0.1}s cubic-bezier(0.34, 1.56, 0.64, 1)` }}></div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: getColor(f.score) }}>{f.score}/10</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top fix preview */}
              <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #1a2744)', border: '1px solid #2563eb40', borderRadius: 16, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top priority fix</div>
                  <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, maxWidth: 500 }}>{result.fix1}</p>
                </div>
                <button onClick={() => setActiveTab('fixes')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  See all 3 fixes →
                </button>
              </div>
            </div>
          )}

          {/* FACTORS TAB */}
          {activeTab === 'factors' && (
            <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {result.factors && result.factors.map((f, i) => (
                <div key={i} className={`factor-card ${expandedFactor === i ? 'expanded' : ''}`} onClick={() => setExpandedFactor(expandedFactor === i ? null : i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{FACTOR_ICONS[f.name] || '📌'}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{f.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 26, fontWeight: 900, color: getColor(f.score), lineHeight: 1, letterSpacing: '-0.04em' }}>{f.score}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>/10</div>
                    </div>
                  </div>

                  <div style={{ height: 6, background: '#334155', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: 6, width: `${f.score * 10}%`, background: getColor(f.score), borderRadius: 99 }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: getColor(f.score), background: getBg(f.score), padding: '2px 8px', borderRadius: 99, border: `1px solid ${getBorder(f.score)}` }}>
                      {getLabel(f.score)}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{expandedFactor === i ? 'Less ▲' : 'Tip ▼'}</span>
                  </div>

                  {expandedFactor === i && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #334155', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                      💡 {FACTOR_TIPS[f.name] || 'Improve this factor to boost your ranking.'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* FIXES TAB */}
          {activeTab === 'fixes' && (
            <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { fix: result.fix1, priority: 'Highest impact', color: '#f59e0b', bg: '#451a03', border: '#92400e' },
                { fix: result.fix2, priority: 'High impact', color: '#60a5fa', bg: '#172554', border: '#1e40af' },
                { fix: result.fix3, priority: 'Medium impact', color: '#a78bfa', bg: '#2e1065', border: '#5b21b6' }
              ].map(({ fix, priority, color, bg, border }, i) => (
                <div key={i} className="fix-card" style={{ background: bg, borderColor: border }}>
                  <div style={{ minWidth: 36, height: 36, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#0f172a', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{priority}</div>
                    <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.7 }}>{fix}</p>
                  </div>
                </div>
              ))}

              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: '20px', marginTop: 8, textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>After implementing these fixes</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>Re-audit your listing to track your improvement →</p>
                <button onClick={() => setActiveTab('overview')} style={{ marginTop: 12, background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                  Back to overview
                </button>
              </div>
            </div>
          )}

          {/* Email save */}
          <div className="fade-up-4" style={{ marginTop: 16 }}>
            {!saved ? (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: '24px' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#e2e8f0' }}>Track your score over time</h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>Get a monthly re-audit reminder and see your ranking improve.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260 }}>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: '11px 14px', fontSize: 14 }} />
                    <button onClick={saveResult} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Save free
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: '#14532d20', border: '1px solid #16a34a40', borderRadius: 16, padding: '20px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#4ade80' }}>Saved — check your email!</p>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>We'll remind you to re-audit next month.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '28px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#475569' }}>ListingLens — AI-powered Airbnb listing auditor · Free forever</p>
      </footer>
    </>
  );
}
