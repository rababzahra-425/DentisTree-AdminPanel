// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { API_BASE } from "../api";
// import "./Patient.css";
// import PrescriptionPage from "./PrescriptionPage";
// import PaymentPage from "./PaymentPage";

// const API = import.meta.env.VITE_API_BASE || API_BASE || "http://127.0.0.1:8000";

// /* ─── tiny helpers ─────────────────────────────────────────── */
// const avatar = (name) => (name ? name.charAt(0).toUpperCase() : "P");

// const emptyAdd = { name: "", email: "", phone: "" };
// const emptyPay = { amount: "", method: "Cash", status: "Pending" };

// function Patients({ refreshToken = 0, isVisible = true }) {
//   const [patients, setPatients]           = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [refreshing, setRefreshing]       = useState(false);
//   const mountedRef = useRef(true);

//   // ── page routing (full patient objects) ─────────────────────
//   const [rxPatient,  setRxPatient]  = useState(null);   // Prescription page
//   const [payPatientPage, setPayPatientPage] = useState(null); // Payment page  ← NEW

//   // modals
//   const [viewPatient, setViewPatient]     = useState(null);
//   const [editPatient, setEditPatient]     = useState(null);
//   const [showAdd, setShowAdd]             = useState(false);

//   // forms
//   const [editForm, setEditForm]           = useState({});
//   const [addForm, setAddForm]             = useState(emptyAdd);
//   const [saving, setSaving]               = useState(false);

//   /* ─── fetch ─────────────────────────────────────────────── */
//   const fetchPatients = useCallback(async (silent = false) => {
//     if (!silent) setLoading(true);
//     else setRefreshing(true);
//     try {
//       const res = await fetch(`${API}/patients/`);
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || `Server error (${res.status})`);
//       }
//       const data = await res.json();
//       if (mountedRef.current) {
//         setPatients(Array.isArray(data) ? data : []);
//       }
//     } catch (e) {
//       console.error("Fetch error:", e);
//       if (!silent && mountedRef.current) setPatients([]);
//     } finally {
//       if (mountedRef.current) {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     mountedRef.current = true;
//     fetchPatients();
//     return () => { mountedRef.current = false; };
//   }, [fetchPatients]);

//   useEffect(() => {
//     if (refreshToken > 0) fetchPatients(true);
//   }, [refreshToken, fetchPatients]);

//   useEffect(() => {
//     if (!isVisible) return;
//     fetchPatients(true);
//     const id = setInterval(() => fetchPatients(true), 20000);
//     return () => clearInterval(id);
//   }, [isVisible, fetchPatients]);

//   /* ─── open modals ────────────────────────────────────────── */
//   const openEdit = (p) => {
//     setEditPatient(p);
//     setEditForm({ name: p.name, email: p.email, phone: p.phone || "" });
//   };

//   /* ─── save: edit patient ─────────────────────────────────── */
//   const saveEdit = async () => {
//     if (!editPatient) return;
//     if (editForm.phone && editForm.phone.length !== 11) {
//       alert("Phone number must be exactly 11 digits.");
//       return;
//     }
//     setSaving(true);
//     try {
//       const res = await fetch(`${API}/patients/update/${editPatient.id}/`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(editForm),
//       });
//       if (res.ok) {
//         await fetchPatients();
//         setEditPatient(null);
//       } else {
//         const err = await res.json();
//         alert(err.error || "Update failed");
//       }
//     } catch (e) { alert("Network error"); }
//     finally { setSaving(false); }
//   };

//   /* ─── save: delete patient ───────────────────────────────── */
//   const deletePatient = async (id) => {
//     if (!window.confirm("Delete this patient record permanently?")) return;
//     try {
//       const res = await fetch(`${API}/patients/delete/${id}/`, { method: "DELETE" });
//       if (res.ok) await fetchPatients();
//       else alert("Delete failed.");
//     } catch (e) { alert("Network error"); }
//   };

//   /* ─── save: add patient ──────────────────────────────────── */
//   const saveAdd = async () => {
//     if (!addForm.name || !addForm.email) { alert("Name and email are required."); return; }
//     if (addForm.phone && addForm.phone.length !== 11) {
//       alert("Phone number must be exactly 11 digits.");
//       return;
//     }
//     setSaving(true);
//     try {
//       const res = await fetch(`${API}/patients/create/`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(addForm),
//       });
//       if (res.ok) { await fetchPatients(); setShowAdd(false); setAddForm(emptyAdd); }
//       else { const e = await res.json(); alert(e.error || "Create failed"); }
//     } catch (e) { alert("Network error"); }
//     finally { setSaving(false); }
//   };

//   const handlePhoneChange = (e, formType) => {
//     const value = e.target.value.replace(/\D/g, "");
//     if (value.length <= 11) {
//       if (formType === "add") setAddForm({ ...addForm, phone: value });
//       else setEditForm({ ...editForm, phone: value });
//     }
//   };

//   /* ══════════════════════════════════════════════════════════
//      Route: Prescription page
//   ══════════════════════════════════════════════════════════ */
//   if (rxPatient) {
//     return (
//       <PrescriptionPage
//         patientId={rxPatient.id}
//         patientData={rxPatient}
//         onBack={() => setRxPatient(null)}
//       />
//     );
//   }

//   /* ══════════════════════════════════════════════════════════
//      Route: Payment page  ← NEW
//   ══════════════════════════════════════════════════════════ */
//   if (payPatientPage) {
//     return (
//       <PaymentPage
//         patientId={payPatientPage.id}
//         patientData={payPatientPage}
//         onBack={() => setPayPatientPage(null)}
//       />
//     );
//   }

//   /* ─── render ─────────────────────────────────────────────── */
//   return (
//     <div className="pt-page">

//       {/* ── Page header ── */}
//       <div className="pt-topbar">
//         <div>
//           <h2 className="pt-title">Patient Records</h2>
//           <p className="pt-sub">
//             {patients.length} patient{patients.length !== 1 ? "s" : ""} registered
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           {/* <button
//             type="button"
//             className="pt-btn-add"
//             style={{ background: "#e8edf5", color: "#475569", border: "1px solid #cbd5e1" }}
//             onClick={() => fetchPatients(true)}
//             disabled={refreshing}
//           >
//             {refreshing ? "Refreshing…" : "↻ Refresh"}
//           </button> */}
//           <button
//   type="button"
//   className="pt-btn-add pt-btn-refresh" // Added pt-btn-refresh class
//   onClick={() => fetchPatients(true)}
//   disabled={refreshing}
// >
//   {refreshing ? "Refreshing…" : "↻ Refresh"}
// </button>
//           <button className="pt-btn-add" onClick={() => setShowAdd(true)}>
//             <i className="bi bi-person-plus-fill" /> Add Patient
//           </button>
//         </div>
//       </div>

//       {/* ── Table ── */}
//       <div className="pt-card">
//         <div className="pt-thead">
//           <div className="head">
//             <span>PATIENT</span>
//             <span>CONTACT</span>
//             <span>LAST SERVICE</span>
//             <span>PRESCRIPTION & PAYMENT</span>
//             <span>ACTIONS</span>
//           </div>

//           <div className="pt-tbody">
//             {loading && (
//               <div className="pt-empty">
//                 <span className="pt-spin" /> Loading…
//               </div>
//             )}

//             {!loading && patients.length === 0 && (
//               <div className="pt-empty">No patient records found.</div>
//             )}

//             {!loading && patients.map((p) => {
//               const lastAppt = p.appointments?.[0];

//               return (
//                 <div key={p.id} className="pt-row">

//                   {/* Patient avatar + name */}
//                   <div className="pt-cell pt-cell--patient">
//                     <div className="pt-avatar">{avatar(p.name)}</div>
//                     <div>
//                       <div className="pt-name">{p.name}</div>
//                       <div className="pt-chip-id">
//                         ID-{p.patient_serial || p.id.slice(-5).toUpperCase()}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Contact */}
//                   <div className="pt-cell pt-cell--contact">
//                     <div className="pt-contact-line">
//                       <i className="bi bi-telephone" /> {p.phone || "—"}
//                     </div>
//                     <div className="pt-contact-line pt-muted">
//                       <i className="bi bi-envelope" /> {p.email}
//                     </div>
//                   </div>

//                   {/* Last service */}
//                   <div className="pt-celll">
//                     {lastAppt
//                       ? <>
//                           <div className="pt-service-name">{lastAppt.service || "—"}</div>
//                           <div className="pt-muted" style={{ fontSize: 12 }}>
//                             {new Date(lastAppt.date).toLocaleDateString()}
//                           </div>
//                         </>
//                       : <span className="pt-muted">No appointments</span>
//                     }
//                   </div>

//                   {/* Prescription & Payment */}
//                   <div className="pt-cell pt-cell--rxpay">
//                     {/* ── Prescription button ── */}
//                     <button
//                       className="pt-btn pt-btn--rx"
//                       onClick={() => setRxPatient(p)}
//                       title="Open Prescription & Treatment Records"
//                     >
//                       <i className="bi bi-file-earmark-medical" /> Prescription
//                     </button>

//                     {/* ── Payment button — always shows "Payment", opens full page ── */}
//                     <button
//                       className="pt-btn pt-btn--pay"
//                       onClick={() => setPayPatientPage(p)}
//                       title="Open Payment Management"
//                     >
//                       <i className="bi bi-cash-coin" /> Payment
//                     </button>
//                   </div>

//                   {/* Actions */}
//                   <div className="pt-cell pt-cell--actions">
//                     <button className="pt-action-btn pt-action-btn--view"
//                       onClick={() => setViewPatient(p)} title="View Details">
//                       <i className="bi bi-eye" />
//                     </button>
//                     <button className="pt-action-btn pt-action-btn--edit"
//                       onClick={() => openEdit(p)} title="Edit">
//                       <i className="bi bi-pencil" />
//                     </button>
//                     <button className="pt-action-btn pt-action-btn--del"
//                       onClick={() => deletePatient(p.id)} title="Delete">
//                       <i className="bi bi-trash" />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ════════════ MODAL: View Patient ════════════ */}
//       {viewPatient && (
//         <Overlay onClose={() => setViewPatient(null)}>
//           <div className="pt-modal">
//             <ModalHeader title={`Patient Details · ${viewPatient.name}`} onClose={() => setViewPatient(null)} />
//             <div className="pt-form">
//               <Detail label="Name"  value={viewPatient.name} />
//               <Detail label="Email" value={viewPatient.email} />
//               <Detail label="Phone" value={viewPatient.phone || "—"} />
//               <Detail label="Patient ID" value={`PT-${viewPatient.patient_serial || viewPatient.id.slice(-5).toUpperCase()}`} />
//               <Detail label="Appointments" value={viewPatient.appointments?.length || 0} />
//             </div>
//             <div className="pt-modal-footer">
//               <button className="pt-btn pt-btn--ghost" onClick={() => setViewPatient(null)}>Close</button>
//             </div>
//           </div>
//         </Overlay>
//       )}

//       {/* ════════════ MODAL: Edit Patient ════════════ */}
//       {editPatient && (
//         <Overlay onClose={() => setEditPatient(null)}>
//           <div className="pt-modal">
//             <ModalHeader title={`Edit · ${editPatient.name}`} onClose={() => setEditPatient(null)} />
//             <div className="pt-form">
//               <FormField label="Full Name *">
//                 <input value={editForm.name}
//                   onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                   placeholder="Full name" />
//               </FormField>
//               <FormField label="Email *">
//                 <input type="email" value={editForm.email}
//                   onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                   placeholder="Email address" />
//               </FormField>
//               <FormField label="Phone (11 Digits)">
//                 <input value={editForm.phone}
//                   onChange={(e) => handlePhoneChange(e, "edit")}
//                   placeholder="03001234567" maxLength="11" />
//                 {editForm.phone.length > 0 && editForm.phone.length < 11 && (
//                   <small style={{ color: "orange" }}>Must be 11 digits</small>
//                 )}
//               </FormField>
//             </div>
//             <div className="pt-modal-footer">
//               <button className="pt-btn pt-btn--ghost" onClick={() => setEditPatient(null)}>Cancel</button>
//               <button className="pt-btn pt-btn--primary" onClick={saveEdit} disabled={saving}>
//                 {saving ? "Saving…" : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </Overlay>
//       )}

//       {/* ════════════ MODAL: Add Patient ════════════ */}
//       {showAdd && (
//         <Overlay onClose={() => { setShowAdd(false); setAddForm(emptyAdd); }}>
//           <div className="pt-modal">
//             <ModalHeader title="Add New Patient" onClose={() => { setShowAdd(false); setAddForm(emptyAdd); }} />
//             <div className="pt-form">
//               <FormField label="Full Name *">
//                 <input value={addForm.name}
//                   onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
//                   placeholder="Enter patient's full name" />
//               </FormField>
//               <FormField label="Email *">
//                 <input type="email" value={addForm.email}
//                   onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
//                   placeholder="patient@example.com" />
//               </FormField>
//               <FormField label="Phone (11 Digits)">
//                 <input type="text" value={addForm.phone}
//                   onChange={(e) => handlePhoneChange(e, "add")}
//                   placeholder="03001234567" maxLength="11" />
//                 {addForm.phone.length > 0 && addForm.phone.length < 11 && (
//                   <small style={{ color: "orange" }}>Must be 11 digits</small>
//                 )}
//               </FormField>
//             </div>
//             <div className="pt-modal-footer">
//               <button className="pt-btn pt-btn--ghost" onClick={() => { setShowAdd(false); setAddForm(emptyAdd); }}>Cancel</button>
//               <button className="pt-btn pt-btn--primary" onClick={saveAdd} disabled={saving}>
//                 {saving ? "Creating…" : "Create Patient"}
//               </button>
//             </div>
//           </div>
//         </Overlay>
//       )}

//     </div>
//   );
// }

// /* ─── small reusable sub-components ─────────────────────────── */
// function Overlay({ children, onClose }) {
//   return (
//     <div className="pt-overlay" onClick={onClose}>
//       <div onClick={(e) => e.stopPropagation()}>{children}</div>
//     </div>
//   );
// }

// function ModalHeader({ title, onClose }) {
//   return (
//     <div className="pt-modal-header">
//       <span className="pt-modal-title">{title}</span>
//       <button className="pt-modal-close" onClick={onClose}>&times;</button>
//     </div>
//   );
// }

// function FormField({ label, children }) {
//   return (
//     <div className="pt-field">
//       <label className="pt-label">{label}</label>
//       {children}
//     </div>
//   );
// }

// function Detail({ label, value }) {
//   return (
//     <div className="pt-detail-item">
//       <span className="pt-detail-label">{label}</span>
//       <span className="pt-detail-value">{value}</span>
//     </div>
//   );
// }

// export default Patients;



import React, { useEffect, useState, useCallback, useRef } from "react";
import { API_BASE } from "../api";
import "./Patient.css";
import PrescriptionPage from "./PrescriptionPage";
import PaymentPage from "./PaymentPage";

const API = API_BASE;

/* ─── tiny helpers ─────────────────────────────────────────── */
const avatar = (name) => (name ? name.charAt(0).toUpperCase() : "P");

const emptyAdd = { name: "", email: "", phone: "" };
const emptyPay = { amount: "", method: "Cash", status: "Pending" };

function Patients({ refreshToken = 0, isVisible = true }) {
  const [patients, setPatients]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const mountedRef = useRef(true);

  // ── page routing (full patient objects) ─────────────────────
  const [rxPatient,  setRxPatient]  = useState(null);   // Prescription page
  const [payPatientPage, setPayPatientPage] = useState(null); // Payment page  ← NEW

  // modals
  const [viewPatient, setViewPatient]     = useState(null);
  const [editPatient, setEditPatient]     = useState(null);
  const [showAdd, setShowAdd]             = useState(false);

  // forms
  const [editForm, setEditForm]           = useState({});
  const [addForm, setAddForm]             = useState(emptyAdd);
  const [saving, setSaving]               = useState(false);

  /* ─── fetch ─────────────────────────────────────────────── */
  const fetchPatients = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`${API}/patients/`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      if (mountedRef.current) {
        setPatients(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      if (!silent && mountedRef.current) setPatients([]);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchPatients();
    return () => { mountedRef.current = false; };
  }, [fetchPatients]);

  useEffect(() => {
    if (refreshToken > 0) fetchPatients(true);
  }, [refreshToken, fetchPatients]);

  useEffect(() => {
    if (!isVisible) return;
    fetchPatients(true);
    const id = setInterval(() => fetchPatients(true), 20000);
    return () => clearInterval(id);
  }, [isVisible, fetchPatients]);

  /* ─── open modals ────────────────────────────────────────── */
  const openEdit = (p) => {
    setEditPatient(p);
    setEditForm({ name: p.name, email: p.email, phone: p.phone || "" });
  };

  /* ─── save: edit patient ─────────────────────────────────── */
  const saveEdit = async () => {
    if (!editPatient) return;
    if (editForm.phone && editForm.phone.length !== 11) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/patients/update/${editPatient.id}/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editForm),
      });
      if (res.ok) {
        await fetchPatients();
        setEditPatient(null);
      } else {
        const err = await res.json();
        alert(err.error || "Update failed");
      }
    } catch (e) { alert("Network error"); }
    finally { setSaving(false); }
  };

  /* ─── save: delete patient ───────────────────────────────── */
  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient record permanently?")) return;
    try {
      const res = await fetch(`${API}/patients/delete/${id}/`, { method: "DELETE" });
      if (res.ok) await fetchPatients();
      else alert("Delete failed.");
    } catch (e) { alert("Network error"); }
  };

  /* ─── save: add patient ──────────────────────────────────── */
  const saveAdd = async () => {
    if (!addForm.name || !addForm.email) { alert("Name and email are required."); return; }
    if (addForm.phone && addForm.phone.length !== 11) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/patients/create/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(addForm),
      });
      if (res.ok) { await fetchPatients(); setShowAdd(false); setAddForm(emptyAdd); }
      else { const e = await res.json(); alert(e.error || "Create failed"); }
    } catch (e) { alert("Network error"); }
    finally { setSaving(false); }
  };

  const handlePhoneChange = (e, formType) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      if (formType === "add") setAddForm({ ...addForm, phone: value });
      else setEditForm({ ...editForm, phone: value });
    }
  };

  /* ══════════════════════════════════════════════════════════
     Route: Prescription page
  ══════════════════════════════════════════════════════════ */
  if (rxPatient) {
    return (
      <PrescriptionPage
        patientId={rxPatient.id}
        patientData={rxPatient}
        onBack={() => setRxPatient(null)}
      />
    );
  }

  /* ══════════════════════════════════════════════════════════
     Route: Payment page  ← NEW
  ══════════════════════════════════════════════════════════ */
  if (payPatientPage) {
    return (
      <PaymentPage
        patientId={payPatientPage.id}
        patientData={payPatientPage}
        onBack={() => setPayPatientPage(null)}
      />
    );
  }

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div className="pt-page">

      {/* ── Page header ── */}
      <div className="pt-topbar">
        <div>
          <h2 className="pt-title">Patient Records</h2>
          <p className="pt-sub">
            {patients.length} patient{patients.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* <button
            type="button"
            className="pt-btn-add"
            style={{ background: "#e8edf5", color: "#475569", border: "1px solid #cbd5e1" }}
            onClick={() => fetchPatients(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "↻ Refresh"}
          </button> */}
          <button
  type="button"
  className="pt-btn-add pt-btn-refresh" // Added pt-btn-refresh class
  onClick={() => fetchPatients(true)}
  disabled={refreshing}
>
  {refreshing ? "Refreshing…" : "↻ Refresh"}
</button>
          <button className="pt-btn-add" onClick={() => setShowAdd(true)}>
            <i className="bi bi-person-plus-fill" /> Add Patient
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="tablecontainer">

        {/* Header row */}
        <div className="table-header-griddd pt-grid">
          <span>PATIENT</span>
          <span>CONTACT</span>
          <span>LAST SERVICE</span>
          <span>PRESCRIPTION & PAYMENT</span>
          <span>ACTIONS</span>
        </div>

        {/* Body */}
        {loading && (
          <div className="pt-empty">
            <span className="pt-spin" /> Loading…
          </div>
        )}

        {!loading && patients.length === 0 && (
          <div className="pt-empty">No patient records found.</div>
        )}

        {!loading && patients.map((p) => {
          const lastAppt = p.appointments?.[0];

          return (
            <div key={p.id} className="appointment-card-rowww pt-grid">

              {/* Patient avatar + name */}
              <div className="col-patient">
                <div className="avatar-box">{avatar(p.name)}</div>
                <div>
                  <div className="p-name">{p.name}</div>
                  <div className="pt-chip-id">
                    ID-{p.patient_serial || p.id.slice(-5).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="pt-cell pt-cell--contact">
                <div className="pt-contact-line">
                  <i className="bi bi-telephone" /> {p.phone || "—"}
                </div>
                <div className="pt-contact-line pt-muted">
                  <i className="bi bi-envelope" /> {p.email}
                </div>
              </div>

              {/* Last service */}
              <div className="pt-celll">
                {lastAppt
                  ? <>
                      <div className="d-text">{lastAppt.service || "—"}</div>
                      <div className="pt-muted" style={{ fontSize: 12 }}>
                        {new Date(lastAppt.date).toLocaleDateString()}
                      </div>
                    </>
                  : <span className="pt-muted">No appointments</span>
                }
              </div>

              {/* Prescription & Payment */}
              <div className="pt-cell pt-cell--rxpay">
                <button
                  className="pt-btn pt-btn--rx"
                  onClick={() => setRxPatient(p)}
                  title="Open Prescription & Treatment Records"
                >
                  <i className="bi bi-file-earmark-medical" /> Prescription
                </button>
                <button
                  className="pt-btn pt-btn--pay"
                  onClick={() => setPayPatientPage(p)}
                  title="Open Payment Management"
                >
                  <i className="bi bi-cash-coin" /> Payment
                </button>
              </div>

              {/* Actions */}
              <div className="col-actions">
                <button className="btn-icon-round view"
                  onClick={() => setViewPatient(p)} title="View Details">
                  <i className="bi bi-eye" />
                </button>
                <button className="btn-icon-round approve"
                  onClick={() => openEdit(p)} title="Edit">
                  <i className="bi bi-pencil" />
                </button>
                <button className="btn-icon-round delete"
                  onClick={() => deletePatient(p.id)} title="Delete">
                  <i className="bi bi-trash" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ════════════ MODAL: View Patient ════════════ */}
      {viewPatient && (
        <Overlay onClose={() => setViewPatient(null)}>
          <div className="pt-view-modal">

            {/* ── Coloured header band with avatar ── */}
            <div className="pt-view-hero">
              <div className="pt-view-avatar-lg">{avatar(viewPatient.name)}</div>
              <div className="pt-view-hero-text">
                <h3 className="pt-view-name">{viewPatient.name}</h3>
                <span className="pt-view-id-badge">
                  PT-{viewPatient.patient_serial || viewPatient.id.slice(-5).toUpperCase()}
                </span>
              </div>
              <button className="pt-view-close" onClick={() => setViewPatient(null)} aria-label="Close">
                <i className="bi bi-x-lg" />
              </button>
            </div>

            {/* ── Info grid ── */}
            <div className="pt-view-body">
              <div className="pt-view-grid">

                <div className="pt-view-field">
                  <span className="pt-view-field-icon"><i className="bi bi-person-fill" /></span>
                  <div>
                    <div className="pt-view-field-label">Full Name</div>
                    <div className="pt-view-field-value">{viewPatient.name}</div>
                  </div>
                </div>

                <div className="pt-view-field">
                  <span className="pt-view-field-icon"><i className="bi bi-envelope-fill" /></span>
                  <div>
                    <div className="pt-view-field-label">Email</div>
                    <div className="pt-view-field-value">{viewPatient.email || "—"}</div>
                  </div>
                </div>

                <div className="pt-view-field">
                  <span className="pt-view-field-icon"><i className="bi bi-telephone-fill" /></span>
                  <div>
                    <div className="pt-view-field-label">Phone</div>
                    <div className="pt-view-field-value">{viewPatient.phone || "—"}</div>
                  </div>
                </div>

                <div className="pt-view-field">
                  <span className="pt-view-field-icon"><i className="bi bi-calendar2-check-fill" /></span>
                  <div>
                    <div className="pt-view-field-label">Total Appointments</div>
                    <div className="pt-view-field-value">
                      {viewPatient.appointments?.length || 0}
                      <span className="pt-view-appt-badge">
                        {viewPatient.appointments?.length > 0 ? "visits" : "no visits yet"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Last appointment strip */}
              {viewPatient.appointments?.[0] && (
                <div className="pt-view-last-appt">
                  <span className="pt-view-last-label">Last visit</span>
                  <span className="pt-view-last-service">
                    <i className="bi bi-activity" /> {viewPatient.appointments[0].service || "—"}
                  </span>
                  <span className="pt-view-last-date">
                    {new Date(viewPatient.appointments[0].date).toLocaleDateString("en-PK", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </span>
                  <span className={`pt-view-status-chip pt-view-status--${(viewPatient.appointments[0].status || "").toLowerCase()}`}>
                    {viewPatient.appointments[0].status || "—"}
                  </span>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="pt-view-footer">
              <button className="pt-view-action-btn pt-view-btn--edit"
                onClick={() => { setViewPatient(null); openEdit(viewPatient); }}>
                <i className="bi bi-pencil" /> Edit Patient
              </button>
              <button className="pt-view-action-btn pt-view-btn--close"
                onClick={() => setViewPatient(null)}>
                Close
              </button>
            </div>

          </div>
        </Overlay>
      )}

      {/* ════════════ MODAL: Edit Patient ════════════ */}
      {editPatient && (
        <Overlay onClose={() => setEditPatient(null)}>
          <div className="pt-modal">
            <ModalHeader title={`Edit · ${editPatient.name}`} onClose={() => setEditPatient(null)} />
            <div className="pt-form">
              <FormField label="Full Name *">
                <input value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Full name" />
              </FormField>
              <FormField label="Email *">
                <input type="email" value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Email address" />
              </FormField>
              <FormField label="Phone (11 Digits)">
                <input value={editForm.phone}
                  onChange={(e) => handlePhoneChange(e, "edit")}
                  placeholder="03001234567" maxLength="11" />
                {editForm.phone.length > 0 && editForm.phone.length < 11 && (
                  <small style={{ color: "orange" }}>Must be 11 digits</small>
                )}
              </FormField>
            </div>
            <div className="pt-modal-footer">
              <button className="pt-btn pt-btn--ghost" onClick={() => setEditPatient(null)}>Cancel</button>
              <button className="pt-btn pt-btn--primary" onClick={saveEdit} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ════════════ MODAL: Add Patient ════════════ */}
      {showAdd && (
        <Overlay onClose={() => { setShowAdd(false); setAddForm(emptyAdd); }}>
          <div className="pt-modal">
            <ModalHeader title="Add New Patient" onClose={() => { setShowAdd(false); setAddForm(emptyAdd); }} />
            <div className="pt-form">
              <FormField label="Full Name *">
                <input value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Enter patient's full name" />
              </FormField>
              <FormField label="Email *">
                <input type="email" value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="patient@example.com" />
              </FormField>
              <FormField label="Phone (11 Digits)">
                <input type="text" value={addForm.phone}
                  onChange={(e) => handlePhoneChange(e, "add")}
                  placeholder="03001234567" maxLength="11" />
                {addForm.phone.length > 0 && addForm.phone.length < 11 && (
                  <small style={{ color: "orange" }}>Must be 11 digits</small>
                )}
              </FormField>
            </div>
            <div className="pt-modal-footer">
              <button className="pt-btn pt-btn--ghost" onClick={() => { setShowAdd(false); setAddForm(emptyAdd); }}>Cancel</button>
              <button className="pt-btn pt-btn--primary" onClick={saveAdd} disabled={saving}>
                {saving ? "Creating…" : "Create Patient"}
              </button>
            </div>
          </div>
        </Overlay>
      )}

    </div>
  );
}

/* ─── small reusable sub-components ─────────────────────────── */
function Overlay({ children, onClose }) {
  return (
    <div className="pt-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="pt-modal-header">
      <span className="pt-modal-title">{title}</span>
      <button className="pt-modal-close" onClick={onClose}>&times;</button>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="pt-field">
      <label className="pt-label">{label}</label>
      {children}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="pt-detail-item">
      <span className="pt-detail-label">{label}</span>
      <span className="pt-detail-value">{value}</span>
    </div>
  );
}

export default Patients;