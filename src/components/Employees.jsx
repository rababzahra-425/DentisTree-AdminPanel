
import React, { useEffect, useState } from "react";
import "./Employees.css";
import { API_BASE } from "../api";

const API = API_BASE;
 
const EMPTY_FORM = {
  name: "",
  father_name: "",
  id_card_number: "",
  designation: "",
  department: "",
  phone: "",
  email: "",
  address: "",
  salary: "",
  join_date: "",
  status: "Active",
  salary_status: "Unpaid",
};
 
function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewEmployee, setViewEmployee] = useState(null); // NEW: for View detail modal
  const [resetting, setResetting] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
 
  // ─── Fetch ───────────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API}/employees/`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchEmployees(); }, []);
 
  // ─── Filtered list ───────────────────────────────────────────────────
  const filtered = employees.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.designation || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.department || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });
 
  // ─── Open Add Modal ──────────────────────────────────────────────────
  const openAddModal = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };
 
  // ─── Open Edit Modal ─────────────────────────────────────────────────
  const openEditModal = (emp) => {
    setEditItem(emp);
    setForm({
      name: emp.name || "",
      father_name: emp.father_name || "",
      id_card_number: emp.id_card_number || "",
      designation: emp.designation || "",
      department: emp.department || "",
      phone: emp.phone || "",
      email: emp.email || "",
      address: emp.address || "",
      salary: emp.salary || "",
      join_date: emp.join_date || "",
      status: emp.status || "Active",
      salary_status: emp.salary_status || "Unpaid",
    });
    setShowModal(true);
  };
 
  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
  };
 
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 
  // ─── Save ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return alert("Employee name is required.");
    setSaving(true);
    try {
      const url = editItem
        ? `${API}/employees/update/${editItem.id}/`
        : `${API}/employees/create/`;
 
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
 
      if (res.ok) {
        await fetchEmployees();
        closeModal();
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Something went wrong"));
      }
    } catch (err) {
      alert("Network error — could not save.");
    } finally {
      setSaving(false);
    }
  };
 
  // ─── Delete ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/employees/delete/${id}/`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchEmployees();
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };
 
  // ─── Toggle Salary Status ─────────────────────────────────────────────
  const handleToggleSalaryStatus = async (emp) => {
    const newStatus = (emp.salary_status || "Unpaid") === "Paid" ? "Unpaid" : "Paid";
    try {
      const res = await fetch(`${API}/employees/salary-status/${emp.id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salary_status: newStatus }),
      });
      if (res.ok) {
        await fetchEmployees();
      } else {
        alert("Failed to update salary status.");
      }
    } catch {
      alert("Network error.");
    }
  };

  // ─── Reset ALL salary statuses to Unpaid ─────────────────────────────
  const handleResetAllSalaries = async () => {
    setResetting(true);
    try {
      const res = await fetch(`${API}/employees/salary/reset-all/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        await fetchEmployees();
        setResetConfirm(false);
        alert(data.message);
      } else {
        alert("Failed to reset salary statuses.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setResetting(false);
    }
  };
 
  // ─── Avatar initials ─────────────────────────────────────────────────
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : parts[0][0].toUpperCase();
  };
 
  return (
    <div className="emp-container">
 
      {/* ── Header ── */}
      <div className="emp-header">
        <h2 className="emp-main-title">Employees</h2>
        <div className="emp-header-actions">
          <button
            className="emp-reset-btn"
            onClick={() => setResetConfirm(true)}
            title="Reset all salary statuses to Unpaid (runs automatically on 1st of each month)"
          >
            ↺ Reset All Salaries
          </button>
          <button className="emp-add-btn" onClick={openAddModal}>+ Add Employee</button>
        </div>
      </div>
 
      {/* ── Stats Row ── */}
      <div className="emp-stats">
        <div className="emp-stat-card">
          <span className="emp-stat-num">{employees.length}</span>
          <span className="emp-stat-label">Total Employees</span>
        </div>
        <div className="emp-stat-card">
          <span className="emp-stat-num active-num">
            {employees.filter((e) => e.status === "Active").length}
          </span>
          <span className="emp-stat-label">Active</span>
        </div>
        <div className="emp-stat-card">
          <span className="emp-stat-num inactive-num">
            {employees.filter((e) => e.status === "Inactive").length}
          </span>
          <span className="emp-stat-label">Inactive</span>
        </div>
      </div>
 
      {/* ── Search + Filter ── */}
      <div className="emp-toolbar">
        <input
          className="emp-search"
          type="text"
          placeholder="Search by name, designation or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="emp-status-filters">
          {["all", "Active", "Inactive"].map((s) => (
            <button
              key={s}
              className={`emp-filter-btn ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>
 
      {/* ── Card-based Table ── */}
      {loading ? (
        <div className="emp-loading">Loading employees...</div>
      ) : filtered.length === 0 ? (
        <div className="emp-empty">
          {search ? `No results for "${search}"` : "No employees found. Click + Add Employee to get started."}
        </div>
      ) : (
        <div className="emp-tablecontainer">
 
          {/* Column Headers */}
          <div className="emp-table-header-grid">
            <span>EMPLOYEE</span>
            <span>DESIGNATION</span>
            <span>CONTACT</span>
            <span>STATUS</span>
            {/* <span>SALARY STATUS</span> */}
            <span className="text-right">ACTIONS</span>
          </div>
          {/* Card Rows */}
          <div className="emp-cards-list">
            {filtered.map((emp, i) => (
              <div key={emp.id} className="emp-card-row">
 
                {/* Employee Info */}
                <div className="emp-col-employee">
                  <div className="emp-avatar-box">{getInitials(emp.name)}</div>
                  <div className="emp-text">
                    <div className="emp-name">{emp.name}</div>
                    <div className="emp-id-badgee">ID-{String(i + 1)}</div>
                  </div>
                </div>
 
                {/* Designation + Department */}
                <div className="emp-col-designation">
                  <span className="emp-desig-chip">{emp.designation || "—"}</span>
                </div>
 
                {/* Contact */}
                <div className="emp-col-contact">
                  {emp.phone && (
                    <div className="emp-contact-line">
                      <i className="bi bi-telephone-fill"></i> {emp.phone}
                    </div>
                  )}
                </div>
 
                {/* Active/Inactive Status */}
                <div className="emp-col-status">
                  <span className={`emp-status-badge ${emp.status === "Active" ? "active" : "inactive"}`}>
                    {emp.status}
                  </span>
                  <div className="emp-col-salary-status">
                  <button
                    className={`emp-salary-toggle ${(emp.salary_status || "Unpaid") === "Paid" ? "paid" : "unpaid"}`}
                    onClick={() => handleToggleSalaryStatus(emp)}
                    title={`Click to mark as ${(emp.salary_status || "Unpaid") === "Paid" ? "Unpaid" : "Paid"}`}
                  >
                    <span className="emp-salary-dot" />
                    {emp.salary_status || "Unpaid"}
                  </button>
                </div>
                </div>
 
                {/* Salary Status Toggle */}
                
 
                {/* Actions */}
                <div className="emp-col-actions">
                  <button
                    title="View Details"
                    className="btn-icon-round view"
                    onClick={() => setViewEmployee(emp)}
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    title="Edit"
                    className="btn-icon-round edit"
                    onClick={() => openEditModal(emp)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    title="Delete"
                    className="btn-icon-round delete"
                    onClick={() => setDeleteConfirm(emp.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
 
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* ── VIEW DETAIL MODAL ── */}
      {viewEmployee && (
        <div className="modal-overlay" onClick={() => setViewEmployee(null)}>
          <div className="emp-view-modal" onClick={(e) => e.stopPropagation()}>
 
            <div className="emp-view-header">
              <div className="emp-view-avatar">{getInitials(viewEmployee.name)}</div>
              <div className="emp-view-title-block">
                <h3 className="emp-view-name">{viewEmployee.name}</h3>
                <div className="emp-view-desig">
                  {viewEmployee.designation || "—"}
                  {viewEmployee.department ? ` · ${viewEmployee.department}` : ""}
                </div>
              </div>
              <button className="close-x" onClick={() => setViewEmployee(null)}>×</button>
            </div>
 
            <div className="emp-view-body">
              <div className="emp-detail-grid">
                <div className="emp-detail-item">
                  <span className="emp-detail-label">Father's Name</span>
                  <span className="emp-detail-value">{viewEmployee.father_name || "—"}</span>
                </div>
                <div className="emp-detail-item">
                  <span className="emp-detail-label">ID Card No.</span>
                  <span className="emp-detail-value emp-mono">{viewEmployee.id_card_number || "—"}</span>
                </div>
                <div className="emp-detail-item">
                  <span className="emp-detail-label">Phone</span>
                  <span className="emp-detail-value">{viewEmployee.phone || "—"}</span>
                </div>
                <div className="emp-detail-item">
                  <span className="emp-detail-label">Email</span>
                  <span className="emp-detail-value emp-email-text">{viewEmployee.email || "—"}</span>
                </div>
                <div className="emp-detail-item">
                  <span className="emp-detail-label">Salary</span>
                  <span className="emp-detail-value emp-salary-text">
                    {viewEmployee.salary ? `Rs. ${Number(viewEmployee.salary).toLocaleString()}` : "—"}
                  </span>
                </div>
                <div className="emp-detail-item">
                  <span className="emp-detail-label">Join Date</span>
                  <span className="emp-detail-value">{viewEmployee.join_date || "—"}</span>
                </div>
                <div className="emp-detail-item">
                  <span className="emp-detail-label">Status</span>
                  <span className={`emp-status-badge ${viewEmployee.status === "Active" ? "active" : "inactive"}`}>
                    {viewEmployee.status}
                  </span>
                </div>
                <div className="emp-detail-item">
                  <span className="emp-detail-label">Salary Status</span>
                  <span className={`emp-status-badge ${(viewEmployee.salary_status || "Unpaid") === "Paid" ? "active" : "inactive"}`}>
                    {viewEmployee.salary_status || "Unpaid"}
                  </span>
                </div>
                <div className="emp-detail-item emp-detail-full">
                  <span className="emp-detail-label">Address</span>
                  <span className="emp-detail-value">{viewEmployee.address || "—"}</span>
                </div>
              </div>
            </div>
 
            <div className="emp-view-footer">
              {/* <button
                className="emp-view-edit-btn"
                onClick={() => { setViewEmployee(null); openEditModal(viewEmployee); }}
              >
                <i className="bi bi-pencil"></i> Edit Employee
              </button> */}
              <button className="emp-cancel-btn" onClick={() => setViewEmployee(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
 
      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <>
          <div className="emp-overlay" onClick={closeModal} />
          <div className="emp-modal">
            <h3>{editItem ? `Edit — ${editItem.name}` : "Add New Employee"}</h3>
 
            <div className="emp-form-grid">
              <div className="emp-field">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ahmed Ali" />
              </div>
              <div className="emp-field">
                <label>Father's Name</label>
                <input name="father_name" value={form.father_name} onChange={handleChange} placeholder="e.g. Muhammad Ali" />
              </div>
              <div className="emp-field">
                <label>ID Card Number</label>
                <input name="id_card_number" value={form.id_card_number} onChange={handleChange} placeholder="e.g. 35202-1234567-1" />
              </div>
              <div className="emp-field">
                <label>Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Dentist, Receptionist" />
              </div>
              <div className="emp-field">
                <label>Department</label>
                <select name="department" value={form.department} onChange={handleChange}>
                  <option value="">-- Select --</option>
                  <option>Doctor</option>
                  <option>Receptionist</option>
                  <option>Nurse</option>
                  <option>Assistant</option>
                  <option>Cleaner</option>
                  <option>Administration</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="emp-field">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0300-1234567" />
              </div>
              <div className="emp-field">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. ahmed@clinic.com" />
              </div>
              <div className="emp-field">
                <label>Salary (Rs.)</label>
                <input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="e.g. 45000" />
              </div>
              <div className="emp-field">
                <label>Join Date</label>
                <input name="join_date" type="date" value={form.join_date} onChange={handleChange} />
              </div>
              <div className="emp-field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="emp-field">
                <label>Salary Status</label>
                <select name="salary_status" value={form.salary_status} onChange={handleChange}>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="emp-field emp-field-full">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. House 12, Street 4, Sahiwal" />
              </div>
            </div>
 
            <div className="emp-modal-actions">
              <button className="emp-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editItem ? "Update Employee" : "Add Employee"}
              </button>
              <button className="emp-cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </>
      )}
 
      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <>
          <div className="emp-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="emp-confirm-modal">
            <h3>Delete this employee?</h3>
            <p>This action cannot be undone.</p>
            <div className="emp-confirm-actions">
              <button className="emp-delete-confirm-btn" onClick={() => handleDelete(deleteConfirm)}>
                Yes, Delete
              </button>
              <button className="emp-cancel-btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Reset All Salaries Confirm ── */}
      {resetConfirm && (
        <>
          <div className="emp-overlay" onClick={() => setResetConfirm(false)} />
          <div className="emp-confirm-modal">
            <h3>Reset all salary statuses?</h3>
            <p>
              This will mark <strong>all employees</strong> as <strong>Unpaid</strong>.
              This happens automatically on the 1st of every month, but you can also trigger it manually.
            </p>
            <div className="emp-confirm-actions">
              <button
                className="emp-delete-confirm-btn"
                onClick={handleResetAllSalaries}
                disabled={resetting}
              >
                {resetting ? "Resetting..." : "Yes, Reset All"}
              </button>
              <button className="emp-cancel-btn" onClick={() => setResetConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
 
export default Employees;
