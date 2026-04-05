'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

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

  const getScoreColor = (s) => s >= 7 ? '#16a34a' : s >= 4 ? '#d97706' : '#dc2626';
  const getScoreBg = (s) => s >= 7 ? '#f0fdf4' : s >= 4 ? '#fffbeb' : '#fef2f2';
  const getScoreBorder = (s) => s >= 7 ? '#bbf7d0' : s >= 4 ? '#fde68a' : '#fecaca';
  const getScoreLabel = (s) => s >= 7 ? 'Good' : s >= 4 ? 'Needs work' : 'Critical';
  const getOverallColor = (s) => s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626';
  const getOverallLabel = (s) => s >= 75 ? 'Good standing' : s >= 50 ? 'Needs improvement' : 'Critical issues';

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #0f172a; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .btn-primary { background: #1d4ed8; color: white; border: none; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.1s; white-space: nowrap; }
        .btn-primary:hover { background: #1e40af; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-primary:disabled { background: #93c5fd; cursor: not-allowed; }
        .btn-green { background: #16a34a; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .btn-green:hover { background: #15803d; }
        input[type="text"], input[type="email"] { width: 100%; padding: 14px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 15px; outline: none; transition: border-color 0.2s; background: white; color: #0f172a; }
        input[type="text"]:focus, input[type="email"]:focus { border-color: #3b82f6; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#1d4ed8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>ListingLens</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: 99 }}>Free audit</span>
        </div>
      </nav>

      {/* Hero */}
      {!result && (
        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #f0fdf4 100%)', borderBottom: '1px solid #e2e8f0', padding: '64px 24px 56px' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dbeafe', color: '#1d4ed8', padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Free — No account needed
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, color: '#0f172a', marginBottom: 16 }}>
              Find out why your Airbnb<br />
              <span style={{ color: '#1d4ed8' }}>isn't ranking higher</span>
            </h1>
            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
              Paste your listing URL and get an AI-powered score across 8 ranking factors — with your 3 most impactful fixes in 30 seconds.
            </p>

            {/* Input */}
            <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: 8, display: 'flex', gap: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runAudit()}
                placeholder="https://www.airbnb.com/rooms/..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, padding: '8px 12px', background: 'transparent', color: '#0f172a' }}
              />
              <button className="btn-primary" onClick={runAudit} disabled={loading} style={{ borderRadius: 8 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }}></span>
                    Analyzing...
                  </span>
                ) : 'Audit my listing →'}
              </button>
            </div>

            {error && (
              <div style={{ color: '#dc2626', fontSize: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px', marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Trust row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {['No signup required', 'Results in 30 seconds', 'Used by 100+ hosts'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="fade-in" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 80px' }}>

          {/* Re-audit bar */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap', gap: 10 }}>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8 }} />
            <button className="btn-primary" onClick={runAudit} disabled={loading} style={{ padding: '10px 20px', fontSize: 14 }}>
              {loading ? 'Analyzing...' : 'Re-audit'}
            </button>
          </div>

          {/* Score hero */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px 28px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="48" fill="none" stroke="#f1f5f9" strokeWidth="10"/>
                <circle cx="55" cy="55" r="48" fill="none" stroke={getOverallColor(result.overall)} strokeWidth="10"
                  strokeDasharray={`${(result.overall / 100) * 301.6} 301.6`}
                  strokeLinecap="round" strokeDashoffset="75.4" transform="rotate(-90 55 55)" style={{ transition: 'stroke-dasharray 1s ease' }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: getOverallColor(result.overall), lineHeight: 1 }}>{result.overall}</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>/100</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'inline-block', background: getScoreBg(result.overall / 10), color: getScoreColor(result.overall / 10), border: `1px solid ${getScoreBorder(result.overall / 10)}`, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                {getOverallLabel(result.overall)}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 6, lineHeight: 1.3 }}>{result.title}</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
                Your listing scored <strong style={{ color: getOverallColor(result.overall) }}>{result.overall}/100</strong> across 8 Airbnb ranking factors. Fix the highlighted issues below to rank higher and get more bookings.
              </p>
            </div>
          </div>

          {/* 8 factors grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 16 }}>
            {result.factors && result.factors.map((f, i) => (
              <div key={i} style={{ background: 'white', border: `1.5px solid ${getScoreBorder(f.score)}`, borderRadius: 12, padding: '16px 14px', background: getScoreBg(f.score) }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{f.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: getScoreColor(f.score), lineHeight: 1 }}>{f.score}</span>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>/10</span>
                </div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: 4, width: `${f.score * 10}%`, background: getScoreColor(f.score), borderRadius: 99, transition: 'width 0.8s ease' }}></div>
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, color: getScoreColor(f.score), marginTop: 6 }}>{getScoreLabel(f.score)}</p>
              </div>
            ))}
          </div>

          {/* Priority fixes */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Your 3 priority fixes</h3>
                <p style={{ fontSize: 13, color: '#64748b' }}>Implement these in order for the biggest ranking boost</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[result.fix1, result.fix2, result.fix3].map((fix, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px', background: i === 0 ? '#fffbeb' : '#f8fafc', border: `1px solid ${i === 0 ? '#fde68a' : '#e2e8f0'}`, borderRadius: 10 }}>
                  <div style={{ minWidth: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#f59e0b' : '#94a3b8', color: 'white', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, margin: 0 }}>{fix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Save CTA */}
          {!saved ? (
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1.5px solid #bfdbfe', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e3a8a', marginBottom: 6 }}>Track your score month over month</h3>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
                    Save your audit and get a monthly re-audit reminder. See exactly which fixes improved your ranking.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 260, alignItems: 'center' }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    style={{ flex: 1, padding: '11px 14px', fontSize: 14, border: '1.5px solid #bfdbfe', borderRadius: 10 }} />
                  <button className="btn-green" onClick={saveResult} style={{ padding: '11px 20px' }}>Save free</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#14532d', marginBottom: 4 }}>Saved! Check your email.</p>
              <p style={{ fontSize: 14, color: '#374151' }}>We'll send you a monthly re-audit reminder so you can track your progress.</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '24px', textAlign: 'center', background: 'white' }}>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>ListingLens — Free Airbnb listing auditor powered by AI</p>
      </footer>
    </>
  );
}
