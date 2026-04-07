'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Safety check to prevent build errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    month: '', year: new Date().getFullYear(),
    total_revenue: 0, total_nights_booked: 0,
    total_nights_available: 30, cleaning_costs: 0,
    platform_fees: 0, utilities: 0,
    maintenance: 0, other_expenses: 0
  });

  // Load data from Supabase
  async function loadData() {
    if (!supabase) return alert("Database not connected. check Vercel settings.");
    setLoading(true);
    const { data: rows, error } = await supabase
      .from('financials').select('*').eq('user_email', email)
      .order('year', { ascending: false })
      .order('month', { ascending: false });
    
    if (error) console.error(error);
    setData(rows || []);
    setLoggedIn(true);
    setLoading(false);
  }

  // Save new month to Supabase
  async function saveMonth() {
    if (!form.month) return alert("Please select a month");
    setLoading(true);
    await supabase.from('financials').insert({ ...form, user_email: email });
    loadData();
  }

  // Calculate KPIs (Key Performance Indicators)
  const calcKPIs = (row) => {
    const exp = Number(row.cleaning_costs) + Number(row.platform_fees) + Number(row.utilities) + Number(row.maintenance) + Number(row.other_expenses);
    const net = row.total_revenue - exp;
    const occ = row.total_nights_available > 0 ? Math.round((row.total_nights_booked / row.total_nights_available) * 100) : 0;
    const adr = row.total_nights_booked > 0 ? Math.round(row.total_revenue / row.total_nights_booked) : 0;
    return { exp, net, occ, adr };
  };

  // 1. LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#FF385C', marginBottom: '10px' }}>ListingLens Pro</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Enter your email to access your revenue dashboard</p>
        <input 
          type="email" placeholder="host@email.com" 
          value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}
        />
        <button onClick={loadData} disabled={loading} style={{ width: '100%', background: '#FF385C', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Loading...' : 'Open Dashboard'}
        </button>
      </div>
    );
  }

  // 2. MAIN DASHBOARD UI
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px', fontFamily: 'sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Revenue Dashboard</h1>
          <p style={{ color: '#666' }}>Logged in as {email}</p>
        </div>
        <button onClick={() => setLoggedIn(false)} style={{ background: 'none', border: 'none', color: '#FF385C', fontWeight: 'bold', cursor: 'pointer' }}>Log Out</button>
      </header>

      {/* ADD DATA FORM */}
      <section style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '40px' }}>
        <h3 style={{ marginTop: 0 }}>Add New Month</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Month</label>
            <select onChange={(e) => setForm({...form, month: e.target.value})} style={{ width: '100%', padding: '8px' }}>
              <option value="">Select...</option>
              <option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option>
              <option value="May">May</option><option value="June">June</option><option value="July">July</option><option value="August">August</option>
              <option value="September">September</option><option value="October">October</option><option value="November">November</option><option value="December">December</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Revenue ($)</label>
            <input type="number" onChange={(e) => setForm({...form, total_revenue: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Nights Booked</label>
            <input type="number" onChange={(e) => setForm({...form, total_nights_booked: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          </div>
          <button onClick={saveMonth} style={{ background: '#00A699', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', height: '35px', marginTop: '18px' }}>Save Month</button>
        </div>
      </section>

      {/* HISTORY TABLE / CARDS */}
      <section>
        <h3>Financial History</h3>
        {data.length === 0 ? <p>No data found. Add your first month above!</p> : (
          data.map((row, index) => {
            const kpi = calcKPIs(row);
            return (
              <div key={index} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ borderRight: '1px solid #eee' }}>
                  <div style={{ color: '#666', fontSize: '12px' }}>{row.month} {row.year}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF385C' }}>${row.total_revenue}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#666', fontSize: '12px' }}>Occupancy</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{kpi.occ}%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#666', fontSize: '12px' }}>Avg Night Rate</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>${kpi.adr}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#666', fontSize: '12px' }}>Net Profit</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00A699' }}>${kpi.net}</div>
                </div>
              </div>
            )
          })
        )}
      </section>
    </div>
  );
}
