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
    if (!url.includes('airbnb.com')) {
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

  const scoreColor = (s) => s >= 7 ? '#15803d' : s >= 4 ? '#b45309' : '#b91c1c';
  const scoreLabel = (s) => s >= 7 ? 'Good' : s >= 4 ? 'Needs work' : 'Critical';

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1e3a8a' }}>ListingLens</h1>
      <p style={{ fontSize: 18, color: '#6b7280', marginTop: 8 }}>
        Find out exactly why your Airbnb listing is not ranking higher — free audit in 30 seconds.
      </p>
      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder='Paste your Airbnb listing URL here...'
          style={{ flex: 1, padding: '12px 16px', border: '1px solid #d1d5db',
            borderRadius: 8, fontSize: 16, outline: 'none' }}
        />
        <button
          onClick={runAudit}
          disabled={loading}
          style={{ padding: '12px 24px', background: loading ? '#93c5fd' : '#1d4ed8',
            color: 'white', border: 'none', borderRadius: 8, fontSize: 16,
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Analyzing...' : 'Audit my listing'}
        </button>
      </div>
      {error && <p style={{ color: '#b91c1c', marginTop: 12 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 40 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 12, padding: 28, marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>Overall listing score</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 56, fontWeight: 700, color: '#1d4ed8' }}>{result.overall}</span>
              <span style={{ fontSize: 24, color: '#9ca3af' }}>/100</span>
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{result.title}</p>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>8 ranking factors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {result.factors && result.factors.map((f, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb',
                borderRadius: 8, padding: '12px 16px' }}>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{f.name}</p>
                <p style={{ fontSize: 22, fontWeight: 600, color: scoreColor(f.score), margin: '4px 0 0' }}>
                  {f.score}/10
                </p>
                <p style={{ fontSize: 11, color: scoreColor(f.score), margin: 0 }}>{scoreLabel(f.score)}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa',
            borderRadius: 12, padding: 24, marginBottom: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#92400e', marginBottom: 16 }}>
              Your 3 priority fixes
            </h3>
            {[result.fix1, result.fix2, result.fix3].map((fix, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ minWidth: 24, height: 24, borderRadius: '50%',
                  background: '#f97316', color: 'white', fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>{fix}</p>
              </div>
            ))}
          </div>

          {!saved ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#14532d', marginBottom: 8 }}>
                Track your score month over month
              </h3>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 16 }}>
                Save your score and get a monthly re-audit reminder. See if your fixes are working.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #d1d5db',
                    borderRadius: 8, fontSize: 15 }} />
                <button onClick={saveResult}
                  style={{ padding: '10px 20px', background: '#16a34a', color: 'white',
                    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  Save free
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 12, padding: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: '#14532d' }}>
                Saved! Check your email for your audit summary.
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
