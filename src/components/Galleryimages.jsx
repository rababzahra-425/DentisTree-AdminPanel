import React, { useEffect, useState, useCallback, useRef } from "react";
import "./Galleryimages.css";
import { API_BASE } from "../api";

const API = API_BASE;

const emptyForm = () => ({ service_id: "", description: "", image: null, video: null });

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-PK", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch { return d; }
};

const mediaSrc = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ─────────────────────────────────────
   Media Uploader (image + video)
───────────────────────────────────── */
function MediaUploader({ imagePreview, videoPreview, onImageFile, onVideoFile, onClearImage, onClearVideo }) {
  const imgRef = useRef();
  const vidRef = useRef();

  const handleImgDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onImageFile(file);
  };

  const handleVidDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) onVideoFile(file);
  };

  return (
    <div className="gi-media-uploader">
      {/* Image Upload */}
      <div className="gi-media-section">
        <p className="srv-section-lbl">
          <i className="bi bi-image"></i> Gallery Image
        </p>
        <div
          className={`srv-upload-zone${imagePreview ? " has-preview" : ""}`}
          onClick={() => imgRef.current.click()}
          onDrop={handleImgDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="preview" className="srv-upload-preview" />
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
          <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageFile(f); }} />
        </div>
        {imagePreview && (
          <button className="srv-clear-img srv-clear-img--dark" onClick={onClearImage}>
            <i className="bi bi-x-circle"></i> Remove image
          </button>
        )}
      </div>

      {/* Video Upload */}
      <div className="gi-media-section">
        <p className="srv-section-lbl">
          <i className="bi bi-camera-video"></i> Gallery Video
        </p>
        <div
          className={`srv-upload-zone gi-video-zone${videoPreview ? " has-preview" : ""}`}
          onClick={() => vidRef.current.click()}
          onDrop={handleVidDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {videoPreview ? (
            <>
              <video src={videoPreview} className="gi-video-preview" muted playsInline />
              <div className="srv-upload-overlay">
                <i className="bi bi-camera-video"></i>
                <span>Change video</span>
              </div>
            </>
          ) : (
            <div className="srv-upload-placeholder">
              <i className="bi bi-play-circle srv-upload-icon"></i>
              <span className="srv-upload-label">Click or drag to upload</span>
              <span className="srv-upload-hint">MP4, MOV, WEBM · max 50 MB</span>
            </div>
          )}
          <input ref={vidRef} type="file" accept="video/*" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onVideoFile(f); }} />
        </div>
        {videoPreview && (
          <button className="srv-clear-img srv-clear-img--dark" onClick={onClearVideo}>
            <i className="bi bi-x-circle"></i> Remove video
          </button>
        )}
      </div>

      <p className="srv-img-tip" style={{ color: "rgba(255,255,255,0.55)", marginTop: 12 }}>
        Upload a result image and/or a short video. Both are optional but recommended.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────
   Delete Modal
───────────────────────────────────── */
function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card gi-del-modal">
        <div className="gi-del-icon-wrap">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h3 className="gi-del-title">Delete Record?</h3>
        <p className="gi-del-msg">
          Are you sure you want to delete <strong>{name || "this record"}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal-footer" style={{ justifyContent: "center", gap: 12, paddingTop: 8 }}>
          <button className="add-btn"
            style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}
            onClick={onCancel}>Cancel</button>
          <button className="add-btn"
            style={{ background: "#dc2626", color: "#fff" }}
            onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Main Component
───────────────────────────────────── */
export default function GalleryImages() {
  const [records, setRecords]           = useState([]);
  const [services, setServices]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState("list");
  const [active, setActive]             = useState(null);
  const [form, setForm]                 = useState(emptyForm());
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile]       = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]               = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/gallery/`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/services/`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchRecords(); fetchServices(); }, [fetchRecords, fetchServices]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const clearMedia = () => {
    setImageFile(null); setImagePreview(null);
    setVideoFile(null); setVideoPreview(null);
  };

  const handleImageFile = (file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); };
  const handleVideoFile = (file) => { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); };

  const goList = () => { setPage("list"); setActive(null); setForm(emptyForm()); clearMedia(); };
  const goCreate = () => { setPage("create"); setActive(null); setForm(emptyForm()); clearMedia(); };
  const goView = (r) => { setPage("view"); setActive(r); };

  const goEdit = (r) => {
    setPage("edit"); setActive(r);
    setForm({ service_id: r.service_id || "", description: r.description || "", image: null, video: null });
    setImageFile(null); setImagePreview(mediaSrc(r.image_url));
    setVideoFile(null); setVideoPreview(mediaSrc(r.video_url));
  };

  const handleSave = async () => {
    if (!form.service_id) { showToast("Please select a service.", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("service_id", form.service_id);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);
      if (videoFile) fd.append("video", videoFile);

      const url = page === "edit" ? `${API}/gallery/update/${active.id}/` : `${API}/gallery/create/`;
      const res = await fetch(url, { method: "POST", body: fd });

      if (res.ok) {
        await fetchRecords(); goList();
        showToast(page === "edit" ? "Record updated successfully." : "Record added successfully.");
      } else { showToast("Failed to save record.", "error"); }
    } catch { showToast("Network error.", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/gallery/delete/${id}/`, { method: "POST" });
      if (res.ok) {
        await fetchRecords(); setDeleteTarget(null);
        if (page !== "list") goList();
        showToast("Record deleted.");
      }
    } catch { showToast("Failed to delete.", "error"); }
  };

  /* ══════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════ */
  if (page === "list") return (
    <div className="appointments-page">
      {toast && <div className={`srv-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="header-section">
        <div>
          <h2 className="main-title">Gallery Images</h2>
          <p className="srv-count">{records.length} record{records.length !== 1 ? "s" : ""} found</p>
        </div>
        <button className="addd-btn" onClick={goCreate}>
          <i className="bi bi-plus-lg"></i> Add New
        </button>
      </div>

      <div className="tablecontainer">
        <div className="gi-table-header-grid">
          <span>MEDIA</span>
          <span>SERVICE</span>
          <span>DESCRIPTION</span>
          <span>CREATED AT</span>
          <span style={{ textAlign: "right" }}>ACTIONS</span>
        </div>

        <div className="cards-list">
          {loading ? (
            <div className="srv-empty">
              <i className="bi bi-hourglass-split"></i>
              <p>Loading records…</p>
            </div>
          ) : records.length === 0 ? (
            <div className="srv-empty">
              <i className="bi bi-images"></i>
              <p>No records found. Add one to get started.</p>
              <button className="add-btn" onClick={goCreate}>
                <i className="bi bi-plus-lg"></i> Add New
              </button>
            </div>
          ) : records.map((r, i) => {
            const imgSrcVal = mediaSrc(r.image_url);
            const vidSrcVal = mediaSrc(r.video_url);
            return (
              <div className="gi-row-card" key={r.id} onClick={() => goView(r)}>
                {/* Thumbnail */}
                <div className="gi-col-thumb">
                  {imgSrcVal ? (
                    <img className="gi-row-thumb" src={imgSrcVal} alt={r.service_name}
                      onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                  ) : null}
                  {!imgSrcVal && vidSrcVal ? (
                    <div className="gi-thumb-video"><i className="bi bi-play-circle-fill"></i></div>
                  ) : null}
                  <div className="srv-avatar-fb" style={{ display: imgSrcVal || vidSrcVal ? "none" : "flex" }}>
                    {(r.service_name || "G").charAt(0).toUpperCase()}
                  </div>
                  {vidSrcVal && (
                    <span className="gi-has-video-badge"><i className="bi bi-camera-video-fill"></i></span>
                  )}
                </div>

                {/* Service */}
                <div className="col-patient">
                  <div className="patient-text">
                    <div className="p-name">{r.service_name || "—"}</div>
                    <div className="p-sub"><span className="srv-serial-badge">ID-{i + 1}</span></div>
                  </div>
                </div>

                {/* Description */}
                <div className="col-service">
                  <span className="srv-desc-clamp">
                    {r.description || <em style={{ color: "#cbd5e1" }}>No description</em>}
                  </span>
                </div>

                {/* Date */}
                <div className="col-contact">
                  <div className="d-text">{fmtDate(r.created_at)}</div>
                </div>

                {/* Actions */}
                <div className="col-actions" onClick={e => e.stopPropagation()}>
                  <button title="View" className="btn-icon-round view" onClick={() => goView(r)}>
                    <i className="bi bi-eye"></i>
                  </button>
                  <button title="Edit" className="btn-icon-round approve" onClick={() => goEdit(r)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button title="Delete" className="btn-icon-round reject" onClick={() => setDeleteTarget(r.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {deleteTarget && (
        <DeleteModal
          name={records.find(r => r.id === deleteTarget)?.service_name}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );

  /* ══════════════════════════════════════════
     DETAIL VIEW
  ══════════════════════════════════════════ */
  if (page === "view" && active) {
    const imgSrcVal = mediaSrc(active.image_url);
    const vidSrcVal = mediaSrc(active.video_url);
    return (
      <div className="appointments-page">
        {toast && <div className={`srv-toast ${toast.type}`}>{toast.msg}</div>}

        <div className="header-section">
          <div>
            <div className="srv-breadcrumb">
              <button className="srv-back-btn" onClick={goList}>
                <i className="bi bi-arrow-left"></i> Gallery
              </button>
              <span className="srv-bc-sep">/</span>
              <span className="srv-bc-cur">Details</span>
            </div>
            <h2 className="main-title">Record Details</h2>
          </div>
          <button className="add-btn" onClick={() => goEdit(active)}>
            <i className="bi bi-pencil"></i> Edit Record
          </button>
        </div>

        <div className="srv-unified-card">
          {/* Left: media panel */}
          <div className="srv-card-img-panel">
            {imgSrcVal ? (
              <img src={imgSrcVal} alt={active.service_name} className="srv-card-img" />
            ) : vidSrcVal ? (
              <video src={vidSrcVal} className="gi-detail-video" controls playsInline />
            ) : (
              <div className="srv-card-no-img">
                <div className="srv-card-avatar-lg">
                  {(active.service_name || "G").charAt(0).toUpperCase()}
                </div>
                <span className="srv-card-no-img-label">No media uploaded</span>
              </div>
            )}
            {imgSrcVal && vidSrcVal && (
              <div className="gi-also-has-video">
                <i className="bi bi-camera-video-fill"></i>
                <span>Video also available</span>
              </div>
            )}
          </div>

          {/* Right: info panel */}
          <div className="srv-card-info-panel">
            <div className="srv-card-info-header">
              <div className="srv-card-badge-row">
                <span className="srv-serial-badge">#{active.id}</span>
                {active.service_name && (
                  <span className="service-chip">{active.service_name}</span>
                )}
              </div>
              <h3 className="srv-card-name">{active.service_name || "Gallery Record"}</h3>
            </div>

            <div className="srv-card-meta">
              <div className="srv-card-meta-item">
                <span className="srv-card-meta-icon"><i className="bi bi-calendar3"></i></span>
                <div>
                  <span className="srv-field-lbl">Created At</span>
                  <span className="srv-field-val">{fmtDate(active.created_at)}</span>
                </div>
              </div>
              {vidSrcVal && (
                <div className="srv-card-meta-item">
                  <span className="srv-card-meta-icon"><i className="bi bi-camera-video"></i></span>
                  <div>
                    <span className="srv-field-lbl">Video</span>
                    <a href={vidSrcVal} target="_blank" rel="noreferrer" className="srv-field-val gi-video-link">
                      View video <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="srv-card-divider" />

            <div className="srv-card-desc-section">
              <span className="srv-field-lbl" style={{ display: "block", marginBottom: 8 }}>Description</span>
              <p className="srv-card-desc-text">
                {active.description || "No description provided."}
              </p>
            </div>

            <div className="srv-card-actions">
              <button className="add-btn" style={{ background: "#2563EB", color: "#fff" }}
                onClick={() => goEdit(active)}>
                <i className="bi bi-pencil"></i> Edit Record
              </button>
              <button className="add-btn"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                onClick={() => setDeleteTarget(active.id)}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>

        {deleteTarget && (
          <DeleteModal
            name={active.service_name}
            onConfirm={() => handleDelete(deleteTarget)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     ADD / EDIT FORM
  ══════════════════════════════════════════ */
  if (page === "create" || page === "edit") {
    const isEdit = page === "edit";
    return (
      <div className="appointments-page">
        {toast && <div className={`srv-toast ${toast.type}`}>{toast.msg}</div>}

        <div className="header-section">
          <div>
            <div className="srv-breadcrumb">
              <button className="srv-back-btn" onClick={isEdit ? () => goView(active) : goList}>
                <i className="bi bi-arrow-left"></i> Gallery
              </button>
              <span className="srv-bc-sep">/</span>
              <span className="srv-bc-cur">{isEdit ? "Edit" : "Add"}</span>
            </div>
            <h2 className="main-title">{isEdit ? "Edit Record" : "Add New Record"}</h2>
          </div>
        </div>

        <div className="srv-unified-card">
          {/* Left: media upload */}
          <div className="srv-card-img-panel srv-card-img-panel--edit">
            <MediaUploader
              imagePreview={imagePreview}
              videoPreview={videoPreview}
              onImageFile={handleImageFile}
              onVideoFile={handleVideoFile}
              onClearImage={() => { setImageFile(null); setImagePreview(null); }}
              onClearVideo={() => { setVideoFile(null); setVideoPreview(null); }}
            />
          </div>

          {/* Right: form */}
          <div className="srv-card-info-panel">
            <div className="srv-card-info-header" style={{ marginBottom: 24 }}>
              <p className="srv-section-lbl" style={{ margin: 0 }}>
                <i className="bi bi-info-circle"></i>{" "}
                {isEdit ? `Editing — ${active?.service_name || "Record"}` : "Record Information"}
              </p>
            </div>

            <div className="input-group">
              <label>Service <span className="srv-required">*</span></label>
              <select
                value={form.service_id}
                onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))}
              >
                <option value="">— Select a service —</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                className="srv-textarea"
                rows={5}
                placeholder="Describe this gallery result…"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="srv-card-actions" style={{ marginTop: 8 }}>
              <button className="add-btn"
                style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}
                onClick={isEdit ? () => goView(active) : goList}>
                Cancel
              </button>
              <button className="add-btn"
                style={{
                  background: saving ? "#93c5fd" : "#2563EB",
                  color: "#fff", minWidth: 140, opacity: saving ? 0.8 : 1,
                }}
                onClick={handleSave} disabled={saving}>
                {saving
                  ? <><i className="bi bi-hourglass-split"></i> Saving…</>
                  : isEdit
                    ? <><i className="bi bi-check2-circle"></i> Save Changes</>
                    : <><i className="bi bi-plus-circle"></i> Add Record</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
