'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAudit = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', fontFamily: 'var(--font-inter, sans-serif)' }}>
      {/* Header & Dashboard Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', color: '#FF385C', margin: 0 }}>ListingLens</h1>
        <a href="/dashboard" style={{ color: '#00A699', fontWeight: 'bold', textDecoration: 'none', border: '2px solid #00A699', padding: '8px 16px', borderRadius: '8px' }}>
          Host Dashboard →
        </a>
      </div>

      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>Paste your Airbnb URL to see your SEO score and real guest reviews.</p>

      {/* Input Section */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        <input
          type="text"
          placeholder="https://www.airbnb.com/rooms/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
        />
        <button
          onClick={handleAudit}
          disabled={loading}
          style={{ background: '#FF385C', color: 'white', padding: '15px 30px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Auditing...' : 'Audit Now'}
        </button>
      </div>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* Results Section */}
      {results && (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '48px', margin: '0 0 10px 0', color: '#FF385C' }}>{results.overall}%</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#222', margin: '0 0 5px 0' }}>{results.title}</p>
            <p style={{ color: '#666' }}>Property Audit Results</p>
          </div>

          {/* Factors Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '40px' }}>
            {results.factors.map((f, i) => (
              <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: f.score > 6 ? '#00A699' : '#FC8C00' }}>{f.score}/10</div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginTop: '5px', textTransform: 'uppercase' }}>{f.name}</div>
              </div>
            ))}
          </div>

          {/* Fixes Section */}
          <div style={{ background: '#FFF1F2', padding: '30px', borderRadius: '20px', border: '1px solid #FFC0C7', marginBottom: '40px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FF385C' }}>Priority Fixes</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
              <li style={{ marginBottom: '15px' }}>{results.fix1}</li>
              <li style={{ marginBottom: '15px' }}>{results.fix2}</li>
              <li>{results.fix3}</li>
            </ul>
          </div>

          {/* NEW: Reviews Section */}
          {results.reviews && results.reviews.length > 0 && (
            <div style={{ marginTop: '50px' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>Real Guest Reviews</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {results.reviews.map((r, i) => (
                  <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #eee' }}>
                    <p style={{ fontStyle: 'italic', color: '#444', margin: '0 0 10px 0' }}>"{r.text}"</p>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF385C' }}>— {r.reviewer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
