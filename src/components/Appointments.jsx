import React, { useEffect, useState, useCallback, useRef } from 'react';
import { API_BASE } from '../api';
import './Appointments.css';

const API = API_BASE;

/** Date is already formatted as "01 Jun 2026, 06:00 PM" by the backend (PKT). */
function formatApptDate(raw) {
  if (!raw || raw === '—') return '—';
  return raw;   // backend now sends pre-formatted PKT string — no re-parsing needed
}

function Appointments({ refreshToken = 0, isVisible = true }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const mountedRef = useRef(true);

  const fetchAppointments = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    fetch(`${API}/appointments/`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body) => {
            throw new Error(body?.error || `Server error (${res.status})`);
          });
        }
        return res.json();
      })
      .then((list) => {
        if (!mountedRef.current) return;
        if (Array.isArray(list)) {
          setData(list);
        } else {
          console.error('Backend did not return an array:', list);
          setData([]);
        }
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        console.error('Fetch error:', err);
        if (!silent) setData([]);
      })
      .finally(() => {
        if (!mountedRef.current) return;
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchAppointments();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchAppointments]);

  /** New booking detected by App-level poll (or manual refresh). */
  useEffect(() => {
    if (refreshToken > 0) {
      fetchAppointments(true);
    }
  }, [refreshToken, fetchAppointments]);

  /** When opening this tab, load latest immediately. */
  useEffect(() => {
    if (isVisible) fetchAppointments(true);
  }, [isVisible, fetchAppointments]);

  /** While on this page, refresh every 8s (no full-page loader). */
  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(() => fetchAppointments(true), 8000);
    return () => clearInterval(id);
  }, [isVisible, fetchAppointments]);

  const updateStatus = (id, status) => {
    fetch(`${API}/appointments/update/${id}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(async (res) => {
        const resData = await res.json();
        if (!res.ok) {
          alert(resData.error || 'Action failed');
        } else {
          fetchAppointments(true);
        }
      })
      .catch((err) => console.error('Update error:', err));
  };

  return (
    <div className="appointment-page">
      <div className="header-section">
        <h2 className="main-title">All Appointments</h2>
        <button
          type="button"
          className="appt-refresh-btn"
          onClick={() => fetchAppointments(true)}
          disabled={refreshing}
          title="Refresh list"
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      <div className="tablecontainer">
        <div className="table-header-gridd">
          <span>PATIENT DETAILS</span>
          <span>SERVICE</span>
          <span>DATE & STATUS</span>
          <span className="text-right">ACTIONS</span>
        </div>

        <div className="cards-list">
          {loading && (
            <div className="empty-state">Loading appointments…</div>
          )}

          {!loading && data.length === 0 && (
            <div className="empty-state">No appointments found.</div>
          )}

          {!loading && data.map((item) => (
            <div key={item.id} className="appointment-card-roww">
              <div className="col-patient">
                <div className="avatar-box">
                  {item.patient_name ? item.patient_name.charAt(0) : 'P'}
                </div>
                <div className="patient-text">
                  <div className="p-name">{item.patient_name}</div>
                  <div className="p-sub">
                    ID-{item.patient_serial ?? item.appointment_serial ?? '—'}
                  </div>
                </div>
              </div>

              <div className="col-service">
                <span className="service-chip">{item.service}</span>
              </div>

              <div className="col-status">
                <div className="d-text">{formatApptDate(item.date)}</div>
                <div className={`status-badgee ${item.status.toLowerCase()}`}>
                  {item.status}
                </div>
              </div>

              <div className="col-actions">
                <button
                  title="Approve"
                  disabled={item.status !== 'Pending'}
                  className={`btn-icon-round approve ${item.status !== 'Pending' ? 'btn-disabled' : ''}`}
                  onClick={() => updateStatus(item.id, 'Approved')}
                >
                  <i className="bi bi-check-lg" />
                </button>

                <button
                  title="Delay"
                  disabled={item.status !== 'Pending'}
                  className={`btn-icon-round delay ${item.status !== 'Pending' ? 'btn-disabled' : ''}`}
                  onClick={() => updateStatus(item.id, 'Delay')}
                >
                  <i className="bi bi-clock" />
                </button>

                <button
                  title="View Details"
                  className="btn-icon-round view"
                  onClick={() => setSelectedPatient(item)}
                >
                  <i className="bi bi-eye" />
                </button>

                <button
                  title="Cancel"
                  disabled={item.status !== 'Pending'}
                  className={`btn-icon-round delete ${item.status !== 'Pending' ? 'btn-disabled' : ''}`}
                  onClick={() => updateStatus(item.id, 'Cancelled')}
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-top">
              <button className="close-x" type="button" onClick={() => setSelectedPatient(null)}>
                &times;
              </button>
              <div className="detail-status-pill">
                <span className="dot" />
                {selectedPatient.status}
              </div>
              <div className="detail-avatar">
                {selectedPatient.patient_name.charAt(0)}
              </div>
              <h3>{selectedPatient.patient_name}</h3>
              <p>
                Patient ID &nbsp;#&nbsp;
                {selectedPatient.patient_serial ??
                  selectedPatient.appointment_serial ??
                  selectedPatient.id.slice(-5).toUpperCase()}
              </p>
            </div>

            <div className="modal-body">
              <div className="ref-strip">
                <span className="ref-label">Reference ID</span>
                <code>{selectedPatient.id}</code>
              </div>

              <div className="detail-info-grid">
                <div className="detail-info-card">
                  <div className="ic-icon">🩺</div>
                  <div className="ic-label">Service type</div>
                  <div className="ic-value">{selectedPatient.service}</div>
                </div>
                <div className="detail-info-card">
                  <div className="ic-icon">📅</div>
                  <div className="ic-label">Appointment date</div>
                  <div className="ic-value">{formatApptDate(selectedPatient.date)}</div>
                </div>
                <div className="detail-info-card">
                  <div className="ic-icon">✅</div>
                  <div className="ic-label">Current status</div>
                  <div className={`ic-value ${selectedPatient.status.toLowerCase()}`}>
                    {selectedPatient.status}
                  </div>
                </div>
                <div className="detail-info-card">
                  <div className="ic-icon">📞</div>
                  <div className="ic-label">Phone</div>
                  <div className="ic-value">
                    {selectedPatient.patient_phone || 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="modal-action-row">
                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setSelectedPatient(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
