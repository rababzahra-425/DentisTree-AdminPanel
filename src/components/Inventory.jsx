// import React, { useEffect, useState } from "react";
// import "./Inventory.css";

// const CATEGORIES = ["All", "Consumable", "Medicine", "Equipment", "Instrument", "Other"];
// const UNITS = ["pieces", "boxes", "ml", "mg", "bottles", "packets", "rolls", "pairs"];

// const EMPTY_FORM = {
//   name: "", category: "Consumable", quantity: "",
//   unit: "pieces", cost_price: "", supplier_name: "",
//   expiry_date: "", low_stock_threshold: "10",
// };

// function Inventory() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [category, setCategory] = useState("All");
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [saving, setSaving] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   // Stock adjust modal
//   const [stockModal, setStockModal] = useState(null); // { item, action: 'add'|'reduce' }
//   const [stockAmount, setStockAmount] = useState("");

// const fetchItems = async () => {
//   try {
//     const url = category !== "All"
//       ? `${API}/inventory/?category=${category}`
//       : "${API}/inventory/";
    
//     const res = await fetch(url);
//     const data = await res.json();

//     // AGAR response sahi hai (200 OK) aur data Array hai, tabhi set karo
//     if (res.ok && Array.isArray(data)) {
//       setItems(data);
//     } else {
//       // Agar backend se error aya (500), to items ko khali array kar do
//       console.error("Backend Error:", data.error);
//       setItems([]); 
//     }
//   } catch (err) {
//     console.error("Network Error:", err);
//     setItems([]);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => { fetchItems(); }, [category]);

//   // ─── Filtered by search ──────────────────────────────────────────────
//   const filtered = items.filter((i) =>
//     i.name.toLowerCase().includes(search.toLowerCase()) ||
//     (i.supplier_name || "").toLowerCase().includes(search.toLowerCase())
//   );

//   // ─── Summary counts ──────────────────────────────────────────────────
//   const allItems = items;
//   const lowStockCount = allItems.filter((i) => i.stock_status === "low" || i.stock_status === "out").length;
//   const expiredCount = allItems.filter((i) => i.expiry_status === "expired").length;
//   const nearExpiryCount = allItems.filter((i) => i.expiry_status === "near").length;

//   // ─── Open Add/Edit ───────────────────────────────────────────────────
//   const openAdd = () => {
//     setEditItem(null);
//     setForm(EMPTY_FORM);
//     setShowModal(true);
//   };

//   const openEdit = (item) => {
//     setEditItem(item);
//     setForm({
//       name: item.name || "",
//       category: item.category || "Consumable",
//       quantity: item.quantity ?? "",
//       unit: item.unit || "pieces",
//       cost_price: item.cost_price || "",
//       supplier_name: item.supplier_name || "",
//       expiry_date: item.expiry_date || "",
//       low_stock_threshold: item.low_stock_threshold ?? "10",
//     });
//     setShowModal(true);
//   };

//   const closeModal = () => { setShowModal(false); setEditItem(null); };

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   // ─── Save item ───────────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!form.name.trim()) return alert("Item name is required.");
//     setSaving(true);
//     try {
//       const url = editItem
//         ? `${API}/inventory/update/${editItem.id}/`
//         : "${API}/inventory/create/";
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (res.ok) { await fetchItems(); closeModal(); }
//       else { const e = await res.json(); alert("Error: " + (e.error || "Unknown")); }
//     } catch { alert("Network error."); }
//     finally { setSaving(false); }
//   };

//   // ─── Delete ──────────────────────────────────────────────────────────
//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${API}/inventory/delete/${id}/`, { method: "POST" });
//       if (res.ok) { await fetchItems(); setDeleteConfirm(null); }
//       else alert("Failed to delete.");
//     } catch { alert("Network error."); }
//   };

//   // ─── Adjust stock ────────────────────────────────────────────────────
//   const handleStockAdjust = async () => {

//   if (!stockModal || !stockModal.item) {
//     alert("Something went wrong");
//     return;
//   }

//   const amount = Number(stockAmount);

//   if (!amount || amount <= 0) {
//     alert("Enter a valid amount.");
//     return;
//   }

//   try {
//     const res = await fetch(
//       `${API}/inventory/adjust/${stockModal.item.id}/`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: stockModal.action,
//           amount: amount,
//         }),
//       }
//     );

//     const data = await res.json(); // 🔥 IMPORTANT

//     if (res.ok) {
//       await fetchItems();
//       setStockModal(null);
//       setStockAmount("");
//     } else {
//       alert("Error: " + (data.error || "Unknown"));
//     }

//   } catch (err) {
//     console.error(err);
//     alert("Network error.");
//   }
// };

//   // ─── Row status classes ──────────────────────────────────────────────
//   const getRowClass = (item) => {
//     if (item.expiry_status === "expired") return "row-expired";
//     if (item.expiry_status === "near") return "row-near-expiry";
//     if (item.stock_status === "out") return "row-out";
//     if (item.stock_status === "low") return "row-low";
//     return "";
//   };

//   return (
//     <div className="inv-container">

//       {/* ── Header ── */}
//       <div className="inv-header">
//         <h2>Inventory</h2>
//         <button className="inv-add-btn" onClick={openAdd}>+ Add Item</button>
//       </div>

//       {/* ── Alert Banner ── */}
//       {(lowStockCount > 0 || expiredCount > 0 || nearExpiryCount > 0) && (
//         <div className="inv-alerts">
//           {lowStockCount > 0 && (
//             <div className="inv-alert low">
//               <span className="inv-alert-icon">⚠</span>
//               <span>{lowStockCount} item{lowStockCount > 1 ? "s" : ""} low / out of stock</span>
//             </div>
//           )}
//           {expiredCount > 0 && (
//             <div className="inv-alert expired">
//               <span className="inv-alert-icon">✕</span>
//               <span>{expiredCount} item{expiredCount > 1 ? "s" : ""} expired</span>
//             </div>
//           )}
//           {nearExpiryCount > 0 && (
//             <div className="inv-alert near">
//               <span className="inv-alert-icon">!</span>
//               <span>{nearExpiryCount} item{nearExpiryCount > 1 ? "s" : ""} expiring within 7 days</span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── Stats ── */}
//       <div className="inv-stats">
//         <div className="inv-stat"><span className="inv-stat-n">{items.length}</span><span className="inv-stat-l">Total Items</span></div>
//         <div className="inv-stat"><span className="inv-stat-n low-n">{lowStockCount}</span><span className="inv-stat-l">Low / Out of Stock</span></div>
//         <div className="inv-stat"><span className="inv-stat-n exp-n">{expiredCount}</span><span className="inv-stat-l">Expired</span></div>
//         <div className="inv-stat"><span className="inv-stat-n near-n">{nearExpiryCount}</span><span className="inv-stat-l">Near Expiry</span></div>
//       </div>

//       {/* ── Toolbar ── */}
//       <div className="inv-toolbar">
//         <input
//           className="inv-search"
//           placeholder="Search item or supplier..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <div className="inv-cat-tabs">
//           {CATEGORIES.map((c) => (
//             <button
//               key={c}
//               className={`inv-cat-btn ${category === c ? "active" : ""}`}
//               onClick={() => setCategory(c)}
//             >{c}</button>
//           ))}
//         </div>
//       </div>

//       {/* ── Legend ── */}
//       <div className="inv-legend">
//         <span className="legend-dot expired-dot" /> Expired
//         <span className="legend-dot near-dot" /> Near Expiry (&lt;7 days)
//         <span className="legend-dot low-dot" /> Low Stock
//         <span className="legend-dot out-dot" /> Out of Stock
//       </div>

//       {/* ── Table ── */}
//       {loading ? (
//         <div className="inv-empty">Loading...</div>
//       ) : filtered.length === 0 ? (
//         <div className="inv-empty">No items found.</div>
//       ) : (
//         <div className="tablecontainer">

//   {/* Header */}
//   <div className="table-header-griddd inv-gridd">
//     <span>ITEM</span>
//     <span>CATEGORY</span>
//     <span>QTY</span>
//     <span>PRICE</span>
//     <span>SUPPLIER</span>
//     <span>EXPIRY</span>
//     <span>STATUS</span>
//     <span>ACTIONS</span>
//   </div>

//   <div className="cards-list">
//     {filtered.map((item, idx) => (
//       <div key={item.id} className="appointment-card-rowww inv-grid">

//         {/* ITEM */}
//         <div className="col-patient">
//           <div className="avatar-box">
//             {item.name?.charAt(0)}
//           </div>
//           <div>
//             <div className="p-name">{item.name}</div>
//             <div className="inv-id-baddge">ID-{String(idx + 1)}</div>
//           </div>
//         </div>

//         {/* CATEGORY */}
//         <div className="col-service">
//           <span className={`service-chip`}>
//             {item.category}
//           </span>
//         </div>

//         {/* QTY */}
//         <div className="col-status">
//           <div className="d-text">
//             {item.quantity} {item.unit}
//           </div>
//         </div>

//         {/* PRICE */}
//         <div className="col-status">
//           <div className="d-text">
//             Rs. {item.cost_price || "—"}
//           </div>
//         </div>

//         {/* SUPPLIER */}
//         <div className="col-status">
//           <div className="d-text">
//             {item.supplier_name || "—"}
//           </div>
//         </div>

//         {/* EXPIRY */}
//         <div className="col-status">
//           <div className={`status-badge ${item.expiry_status}`}>
//             {item.expiry_date || "—"}
//           </div>
//         </div>

//         {/* STATUS */}
//         <div className="col-status">
//           <div className={`status-badge ${item.stock_status}`}>
//             {item.stock_status}
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="col-actions">

//           <button
//             className="btn-icon-round approve"
//             onClick={() => {
//               setStockModal({ item, action: "add" });
//               setStockAmount("");
//             }}
//           >+</button>

//           <button
//             className="btn-icon-round delay"
//             onClick={() => {
//               setStockModal({ item, action: "reduce" });
//               setStockAmount("");
//             }}
//           >−</button>

//           <button
//             className="btn-icon-round view"
//             onClick={() => openEdit(item)}
//           >✎</button>

//           <button
//             className="btn-icon-round delete"
//             onClick={() => setDeleteConfirm(item.id)}
//           >🗑</button>

//         </div>

//       </div>
//     ))}
//   </div>
// </div>
//       )}

//       {/* ── Add/Edit Modal ── */}
//       {showModal && (
//         <>
//           <div className="inv-overlay" onClick={closeModal} />
//           <div className="inv-modal">
//             <h3>{editItem ? `Edit — ${editItem.name}` : "Add New Item"}</h3>
//             <div className="inv-form-grid">
//               <div className="inv-field">
//                 <label>Item Name *</label>
//                 <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Surgical Gloves" />
//               </div>
//               <div className="inv-field">
//                 <label>Category *</label>
//                 <select name="category" value={form.category} onChange={handleChange}>
//                   {["Consumable","Medicine","Equipment","Instrument","Other"].map(c => (
//                     <option key={c}>{c}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="inv-field">
//                 <label>Quantity</label>
//                 <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="0" />
//               </div>
//               <div className="inv-field">
//                 <label>Unit</label>
//                 <select name="unit" value={form.unit} onChange={handleChange}>
//                   {UNITS.map(u => <option key={u}>{u}</option>)}
//                 </select>
//               </div>
//               <div className="inv-field">
//                 <label>Cost Price (Rs.)</label>
//                 <input name="cost_price" type="number" value={form.cost_price} onChange={handleChange} placeholder="0" />
//               </div>
//               <div className="inv-field">
//                 <label>Supplier Name</label>
//                 <input name="supplier_name" value={form.supplier_name} onChange={handleChange} placeholder="e.g. MedCo Supplies" />
//               </div>
//               <div className="inv-field">
//                 <label>Expiry Date</label>
//                 <input name="expiry_date" type="date" value={form.expiry_date} onChange={handleChange} />
//               </div>
//               <div className="inv-field">
//                 <label>Low Stock Alert At</label>
//                 <input name="low_stock_threshold" type="number" value={form.low_stock_threshold} onChange={handleChange} placeholder="10" />
//               </div>
//             </div>
//             <div className="inv-modal-actions">
//               <button className="inv-save-btn" onClick={handleSave} disabled={saving}>
//                 {saving ? "Saving..." : editItem ? "Update Item" : "Add Item"}
//               </button>
//               <button className="inv-cancel-btn" onClick={closeModal}>Cancel</button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── Stock Adjust Modal ── */}
//       {stockModal && (
//         <>
//           <div className="inv-overlay" onClick={() => setStockModal(null)} />
//           <div className="inv-modal inv-stock-modal">
//             <h3>
//               {stockModal.action === "add" ? "Add Stock" : "Reduce Stock"} —{" "}
//               {stockModal.item.name}
//             </h3>
//             <p className="inv-stock-current">
//               Current stock: <strong>{stockModal.item.quantity} {stockModal.item.unit}</strong>
//             </p>
//             <div className="inv-field">
//               <label>Amount to {stockModal.action === "add" ? "Add" : "Use/Reduce"}</label>
//               <input
//                 type="number"
//                 value={stockAmount}
//                 onChange={(e) => setStockAmount(Number(e.target.value))}
//                 placeholder="e.g. 50"
//                 autoFocus
//               />
//             </div>
//             <div className="inv-modal-actions">
//               <button
//                 className={stockModal.action === "add" ? "inv-save-btn" : "inv-reduce-modal-btn"}
//                 onClick={handleStockAdjust}
//               >
//                 {stockModal.action === "add" ? "+ Add Stock" : "− Reduce Stock"}
//               </button>
//               <button className="inv-cancel-btn" onClick={() => setStockModal(null)}>Cancel</button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── Delete Confirm ── */}
//       {deleteConfirm && (
//         <>
//           <div className="inv-overlay" onClick={() => setDeleteConfirm(null)} />
//           <div className="inv-confirm-modal">
//             <h3>Delete this item?</h3>
//             <p>This cannot be undone.</p>
//             <div className="inv-confirm-actions">
//               <button className="inv-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
//               <button className="inv-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Inventory;







import React, { useEffect, useState } from "react";
import "./Inventory.css";
import { API_BASE } from "../api";

const API = API_BASE;

const CATEGORIES = ["All", "Consumable", "Medicine", "Equipment", "Instrument", "Other"];
const UNITS = ["pieces", "boxes", "ml", "mg", "bottles", "packets", "rolls", "pairs"];

const EMPTY_FORM = {
  name: "", category: "Consumable", quantity: "",
  unit: "pieces", cost_price: "", supplier_name: "",
  expiry_date: "", low_stock_threshold: "10",
};

function Inventory({ highlightId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const highlightRef = React.useRef(null);

  // Stock adjust modal
  const [stockModal, setStockModal] = useState(null); // { item, action: 'add'|'reduce' }
  const [stockAmount, setStockAmount]   = useState("");

const fetchItems = async () => {
  try {
    const url = category !== "All"
      ? `${API}/inventory/?category=${category}`
      : `${API}/inventory/`;
    
    const res = await fetch(url);
    const data = await res.json();

    // AGAR response sahi hai (200 OK) aur data Array hai, tabhi set karo
    if (res.ok && Array.isArray(data)) {
      setItems(data);
    } else {
      // Agar backend se error aya (500), to items ko khali array kar do
      console.error("Backend Error:", data.error);
      setItems([]); 
    }
  } catch (err) {
    console.error("Network Error:", err);
    setItems([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchItems(); }, [category]);

  // ─── Handle incoming highlightId from notification click ─────────────
  useEffect(() => {
    if (!highlightId || items.length === 0) return;
    const target = items.find((i) => i.id === highlightId);
    if (!target) return;
    // Clear category filter and search so the item is visible
    setCategory("All");
    setSearch("");
    setActiveHighlight(highlightId);
    // Scroll to the row after render
    setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
    // Remove highlight glow after 3 seconds
    setTimeout(() => setActiveHighlight(null), 3000);
  }, [highlightId, items]);

  // ─── Filtered by search ──────────────────────────────────────────────
  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.supplier_name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ─── Summary counts ──────────────────────────────────────────────────
  const allItems = items;
  const lowStockCount = allItems.filter((i) => i.stock_status === "low" || i.stock_status === "out").length;
  const expiredCount = allItems.filter((i) => i.expiry_status === "expired").length;
  const nearExpiryCount = allItems.filter((i) => i.expiry_status === "near").length;

  // ─── Open Add/Edit ───────────────────────────────────────────────────
  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name || "",
      category: item.category || "Consumable",
      quantity: item.quantity ?? "",
      unit: item.unit || "pieces",
      cost_price: item.cost_price || "",
      supplier_name: item.supplier_name || "",
      expiry_date: item.expiry_date || "",
      low_stock_threshold: item.low_stock_threshold ?? "10",
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ─── Save item ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return alert("Item name is required.");
    setSaving(true);
    try {
      const url = editItem
        ? `${API}/inventory/update/${editItem.id}/`
        : `${API}/inventory/create/`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { await fetchItems(); closeModal(); }
      else { const e = await res.json(); alert("Error: " + (e.error || "Unknown")); }
    } catch { alert("Network error."); }
    finally { setSaving(false); }
  };

  // ─── Delete ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/inventory/delete/${id}/`, { method: "POST" });
      if (res.ok) { await fetchItems(); setDeleteConfirm(null); }
      else alert("Failed to delete.");
    } catch { alert("Network error."); }
  };

  // ─── Adjust stock ────────────────────────────────────────────────────
  const handleStockAdjust = async () => {

  if (!stockModal || !stockModal.item) {
    alert("Something went wrong");
    return;
  }

  const amount = Number(stockAmount);

  if (!amount || amount <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  try {
    const res = await fetch(
      `${API}/inventory/adjust/${stockModal.item.id}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: stockModal.action,
          amount: amount,
        }),
      }
    );

    const data = await res.json(); // 🔥 IMPORTANT

    if (res.ok) {
      await fetchItems();
      setStockModal(null);
      setStockAmount("");
    } else {
      alert("Error: " + (data.error || "Unknown"));
    }

  } catch (err) {
    console.error(err);
    alert("Network error.");
  }
};

  // ─── Row status classes ──────────────────────────────────────────────
  const getRowClass = (item) => {
    if (item.expiry_status === "expired") return "row-expired";
    if (item.expiry_status === "near") return "row-near-expiry";
    if (item.stock_status === "out") return "row-out";
    if (item.stock_status === "low") return "row-low";
    return "";
  };

  return (
    <div className="inv-container">

      {/* ── Header ── */}
      <div className="inv-header">
        <h2>Inventory</h2>
        <button className="inv-add-btn" onClick={openAdd}>+ Add Item</button>
      </div>

      {/* ── Alert Banner ── */}
      {(lowStockCount > 0 || expiredCount > 0 || nearExpiryCount > 0) && (
        <div className="inv-alerts">
          {lowStockCount > 0 && (
            <div className="inv-alert low">
              <span className="inv-alert-icon">⚠</span>
              <span>{lowStockCount} item{lowStockCount > 1 ? "s" : ""} low / out of stock</span>
            </div>
          )}
          {expiredCount > 0 && (
            <div className="inv-alert expired">
              <span className="inv-alert-icon">✕</span>
              <span>{expiredCount} item{expiredCount > 1 ? "s" : ""} expired</span>
            </div>
          )}
          {nearExpiryCount > 0 && (
            <div className="inv-alert near">
              <span className="inv-alert-icon">!</span>
              <span>{nearExpiryCount} item{nearExpiryCount > 1 ? "s" : ""} expiring within 7 days</span>
            </div>
          )}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="inv-stats">
        <div className="inv-stat"><span className="inv-stat-n">{items.length}</span><span className="inv-stat-l">Total Items</span></div>
        <div className="inv-stat"><span className="inv-stat-n low-n">{lowStockCount}</span><span className="inv-stat-l">Low / Out of Stock</span></div>
        <div className="inv-stat"><span className="inv-stat-n exp-n">{expiredCount}</span><span className="inv-stat-l">Expired</span></div>
        <div className="inv-stat"><span className="inv-stat-n near-n">{nearExpiryCount}</span><span className="inv-stat-l">Near Expiry</span></div>
      </div>

      {/* ── Toolbar ── */}
      <div className="inv-toolbar">
        <input
          className="inv-search"
          placeholder="Search item or supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="inv-cat-tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`inv-cat-btn ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="inv-legend">
        <span className="legend-dot expired-dot" /> Expired
        <span className="legend-dot near-dot" /> Near Expiry (&lt;7 days)
        <span className="legend-dot low-dot" /> Low Stock
        <span className="legend-dot out-dot" /> Out of Stock
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="inv-empty">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="inv-empty">No items found.</div>
      ) : (
        <div className="tablecontainer">

  {/* Header */}
  <div className="table-header-griddd inv-gridd">
    <span>ITEM</span>
    <span>CATEGORY</span>
    <span>QTY</span>
    <span>PRICE</span>
    <span>SUPPLIER</span>
    <span>EXPIRY</span>
    <span>STATUS</span>
    <span>ACTIONS</span>
  </div>

  <div className="cards-list">
    {filtered.map((item, idx) => (
      <div
        key={item.id}
        className={`appointment-card-rowww inv-grid${activeHighlight === item.id ? " inv-row-highlight" : ""}`}
        ref={activeHighlight === item.id ? highlightRef : null}
      >

        {/* ITEM */}
        <div className="col-patient">
          <div className="avatar-box">
            {item.name?.charAt(0)}
          </div>
          <div>
            <div className="p-name">{item.name}</div>
            <div className="inv-id-baddge">ID-{String(idx + 1)}</div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="col-service">
          <span className={`service-chip`}>
            {item.category}
          </span>
        </div>

        {/* QTY */}
        <div className="col-status">
          <div className="d-text">
            {item.quantity} {item.unit}
          </div>
        </div>

        {/* PRICE */}
        <div className="col-status">
          <div className="d-text">
            Rs. {item.cost_price || "—"}
          </div>
        </div>

        {/* SUPPLIER */}
        <div className="col-status">
          <div className="d-text">
            {item.supplier_name || "—"}
          </div>
        </div>

        {/* EXPIRY */}
        <div className="col-status">
          <div className={`status-badge ${item.expiry_status}`}>
            {item.expiry_date || "—"}
          </div>
        </div>

        {/* STATUS */}
        <div className="col-status">
          <div className={`status-badge ${item.stock_status}`}>
            {item.stock_status}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="col-actions">

          <button
            className="btn-icon-round approve"
            onClick={() => {
              setStockModal({ item, action: "add" });
              setStockAmount("");
            }}
          >+</button>

          <button
            className="btn-icon-round delay"
            onClick={() => {
              setStockModal({ item, action: "reduce" });
              setStockAmount("");
            }}
          >−</button>

          <button
            className="btn-icon-round view"
            onClick={() => openEdit(item)}
          >✎</button>

          <button
            className="btn-icon-round delete"
            onClick={() => setDeleteConfirm(item.id)}
          >🗑</button>

        </div>

      </div>
    ))}
  </div>
</div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <>
          <div className="inv-overlay" onClick={closeModal} />
          <div className="inv-modal">
            <h3>{editItem ? `Edit — ${editItem.name}` : "Add New Item"}</h3>
            <div className="inv-form-grid">
              <div className="inv-field">
                <label>Item Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Surgical Gloves" />
              </div>
              <div className="inv-field">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {["Consumable","Medicine","Equipment","Instrument","Other"].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="inv-field">
                <label>Quantity</label>
                <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="0" />
              </div>
              <div className="inv-field">
                <label>Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="inv-field">
                <label>Cost Price (Rs.)</label>
                <input name="cost_price" type="number" value={form.cost_price} onChange={handleChange} placeholder="0" />
              </div>
              <div className="inv-field">
                <label>Supplier Name</label>
                <input name="supplier_name" value={form.supplier_name} onChange={handleChange} placeholder="e.g. MedCo Supplies" />
              </div>
              <div className="inv-field">
                <label>Expiry Date</label>
                <input name="expiry_date" type="date" value={form.expiry_date} onChange={handleChange} />
              </div>
              <div className="inv-field">
                <label>Low Stock Alert At</label>
                <input name="low_stock_threshold" type="number" value={form.low_stock_threshold} onChange={handleChange} placeholder="10" />
              </div>
            </div>
            <div className="inv-modal-actions">
              <button className="inv-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editItem ? "Update Item" : "Add Item"}
              </button>
              <button className="inv-cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* ── Stock Adjust Modal ── */}
      {stockModal && (
        <>
          <div className="inv-overlay" onClick={() => setStockModal(null)} />
          <div className="inv-modal inv-stock-modal">
            <h3>
              {stockModal.action === "add" ? "Add Stock" : "Reduce Stock"} —{" "}
              {stockModal.item.name}
            </h3>
            <p className="inv-stock-current">
              Current stock: <strong>{stockModal.item.quantity} {stockModal.item.unit}</strong>
            </p>
            <div className="inv-field">
              <label>Amount to {stockModal.action === "add" ? "Add" : "Use/Reduce"}</label>
              <input
                type="number"
                value={stockAmount}
                onChange={(e) => setStockAmount(Number(e.target.value))}
                placeholder="e.g. 50"
                autoFocus
              />
            </div>
            <div className="inv-modal-actions">
              <button
                className={stockModal.action === "add" ? "inv-save-btn" : "inv-reduce-modal-btn"}
                onClick={handleStockAdjust}
              >
                {stockModal.action === "add" ? "+ Add Stock" : "− Reduce Stock"}
              </button>
              <button className="inv-cancel-btn" onClick={() => setStockModal(null)}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <>
          <div className="inv-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="inv-confirm-modal">
            <h3>Delete this item?</h3>
            <p>This cannot be undone.</p>
            <div className="inv-confirm-actions">
              <button className="inv-delete-btn" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
              <button className="inv-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Inventory;