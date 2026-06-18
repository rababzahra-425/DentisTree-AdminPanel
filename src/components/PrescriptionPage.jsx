// import React, { useEffect, useState, useRef } from "react";
// import "./Prescription.css";

// const API = "http://127.0.0.1:8000";

// /* ─── helpers ─────────────────────────────────────────────────── */
// const avatar = (name) => (name ? name.charAt(0).toUpperCase() : "P");

// const fmtDate = (iso) => {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleDateString("en-PK", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };

// const fmtTime = (iso) => {
//   if (!iso) return "";
//   return new Date(iso).toLocaleTimeString("en-PK", {
//     hour: "2-digit", minute: "2-digit",
//   });
// };

// const nowISO = () => new Date().toISOString();

// /* ══════════════════════════════════════════════════════════════
//    MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════ */
// export default function PrescriptionPage({ patientId, onBack }) {
//   const [patient,        setPatient]        = useState(null);
//   const [prescriptions,  setPrescriptions]  = useState([]);
//   const [treatments,     setTreatments]     = useState([]);
//   const [loading,        setLoading]        = useState(true);
//   const [activeTab,      setActiveTab]      = useState("rx");   // "rx" | "tx"
//   const [saving,         setSaving]         = useState(false);
//   const [notification,   setNotification]   = useState(null);   // {type,msg}

//   // Prescription form state
//   const emptyRx = {
//     medicines_text: "",
//     referred_by: "",
//     chief_complaint: "",
//     diagnosis: "",
//     appointment_id: "",
//   };
//   const [rxForm,     setRxForm]     = useState(emptyRx);
//   const [editingRx,  setEditingRx]  = useState(null);
//   const [showRxForm, setShowRxForm] = useState(false);

//   // Treatment form state
//   const emptyTx = {
//     treatment_text: "",
//     handled_by: "",
//     procedure_type: "",
//     appointment_id: "",
//   };
//   const [txForm,     setTxForm]     = useState(emptyTx);
//   const [editingTx,  setEditingTx]  = useState(null);
//   const [showTxForm, setShowTxForm] = useState(false);

//   const printRef = useRef();

//   /* ─── notify ──────────────────────────────────────────────── */
//   const notify = (type, msg) => {
//     setNotification({ type, msg });
//     setTimeout(() => setNotification(null), 3500);
//   };

//   /* ─── fetch all data ──────────────────────────────────────── */
//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const [pRes, rxRes, txRes] = await Promise.all([
//         fetch(`${API}/patients/${patientId}/`),
//         fetch(`${API}/prescriptions/?patient_id=${patientId}`),
//         fetch(`${API}/treatments/?patient_id=${patientId}`),
//       ]);
//       setPatient(await pRes.json());
//       const rxData = await rxRes.json();
//       const txData = await txRes.json();
//       setPrescriptions(Array.isArray(rxData) ? rxData : []);
//       setTreatments(Array.isArray(txData) ? txData : []);
//     } catch (e) {
//       notify("error", "Failed to load data. Check your API connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAll(); }, [patientId]);

//   /* ═══════════════════════════════════════
//      PRESCRIPTION CRUD
//   ═══════════════════════════════════════ */
//   const openAddRx = () => {
//     setEditingRx(null);
//     setRxForm(emptyRx);
//     setShowRxForm(true);
//   };

//   const openEditRx = (rx) => {
//     setEditingRx(rx);
//     setRxForm({
//       medicines_text:  rx.medicines_text  || "",
//       referred_by:     rx.referred_by     || "",
//       chief_complaint: rx.chief_complaint || "",
//       diagnosis:       rx.diagnosis       || "",
//       appointment_id:  rx.appointment_id  || "",
//     });
//     setShowRxForm(true);
//   };

//   const saveRx = async () => {
//     if (!rxForm.medicines_text.trim()) {
//       notify("error", "Prescription details cannot be empty.");
//       return;
//     }
//     setSaving(true);
//     const payload = {
//       ...rxForm,
//       patient_id: patientId,
//     };
//     try {
//       const url    = editingRx
//         ? `${API}/prescriptions/update/${editingRx.id}/`
//         : `${API}/prescriptions/create/`;
//       const method = "POST";
//       const res    = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         notify("success", editingRx ? "Prescription updated!" : "Prescription saved!");
//         setShowRxForm(false);
//         fetchAll();
//       } else {
//         const err = await res.json();
//         notify("error", err.error || "Save failed.");
//       }
//     } catch { notify("error", "Network error."); }
//     finally { setSaving(false); }
//   };

//   const deleteRx = async (id) => {
//     if (!window.confirm("Delete this prescription entry?")) return;
//     try {
//       const res = await fetch(`${API}/prescriptions/delete/${id}/`, { method: "DELETE" });
//       if (res.ok) { notify("success", "Deleted."); fetchAll(); }
//       else notify("error", "Delete failed.");
//     } catch { notify("error", "Network error."); }
//   };

//   /* ═══════════════════════════════════════
//      TREATMENT CRUD
//   ═══════════════════════════════════════ */
//   const openAddTx = () => {
//     setEditingTx(null);
//     setTxForm(emptyTx);
//     setShowTxForm(true);
//   };

//   const openEditTx = (tx) => {
//     setEditingTx(tx);
//     setTxForm({
//       treatment_text:  tx.treatment_text  || "",
//       handled_by:      tx.handled_by      || "",
//       procedure_type:  tx.procedure_type  || "",
//       appointment_id:  tx.appointment_id  || "",
//     });
//     setShowTxForm(true);
//   };

//   const saveTx = async () => {
//     if (!txForm.treatment_text.trim()) {
//       notify("error", "Treatment notes cannot be empty.");
//       return;
//     }
//     setSaving(true);
//     const payload = { ...txForm, patient_id: patientId };
//     try {
//       const url = editingTx
//         ? `${API}/treatments/update/${editingTx.id}/`
//         : `${API}/treatments/create/`;
//       const res = await fetch(url, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(payload),
//       });
//       if (res.ok) {
//         notify("success", editingTx ? "Treatment updated!" : "Treatment saved!");
//         setShowTxForm(false);
//         fetchAll();
//       } else {
//         const err = await res.json();
//         notify("error", err.error || "Save failed.");
//       }
//     } catch { notify("error", "Network error."); }
//     finally { setSaving(false); }
//   };

//   const deleteTx = async (id) => {
//     if (!window.confirm("Delete this treatment record?")) return;
//     try {
//       const res = await fetch(`${API}/treatments/delete/${id}/`, { method: "DELETE" });
//       if (res.ok) { notify("success", "Deleted."); fetchAll(); }
//       else notify("error", "Delete failed.");
//     } catch { notify("error", "Network error."); }
//   };

//   /* ─── Print ───────────────────────────────────────────────── */
//   const handlePrint = () => window.print();

//   /* ─── PDF Download (using browser print to PDF) ──────────── */
//   const handleDownloadPDF = () => {
//     window.print();
//   };

//   /* ═══════════════════════════════════════
//      RENDER
//   ═══════════════════════════════════════ */
//   if (loading) {
//     return (
//       <div className="rx-page">
//         <div className="rx-loading">
//           <div className="rx-spinner" />
//           <p>Loading patient records…</p>
//         </div>
//       </div>
//     );
//   }

//   if (!patient) {
//     return (
//       <div className="rx-page">
//         <div className="rx-empty-state">
//           <i className="bi bi-person-x" />
//           <p>Patient not found.</p>
//           <button className="rx-btn rx-btn--outline" onClick={onBack}>← Back</button>
//         </div>
//       </div>
//     );
//   }

//   const lastAppt = patient.appointments?.[0];

//   return (
//     <div className="rx-page" ref={printRef}>

//       {/* ── Notification Toast ── */}
//       {notification && (
//         <div className={`rx-toast rx-toast--${notification.type}`}>
//           <i className={`bi ${notification.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`} />
//           {notification.msg}
//         </div>
//       )}

//       {/* ══════════════════════════════════
//           HEADER
//       ══════════════════════════════════ */}
//       <div className="rx-header no-print">
//         <button className="rx-back-btn" onClick={onBack}>
//           <i className="bi bi-arrow-left" /> Back to Patients
//         </button>
//         <div className="rx-header-actions">
//           <button className="rx-btn rx-btn--outline" onClick={handlePrint}>
//             <i className="bi bi-printer" /> Print
//           </button>
//           <button className="rx-btn rx-btn--outline" onClick={handleDownloadPDF}>
//             <i className="bi bi-file-earmark-pdf" /> Download PDF
//           </button>
//         </div>
//       </div>

//       {/* ══════════════════════════════════
//           CLINIC + PATIENT INFO CARD
//       ══════════════════════════════════ */}
//       <div className="rx-info-card">
//         <div className="rx-clinic-header">
//           <div className="rx-clinic-logo">
//             <i className="bi bi-hospital" />
//           </div>
//           <div className="rx-clinic-details">
//             <h1 className="rx-clinic-name">DentisTree Dental Clinic</h1>
//             <p className="rx-clinic-sub">Professional Dental Care · Est. 2020</p>
//           </div>
//           <div className="rx-rx-stamp">
//             <span>℞</span>
//           </div>
//         </div>

//         <div className="rx-divider" />

//         <div className="rx-patient-grid">
//           <div className="rx-patient-avatar-wrap">
//             <div className="rx-patient-avatar">{avatar(patient.name)}</div>
//           </div>
//           <div className="rx-patient-details">
//             <div className="rx-info-row">
//               <span className="rx-info-label">Patient Name</span>
//               <span className="rx-info-val">{patient.name}</span>
//             </div>
//             <div className="rx-info-row">
//               <span className="rx-info-label">Patient ID</span>
//               <span className="rx-info-val rx-badge">
//                 PT-{patient.patient_serial || patient.id?.slice(-5).toUpperCase()}
//               </span>
//             </div>
//             <div className="rx-info-row">
//               <span className="rx-info-label">Contact</span>
//               <span className="rx-info-val">{patient.phone || "—"}</span>
//             </div>
//             <div className="rx-info-row">
//               <span className="rx-info-label">Email</span>
//               <span className="rx-info-val">{patient.email}</span>
//             </div>
//           </div>
//           <div className="rx-patient-details">
//             <div className="rx-info-row">
//               <span className="rx-info-label">Last Appointment</span>
//               <span className="rx-info-val">{lastAppt ? fmtDate(lastAppt.date) : "—"}</span>
//             </div>
//             <div className="rx-info-row">
//               <span className="rx-info-label">Last Service</span>
//               <span className="rx-info-val">{lastAppt?.service || "—"}</span>
//             </div>
//             <div className="rx-info-row">
//               <span className="rx-info-label">Total Prescriptions</span>
//               <span className="rx-info-val">{prescriptions.length}</span>
//             </div>
//             <div className="rx-info-row">
//               <span className="rx-info-label">Treatment Records</span>
//               <span className="rx-info-val">{treatments.length}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ══════════════════════════════════
//           TABS
//       ══════════════════════════════════ */}
//       <div className="rx-tabs no-print">
//         <button
//           className={`rx-tab ${activeTab === "rx" ? "rx-tab--active" : ""}`}
//           onClick={() => setActiveTab("rx")}
//         >
//           <i className="bi bi-capsule" />
//           Medicines & Prescriptions
//           <span className="rx-tab-count">{prescriptions.length}</span>
//         </button>
//         <button
//           className={`rx-tab ${activeTab === "tx" ? "rx-tab--active" : ""}`}
//           onClick={() => setActiveTab("tx")}
//         >
//           <i className="bi bi-clipboard2-pulse" />
//           Treatment History
//           <span className="rx-tab-count">{treatments.length}</span>
//         </button>
//       </div>

//       {/* ══════════════════════════════════
//           SECTION 1 — PRESCRIPTIONS
//       ══════════════════════════════════ */}
//       {activeTab === "rx" && (
//         <div className="rx-section">
//           <div className="rx-section-header">
//             <div>
//               <h2 className="rx-section-title">
//                 <i className="bi bi-file-earmark-medical" /> Prescription Records
//               </h2>
//               <p className="rx-section-sub">
//                 Full prescription history with medicines and doctor notes
//               </p>
//             </div>
//             <button className="rx-btn rx-btn--primary no-print" onClick={openAddRx}>
//               <i className="bi bi-plus-lg" /> New Prescription
//             </button>
//           </div>

//           {/* Add / Edit Form */}
//           {showRxForm && (
//             <div className="rx-form-card">
//               <div className="rx-form-header">
//                 <h3>{editingRx ? "Edit Prescription" : "New Prescription"}</h3>
//                 <button className="rx-form-close" onClick={() => setShowRxForm(false)}>
//                   <i className="bi bi-x-lg" />
//                 </button>
//               </div>

//               <div className="rx-form-timestamp">
//                 <i className="bi bi-clock" />
//                 <span>
//                   {new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}
//                   {" · "}
//                   {new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
//                 </span>
//               </div>

//               <div className="rx-form-grid">
//                 <div className="rx-field">
//                   <label>Chief Complaint</label>
//                   <input
//                     type="text"
//                     value={rxForm.chief_complaint}
//                     onChange={(e) => setRxForm({ ...rxForm, chief_complaint: e.target.value })}
//                     placeholder="e.g. Toothache in lower left molar"
//                   />
//                 </div>
//                 <div className="rx-field">
//                   <label>Referred By (Doctor)</label>
//                   <input
//                     type="text"
//                     value={rxForm.referred_by}
//                     onChange={(e) => setRxForm({ ...rxForm, referred_by: e.target.value })}
//                     placeholder="e.g. Dr. Ahmed Khan"
//                   />
//                 </div>
//                 <div className="rx-field rx-field--full">
//                   <label>Diagnosis Notes</label>
//                   <input
//                     type="text"
//                     value={rxForm.diagnosis}
//                     onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
//                     placeholder="e.g. Acute pulpitis of tooth #36, periapical abscess"
//                   />
//                 </div>
//                 <div className="rx-field">
//                   <label>Appointment ID (Optional)</label>
//                   <input
//                     type="text"
//                     value={rxForm.appointment_id}
//                     onChange={(e) => setRxForm({ ...rxForm, appointment_id: e.target.value })}
//                     placeholder="Link to appointment"
//                   />
//                 </div>
//               </div>

//               <div className="rx-field rx-field--full" style={{ marginTop: "1rem" }}>
//                 <label>
//                   Medicines & Prescription Details <span className="rx-required">*</span>
//                 </label>
//                 <p className="rx-field-hint">
//                   Write prescriptions freely — include medicine names, dosage, frequency, duration, special instructions, or any clinical notes.
//                 </p>
//                 <textarea
//                   className="rx-textarea rx-textarea--lg"
//                   value={rxForm.medicines_text}
//                   onChange={(e) => setRxForm({ ...rxForm, medicines_text: e.target.value })}
//                   placeholder={`Example:\n\n1. Amoxicillin 500mg — 1 cap 3x daily for 5 days\n2. Ibuprofen 400mg — 1 tab after meals (for pain)\n3. Metronidazole 400mg — 1 tab twice daily\n4. Chlorhexidine mouthwash — rinse twice daily\n\nNote: Avoid cold/hot food. Follow up after 5 days.`}
//                   rows={10}
//                 />
//               </div>

//               <div className="rx-form-actions">
//                 <button className="rx-btn rx-btn--ghost" onClick={() => setShowRxForm(false)}>
//                   Cancel
//                 </button>
//                 <button className="rx-btn rx-btn--primary" onClick={saveRx} disabled={saving}>
//                   {saving ? <><i className="bi bi-hourglass-split" /> Saving…</> : <><i className="bi bi-check-lg" /> {editingRx ? "Update Prescription" : "Save Prescription"}</>}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Prescription List */}
//           {prescriptions.length === 0 && !showRxForm ? (
//             <div className="rx-empty">
//               <div className="rx-empty-icon"><i className="bi bi-file-earmark-medical" /></div>
//               <h3>No prescriptions yet</h3>
//               <p>Add the first prescription for this patient</p>
//               <button className="rx-btn rx-btn--primary" onClick={openAddRx}>
//                 <i className="bi bi-plus-lg" /> Add Prescription
//               </button>
//             </div>
//           ) : (
//             <div className="rx-cards">
//               {prescriptions.map((rx, idx) => (
//                 <div key={rx.id} className="rx-record-card">
//                   <div className="rx-record-header">
//                     <div className="rx-record-meta">
//                       <span className="rx-record-index">RX-{String(idx + 1).padStart(3, "0")}</span>
//                       <div className="rx-record-timestamps">
//                         <span><i className="bi bi-calendar3" /> {fmtDate(rx.created_at)}</span>
//                         <span><i className="bi bi-clock" /> {fmtTime(rx.created_at)}</span>
//                       </div>
//                     </div>
//                     <div className="rx-record-actions no-print">
//                       <button className="rx-icon-btn rx-icon-btn--edit" onClick={() => openEditRx(rx)} title="Edit">
//                         <i className="bi bi-pencil" />
//                       </button>
//                       <button className="rx-icon-btn rx-icon-btn--del" onClick={() => deleteRx(rx.id)} title="Delete">
//                         <i className="bi bi-trash" />
//                       </button>
//                     </div>
//                   </div>

//                   {(rx.chief_complaint || rx.diagnosis || rx.referred_by) && (
//                     <div className="rx-record-meta-tags">
//                       {rx.chief_complaint && (
//                         <div className="rx-meta-tag">
//                           <span className="rx-meta-label">Chief Complaint</span>
//                           <span>{rx.chief_complaint}</span>
//                         </div>
//                       )}
//                       {rx.diagnosis && (
//                         <div className="rx-meta-tag">
//                           <span className="rx-meta-label">Diagnosis</span>
//                           <span>{rx.diagnosis}</span>
//                         </div>
//                       )}
//                       {rx.referred_by && (
//                         <div className="rx-meta-tag">
//                           <span className="rx-meta-label"><i className="bi bi-person-badge" /> Doctor</span>
//                           <span>{rx.referred_by}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <div className="rx-medicines-block">
//                     <div className="rx-medicines-label">
//                       <i className="bi bi-capsule-pill" /> Medicines & Instructions
//                     </div>
//                     <pre className="rx-medicines-text">{rx.medicines_text}</pre>
//                   </div>

//                   {rx.appointment_id && (
//                     <div className="rx-linked-appt">
//                       <i className="bi bi-link-45deg" /> Linked Appointment: {rx.appointment_id}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ══════════════════════════════════
//           SECTION 2 — TREATMENTS
//       ══════════════════════════════════ */}
//       {activeTab === "tx" && (
//         <div className="rx-section">
//           <div className="rx-section-header">
//             <div>
//               <h2 className="rx-section-title">
//                 <i className="bi bi-clipboard2-pulse" /> Treatment History
//               </h2>
//               <p className="rx-section-sub">
//                 Dental procedures, work done, and clinical notes
//               </p>
//             </div>
//             <button className="rx-btn rx-btn--teal no-print" onClick={openAddTx}>
//               <i className="bi bi-plus-lg" /> Add Treatment
//             </button>
//           </div>

//           {/* Add / Edit Treatment Form */}
//           {showTxForm && (
//             <div className="rx-form-card rx-form-card--teal">
//               <div className="rx-form-header">
//                 <h3>{editingTx ? "Edit Treatment Record" : "New Treatment Record"}</h3>
//                 <button className="rx-form-close" onClick={() => setShowTxForm(false)}>
//                   <i className="bi bi-x-lg" />
//                 </button>
//               </div>

//               <div className="rx-form-timestamp">
//                 <i className="bi bi-clock" />
//                 <span>
//                   {new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}
//                   {" · "}
//                   {new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
//                 </span>
//               </div>

//               <div className="rx-form-grid">
//                 <div className="rx-field">
//                   <label>Procedure Type</label>
//                   <input
//                     type="text"
//                     value={txForm.procedure_type}
//                     onChange={(e) => setTxForm({ ...txForm, procedure_type: e.target.value })}
//                     placeholder="e.g. Root Canal, Extraction, Scaling"
//                   />
//                 </div>
//                 <div className="rx-field">
//                   <label>Handled By (Doctor)</label>
//                   <input
//                     type="text"
//                     value={txForm.handled_by}
//                     onChange={(e) => setTxForm({ ...txForm, handled_by: e.target.value })}
//                     placeholder="e.g. Dr. Fatima Malik"
//                   />
//                 </div>
//                 <div className="rx-field">
//                   <label>Appointment ID (Optional)</label>
//                   <input
//                     type="text"
//                     value={txForm.appointment_id}
//                     onChange={(e) => setTxForm({ ...txForm, appointment_id: e.target.value })}
//                     placeholder="Link to appointment"
//                   />
//                 </div>
//               </div>

//               <div className="rx-field rx-field--full" style={{ marginTop: "1rem" }}>
//                 <label>
//                   Treatment Notes & Work Done <span className="rx-required">*</span>
//                 </label>
//                 <p className="rx-field-hint">
//                   Describe procedures, findings, materials used, tooth numbers, or any relevant clinical details.
//                 </p>
//                 <textarea
//                   className="rx-textarea rx-textarea--lg rx-textarea--teal"
//                   value={txForm.treatment_text}
//                   onChange={(e) => setTxForm({ ...txForm, treatment_text: e.target.value })}
//                   placeholder={`Example:\n\nTooth #36 — Root Canal Treatment (RCT)\n• Access cavity prepared under LA\n• 3 canals found: MB, ML, D\n• Irrigation with NaOCl 2.5% + EDTA\n• Canals shaped to F3\n• Obturation done with gutta-percha\n• Tooth restored with GIC base + composite\n\nNext visit: Crown placement in 2 weeks.`}
//                   rows={10}
//                 />
//               </div>

//               <div className="rx-form-actions">
//                 <button className="rx-btn rx-btn--ghost" onClick={() => setShowTxForm(false)}>
//                   Cancel
//                 </button>
//                 <button className="rx-btn rx-btn--teal" onClick={saveTx} disabled={saving}>
//                   {saving ? <><i className="bi bi-hourglass-split" /> Saving…</> : <><i className="bi bi-check-lg" /> {editingTx ? "Update Treatment" : "Save Treatment"}</>}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Treatment Timeline */}
//           {treatments.length === 0 && !showTxForm ? (
//             <div className="rx-empty">
//               <div className="rx-empty-icon rx-empty-icon--teal"><i className="bi bi-clipboard2-pulse" /></div>
//               <h3>No treatment records yet</h3>
//               <p>Document the first dental procedure for this patient</p>
//               <button className="rx-btn rx-btn--teal" onClick={openAddTx}>
//                 <i className="bi bi-plus-lg" /> Add Treatment
//               </button>
//             </div>
//           ) : (
//             <div className="rx-timeline">
//               {treatments.map((tx, idx) => (
//                 <div key={tx.id} className="rx-timeline-item">
//                   <div className="rx-timeline-dot" />
//                   <div className="rx-timeline-card">
//                     <div className="rx-record-header">
//                       <div className="rx-record-meta">
//                         <span className="rx-record-index rx-record-index--teal">
//                           TX-{String(idx + 1).padStart(3, "0")}
//                         </span>
//                         {tx.procedure_type && (
//                           <span className="rx-procedure-badge">{tx.procedure_type}</span>
//                         )}
//                         <div className="rx-record-timestamps">
//                           <span><i className="bi bi-calendar3" /> {fmtDate(tx.created_at)}</span>
//                           <span><i className="bi bi-clock" /> {fmtTime(tx.created_at)}</span>
//                         </div>
//                       </div>
//                       <div className="rx-record-actions no-print">
//                         <button className="rx-icon-btn rx-icon-btn--edit" onClick={() => openEditTx(tx)} title="Edit">
//                           <i className="bi bi-pencil" />
//                         </button>
//                         <button className="rx-icon-btn rx-icon-btn--del" onClick={() => deleteTx(tx.id)} title="Delete">
//                           <i className="bi bi-trash" />
//                         </button>
//                       </div>
//                     </div>

//                     {tx.handled_by && (
//                       <div className="rx-handled-by">
//                         <i className="bi bi-person-badge" /> {tx.handled_by}
//                       </div>
//                     )}

//                     <div className="rx-medicines-block rx-medicines-block--teal">
//                       <div className="rx-medicines-label">
//                         <i className="bi bi-clipboard2-check" /> Procedure Notes
//                       </div>
//                       <pre className="rx-medicines-text">{tx.treatment_text}</pre>
//                     </div>

//                     {tx.appointment_id && (
//                       <div className="rx-linked-appt">
//                         <i className="bi bi-link-45deg" /> Linked Appointment: {tx.appointment_id}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Print-only: show both sections */}
//       <div className="print-only">
//         <h2 style={{ marginTop: "2rem", borderBottom: "2px solid #1a5276", paddingBottom: "0.5rem" }}>
//           Prescriptions
//         </h2>
//         {prescriptions.map((rx, idx) => (
//           <div key={rx.id} style={{ marginBottom: "1.5rem", pageBreakInside: "avoid" }}>
//             <p><strong>RX-{String(idx + 1).padStart(3, "0")}</strong> &nbsp; {fmtDate(rx.created_at)} {fmtTime(rx.created_at)}</p>
//             {rx.chief_complaint && <p><strong>Complaint:</strong> {rx.chief_complaint}</p>}
//             {rx.diagnosis       && <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>}
//             {rx.referred_by     && <p><strong>Doctor:</strong> {rx.referred_by}</p>}
//             <pre style={{ whiteSpace: "pre-wrap", background: "#f8f9fa", padding: "0.75rem", borderRadius: "4px", marginTop: "0.5rem" }}>{rx.medicines_text}</pre>
//           </div>
//         ))}

//         <h2 style={{ marginTop: "2rem", borderBottom: "2px solid #117a65", paddingBottom: "0.5rem" }}>
//           Treatment History
//         </h2>
//         {treatments.map((tx, idx) => (
//           <div key={tx.id} style={{ marginBottom: "1.5rem", pageBreakInside: "avoid" }}>
//             <p><strong>TX-{String(idx + 1).padStart(3, "0")}</strong> &nbsp; {fmtDate(tx.created_at)} {fmtTime(tx.created_at)}</p>
//             {tx.procedure_type && <p><strong>Procedure:</strong> {tx.procedure_type}</p>}
//             {tx.handled_by     && <p><strong>Doctor:</strong> {tx.handled_by}</p>}
//             <pre style={{ whiteSpace: "pre-wrap", background: "#f0fff4", padding: "0.75rem", borderRadius: "4px", marginTop: "0.5rem" }}>{tx.treatment_text}</pre>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import "./Prescription.css";
import { API_BASE } from "../api";

const API = API_BASE;

/* ─── helpers ─────────────────────────────────────────────────── */
const avatar = (name) => (name ? name.charAt(0).toUpperCase() : "P");

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const fmtTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-PK", {
    hour: "2-digit", minute: "2-digit",
  });
};

const nowISO = () => new Date().toISOString();

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
// patientData = full patient object passed from Patients.jsx (no extra API call needed)
export default function PrescriptionPage({ patientId, patientData, onBack }) {
  const [patient,        setPatient]        = useState(patientData || null);
  const [prescriptions,  setPrescriptions]  = useState([]);
  const [treatments,     setTreatments]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeTab,      setActiveTab]      = useState("rx");   // "rx" | "tx"
  const [saving,         setSaving]         = useState(false);
  const [notification,   setNotification]   = useState(null);   // {type,msg}

  // Prescription form state
  const emptyRx = {
    medicines_text: "",
    referred_by: "",
    chief_complaint: "",
    diagnosis: "",
    appointment_id: "",
  };
  const [rxForm,     setRxForm]     = useState(emptyRx);
  const [editingRx,  setEditingRx]  = useState(null);
  const [showRxForm, setShowRxForm] = useState(false);

  // Treatment form state
  const emptyTx = {
    treatment_text: "",
    handled_by: "",
    procedure_type: "",
    appointment_id: "",
  };
  const [txForm,     setTxForm]     = useState(emptyTx);
  const [editingTx,  setEditingTx]  = useState(null);
  const [showTxForm, setShowTxForm] = useState(false);

  const printRef = useRef();

  /* ─── notify ──────────────────────────────────────────────── */
  const notify = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  /* ─── fetch prescriptions + treatments only ──────────────── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rxRes, txRes] = await Promise.all([
        fetch(`${API}/prescriptions/?patient_id=${patientId}`),
        fetch(`${API}/treatments/?patient_id=${patientId}`),
      ]);
      const rxData = await rxRes.json();
      const txData = await txRes.json();
      setPrescriptions(Array.isArray(rxData) ? rxData : []);
      setTreatments(Array.isArray(txData) ? txData : []);
    } catch (e) {
      notify("error", "Failed to load data. Check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [patientId]);

  /* ═══════════════════════════════════════
     PRESCRIPTION CRUD
  ═══════════════════════════════════════ */
  const openAddRx = () => {
    setEditingRx(null);
    setRxForm(emptyRx);
    setShowRxForm(true);
  };

  const openEditRx = (rx) => {
    setEditingRx(rx);
    setRxForm({
      medicines_text:  rx.medicines_text  || "",
      referred_by:     rx.referred_by     || "",
      chief_complaint: rx.chief_complaint || "",
      diagnosis:       rx.diagnosis       || "",
      appointment_id:  rx.appointment_id  || "",
    });
    setShowRxForm(true);
  };

  const saveRx = async () => {
    if (!rxForm.medicines_text.trim()) {
      notify("error", "Prescription details cannot be empty.");
      return;
    }
    setSaving(true);
    const payload = {
      ...rxForm,
      patient_id: patientId,
    };
    try {
      const url    = editingRx
        ? `${API}/prescriptions/update/${editingRx.id}/`
        : `${API}/prescriptions/create/`;
      const method = "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        notify("success", editingRx ? "Prescription updated!" : "Prescription saved!");
        setShowRxForm(false);
        fetchAll();
      } else {
        const err = await res.json();
        notify("error", err.error || "Save failed.");
      }
    } catch { notify("error", "Network error."); }
    finally { setSaving(false); }
  };

  const deleteRx = async (id) => {
    if (!window.confirm("Delete this prescription entry?")) return;
    try {
      const res = await fetch(`${API}/prescriptions/delete/${id}/`, { method: "DELETE" });
      if (res.ok) { notify("success", "Deleted."); fetchAll(); }
      else notify("error", "Delete failed.");
    } catch { notify("error", "Network error."); }
  };

  /* ═══════════════════════════════════════
     TREATMENT CRUD
  ═══════════════════════════════════════ */
  const openAddTx = () => {
    setEditingTx(null);
    setTxForm(emptyTx);
    setShowTxForm(true);
  };

  const openEditTx = (tx) => {
    setEditingTx(tx);
    setTxForm({
      treatment_text:  tx.treatment_text  || "",
      handled_by:      tx.handled_by      || "",
      procedure_type:  tx.procedure_type  || "",
      appointment_id:  tx.appointment_id  || "",
    });
    setShowTxForm(true);
  };

  const saveTx = async () => {
    if (!txForm.treatment_text.trim()) {
      notify("error", "Treatment notes cannot be empty.");
      return;
    }
    setSaving(true);
    const payload = { ...txForm, patient_id: patientId };
    try {
      const url = editingTx
        ? `${API}/treatments/update/${editingTx.id}/`
        : `${API}/treatments/create/`;
      const res = await fetch(url, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (res.ok) {
        notify("success", editingTx ? "Treatment updated!" : "Treatment saved!");
        setShowTxForm(false);
        fetchAll();
      } else {
        const err = await res.json();
        notify("error", err.error || "Save failed.");
      }
    } catch { notify("error", "Network error."); }
    finally { setSaving(false); }
  };

  const deleteTx = async (id) => {
    if (!window.confirm("Delete this treatment record?")) return;
    try {
      const res = await fetch(`${API}/treatments/delete/${id}/`, { method: "DELETE" });
      if (res.ok) { notify("success", "Deleted."); fetchAll(); }
      else notify("error", "Delete failed.");
    } catch { notify("error", "Network error."); }
  };

  /* ─── Print ───────────────────────────────────────────────── */
  const handlePrint = () => window.print();

  /* ─── PDF Download (using browser print to PDF) ──────────── */
  const handleDownloadPDF = () => {
    window.print();
  };

  /* ═══════════════════════════════════════
     RENDER
  ═══════════════════════════════════════ */
  if (loading) {
    return (
      <div className="rx-page">
        <div className="rx-loading">
          <div className="rx-spinner" />
          <p>Loading patient records…</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="rx-page">
        <div className="rx-empty-state">
          <i className="bi bi-person-x" />
          <p>Patient not found.</p>
          <button className="rx-btn rx-btn--outline" onClick={onBack}>← Back</button>
        </div>
      </div>
    );
  }

  const lastAppt = patient.appointments?.[0];

  return (
    <div className="rx-page" ref={printRef}>

      {/* ── Notification Toast ── */}
      {notification && (
        <div className={`rx-toast rx-toast--${notification.type}`}>
          <i className={`bi ${notification.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`} />
          {notification.msg}
        </div>
      )}

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <div className="rx-header no-print">
        <button className="rx-back-btn" onClick={onBack}>
          <i className="bi bi-arrow-left" /> Back to Patients
        </button>
        <div className="rx-header-actions">
          <button className="rx-btn rx-btn--outline" onClick={handlePrint}>
            <i className="bi bi-printer" /> Print
          </button>
          <button className="rx-btn rx-btn--outline" onClick={handleDownloadPDF}>
            <i className="bi bi-file-earmark-pdf" /> Download PDF
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════
          CLINIC + PATIENT INFO CARD
      ══════════════════════════════════ */}
      <div className="rx-info-card">
        <div className="rx-clinic-headings">
          <div className="rx-clinic-header">
          <div className="rx-clinic-logo">
            <i className="bi bi-hospital" />
          </div>
          <div className="rx-clinic-details">
            <h1 className="rx-clinic-name">DentisTree Dental Clinic</h1>
            <p className="rx-clinic-sub">Professional Dental Care · Est. 2020</p>
          </div>
          {/* <div className="rx-rx-stamp">
            <span>℞</span>
          </div> */}
          </div>
        </div>

        <div className="rx-divider" />

        <div className="rx-patient-grid">
          <div className="rx-patient-avatar-wrap">
            <div className="rx-patient-avatar">{avatar(patient.name)}</div>
          </div>
          <div className="rx-patient-details">
            <div className="rx-info-row">
              <span className="rx-info-label">Patient Name</span>
              <span className="rx-info-val">{patient.name}</span>
            </div>
            <div className="rx-info-row">
              <span className="rx-info-label">Patient ID</span>
              <span className="rx-info-val rx-badge">
                PT-{patient.patient_serial || patient.id?.slice(-5).toUpperCase()}
              </span>
            </div>
            <div className="rx-info-row">
              <span className="rx-info-label">Contact</span>
              <span className="rx-info-val">{patient.phone || "—"}</span>
            </div>
            <div className="rx-info-row">
              <span className="rx-info-label">Email</span>
              <span className="rx-info-val">{patient.email}</span>
            </div>
          </div>
          <div className="rx-patient-details">
            <div className="rx-info-row">
              <span className="rx-info-label">Last Appointment</span>
              <span className="rx-info-val">{lastAppt ? fmtDate(lastAppt.date) : "—"}</span>
            </div>
            <div className="rx-info-row">
              <span className="rx-info-label">Last Service</span>
              <span className="rx-info-val">{lastAppt?.service || "—"}</span>
            </div>
            <div className="rx-info-row">
              <span className="rx-info-label">Total Prescriptions</span>
              <span className="rx-info-val">{prescriptions.length}</span>
            </div>
            <div className="rx-info-row">
              <span className="rx-info-label">Treatment Records</span>
              <span className="rx-info-val">{treatments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          TABS
      ══════════════════════════════════ */}
      <div className="rx-tabs no-print">
        <button
          className={`rx-tab ${activeTab === "rx" ? "rx-tab--active" : ""}`}
          onClick={() => setActiveTab("rx")}
        >
          <i className="bi bi-capsule" />
          Medicines & Prescriptions
          <span className="rx-tab-count">{prescriptions.length}</span>
        </button>
        <button
          className={`rx-tab ${activeTab === "tx" ? "rx-tab--active" : ""}`}
          onClick={() => setActiveTab("tx")}
        >
          <i className="bi bi-clipboard2-pulse" />
          Treatment History
          <span className="rx-tab-count">{treatments.length}</span>
        </button>
      </div>

      {/* ══════════════════════════════════
          SECTION 1 — PRESCRIPTIONS
      ══════════════════════════════════ */}
      {activeTab === "rx" && (
        <div className="rx-section">
          <div className="rx-section-header">
            <div>
              <h2 className="rx-section-title">
                <i className="bi bi-file-earmark-medical" /> Prescription Records
              </h2>
              <p className="rx-section-sub">
                Full prescription history with medicines and doctor notes
              </p>
            </div>
            <button className="rx-btn rx-btn--primary no-print" onClick={openAddRx}>
              <i className="bi bi-plus-lg" /> New Prescription
            </button>
          </div>

          {/* Add / Edit Form */}
          {showRxForm && (
            <div className="rx-form-card">
              <div className="rx-form-header">
                <h3>{editingRx ? "Edit Prescription" : "New Prescription"}</h3>
                <button className="rx-form-close" onClick={() => setShowRxForm(false)}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <div className="rx-form-timestamp">
                <i className="bi bi-clock" />
                <span>
                  {new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}
                  {" · "}
                  {new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="rx-form-grid">
                <div className="rx-field">
                  <label>Chief Complaint</label>
                  <input
                    type="text"
                    value={rxForm.chief_complaint}
                    onChange={(e) => setRxForm({ ...rxForm, chief_complaint: e.target.value })}
                    placeholder="e.g. Toothache in lower left molar"
                  />
                </div>
                <div className="rx-field">
                  <label>Referred By (Doctor)</label>
                  <input
                    type="text"
                    value={rxForm.referred_by}
                    onChange={(e) => setRxForm({ ...rxForm, referred_by: e.target.value })}
                    placeholder="e.g. Dr. Ahmed Khan"
                  />
                </div>
                <div className="rx-field rx-field--full">
                  <label>Diagnosis Notes</label>
                  <input
                    type="text"
                    value={rxForm.diagnosis}
                    onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                    placeholder="e.g. Acute pulpitis of tooth #36, periapical abscess"
                  />
                </div>
                <div className="rx-field">
                  <label>Appointment ID (Optional)</label>
                  <input
                    type="text"
                    value={rxForm.appointment_id}
                    onChange={(e) => setRxForm({ ...rxForm, appointment_id: e.target.value })}
                    placeholder="Link to appointment"
                  />
                </div>
              </div>

              <div className="rx-field rx-field--full" style={{ marginTop: "1rem" }}>
                <label>
                  Medicines & Prescription Details <span className="rx-required">*</span>
                </label>
                <p className="rx-field-hint">
                  Write prescriptions freely — include medicine names, dosage, frequency, duration, special instructions, or any clinical notes.
                </p>
                <textarea
                  className="rx-textarea rx-textarea--lg"
                  value={rxForm.medicines_text}
                  onChange={(e) => setRxForm({ ...rxForm, medicines_text: e.target.value })}
                  placeholder={`Example:\n\n1. Amoxicillin 500mg — 1 cap 3x daily for 5 days\n2. Ibuprofen 400mg — 1 tab after meals (for pain)\n3. Metronidazole 400mg — 1 tab twice daily\n4. Chlorhexidine mouthwash — rinse twice daily\n\nNote: Avoid cold/hot food. Follow up after 5 days.`}
                  rows={10}
                />
              </div>

              <div className="rx-form-actions">
                <button className="rx-btn rx-btn--ghost" onClick={() => setShowRxForm(false)}>
                  Cancel
                </button>
                <button className="rx-btn rx-btn--primary" onClick={saveRx} disabled={saving}>
                  {saving ? <><i className="bi bi-hourglass-split" /> Saving…</> : <><i className="bi bi-check-lg" /> {editingRx ? "Update Prescription" : "Save Prescription"}</>}
                </button>
              </div>
            </div>
          )}

          {/* Prescription List */}
          {prescriptions.length === 0 && !showRxForm ? (
            <div className="rx-empty">
              <div className="rx-empty-icon"><i className="bi bi-file-earmark-medical" /></div>
              <h3>No prescriptions yet</h3>
              <p>Add the first prescription for this patient</p>
              <button className="rx-btn rx-btn--primary" onClick={openAddRx}>
                <i className="bi bi-plus-lg" /> Add Prescription
              </button>
            </div>
          ) : (
            <div className="rx-cards">
              {prescriptions.map((rx, idx) => (
                <div key={rx.id} className="rx-record-card">
                  <div className="rx-record-header">
                    <div className="rx-record-meta">
                      <span className="rx-record-index">RX-{String(idx + 1).padStart(3, "0")}</span>
                      <div className="rx-record-timestamps">
                        <span><i className="bi bi-calendar3" /> {fmtDate(rx.created_at)}</span>
                        <span><i className="bi bi-clock" /> {fmtTime(rx.created_at)}</span>
                      </div>
                    </div>
                    <div className="rx-record-actions no-print">
                      <button className="rx-icon-btn rx-icon-btn--edit" onClick={() => openEditRx(rx)} title="Edit">
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="rx-icon-btn rx-icon-btn--del" onClick={() => deleteRx(rx.id)} title="Delete">
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>

                  {(rx.chief_complaint || rx.diagnosis || rx.referred_by) && (
                    <div className="rx-record-meta-tags">
                      {rx.chief_complaint && (
                        <div className="rx-meta-tag">
                          <span className="rx-meta-label">Chief Complaint</span>
                          <span>{rx.chief_complaint}</span>
                        </div>
                      )}
                      {rx.diagnosis && (
                        <div className="rx-meta-tag">
                          <span className="rx-meta-label">Diagnosis</span>
                          <span>{rx.diagnosis}</span>
                        </div>
                      )}
                      {rx.referred_by && (
                        <div className="rx-meta-tag">
                          <span className="rx-meta-label"><i className="bi bi-person-badge" /> Doctor</span>
                          <span>{rx.referred_by}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rx-medicines-block">
                    <div className="rx-medicines-label">
                      <i className="bi bi-capsule-pill" /> Medicines & Instructions
                    </div>
                    <pre className="rx-medicines-text">{rx.medicines_text}</pre>
                  </div>

                  {rx.appointment_id && (
                    <div className="rx-linked-appt">
                      <i className="bi bi-link-45deg" /> Linked Appointment: {rx.appointment_id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════
          SECTION 2 — TREATMENTS
      ══════════════════════════════════ */}
      {activeTab === "tx" && (
        <div className="rx-section">
          <div className="rx-section-header">
            <div>
              <h2 className="rx-section-title">
                <i className="bi bi-clipboard2-pulse" /> Treatment History
              </h2>
              <p className="rx-section-sub">
                Dental procedures, work done, and clinical notes
              </p>
            </div>
            <button className="rx-btn rx-btn--teal no-print" onClick={openAddTx}>
              <i className="bi bi-plus-lg" /> Add Treatment
            </button>
          </div>

          {/* Add / Edit Treatment Form */}
          {showTxForm && (
            <div className="rx-form-card rx-form-card--teal">
              <div className="rx-form-header">
                <h3>{editingTx ? "Edit Treatment Record" : "New Treatment Record"}</h3>
                <button className="rx-form-close" onClick={() => setShowTxForm(false)}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <div className="rx-form-timestamp">
                <i className="bi bi-clock" />
                <span>
                  {new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}
                  {" · "}
                  {new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="rx-form-grid">
                <div className="rx-field">
                  <label>Procedure Type</label>
                  <input
                    type="text"
                    value={txForm.procedure_type}
                    onChange={(e) => setTxForm({ ...txForm, procedure_type: e.target.value })}
                    placeholder="e.g. Root Canal, Extraction, Scaling"
                  />
                </div>
                <div className="rx-field">
                  <label>Handled By (Doctor)</label>
                  <input
                    type="text"
                    value={txForm.handled_by}
                    onChange={(e) => setTxForm({ ...txForm, handled_by: e.target.value })}
                    placeholder="e.g. Dr. Fatima Malik"
                  />
                </div>
                <div className="rx-field">
                  <label>Appointment ID (Optional)</label>
                  <input
                    type="text"
                    value={txForm.appointment_id}
                    onChange={(e) => setTxForm({ ...txForm, appointment_id: e.target.value })}
                    placeholder="Link to appointment"
                  />
                </div>
              </div>

              <div className="rx-field rx-field--full" style={{ marginTop: "1rem" }}>
                <label>
                  Treatment Notes & Work Done <span className="rx-required">*</span>
                </label>
                <p className="rx-field-hint">
                  Describe procedures, findings, materials used, tooth numbers, or any relevant clinical details.
                </p>
                <textarea
                  className="rx-textarea rx-textarea--lg rx-textarea--teal"
                  value={txForm.treatment_text}
                  onChange={(e) => setTxForm({ ...txForm, treatment_text: e.target.value })}
                  placeholder={`Example:\n\nTooth #36 — Root Canal Treatment (RCT)\n• Access cavity prepared under LA\n• 3 canals found: MB, ML, D\n• Irrigation with NaOCl 2.5% + EDTA\n• Canals shaped to F3\n• Obturation done with gutta-percha\n• Tooth restored with GIC base + composite\n\nNext visit: Crown placement in 2 weeks.`}
                  rows={10}
                />
              </div>

              <div className="rx-form-actions">
                <button className="rx-btn rx-btn--ghost" onClick={() => setShowTxForm(false)}>
                  Cancel
                </button>
                <button className="rx-btn rx-btn--teal" onClick={saveTx} disabled={saving}>
                  {saving ? <><i className="bi bi-hourglass-split" /> Saving…</> : <><i className="bi bi-check-lg" /> {editingTx ? "Update Treatment" : "Save Treatment"}</>}
                </button>
              </div>
            </div>
          )}

          {/* Treatment Timeline */}
          {treatments.length === 0 && !showTxForm ? (
            <div className="rx-empty">
              <div className="rx-empty-icon rx-empty-icon--teal"><i className="bi bi-clipboard2-pulse" /></div>
              <h3>No treatment records yet</h3>
              <p>Document the first dental procedure for this patient</p>
              <button className="rx-btn rx-btn--teal" onClick={openAddTx}>
                <i className="bi bi-plus-lg" /> Add Treatment
              </button>
            </div>
          ) : (
            <div className="rx-timeline">
              {treatments.map((tx, idx) => (
                <div key={tx.id} className="rx-timeline-item">
                  <div className="rx-timeline-dot" />
                  <div className="rx-timeline-card">
                    <div className="rx-record-header">
                      <div className="rx-record-meta">
                        <span className="rx-record-index rx-record-index--teal">
                          TX-{String(idx + 1).padStart(3, "0")}
                        </span>
                        {tx.procedure_type && (
                          <span className="rx-procedure-badge">{tx.procedure_type}</span>
                        )}
                        <div className="rx-record-timestamps">
                          <span><i className="bi bi-calendar3" /> {fmtDate(tx.created_at)}</span>
                          <span><i className="bi bi-clock" /> {fmtTime(tx.created_at)}</span>
                        </div>
                      </div>
                      <div className="rx-record-actions no-print">
                        <button className="rx-icon-btn rx-icon-btn--edit" onClick={() => openEditTx(tx)} title="Edit">
                          <i className="bi bi-pencil" />
                        </button>
                        <button className="rx-icon-btn rx-icon-btn--del" onClick={() => deleteTx(tx.id)} title="Delete">
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </div>

                    {tx.handled_by && (
                      <div className="rx-handled-by">
                        <i className="bi bi-person-badge" /> {tx.handled_by}
                      </div>
                    )}

                    <div className="rx-medicines-block rx-medicines-block--teal">
                      <div className="rx-medicines-label">
                        <i className="bi bi-clipboard2-check" /> Procedure Notes
                      </div>
                      <pre className="rx-medicines-text">{tx.treatment_text}</pre>
                    </div>

                    {tx.appointment_id && (
                      <div className="rx-linked-appt">
                        <i className="bi bi-link-45deg" /> Linked Appointment: {tx.appointment_id}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Print-only: show both sections */}
      <div className="print-only">
        <h2 style={{ marginTop: "2rem", borderBottom: "2px solid #1a5276", paddingBottom: "0.5rem" }}>
          Prescriptions
        </h2>
        {prescriptions.map((rx, idx) => (
          <div key={rx.id} style={{ marginBottom: "1.5rem", pageBreakInside: "avoid" }}>
            <p><strong>RX-{String(idx + 1).padStart(3, "0")}</strong> &nbsp; {fmtDate(rx.created_at)} {fmtTime(rx.created_at)}</p>
            {rx.chief_complaint && <p><strong>Complaint:</strong> {rx.chief_complaint}</p>}
            {rx.diagnosis       && <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>}
            {rx.referred_by     && <p><strong>Doctor:</strong> {rx.referred_by}</p>}
            <pre style={{ whiteSpace: "pre-wrap", background: "#f8f9fa", padding: "0.75rem", borderRadius: "4px", marginTop: "0.5rem" }}>{rx.medicines_text}</pre>
          </div>
        ))}

        <h2 style={{ marginTop: "2rem", borderBottom: "2px solid #117a65", paddingBottom: "0.5rem" }}>
          Treatment History
        </h2>
        {treatments.map((tx, idx) => (
          <div key={tx.id} style={{ marginBottom: "1.5rem", pageBreakInside: "avoid" }}>
            <p><strong>TX-{String(idx + 1).padStart(3, "0")}</strong> &nbsp; {fmtDate(tx.created_at)} {fmtTime(tx.created_at)}</p>
            {tx.procedure_type && <p><strong>Procedure:</strong> {tx.procedure_type}</p>}
            {tx.handled_by     && <p><strong>Doctor:</strong> {tx.handled_by}</p>}
            <pre style={{ whiteSpace: "pre-wrap", background: "#f0fff4", padding: "0.75rem", borderRadius: "4px", marginTop: "0.5rem" }}>{tx.treatment_text}</pre>
          </div>
        ))}
      </div>

    </div>
  );
}