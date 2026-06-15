// import React, { useState, useRef, useEffect } from 'react';
// import { useTheme } from '../ThemeContext';
// import { API_BASE, authFetch } from '../api';
// import './Settings.css';

// // ─── Icons ──────────────────────────────────────────────────────────────────
// const IcUser   = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 18c0-3.87 3.36-6.5 7.5-6.5s7.5 2.63 7.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
// const IcShield = () => <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l6 2.5v5c0 3.5-2.5 6.5-6 8-3.5-1.5-6-4.5-6-8v-5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
// const IcBell   = () => <svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5A5.5 5.5 0 004.5 8v3.5L3 13h14l-1.5-1.5V8A5.5 5.5 0 0010 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 13v.5a2 2 0 004 0V13" stroke="currentColor" strokeWidth="1.3"/></svg>;
// const IcMoon   = () => <svg viewBox="0 0 20 20" fill="none"><path d="M17.5 11.5A7.5 7.5 0 018.5 2.5a7.5 7.5 0 100 15 7.5 7.5 0 009-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
// const IcLock   = () => <svg viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V7a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
// const IcCamera = () => <svg viewBox="0 0 20 20" fill="none"><path d="M2 6.5A1.5 1.5 0 013.5 5h1.2L6 3h8l1.3 2h1.2A1.5 1.5 0 0118 6.5v9A1.5 1.5 0 0116.5 17h-13A1.5 1.5 0 012 15.5v-9z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.3"/></svg>;
// const IcCheck  = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 10l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
// const IcAlert  = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 7v3M10 13h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
// const IcEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
// const IcEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
// const IcSun    = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
// const IcSave   = () => <svg viewBox="0 0 20 20" fill="none"><path d="M3 4a1 1 0 011-1h9l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 3v4h6V3M7 13h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
// const IcLoader = () => <svg viewBox="0 0 20 20" fill="none" className="spin-icon"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="30" strokeDashoffset="10"/></svg>;

// // ─── Helpers ─────────────────────────────────────────────────────────────────
// function Toggle({ checked, onChange, disabled }) {
//   return (
//     <label className={`st-toggle${disabled ? ' st-toggle-disabled' : ''}`}>
//       <input type="checkbox" checked={checked} onChange={e => !disabled && onChange(e.target.checked)} disabled={disabled} />
//       <span className="st-slider" />
//     </label>
//   );
// }

// function ToggleRow({ label, desc, checked, onChange, last, disabled, loading }) {
//   return (
//     <div className={`st-toggle-row${last ? ' last' : ''}`}>
//       <div className="st-toggle-info">
//         <strong>{label}</strong>
//         {desc && <span>{desc}</span>}
//       </div>
//       {loading ? <IcLoader /> : <Toggle checked={checked} onChange={onChange} disabled={disabled} />}
//     </div>
//   );
// }

// function Toast({ type, msg, onClose }) {
//   if (!msg) return null;
//   return (
//     <div className={`st-toast st-toast-${type}`}>
//       <span className="st-toast-icon">{type === 'success' ? <IcCheck /> : <IcAlert />}</span>
//       <span className="st-toast-msg">{msg}</span>
//       <button className="st-toast-close" onClick={onClose}>✕</button>
//     </div>
//   );
// }

// function PwdInput({ value, onChange, placeholder, id, disabled }) {
//   const [show, setShow] = useState(false);
//   return (
//     <div className="st-pwd-wrap">
//       <input id={id} type={show ? 'text' : 'password'} value={value}
//         onChange={onChange} placeholder={placeholder}
//         autoComplete="new-password" disabled={disabled} />
//       <button type="button" className="st-eye-btn"
//         onClick={() => setShow(s => !s)}
//         aria-label={show ? 'Hide password' : 'Show password'}>
//         {show ? <IcEyeOff /> : <IcEye />}
//       </button>
//     </div>
//   );
// }

// function getStrength(pwd) {
//   if (!pwd) return { pct: 0, label: '', color: '' };
//   let s = 0;
//   if (pwd.length >= 8) s++;
//   if (/[A-Z]/.test(pwd)) s++;
//   if (/[0-9]/.test(pwd)) s++;
//   if (/[^A-Za-z0-9]/.test(pwd)) s++;
//   return [
//     { pct: 15, label: 'Too short',  color: '#ef4444' },
//     { pct: 35, label: 'Weak',       color: '#f97316' },
//     { pct: 60, label: 'Fair',       color: '#eab308' },
//     { pct: 80, label: 'Good',       color: '#22c55e' },
//     { pct: 100, label: 'Strong',    color: '#16a34a' },
//   ][Math.min(s, 4)];
// }

// const TABS = [
//   { id: 'profile',       label: 'Profile',       Icon: IcUser   },
//   { id: 'security',      label: 'Security',      Icon: IcShield },
//   { id: 'appearance',    label: 'Appearance',    Icon: IcMoon   },
//   { id: 'notifications', label: 'Notifications', Icon: IcBell   },
// ];

// // ─── OTP Verification Modal ──────────────────────────────────────────────────
// function OtpModal({ method, onVerified, onCancel, apiBase, showToast }) {
//   const [code, setCode]       = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sent, setSent]       = useState(false);
//   const [error, setError]     = useState('');

//   const sendCode = async () => {
//     setLoading(true); setError('');
//     try {
//       const res = await authFetch('/security/2fa/otp/send/', {
//         method: 'POST',
//         body: JSON.stringify({ method }),
//       });
//       const data = await res.json();
//       if (res.ok) { setSent(true); }
//       else { setError(data.error || 'Failed to send code.'); }
//     } catch { setError('Server unreachable.'); }
//     setLoading(false);
//   };

//   const verifyCode = async () => {
//     if (!code.trim()) { setError('Enter the code.'); return; }
//     setLoading(true); setError('');
//     try {
//       const res = await authFetch('/security/2fa/otp/verify/', {
//         method: 'POST',
//         body: JSON.stringify({ method, code }),
//       });
//       const data = await res.json();
//       if (res.ok && data.verified) { onVerified(); }
//       else { setError(data.error || 'Invalid code.'); }
//     } catch { setError('Server unreachable.'); }
//     setLoading(false);
//   };

//   return (
//     <div className="st-modal-backdrop">
//       <div className="st-modal">
//         <div className="st-modal-header">
//           <IcShield />
//           <span>Verify {method === 'sms' ? 'SMS' : 'Email'} Code</span>
//         </div>
//         <p className="st-modal-body">
//           {sent
//             ? `Enter the 6-digit code sent to your ${method === 'sms' ? 'phone' : 'email'}.`
//             : `We will send a verification code to your ${method === 'sms' ? 'phone number' : 'email address'}.`}
//         </p>
//         {error && <div className="st-modal-error">{error}</div>}
//         {!sent ? (
//           <div className="st-modal-actions">
//             <button className="st-btn st-btn-outline" onClick={onCancel}>Cancel</button>
//             <button className="st-btn st-btn-primary" onClick={sendCode} disabled={loading}>
//               {loading ? <><IcLoader /> Sending…</> : 'Send Code'}
//             </button>
//           </div>
//         ) : (
//           <>
//             <input
//               className="st-otp-input"
//               type="text"
//               maxLength={8}
//               placeholder="000000"
//               value={code}
//               onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
//               autoFocus
//             />
//             <div className="st-modal-actions">
//               <button className="st-btn st-btn-ghost" onClick={() => { setSent(false); setCode(''); }}>
//                 Resend
//               </button>
//               <button className="st-btn st-btn-primary" onClick={verifyCode} disabled={loading}>
//                 {loading ? <><IcLoader /> Verifying…</> : 'Verify'}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── TOTP Setup Modal ────────────────────────────────────────────────────────
// function TotpSetupModal({ apiBase, onSuccess, onCancel, showToast }) {
//   const [step, setStep]     = useState('loading'); // loading | scan | verify
//   const [secret, setSecret] = useState('');
//   const [qr, setQr]         = useState('');
//   const [code, setCode]     = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError]   = useState('');

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await authFetch('/security/2fa/totp/setup/');
//         const data = await res.json();
//         if (res.ok) {
//           setSecret(data.secret);
//           setQr(data.qr_code);
//           setStep('scan');
//         } else {
//           setError(data.error || 'Setup failed.');
//           setStep('error');
//         }
//       } catch { setError('Server unreachable.'); setStep('error'); }
//     })();
//   }, []);

//   const confirmCode = async () => {
//     if (!code.trim()) { setError('Enter the 6-digit code.'); return; }
//     setLoading(true); setError('');
//     try {
//       const res = await authFetch('/security/2fa/totp/verify-setup/', {
//         method: 'POST',
//         body: JSON.stringify({ code }),
//       });
//       const data = await res.json();
//       if (res.ok) { onSuccess(); }
//       else { setError(data.error || 'Invalid code. Try again.'); }
//     } catch { setError('Server unreachable.'); }
//     setLoading(false);
//   };

//   return (
//     <div className="st-modal-backdrop">
//       <div className="st-modal st-modal-wide">
//         <div className="st-modal-header">
//           <IcShield />
//           <span>Set Up Authenticator App</span>
//         </div>

//         {step === 'loading' && <div className="st-modal-body" style={{ textAlign: 'center' }}><IcLoader /> Loading…</div>}

//         {step === 'error' && (
//           <>
//             <div className="st-modal-error">{error}</div>
//             <div className="st-modal-actions">
//               <button className="st-btn st-btn-outline" onClick={onCancel}>Close</button>
//             </div>
//           </>
//         )}

//         {step === 'scan' && (
//           <>
//             <p className="st-modal-body">
//               Scan this QR code with <strong>Google Authenticator</strong> or <strong>Authy</strong>.
//             </p>
//             <div className="st-totp-qr">
//               <img src={`data:image/png;base64,${qr}`} alt="TOTP QR Code" width={180} height={180} />
//             </div>
//             <p className="st-modal-body" style={{ fontSize: '0.82rem', color: '#64748b' }}>
//               Or enter manually: <code className="st-totp-secret">{secret}</code>
//             </p>
//             {error && <div className="st-modal-error">{error}</div>}
//             <div className="st-field" style={{ marginTop: 12 }}>
//               <label>Enter 6-digit code to confirm</label>
//               <input
//                 className="st-otp-input"
//                 type="text"
//                 maxLength={6}
//                 placeholder="123456"
//                 value={code}
//                 onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
//                 autoFocus
//               />
//             </div>
//             <div className="st-modal-actions">
//               <button className="st-btn st-btn-outline" onClick={onCancel}>Cancel</button>
//               <button className="st-btn st-btn-primary" onClick={confirmCode} disabled={loading}>
//                 {loading ? <><IcLoader /> Verifying…</> : 'Activate'}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Delete Account Modal ────────────────────────────────────────────────────
// function DeleteModal({ apiBase, onDeleted, onCancel }) {
//   const [password, setPassword]     = useState('');
//   const [confirmText, setConfirmText] = useState('');
//   const [loading, setLoading]       = useState(false);
//   const [error, setError]           = useState('');
//   const [showPwd, setShowPwd]       = useState(false);

//   const handleDelete = async () => {
//     if (confirmText !== 'DELETE') {
//       setError('Type exactly "DELETE" to confirm.');
//       return;
//     }
//     if (!password) { setError('Password is required.'); return; }

//     setLoading(true); setError('');
//     try {
//       const res = await authFetch('/security/delete-account/', {
//         method: 'POST',
//         body: JSON.stringify({ password, confirm_text: 'DELETE' }),
//       });
//       const data = await res.json();
//       if (res.ok && data.deleted) { onDeleted(); }
//       else { setError(data.error || 'Deletion failed. Please try again.'); }
//     } catch { setError('Server unreachable.'); }
//     setLoading(false);
//   };

//   return (
//     <div className="st-modal-backdrop">
//       <div className="st-modal">
//         <div className="st-modal-header st-modal-header-danger">
//           <IcAlert />
//           <span>Delete Account</span>
//         </div>
//         <p className="st-modal-body">
//           This action is <strong>permanent and irreversible</strong>. All your data will be
//           deleted immediately. This cannot be undone.
//         </p>
//         {error && <div className="st-modal-error">{error}</div>}

//         <div className="st-field" style={{ marginTop: 12 }}>
//           <label>Type <strong>DELETE</strong> to confirm</label>
//           <input type="text" value={confirmText}
//             onChange={e => setConfirmText(e.target.value)}
//             placeholder='Type "DELETE" here'
//             className={confirmText && confirmText !== 'DELETE' ? 'field-error' : ''} />
//         </div>

//         <div className="st-field">
//           <label>Your current password</label>
//           <div className="st-pwd-wrap">
//             <input type={showPwd ? 'text' : 'password'} value={password}
//               onChange={e => setPassword(e.target.value)} placeholder="Password" />
//             <button type="button" className="st-eye-btn" onClick={() => setShowPwd(s => !s)}>
//               {showPwd ? <IcEyeOff /> : <IcEye />}
//             </button>
//           </div>
//         </div>

//         <div className="st-modal-actions">
//           <button className="st-btn st-btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
//           <button
//             className="st-btn st-btn-danger"
//             onClick={handleDelete}
//             disabled={loading || confirmText !== 'DELETE' || !password}>
//             {loading ? <><IcLoader /> Deleting…</> : 'Permanently Delete'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// // ════════════════════════════════════════════════════════════════════════════
// //  MAIN SETTINGS COMPONENT
// // ════════════════════════════════════════════════════════════════════════════
// export default function Settings({ user, apiBase = API_BASE, onProfileUpdate, onLogout }) {
//   const { dark, setDark } = useTheme();
//   const [tab, setTab]       = useState('profile');
//   const [toast, setToast]   = useState({ type: '', msg: '' });
//   const [saving, setSaving] = useState(false);
//   const fileRef             = useRef();

//   // ── Profile state ─────────────────────────────────────────────────────
//   const makeProfile = (u) => ({
//     fullName: u?.full_name  || u?.username || 'Administrator',
//     username: u?.username   || 'admin',
//     email:    u?.email      || '',
//     phone:    u?.phone      || '',
//     clinic:   u?.clinic     || 'Dentistree Clinic',
//     role:     u?.is_superuser ? 'Super Admin' : (u?.role || 'User'),
//   });

//   const [profile, setProfile]           = useState(() => makeProfile(user));
//   const [savedProfile, setSavedProfile] = useState(() => makeProfile(user));
//   const [photoSrc, setPhotoSrc]         = useState(user?.photo || null);
//   const [photoRemoved, setPhotoRemoved] = useState(false);
//   const [profileDirty, setProfileDirty] = useState(false);

//   useEffect(() => {
//     if (user) {
//       const p = makeProfile(user);
//       setProfile(p);
//       setSavedProfile(p);
//       setPhotoSrc(user.photo || null);
//       setPhotoRemoved(false);
//     }
//   }, [user]);

//   const updateField = (key, val) => {
//     setProfile(p => ({ ...p, [key]: val }));
//     setProfileDirty(true);
//   };

//   // ── Password state ────────────────────────────────────────────────────
//   const [curPwd,     setCurPwd]     = useState('');
//   const [newPwd,     setNewPwd]     = useState('');
//   const [confirmPwd, setConfirmPwd] = useState('');
//   const strength = getStrength(newPwd);

//   // ── 2FA state ─────────────────────────────────────────────────────────
//   const [twoFa, setTwoFa] = useState({
//     sms_2fa_enabled:   false,
//     app_2fa_enabled:   false,
//     email_2fa_enabled: false,
//     totp_verified:     false,
//   });
//   const [twoFaLoading, setTwoFaLoading] = useState({ sms: false, app: false, email: false });

//   // Modals
//   const [otpModal,    setOtpModal]    = useState(null);   // null | 'sms' | 'email'
//   const [totpModal,   setTotpModal]   = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);

//   // ── Notifications ─────────────────────────────────────────────────────
//   const [notifs, setNotifs] = useState({
//     newAppointments: true,
//     reminders: true,
//     reviews: false,
//     inventory: true,
//     reports: true,
//   });

//   // ── Fetch notification prefs on notifications tab open ────────────────
//   useEffect(() => {
//     if (tab !== 'notifications') return;
//     (async () => {
//       try {
//         const res = await authFetch('/settings/notifications/');
//         if (res.ok) {
//           const data = await res.json();
//           if (data.notifications) setNotifs(data.notifications);
//         }
//       } catch { /* silent */ }
//     })();
//   }, [tab]);

//   // ── Fetch 2FA status on security tab open ─────────────────────────────
//   useEffect(() => {
//     if (tab !== 'security') return;
//     (async () => {
//       try {
//         const res = await authFetch('/security/2fa/status/');
//         if (res.ok) {
//           const data = await res.json();
//           setTwoFa({
//             sms_2fa_enabled:   data.sms_2fa_enabled,
//             app_2fa_enabled:   data.app_2fa_enabled,
//             email_2fa_enabled: data.email_2fa_enabled,
//             totp_verified:     data.totp_verified,
//           });
//         }
//       } catch { /* silent */ }
//     })();
//   }, [tab]);

//   // ── Toast helpers ─────────────────────────────────────────────────────
//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast({ type: '', msg: '' }), 4000);
//   };

//   // ── Photo ─────────────────────────────────────────────────────────────
//   const handlePhoto = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) { showToast('error', 'File too large. Max 5 MB.'); return; }
//     const reader = new FileReader();
//     reader.onload = ev => {
//       setPhotoSrc(ev.target.result);
//       setPhotoRemoved(false);
//       setProfileDirty(true);
//       showToast('success', 'Photo selected — save profile to apply.');
//     };
//     reader.readAsDataURL(file);
//   };

//   // ── Save Profile ──────────────────────────────────────────────────────
//   const saveProfile = async () => {
//     if (!profile.fullName.trim()) { showToast('error', 'Full name is required.'); return; }
//     if (!profile.username.trim()) { showToast('error', 'Username is required.');  return; }
//     setSaving(true);
//     try {
//       const photoBody = photoRemoved
//         ? { photo: '' }
//         : (photoSrc?.startsWith('data:') ? { photo: photoSrc } : {});

//       const res = await authFetch('/settings/update-profile/', {
//         method: 'POST',
//         body: JSON.stringify({
//           full_name: profile.fullName,
//           username:  profile.username,
//           email:     profile.email,
//           phone:     profile.phone,
//           clinic:    profile.clinic,
//           role:      profile.role,
//           ...photoBody,
//         }),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         const u = data.user || {};
//         const updated = {
//           ...user,
//           full_name: u.full_name ?? profile.fullName,
//           username:  u.username ?? profile.username,
//           email:     u.email ?? profile.email,
//           phone:     u.phone ?? profile.phone,
//           clinic:    u.clinic ?? profile.clinic,
//           role:      u.role ?? profile.role,
//           photo:     u.photo ?? (photoRemoved ? null : photoSrc),
//         };
//         setPhotoSrc(updated.photo || null);
//         setPhotoRemoved(false);
//         setSavedProfile({ ...profile });
//         setProfileDirty(false);
//         onProfileUpdate?.(updated);
//         showToast('success', 'Profile saved successfully!');
//       } else {
//         const e = await res.json().catch(() => ({}));
//         showToast('error', e.detail || e.error || 'Failed to save profile.');
//       }
//     } catch {
//       showToast('error', 'Cannot reach server. Please try again.');
//     } finally { setSaving(false); }
//   };

//   const resetProfile = () => {
//     setProfile({ ...savedProfile });
//     setProfileDirty(false);
//     showToast('success', 'Changes discarded.');
//   };

//   // ── Change Password ───────────────────────────────────────────────────
//   const changePassword = async () => {
//     if (!curPwd)               { showToast('error', 'Current password is required.'); return; }
//     if (newPwd.length < 8)    { showToast('error', 'Password must be at least 8 characters.'); return; }
//     if (!/[A-Z]/.test(newPwd)) { showToast('error', 'Password must have at least one uppercase letter.'); return; }
//     if (!/[0-9]/.test(newPwd)) { showToast('error', 'Password must have at least one number.'); return; }
//     if (!/[^A-Za-z0-9]/.test(newPwd)) { showToast('error', 'Password must have at least one special character.'); return; }
//     if (newPwd !== confirmPwd) { showToast('error', 'New passwords do not match.'); return; }

//     setSaving(true);
//     try {
//       const res = await authFetch('/change-password/', {
//         method: 'POST',
//         body: JSON.stringify({
//           current_password: curPwd,
//           new_password:     newPwd,
//           confirm_password: confirmPwd,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setCurPwd(''); setNewPwd(''); setConfirmPwd('');
//         showToast('success', 'Password changed successfully!');
//       } else if (res.status === 401) {
//         showToast('error', 'Session expired. Please sign in again.');
//         setTimeout(() => onLogout?.(), 1500);
//       } else {
//         showToast('error', data.error || data.detail || 'Failed to change password.');
//       }
//     } catch {
//       showToast('error', 'Cannot reach server. Please try again later.');
//     } finally { setSaving(false); }
//   };

//   // ── Toggle 2FA ────────────────────────────────────────────────────────
//   const toggle2fa = async (method, enabled) => {
//     if (method === 'app' && enabled) {
//       setTotpModal(true);
//       return;
//     }
//     if ((method === 'sms' || method === 'email') && enabled) {
//       setOtpModal(method);
//       return;
//     }

//     setTwoFaLoading(l => ({ ...l, [method]: true }));
//     try {
//       const res = await authFetch('/security/2fa/toggle/', {
//         method: 'POST',
//         body: JSON.stringify({ method, enabled }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setTwoFa(prev => ({
//           ...prev,
//           [`${method}_2fa_enabled`]: enabled,
//           ...(method === 'app' && !enabled ? { totp_verified: false } : {}),
//         }));
//         showToast('success', data.detail || `2FA ${enabled ? 'enabled' : 'disabled'}.`);
//       } else {
//         showToast('error', data.error || 'Failed to update 2FA setting.');
//       }
//     } catch { showToast('error', 'Server unreachable.'); }
//     setTwoFaLoading(l => ({ ...l, [method]: false }));
//   };

//   const onOtpVerified = async (method) => {
//     setOtpModal(null);
//     setTwoFaLoading(l => ({ ...l, [method]: true }));
//     try {
//       const res = await authFetch('/security/2fa/toggle/', {
//         method: 'POST',
//         body: JSON.stringify({ method, enabled: true }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setTwoFa(prev => ({ ...prev, [`${method}_2fa_enabled`]: true }));
//         showToast('success', data.detail || '2FA enabled.');
//       } else {
//         showToast('error', data.error || 'Failed to enable 2FA.');
//       }
//     } catch { showToast('error', 'Server unreachable.'); }
//     setTwoFaLoading(l => ({ ...l, [method]: false }));
//   };

//   const onTotpSuccess = () => {
//     setTotpModal(false);
//     setTwoFa(prev => ({ ...prev, app_2fa_enabled: true, totp_verified: true }));
//     showToast('success', 'Authenticator App 2FA is now active!');
//   };

//   // ── Log Out All Sessions ──────────────────────────────────────────────
//   const logoutAllSessions = async () => {
//     if (!window.confirm('This will sign you out from ALL devices immediately. Continue?')) return;
//     setSaving(true);
//     try {
//       const res = await authFetch('/security/logout-all/', { method: 'POST' });
//       const data = await res.json();
//       if (res.ok) {
//         showToast('success', data.detail || 'All sessions terminated.');
//         setTimeout(() => onLogout?.(), 1500);
//       } else {
//         showToast('error', data.error || 'Failed to log out all sessions.');
//       }
//     } catch { showToast('error', 'Server unreachable.'); }
//     setSaving(false);
//   };

//   const saveAppearance = () => showToast('success', `${dark ? 'Dark' : 'Light'} mode saved!`);

//   const saveNotifs = async () => {
//     setSaving(true);
//     try {
//       const res = await authFetch('/settings/notifications/update/', {
//         method: 'POST',
//         body: JSON.stringify({ notifications: notifs }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         if (data.notifications) setNotifs(data.notifications);
//         showToast('success', data.detail || 'Notification preferences saved!');
//       } else {
//         showToast('error', data.error || 'Failed to save notification preferences.');
//       }
//     } catch {
//       showToast('error', 'Cannot reach server. Please try again.');
//     } finally { setSaving(false); }
//   };

//   const initials = (profile.fullName || 'A').charAt(0).toUpperCase();

//   return (
//     <div className="st-root">
//       {/* Modals */}
//       {otpModal && (
//         <OtpModal
//           method={otpModal}
//           apiBase={apiBase}
//           showToast={showToast}
//           onVerified={() => onOtpVerified(otpModal)}
//           onCancel={() => setOtpModal(null)}
//         />
//       )}
//       {totpModal && (
//         <TotpSetupModal
//           apiBase={apiBase}
//           showToast={showToast}
//           onSuccess={onTotpSuccess}
//           onCancel={() => setTotpModal(false)}
//         />
//       )}
//       {deleteModal && (
//         <DeleteModal
//           apiBase={apiBase}
//           onDeleted={() => {
//             setDeleteModal(false);
//             showToast('success', 'Account deleted.');
//             setTimeout(() => onLogout?.(), 1500);
//           }}
//           onCancel={() => setDeleteModal(false)}
//         />
//       )}

//       {/* Page Header */}
//       <div className="st-page-header">
//         <div>
//           <h1 className="st-page-title">Settings</h1>
//           <p className="st-page-sub">Manage your profile, security, and preferences</p>
//         </div>
//         {tab === 'profile' && (
//           <div className="st-header-actions">
//             <button className="st-btn st-btn-ghost"
//               onClick={resetProfile} disabled={!profileDirty || saving}>Discard</button>
//             <button className={`st-btn st-btn-primary${saving ? ' loading' : ''}`}
//               onClick={saveProfile} disabled={saving}>
//               {saving ? <><IcLoader /> Saving…</> : <><IcSave /> Save Changes</>}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Toast */}
//       <div className="st-toast-area">
//         <Toast type={toast.type} msg={toast.msg} onClose={() => setToast({ type:'', msg:'' })} />
//       </div>

//       {/* Tab Nav */}
//       <div className="st-tab-nav">
//         {TABS.map(t => (
//           <button key={t.id}
//             className={`st-tab-pill${tab === t.id ? ' active' : ''}`}
//             onClick={() => { setTab(t.id); setToast({ type:'', msg:'' }); }}>
//             <span className="st-tab-pill-icon"><t.Icon /></span>
//             <span className="st-tab-pill-label">{t.label}</span>
//           </button>
//         ))}
//       </div>

//       {/* ══ PROFILE ════════════════════════════════════════════════════════ */}
//       {tab === 'profile' && (
//         <div className="st-tab-body">
//           <div className="st-card">
//             <div className="st-section-label">
//               <span className="st-section-icon"><IcCamera /></span>
//               <div>
//                 <div className="st-section-title">Profile Photo</div>
//                 <div className="st-section-sub">JPG or PNG, max 5 MB</div>
//               </div>
//             </div>
//             <div className="st-photo-row">
//               <div className="st-avatar-lg"
//                 onClick={() => fileRef.current.click()}
//                 role="button" tabIndex={0}
//                 onKeyDown={e => e.key === 'Enter' && fileRef.current.click()}>
//                 {photoSrc ? <img src={photoSrc} alt="Profile" /> : <span className="st-avatar-initials">{initials}</span>}
//                 <div className="st-avatar-overlay"><IcCamera /><span className="st-avatar-overlay-text">Change</span></div>
//               </div>
//               <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
//               <div className="st-photo-meta">
//                 <div className="st-photo-name">{profile.fullName}</div>
//                 <div className="st-photo-role">{profile.role}</div>
//                 <div className="st-photo-actions">
//                   <label className="st-btn st-btn-outline st-btn-sm" style={{ cursor: 'pointer' }}>
//                     <IcCamera /> Upload Photo
//                     <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
//                   </label>
//                   {photoSrc && (
//                     <button className="st-btn st-btn-danger st-btn-sm"
//                       onClick={() => {
//                         setPhotoSrc(null);
//                         setPhotoRemoved(true);
//                         setProfileDirty(true);
//                         showToast('success', 'Photo removed — save profile to apply.');
//                       }}>
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="st-card">
//             <div className="st-section-label">
//               <span className="st-section-icon"><IcUser /></span>
//               <div>
//                 <div className="st-section-title">Personal Information</div>
//                 <div className="st-section-sub">Updates are saved to the database and reflected immediately</div>
//               </div>
//             </div>
//             <div className="st-form-grid">
//               {[
//                 { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your full name', req: true },
//                 { id: 'username', label: 'Username',  type: 'text', placeholder: 'username', req: true },
//                 { id: 'email',    label: 'Email Address', type: 'email', placeholder: 'email@example.com' },
//                 { id: 'phone',    label: 'Phone Number',  type: 'tel',   placeholder: '+92 300 0000000' },
//                 { id: 'clinic',   label: 'Clinic Name',   type: 'text',  placeholder: 'Clinic name' },
//                 { id: 'role',     label: 'Role / Designation', type: 'text', placeholder: 'Your role' },
//               ].map(f => (
//                 <div className="st-field" key={f.id}>
//                   <label htmlFor={`st-${f.id}`}>{f.label}{f.req && <span className="req"> *</span>}</label>
//                   <input id={`st-${f.id}`} type={f.type} value={profile[f.id]}
//                     onChange={e => updateField(f.id, e.target.value)}
//                     placeholder={f.placeholder}
//                     className={f.req && !profile[f.id].trim() ? 'field-error' : ''} />
//                   {f.req && !profile[f.id].trim() && <span className="field-hint error">Required</span>}
//                 </div>
//               ))}
//             </div>
//             {profileDirty && (
//               <div className="st-dirty-banner">
//                 <IcAlert />
//                 <span>You have unsaved changes</span>
//                 <div className="st-dirty-actions">
//                   <button className="st-btn st-btn-ghost st-btn-sm" onClick={resetProfile}>Discard</button>
//                   <button className={`st-btn st-btn-primary st-btn-sm${saving ? ' loading' : ''}`}
//                     onClick={saveProfile} disabled={saving}>
//                     {saving ? 'Saving…' : 'Save'}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ══ SECURITY ══════════════════════════════════════════════════════ */}
//       {tab === 'security' && (
//         <div className="st-tab-body">
//           {/* Change Password */}
//           <div className="st-card">
//             <div className="st-section-label">
//               <span className="st-section-icon"><IcLock /></span>
//               <div>
//                 <div className="st-section-title">Change Password</div>
//                 <div className="st-section-sub">At least 8 characters with uppercase, numbers, and symbols</div>
//               </div>
//             </div>
//             <div className="st-pwd-stack">
//               <div className="st-field">
//                 <label htmlFor="curPwd">Current Password</label>
//                 <PwdInput id="curPwd" value={curPwd}
//                   onChange={e => setCurPwd(e.target.value)}
//                   placeholder="Current password" disabled={saving} />
//               </div>
//               <div className="st-field">
//                 <label htmlFor="newPwd">New Password</label>
//                 <PwdInput id="newPwd" value={newPwd}
//                   onChange={e => setNewPwd(e.target.value)}
//                   placeholder="New password" disabled={saving} />
//                 {newPwd && (
//                   <div className="st-strength-wrap">
//                     <div className="st-strength-bar">
//                       <div className="st-strength-fill"
//                         style={{ width: strength.pct + '%', background: strength.color }} />
//                     </div>
//                     <span className="st-strength-label" style={{ color: strength.color }}>{strength.label}</span>
//                   </div>
//                 )}
//               </div>
//               <div className="st-field">
//                 <label htmlFor="confirmPwd">Confirm New Password</label>
//                 <PwdInput id="confirmPwd" value={confirmPwd}
//                   onChange={e => setConfirmPwd(e.target.value)}
//                   placeholder="Confirm new password" disabled={saving} />
//                 {confirmPwd && (
//                   <span className="st-match-label"
//                     style={{ color: newPwd === confirmPwd ? '#16a34a' : '#dc2626' }}>
//                     {newPwd === confirmPwd ? '✓ Passwords match' : '✗ Do not match'}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="st-pwd-rules">
//               {[
//                 { ok: newPwd.length >= 8,          text: 'At least 8 characters' },
//                 { ok: /[A-Z]/.test(newPwd),        text: 'One uppercase letter'  },
//                 { ok: /[0-9]/.test(newPwd),        text: 'One number'            },
//                 { ok: /[^A-Za-z0-9]/.test(newPwd), text: 'One special character' },
//               ].map((r, i) => (
//                 <div key={i} className={`st-pwd-rule${r.ok ? ' met' : ''}`}>
//                   <span className="st-rule-dot" />{r.text}
//                 </div>
//               ))}
//             </div>

//             <button
//               className={`st-btn st-btn-primary${saving ? ' loading' : ''}`}
//               onClick={changePassword} disabled={saving} style={{ marginTop: 8 }}>
//               {saving ? <><IcLoader /> Updating…</> : 'Update Password'}
//             </button>
//           </div>

//           {/* Two-Factor Authentication */}
//           <div className="st-card">
//             <div className="st-section-label">
//               <span className="st-section-icon"><IcShield /></span>
//               <div>
//                 <div className="st-section-title">Two-Factor Authentication</div>
//                 <div className="st-section-sub">Add an extra layer of security to your account</div>
//               </div>
//             </div>

//             <ToggleRow
//               label="SMS Authentication"
//               desc={`Receive a 6-digit code via SMS on every login${!profile.phone ? ' — add a phone number in Profile first' : ''}`}
//               checked={twoFa.sms_2fa_enabled}
//               onChange={v => toggle2fa('sms', v)}
//               loading={twoFaLoading.sms}
//               disabled={!profile.phone && !twoFa.sms_2fa_enabled}
//             />

//             <ToggleRow
//               label="Authenticator App"
//               desc={`Use Google Authenticator or Authy${twoFa.totp_verified ? ' (configured ✓)' : ' — tap to set up'}`}
//               checked={twoFa.app_2fa_enabled}
//               onChange={v => toggle2fa('app', v)}
//               loading={twoFaLoading.app}
//             />

//             <ToggleRow
//               label="Email Verification"
//               desc={`Send a code to your email on each sign-in${!user?.email ? ' — add an email address in Profile first' : ''}`}
//               checked={twoFa.email_2fa_enabled}
//               onChange={v => toggle2fa('email', v)}
//               loading={twoFaLoading.email}
//               disabled={!user?.email && !twoFa.email_2fa_enabled}
//               last
//             />
//           </div>

//           {/* Danger Zone */}
//           <div className="st-card st-card-danger">
//             <div className="st-section-title st-danger-title">Danger Zone</div>
//             <div className="st-section-sub" style={{ marginBottom: 16 }}>
//               Irreversible actions — proceed with extreme caution.
//             </div>

//             <div className="st-danger-row">
//               <div>
//                 <div className="st-danger-label">Log out all sessions</div>
//                 <div className="st-danger-sub">
//                   Immediately signs you out from every device and browser
//                 </div>
//               </div>
//               <button
//                 className="st-btn st-btn-danger st-btn-sm"
//                 onClick={logoutAllSessions}
//                 disabled={saving}>
//                 {saving ? <IcLoader /> : 'Log Out All'}
//               </button>
//             </div>

//             <div className="st-danger-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
//               <div>
//                 <div className="st-danger-label" style={{ color: '#dc2626' }}>Delete Account</div>
//                 <div className="st-danger-sub">
//                   Permanently removes your account and all associated data
//                 </div>
//               </div>
//               <button
//                 className="st-btn st-btn-danger st-btn-sm"
//                 onClick={() => setDeleteModal(true)}>
//                 Delete Account
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══ APPEARANCE ════════════════════════════════════════════════════ */}
//       {tab === 'appearance' && (
//         <div className="st-tab-body">
//           <div className="st-card">
//             <div className="st-section-label">
//               <span className="st-section-icon"><IcMoon /></span>
//               <div>
//                 <div className="st-section-title">Theme Mode</div>
//                 <div className="st-section-sub">Switching immediately applies across the entire application</div>
//               </div>
//             </div>
//             <div className="st-theme-grid">
//               <div className={`st-theme-card${!dark ? ' active' : ''}`} onClick={() => setDark(false)} role="button" tabIndex={0}>
//                 <div className="st-theme-preview st-theme-preview-light">
//                   <div className="tpv-sidebar" /><div className="tpv-body"><div className="tpv-bar" /><div className="tpv-card" /><div className="tpv-card tpv-card-short" /></div>
//                 </div>
//                 <div className="st-theme-footer">
//                   <span className="st-theme-icon-wrap light"><IcSun /></span>
//                   <div><div className="st-theme-name">Light Mode</div><div className="st-theme-desc">Clean white interface</div></div>
//                   {!dark && <span className="st-theme-check">✓</span>}
//                 </div>
//               </div>
//               <div className={`st-theme-card${dark ? ' active' : ''}`} onClick={() => setDark(true)} role="button" tabIndex={0}>
//                 <div className="st-theme-preview st-theme-preview-dark">
//                   <div className="tpv-sidebar dark" /><div className="tpv-body dark"><div className="tpv-bar dark" /><div className="tpv-card dark" /><div className="tpv-card dark tpv-card-short" /></div>
//                 </div>
//                 <div className="st-theme-footer">
//                   <span className="st-theme-icon-wrap dark"><IcMoon /></span>
//                   <div><div className="st-theme-name">Dark Mode</div><div className="st-theme-desc">Easy on the eyes</div></div>
//                   {dark && <span className="st-theme-check">✓</span>}
//                 </div>
//               </div>
//             </div>
//             <div className="st-divider" />
//             <ToggleRow label="Enable Dark Mode" desc="Applies globally — sidebar, tables, modals, inputs, all pages"
//               checked={dark} onChange={setDark} last />
//             <button className={`st-btn st-btn-primary${saving ? ' loading' : ''}`}
//               onClick={saveAppearance} disabled={saving} style={{ marginTop: 20 }}>
//               {saving ? <><IcLoader /> Saving…</> : <><IcSave /> Save Preferences</>}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ══ NOTIFICATIONS ═════════════════════════════════════════════════ */}
//       {tab === 'notifications' && (
//         <div className="st-tab-body">
//           <div className="st-card">
//             <div className="st-section-label">
//               <span className="st-section-icon"><IcBell /></span>
//               <div>
//                 <div className="st-section-title">Admin Panel Notifications</div>
//                 <div className="st-section-sub">
//                   Choose which alerts appear in the notification bell at the top of the admin panel.
//                   No emails are sent — notifications are shown in the dashboard only.
//                 </div>
//               </div>
//             </div>
//             <ToggleRow label="New Appointments"      desc="When a new appointment is booked"              checked={notifs.newAppointments} onChange={v => setNotifs(n=>({...n,newAppointments:v}))} />
//             <ToggleRow label="Appointment Reminders" desc="Alert 1 hour before a patient's appointment today" checked={notifs.reminders}     onChange={v => setNotifs(n=>({...n,reminders:v}))} />
//             <ToggleRow label="New Patient Reviews"   desc="When a patient submits a review"               checked={notifs.reviews}         onChange={v => setNotifs(n=>({...n,reviews:v}))} />
//             <ToggleRow label="Low Inventory"         desc="When stock falls below the minimum threshold"  checked={notifs.inventory}       onChange={v => setNotifs(n=>({...n,inventory:v}))} />
//             <ToggleRow label="Financial Summaries"   desc="Monthly revenue and expense summary at each month end" checked={notifs.reports} onChange={v => setNotifs(n=>({...n,reports:v}))} last />
//           </div>
//           <div className="st-card-actions">
//             <button className={`st-btn st-btn-primary${saving?' loading':''}`} onClick={saveNotifs} disabled={saving}>
//               {saving ? <><IcLoader /> Saving…</> : <><IcSave /> Save Preferences</>}
//             </button>
//             <button className="st-btn st-btn-outline"
//               onClick={() => { setNotifs(n=>Object.fromEntries(Object.keys(n).map(k=>[k,true]))); showToast('success','All enabled!'); }}>
//               Enable All
//             </button>
//             <button className="st-btn st-btn-outline"
//               onClick={() => { setNotifs(n=>Object.fromEntries(Object.keys(n).map(k=>[k,false]))); showToast('success','All disabled.'); }}>
//               Disable All
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { API_BASE, authFetch } from '../api';
import './Settings.css';

// ─── Icons ──────────────────────────────────────────────────────────────────
const IcUser   = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 18c0-3.87 3.36-6.5 7.5-6.5s7.5 2.63 7.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcShield = () => <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l6 2.5v5c0 3.5-2.5 6.5-6 8-3.5-1.5-6-4.5-6-8v-5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
const IcBell   = () => <svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5A5.5 5.5 0 004.5 8v3.5L3 13h14l-1.5-1.5V8A5.5 5.5 0 0010 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 13v.5a2 2 0 004 0V13" stroke="currentColor" strokeWidth="1.3"/></svg>;
const IcMoon   = () => <svg viewBox="0 0 20 20" fill="none"><path d="M17.5 11.5A7.5 7.5 0 018.5 2.5a7.5 7.5 0 100 15 7.5 7.5 0 009-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
const IcLock   = () => <svg viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V7a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcCamera = () => <svg viewBox="0 0 20 20" fill="none"><path d="M2 6.5A1.5 1.5 0 013.5 5h1.2L6 3h8l1.3 2h1.2A1.5 1.5 0 0118 6.5v9A1.5 1.5 0 0116.5 17h-13A1.5 1.5 0 012 15.5v-9z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.3"/></svg>;
const IcCheck  = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 10l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcAlert  = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 7v3M10 13h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IcSun    = () => <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcSave   = () => <svg viewBox="0 0 20 20" fill="none"><path d="M3 4a1 1 0 011-1h9l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 3v4h6V3M7 13h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
const IcLoader = () => <svg viewBox="0 0 20 20" fill="none" className="spin-icon"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="30" strokeDashoffset="10"/></svg>;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <label className={`st-toggle${disabled ? ' st-toggle-disabled' : ''}`}>
      <input type="checkbox" checked={checked} onChange={e => !disabled && onChange(e.target.checked)} disabled={disabled} />
      <span className="st-slider" />
    </label>
  );
}

function ToggleRow({ label, desc, checked, onChange, last, disabled, loading }) {
  return (
    <div className={`st-toggle-row${last ? ' last' : ''}`}>
      <div className="st-toggle-info">
        <strong>{label}</strong>
        {desc && <span>{desc}</span>}
      </div>
      {loading ? <IcLoader /> : <Toggle checked={checked} onChange={onChange} disabled={disabled} />}
    </div>
  );
}

function Toast({ type, msg, onClose }) {
  if (!msg) return null;
  return (
    <div className={`st-toast st-toast-${type}`}>
      <span className="st-toast-icon">{type === 'success' ? <IcCheck /> : <IcAlert />}</span>
      <span className="st-toast-msg">{msg}</span>
      <button className="st-toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

function PwdInput({ value, onChange, placeholder, id, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div className="st-pwd-wrap">
      <input id={id} type={show ? 'text' : 'password'} value={value}
        onChange={onChange} placeholder={placeholder}
        autoComplete="new-password" disabled={disabled} />
      <button type="button" className="st-eye-btn"
        onClick={() => setShow(s => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <IcEyeOff /> : <IcEye />}
      </button>
    </div>
  );
}

function getStrength(pwd) {
  if (!pwd) return { pct: 0, label: '', color: '' };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return [
    { pct: 15, label: 'Too short',  color: '#ef4444' },
    { pct: 35, label: 'Weak',       color: '#f97316' },
    { pct: 60, label: 'Fair',       color: '#eab308' },
    { pct: 80, label: 'Good',       color: '#22c55e' },
    { pct: 100, label: 'Strong',    color: '#16a34a' },
  ][Math.min(s, 4)];
}

const TABS = [
  { id: 'profile',       label: 'Profile',       Icon: IcUser   },
  { id: 'security',      label: 'Security',      Icon: IcShield },
  { id: 'appearance',    label: 'Appearance',    Icon: IcMoon   },
  { id: 'notifications', label: 'Notifications', Icon: IcBell   },
];

// ─── Delete Account Modal ────────────────────────────────────────────────────
function DeleteModal({ apiBase, onDeleted, onCancel }) {
  const [password, setPassword]       = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [showPwd, setShowPwd]         = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Type exactly "DELETE" to confirm.');
      return;
    }
    if (!password) { setError('Password is required.'); return; }

    setLoading(true); setError('');
    try {
      const res = await authFetch('/security/delete-account/', {
        method: 'POST',
        body: JSON.stringify({ password, confirm_text: 'DELETE' }),
      });
      const data = await res.json();
      if (res.ok && data.deleted) { onDeleted(); }
      else { setError(data.error || 'Deletion failed. Please try again.'); }
    } catch { setError('Server unreachable.'); }
    setLoading(false);
  };

  return (
    <div className="st-modal-backdrop">
      <div className="st-modal">
        <div className="st-modal-header st-modal-header-danger">
          <IcAlert />
          <span>Delete Account</span>
        </div>
        <p className="st-modal-body">
          This action is <strong>permanent and irreversible</strong>. All your data will be
          deleted immediately. This cannot be undone.
        </p>
        {error && <div className="st-modal-error">{error}</div>}

        <div className="st-field" style={{ marginTop: 12 }}>
          <label>Type <strong>DELETE</strong> to confirm</label>
          <input type="text" value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder='Type "DELETE" here'
            className={confirmText && confirmText !== 'DELETE' ? 'field-error' : ''} />
        </div>

        <div className="st-field">
          <label>Your current password</label>
          <div className="st-pwd-wrap">
            <input type={showPwd ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="button" className="st-eye-btn" onClick={() => setShowPwd(s => !s)}>
              {showPwd ? <IcEyeOff /> : <IcEye />}
            </button>
          </div>
        </div>

        <div className="st-modal-actions">
          <button className="st-btn st-btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
          <button
            className="st-btn st-btn-danger"
            onClick={handleDelete}
            disabled={loading || confirmText !== 'DELETE' || !password}>
            {loading ? <><IcLoader /> Deleting…</> : 'Permanently Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
//  MAIN SETTINGS COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function Settings({ user, apiBase = API_BASE, onProfileUpdate, onLogout }) {
  const { dark, setDark } = useTheme();
  const [tab, setTab]       = useState('profile');
  const [toast, setToast]   = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);
  const fileRef             = useRef();

  // ── Profile state ─────────────────────────────────────────────────────
  const makeProfile = (u) => ({
    fullName: u?.full_name  || u?.username || 'Administrator',
    username: u?.username   || 'admin',
    email:    u?.email      || '',
    phone:    u?.phone      || '',
    clinic:   u?.clinic     || 'Dentistree Clinic',
    role:     u?.is_superuser ? 'Super Admin' : (u?.role || 'User'),
  });

  const [profile, setProfile]           = useState(() => makeProfile(user));
  const [savedProfile, setSavedProfile] = useState(() => makeProfile(user));
  const [photoSrc, setPhotoSrc]         = useState(user?.photo || null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [profileDirty, setProfileDirty] = useState(false);

  useEffect(() => {
    if (user) {
      const p = makeProfile(user);
      setProfile(p);
      setSavedProfile(p);
      setPhotoSrc(user.photo || null);
      setPhotoRemoved(false);
    }
  }, [user]);

  const updateField = (key, val) => {
    setProfile(p => ({ ...p, [key]: val }));
    setProfileDirty(true);
  };

  // ── Password state ────────────────────────────────────────────────────
  const [curPwd,     setCurPwd]     = useState('');
  const [newPwd,     setNewPwd]     = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const strength = getStrength(newPwd);

  // ── Delete modal ──────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState(false);

  // ── Notifications ─────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    newAppointments: true,
    reminders: true,
    reviews: false,
    inventory: true,
    reports: true,
  });

  // ── Fetch notification prefs on notifications tab open ────────────────
  useEffect(() => {
    if (tab !== 'notifications') return;
    (async () => {
      try {
        const res = await authFetch('/settings/notifications/');
        if (res.ok) {
          const data = await res.json();
          if (data.notifications) setNotifs(data.notifications);
        }
      } catch { /* silent */ }
    })();
  }, [tab]);

  // ── Toast helpers ─────────────────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: '', msg: '' }), 4000);
  };

  // ── Photo ─────────────────────────────────────────────────────────────
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'File too large. Max 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotoSrc(ev.target.result);
      setPhotoRemoved(false);
      setProfileDirty(true);
      showToast('success', 'Photo selected — save profile to apply.');
    };
    reader.readAsDataURL(file);
  };

  // ── Save Profile ──────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!profile.fullName.trim()) { showToast('error', 'Full name is required.'); return; }
    if (!profile.username.trim()) { showToast('error', 'Username is required.');  return; }
    setSaving(true);
    try {
      const photoBody = photoRemoved
        ? { photo: '' }
        : (photoSrc?.startsWith('data:') ? { photo: photoSrc } : {});

      const res = await authFetch('/settings/update-profile/', {
        method: 'POST',
        body: JSON.stringify({
          full_name: profile.fullName,
          username:  profile.username,
          email:     profile.email,
          phone:     profile.phone,
          clinic:    profile.clinic,
          role:      profile.role,
          ...photoBody,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.user || {};
        const updated = {
          ...user,
          full_name: u.full_name ?? profile.fullName,
          username:  u.username ?? profile.username,
          email:     u.email ?? profile.email,
          phone:     u.phone ?? profile.phone,
          clinic:    u.clinic ?? profile.clinic,
          role:      u.role ?? profile.role,
          photo:     u.photo ?? (photoRemoved ? null : photoSrc),
        };
        setPhotoSrc(updated.photo || null);
        setPhotoRemoved(false);
        setSavedProfile({ ...profile });
        setProfileDirty(false);
        onProfileUpdate?.(updated);
        showToast('success', 'Profile saved successfully!');
      } else {
        const e = await res.json().catch(() => ({}));
        showToast('error', e.detail || e.error || 'Failed to save profile.');
      }
    } catch {
      showToast('error', 'Cannot reach server. Please try again.');
    } finally { setSaving(false); }
  };

  const resetProfile = () => {
    setProfile({ ...savedProfile });
    setProfileDirty(false);
    showToast('success', 'Changes discarded.');
  };

  // ── Change Password ───────────────────────────────────────────────────
  const changePassword = async () => {
    if (!curPwd)               { showToast('error', 'Current password is required.'); return; }
    if (newPwd.length < 8)    { showToast('error', 'Password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(newPwd)) { showToast('error', 'Password must have at least one uppercase letter.'); return; }
    if (!/[0-9]/.test(newPwd)) { showToast('error', 'Password must have at least one number.'); return; }
    if (!/[^A-Za-z0-9]/.test(newPwd)) { showToast('error', 'Password must have at least one special character.'); return; }
    if (newPwd !== confirmPwd) { showToast('error', 'New passwords do not match.'); return; }

    setSaving(true);
    try {
      const res = await authFetch('/change-password/', {
        method: 'POST',
        body: JSON.stringify({
          current_password: curPwd,
          new_password:     newPwd,
          confirm_password: confirmPwd,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurPwd(''); setNewPwd(''); setConfirmPwd('');
        showToast('success', 'Password changed successfully!');
      } else if (res.status === 401) {
        showToast('error', 'Session expired. Please sign in again.');
        setTimeout(() => onLogout?.(), 1500);
      } else {
        showToast('error', data.error || data.detail || 'Failed to change password.');
      }
    } catch {
      showToast('error', 'Cannot reach server. Please try again later.');
    } finally { setSaving(false); }
  };

  // ── Log Out All Sessions ──────────────────────────────────────────────
  const logoutAllSessions = async () => {
    if (!window.confirm('This will sign you out from ALL devices immediately. Continue?')) return;
    setSaving(true);
    try {
      const res = await authFetch('/security/logout-all/', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast('success', data.detail || 'All sessions terminated.');
        setTimeout(() => onLogout?.(), 1500);
      } else {
        showToast('error', data.error || 'Failed to log out all sessions.');
      }
    } catch { showToast('error', 'Server unreachable.'); }
    setSaving(false);
  };

  const saveAppearance = () => showToast('success', `${dark ? 'Dark' : 'Light'} mode saved!`);

  const saveNotifs = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/settings/notifications/update/', {
        method: 'POST',
        body: JSON.stringify({ notifications: notifs }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.notifications) setNotifs(data.notifications);
        showToast('success', data.detail || 'Notification preferences saved!');
      } else {
        showToast('error', data.error || 'Failed to save notification preferences.');
      }
    } catch {
      showToast('error', 'Cannot reach server. Please try again.');
    } finally { setSaving(false); }
  };

  const initials = (profile.fullName || 'A').charAt(0).toUpperCase();

  return (
    <div className="st-root">
      {/* Modals */}
      {deleteModal && (
        <DeleteModal
          apiBase={apiBase}
          onDeleted={() => {
            setDeleteModal(false);
            showToast('success', 'Account deleted.');
            setTimeout(() => onLogout?.(), 1500);
          }}
          onCancel={() => setDeleteModal(false)}
        />
      )}

      {/* Page Header */}
      <div className="st-page-header">
        <div>
          <h1 className="st-page-title">Settings</h1>
          <p className="st-page-sub">Manage your profile, security, and preferences</p>
        </div>
        {tab === 'profile' && (
          <div className="st-header-actions">
            <button className="st-btn st-btn-ghost"
              onClick={resetProfile} disabled={!profileDirty || saving}>Discard</button>
            <button className={`st-btn st-btn-primary${saving ? ' loading' : ''}`}
              onClick={saveProfile} disabled={saving}>
              {saving ? <><IcLoader /> Saving…</> : <><IcSave /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className="st-toast-area">
        <Toast type={toast.type} msg={toast.msg} onClose={() => setToast({ type:'', msg:'' })} />
      </div>

      {/* Tab Nav */}
      <div className="st-tab-nav">
        {TABS.map(t => (
          <button key={t.id}
            className={`st-tab-pill${tab === t.id ? ' active' : ''}`}
            onClick={() => { setTab(t.id); setToast({ type:'', msg:'' }); }}>
            <span className="st-tab-pill-icon"><t.Icon /></span>
            <span className="st-tab-pill-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ══ PROFILE ════════════════════════════════════════════════════════ */}
      {tab === 'profile' && (
        <div className="st-tab-body">
          <div className="st-card">
            <div className="st-section-label">
              <span className="st-section-icon"><IcCamera /></span>
              <div>
                <div className="st-section-title">Profile Photo</div>
                <div className="st-section-sub">JPG or PNG, max 5 MB</div>
              </div>
            </div>
            <div className="st-photo-row">
              <div className="st-avatar-lg"
                onClick={() => fileRef.current.click()}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && fileRef.current.click()}>
                {photoSrc ? <img src={photoSrc} alt="Profile" /> : <span className="st-avatar-initials">{initials}</span>}
                <div className="st-avatar-overlay"><IcCamera /><span className="st-avatar-overlay-text">Change</span></div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
              <div className="st-photo-meta">
                <div className="st-photo-name">{profile.fullName}</div>
                <div className="st-photo-role">{profile.role}</div>
                <div className="st-photo-actions">
                  <label className="st-btn st-btn-outline st-btn-sm" style={{ cursor: 'pointer' }}>
                    <IcCamera /> Upload Photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                  </label>
                  {photoSrc && (
                    <button className="st-btn st-btn-danger st-btn-sm"
                      onClick={() => {
                        setPhotoSrc(null);
                        setPhotoRemoved(true);
                        setProfileDirty(true);
                        showToast('success', 'Photo removed — save profile to apply.');
                      }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="st-card">
            <div className="st-section-label">
              <span className="st-section-icon"><IcUser /></span>
              <div>
                <div className="st-section-title">Personal Information</div>
                <div className="st-section-sub">Updates are saved to the database and reflected immediately</div>
              </div>
            </div>
            <div className="st-form-grid">
              {[
                { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your full name', req: true },
                { id: 'username', label: 'Username',  type: 'text', placeholder: 'username', req: true },
                { id: 'email',    label: 'Email Address', type: 'email', placeholder: 'email@example.com' },
                { id: 'phone',    label: 'Phone Number',  type: 'tel',   placeholder: '+92 300 0000000' },
                { id: 'clinic',   label: 'Clinic Name',   type: 'text',  placeholder: 'Clinic name' },
                { id: 'role',     label: 'Role / Designation', type: 'text', placeholder: 'Your role' },
              ].map(f => (
                <div className="st-field" key={f.id}>
                  <label htmlFor={`st-${f.id}`}>{f.label}{f.req && <span className="req"> *</span>}</label>
                  <input id={`st-${f.id}`} type={f.type} value={profile[f.id]}
                    onChange={e => updateField(f.id, e.target.value)}
                    placeholder={f.placeholder}
                    className={f.req && !profile[f.id].trim() ? 'field-error' : ''} />
                  {f.req && !profile[f.id].trim() && <span className="field-hint error">Required</span>}
                </div>
              ))}
            </div>
            {profileDirty && (
              <div className="st-dirty-banner">
                <IcAlert />
                <span>You have unsaved changes</span>
                <div className="st-dirty-actions">
                  <button className="st-btn st-btn-ghost st-btn-sm" onClick={resetProfile}>Discard</button>
                  <button className={`st-btn st-btn-primary st-btn-sm${saving ? ' loading' : ''}`}
                    onClick={saveProfile} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ SECURITY ══════════════════════════════════════════════════════ */}
      {tab === 'security' && (
        <div className="st-tab-body">
          {/* Change Password */}
          <div className="st-card">
            <div className="st-section-label">
              <span className="st-section-icon"><IcLock /></span>
              <div>
                <div className="st-section-title">Change Password</div>
                <div className="st-section-sub">At least 8 characters with uppercase, numbers, and symbols</div>
              </div>
            </div>
            <div className="st-pwd-stack">
              <div className="st-field">
                <label htmlFor="curPwd">Current Password</label>
                <PwdInput id="curPwd" value={curPwd}
                  onChange={e => setCurPwd(e.target.value)}
                  placeholder="Current password" disabled={saving} />
              </div>
              <div className="st-field">
                <label htmlFor="newPwd">New Password</label>
                <PwdInput id="newPwd" value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="New password" disabled={saving} />
                {newPwd && (
                  <div className="st-strength-wrap">
                    <div className="st-strength-bar">
                      <div className="st-strength-fill"
                        style={{ width: strength.pct + '%', background: strength.color }} />
                    </div>
                    <span className="st-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>
              <div className="st-field">
                <label htmlFor="confirmPwd">Confirm New Password</label>
                <PwdInput id="confirmPwd" value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Confirm new password" disabled={saving} />
                {confirmPwd && (
                  <span className="st-match-label"
                    style={{ color: newPwd === confirmPwd ? '#16a34a' : '#dc2626' }}>
                    {newPwd === confirmPwd ? '✓ Passwords match' : '✗ Do not match'}
                  </span>
                )}
              </div>
            </div>

            <div className="st-pwd-rules">
              {[
                { ok: newPwd.length >= 8,          text: 'At least 8 characters' },
                { ok: /[A-Z]/.test(newPwd),        text: 'One uppercase letter'  },
                { ok: /[0-9]/.test(newPwd),        text: 'One number'            },
                { ok: /[^A-Za-z0-9]/.test(newPwd), text: 'One special character' },
              ].map((r, i) => (
                <div key={i} className={`st-pwd-rule${r.ok ? ' met' : ''}`}>
                  <span className="st-rule-dot" />{r.text}
                </div>
              ))}
            </div>

            <button
              className={`st-btn st-btn-primary${saving ? ' loading' : ''}`}
              onClick={changePassword} disabled={saving} style={{ marginTop: 8 }}>
              {saving ? <><IcLoader /> Updating…</> : 'Update Password'}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="st-card st-card-danger">
            <div className="st-section-title st-danger-title">Danger Zone</div>
            <div className="st-section-sub" style={{ marginBottom: 16 }}>
              Irreversible actions — proceed with extreme caution.
            </div>

            <div className="st-danger-row">
              <div>
                <div className="st-danger-label">Log out all sessions</div>
                <div className="st-danger-sub">
                  Immediately signs you out from every device and browser
                </div>
              </div>
              <button
                className="st-btn st-btn-danger st-btn-sm"
                onClick={logoutAllSessions}
                disabled={saving}>
                {saving ? <IcLoader /> : 'Log Out All'}
              </button>
            </div>

            <div className="st-danger-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div>
                <div className="st-danger-label" style={{ color: '#dc2626' }}>Delete Account</div>
                <div className="st-danger-sub">
                  Permanently removes your account and all associated data
                </div>
              </div>
              <button
                className="st-btn st-btn-danger st-btn-sm"
                onClick={() => setDeleteModal(true)}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ APPEARANCE ════════════════════════════════════════════════════ */}
      {tab === 'appearance' && (
        <div className="st-tab-body">
          <div className="st-card">
            <div className="st-section-label">
              <span className="st-section-icon"><IcMoon /></span>
              <div>
                <div className="st-section-title">Theme Mode</div>
                <div className="st-section-sub">Switching immediately applies across the entire application</div>
              </div>
            </div>
            <div className="st-theme-grid">
              <div className={`st-theme-card${!dark ? ' active' : ''}`} onClick={() => setDark(false)} role="button" tabIndex={0}>
                <div className="st-theme-preview st-theme-preview-light">
                  <div className="tpv-sidebar" /><div className="tpv-body"><div className="tpv-bar" /><div className="tpv-card" /><div className="tpv-card tpv-card-short" /></div>
                </div>
                <div className="st-theme-footer">
                  <span className="st-theme-icon-wrap light"><IcSun /></span>
                  <div><div className="st-theme-name">Light Mode</div><div className="st-theme-desc">Clean white interface</div></div>
                  {!dark && <span className="st-theme-check">✓</span>}
                </div>
              </div>
              <div className={`st-theme-card${dark ? ' active' : ''}`} onClick={() => setDark(true)} role="button" tabIndex={0}>
                <div className="st-theme-preview st-theme-preview-dark">
                  <div className="tpv-sidebar dark" /><div className="tpv-body dark"><div className="tpv-bar dark" /><div className="tpv-card dark" /><div className="tpv-card dark tpv-card-short" /></div>
                </div>
                <div className="st-theme-footer">
                  <span className="st-theme-icon-wrap dark"><IcMoon /></span>
                  <div><div className="st-theme-name">Dark Mode</div><div className="st-theme-desc">Easy on the eyes</div></div>
                  {dark && <span className="st-theme-check">✓</span>}
                </div>
              </div>
            </div>
            <div className="st-divider" />
            <ToggleRow label="Enable Dark Mode" desc="Applies globally — sidebar, tables, modals, inputs, all pages"
              checked={dark} onChange={setDark} last />
            <button className={`st-btn st-btn-primary${saving ? ' loading' : ''}`}
              onClick={saveAppearance} disabled={saving} style={{ marginTop: 20 }}>
              {saving ? <><IcLoader /> Saving…</> : <><IcSave /> Save Preferences</>}
            </button>
          </div>
        </div>
      )}

      {/* ══ NOTIFICATIONS ═════════════════════════════════════════════════ */}
      {tab === 'notifications' && (
        <div className="st-tab-body">
          <div className="st-card">
            <div className="st-section-label">
              <span className="st-section-icon"><IcBell /></span>
              <div>
                <div className="st-section-title">Admin Panel Notifications</div>
                <div className="st-section-sub">
                  Choose which alerts appear in the notification bell at the top of the admin panel.
                  No emails are sent — notifications are shown in the dashboard only.
                </div>
              </div>
            </div>
            <ToggleRow label="New Appointments"      desc="When a new appointment is booked"              checked={notifs.newAppointments} onChange={v => setNotifs(n=>({...n,newAppointments:v}))} />
            <ToggleRow label="Appointment Reminders" desc="Alert 1 hour before a patient's appointment today" checked={notifs.reminders}     onChange={v => setNotifs(n=>({...n,reminders:v}))} />
            <ToggleRow label="New Patient Reviews"   desc="When a patient submits a review"               checked={notifs.reviews}         onChange={v => setNotifs(n=>({...n,reviews:v}))} />
            <ToggleRow label="Low Inventory"         desc="When stock falls below the minimum threshold"  checked={notifs.inventory}       onChange={v => setNotifs(n=>({...n,inventory:v}))} />
            <ToggleRow label="Financial Summaries"   desc="Monthly revenue and expense summary at each month end" checked={notifs.reports} onChange={v => setNotifs(n=>({...n,reports:v}))} last />
          </div>
          <div className="st-card-actions">
            <button className={`st-btn st-btn-primary${saving?' loading':''}`} onClick={saveNotifs} disabled={saving}>
              {saving ? <><IcLoader /> Saving…</> : <><IcSave /> Save Preferences</>}
            </button>
            <button className="st-btn st-btn-outline"
              onClick={() => { setNotifs(n=>Object.fromEntries(Object.keys(n).map(k=>[k,true]))); showToast('success','All enabled!'); }}>
              Enable All
            </button>
            <button className="st-btn st-btn-outline"
              onClick={() => { setNotifs(n=>Object.fromEntries(Object.keys(n).map(k=>[k,false]))); showToast('success','All disabled.'); }}>
              Disable All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}