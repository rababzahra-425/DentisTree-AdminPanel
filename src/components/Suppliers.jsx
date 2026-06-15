import React, { useEffect, useState } from "react";
import "./Suppliers.css";
import { API_BASE } from "../api";

const API = API_BASE;
const EMPTY_FORM = { name: "", contact_person: "", phone: "", email: "", address: "" };

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API}/suppliers/`);
      const data = await res.json();
      setSuppliers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.contact_person || "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (s) => { setEditItem(s); setForm({ name: s.name, contact_person: s.contact_person || "", phone: s.phone || "", email: s.email || "", address: s.address || "" }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Supplier name is required.");
    setSaving(true);
    try {
      const url = editItem
        ? `${API}/suppliers/update/${editItem.id}/`
        : `${API}/suppliers/create/`;
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { await fetchSuppliers(); closeModal(); }
      else { const e = await res.json(); alert("Error: " + (e.error || "Unknown")); }
    } catch { alert("Network error."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/suppliers/delete/${id}/`, { method: "POST" });
      if (res.ok) { await fetchSuppliers(); setDeleteConfirm(null); }
      else alert("Failed to delete.");
    } catch { alert("Network error."); }
  };

  const getInitials = (name) => {
    const p = name.trim().split(" ");
    return p.length >= 2 ? p[0][0].toUpperCase() + p[1][0].toUpperCase() : p[0][0].toUpperCase();
  };

  return (
    <div className="sup-container">
      <div className="sup-header sup-head">
        <h2>Suppliers</h2>
        <button className="sup-add-btn" onClick={openAdd}>+ Add Supplier</button>
      </div>

      <div className="sup-toolbar">
        <input className="sup-search" placeholder="Search by name or contact..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="sup-count">{suppliers.length} suppliers</span>
      </div>

      {loading ? (
        <div className="sup-empty">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="sup-empty">{search ? `No results for "${search}"` : 'No suppliers yet. Click "+ Add Supplier" to get started.'}</div>
      ) : (
        <div className="sup-tablecontainer">
  <div className="sup-table-header-grid">
    <span>SUPPLIER</span>
    <span>CONTACT PERSON</span>
    <span>PHONE</span>
    <span>EMAIL</span>
    <span>ADDRESS</span>
    <span className="text-right">ACTIONS</span>
  </div>

  <div className="sup-cards-list">
    {filtered.length > 0 ? filtered.map((s, i) => (
      <div key={s.id} className="sup-card-row">
        {/* Supplier Info */}
        <div className="col-supplier">
          <div className="sup-avatar-box">{getInitials(s.name)}</div>
          <div className="sup-text">
            <div className="sup-name">{s.name}</div>
            <div className="sup-id-badge">ID-{String(i + 1)}</div>
          </div>
        </div>

        <div className="col-contact">{s.contact_person || "—"}</div>
        <div className="col-phone">{s.phone || "—"}</div>
        <div className="col-email">{s.email || "—"}</div>
        <div className="col-address">{s.address || "—"}</div>

        <div className="col-actions">
          <button className="btn-icon-round edit" onClick={() => openEdit(s)}>
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn-icon-round delete" onClick={() => setDeleteConfirm(s.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    )) : (
      <div className="sup-empty">No suppliers found.</div>
    )}
  </div>
</div>
      )}

      {showModal && (
        <>
          <div className="sup-overlay" onClick={closeModal} />
          <div className="sup-modal">
            <h3>{editItem ? `Edit — ${editItem.name}` : "Add New Supplier"}</h3>
            <div className="sup-form-grid">
              <div className="sup-field sup-field-full">
                <label>Supplier Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. MedCo Supplies" />
              </div>
              <div className="sup-field">
                <label>Contact Person</label>
                <input name="contact_person" value={form.contact_person} onChange={handleChange} placeholder="e.g. Usman Ahmed" />
              </div>
              <div className="sup-field">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0300-1234567" />
              </div>
              <div className="sup-field">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. supplier@medco.com" />
              </div>
              <div className="sup-field">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. Lahore, Pakistan" />
              </div>
            </div>
            <div className="sup-modal-actions">
              <button className="sup-save-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editItem ? "Update" : "Add Supplier"}</button>
              <button className="sup-cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {deleteConfirm && (
        <>
          <div className="sup-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="sup-confirm-modal">
            <h3>Delete this supplier?</h3>
            <p>This cannot be undone.</p>
            <div className="sup-confirm-actions">
              <button className="sup-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
              <button className="sup-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Suppliers;