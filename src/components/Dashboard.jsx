import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { API_BASE } from "../api";
import "./Dashboard.css";

const API = API_BASE;

const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const STATUS_COLOR = {
  Pending:   { bg: "rgba(243, 156, 18, 0.15)", text: "#f39c12" },
  Approved:  { bg: "rgba(46, 204, 113, 0.15)", text: "#2ecc71" },
  Completed: { bg: "rgba(52, 152, 219, 0.15)", text: "#3498db" },
  Cancelled: { bg: "rgba(231, 76, 60, 0.15)", text: "#e74c3c" },
};

// ── MODERNIZED ICON CONFIGURATION ──
const STAT_CARDS = [
  { key: "total_patients",    label: "Total Patients",        iconClass: "bi bi-people-fill",          accent: "#3498db" },
  { key: "today_appointments",    label: "Today's Appointments",  iconClass: "bi bi-calendar-check-fill",  accent: "#2ecc71" },
  { key: "total_employees",       label: "Active Employees",      iconClass: "bi bi-person-badge-fill",    accent: "#9b59b6" },
];

function StarRating({ rating }) {
  return (
    <span className="db-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? "db-star on" : "db-star off"}>
          <i className="bi bi-star-fill" />
        </span>
      ))}
    </span>
  );
}

function Dashboard({ refreshToken = 0, isVisible = true }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState(new Date());
  const mountedRef = useRef(true);

  const refresh = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    fetch(`${API}/dashboard/`)
      .then((r) => {
        if (!r.ok) throw new Error("Dashboard load failed");
        return r.json();
      })
      .then((d) => {
        if (!mountedRef.current) return;
        if (!d.error) setData(d);
      })
      .catch(() => { /* keep previous data on silent refresh */ })
      .finally(() => {
        if (!mountedRef.current) return;
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => {
      mountedRef.current = false;
      clearInterval(tick);
    };
  }, [refresh]);

  useEffect(() => {
    if (refreshToken > 0) refresh(true);
  }, [refreshToken, refresh]);

  useEffect(() => {
    if (!isVisible) return;
    refresh(true);
    const id = setInterval(() => refresh(true), 30000);
    return () => clearInterval(id);
  }, [isVisible, refresh]);

  const stats = data?.stats || {};
  const recentAppts = data?.recent_appointments || [];
  const recentReviews = data?.recent_reviews || [];
  const lowStock = data?.low_stock_items || [];

  return (
    <div className="db-container">
      {/* ── Top Bar ── */}
      <div className="db-topbar">
        <div className="db-topbar-left">
          <h1 className="db-title">Dashboard Overview</h1>
        </div>
        <div className="db-topbar-right">
          <div className="db-clock">
            <span className="db-clock-time">
              {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span className="db-clock-date">
              {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <button className="db-refresh-btn" onClick={() => refresh(true)} disabled={refreshing}>
            <i className="bi bi-arrow-clockwise" /> {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="db-loading">
          <div className="db-spinner" />
          <span>Loading dashboard content...</span>
        </div>
      ) : (
        <>
          {/* ── Stat Cards Grid ── */}
          <div className="db-stats-grid">
            {STAT_CARDS.map((card) => (
              <div className="db-stat-card" key={card.key} style={{ "--accent-glow": card.accent }}>
                <div className="db-stat-icon" style={{ color: card.accent }}>
                  <i className={card.iconClass} />
                </div>
                <div className="db-stat-body">
                  <span className="db-stat-value">{stats[card.key] ?? 0}</span>
                  <span className="db-stat-label">{card.label}</span>
                </div>
                <div className="db-stat-glow" />
              </div>
            ))}
            <div className="db-stat-card" style={{ "--accent-glow": "#f1c40f" }}>
              <div className="db-stat-icon" style={{ color: "#f1c40f" }}>
                <i className="bi bi-star-fill" />
              </div>
              <div className="db-stat-body">
                <span className="db-stat-value">{stats.avg_rating ?? "—"}<span className="db-stat-unit">/5</span></span>
                <span className="db-stat-label">Average Rating</span>
              </div>
              <div className="db-stat-glow" />
            </div>
          </div>

          {/* ── Main Content Split Grid ── */}
          <div className="db-main-grid">
            
            {/* Row 1: Financial Overview Trend Chart */}
            <div className="db-widget db-finance-overview">
              <div className="db-widget-header">
                <div>
                  <h3>Financial Overview</h3>
                  <span className="db-widget-sub">Monthly Income vs Expenses Matrix</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data?.financial_comparison || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-m)', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-m)', fontSize: 10}} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }} labelStyle={{ color: 'var(--text-h)' }} />
                  <Area type="monotone" dataKey="income" stroke="#2ecc71" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expenses" stroke="#e74c3c" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Row 1: Recent Appointments */}
            <div className="db-widget db-appts-widget">
              <div className="db-widget-header">
                <div>
                  <h3>Recent Appointments</h3>
                  <span className="db-widget-sub">Latest updates ledger</span>
                </div>
              </div>
              <div className="db-appt-list">
                {recentAppts.length === 0 ? (
                  <div className="db-empty">No appointments scheduled yet.</div>
                ) : recentAppts.slice(0, 5).map((a, i) => {
                  const sc = STATUS_COLOR[a.status] || STATUS_COLOR.Pending;
                  return (
                    <div className="db-appt-row" key={i}>
                      <div className="db-appt-avatar">{(a.patient_name || "?").charAt(0).toUpperCase()}</div>
                      <div className="db-appt-info">
                        <span className="db-appt-name">{a.patient_name || "Unknown"}</span>
                        <span className="db-appt-service">{a.date}</span>
                      </div>
                      <span className="db-appt-status" style={{ background: sc.bg, color: sc.text }}>
                        {a.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Low Stock Notifications */}
            <div className="db-widget db-stock-widget">
              <div className="db-widget-header">
                <div>
                  <h3>Low Stock Alerts</h3>
                  <span className="db-widget-sub">{stats.low_stock_count} items need care</span>
                </div>
                {stats.low_stock_count > 0 && (
                  <span className="db-alert-chip">
                    <i className="bi bi-exclamation-triangle-fill" /> Low Stock
                  </span>
                )}
              </div>
              <div className="db-stock-list">
                {lowStock.length === 0 ? (
                  <div className="db-empty db-stock-ok">✓ Material logs adequately stocked</div>
                ) : lowStock.slice(0, 4).map((item, i) => (
                  <div className="db-stock-row" key={i}>
                    <div className="db-stock-info">
                      <span className="db-stock-name">{item.name}</span>
                      <div className="db-stock-bar">
                        <div className={`db-stock-fill ${item.quantity <= 0 ? "out" : "low"}`} style={{ width: `${Math.min((item.quantity / item.threshold) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <span className={`db-stock-qty ${item.quantity <= 0 ? "out" : "low"}`}>{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Recent Feedback Reviews */}
            <div className="db-widget db-reviews-widget">
              <div className="db-widget-header">
                <div>
                  <h3>Recent Reviews</h3>
                  <span className="db-widget-sub">Patient operational responses</span>
                </div>
                <span className="db-rating-chip">★ {stats.avg_rating ?? "—"}</span>
              </div>
              <div className="db-review-list">
                {recentReviews.length === 0 ? (
                  <div className="db-empty">No patient evaluations recorded.</div>
                ) : recentReviews.slice(0, 3).map((r, i) => (
                  <div className="db-review-row" key={i}>
                    <div className="db-review-body">
                      <div className="db-review-top">
                        <span className="db-review-name">{r.customer_name}</span>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className="db-review-comment">"{r.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import {
//   XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, AreaChart, Area 
// } from "recharts";
// import "./Dashboard.css";

// const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

// const STATUS_COLOR = {
//   Pending:   { bg: "rgba(243, 156, 18, 0.15)", text: "#f39c12" },
//   Approved:  { bg: "rgba(46, 204, 113, 0.15)", text: "#2ecc71" },
//   Completed: { bg: "rgba(52, 152, 219, 0.15)", text: "#3498db" },
//   Cancelled: { bg: "rgba(231, 76, 60, 0.15)", text: "#e74c3c" },
// };

// const STAT_CARDS = [
//   { key: "total_patients",    label: "Total Patients",        icon: "👥", accent: "#3498db" },
//   { key: "today_appointments",    label: "Today's Appointments",  icon: "📅", accent: "#2ecc71" },
//   { key: "total_employees",       label: "Active Employees",      icon: "👤", accent: "#3498db" },
// ];

// function StarRating({ rating }) {
//   return (
//     <span className="db-stars">
//       {[1, 2, 3, 4, 5].map(i => (
//         <span key={i} className={i <= rating ? "db-star on" : "db-star off"}>★</span>
//       ))}
//     </span>
//   );
// }

// function Dashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     refresh();
//     const tick = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(tick);
//   }, []);

//   const refresh = () => {
//     setLoading(true);
//     fetch("http://127.0.0.1:8000/dashboard/")
//       .then(r => r.json())
//       .then(d => { setData(d); setLoading(false); })
//       .catch(() => setLoading(false));
//   };

//   const stats = data?.stats || {};
//   const recentAppts = data?.recent_appointments || [];
//   const recentReviews = data?.recent_reviews || [];
//   const lowStock = data?.low_stock_items || [];

//   return (
//     <div className="db-container">
//       {/* ── Top Bar ── */}
//       <div className="db-topbar">
//         <div className="db-topbar-left">
//           <h1 className="db-title">Dashboard Overview</h1>
//         </div>
//         <div className="db-topbar-right">
//           <div className="db-clock">
//             <span className="db-clock-time">
//               {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
//             </span>
//             <span className="db-clock-date">
//               {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
//             </span>
//           </div>
//           <button className="db-refresh-btn" onClick={refresh}>↻ Refresh</button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="db-loading">
//           <div className="db-spinner" />
//           <span>Loading dashboard content...</span>
//         </div>
//       ) : (
//         <>
//           {/* ── Stat Cards Grid ── */}
//           <div className="db-stats-grid">
//             {STAT_CARDS.map((card) => (
//               <div className="db-stat-card" key={card.key} style={{ "--accent-glow": card.accent }}>
//                 <div className="db-stat-icon">{card.icon}</div>
//                 <div className="db-stat-body">
//                   <span className="db-stat-value">{stats[card.key] ?? 0}</span>
//                   <span className="db-stat-label">{card.label}</span>
//                 </div>
//                 <div className="db-stat-glow" />
//               </div>
//             ))}
//             <div className="db-stat-card" style={{ "--accent-glow": "#f1c40f" }}>
//               <div className="db-stat-icon">⭐</div>
//               <div className="db-stat-body">
//                 <span className="db-stat-value">{stats.avg_rating ?? "—"}<span className="db-stat-unit">/5</span></span>
//                 <span className="db-stat-label">Average Rating</span>
//               </div>
//               <div className="db-stat-glow" />
//             </div>
//           </div>

//           {/* ── Main Content Split Grid ── */}
//           <div className="db-main-grid">
            
//             {/* Row 1: Financial Overview Trend Chart */}
//             <div className="db-widget db-finance-overview">
//               <div className="db-widget-header">
//                 <div>
//                   <h3>Financial Overview</h3>
//                   <span className="db-widget-sub">Monthly Income vs Expenses Matrix</span>
//                 </div>
//               </div>
//               <ResponsiveContainer width="100%" height={250}>
//                 <AreaChart data={data?.financial_comparison || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.15}/>
//                       <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
//                     </linearGradient>
//                     <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.15}/>
//                       <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-m)', fontSize: 11}} />
//                   <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-m)', fontSize: 10}} tickFormatter={(v) => `${v/1000}k`} />
//                   <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }} labelStyle={{ color: 'var(--text-h)' }} />
//                   <Area type="monotone" dataKey="income" stroke="#2ecc71" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
//                   <Area type="monotone" dataKey="expenses" stroke="#e74c3c" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Row 1: Recent Appointments */}
//             <div className="db-widget db-appts-widget">
//               <div className="db-widget-header">
//                 <div>
//                   <h3>Recent Appointments</h3>
//                   <span className="db-widget-sub">Latest updates ledger</span>
//                 </div>
//               </div>
//               <div className="db-appt-list">
//                 {recentAppts.length === 0 ? (
//                   <div className="db-empty">No appointments scheduled yet.</div>
//                 ) : recentAppts.slice(0, 5).map((a, i) => {
//                   const sc = STATUS_COLOR[a.status] || STATUS_COLOR.Pending;
//                   return (
//                     <div className="db-appt-row" key={i}>
//                       <div className="db-appt-avatar">{a.patient_name.charAt(0).toUpperCase()}</div>
//                       <div className="db-appt-info">
//                         <span className="db-appt-name">{a.patient_name}</span>
//                         <span className="db-appt-service">{a.date}</span>
//                       </div>
//                       <span className="db-appt-status" style={{ background: sc.bg, color: sc.text }}>
//                         {a.status}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Row 2: Low Stock Notifications */}
//             <div className="db-widget db-stock-widget">
//               <div className="db-widget-header">
//                 <div>
//                   <h3>Low Stock Alerts</h3>
//                   <span className="db-widget-sub">{stats.low_stock_count} items below baseline parameters</span>
//                 </div>
//                 {stats.low_stock_count > 0 && <span className="db-alert-chip">⚠</span>}
//               </div>
//               <div className="db-stock-list">
//                 {lowStock.length === 0 ? (
//                   <div className="db-empty db-stock-ok">✓ Material logs adequately stocked</div>
//                 ) : lowStock.slice(0, 4).map((item, i) => (
//                   <div className="db-stock-row" key={i}>
//                     <div className="db-stock-info">
//                       <span className="db-stock-name">{item.name}</span>
//                       <div className="db-stock-bar">
//                         <div className={`db-stock-fill ${item.quantity <= 0 ? "out" : "low"}`} style={{ width: `${Math.min((item.quantity / item.threshold) * 100, 100)}%` }} />
//                       </div>
//                     </div>
//                     <span className={`db-stock-qty ${item.quantity <= 0 ? "out" : "low"}`}>{item.quantity}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Row 2: Recent Feedback Reviews */}
//             <div className="db-widget db-reviews-widget">
//               <div className="db-widget-header">
//                 <div>
//                   <h3>Recent Reviews</h3>
//                   <span className="db-widget-sub">Patient operational responses</span>
//                 </div>
//                 <span className="db-rating-chip">★ {stats.avg_rating ?? "—"}</span>
//               </div>
//               <div className="db-review-list">
//                 {recentReviews.length === 0 ? (
//                   <div className="db-empty">No patient evaluations recorded.</div>
//                 ) : recentReviews.slice(0, 3).map((r, i) => (
//                   <div className="db-review-row" key={i}>
//                     <div className="db-review-body">
//                       <div className="db-review-top">
//                         <span className="db-review-name">{r.customer_name}</span>
//                         <StarRating rating={r.rating} />
//                       </div>
//                       <p className="db-review-comment">"{r.comment}"</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Dashboard;