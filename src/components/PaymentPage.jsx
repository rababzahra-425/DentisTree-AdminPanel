import React, { useEffect, useState, useRef } from "react";
import "./Payments.css";
import { API_BASE } from "../api";

const API = API_BASE;

/* ─── Formatting helpers ──────────────────────────────────── */
const fmtPKR  = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK")}`;
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }) : "";
const avatar  = (name) => name ? name.charAt(0).toUpperCase() : "P";

const STATUS_META = {
  Paid:    { cls: "pay-badge--paid",    icon: "bi-check-circle-fill",   label: "Paid" },
  Partial: { cls: "pay-badge--partial", icon: "bi-pie-chart-fill",      label: "Partial" },
  Due:     { cls: "pay-badge--due",     icon: "bi-exclamation-circle-fill", label: "Due" },
  Pending: { cls: "pay-badge--due",     icon: "bi-clock-fill",           label: "Pending" },
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function PaymentPage({ patientId, patientData, onBack }) {
  const [patient,      setPatient]      = useState(patientData || null);
  const [billing,      setBilling]      = useState(null);     // BillingRecord
  const [installments, setInstallments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [notification, setNotification] = useState(null);

  /* form visibility */
  const [showSetTotal,  setShowSetTotal]  = useState(false);
  const [showAddPay,    setShowAddPay]    = useState(false);
  const [editingInst,   setEditingInst]   = useState(null);   // installment being edited
  const [receiptInst,   setReceiptInst]   = useState(null);   // for print receipt

  /* form data */
  const emptyTotal = { total_cost: "", service_name: "", notes: "" };
  const emptyInst  = { amount: "", method: "Cash", service_name: "", notes: "", appointment_id: "" };
  const [totalForm, setTotalForm] = useState(emptyTotal);
  const [instForm,  setInstForm]  = useState(emptyInst);

  const printRef = useRef();

  /* ── toast ──────────────────────────────────────────────── */
  const notify = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  /* ── fetch ──────────────────────────────────────────────── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, iRes] = await Promise.all([
        fetch(`${API}/billing/?patient_id=${patientId}`),
        fetch(`${API}/installments/?patient_id=${patientId}`),
      ]);
      const bData = await bRes.json();
      const iData = await iRes.json();
      setBilling(bData?.id ? bData : null);
      setInstallments(Array.isArray(iData) ? iData : []);
    } catch {
      notify("error", "Failed to load payment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [patientId]);

  /* ── computed totals ───────────────────────────────────── */
  const totalCost  = billing?.total_cost || 0;
  const totalPaid  = installments.reduce((s, i) => s + (i.amount || 0), 0);
  const remaining  = Math.max(0, totalCost - totalPaid);
  const pctPaid    = totalCost > 0 ? Math.min(100, (totalPaid / totalCost) * 100) : 0;
  const billStatus = totalCost === 0 ? "Due"
    : remaining === 0 ? "Paid"
    : totalPaid > 0   ? "Partial"
    : "Due";

  /* ══════════════════════════════════════════════════════════
     BILLING CRUD
  ══════════════════════════════════════════════════════════ */
  const saveTotalCost = async () => {
    if (!totalForm.total_cost || isNaN(totalForm.total_cost) || Number(totalForm.total_cost) <= 0) {
      notify("error", "Please enter a valid total cost."); return;
    }
    setSaving(true);
    try {
      const url = billing?.id
        ? `${API}/billing/update/${billing.id}/`
        : `${API}/billing/create/`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...totalForm, patient_id: patientId, total_cost: Number(totalForm.total_cost) }),
      });
      if (res.ok) {
        notify("success", billing?.id ? "Billing record updated!" : "Total cost set!");
        setShowSetTotal(false);
        setTotalForm(emptyTotal);
        fetchAll();
      } else {
        const e = await res.json();
        notify("error", e.error || "Save failed.");
      }
    } catch { notify("error", "Network error."); }
    finally { setSaving(false); }
  };

  /* ══════════════════════════════════════════════════════════
     INSTALLMENT CRUD
  ══════════════════════════════════════════════════════════ */
  const openAddPayment = () => {
    setEditingInst(null);
    setInstForm(emptyInst);
    setShowAddPay(true);
  };

  const openEditInst = (inst) => {
    setEditingInst(inst);
    setInstForm({
      amount:         String(inst.amount || ""),
      method:         inst.method       || "Cash",
      service_name:   inst.service_name || "",
      notes:          inst.notes        || "",
      appointment_id: inst.appointment_id || "",
    });
    setShowAddPay(true);
  };

  const saveInstallment = async () => {
    const amt = Number(instForm.amount);
    if (!instForm.amount || isNaN(amt) || amt <= 0) {
      notify("error", "Please enter a valid payment amount."); return;
    }
    if (!billing?.id) {
      notify("error", "Please set the total treatment cost first."); return;
    }
    setSaving(true);
    try {
      const url = editingInst
        ? `${API}/installments/update/${editingInst.id}/`
        : `${API}/installments/create/`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...instForm,
          amount:     amt,
          patient_id: patientId,
          billing_id: billing.id,
        }),
      });
      if (res.ok) {
        notify("success", editingInst ? "Payment updated!" : "Payment recorded!");
        setShowAddPay(false);
        setEditingInst(null);
        setInstForm(emptyInst);
        fetchAll();
      } else {
        const e = await res.json();
        notify("error", e.error || "Save failed.");
      }
    } catch { notify("error", "Network error."); }
    finally { setSaving(false); }
  };

  const deleteInstallment = async (id) => {
    if (!window.confirm("Delete this payment entry?")) return;
    try {
      const res = await fetch(`${API}/installments/delete/${id}/`, { method: "DELETE" });
      if (res.ok) { notify("success", "Payment deleted."); fetchAll(); }
      else notify("error", "Delete failed.");
    } catch { notify("error", "Network error."); }
  };

  /* ── print receipt ─────────────────────────────────────── */
  const printReceipt = (inst) => {
    setReceiptInst(inst);
    setTimeout(() => window.print(), 200);
  };

  const printFullStatement = () => {
    setReceiptInst(null);
    setTimeout(() => window.print(), 200);
  };

  /* ══════════════════════════════════════════════════════════
     LOADING STATE
  ══════════════════════════════════════════════════════════ */
  if (loading) return (
    <div className="pay-page">
      <div className="pay-loading">
        <div className="pay-spinner" />
        <p>Loading payment records…</p>
      </div>
    </div>
  );

  const pt = patient || {};
  const patSerial = pt.patient_serial ? `PT-${pt.patient_serial}` : pt.id ? `PT-${pt.id.slice(-5).toUpperCase()}` : "—";

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="pay-page" ref={printRef}>

      {/* ── Toast ─────────────────────────────────────────── */}
      {notification && (
        <div className={`pay-toast pay-toast--${notification.type}`}>
          <i className={`bi ${notification.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`} />
          {notification.msg}
        </div>
      )}

      {/* ═══════════════════════════════════════════
          HEADER BAR
      ═══════════════════════════════════════════ */}
      <div className="pay-header no-print">
        <button className="pay-back-btn" onClick={onBack}>
          <i className="bi bi-arrow-left" /> Back to Patients
        </button>
        <div className="pay-header-actions">
          <button className="pay-btn pay-btn--outline" onClick={printFullStatement}>
            <i className="bi bi-printer" /> Print Statement
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          PATIENT IDENTITY CARD
      ═══════════════════════════════════════════ */}
      <div className="pay-identity-card">
        <div className="pay-identity-stripe" />
        <div className="pay-identity-body">
          <div className="pay-identity-avatar">{avatar(pt.name)}</div>
          <div className="pay-identity-info">
            <h2 className="pay-patient-name">{pt.name || "Unknown Patient"}</h2>
            <div className="pay-identity-meta">
              <span><i className="bi bi-hash" /> {patSerial}</span>
              {pt.phone && <span><i className="bi bi-telephone" /> {pt.phone}</span>}
              {pt.email && <span><i className="bi bi-envelope" /> {pt.email}</span>}
              {billing?.service_name && <span><i className="bi bi-heart-pulse" /> {billing.service_name}</span>}
            </div>
          </div>
          <div className="pay-identity-badge">
            <span className={`pay-status-badge ${STATUS_META[billStatus]?.cls}`}>
              <i className={`bi ${STATUS_META[billStatus]?.icon}`} />
              {billStatus}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SUMMARY CARDS
      ═══════════════════════════════════════════ */}
      <div className="pay-summary-grid">
        {/* Total Cost */}
        <div className="pay-summary-card pay-summary-card--total">
          <div className="pay-summary-icon"><i className="bi bi-calculator" /></div>
          <div className="pay-summary-body">
            <span className="pay-summary-label">Total Treatment Cost</span>
            <span className="pay-summary-value">{fmtPKR(totalCost)}</span>
            {billing?.service_name && <span className="pay-summary-sub">{billing.service_name}</span>}
          </div>
          <button className="pay-summary-edit-btn no-print" onClick={() => {
            setTotalForm({ total_cost: String(totalCost), service_name: billing?.service_name || "", notes: billing?.notes || "" });
            setShowSetTotal(true);
          }}>
            <i className="bi bi-pencil" />
          </button>
        </div>

        {/* Total Paid */}
        <div className="pay-summary-card pay-summary-card--paid">
          <div className="pay-summary-icon pay-summary-icon--green"><i className="bi bi-check2-circle" /></div>
          <div className="pay-summary-body">
            <span className="pay-summary-label">Total Paid</span>
            <span className="pay-summary-value pay-summary-value--green">{fmtPKR(totalPaid)}</span>
            <span className="pay-summary-sub">{installments.length} payment{installments.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Remaining */}
        <div className="pay-summary-card pay-summary-card--due">
          <div className="pay-summary-icon pay-summary-icon--red"><i className="bi bi-hourglass-split" /></div>
          <div className="pay-summary-body">
            <span className="pay-summary-label">Remaining Due</span>
            <span className={`pay-summary-value ${remaining > 0 ? "pay-summary-value--red" : "pay-summary-value--green"}`}>
              {fmtPKR(remaining)}
            </span>
            <span className="pay-summary-sub">{remaining === 0 && totalCost > 0 ? "Fully cleared ✓" : remaining > 0 ? "Outstanding" : "No cost set"}</span>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ────────────────────────────────────── */}
      {totalCost > 0 && (
        <div className="pay-progress-wrap">
          <div className="pay-progress-labels">
            <span>Payment Progress</span>
            <span className="pay-progress-pct">{Math.round(pctPaid)}% cleared</span>
          </div>
          <div className="pay-progress-track">
            <div className="pay-progress-fill" style={{ width: `${pctPaid}%` }} />
          </div>
          <div className="pay-progress-milestones">
            <span>PKR 0</span>
            <span>{fmtPKR(totalCost / 2)}</span>
            <span>{fmtPKR(totalCost)}</span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          SET TOTAL COST  (shown when no billing exists OR edit)
      ═══════════════════════════════════════════ */}
      {!billing && !showSetTotal && (
        <div className="pay-onboard-card no-print">
          <div className="pay-onboard-icon"><i className="bi bi-cash-coin" /></div>
          <h3>Set Total Treatment Cost</h3>
          <p>Define the total cost before recording installments</p>
          <button className="pay-btn pay-btn--primary" onClick={() => setShowSetTotal(true)}>
            <i className="bi bi-plus-lg" /> Set Total Cost
          </button>
        </div>
      )}

      {showSetTotal && (
        <div className="pay-form-card">
          <div className="pay-form-header">
            <h3><i className="bi bi-calculator" /> {billing ? "Update Billing Details" : "Set Total Treatment Cost"}</h3>
            <button className="pay-form-close" onClick={() => setShowSetTotal(false)}>
              <i className="bi bi-x-lg" />
            </button>
          </div>
          <div className="pay-form-grid">
            <div className="pay-field">
              <label>Total Treatment Cost (PKR) <span className="pay-req">*</span></label>
              <input
                type="number"
                value={totalForm.total_cost}
                onChange={(e) => setTotalForm({ ...totalForm, total_cost: e.target.value })}
                placeholder="e.g. 75000"
              />
            </div>
            <div className="pay-field">
              <label>Service / Procedure</label>
              <input
                type="text"
                value={totalForm.service_name}
                onChange={(e) => setTotalForm({ ...totalForm, service_name: e.target.value })}
                placeholder="e.g. Braces Treatment, Implant, RCT"
              />
            </div>
            <div className="pay-field pay-field--full">
              <label>Notes (Optional)</label>
              <textarea
                value={totalForm.notes}
                onChange={(e) => setTotalForm({ ...totalForm, notes: e.target.value })}
                placeholder="Any additional billing notes…"
                rows={2}
              />
            </div>
          </div>
          <div className="pay-form-actions">
            <button className="pay-btn pay-btn--ghost" onClick={() => setShowSetTotal(false)}>Cancel</button>
            <button className="pay-btn pay-btn--primary" onClick={saveTotalCost} disabled={saving}>
              {saving ? <><i className="bi bi-hourglass-split" /> Saving…</> : <><i className="bi bi-check-lg" /> {billing ? "Update" : "Set Cost"}</>}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          ADD / EDIT PAYMENT FORM
      ═══════════════════════════════════════════ */}
      {showAddPay && (
        <div className="pay-form-card pay-form-card--green">
          <div className="pay-form-header">
            <h3><i className="bi bi-cash-stack" /> {editingInst ? "Edit Payment Entry" : "Record New Payment"}</h3>
            <button className="pay-form-close" onClick={() => { setShowAddPay(false); setEditingInst(null); }}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {/* Live balance preview */}
          {!editingInst && billing && (
            <div className="pay-balance-preview">
              <span>Remaining before this payment:</span>
              <strong className={remaining > 0 ? "text-red" : "text-green"}>{fmtPKR(remaining)}</strong>
              {instForm.amount && Number(instForm.amount) > 0 && (
                <>
                  <span>→ After this payment:</span>
                  <strong className={Math.max(0, remaining - Number(instForm.amount)) > 0 ? "text-red" : "text-green"}>
                    {fmtPKR(Math.max(0, remaining - Number(instForm.amount)))}
                  </strong>
                </>
              )}
            </div>
          )}

          <div className="pay-form-grid">
            <div className="pay-field">
              <label>Payment Amount (PKR) <span className="pay-req">*</span></label>
              <input
                type="number"
                value={instForm.amount}
                onChange={(e) => setInstForm({ ...instForm, amount: e.target.value })}
                placeholder="e.g. 5000"
              />
            </div>
            <div className="pay-field">
              <label>Payment Method</label>
              <select value={instForm.method} onChange={(e) => setInstForm({ ...instForm, method: e.target.value })}>
                <option value="Cash">Cash</option>
                <option value="Online Transfer">Online Transfer</option>
                <option value="Card">Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div className="pay-field">
              <label>Service / Procedure</label>
              <input
                type="text"
                value={instForm.service_name}
                onChange={(e) => setInstForm({ ...instForm, service_name: e.target.value })}
                placeholder="e.g. 1st Braces Session"
              />
            </div>
            <div className="pay-field">
              <label>Appointment ID (Optional)</label>
              <input
                type="text"
                value={instForm.appointment_id}
                onChange={(e) => setInstForm({ ...instForm, appointment_id: e.target.value })}
                placeholder="Link to appointment"
              />
            </div>
            <div className="pay-field pay-field--full">
              <label>Notes (Optional)</label>
              <textarea
                value={instForm.notes}
                onChange={(e) => setInstForm({ ...instForm, notes: e.target.value })}
                placeholder="Any notes about this payment…"
                rows={2}
              />
            </div>
          </div>
          <div className="pay-form-actions">
            <button className="pay-btn pay-btn--ghost" onClick={() => { setShowAddPay(false); setEditingInst(null); }}>Cancel</button>
            <button className="pay-btn pay-btn--green" onClick={saveInstallment} disabled={saving}>
              {saving ? <><i className="bi bi-hourglass-split" /> Saving…</> : <><i className="bi bi-check-lg" /> {editingInst ? "Update Payment" : "Record Payment"}</>}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          PAYMENT HISTORY
      ═══════════════════════════════════════════ */}
      <div className="pay-history-section">
        <div className="pay-history-header">
          <div>
            <h2 className="pay-history-title"><i className="bi bi-clock-history" /> Payment History</h2>
            <p className="pay-history-sub">{installments.length} payment record{installments.length !== 1 ? "s" : ""} on file</p>
          </div>
          {billing && (
            <button className="pay-btn pay-btn--green no-print" onClick={openAddPayment}>
              <i className="bi bi-plus-lg" /> Add Payment
            </button>
          )}
        </div>

        {installments.length === 0 ? (
          <div className="pay-empty">
            <div className="pay-empty-icon"><i className="bi bi-receipt" /></div>
            <h3>No payments recorded yet</h3>
            <p>{billing ? "Click \"Add Payment\" to record the first installment" : "Set the total cost first, then add payments"}</p>
          </div>
        ) : (
          <>
            {/* ── Table (desktop) ── */}
            <div className="pay-table-wrap">
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date & Time</th>
                    <th>Amount Paid</th>
                    <th>Method</th>
                    <th>Service</th>
                    <th>Balance After</th>
                    <th>Notes</th>
                    <th className="no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {installments.map((inst, idx) => {
                    const balAfter = inst.balance_after ?? (totalCost - installments.slice(0, idx + 1).reduce((s, i) => s + i.amount, 0));
                    return (
                      <tr key={inst.id}>
                        <td>
                          <span className="pay-row-idx">{String(idx + 1).padStart(2, "0")}</span>
                        </td>
                        <td>
                          <div className="pay-date-cell">
                            <span className="pay-date">{fmtDate(inst.created_at)}</span>
                            <span className="pay-time">{fmtTime(inst.created_at)}</span>
                          </div>
                        </td>
                        <td>
                          <span className="pay-amount-cell">{fmtPKR(inst.amount)}</span>
                        </td>
                        <td>
                          <span className={`pay-method-badge pay-method--${(inst.method || "cash").toLowerCase().replace(" ", "-")}`}>
                            <i className={`bi ${inst.method === "Cash" ? "bi-cash" : inst.method === "Online Transfer" ? "bi-phone" : "bi-credit-card"}`} />
                            {inst.method || "Cash"}
                          </span>
                        </td>
                        <td className="pay-service-cell">{inst.service_name || "—"}</td>
                        <td>
                          <span className={balAfter <= 0 ? "pay-bal-clear" : "pay-bal-due"}>
                            {balAfter <= 0 ? <><i className="bi bi-check-circle-fill" /> Cleared</> : fmtPKR(balAfter)}
                          </span>
                        </td>
                        <td className="pay-notes-cell">{inst.notes || "—"}</td>
                        <td className="no-print">
                          <div className="pay-row-actions">
                            <button className="pay-icon-btn pay-icon-btn--receipt" onClick={() => printReceipt(inst)} title="Print Receipt">
                              <i className="bi bi-printer" />
                            </button>
                            <button className="pay-icon-btn pay-icon-btn--edit" onClick={() => openEditInst(inst)} title="Edit">
                              <i className="bi bi-pencil" />
                            </button>
                            <button className="pay-icon-btn pay-icon-btn--del" onClick={() => deleteInstallment(inst.id)} title="Delete">
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="pay-table-total-row">
                    <td colSpan={2}><strong>Total</strong></td>
                    <td><strong className="pay-amount-cell">{fmtPKR(totalPaid)}</strong></td>
                    <td colSpan={2} />
                    <td>
                      <strong className={remaining <= 0 ? "pay-bal-clear" : "pay-bal-due"}>
                        {remaining <= 0 ? "Fully Paid" : fmtPKR(remaining) + " due"}
                      </strong>
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="pay-mobile-cards">
              {installments.map((inst, idx) => {
                const balAfter = inst.balance_after ?? (totalCost - installments.slice(0, idx + 1).reduce((s, i) => s + i.amount, 0));
                return (
                  <div key={inst.id} className="pay-mobile-card">
                    <div className="pay-mc-top">
                      <span className="pay-row-idx">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="pay-amount-cell">{fmtPKR(inst.amount)}</span>
                      <span className={`pay-method-badge pay-method--${(inst.method || "cash").toLowerCase().replace(" ", "-")}`}>
                        {inst.method || "Cash"}
                      </span>
                    </div>
                    <div className="pay-mc-meta">
                      <span><i className="bi bi-calendar3" /> {fmtDate(inst.created_at)} {fmtTime(inst.created_at)}</span>
                      {inst.service_name && <span><i className="bi bi-heart-pulse" /> {inst.service_name}</span>}
                    </div>
                    <div className="pay-mc-balance">
                      Balance after: <span className={balAfter <= 0 ? "pay-bal-clear" : "pay-bal-due"}>
                        {balAfter <= 0 ? "Cleared ✓" : fmtPKR(balAfter)}
                      </span>
                    </div>
                    <div className="pay-mc-actions no-print">
                      <button className="pay-icon-btn pay-icon-btn--receipt" onClick={() => printReceipt(inst)}><i className="bi bi-printer" /></button>
                      <button className="pay-icon-btn pay-icon-btn--edit" onClick={() => openEditInst(inst)}><i className="bi bi-pencil" /></button>
                      <button className="pay-icon-btn pay-icon-btn--del" onClick={() => deleteInstallment(inst.id)}><i className="bi bi-trash" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          PRINT — RECEIPT or FULL STATEMENT
      ═══════════════════════════════════════════ */}
      <div className="print-only pay-receipt">
        <div className="pay-receipt-header">
          <div>
            <h1>DentisTree Dental Clinic</h1>
            <p>Professional Dental Care</p>
          </div>
          <div className="pay-receipt-stamp">
            {receiptInst ? "RECEIPT" : "STATEMENT"}
          </div>
        </div>
        <div className="pay-receipt-divider" />

        <div className="pay-receipt-patient">
          <div><strong>Patient:</strong> {pt.name}</div>
          <div><strong>ID:</strong> {patSerial}</div>
          <div><strong>Phone:</strong> {pt.phone || "—"}</div>
          <div><strong>Date:</strong> {new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}</div>
        </div>

        {receiptInst ? (
          <div className="pay-receipt-single">
            <h3>Payment Receipt</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.75rem" }}>
              <tbody>
                <tr><td><strong>Amount Paid</strong></td><td style={{ textAlign: "right" }}><strong>{fmtPKR(receiptInst.amount)}</strong></td></tr>
                <tr><td>Payment Method</td><td style={{ textAlign: "right" }}>{receiptInst.method}</td></tr>
                <tr><td>Service</td><td style={{ textAlign: "right" }}>{receiptInst.service_name || "—"}</td></tr>
                <tr><td>Date</td><td style={{ textAlign: "right" }}>{fmtDate(receiptInst.created_at)} {fmtTime(receiptInst.created_at)}</td></tr>
                {receiptInst.notes && <tr><td>Notes</td><td style={{ textAlign: "right" }}>{receiptInst.notes}</td></tr>}
              </tbody>
            </table>
            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f0fdf4", borderRadius: "4px", textAlign: "center" }}>
              <strong>Thank you for your payment!</strong>
            </div>
          </div>
        ) : (
          <>
            <h3 style={{ marginTop: "1rem" }}>Payment Statement</h3>
            <div className="pay-receipt-summary">
              <span>Total Cost: <strong>{fmtPKR(totalCost)}</strong></span>
              <span>Total Paid: <strong>{fmtPKR(totalPaid)}</strong></span>
              <span>Remaining: <strong>{fmtPKR(remaining)}</strong></span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.75rem", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #1a5276", paddingBottom: "4px" }}>
                  <th style={{ textAlign: "left", padding: "6px 0" }}>#</th>
                  <th style={{ textAlign: "left", padding: "6px 0" }}>Date</th>
                  <th style={{ textAlign: "right", padding: "6px 0" }}>Amount</th>
                  <th style={{ textAlign: "left", padding: "6px 0" }}>Method</th>
                  <th style={{ textAlign: "right", padding: "6px 0" }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((inst, idx) => {
                  const balAfter = inst.balance_after ?? (totalCost - installments.slice(0, idx + 1).reduce((s, i) => s + i.amount, 0));
                  return (
                    <tr key={inst.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "5px 0" }}>{idx + 1}</td>
                      <td style={{ padding: "5px 0" }}>{fmtDate(inst.created_at)}</td>
                      <td style={{ padding: "5px 0", textAlign: "right" }}>{fmtPKR(inst.amount)}</td>
                      <td style={{ padding: "5px 0" }}>{inst.method}</td>
                      <td style={{ padding: "5px 0", textAlign: "right" }}>{balAfter <= 0 ? "Cleared" : fmtPKR(balAfter)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        <div className="pay-receipt-footer">
          <p>DentisTree Dental Clinic — Printed {new Date().toLocaleString("en-PK")}</p>
          <p>Thank you for choosing DentisTree!</p>
        </div>
      </div>

    </div>
  );
}