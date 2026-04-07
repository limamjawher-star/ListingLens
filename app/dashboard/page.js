'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    month: '', year: new Date().getFullYear(),
    total_revenue: 0, total_nights_booked: 0,
    total_nights_available: 30, cleaning_costs: 0,
    platform_fees: 0, utilities: 0,
    maintenance: 0, other_expenses: 0
  });

  async function loadData() {
    const { data: rows } = await supabase
      .from('financials').select('*').eq('user_email', email)
      .order('year', { ascending: false })
      .order('month', { ascending: false });
    setData(rows || []);
    setLoggedIn(true);
  }

  async function saveMonth() {
    await supabase.from('financials').insert({ ...form, user_email: email });
    loadData();
  }

  const calcKPIs = (row) => {
    const exp = row.cleaning_costs + row.platform_fees
      + row.utilities + row.maintenance + row.other_expenses;
    const net = row.total_revenue - exp;
    const occ = row.total_nights_available > 0
      ? Math.round((row.total_nights_booked / row.total_nights_available) * 100) : 0;
    const adr = row.total_nights_booked > 0
      ? Math.round(row.total_revenue / row.total_nights_booked) : 0;
    const revpar = row.total_nights_available > 0
      ? Math.round(row.total_revenue / row.total_nights_available) : 0;
    const margin = row.total_revenue > 0
      ? Math.round((net / row.total_revenue) * 100) : 0;
    const cpn = row.total_nights_booked > 0
      ? Math.round(exp / row.total_nights_booked) : 0;
    return { exp, net, occ, adr, revpar, margin, cpn };
  };

  // Full UI renders the email login, monthly form input,
  // and KPI cards grid for each saved month.
  // Build the UI using the same Airbnb design system from page.js.
  return <div>{/* Your dashboard UI here */}</div>;
}
