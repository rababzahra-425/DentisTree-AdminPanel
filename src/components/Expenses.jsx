// import React, { useEffect, useState, useRef } from "react";
// import "./Expenses.css";

// const CATEGORIES = ["Rent", "Utilities", "Maintenance", "Other"];
// const ALL_CATS = ["All", "Salary", "Inventory", "Rent", "Utilities", "Maintenance", "Other"];

// const EMPTY_FORM = {
//   title: "", category: "Rent", amount: "", month: "", note: "",
// };

// function Expenses() {
//   const today = new Date();
//   const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");   
//   const [catFilter, setCatFilter] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [saving, setSaving] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const printRef = useRef();

//   const fetchSummary = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/expenses/summary/?month=${selectedMonth}`);
//       const data = await res.json();
//       setSummary(data);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchSummary(); }, [selectedMonth]);

//   const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

//   const manualExpenses = summary?.manual_expenses || [];
//   const filteredExpenses = catFilter === "All"
//     ? manualExpenses
//     : manualExpenses.filter((e) => e.category === catFilter);

//   const openAdd = () => {
//     setEditItem(null);
//     setForm({ ...EMPTY_FORM, month: selectedMonth });
//     setShowModal(true);
//   };

//   const openEdit = (item) => {
//     setEditItem(item);
//     setForm({
//       title: item.title || "",
//       category: item.category || "Rent",
//       amount: item.amount || "",
//       month: item.month || selectedMonth,
//       note: item.note || "",
//     });
//     setShowModal(true);
//   };

//   const closeModal = () => { setShowModal(false); setEditItem(null); };
//   const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSave = async () => {
//     if (!form.title.trim()) return alert("Title is required.");
//     if (!form.amount || parseFloat(form.amount) <= 0) return alert("Enter a valid amount.");
//     setSaving(true);
//     try {
//       const url = editItem
//         ? `${API}/expenses/update/${editItem.id}/`
//         : "${API}/expenses/create/";
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (res.ok) { await fetchSummary(); closeModal(); }
//       else { const e = await res.json(); alert("Error: " + (e.error || "Unknown")); }
//     } catch { alert("Network error."); }
//     finally { setSaving(false); }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${API}/expenses/delete/${id}/`, { method: "POST" });
//       if (res.ok) { await fetchSummary(); setDeleteConfirm(null); }
//       else alert("Failed to delete.");
//     } catch { alert("Network error."); }
//   };

//   const handlePrint = () => window.print();

//   const changeMonth = (dir) => {
//     const [y, m] = selectedMonth.split("-").map(Number);
//     const d = new Date(y, m - 1 + dir, 1);
//     setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
//   };

//   const monthLabel = new Date(selectedMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });

//   if (loading) return <div className="exp-loading">Loading financial summary...</div>;

//   const breakdown = summary?.breakdown?.by_category || {};
//   const totalExpenses = summary?.total_expenses || 0;

//   return (
//     <div className="exp-container" ref={printRef}>

//       {/* ── Header (Download button removed completely) ── */}
//       <div className="exp-header no-print-hide">
//         <h2>Expenses &amp; Financial Report</h2>
//         <div className="exp-header-actions">
//           <button className="exp-print-btn" onClick={handlePrint}>
//             <i className="bi bi-printer-fill" /> Print Report
//           </button>
//           <button className="exp-add-btn" onClick={openAdd}>+ Add Expense</button>
//         </div>
//       </div>

//       {/* ── Printable Formal Report Document Header ── */}
//       <div className="print-report-header">
//         <h1>DENTISTREE DENTAL CLINIC</h1>
//         <h3>Monthly Financial Statement &amp; Operating Ledger</h3>
//         <p className="print-report-meta">
//           <strong>Statement Period:</strong> {monthLabel} &nbsp;|&nbsp; 
//           <strong>Generated Date:</strong> {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
//         </p>
//       </div>

//       {/* ── Month Selector ── */}
//       <div className="exp-month-bar no-print-hide">
//         <button className="exp-month-nav" onClick={() => changeMonth(-1)}>‹</button>
//         <span className="exp-month-label">{monthLabel}</span>
//         <button className="exp-month-nav" onClick={() => changeMonth(1)}>›</button>
//         <input
//           type="month"
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="exp-month-input"
//         />
//       </div>

//       {/* ── Summary Blocks / Statement Grid ── */}
//       <div className="exp-summary-cards">
//         <div className="exp-card income">
//           <span className="exp-card-label">Total Cash Inflow</span>
//           <span className="exp-card-value">{fmt(summary?.total_income)}</span>
//           <span className="exp-card-sub">Collected payments</span>
//         </div>
//         <div className="exp-card expenses">
//           <span className="exp-card-label">Total Cash Outflow</span>
//           <span className="exp-card-value">{fmt(summary?.total_expenses)}</span>
//           <span className="exp-card-sub">All operating cost metrics</span>
//         </div>
//         <div className={`exp-card profit ${(summary?.net_profit || 0) >= 0 ? "positive" : "negative"}`}>
//           <span className="exp-card-label">Net Profit / Balance</span>
//           <span className="exp-card-value">{fmt(summary?.net_profit)}</span>
//           <span className="exp-card-sub">{(summary?.net_profit || 0) >= 0 ? "Surplus Net Variance" : "Deficit Capital Variance"}</span>
//         </div>
//       </div>

//       {/* ── Category Breakdown Progress Sheet ── */}
//       <div className="exp-breakdown-section">
//         <h3 className="exp-section-title">I. Volumetric Categorical Breakdown</h3>
//         <div className="exp-breakdown-list">
//           {Object.entries(breakdown).map(([cat, amount]) => {
//             const pct = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
//             return (
//               <div className="exp-breakdown-row" key={cat}>
//                 <span className={`exp-cat-dot cat-${cat.toLowerCase()} no-print-hide`} />
//                 <span className="exp-breakdown-cat">{cat}</span>
//                 <div className="exp-breakdown-bar-track no-print-hide">
//                   <div className="exp-breakdown-bar-fill" style={{ width: `${pct}%` }} />
//                 </div>
//                 <span className="exp-breakdown-pct">{pct}%</span>
//                 <span className="exp-breakdown-amt">{fmt(amount)}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Operational Navigation Tabs ── */}
//       <div className="exp-tabs no-print-hide">
//         {[["overview", "Overview"], ["expenses", "Manual Expenses"], ["salary", "Salary Detail"], ["inventory", "Inventory Detail"]].map(([key, label]) => (
//           <button key={key} className={`exp-tab ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* ── Dynamic Screen View & Continuous Report Structure for Paper ── */}
//       <div className="exp-report-body-wrapper">
        
//         {/* SECTION A: OVERVIEW CONDENSED STATEMENTS */}
//         {(activeTab === "overview" || true) && (
//           <div className={`exp-section-block ${activeTab !== "overview" ? "print-only" : ""}`}>
//             <h3 className="exp-section-title print-only">II. Condensed Operating Summary</h3>
//             <div className="exp-overview-grid">
//               <div className="exp-overview-card">
//                 <div className="exp-overview-title">Staff Salaries</div>
//                 <div className="exp-overview-amount">{fmt(summary?.breakdown?.salary)}</div>
//                 <div className="exp-overview-sub no-print-hide">{summary?.salary_detail?.length || 0} employees</div>
//               </div>
//               <div className="exp-overview-card">
//                 <div className="exp-overview-title">Inventory Cost</div>
//                 <div className="exp-overview-amount">{fmt(summary?.breakdown?.inventory)}</div>
//                 <div className="exp-overview-sub no-print-hide">{summary?.inventory_detail?.length || 0} items active</div>
//               </div>
//               <div className="exp-overview-card">
//                 <div className="exp-overview-title">Other Operational Cost</div>
//                 <div className="exp-overview-amount">{fmt(summary?.breakdown?.manual)}</div>
//                 <div className="exp-overview-sub no-print-hide">{manualExpenses.length} ledger logs</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION B: ITEMIZED GENERAL LEDGER */}
//         {(activeTab === "expenses" || true) && (
//           <div className={`exp-section-block ${activeTab !== "expenses" ? "print-only" : ""}`} style={{ marginTop: '24px' }}>
//             <h3 className="exp-section-title">III. Itemized Operational Ledger (Manual Entries)</h3>
//             <div className="exp-filter-row no-print-hide">
//               {ALL_CATS.filter(c => !["Salary","Inventory"].includes(c)).map((c) => (
//                 <button key={c} className={`exp-filter-btn ${catFilter === c ? "active" : ""}`} onClick={() => setCatFilter(c)}>{c}</button>
//               ))}
//             </div>
//             {filteredExpenses.length === 0 ? (
//               <div className="exp-empty">No itemized expenditure logged.</div>
//             ) : (
//               <div className="exp-table-wrap">
//                 <table className="exp-table">
//                   <thead>
//                     <tr>
//                       <th>Title Description</th>
//                       <th>Classification</th>
//                       <th>Debit Amount</th>
//                       <th>Period</th>
//                       <th>Accounting Note</th>
//                       <th>Date Logged</th>
//                       <th className="no-print-hide">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredExpenses.map((e) => (
//                       <tr key={e.id}>
//                         <td className="exp-title-cell">{e.title}</td>
//                         <td><span className="exp-cat-badge">{e.category}</span></td>
//                         <td className="exp-amount-cell">{fmt(e.amount)}</td>
//                         <td>{e.month}</td>
//                         <td className="exp-note">{e.note || "—"}</td>
//                         <td>{e.created_at}</td>
//                         <td className="no-print-hide">
//                           <div className="exp-actions">
//                             <button className="exp-edit-btn" onClick={() => openEdit(e)}>Edit</button>
//                             <button className="exp-delete-btn" onClick={() => setDeleteConfirm(e.id)}>Delete</button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td colSpan="2"><strong>Operational Subtotal Balance</strong></td>
//                       <td className="exp-amount-cell" colSpan="5"><strong>{fmt(filteredExpenses.reduce((s, e) => s + e.amount, 0))}</strong></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* SECTION C: PAYROLL DISBURSEMENT STATEMENT */}
//         {(activeTab === "salary" || true) && (
//           <div className={`exp-section-block ${activeTab !== "salary" ? "print-only" : ""}`} style={{ marginTop: '24px' }}>
//             <h3 className="exp-section-title">IV. Executive Payroll Disbursement Log</h3>
//             <div className="exp-table-wrap">
//               <table className="exp-table">
//                 <thead>
//                   <tr><th>Employee Name</th><th>Designation Role</th><th>Basic Disbursed Amount</th></tr>
//                 </thead>
//                 <tbody>
//                   {(summary?.salary_detail || []).map((s, i) => (
//                     <tr key={i}>
//                       <td>{s.name}</td>
//                       <td>{s.designation || "—"}</td>
//                       <td className="exp-amount-cell">{fmt(s.salary)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="2"><strong>Payroll Expenditures Cumulative</strong></td>
//                     <td className="exp-amount-cell"><strong>{fmt(summary?.breakdown?.salary)}</strong></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* SECTION D: MATERIAL ASSET PROCUREMENT INVENTORY */}
//         {(activeTab === "inventory" || true) && (
//           <div className={`exp-section-block ${activeTab !== "inventory" ? "print-only" : ""}`} style={{ marginTop: '24px' }}>
//             <h3 className="exp-section-title">V. Asset Inventory Procurement Ledger</h3>
//             <div className="exp-table-wrap">
//               <table className="exp-table">
//                 <thead>
//                   <tr><th>Item Stock Description</th><th>Allocated Qty</th><th>Measurement Unit</th><th>Unit Baseline Cost</th><th>Cumulative Subtotal</th></tr>
//                 </thead>
//                 <tbody>
//                   {(summary?.inventory_detail || []).map((item, i) => (
//                     <tr key={i}>
//                       <td>{item.name}</td>
//                       <td>{item.quantity}</td>
//                       <td>{item.unit}</td>
//                       <td>{fmt(item.cost_price)}</td>
//                       <td className="exp-amount-cell">{fmt(item.total)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="4"><strong>Material Asset Investments Total</strong></td>
//                     <td className="exp-amount-cell"><strong>{fmt(summary?.breakdown?.inventory)}</strong></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         )}

//       </div>

//       {/* ── Modals / Overlays (Will never appear in print form) ── */}
//       {showModal && (
//         <>
//           <div className="exp-overlay" onClick={closeModal} />
//           <div className="exp-modal">
//             <h3>{editItem ? "Edit Expense Entry" : "Create New Expense Record"}</h3>
//             <div className="exp-form-grid">
//               <div className="exp-field exp-field-full">
//                 <label>Title Description *</label>
//                 <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Rent, Bills" />
//               </div>
//               <div className="exp-field">
//                 <label>Category Group *</label>
//                 <select name="category" value={form.category} onChange={handleChange}>
//                   {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//                 </select>
//               </div>
//               <div className="exp-field">
//                 <label>Debit Amount (Rs.) *</label>
//                 <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" />
//               </div>
//               <div className="exp-field">
//                 <label>Target Period</label>
//                 <input name="month" type="month" value={form.month} onChange={handleChange} />
//               </div>
//               <div className="exp-field exp-field-full">
//                 <label>Accounting Internal Note</label>
//                 <input name="note" value={form.note} onChange={handleChange} placeholder="Extra ledger remarks..." />
//               </div>
//             </div>
//             <div className="exp-modal-actions">
//               <button className="exp-save-btn" onClick={handleSave} disabled={saving}>
//                 {saving ? "Processing..." : editItem ? "Update Entry" : "Log Expense"}
//               </button>
//               <button className="exp-cancel-btn" onClick={closeModal}>Cancel</button>
//             </div>
//           </div>
//         </>
//       )}

//       {deleteConfirm && (
//         <>
//           <div className="exp-overlay" onClick={() => setDeleteConfirm(null)} />
//           <div className="exp-confirm-modal">
//             <h3>Revoke Ledger Log Entry?</h3>
//             <p>This action is non-reversible inside financial logs.</p>
//             <div className="exp-confirm-actions">
//               <button className="exp-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Confirm Revoke</button>
//               <button className="exp-cancel-btn" onClick={() => setDeleteConfirm(null)}>Abort</button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Expenses;



import React, { useEffect, useState, useRef } from "react";
import "./Expenses.css";
import { API_BASE } from "../api";

const API = API_BASE;

const CATEGORIES = ["Rent", "Utilities", "Maintenance", "Other"];
const ALL_CATS = ["All", "Salary", "Inventory", "Rent", "Utilities", "Maintenance", "Other"];

const EMPTY_FORM = {
  title: "", category: "Rent", amount: "", month: "", note: "",
};

function Expenses() {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");   
  const [catFilter, setCatFilter] = useState("All");
  
  // Controls full-page form switch instead of popups
  const [showFormPage, setShowFormPage] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const printRef = useRef();

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/expenses/summary/?month=${selectedMonth}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, [selectedMonth]);

  const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

  const manualExpenses = summary?.manual_expenses || [];
  const filteredExpenses = catFilter === "All"
    ? manualExpenses
    : manualExpenses.filter((e) => e.category === catFilter);

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, month: selectedMonth });
    setShowFormPage(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || "",
      category: item.category || "Rent",
      amount: item.amount || "",
      month: item.month || selectedMonth,
      note: item.note || "",
    });
    setShowFormPage(true);
  };

  const closeFormPage = () => { setShowFormPage(false); setEditItem(null); };
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Title is required.");
    if (!form.amount || parseFloat(form.amount) <= 0) return alert("Enter a valid amount.");
    setSaving(true);
    try {
      const url = editItem
        ? `${API}/expenses/update/${editItem.id}/`
        : `${API}/expenses/create/`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { await fetchSummary(); closeFormPage(); }
      else { const e = await res.json(); alert("Error: " + (e.error || "Unknown")); }
    } catch { alert("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/expenses/delete/${id}/`, { method: "POST" });
      if (res.ok) { await fetchSummary(); setDeleteConfirm(null); }
      else alert("Failed to delete.");
    } catch { alert("Network error."); }
  };

  const handlePrint = () => window.print();

  const changeMonth = (dir) => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = new Date(selectedMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });

  if (loading) return <div className="exp-loading">Loading expenses summary...</div>;

  const breakdown = summary?.breakdown?.by_category || {};
  const totalExpenses = summary?.total_expenses || 0;

  /* ══════════════════════════════════════════════════════════
     FULL PAGE VIEW: CREATE / EDIT EXPENSE ENTRY
  ══════════════════════════════════════════════════════════ */
  if (showFormPage) {
    return (
      <div className="exp-container">
        {/* Form Page Header */}
        <div className="exp-form-header">
          <button className="exp-back-arrow-btn" onClick={closeFormPage}>
            <i className="bi bi-arrow-left" /> Back to Dashboard
          </button>
          <h2>{editItem ? "Modify Operating Expense Record" : "Log New Operating Expenditure"}</h2>
        </div>

        {/* Master Column Split Layout */}
        <div className="exp-form-master-grid">
          
          {/* Column A: Interactive Data Input Sheet */}
          <div className="exp-form-input-card">
            <h3 className="exp-form-sec-title">Operational Data Sheet</h3>
            
            <div className="exp-form-vertical-stack">
              <div className="exp-field-group">
                <label>Expense Transaction Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. March Office Rent, Grid Electricity Bill" />
                <span className="exp-input-hint">Provide a precise descriptor for auditing.</span>
              </div>

              <div className="exp-form-row-split">
                <div className="exp-field-group">
                  <label>Accounting Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="exp-field-group">
                  <label>Debit Amount (PKR) *</label>
                  <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="e.g. 45000" />
                </div>
              </div>

              <div className="exp-field-group">
                <label>Target Accounting Period</label>
                <input name="month" type="month" value={form.month} onChange={handleChange} />
              </div>

              <div className="exp-field-group">
                <label>Ledger Remarks / Explanatory Note (Optional)</label>
                <textarea name="note" value={form.note} onChange={handleChange} placeholder="Add vendor specifics, invoice reference numbers, or processing logs..." rows="4"></textarea>
              </div>
            </div>

            {/* Action Group Fixed Position Row */}
            <div className="exp-form-actions-bar">
              <button className="exp-form-cancel-btn" onClick={closeFormPage}>Discard Changes</button>
              <button className="exp-form-submit-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Processing Entry..." : editItem ? "Commit Updates" : "Register Transaction"}
              </button>
            </div>
          </div>

          {/* Column B: Real-time Live Ledger Voucher Preview */}
          <div className="exp-form-preview-card">
            <div className="exp-voucher-border-top" />
            <div className="exp-voucher-brand">DENTISTREE CLINIC</div>
            <div className="exp-voucher-tag">INTERNAL OPERATING VOUCHER</div>

            <div className="exp-voucher-divider" />

            <div className="exp-voucher-meta-row">
              <div><strong>Status:</strong> <span className="exp-v-badge">Drafting</span></div>
              <div><strong>Period:</strong> {form.month || selectedMonth}</div>
            </div>

            <div className="exp-voucher-divider" />

            <div className="exp-v-data-block">
              <div className="exp-v-label">Account Classification</div>
              <div className="exp-v-value-cat">{form.category}</div>
            </div>

            <div className="exp-v-data-block">
              <div className="exp-v-label">Line Descriptor Allocation</div>
              <div className="exp-v-value-text">{form.title || "— Untargeted Title Description —"}</div>
            </div>

            <div className="exp-v-data-block">
              <div className="exp-v-label">Accounting Ledger Remarks</div>
              <div className="exp-v-value-note">{form.note || "No custom structural remarks attached to this ledger draft."}</div>
            </div>

            <div className="exp-voucher-divider" style={{ marginTop: 'auto' }} />

            <div className="exp-voucher-total-row">
              <span>TOTAL DEBIT AMOUNT VALUE</span>
              <span className="exp-v-price">{fmt(form.amount)}</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ─── Standard Report UI Dashboard Output ─── */
  return (
    <div className="exp-container" ref={printRef}>

      <div className="exp-header no-print-hide">
        <h2>Expenses Report</h2>
        <div className="exp-header-actions">
          <button className="exp-print-btn " onClick={handlePrint}>
            <i className="bi bi-printer-fill" /> Print Report
          </button>
          <button className="exp-add-btn" onClick={openAdd}>+ Add Expense</button>
        </div>
      </div>

      <div className="print-report-header">
        <h1>DENTISTREE DENTAL CLINIC</h1>
        <h3>Monthly Financial Statement &amp; Operating Ledger</h3>
        <p className="print-report-meta">
          <strong>Statement Period:</strong> {monthLabel} &nbsp;|&nbsp; 
          <strong>Generated Date:</strong> {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="exp-month-bar no-print-hide">
        <button className="exp-month-nav" onClick={() => changeMonth(-1)}>‹</button>
        <span className="exp-month-label">{monthLabel}</span>
        <button className="exp-month-nav" onClick={() => changeMonth(1)}>›</button>
        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="exp-month-input" />
      </div>

      <div className="exp-summary-cards">
        <div className="exp-card income">
          <span className="exp-card-label">Total Cash Inflow</span>
          <span className="exp-card-value">{fmt(summary?.total_income)}</span>
          <span className="exp-card-sub">Collected payments</span>
        </div>
        <div className="exp-card expenses">
          <span className="exp-card-label">Total Cash Outflow</span>
          <span className="exp-card-value">{fmt(summary?.total_expenses)}</span>
          <span className="exp-card-sub">All operating cost metrics</span>
        </div>
        <div className={`exp-card profit ${(summary?.net_profit || 0) >= 0 ? "positive" : "negative"}`}>
          <span className="exp-card-label">Net Profit / Balance</span>
          <span className="exp-card-value">{fmt(summary?.net_profit)}</span>
          <span className="exp-card-sub">{(summary?.net_profit || 0) >= 0 ? "Surplus Net Variance" : "Deficit Capital Variance"}</span>
        </div>
      </div>

      <div className="exp-breakdown-section">
        <h3 className="exp-section-title">I. Volumetric Categorical Breakdown</h3>
        <div className="exp-breakdown-list">
          {Object.entries(breakdown).map(([cat, amount]) => {
            const pct = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
            return (
              <div className="exp-breakdown-row" key={cat}>
                <span className={`exp-cat-dot cat-${cat.toLowerCase()} no-print-hide`} />
                <span className="exp-breakdown-cat">{cat}</span>
                <div className="exp-breakdown-bar-track no-print-hide">
                  <div className="exp-breakdown-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="exp-breakdown-pct">{pct}%</span>
                <span className="exp-breakdown-amt">{fmt(amount)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="exp-tabs no-print-hide">
        {[["overview", "Overview"], ["expenses", "Manual Expenses"], ["salary", "Salary Detail"], ["inventory", "Inventory Detail"]].map(([key, label]) => (
          <button key={key} className={`exp-tab ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="exp-report-body-wrapper">
        
        {/* OVERVIEW */}
        {(activeTab === "overview" || true) && (
          <div className={`exp-section-block ${activeTab !== "overview" ? "print-only" : ""}`}>
            <h3 className="exp-section-title print-only">II. Condensed Operating Summary</h3>
            <div className="exp-overview-grid">
              <div className="exp-overview-card">
                <div className="exp-overview-title">Staff Salaries</div>
                <div className="exp-overview-amount">{fmt(summary?.breakdown?.salary)}</div>
                <div className="exp-overview-sub no-print-hide">{summary?.salary_detail?.length || 0} employees</div>
              </div>
              <div className="exp-overview-card">
                <div className="exp-overview-title">Inventory Cost</div>
                <div className="exp-overview-amount">{fmt(summary?.breakdown?.inventory)}</div>
                <div className="exp-overview-sub no-print-hide">{summary?.inventory_detail?.length || 0} items active</div>
              </div>
              <div className="exp-overview-card">
                <div className="exp-overview-title">Other Operational Cost</div>
                <div className="exp-overview-amount">{fmt(summary?.breakdown?.manual)}</div>
                <div className="exp-overview-sub no-print-hide">{manualExpenses.length} ledger logs</div>
              </div>
            </div>
          </div>
        )}

        {/* MANUAL EXPENSES ITEMIZATION */}
        {(activeTab === "expenses" || true) && (
          <div className={`exp-section-block ${activeTab !== "expenses" ? "print-only" : ""}`} style={{ marginTop: '24px' }}>
            <h3 className="exp-section-title">III. Itemized Operational Ledger (Manual Entries)</h3>
            <div className="exp-filter-row no-print-hide">
              {ALL_CATS.filter(c => !["Salary","Inventory"].includes(c)).map((c) => (
                <button key={c} className={`exp-filter-btn ${catFilter === c ? "active" : ""}`} onClick={() => setCatFilter(c)}>{c}</button>
              ))}
            </div>
            {filteredExpenses.length === 0 ? (
              <div className="exp-empty">No itemized expenditure logged.</div>
            ) : (
              <div className="exp-table-wrap">
                <table className="exp-table">
                  <thead>
                    <tr>
                      <th>Title Description</th>
                      <th>Classification</th>
                      <th>Debit Amount</th>
                      <th>Period</th>
                      <th>Accounting Note</th>
                      <th>Date Logged</th>
                      <th className="no-print-hide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((e) => (
                      <tr key={e.id}>
                        <td className="exp-title-cell">{e.title}</td>
                        <td><span className="exp-cat-badge">{e.category}</span></td>
                        <td className="exp-amount-cell">{fmt(e.amount)}</td>
                        <td>{e.month}</td>
                        <td className="exp-note">{e.note || "—"}</td>
                        <td>{e.created_at}</td>
                        <td className="no-print-hide">
                          <div className="exp-actions">
                            <button className="exp-edit-btn" onClick={() => openEdit(e)}>Edit</button>
                            <button className="exp-delete-btn" onClick={() => setDeleteConfirm(e.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2"><strong>Operational Subtotal Balance</strong></td>
                      <td className="exp-amount-cell" colSpan="5"><strong>{fmt(filteredExpenses.reduce((s, e) => s + e.amount, 0))}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PAYROLL */}
        {(activeTab === "salary" || true) && (
          <div className={`exp-section-block ${activeTab !== "salary" ? "print-only" : ""}`} style={{ marginTop: '24px' }}>
            <h3 className="exp-section-title">IV. Executive Payroll Disbursement Log</h3>
            <div className="exp-table-wrap">
              <table className="exp-table">
                <thead>
                  <tr><th>Employee Name</th><th>Designation Role</th><th>Basic Disbursed Amount</th></tr>
                </thead>
                <tbody>
                  {(summary?.salary_detail || []).map((s, i) => (
                    <tr key={i}>
                      <td>{s.name}</td>
                      <td>{s.designation || "—"}</td>
                      <td className="exp-amount-cell">{fmt(s.salary)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2"><strong>Payroll Expenditures Cumulative</strong></td>
                    <td className="exp-amount-cell"><strong>{fmt(summary?.breakdown?.salary)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {(activeTab === "inventory" || true) && (
          <div className={`exp-section-block ${activeTab !== "inventory" ? "print-only" : ""}`} style={{ marginTop: '24px' }}>
            <h3 className="exp-section-title">V. Asset Inventory Procurement Ledger</h3>
            <div className="exp-table-wrap">
              <table className="exp-table">
                <thead>
                  <tr><th>Item Stock Description</th><th>Allocated Qty</th><th>Measurement Unit</th><th>Unit Baseline Cost</th><th>Cumulative Subtotal</th></tr>
                </thead>
                <tbody>
                  {(summary?.inventory_detail || []).map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{fmt(item.cost_price)}</td>
                      <td className="exp-amount-cell">{fmt(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4"><strong>Material Asset Investments Total</strong></td>
                    <td className="exp-amount-cell"><strong>{fmt(summary?.breakdown?.inventory)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Delete Confirmation Alert (Kept simple modal as its single choice confirmation) */}
      {deleteConfirm && (
        <>
          <div className="exp-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="exp-confirm-modal">
            <h3>Revoke Ledger Log Entry?</h3>
            <p>This action is non-reversible inside financial logs.</p>
            <div className="exp-confirm-actions">
              <button className="exp-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Confirm Revoke</button>
              <button className="exp-cancel-btn" onClick={() => setDeleteConfirm(null)}>Abort</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Expenses;