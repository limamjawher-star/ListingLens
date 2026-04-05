'use client';
import { useState } from 'react';

const ICONS = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  title: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h8m-8 6h16"/></svg>,
  photo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
  desc: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  amenity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  response: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  price: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  instant: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  review: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  warning: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  critical: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  star: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  user: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  trending: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  eye: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

const FACTOR_META = {
  'Title keywords':  { icon: 'title',    tip: 'Add your neighborhood name and one unique feature. Titles with location keywords get 23% more impressions in Airbnb search.', action: 'Update your title to include: [City District] + [Property Type] + [Standout Feature]', benchmark: 'Top listings use 45-50 characters with 2-3 location keywords' },
  'Photo quality':   { icon: 'photo',    tip: 'Listings with 20+ professional photos get 40% more bookings. The first photo is your thumbnail — it must be wide, bright and show the best room.', action: 'Add exterior shots, all rooms, bathroom, kitchen and any outdoor space', benchmark: 'Superhosts average 28 photos per listing' },
  'Description':     { icon: 'desc',     tip: 'Your first 2 sentences appear in search previews. Emotional language that describes how guests will feel converts 35% better than feature lists.', action: 'Start with: "Imagine waking up to..." or "Your own private..." — then list features', benchmark: 'Optimal description length is 400-600 words with paragraph breaks' },
  'Amenities':       { icon: 'amenity',  tip: 'Wifi, dedicated workspace, and free parking are the top 3 amenity filters guests use. Missing any of these hides your listing from filtered searches.', action: 'Add all amenities you actually offer — even basic ones guests assume are included', benchmark: 'Top 10% of listings have 25+ amenities listed' },
  'Response rate':   { icon: 'response', tip: 'Airbnb measures your response rate over the last 30 days. Falling below 90% can remove your listing from search results entirely.', action: 'Enable notifications and respond within 1 hour — even a short "Thanks, will reply soon" counts', benchmark: 'Superhosts maintain 100% response rate within 1 hour' },
  'Pricing':         { icon: 'price',    tip: 'Listings priced within 10% of the local average get the most visibility. Being too expensive reduces impressions; being too cheap signals low quality.', action: 'Use Airbnb\'s Smart Pricing or check the 5 nearest comparable listings weekly', benchmark: 'Update your base price at least once per month based on local demand' },
  'Instant book':    { icon: 'instant',  tip: 'Instant Book listings rank up to 40% higher in Airbnb search. Most travelers filter by Instant Book — without it you are invisible to them.', action: 'Enable Instant Book in Host Settings — add guest requirements if you want screening', benchmark: '73% of bookings on Airbnb are made via Instant Book' },
  'Review keywords': { icon: 'review',   tip: 'Reviews mentioning specific location, cleanliness and host responsiveness boost your local search ranking. Guests repeat what your listing promises.', action: 'After each stay, send a message referencing what made the stay special — guests echo it in reviews', benchmark: 'Aim for 10+ reviews with location keywords in the first 90 days' },
};

const MOCK_REVIEWS = [
  { name: 'Sophie L.', date: 'March 2025', rating: 5, text: 'The location was absolutely perfect — walking distance from everything. The apartment was spotless and exactly as described. Would definitely rebook.', sentiment: 'positive', keywords: ['location', 'clean', 'accurate'] },
  { name: 'Marco R.', date: 'February 2025', rating: 4, text: 'Great place overall. Check-in was smooth and the host responded quickly. Only issue was the wifi was a bit slow for video calls.', sentiment: 'mixed', keywords: ['check-in', 'responsive', 'wifi issue'] },
  { name: 'Aisha K.', date: 'January 2025', rating: 5, text: 'Stunning views and a very comfortable bed. The neighborhood is lively but quiet at night. Perfect for our anniversary trip.', sentiment: 'positive', keywords: ['views', 'comfortable', 'neighborhood'] },
  { name: 'Tom B.', date: 'December 2024', rating: 3, text: 'Decent place but photos were a bit misleading — the space feels smaller in person. Kitchen was well equipped though.', sentiment: 'negative', keywords: ['misleading photos', 'small', 'kitchen'] },
];

const MOCK_DESCRIPTION_BEFORE = `Welcome to our cozy apartment! It is located in the city center and has 2 bedrooms. There is a fully equipped kitchen, wifi, and air conditioning. The apartment is clean and comfortable. We are close to restaurants and shops. Check-in is flexible. Please read all house rules before booking.`;

const MOCK_DESCRIPTION_AFTER = `Wake up to the energy of the city from your own private retreat in the heart of [Neighborhood]. This light-filled 2-bedroom apartment blends comfort with style — whether you are here for work or exploring the city, you will feel right at home.

The fully equipped kitchen means you can cook like a local, and our high-speed wifi (100Mbps, tested daily) keeps remote workers connected. Aircon in every room ensures a perfect night's sleep even in summer.

You are steps from [Famous Street] and surrounded by the best restaurants and cafes in the district — your host guide covers every local secret.`;

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [expandedFactor, setExpandedFactor] = useState(null);
  const [showAfter, setShowAfter] = useState(false);

  async function runAudit() {
    if (!url.includes('airbnb')) { setError('Please enter a valid Airbnb listing URL.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data); setActiveTab('overview');
    } catch { setError('Audit failed. Please check the URL and try again.'); }
    setLoading(false);
  }

  async function saveResult() {
    if (!email) return;
    await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, url, result }) });
    setSaved(true);
  }

  const gc = (s) => s >= 7 ? '#00A699' : s >= 4 ? '#FC8C00' : '#FF385C';
  const gbg = (s) => s >= 7 ? '#F0FBF9' : s >= 4 ? '#FFF6ED' : '#FFF1F2';
  const gborder = (s) => s >= 7 ? '#B2E4DF' : s >= 4 ? '#FDDBA8' : '#FFC0C7';
  const gl = (s) => s >= 7 ? 'Good' : s >= 4 ? 'Needs work' : 'Critical';
  const oc = (s) => s >= 75 ? '#00A699' : s >= 50 ? '#FC8C00' : '#FF385C';
  const grade = (s) => s >= 85 ? 'A' : s >= 75 ? 'B' : s >= 60 ? 'C' : s >= 50 ? 'D' : 'F';

  const goodC = result?.factors?.filter(f => f.score >= 7).length || 0;
  const warnC = result?.factors?.filter(f => f.score >= 4 && f.score < 7).length || 0;
  const critC = result?.factors?.filter(f => f.score < 4).length || 0;

  const filteredFactors = result?.factors?.filter(f => {
    if (filter === 'good') return f.score >= 7;
    if (filter === 'work') return f.score >= 4 && f.score < 7;
    if (filter === 'critical') return f.score < 4;
    return true;
  }) || [];

  const TABS = ['overview', 'factors', 'description', 'reviews', 'fixes'];
  const TAB_LABELS = { overview: 'Overview', factors: '8 Factors', description: 'Description', reviews: 'Reviews', fixes: 'Action Plan' };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F7F7F7;color:#222;-webkit-font-smoothing:antialiased}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes barGrow{from{width:0}}
        .fade{animation:fadeUp .4s ease forwards}
        .fade2{animation:fadeUp .4s .08s ease both}
        .fade3{animation:fadeUp .4s .16s ease both}
        .fade4{animation:fadeUp .4s .24s ease both}
        .card{background:#fff;border:1px solid #E8E8E8;border-radius:16px;overflow:hidden}
        .pill-btn{border:1.5px solid #E8E8E8;background:#fff;color:#717171;padding:7px 16px;border-radius:99px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
        .pill-btn:hover{border-color:#222;color:#222}
        .pill-btn.active{background:#222;color:#fff;border-color:#222}
        .pill-btn.active-good{background:#00A699;color:#fff;border-color:#00A699}
        .pill-btn.active-warn{background:#FC8C00;color:#fff;border-color:#FC8C00}
        .pill-btn.active-crit{background:#FF385C;color:#fff;border-color:#FF385C}
        .cta-btn{background:#FF385C;color:#fff;border:none;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:-.01em}
        .cta-btn:hover{background:#E31C5F;transform:translateY(-1px)}
        .cta-btn:active{transform:scale(.98)}
        .cta-btn:disabled{background:#FFB3C1;cursor:not-allowed;transform:none}
        .tab-btn{background:transparent;border:none;padding:14px 4px;font-size:14px;font-weight:600;color:#717171;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;white-space:nowrap}
        .tab-btn.active{color:#FF385C;border-bottom-color:#FF385C}
        .tab-btn:hover:not(.active){color:#222}
        .factor-row{background:#fff;border:1px solid #E8E8E8;border-radius:12px;padding:16px 18px;cursor:pointer;transition:all .2s}
        .factor-row:hover{border-color:#C0C0C0;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .factor-row.open{border-color:#FF385C;box-shadow:0 2px 16px rgba(255,56,92,.1)}
        .review-card{background:#fff;border:1px solid #E8E8E8;border-radius:14px;padding:20px}
        input[type=text],input[type=email]{background:#fff;border:1.5px solid #DDDDDD;color:#222;border-radius:10px;padding:13px 16px;font-size:15px;outline:none;transition:border-color .2s;width:100%}
        input[type=text]:focus,input[type=email]:focus{border-color:#222}
        input[type=text]::placeholder,input[type=email]::placeholder{color:#B0B0B0}
        @media(max-width:640px){
          .hero-title{font-size:30px!important}
          .score-grid{grid-template-columns:1fr 1fr!important}
          .tab-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
          .tab-scroll::-webkit-scrollbar{display:none}
          .two-col{grid-template-columns:1fr!important}
          .three-col{grid-template-columns:1fr 1fr!important}
          .hero-input-row{flex-direction:column!important}
          .stat-num{font-size:32px!important}
        }
      `}</style>

      {/* NAV */}
      <nav style={{background:'#fff',borderBottom:'1px solid #E8E8E8',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:32,height:32,background:'#FF385C',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>{ICONS.search}</div>
          <span style={{fontWeight:800,fontSize:17,letterSpacing:'-.03em',color:'#222'}}>ListingLens</span>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {result && <button onClick={()=>{setResult(null);setUrl('');setSaved(false);setFilter('all');}} className="pill-btn">New audit</button>}
          <span style={{fontSize:13,color:'#717171',background:'#F7F7F7',border:'1px solid #E8E8E8',padding:'5px 12px',borderRadius:99,display:'flex',alignItems:'center',gap:5}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'#00A699',display:'inline-block'}}></span>Free
          </span>
        </div>
      </nav>

      {/* HERO */}
      {!result && (
        <div style={{background:'linear-gradient(160deg,#fff 60%,#FFF1F2 100%)',minHeight:'calc(100vh - 64px)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',textAlign:'center'}}>
          <div style={{maxWidth:680,width:'100%'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#FFF1F2',border:'1px solid #FFC0C7',padding:'6px 16px',borderRadius:99,fontSize:13,fontWeight:600,color:'#FF385C',marginBottom:28}}>
              <span style={{display:'flex'}}>{ICONS.trending}</span>AI-powered ranking audit · Free · No account needed
            </div>
            <h1 className="hero-title" style={{fontSize:52,fontWeight:900,lineHeight:1.05,letterSpacing:'-.04em',color:'#222',marginBottom:18}}>
              Why isn't your Airbnb<br/>
              <span style={{color:'#FF385C'}}>ranking higher?</span>
            </h1>
            <p style={{fontSize:18,color:'#717171',lineHeight:1.7,maxWidth:480,margin:'0 auto 44px'}}>
              Paste your listing URL and get a complete audit across 8 ranking factors with your exact action plan — in 30 seconds.
            </p>

            <div style={{background:'#fff',border:'1.5px solid #DDDDDD',borderRadius:16,padding:8,display:'flex',gap:8,marginBottom:14,boxShadow:'0 4px 24px rgba(0,0,0,.08)'}} className="hero-input-row">
              <input type="text" value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAudit()} placeholder="https://www.airbnb.com/rooms/..." style={{flex:1,border:'none',outline:'none',background:'transparent',padding:'10px 14px',fontSize:15}}/>
              <button className="cta-btn" onClick={runAudit} disabled={loading} style={{borderRadius:10,padding:'12px 26px',fontSize:15,flexShrink:0}}>
                {loading?(
                  <span style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{width:17,height:17,border:'2.5px solid rgba(255,255,255,.3)',borderTop:'2.5px solid #fff',borderRadius:'50%',display:'inline-block',animation:'spin .8s linear infinite'}}></span>
                    Analyzing...
                  </span>
                ):'Audit my listing'}
              </button>
            </div>
            {error&&<div style={{color:'#FF385C',fontSize:14,background:'#FFF1F2',border:'1px solid #FFC0C7',borderRadius:10,padding:'10px 16px',marginBottom:16}}>{error}</div>}

            <div style={{display:'flex',justifyContent:'center',gap:32,flexWrap:'wrap',marginTop:8}}>
              {[['8','Ranking factors scored'],['30s','Average audit time'],['Free','No credit card']].map(([n,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div className="stat-num" style={{fontSize:22,fontWeight:800,color:'#FF385C',letterSpacing:'-.03em'}}>{n}</div>
                  <div style={{fontSize:12,color:'#717171',marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div style={{maxWidth:900,margin:'0 auto',padding:'24px 16px 80px'}}>

          {/* Re-audit bar */}
          <div className="fade card" style={{padding:'10px 12px',display:'flex',gap:8,marginBottom:20,alignItems:'center'}}>
            <input type="text" value={url} onChange={e=>setUrl(e.target.value)} style={{flex:1,padding:'9px 14px',fontSize:13,borderRadius:8}} placeholder="Airbnb listing URL..."/>
            <button className="cta-btn" onClick={runAudit} disabled={loading} style={{padding:'10px 22px',fontSize:13,borderRadius:9,flexShrink:0}}>{loading?'Analyzing...':'Re-audit'}</button>
          </div>

          {/* Score card */}
          <div className="fade card" style={{padding:'28px 24px',marginBottom:16}}>
            <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:24,alignItems:'center'}} className="two-col">
              {/* Circle */}
              <div style={{position:'relative',width:110,height:110,flexShrink:0}}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke="#F7F7F7" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="46" fill="none" stroke={oc(result.overall)} strokeWidth="10"
                    strokeDasharray={`${(result.overall/100)*289} 289`} strokeLinecap="round"
                    strokeDashoffset="72.2" transform="rotate(-90 55 55)"
                    style={{transition:'stroke-dasharray 1.2s cubic-bezier(.34,1.56,.64,1)'}}/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:30,fontWeight:900,color:oc(result.overall),lineHeight:1,letterSpacing:'-.04em'}}>{result.overall}</span>
                  <span style={{fontSize:11,color:'#B0B0B0'}}>/100</span>
                </div>
              </div>

              {/* Info */}
              <div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                  <span style={{background:gbg(result.overall/10),color:gc(result.overall/10),border:`1.5px solid ${gborder(result.overall/10)}`,padding:'3px 12px',borderRadius:99,fontSize:12,fontWeight:700}}>
                    {result.overall>=75?'Good standing':result.overall>=50?'Needs improvement':'Critical issues'}
                  </span>
                </div>
                <h2 style={{fontSize:19,fontWeight:800,color:'#222',marginBottom:10,letterSpacing:'-.02em',lineHeight:1.3}}>{result.title}</h2>
                <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                  {[[goodC,'#00A699','#F0FBF9','Good'],[warnC,'#FC8C00','#FFF6ED','Needs work'],[critC,'#FF385C','#FFF1F2','Critical']].map(([c,col,bg,l])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:6,background:bg,padding:'4px 10px',borderRadius:99}}>
                      <span style={{fontWeight:800,fontSize:14,color:col}}>{c}</span>
                      <span style={{fontSize:12,color:'#717171'}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade */}
              <div style={{textAlign:'center',flexShrink:0}}>
                <div style={{width:60,height:60,borderRadius:14,background:gbg(result.overall/10),border:`2px solid ${gborder(result.overall/10)}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:900,color:gc(result.overall/10),letterSpacing:'-.04em'}}>{grade(result.overall)}</div>
                <div style={{fontSize:10,color:'#B0B0B0',marginTop:5,fontWeight:700,letterSpacing:'.06em'}}>GRADE</div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="fade2 card" style={{marginBottom:16,overflow:'hidden'}}>
            <div className="tab-scroll" style={{display:'flex',borderBottom:'1px solid #E8E8E8',padding:'0 20px',gap:4,overflowX:'auto'}}>
              {TABS.map(t=>(
                <button key={t} className={`tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)} style={{marginRight:12,paddingBottom:14,paddingTop:14}}>
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>

            <div style={{padding:'24px 20px'}}>

              {/* ====== OVERVIEW ====== */}
              {activeTab==='overview'&&(
                <div className="fade">
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}} className="three-col">
                    {[[goodC,'#00A699','#F0FBF9','#B2E4DF','Good factors'],
                      [warnC,'#FC8C00','#FFF6ED','#FDDBA8','Needs work'],
                      [critC,'#FF385C','#FFF1F2','#FFC0C7','Critical']].map(([n,col,bg,bord,l])=>(
                      <div key={l} style={{background:bg,border:`1.5px solid ${bord}`,borderRadius:14,padding:'18px 16px',textAlign:'center'}}>
                        <div style={{fontSize:36,fontWeight:900,color:col,letterSpacing:'-.04em',lineHeight:1}}>{n}</div>
                        <div style={{fontSize:12,color:'#717171',marginTop:6,fontWeight:600}}>{l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div style={{marginBottom:20}}>
                    <h3 style={{fontSize:15,fontWeight:700,color:'#222',marginBottom:16}}>Score breakdown</h3>
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      {result.factors&&[...result.factors].sort((a,b)=>a.score-b.score).map((f,i)=>(
                        <div key={i} style={{display:'grid',gridTemplateColumns:'130px 1fr 52px',alignItems:'center',gap:12}}>
                          <span style={{fontSize:12,color:'#717171',fontWeight:500,textAlign:'right',lineHeight:1.3}}>{f.name}</span>
                          <div style={{height:8,background:'#F7F7F7',borderRadius:99,overflow:'hidden',border:'1px solid #E8E8E8'}}>
                            <div style={{height:8,width:`${f.score*10}%`,background:gc(f.score),borderRadius:99,transition:`width ${.5+i*.08}s cubic-bezier(.34,1.56,.64,1)`,animation:'barGrow .8s ease'}}></div>
                          </div>
                          <span style={{fontSize:13,fontWeight:800,color:gc(f.score),letterSpacing:'-.01em'}}>{f.score}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top fix preview */}
                  <div style={{background:'#FFF1F2',border:'1.5px solid #FFC0C7',borderRadius:14,padding:'18px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                    <div style={{flex:1,minWidth:240}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#FF385C',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>{ICONS.warning} Top priority</div>
                      <p style={{fontSize:14,color:'#222',lineHeight:1.65}}>{result.fix1}</p>
                    </div>
                    <button onClick={()=>setActiveTab('fixes')} style={{background:'#FF385C',color:'#fff',border:'none',padding:'10px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:6}}>
                      Full action plan {ICONS.arrow}
                    </button>
                  </div>
                </div>
              )}

              {/* ====== FACTORS ====== */}
              {activeTab==='factors'&&(
                <div className="fade">
                  {/* Filters */}
                  <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
                    <button className={`pill-btn ${filter==='all'?'active':''}`} onClick={()=>setFilter('all')}>All factors ({result.factors?.length})</button>
                    <button className={`pill-btn ${filter==='good'?'active-good':''}`} onClick={()=>setFilter('good')} style={filter==='good'?{}:{borderColor:'#00A699',color:'#00A699'}}>
                      <span style={{display:'flex',alignItems:'center',gap:5}}>{ICONS.check} Good ({goodC})</span>
                    </button>
                    <button className={`pill-btn ${filter==='work'?'active-warn':''}`} onClick={()=>setFilter('work')} style={filter==='work'?{}:{borderColor:'#FC8C00',color:'#FC8C00'}}>
                      <span style={{display:'flex',alignItems:'center',gap:5}}>{ICONS.warning} Needs work ({warnC})</span>
                    </button>
                    <button className={`pill-btn ${filter==='critical'?'active-crit':''}`} onClick={()=>setFilter('critical')} style={filter==='critical'?{}:{borderColor:'#FF385C',color:'#FF385C'}}>
                      <span style={{display:'flex',alignItems:'center',gap:5}}>{ICONS.critical} Critical ({critC})</span>
                    </button>
                  </div>

                  {filteredFactors.length===0&&(
                    <div style={{textAlign:'center',padding:'40px 20px',color:'#717171',fontSize:14}}>No factors in this category</div>
                  )}

                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {filteredFactors.map((f,i)=>{
                      const meta = FACTOR_META[f.name]||{};
                      const isOpen = expandedFactor===i+f.name;
                      return (
                        <div key={i} className={`factor-row ${isOpen?'open':''}`} onClick={()=>setExpandedFactor(isOpen?null:i+f.name)}>
                          <div style={{display:'flex',alignItems:'center',gap:14}}>
                            <div style={{width:38,height:38,borderRadius:10,background:gbg(f.score),border:`1.5px solid ${gborder(f.score)}`,display:'flex',alignItems:'center',justifyContent:'center',color:gc(f.score),flexShrink:0}}>
                              {ICONS[meta.icon]||ICONS.title}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}>
                                <span style={{fontSize:14,fontWeight:700,color:'#222'}}>{f.name}</span>
                                <div style={{display:'flex',alignItems:'center',gap:8}}>
                                  <span style={{fontSize:12,fontWeight:700,color:gc(f.score),background:gbg(f.score),border:`1px solid ${gborder(f.score)}`,padding:'2px 9px',borderRadius:99}}>{gl(f.score)}</span>
                                  <span style={{fontSize:18,fontWeight:900,color:gc(f.score),letterSpacing:'-.03em'}}>{f.score}<span style={{fontSize:12,fontWeight:500,color:'#B0B0B0'}}>/10</span></span>
                                </div>
                              </div>
                              <div style={{height:5,background:'#F7F7F7',borderRadius:99,marginTop:8,overflow:'hidden'}}>
                                <div style={{height:5,width:`${f.score*10}%`,background:gc(f.score),borderRadius:99,transition:'width .8s ease'}}></div>
                              </div>
                            </div>
                          </div>

                          {isOpen&&(
                            <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid #F0F0F0',display:'grid',gap:12}} className="two-col" onClick={e=>e.stopPropagation()}>
                              <div style={{background:'#F7F7F7',borderRadius:10,padding:'14px 16px'}}>
                                <div style={{fontSize:11,fontWeight:700,color:'#717171',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>{ICONS.eye} Why this matters</div>
                                <p style={{fontSize:13,color:'#222',lineHeight:1.65}}>{meta.tip}</p>
                              </div>
                              <div>
                                <div style={{background:gbg(f.score),border:`1px solid ${gborder(f.score)}`,borderRadius:10,padding:'14px 16px',marginBottom:10}}>
                                  <div style={{fontSize:11,fontWeight:700,color:gc(f.score),textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>{ICONS.edit} Your action</div>
                                  <p style={{fontSize:13,color:'#222',lineHeight:1.65}}>{meta.action}</p>
                                </div>
                                <div style={{background:'#F7F7F7',borderRadius:10,padding:'12px 14px'}}>
                                  <div style={{fontSize:11,fontWeight:700,color:'#717171',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4,display:'flex',alignItems:'center',gap:5}}>{ICONS.trending} Benchmark</div>
                                  <p style={{fontSize:12,color:'#717171',lineHeight:1.6}}>{meta.benchmark}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ====== DESCRIPTION ====== */}
              {activeTab==='description'&&(
                <div className="fade">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:8}}>
                    <div>
                      <h3 style={{fontSize:16,fontWeight:700,color:'#222',marginBottom:4}}>Description analysis</h3>
                      <p style={{fontSize:13,color:'#717171'}}>See how your description compares to a top-performing version</p>
                    </div>
                    <div style={{display:'flex',gap:6}}>
                      <button className={`pill-btn ${!showAfter?'active':''}`} onClick={()=>setShowAfter(false)}>Current</button>
                      <button className={`pill-btn ${showAfter?'active':''}`} onClick={()=>setShowAfter(true)} style={!showAfter?{borderColor:'#00A699',color:'#00A699'}:{}}>Optimized version</button>
                    </div>
                  </div>

                  {/* Issues / strengths */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}} className="two-col">
                    <div style={{background:'#FFF1F2',border:'1.5px solid #FFC0C7',borderRadius:12,padding:'14px 16px'}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#FF385C',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>Issues found</div>
                      {['No emotional opening sentence','Missing neighborhood name','No mention of who it suits best','Generic "clean and comfortable" language','No specific nearby landmarks'].map((item,i)=>(
                        <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:7}}>
                          <span style={{color:'#FF385C',flexShrink:0,marginTop:1}}>{ICONS.critical}</span>
                          <span style={{fontSize:13,color:'#222',lineHeight:1.5}}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'#F0FBF9',border:'1.5px solid #B2E4DF',borderRadius:12,padding:'14px 16px'}}>
                      <div style={{fontSize:11,fontWeight:700,color:'#00A699',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>What works</div>
                      {['Mentions kitchen and wifi clearly','Good amenity coverage','Flexible check-in mentioned','Honest about what to expect'].map((item,i)=>(
                        <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:7}}>
                          <span style={{color:'#00A699',flexShrink:0,marginTop:1}}>{ICONS.check}</span>
                          <span style={{fontSize:13,color:'#222',lineHeight:1.5}}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Before / After */}
                  <div style={{borderRadius:14,overflow:'hidden',border:'1.5px solid #E8E8E8'}}>
                    <div style={{background:showAfter?'#F0FBF9':'#FFF1F2',padding:'10px 18px',display:'flex',alignItems:'center',gap:8,borderBottom:'1px solid #E8E8E8'}}>
                      <span style={{fontSize:12,fontWeight:700,color:showAfter?'#00A699':'#FF385C',textTransform:'uppercase',letterSpacing:'.06em'}}>
                        {showAfter?'Optimized description':'Current description'}
                      </span>
                      {showAfter&&<span style={{fontSize:11,background:'#00A699',color:'#fff',padding:'2px 8px',borderRadius:99,fontWeight:700}}>AI rewrite</span>}
                    </div>
                    <div style={{background:'#fff',padding:'20px'}}>
                      <p style={{fontSize:14,color:'#222',lineHeight:1.8,whiteSpace:'pre-line'}}>{showAfter?MOCK_DESCRIPTION_AFTER:MOCK_DESCRIPTION_BEFORE}</p>
                    </div>
                    <div style={{background:'#F7F7F7',padding:'12px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #E8E8E8',flexWrap:'wrap',gap:8}}>
                      <span style={{fontSize:12,color:'#717171'}}>{showAfter?'357':'283'} words · {showAfter?'Optimized':'Below recommended 400 words'}</span>
                      {!showAfter&&<button onClick={()=>setShowAfter(true)} style={{background:'#FF385C',color:'#fff',border:'none',padding:'7px 16px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>See optimized version</button>}
                    </div>
                  </div>

                  <div style={{background:'#F7F7F7',border:'1px solid #E8E8E8',borderRadius:12,padding:'14px 18px',marginTop:12}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#717171',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Pro tips for your description</div>
                    {['Open with a feeling, not a feature — "Wake up to city views" beats "2-bedroom apartment"','Name your exact neighborhood in the first paragraph — it is a ranking signal','Describe your ideal guest in line 3 — couples, remote workers, families — to attract the right bookers','End with your 3 best nearby spots by name — Airbnb uses this for location relevance scoring'].map((t,i)=>(
                      <div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'flex-start'}}>
                        <span style={{color:'#FF385C',flexShrink:0,marginTop:1,fontWeight:800,fontSize:12}}>{i+1}.</span>
                        <span style={{fontSize:13,color:'#222',lineHeight:1.6}}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====== REVIEWS ====== */}
              {activeTab==='reviews'&&(
                <div className="fade">
                  {/* Summary */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}} className="three-col">
                    <div style={{background:'#F0FBF9',border:'1.5px solid #B2E4DF',borderRadius:14,padding:'16px',textAlign:'center'}}>
                      <div style={{fontSize:32,fontWeight:900,color:'#00A699',letterSpacing:'-.04em'}}>4.2</div>
                      <div style={{display:'flex',justifyContent:'center',gap:2,margin:'4px 0'}}>
                        {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=4?'#FC8C00':'#E8E8E8'}}>{ICONS.star}</span>)}
                      </div>
                      <div style={{fontSize:12,color:'#717171',fontWeight:600}}>Avg rating</div>
                    </div>
                    <div style={{background:'#F7F7F7',border:'1px solid #E8E8E8',borderRadius:14,padding:'16px',textAlign:'center'}}>
                      <div style={{fontSize:32,fontWeight:900,color:'#222',letterSpacing:'-.04em'}}>4</div>
                      <div style={{fontSize:12,color:'#717171',marginTop:6,fontWeight:600}}>Recent reviews</div>
                    </div>
                    <div style={{background:'#FFF1F2',border:'1.5px solid #FFC0C7',borderRadius:14,padding:'16px',textAlign:'center'}}>
                      <div style={{fontSize:32,fontWeight:900,color:'#FF385C',letterSpacing:'-.04em'}}>1</div>
                      <div style={{fontSize:12,color:'#717171',marginTop:6,fontWeight:600}}>Issues flagged</div>
                    </div>
                  </div>

                  {/* Keyword cloud */}
                  <div style={{background:'#F7F7F7',border:'1px solid #E8E8E8',borderRadius:14,padding:'16px 18px',marginBottom:16}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#717171',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Keywords guests mention</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                      {[['location',5,'#00A699'],['clean',4,'#00A699'],['responsive',3,'#FC8C00'],['check-in',3,'#00A699'],['wifi issue',2,'#FF385C'],['comfortable',3,'#00A699'],['views',2,'#FC8C00'],['misleading photos',1,'#FF385C'],['kitchen',2,'#00A699'],['neighborhood',2,'#FC8C00']].map(([kw,count,col])=>(
                        <span key={kw} style={{background:col==='#00A699'?'#F0FBF9':col==='#FC8C00'?'#FFF6ED':'#FFF1F2',color:col,border:`1px solid ${col==='#00A699'?'#B2E4DF':col==='#FC8C00'?'#FDDBA8':'#FFC0C7'}`,padding:'5px 12px',borderRadius:99,fontSize:12,fontWeight:600}}>
                          {kw} <span style={{opacity:.6}}>({count})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Review cards */}
                  <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:16}}>
                    {MOCK_REVIEWS.map((r,i)=>(
                      <div key={i} className="review-card">
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12,flexWrap:'wrap',gap:8}}>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <div style={{width:36,height:36,borderRadius:'50%',background:'#F7F7F7',border:'1px solid #E8E8E8',display:'flex',alignItems:'center',justifyContent:'center',color:'#717171'}}>{ICONS.user}</div>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,color:'#222'}}>{r.name}</div>
                              <div style={{fontSize:12,color:'#717171',display:'flex',alignItems:'center',gap:4}}>{ICONS.calendar}{r.date}</div>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:4,alignItems:'center'}}>
                            {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=r.rating?'#FC8C00':'#E8E8E8'}}>{ICONS.star}</span>)}
                            <span style={{fontSize:12,fontWeight:700,color:'#717171',marginLeft:4}}>{r.rating}.0</span>
                          </div>
                        </div>
                        <p style={{fontSize:14,color:'#222',lineHeight:1.7,marginBottom:12}}>{r.text}</p>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap',paddingTop:12,borderTop:'1px solid #F0F0F0'}}>
                          <span style={{fontSize:11,fontWeight:700,color:'#717171',marginRight:4}}>Keywords:</span>
                          {r.keywords.map(k=>(
                            <span key={k} style={{fontSize:11,background:'#F7F7F7',border:'1px solid #E8E8E8',color:'#717171',padding:'2px 8px',borderRadius:99}}>{k}</span>
                          ))}
                        </div>
                        {r.sentiment==='negative'&&(
                          <div style={{marginTop:12,background:'#FFF1F2',border:'1px solid #FFC0C7',borderRadius:8,padding:'10px 14px',display:'flex',gap:8,alignItems:'flex-start'}}>
                            <span style={{color:'#FF385C',flexShrink:0,marginTop:1}}>{ICONS.warning}</span>
                            <p style={{fontSize:12,color:'#222',lineHeight:1.6}}><strong>Action needed:</strong> This guest mentioned misleading photos. Update your listing photos or description to better match reality — this directly prevents similar reviews.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* How to improve reviews */}
                  <div style={{background:'#F7F7F7',border:'1px solid #E8E8E8',borderRadius:14,padding:'18px'}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#222',marginBottom:12}}>How to improve your review quality</div>
                    {[
                      ['Send a mid-stay check-in message','On day 2 of every stay, send: "Hi [name], hope everything is going well! Let me know if you need anything." This catches issues before they become bad reviews.'],
                      ['Ask for specific feedback in checkout message','Say "If you enjoyed the location, I would love it if you mentioned it in your review — it really helps other guests find us." Guests repeat what you prompt.'],
                      ['Respond to every review within 24 hours','Your response is public and shows future guests you are attentive. Even 1-2 sentences on a 5-star review signals professionalism.'],
                      ['Fix photo accuracy immediately','The most common 3-star complaint is "smaller than photos." Reshoot with a wide-angle lens and add a floor plan photo to set accurate expectations.']
                    ].map(([title,desc],i)=>(
                      <div key={i} style={{display:'flex',gap:12,marginBottom:i<3?14:0,paddingBottom:i<3?14:0,borderBottom:i<3?'1px solid #E8E8E8':'none'}}>
                        <div style={{width:26,height:26,borderRadius:8,background:'#FF385C',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,flexShrink:0}}>{i+1}</div>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:'#222',marginBottom:4}}>{title}</div>
                          <div style={{fontSize:13,color:'#717171',lineHeight:1.6}}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====== FIXES ====== */}
              {activeTab==='fixes'&&(
                <div className="fade">
                  <div style={{display:'flex',alignItems:'center',gap:10,background:'#FFF1F2',border:'1px solid #FFC0C7',borderRadius:12,padding:'12px 16px',marginBottom:20}}>
                    <span style={{color:'#FF385C'}}>{ICONS.trending}</span>
                    <p style={{fontSize:13,color:'#222',lineHeight:1.5}}>Implement these fixes in order — each one builds on the last. Most hosts see a measurable ranking improvement within 2 weeks.</p>
                  </div>

                  {[
                    {fix:result.fix1,priority:'Highest impact',label:'Do this first',col:'#FF385C',bg:'#FFF1F2',bord:'#FFC0C7',time:'30 min',effort:'Low'},
                    {fix:result.fix2,priority:'High impact',label:'Do this second',col:'#FC8C00',bg:'#FFF6ED',bord:'#FDDBA8',time:'1 hour',effort:'Low'},
                    {fix:result.fix3,priority:'Medium impact',label:'Do this third',col:'#00A699',bg:'#F0FBF9',bord:'#B2E4DF',time:'45 min',effort:'Medium'},
                  ].map(({fix,priority,label,col,bg,bord,time,effort},i)=>(
                    <div key={i} style={{background:'#fff',border:`1.5px solid ${bord}`,borderRadius:16,padding:'20px',marginBottom:12,overflow:'hidden',position:'relative'}}>
                      <div style={{position:'absolute',top:0,left:0,width:4,height:'100%',background:col,borderRadius:'99px 0 0 99px'}}></div>
                      <div style={{paddingLeft:12}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8,marginBottom:10}}>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            <div style={{width:28,height:28,borderRadius:8,background:col,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,flexShrink:0}}>{i+1}</div>
                            <div>
                              <div style={{fontSize:11,fontWeight:700,color:col,textTransform:'uppercase',letterSpacing:'.06em'}}>{priority}</div>
                              <div style={{fontSize:12,color:'#717171'}}>{label}</div>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:8}}>
                            <span style={{fontSize:11,background:bg,color:col,border:`1px solid ${bord}`,padding:'3px 10px',borderRadius:99,fontWeight:600}}>{time}</span>
                            <span style={{fontSize:11,background:'#F7F7F7',color:'#717171',border:'1px solid #E8E8E8',padding:'3px 10px',borderRadius:99,fontWeight:600}}>Effort: {effort}</span>
                          </div>
                        </div>
                        <p style={{fontSize:14,color:'#222',lineHeight:1.7,marginBottom:12}}>{fix}</p>
                        <div style={{background:'#F7F7F7',borderRadius:8,padding:'10px 14px'}}>
                          <span style={{fontSize:12,fontWeight:700,color:'#717171',textTransform:'uppercase',letterSpacing:'.05em'}}>Where to do this: </span>
                          <span style={{fontSize:12,color:'#222'}}>{i===0?'Airbnb app → Your listings → Edit listing → Listing basics → Title':i===1?'Airbnb app → Your listings → Edit listing → Photos → Add photos':'Airbnb app → Your listings → Edit listing → Booking settings → Instant book'}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{background:'#F7F7F7',border:'1px solid #E8E8E8',borderRadius:14,padding:'18px',textAlign:'center'}}>
                    <div style={{fontSize:14,fontWeight:700,color:'#222',marginBottom:6}}>After implementing all 3 fixes</div>
                    <p style={{fontSize:13,color:'#717171',marginBottom:14}}>Come back and re-audit to see how your score improved</p>
                    <button onClick={runAudit} className="cta-btn" style={{padding:'11px 24px',fontSize:14}}>Re-audit this listing</button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Email CTA */}
          <div className="fade3">
            {!saved?(
              <div className="card" style={{padding:'22px 20px'}}>
                <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:220}}>
                    <h3 style={{fontSize:15,fontWeight:700,color:'#222',marginBottom:4}}>Track your ranking score over time</h3>
                    <p style={{fontSize:13,color:'#717171',lineHeight:1.5}}>Get a monthly re-audit reminder and see your ranking improve as you implement fixes.</p>
                  </div>
                  <div style={{display:'flex',gap:8,flex:1,minWidth:260}}>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{flex:1,padding:'11px 14px',fontSize:14}}/>
                    <button onClick={saveResult} style={{background:'#222',color:'#fff',border:'none',padding:'11px 22px',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Save free</button>
                  </div>
                </div>
              </div>
            ):(
              <div className="card" style={{padding:'24px',textAlign:'center',background:'#F0FBF9',borderColor:'#B2E4DF'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:'#00A699',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',color:'#fff'}}>{ICONS.check}</div>
                <p style={{fontSize:16,fontWeight:700,color:'#014541',marginBottom:4}}>Saved — check your email</p>
                <p style={{fontSize:13,color:'#717171'}}>We will remind you to re-audit next month so you can track your progress.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{borderTop:'1px solid #E8E8E8',padding:'24px',textAlign:'center',background:'#fff'}}>
        <p style={{fontSize:13,color:'#B0B0B0'}}>ListingLens · AI-powered Airbnb listing auditor · Free forever</p>
      </footer>
    </>
  );
}
