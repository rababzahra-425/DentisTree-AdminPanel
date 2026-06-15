
import { useEffect, useRef, useState } from "react";
import "./Service.css";
import { API_BASE } from "../api";

const BASE = API_BASE;

const serialId = (s, i) =>
  s.serial_id || s.service_serial || `SRV-${String(i + 1).padStart(3, "0")}`;

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-PK", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return d; }
};

const imgSrc = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ─────────────────────────────────────
   Image Upload Zone
───────────────────────────────────── */
function ImageUploader({ preview, onFile }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  return (
    <div
      className={`srv-upload-zone${preview ? " has-preview" : ""}`}
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {preview ? (
        <>
          <img src={preview} alt="preview" className="srv-upload-preview" />
          <div className="srv-upload-overlay">
            <i className="bi bi-camera"></i>
            <span>Change image</span>
          </div>
        </>
      ) : (
        <div className="srv-upload-placeholder">
          <i className="bi bi-cloud-arrow-up srv-upload-icon"></i>
          <span className="srv-upload-label">Click or drag to upload</span>
          <span className="srv-upload-hint">PNG, JPG, WEBP · max 5 MB</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}

/* ─────────────────────────────────────
   Delete Confirmation Modal
───────────────────────────────────── */
function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card srv-del-modal">
        <div className="srv-del-icon-wrap">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h3 className="srv-del-title">Delete Service?</h3>
        <p className="srv-del-msg">
          Are you sure you want to delete <strong>{name}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal-footer" style={{ justifyContent: "center", gap: 12, paddingTop: 8 }}>
          <button
            className="add-btn"
            style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="add-btn"
            style={{ background: "#dc2626", color: "#fff" }}
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Main Component
───────────────────────────────────── */
export default function Services() {
  const [services, setServices]         = useState([]);
  const [view, setView]                 = useState("list");
  const [selected, setSelected]         = useState(null);
  const [form, setForm]                 = useState({ name: "", title: "", description: "" });
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]               = useState(null);
  const [loading, setLoading]           = useState(false);

  const fetchServices = async () => {
    try {
      const res  = await fetch(`${BASE}/services/`);
      const data = await res.json();
      setServices(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchServices(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageFile = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage  = () => { setImageFile(null); setImagePreview(null); };
  const goBack      = () => { setView("list"); setSelected(null); clearImage(); };

  const openAdd = () => {
    setForm({ name: "", title: "", description: "" });
    clearImage();
    setView("add");
  };

  const openEdit = (s) => {
    setSelected(s);
    setForm({ name: s.name, title: s.title || "", description: s.description || "" });
    setImageFile(null);
    setImagePreview(imgSrc(s.image));
    setView("edit");
  };

  const openDetail = (s) => { setSelected(s); setView("detail"); };

  const buildBody = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);
    return fd;
  };

  const handleAdd = async () => {
    if (!form.name.trim()) { showToast("Service name is required.", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/services/create/`, { method: "POST", body: buildBody() });
      if (res.ok) { await fetchServices(); goBack(); showToast("Service added successfully."); }
      else showToast("Failed to add service.", "error");
    } catch { showToast("Network error.", "error"); }
    finally { setLoading(false); }
  };

  const handleEdit = async () => {
    if (!form.name.trim()) { showToast("Service name is required.", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/services/update/${selected.id}/`, { method: "POST", body: buildBody() });
      if (res.ok) { await fetchServices(); goBack(); showToast("Service updated successfully."); }
      else showToast("Failed to update.", "error");
    } catch { showToast("Network error.", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE}/services/delete/${id}/`, { method: "POST" });
      await fetchServices();
      setDeleteTarget(null);
      if (view !== "list") goBack();
      showToast("Service deleted.");
    } catch { showToast("Failed to delete.", "error"); }
  };

  /* ══════════════════════════════════════════
     DETAIL VIEW  —  unified single card
  ══════════════════════════════════════════ */
  if (view === "detail" && selected) {
    const src = imgSrc(selected.image);
    return (
      <div className="appointments-page">
        {toast && <div className={`srv-toast ${toast.type}`}>{toast.msg}</div>}

        {/* ── Page header ── */}
        <div className="header-section">
          <div>
            <div className="srv-breadcrumb">
              <button className="srv-back-btn" onClick={goBack}>
                <i className="bi bi-arrow-left"></i> Services
              </button>
              <span className="srv-bc-sep">/</span>
              <span className="srv-bc-cur">Details</span>
            </div>
            <h2 className="main-title">Service Details</h2>
          </div>
          <button className="add-btn" onClick={() => openEdit(selected)}>
            <i className="bi bi-pencil"></i> Edit Service
          </button>
        </div>

        {/* ── Unified card ── */}
        <div className="srv-unified-card">
          {/* Left: image panel */}
          <div className="srv-card-img-panel">
            {src ? (
              <img src={src} alt={selected.name} className="srv-card-img" />
            ) : (
              <div className="srv-card-no-img">
                <div className="srv-card-avatar-lg">
                  {selected.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <span className="srv-card-no-img-label">No image uploaded</span>
              </div>
            )}
          </div>

          {/* Right: info panel */}
          <div className="srv-card-info-panel">
            {/* Header row */}
            <div className="srv-card-info-header">
              <div className="srv-card-badge-row">
                <span className="srv-serial-badge">{serialId(selected, 0)}</span>
                {selected.title && (
                  <span className="service-chip">{selected.title}</span>
                )}
              </div>
              <h3 className="srv-card-name">{selected.name}</h3>
            </div>

            {/* Meta fields */}
            <div className="srv-card-meta">
              <div className="srv-card-meta-item">
                <span className="srv-card-meta-icon"><i className="bi bi-calendar3"></i></span>
                <div>
                  <span className="srv-field-lbl">Created At</span>
                  <span className="srv-field-val">{fmtDate(selected.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="srv-card-divider" />

            {/* Description */}
            <div className="srv-card-desc-section">
              <span className="srv-field-lbl" style={{ display: "block", marginBottom: 8 }}>Description</span>
              <p className="srv-card-desc-text">
                {selected.description || "No description provided."}
              </p>
            </div>

            {/* Actions */}
            <div className="srv-card-actions">
              <button
                className="add-btn"
                style={{ background: "#2563EB", color: "#fff" }}
                onClick={() => openEdit(selected)}
              >
                <i className="bi bi-pencil"></i> Edit Service
              </button>
              <button
                className="add-btn"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                onClick={() => setDeleteTarget(selected.id)}
              >
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>

        {deleteTarget && (
          <DeleteModal
            name={selected.name}
            onConfirm={() => handleDelete(deleteTarget)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     ADD / EDIT FORM  —  unified single card
  ══════════════════════════════════════════ */
  if (view === "add" || view === "edit") {
    const isEdit = view === "edit";
    return (
      <div className="appointments-page">
        {toast && <div className={`srv-toast ${toast.type}`}>{toast.msg}</div>}

        {/* ── Page header ── */}
        <div className="header-section">
          <div>
            <div className="srv-breadcrumb">
              <button className="srv-back-btn" onClick={goBack}>
                <i className="bi bi-arrow-left"></i> Services
              </button>
              <span className="srv-bc-sep">/</span>
              <span className="srv-bc-cur">{isEdit ? "Edit" : "Add"}</span>
            </div>
            <h2 className="main-title">{isEdit ? "Edit Service" : "Add New Service"}</h2>
          </div>
        </div>

        {/* ── Unified card ── */}
        <div className="srv-unified-card">
          {/* Left: image upload panel */}
          <div className="srv-card-img-panel srv-card-img-panel--edit">
            <p className="srv-section-lbl" style={{ color: "#fff", opacity: 0.85 }}>
              <i className="bi bi-image"></i> Service Image
            </p>
            <ImageUploader preview={imagePreview} onFile={handleImageFile} />
            {imagePreview && (
              <button className="srv-clear-img srv-clear-img--dark" onClick={clearImage}>
                <i className="bi bi-x-circle"></i> Remove image
              </button>
            )}
            <p className="srv-img-tip" style={{ color: "rgba(255,255,255,0.55)", marginTop: 12 }}>
              Recommended: 400×300 px or wider. PNG, JPG, WEBP · max 5 MB.
            </p>
          </div>

          {/* Right: form fields panel */}
          <div className="srv-card-info-panel">
            <div className="srv-card-info-header" style={{ marginBottom: 24 }}>
              <p className="srv-section-lbl" style={{ margin: 0 }}>
                <i className="bi bi-info-circle"></i>{" "}
                {isEdit ? `Editing — ${selected?.name}` : "Service Information"}
              </p>
            </div>

            <div className="input-group">
              <label>Service Name <span className="srv-required">*</span></label>
              <input
                type="text"
                placeholder="e.g. General Consultation"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Title / Category</label>
              <input
                type="text"
                placeholder="e.g. Primary Care"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                className="srv-textarea"
                rows={5}
                placeholder="Describe the service in detail..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="srv-card-actions" style={{ marginTop: 8 }}>
              <button
                className="add-btn"
                style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}
                onClick={goBack}
              >
                Cancel
              </button>
              <button
                className="add-btn"
                style={{
                  background: loading ? "#93c5fd" : "#2563EB",
                  color: "#fff",
                  minWidth: 140,
                  opacity: loading ? 0.8 : 1,
                }}
                onClick={isEdit ? handleEdit : handleAdd}
                disabled={loading}
              >
                {loading
                  ? <><i className="bi bi-hourglass-split"></i> Saving…</>
                  : isEdit
                    ? <><i className="bi bi-check2-circle"></i> Save Changes</>
                    : <><i className="bi bi-plus-circle"></i> Add Service</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     MAIN TABLE LIST
  ══════════════════════════════════════════ */
  return (
    <div className="appointments-pagee">
      {toast && <div className={`srv-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="header-section">
        <div>
          <h2 className="main-title">Services</h2>
          <p className="srv-count">{services.length} service{services.length !== 1 ? "s" : ""} registered</p>
        </div>
        <button className="aadd-btn" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i> Add Service
        </button>
      </div>

      <div className="tablecontainer">
        {/* Table header */}
        <div className="table-header-griidd srv-grid-cols">
  <span>IMAGE</span>
  <span>SERVICE</span>
  <span>SERVICE INFO</span>
  <span>DESCRIPTION</span>
  <span>CREATED AT</span>
  <span style={{ textAlign: "right" }}>ACTIONS</span>
</div>

        <div className="cards-list">
          {services.length === 0 ? (
            <div className="srv-empty">
              <i className="bi bi-grid-3x3-gap-fill"></i>
              <p>No services found. Add one to get started.</p>
              <button className="add-btn" onClick={openAdd}>
                <i className="bi bi-plus-lg"></i> Add Service
              </button>
            </div>
          ) : (
      //       services.map((s, i) => {
      //         const src = imgSrc(s.image);
      //         return (
      //           <div className="appointment-card-row srv-grid-cols" key={s.id}>

      //             {/* Thumbnail */}
      //             <div className="srv-col-thumb">
      //               {src ? (
      //                 <img
      //                   className="srv-row-thumb"
      //                   src={src}
      //                   alt={s.name}
      //                   onError={(e) => {
      //                     e.target.style.display = "none";
      //                     e.target.nextSibling.style.display = "flex";
      //                   }}
      //                 />
      //               ) : null}
      //               <div
      //                 className="srv-avatar-fb"
      //                 style={{ display: src ? "none" : "flex" }}
      //               >
      //                 {s.name?.charAt(0).toUpperCase() || "S"}
      //               </div>
      //             </div>
                   
      //              <div className="col-id">
      //   <span className="srv-serial-badge">{serialId(s, i)}</span>
      // </div>

      // {/* Service Info (ID yahan se hata di) */}
      // <div className="col-patient">
      //   <div className="patient-text">
      //     <div className="p-name">{s.name}</div>
      //     <div className="p-sub">
      //       {s.title && <span className="srv-title-tag">{s.title}</span>}
      //     </div>
      //   </div>
      // </div>

      //             {/* Name + serial */}
      //             <div className="col-patient">
      //               <div className="patient-text">
      //                 <div className="p-name">{s.name}</div>
      //                 {/* <div className="p-sub"> */}
      //                   {/* <span className="srv-serial-badge">{serialId(s, i)}</span> */}
      //                   {/* {s.title && <span className="srv-title-tag">{s.title}</span>} */}
      //                 {/* </div> */}
      //               </div>
      //             </div>

      //             {/* Description */}
      //             <div className="col-service">
      //               <span className="srv-desc-clamp">
      //                 {s.description || <em style={{ color: "#cbd5e1" }}>No description</em>}
      //               </span>
      //             </div>

      //             {/* Created at */}
      //             <div className="col-contact">
      //               <div className="d-text">{fmtDate(s.created_at)}</div>
      //             </div>

      //             {/* Actions */}
      //             <div className="col-actions">
      //               <button title="View Details" className="btn-icon-round view" onClick={() => openDetail(s)}>
      //                 <i className="bi bi-eye"></i>
      //               </button>
      //               <button title="Edit" className="btn-icon-round approve" onClick={() => openEdit(s)}>
      //                 <i className="bi bi-pencil"></i>
      //               </button>
      //               <button title="Delete" className="btn-icon-round reject" onClick={() => setDeleteTarget(s.id)}>
      //                 <i className="bi bi-trash"></i>
      //               </button>
      //             </div>
      //           </div>
      //         );
      //       })
            services.map((s, i) => {
  const src = imgSrc(s.image);
  return (
    <div className="appointment-card-rowww srv-grid-colss" key={s.id}>

      {/* 1. IMAGE */}
      <div className="srv-col-thumb">
        {src ? (
          <img
            className="srv-row-thumb"
            src={src}
            alt={s.name}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="srv-avatar-fb"
          style={{ display: src ? "none" : "flex" }}
        >
          {s.name?.charAt(0).toUpperCase() || "S"}
        </div>
      </div>
      
      {/* 2. ID */}
      <div className="col-id">
            <div className="patient-text">
        <div className="p-name">{s.name}</div>
        <span className="srv-serial-badgee">ID-{i+1}</span>
      </div>
        </div>

      {/* 3. SERVICE INFO */}
      <div className="col-patient">
    

          <div className="p-sub">
            {s.title && <span className="srv-title-tag">{s.title}</span>}
        
        </div>
      </div>

      {/* 4. DESCRIPTION */}
      <div className="col-service">
        <span className="srv-desc-clamp">
          {s.description || <em style={{ color: "#cbd5e1" }}>No description</em>}
        </span>
      </div>

      {/* 5. CREATED AT */}
      <div className="col-contact">
        <div className="d-text">{fmtDate(s.created_at)}</div>
      </div>

      {/* 6. ACTIONS */}
      <div className="col-actions">
        <button title="View Details" className="btn-icon-round view" onClick={() => openDetail(s)}>
          <i className="bi bi-eye"></i>
        </button>
        <button title="Edit" className="btn-icon-round approve" onClick={() => openEdit(s)}>
          <i className="bi bi-pencil"></i>
        </button>
        <button title="Delete" className="btn-icon-round reject" onClick={() => setDeleteTarget(s.id)}>
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
})
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteModal
          name={services.find((s) => s.id === deleteTarget)?.name}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}