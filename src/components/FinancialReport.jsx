// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
// //   LineChart, Line, PieChart, Pie, Cell, Tooltip as PieTooltip
// // } from "recharts";
// // import "./FinancialReport.css";

// // const DONUT_COLORS = ["#3498db","#e74c3c","#e67e22","#1abc9c","#9b59b6","#f1c40f","#2ecc71"];

// // const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

// // // ── Custom Tooltip for bar/line charts ────────────────────────────────
// // const CustomTooltip = ({ active, payload, label }) => {
// //   if (!active || !payload?.length) return null;
// //   return (
// //     <div className="fr-tooltip">
// //       <p className="fr-tooltip-label">{label}</p>
// //       {payload.map((p, i) => (
// //         <p key={i} style={{ color: p.color }} className="fr-tooltip-row">
// //           {p.name}: {fmt(p.value)}
// //         </p>
// //       ))}
// //     </div>
// //   );
// // };

// // // ── Custom Donut label ─────────────────────────────────────────────────
// // const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
// //   if (percent < 0.05) return null;
// //   const RADIAN = Math.PI / 180;
// //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
// //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
// //   const y = cy + radius * Math.sin(-midAngle * RADIAN);
// //   return (
// //     <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
// //       {`${(percent * 100).toFixed(0)}%`}
// //     </text>
// //   );
// // };

// // function FinancialReport() {
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const fetchReport = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch("${API}/reports/financial/");
// //       if (!res.ok) throw new Error("Failed to fetch");
// //       const json = await res.json();
// //       setData(json);
// //     } catch (err) {
// //       setError("Could not load financial report. Make sure Django is running.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { fetchReport(); }, []);

// //   const handlePrint = () => window.print();

// //   if (loading) return <div className="fr-loading">Loading financial report...</div>;
// //   if (error) return <div className="fr-error">{error}</div>;
// //   if (!data) return null;

// //   const { summary, bar_chart, line_chart, donut_chart, current_month, months_data } = data;

// //   // Recharts bar data
// //   const barData = (bar_chart?.labels || []).map((label, i) => ({
// //     label,
// //     Income: bar_chart.income[i] || 0,
// //     Expenses: bar_chart.expenses[i] || 0,
// //   }));

// //   // Recharts line data
// //   const lineData = (line_chart?.labels || []).map((label, i) => ({
// //     label,
// //     "Net Profit": line_chart.profit[i] || 0,
// //   }));

// //   // Recharts donut data
// //   const donutData = (donut_chart?.labels || []).map((label, i) => ({
// //     name: label,
// //     value: donut_chart.values[i] || 0,
// //   })).filter(d => d.value > 0);

// //   const isProfit = (summary?.net_profit || 0) >= 0;

// //   return (
// //     <div className="fr-container">

// //       {/* ── Header ── */}
// //       <div className="fr-header no-print">
// //         <div>
// //           <h2>Financial Report</h2>
// //           <span className="fr-subtitle">{current_month}</span>
// //         </div>
// //         <div className="fr-header-actions">
// //           <button className="fr-refresh-btn" onClick={fetchReport}>↻ Refresh</button>
// //           <button className="fr-print-btn" onClick={handlePrint}>Print / Export</button>
// //         </div>
// //       </div>

// //       {/* ── Summary Cards ── */}
// //       <div className="fr-cards">
// //         <div className="fr-card fr-income">
// //           <div className="fr-card-icon">↑</div>
// //           <div className="fr-card-body">
// //             <span className="fr-card-label">Total Income</span>
// //             <span className="fr-card-value">{fmt(summary?.total_income)}</span>
// //             <span className="fr-card-sub">This month's payments</span>
// //           </div>
// //         </div>
// //         <div className="fr-card fr-expenses">
// //           <div className="fr-card-icon">↓</div>
// //           <div className="fr-card-body">
// //             <span className="fr-card-label">Total Expenses</span>
// //             <span className="fr-card-value">{fmt(summary?.total_expenses)}</span>
// //             <span className="fr-card-sub">Salaries + Inventory + Other</span>
// //           </div>
// //         </div>
// //         <div className={`fr-card ${isProfit ? "fr-profit" : "fr-loss"}`}>
// //           <div className="fr-card-icon">{isProfit ? "+" : "-"}</div>
// //           <div className="fr-card-body">
// //             <span className="fr-card-label">Net {isProfit ? "Profit" : "Loss"}</span>
// //             <span className="fr-card-value">{fmt(Math.abs(summary?.net_profit))}</span>
// //             <span className="fr-card-sub">{isProfit ? "Profitable month" : "Loss this month"}</span>
// //           </div>
// //         </div>
// //         <div className="fr-card fr-best">
// //           <div className="fr-card-icon">★</div>
// //           <div className="fr-card-body">
// //             <span className="fr-card-label">Best Month</span>
// //             <span className="fr-card-value fr-best-month">{summary?.best_month}</span>
// //             <span className="fr-card-sub">{fmt(summary?.best_month_profit)} profit</span>
// //           </div>
// //         </div>
// //       </div>

      

// //       {/* ── Line + Donut Row ── */}
// //       <div className="fr-charts-row">

// //         {/* Line Chart: Profit Trend */}
// //         <div className="fr-chart-card fr-chart-half">
// //           <div className="fr-chart-header">
// //             <h3>Profit Trend</h3>
// //             <span className="fr-chart-sub">Last 6 months net profit</span>
// //           </div>
// //           <ResponsiveContainer width="100%" height={240}>
// //             <LineChart data={lineData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
// //               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //               <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#888" }} />
// //               <YAxis tickFormatter={(v) => `Rs.${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#888" }} />
// //               <Tooltip content={<CustomTooltip />} />
// //               <Line
// //                 type="monotone"
// //                 dataKey="Net Profit"
// //                 stroke="#3498db"
// //                 strokeWidth={2.5}
// //                 dot={{ fill: "#3498db", r: 4 }}
// //                 activeDot={{ r: 6 }}
// //               />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* Donut Chart: Expense Breakdown */}
// //         <div className="fr-chart-card fr-chart-half">
// //           <div className="fr-chart-header">
// //             <h3>Expense Breakdown</h3>
// //             <span className="fr-chart-sub">Current month by category</span>
// //           </div>
// //           {donutData.length === 0 ? (
// //             <div className="fr-no-data">No expense data for this month.</div>
// //           ) : (
// //             <div className="fr-donut-wrap">
// //               <ResponsiveContainer width="55%" height={220}>
// //                 <PieChart>
// //                   <Pie
// //                     data={donutData}
// //                     cx="50%" cy="50%"
// //                     innerRadius={55}
// //                     outerRadius={95}
// //                     dataKey="value"
// //                     labelLine={false}
// //                     label={renderDonutLabel}
// //                   >
// //                     {donutData.map((_, i) => (
// //                       <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
// //                     ))}
// //                   </Pie>
// //                   <PieTooltip formatter={(val) => fmt(val)} />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //               <div className="fr-donut-legend">
// //                 {donutData.map((d, i) => (
// //                   <div className="fr-legend-row" key={i}>
// //                     <span className="fr-legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
// //                     <span className="fr-legend-name">{d.name}</span>
// //                     <span className="fr-legend-val">{fmt(d.value)}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* ── Monthly Summary Table ── */}
// //       <div className="fr-chart-card">
// //         <div className="fr-chart-header">
// //           <h3>6-Month Summary</h3>
// //           <span className="fr-chart-sub">Income, expenses and profit per month</span>
// //         </div>
// //         <div className="fr-table-wrap">
// //           <table className="fr-table">
// //             <thead>
// //               <tr>
// //                 <th>Month</th>
// //                 <th>Income</th>
// //                 <th>Expenses</th>
// //                 <th>Net Profit / Loss</th>
// //                 <th>Status</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {(months_data || []).map((m, i) => (
// //                 <tr key={i}>
// //                   <td className="fr-month-cell">{m.label}</td>
// //                   <td className="fr-income-cell">{fmt(m.income)}</td>
// //                   <td className="fr-expense-cell">{fmt(m.expenses)}</td>
// //                   <td className={m.net_profit >= 0 ? "fr-profit-cell" : "fr-loss-cell"}>
// //                     {m.net_profit >= 0 ? "+" : ""}{fmt(m.net_profit)}
// //                   </td>
// //                   <td>
// //                     <span className={`fr-status-badge ${m.net_profit >= 0 ? "profit" : "loss"}`}>
// //                       {m.net_profit >= 0 ? "Profit" : "Loss"}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //     </div>
// //   );
// // }

// // export default FinancialReport;
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   LineChart, Line, PieChart, Pie, Cell,
// } from "recharts";
// import "./FinancialReport.css";

// const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

// const DONUT_COLORS = ["#3b82f6", "#f43f5e", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];

// const MONTH_NAMES = [
//   "January","February","March","April","May","June",
//   "July","August","September","October","November","December"
// ];

// /* ── Tooltip ── */
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="fr-tooltip">
//       <p className="fr-tooltip-label">{label}</p>
//       {payload.map((p, i) => (
//         <p key={i} style={{ color: p.color }} className="fr-tooltip-row">
//           {p.name}: {fmt(p.value)}
//         </p>
//       ))}
//     </div>
//   );
// };

// /* ── Donut % label ── */
// const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   if (percent < 0.06) return null;
//   const R = Math.PI / 180;
//   const r = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + r * Math.cos(-midAngle * R);
//   const y = cy + r * Math.sin(-midAngle * R);
//   return (
//     <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
//       fontSize={12} fontWeight={700}>
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// /* ── Month navigator ── */
// function getMonthKey(offset = 0) {
//   const d = new Date();
//   d.setMonth(d.getMonth() + offset);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// }

// function parseMonthKey(key) {
//   const [y, m] = key.split("-").map(Number);
//   return { year: y, month: m };
// }

// function prevMonth(key) {
//   const { year, month } = parseMonthKey(key);
//   const d = new Date(year, month - 2, 1);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// }

// function nextMonth(key) {
//   const { year, month } = parseMonthKey(key);
//   const d = new Date(year, month, 1);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// }

// function friendlyMonth(key) {
//   const { year, month } = parseMonthKey(key);
//   return `${MONTH_NAMES[month - 1]} ${year}`;
// }

// /* ═══════════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════════ */
// export default function FinancialReport() {
//   const [monthKey, setMonthKey]   = useState(getMonthKey(0));
//   const [data, setData]           = useState(null);
//   const [loading, setLoading]     = useState(true);
//   const [error, setError]         = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");

//   const fetchReport = useCallback(async (key) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`${API}/reports/financial/?month=${key}`);
//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         throw new Error(body.error || `Server error ${res.status}`);
//       }
//       setData(await res.json());
//     } catch (err) {
//       setError(err.message || "Could not load financial report.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchReport(monthKey); }, [monthKey, fetchReport]);

//   const goBack = () => setMonthKey(prevMonth(monthKey));
//   const goNext = () => {
//     const nk = nextMonth(monthKey);
//     if (nk <= getMonthKey(0)) setMonthKey(nk);
//   };
//   const isCurrentMonth = monthKey === getMonthKey(0);

//   if (loading) return (
//     <div className="fr-state-screen">
//       <div className="fr-spinner" />
//       <p>Loading financial report…</p>
//     </div>
//   );

//   if (error) return (
//     <div className="fr-state-screen fr-error-screen">
//       <div className="fr-error-icon">!</div>
//       <h3>Failed to load report</h3>
//       <p>{error}</p>
//       <p className="fr-error-hint">Make sure Django is running and the <code>/reports/financial/</code> endpoint is mapped in urls.py.</p>
//       <button className="fr-btn fr-btn-primary" onClick={() => fetchReport(monthKey)}>↻ Retry</button>
//     </div>
//   );

//   if (!data) return null;

//   const { summary, bar_chart, line_chart, donut_chart,
//           expense_breakdown, months_data, manual_expenses,
//           employees, inventory_items, payment_methods,
//           active_employee_count, inventory_item_count } = data;

//   const isProfit = (summary?.net_profit || 0) >= 0;

//   const barData = (bar_chart?.labels || []).map((label, i) => ({
//     label,
//     Income:   bar_chart.income[i]   || 0,
//     Expenses: bar_chart.expenses[i] || 0,
//   }));

//   const lineData = (line_chart?.labels || []).map((label, i) => ({
//     label,
//     "Net Profit": line_chart.profit[i] || 0,
//   }));

//   const donutData = (donut_chart?.labels || [])
//     .map((label, i) => ({ name: label, value: donut_chart.values[i] || 0 }))
//     .filter(d => d.value > 0);

//   return (
//     <div className="fr-container">

//       {/* ══ HEADER ══ */}
//       <div className="fr-header no-print">
//         <div className="fr-header-left">
//           <h2>Financial Report</h2>
//           <p className="fr-subtitle">Clinic income, expenses & profitability overview</p>
//         </div>
//         <div className="fr-header-right">
//           <div className="fr-month-nav">
//             <button className="fr-nav-btn" onClick={goBack}>‹</button>
//             <span className="fr-month-label">{friendlyMonth(monthKey)}</span>
//             <button className="fr-nav-btn" onClick={goNext} disabled={isCurrentMonth}>›</button>
//           </div>
//           <button className="fr-btn fr-btn-ghost" onClick={() => fetchReport(monthKey)}>↻ Refresh</button>
//           <button className="fr-btn fr-btn-ghost" onClick={() => window.print()}>⎙ Print</button>
//         </div>
//       </div>

//       {/* ══ KPI CARDS ══ */}
//       <div className="fr-kpi-grid">
//         <div className="fr-kpi fr-kpi-income">
//           <div className="fr-kpi-icon">↑</div>
//           <div className="fr-kpi-body">
//             <span className="fr-kpi-label">Total Income</span>
//             <span className="fr-kpi-value">{fmt(summary?.total_income)}</span>
//             <span className="fr-kpi-sub">Paid installments this month</span>
//           </div>
//         </div>

//         <div className="fr-kpi fr-kpi-expense">
//           <div className="fr-kpi-icon">↓</div>
//           <div className="fr-kpi-body">
//             <span className="fr-kpi-label">Total Expenses</span>
//             <span className="fr-kpi-value">{fmt(summary?.total_expenses)}</span>
//             <span className="fr-kpi-sub">Salaries + inventory + other</span>
//           </div>
//         </div>

//         <div className={`fr-kpi ${isProfit ? "fr-kpi-profit" : "fr-kpi-loss"}`}>
//           <div className="fr-kpi-icon">{isProfit ? "+" : "−"}</div>
//           <div className="fr-kpi-body">
//             <span className="fr-kpi-label">Net {isProfit ? "Profit" : "Loss"}</span>
//             <span className="fr-kpi-value">{fmt(Math.abs(summary?.net_profit))}</span>
//             <span className="fr-kpi-sub">{isProfit ? "Profitable month 🎉" : "Operating at a loss"}</span>
//           </div>
//         </div>

//         <div className="fr-kpi fr-kpi-best">
//           <div className="fr-kpi-icon">★</div>
//           <div className="fr-kpi-body">
//             <span className="fr-kpi-label">Best Month</span>
//             <span className="fr-kpi-value fr-kpi-best-val">{summary?.best_month || "—"}</span>
//             <span className="fr-kpi-sub">{fmt(summary?.best_month_profit)} profit</span>
//           </div>
//         </div>
//       </div>

//       {/* ══ TABS ══ */}
//       <div className="fr-tabs no-print">
//         {["overview", "expenses", "salary", "inventory"].map(tab => (
//           <button
//             key={tab}
//             className={`fr-tab ${activeTab === tab ? "fr-tab-active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             {tab === "expenses" && manual_expenses?.length > 0 && (
//               <span className="fr-tab-badge">{manual_expenses.length}</span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ══════════════════════════════
//           OVERVIEW TAB
//       ══════════════════════════════ */}
//       {activeTab === "overview" && (
//         <>
//           {/* Bar + Line row */}
//           <div className="fr-charts-row">
//             <div className="fr-chart-card">
//               <div className="fr-chart-header">
//                 <h3>Income vs Expenses</h3>
//                 <span className="fr-chart-sub">6-month comparison</span>
//               </div>
//               <ResponsiveContainer width="100%" height={240}>
//                 <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                   <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} />
//                   <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#94a3b8" }} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar dataKey="Income" fill="#3b82f6" radius={[4,4,0,0]} />
//                   <Bar dataKey="Expenses" fill="#f43f5e" radius={[4,4,0,0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="fr-chart-card">
//               <div className="fr-chart-header">
//                 <h3>Profit Trend</h3>
//                 <span className="fr-chart-sub">Net profit/loss over 6 months</span>
//               </div>
//               <ResponsiveContainer width="100%" height={240}>
//                 <LineChart data={lineData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                   <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} />
//                   <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#94a3b8" }} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Line type="monotone" dataKey="Net Profit" stroke="#3b82f6"
//                     strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Donut + 6-month table row */}
//           <div className="fr-charts-row">
//             <div className="fr-chart-card">
//               <div className="fr-chart-header">
//                 <h3>Expense Breakdown</h3>
//                 <span className="fr-chart-sub">{friendlyMonth(monthKey)} by category</span>
//               </div>
//               {donutData.length === 0 ? (
//                 <div className="fr-no-data">No expense data for this month.</div>
//               ) : (
//                 <div className="fr-donut-wrap">
//                   <ResponsiveContainer width="55%" height={220}>
//                     <PieChart>
//                       <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
//                         dataKey="value" labelLine={false} label={renderDonutLabel}>
//                         {donutData.map((_, i) => (
//                           <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip formatter={val => fmt(val)} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div className="fr-donut-legend">
//                     {donutData.map((d, i) => (
//                       <div className="fr-legend-row" key={i}>
//                         <span className="fr-legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
//                         <span className="fr-legend-name">{d.name}</span>
//                         <span className="fr-legend-val">{fmt(d.value)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Payment methods */}
//             <div className="fr-chart-card">
//               <div className="fr-chart-header">
//                 <h3>Payment Methods</h3>
//                 <span className="fr-chart-sub">Income by method this month</span>
//               </div>
//               {Object.keys(payment_methods || {}).length === 0 ? (
//                 <div className="fr-no-data">No payments recorded this month.</div>
//               ) : (
//                 <div className="fr-method-list">
//                   {Object.entries(payment_methods || {}).map(([method, amt], i) => {
//                     const total = Object.values(payment_methods).reduce((a, b) => a + b, 0);
//                     const pct   = total > 0 ? ((amt / total) * 100).toFixed(0) : 0;
//                     return (
//                       <div className="fr-method-row" key={i}>
//                         <div className="fr-method-left">
//                           <span className="fr-method-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
//                           <span className="fr-method-name">{method}</span>
//                         </div>
//                         <div className="fr-method-right">
//                           <div className="fr-method-bar-wrap">
//                             <div className="fr-method-bar"
//                               style={{ width: `${pct}%`, background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
//                           </div>
//                           <span className="fr-method-val">{fmt(amt)}</span>
//                           <span className="fr-method-pct">{pct}%</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* 6-month summary table */}
//           <div className="fr-chart-card table-container">
//             <div className="fr-chart-header">
//               <h3>6-Month Summary</h3>
//               <span className="fr-chart-sub">Income, expenses and profit by month</span>
//             </div>
//             <div className="fr-table-wra">
//               <div className="thead">
//               <div className="fr-tabl">
                
//                   <div className="tnames">
//                     <div>#</div>
//                     <div>Month</div>
//                     <div>Income</div>
//                     <div>Expenses</div>
//                     <div>Net Profit / Loss</div>
//                     <div>Status</div>
//                   </div>
//                   </div>
//                   </div>

//                 <div className="tbodyy">
//                   {(months_data || []).map((m, i) => (
//                     <div key={i}>
//                       <div className="fr-serial">ID-{i + 1}</div>
//                       <div className="fr-month-cell">{m.label}</div>
//                       <div className="fr-income-cell">{fmt(m.income)}</div>
//                       <div className="fr-expense-cell">{fmt(m.expenses)}</div>
//                       <div className={m.net_profit >= 0 ? "fr-profit-cell" : "fr-loss-cell"}>
//                         {m.net_profit >= 0 ? "+" : ""}{fmt(m.net_profit)}
//                       </div>
//                       <div>
//                         <span className={`fr-badge ${m.net_profit >= 0 ? "fr-badge-profit" : "fr-badge-loss"}`}>
//                           {m.net_profit >= 0 ? "Profit" : "Loss"}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           {/* </div> */}
//         </>
//       )}

//       {/* ══════════════════════════════
//           EXPENSES TAB (Manual)
//       ══════════════════════════════ */}
//       {activeTab === "expenses" && (
//         <div className="fr-chart-card">
//           <div className="fr-chart-header">
//             <h3>Manual Expenses — {friendlyMonth(monthKey)}</h3>
//             <span className="fr-chart-sub">Expenses manually logged for this month</span>
//           </div>

//           {/* Breakdown pills */}
//           <div className="fr-exp-summary-row">
//             <div className="fr-exp-pill fr-exp-pill-salary">
//               <span className="fr-exp-pill-label">Salaries</span>
//               <span className="fr-exp-pill-val">{fmt(expense_breakdown?.salary)}</span>
//               <span className="fr-exp-pill-sub">{active_employee_count} active staff</span>
//             </div>
//             <div className="fr-exp-pill fr-exp-pill-inv">
//               <span className="fr-exp-pill-label">Inventory Cost</span>
//               <span className="fr-exp-pill-val">{fmt(expense_breakdown?.inventory)}</span>
//               <span className="fr-exp-pill-sub">{inventory_item_count} items in stock</span>
//             </div>
//             <div className="fr-exp-pill fr-exp-pill-other">
//               <span className="fr-exp-pill-label">Other Manual</span>
//               <span className="fr-exp-pill-val">{fmt(expense_breakdown?.other)}</span>
//               <span className="fr-exp-pill-sub">{manual_expenses?.length || 0} entries</span>
//             </div>
//           </div>

//           {manual_expenses?.length === 0 ? (
//             <div className="fr-no-data">No manual expenses logged for {friendlyMonth(monthKey)}.</div>
//           ) : (
//             <div className="fr-table-wrap">
//               <table className="fr-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Title</th>
//                     <th>Category</th>
//                     <th>Amount</th>
//                     <th>Note</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {manual_expenses.map((exp, i) => (
//                     <tr key={exp.id}>
//                       <td className="fr-serial">{i + 1}</td>
//                       <td className="fr-month-cell">{exp.title}</td>
//                       <td>
//                         <span className="fr-badge fr-badge-neutral">{exp.category}</span>
//                       </td>
//                       <td className="fr-expense-cell">{fmt(exp.amount)}</td>
//                       <td style={{ color: "#94a3b8", fontSize: 12 }}>{exp.note || "—"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ══════════════════════════════
//           SALARY TAB
//       ══════════════════════════════ */}
//       {activeTab === "salary" && (
//         <div className="fr-chart-card">
//           <div className="fr-chart-header">
//             <h3>Staff Salaries</h3>
//             <span className="fr-chart-sub">Active employees — {friendlyMonth(monthKey)}</span>
//           </div>

//           <div className="fr-salary-kpi-row">
//             <div className="fr-salary-kpi">
//               <span>Total Payroll</span>
//               <strong>{fmt(expense_breakdown?.salary)}</strong>
//             </div>
//             <div className="fr-salary-kpi">
//               <span>Active Staff</span>
//               <strong>{active_employee_count}</strong>
//             </div>
//           </div>

//           {employees?.length === 0 ? (
//             <div className="fr-no-data">No active employees found.</div>
//           ) : (
//             <div className="fr-table-wrap">
//               <table className="fr-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Name</th>
//                     <th>Designation</th>
//                     <th>Salary</th>
//                     <th>Payment Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {employees.map((e, i) => (
//                     <tr key={e.id}>
//                       <td className="fr-serial">{i + 1}</td>
//                       <td className="fr-month-cell">{e.name}</td>
//                       <td style={{ color: "#64748b" }}>{e.designation || "—"}</td>
//                       <td className="fr-income-cell">{fmt(e.salary)}</td>
//                       <td>
//                         <span className={`fr-badge ${e.salary_status === "Paid" ? "fr-badge-profit" : "fr-badge-loss"}`}>
//                           {e.salary_status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ══════════════════════════════
//           INVENTORY TAB
//       ══════════════════════════════ */}
//       {activeTab === "inventory" && (
//         <div className="fr-chart-card">
//           <div className="fr-chart-header">
//             <h3>Inventory Cost Breakdown</h3>
//             <span className="fr-chart-sub">Capital tied up in current stock</span>
//           </div>

//           <div className="fr-salary-kpi-row">
//             <div className="fr-salary-kpi">
//               <span>Total Inventory Value</span>
//               <strong>{fmt(expense_breakdown?.inventory)}</strong>
//             </div>
//             <div className="fr-salary-kpi">
//               <span>Total Items</span>
//               <strong>{inventory_item_count}</strong>
//             </div>
//           </div>

//           {inventory_items?.length === 0 ? (
//             <div className="fr-no-data">No inventory items found.</div>
//           ) : (
//             <div className="fr-table-wrap">
//               <table className="fr-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Item Name</th>
//                     <th>Category</th>
//                     <th>Qty</th>
//                     <th>Unit Cost</th>
//                     <th>Total Cost</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {inventory_items.map((item, i) => (
//                     <tr key={item.id}>
//                       <td className="fr-serial">{i + 1}</td>
//                       <td className="fr-month-cell">{item.name}</td>
//                       <td>
//                         <span className="fr-badge fr-badge-neutral">{item.category}</span>
//                       </td>
//                       <td>{item.quantity} {item.unit}</td>
//                       <td style={{ color: "#64748b" }}>{fmt(item.cost_price)}</td>
//                       <td className="fr-expense-cell">{fmt(item.total_cost)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//     </div>
//   );
// }













import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import "./FinancialReport.css";
import { API_BASE } from "../api";

const API = API_BASE;

const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const DONUT_COLORS = ["#3b82f6", "#f43f5e", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

/* ── Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="fr-tooltip">
      <p className="fr-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="fr-tooltip-row">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

/* ── Donut % label ── */
const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ── Month navigator ── */
function getMonthKey(offset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function parseMonthKey(key) {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m };
}

function prevMonth(key) {
  const { year, month } = parseMonthKey(key);
  const d = new Date(year, month - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function nextMonth(key) {
  const { year, month } = parseMonthKey(key);
  const d = new Date(year, month, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function friendlyMonth(key) {
  const { year, month } = parseMonthKey(key);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export default function FinancialReport() {
  const [monthKey, setMonthKey]   = useState(getMonthKey(0));
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchReport = useCallback(async (key) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/reports/financial/?month=${key}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }
      setData(await res.json());
    } catch (err) {
      setError(err.message || "Could not load financial report.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReport(monthKey); }, [monthKey, fetchReport]);

  const goBack = () => setMonthKey(prevMonth(monthKey));
  const goNext = () => {
    const nk = nextMonth(monthKey);
    if (nk <= getMonthKey(0)) setMonthKey(nk);
  };
  const isCurrentMonth = monthKey === getMonthKey(0);

  if (loading) return (
    <div className="fr-state-screen">
      <div className="fr-spinner" />
      <p>Loading financial report…</p>
    </div>
  );

  if (error) return (
    <div className="fr-state-screen fr-error-screen">
      <div className="fr-error-icon">!</div>
      <h3>Failed to load report</h3>
      <p>{error}</p>
      <p className="fr-error-hint">Make sure Django is running and the <code>/reports/financial/</code> endpoint is mapped in urls.py.</p>
      <button className="fr-btn fr-btn-primary" onClick={() => fetchReport(monthKey)}>↻ Retry</button>
    </div>
  );

  if (!data) return null;

  const { summary, bar_chart, line_chart, donut_chart,
          expense_breakdown, months_data, manual_expenses,
          employees, inventory_items, payment_methods,
          active_employee_count, inventory_item_count } = data;

  const isProfit = (summary?.net_profit || 0) >= 0;

  const barData = (bar_chart?.labels || []).map((label, i) => ({
    label,
    Income:   bar_chart.income[i]   || 0,
    Expenses: bar_chart.expenses[i] || 0,
  }));

  const lineData = (line_chart?.labels || []).map((label, i) => ({
    label,
    "Net Profit": line_chart.profit[i] || 0,
  }));

  const donutData = (donut_chart?.labels || [])
    .map((label, i) => ({ name: label, value: donut_chart.values[i] || 0 }))
    .filter(d => d.value > 0);

  return (
    <div className="fr-container">

      {/* ══ HEADER ══ */}
      {/* <div className="fr-header no-print">
        <div className="fr-header-left">
          <h2>Financial Report</h2>
          <p className="fr-subtitle">Clinic income, expenses & profitability overview</p>
        </div>
        <div className="fr-header-right">
          <div className="fr-month-nav">
            <button className="fr-nav-btn" onClick={goBack}>‹</button>
            <span className="fr-month-label">{friendlyMonth(monthKey)}</span>
            <button className="fr-nav-btn" onClick={goNext} disabled={isCurrentMonth}>›</button>
          </div>
          <button className="fr-btn fr-btn-ghost" onClick={() => fetchReport(monthKey)}>↻ Refresh</button>
          <button className="fr-btn fr-btn-ghost" onClick={() => window.print()}>⎙ Print</button>
        </div>
      </div> */}
      <div className="fr-header no-print">
  <div className="fr-header-left">
    <h2>Financial Report</h2>
    <p className="fr-subtitle">Clinic income, expenses &amp; profitability overview</p>
  </div>
  <div className="fr-header-right">
    <div className="fr-month-nav">
      <button className="fr-nav-btn" onClick={goBack}>‹</button>
      <span className="fr-month-label">{friendlyMonth(monthKey)}</span>
      <button className="fr-nav-btn" onClick={goNext} disabled={isCurrentMonth}>›</button>
    </div>
    {/* Sirf Print button bacha hai */}
    <button className="fr-btn fr-btn-ghost" onClick={() => window.print()}>⎙ Print</button>
  </div>
</div>

      {/* ══ KPI CARDS ══ */}
      <div className="fr-kpi-grid">
        <div className="fr-kpi fr-kpi-income">
          <div className="fr-kpi-icon">↑</div>
          <div className="fr-kpi-body">
            <span className="fr-kpi-label">Total Income</span>
            <span className="fr-kpi-value">{fmt(summary?.total_income)}</span>
            <span className="fr-kpi-sub">Paid installments this month</span>
          </div>
        </div>

        <div className="fr-kpi fr-kpi-expense">
          <div className="fr-kpi-icon">↓</div>
          <div className="fr-kpi-body">
            <span className="fr-kpi-label">Total Expenses</span>
            <span className="fr-kpi-value">{fmt(summary?.total_expenses)}</span>
            <span className="fr-kpi-sub">Salaries + inventory + other</span>
          </div>
        </div>

        <div className={`fr-kpi ${isProfit ? "fr-kpi-profit" : "fr-kpi-loss"}`}>
          <div className="fr-kpi-icon">{isProfit ? "+" : "−"}</div>
          <div className="fr-kpi-body">
            <span className="fr-kpi-label">Net {isProfit ? "Profit" : "Loss"}</span>
            <span className="fr-kpi-value">{fmt(Math.abs(summary?.net_profit))}</span>
            <span className="fr-kpi-sub">{isProfit ? "Profitable month 🎉" : "Operating at a loss"}</span>
          </div>
        </div>

        <div className="fr-kpi fr-kpi-best">
          <div className="fr-kpi-icon">★</div>
          <div className="fr-kpi-body">
            <span className="fr-kpi-label">Best Month</span>
            <span className="fr-kpi-value fr-kpi-best-val">{summary?.best_month || "—"}</span>
            <span className="fr-kpi-sub">{fmt(summary?.best_month_profit)} profit</span>
          </div>
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div className="fr-tabs no-print">
        {["overview", "expenses", "salary", "inventory"].map(tab => (
          <button
            key={tab}
            className={`fr-tab ${activeTab === tab ? "fr-tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "expenses" && manual_expenses?.length > 0 && (
              <span className="fr-tab-badge">{manual_expenses.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════ */}
      {activeTab === "overview" && (
        <>
          {/* Bar + Line row */}
          <div className="fr-charts-row">
            <div className="fr-chart-card">
              <div className="fr-chart-header">
                <h3>Income vs Expenses</h3>
                <span className="fr-chart-sub">6-month comparison</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Income" fill="#3b82f6" radius={[4,4,0,0]} />
                  <Bar dataKey="Expenses" fill="#f43f5e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="fr-chart-card">
              <div className="fr-chart-header">
                <h3>Profit Trend</h3>
                <span className="fr-chart-sub">Net profit/loss over 6 months</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Net Profit" stroke="#3b82f6"
                    strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut + Payment Methods */}
          <div className="fr-charts-row">
            <div className="fr-chart-card">
              <div className="fr-chart-header">
                <h3>Expense Breakdown</h3>
                <span className="fr-chart-sub">{friendlyMonth(monthKey)} by category</span>
              </div>
              {donutData.length === 0 ? (
                <div className="fr-no-data">No expense data for this month.</div>
              ) : (
                <div className="fr-donut-wrap">
                  <ResponsiveContainer width="55%" height={220}>
                    <PieChart>
                      <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                        dataKey="value" labelLine={false} label={renderDonutLabel}>
                        {donutData.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={val => fmt(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="fr-donut-legend">
                    {donutData.map((d, i) => (
                      <div className="fr-legend-row" key={i}>
                        <span className="fr-legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        <span className="fr-legend-name">{d.name}</span>
                        <span className="fr-legend-val">{fmt(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment methods */}
            <div className="fr-chart-card">
              <div className="fr-chart-header">
                <h3>Payment Methods</h3>
                <span className="fr-chart-sub">Income by method this month</span>
              </div>
              {Object.keys(payment_methods || {}).length === 0 ? (
                <div className="fr-no-data">No payments recorded this month.</div>
              ) : (
                <div className="fr-method-list">
                  {Object.entries(payment_methods || {}).map(([method, amt], i) => {
                    const total = Object.values(payment_methods).reduce((a, b) => a + b, 0);
                    const pct   = total > 0 ? ((amt / total) * 100).toFixed(0) : 0;
                    return (
                      <div className="fr-method-row" key={i}>
                        <div className="fr-method-left">
                          <span className="fr-method-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <span className="fr-method-name">{method}</span>
                        </div>
                        <div className="fr-method-right">
                          <div className="fr-method-bar-wrap">
                            <div className="fr-method-bar"
                              style={{ width: `${pct}%`, background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          </div>
                          <span className="fr-method-val">{fmt(amt)}</span>
                          <span className="fr-method-pct">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 6-month summary table styled exactly like gallery */}
          <div className="fr-chart-card fr-table-container">
            <div className="fr-chart-header">
              <h3>6-Month Summary</h3>
              <span className="fr-chart-sub">Income, expenses and profit by month</span>
            </div>
            
            <div className="fr-table-grid-header fr-grid-overview">
              <span>#</span>
              <span>Month</span>
              <span>Income</span>
              <span>Expenses</span>
              <span>Net Profit / Loss</span>
              <span style={{ textAlign: "right" }}>Status</span>
            </div>

            <div className="fr-cards-list">
              {(months_data || []).map((m, i) => (
                <div className="fr-row-card fr-grid-overview" key={i}>
                  <div className="fr-serial">ID-{i + 1}</div>
                  <div className="fr-month-cell">{m.label}</div>
                  <div className="fr-income-cell">{fmt(m.income)}</div>
                  <div className="fr-expense-cell">{fmt(m.expenses)}</div>
                  <div className={m.net_profit >= 0 ? "fr-profit-cell" : "fr-loss-cell"}>
                    {m.net_profit >= 0 ? "+" : ""}{fmt(m.net_profit)}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`fr-badge ${m.net_profit >= 0 ? "fr-badge-profit" : "fr-badge-loss"}`}>
                      {m.net_profit >= 0 ? "Profit" : "Loss"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════
          EXPENSES TAB (Manual)
      ══════════════════════════════ */}
      {activeTab === "expenses" && (
        <div className="fr-chart-card fr-table-container">
          <div className="fr-chart-header" style={{ marginBottom: 20 }}>
            <h3>Manual Expenses — {friendlyMonth(monthKey)}</h3>
            <span className="fr-chart-sub">Expenses manually logged for this month</span>
          </div>

          {/* Breakdown pills */}
          <div className="fr-exp-summary-row">
            <div className="fr-exp-pill fr-exp-pill-salary">
              <span className="fr-exp-pill-label">Salaries</span>
              <span className="fr-exp-pill-val">{fmt(expense_breakdown?.salary)}</span>
              <span className="fr-exp-pill-sub">{active_employee_count} active staff</span>
            </div>
            <div className="fr-exp-pill fr-exp-pill-inv">
              <span className="fr-exp-pill-label">Inventory Cost</span>
              <span className="fr-exp-pill-val">{fmt(expense_breakdown?.inventory)}</span>
              <span className="fr-exp-pill-sub">{inventory_item_count} items in stock</span>
            </div>
            <div className="fr-exp-pill fr-exp-pill-other">
              <span className="fr-exp-pill-label">Other Manual</span>
              <span className="fr-exp-pill-val">{fmt(expense_breakdown?.other)}</span>
              <span className="fr-exp-pill-sub">{manual_expenses?.length || 0} entries</span>
            </div>
          </div>

          {manual_expenses?.length === 0 ? (
            <div className="fr-no-data">No manual expenses logged for {friendlyMonth(monthKey)}.</div>
          ) : (
            <>
              <div className="fr-table-grid-header fr-grid-expenses">
                <span>#</span>
                <span>Title</span>
                <span>Category</span>
                <span>Amount</span>
                <span style={{ textAlign: "right" }}>Note</span>
              </div>
              <div className="fr-cards-list">
                {manual_expenses.map((exp, i) => (
                  <div className="fr-row-card fr-grid-expenses" key={exp.id}>
                    <div className="fr-serial">ID-{i + 1}</div>
                    <div className="fr-month-cell">{exp.title}</div>
                    <div>
                      <span className="fr-badge fr-badge-neutral">{exp.category}</span>
                    </div>
                    <div className="fr-expense-cell">{fmt(exp.amount)}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12, textAlign: "right" }}>{exp.note || "—"}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════
          SALARY TAB
      ══════════════════════════════ */}
      {activeTab === "salary" && (
        <div className="fr-chart-card fr-table-container">
          <div className="fr-chart-header" style={{ marginBottom: 20 }}>
            <h3>Staff Salaries</h3>
            <span className="fr-chart-sub">Active employees — {friendlyMonth(monthKey)}</span>
          </div>

          <div className="fr-salary-kpi-row">
            <div className="fr-salary-kpi">
              <span>Total Payroll</span>
              <strong>{fmt(expense_breakdown?.salary)}</strong>
            </div>
            <div className="fr-salary-kpi">
              <span>Active Staff</span>
              <strong>{active_employee_count}</strong>
            </div>
          </div>

          {employees?.length === 0 ? (
            <div className="fr-no-data">No active employees found.</div>
          ) : (
            <>
              <div className="fr-table-grid-header fr-grid-salary">
                <span>#</span>
                <span>Name</span>
                <span>Designation</span>
                <span>Salary</span>
                <span style={{ textAlign: "right" }}>Payment Status</span>
              </div>
              <div className="fr-cards-list">
                {employees.map((e, i) => (
                  <div className="fr-row-card fr-grid-salary" key={e.id}>
                    <div className="fr-serial">ID-{i + 1}</div>
                    <div className="fr-month-cell">{e.name}</div>
                    <div style={{ color: "#64748b" }}>{e.designation || "—"}</div>
                    <div className="fr-income-cell">{fmt(e.salary)}</div>
                    <div style={{ textAlign: "right" }}>
                      <span className={`fr-badge ${e.salary_status === "Paid" ? "fr-badge-profit" : "fr-badge-loss"}`}>
                        {e.salary_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════
          INVENTORY TAB
      ══════════════════════════════ */}
      {activeTab === "inventory" && (
        <div className="fr-chart-card fr-table-container">
          <div className="fr-chart-header" style={{ marginBottom: 20 }}>
            <h3>Inventory Cost Breakdown</h3>
            <span className="fr-chart-sub">Capital tied up in current stock</span>
          </div>

          <div className="fr-salary-kpi-row">
            <div className="fr-salary-kpi">
              <span>Total Inventory Value</span>
              <strong>{fmt(expense_breakdown?.inventory)}</strong>
            </div>
            <div className="fr-salary-kpi">
              <span>Total Items</span>
              <strong>{inventory_item_count}</strong>
            </div>
          </div>

          {inventory_items?.length === 0 ? (
            <div className="fr-no-data">No inventory items found.</div>
          ) : (
            <>
              <div className="fr-table-grid-header fr-grid-inventory">
                <span>#</span>
                <span>Item Name</span>
                <span>Category</span>
                <span>Qty</span>
                <span>Unit Cost</span>
                <span style={{ textAlign: "right" }}>Total Cost</span>
              </div>
              <div className="fr-cards-list">
                {inventory_items.map((item, i) => (
                  <div className="fr-row-card fr-grid-inventory" key={item.id}>
                    <div className="fr-serial">{i + 1}</div>
                    <div className="fr-month-cell">{item.name}</div>
                    <div>
                      <span className="fr-badge fr-badge-neutral">{item.category}</span>
                    </div>
                    <div style={{ color: "#334155", fontWeight: 500 }}>{item.quantity} {item.unit}</div>
                    <div style={{ color: "#64748b" }}>{fmt(item.cost_price)}</div>
                    <div className="fr-expense-cell" style={{ textAlign: "right" }}>{fmt(item.total_cost)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}