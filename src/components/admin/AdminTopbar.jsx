// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { authFetch } from '../../api';
// import './AdminTopbar.css';

// const IcBell = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
//     <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
//     <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
//   </svg>
// );

// const IcChevron = () => (
//   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
//     <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const TYPE_META = {
//   new_appointment:    { icon: '📅', label: 'Appointment' },
//   appointment_reminder: { icon: '⏰', label: 'Reminder' },
//   review:             { icon: '⭐', label: 'Review' },
//   inventory:          { icon: '📦', label: 'Inventory' },
//   financial_report:   { icon: '📊', label: 'Finance' },
//   system_alert:       { icon: '🔔', label: 'System' },
//   staff_update:       { icon: '👤', label: 'Staff' },
//   supplier_invoice:   { icon: '🧾', label: 'Supplier' },
// };

// function timeAgo(iso) {
//   if (!iso) return '';
//   const diff = Date.now() - new Date(iso).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return 'Just now';
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `${days}d ago`;
//   return new Date(iso).toLocaleDateString();
// }

// const IcMenu = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
//     <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
//   </svg>
// );

// export default function AdminTopbar({ user, onLogout, onNavigate, onMenuToggle }) {
//   const [notifOpen, setNotifOpen]   = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loadingNotifs, setLoadingNotifs] = useState(false);

//   const notifRef = useRef(null);
//   const profileRef = useRef(null);

//   const displayName = user?.full_name || user?.username || 'Administrator';
//   const displayRole = user?.is_superuser ? 'Super Admin' : (user?.role || 'Admin');
//   const avatarInitial = displayName.charAt(0).toUpperCase();
//   const avatarPhoto = user?.photo || null;

//   const closeAll = () => {
//     setNotifOpen(false);
//     setProfileOpen(false);
//   };

//   const fetchNotifications = useCallback(async (silent = false) => {
//     if (!silent) setLoadingNotifs(true);
//     try {
//       const res = await authFetch('/notifications/feed/?limit=50');
//       if (res.ok) {
//         const data = await res.json();
//         setNotifications(data.notifications || []);
//         setUnreadCount(data.unread_count ?? 0);
//       }
//     } catch { /* offline */ }
//     finally { if (!silent) setLoadingNotifs(false); }
//   }, []);

//   const fetchUnreadOnly = useCallback(async () => {
//     try {
//       const res = await authFetch('/notifications/unread-count/');
//       if (res.ok) {
//         const data = await res.json();
//         setUnreadCount(data.unread_count ?? 0);
//       }
//     } catch { /* silent */ }
//   }, []);

//   useEffect(() => {
//     fetchNotifications(true);
//     const interval = setInterval(() => fetchUnreadOnly(), 30000);
//     return () => clearInterval(interval);
//   }, [fetchNotifications, fetchUnreadOnly]);

//   useEffect(() => {
//     if (notifOpen) fetchNotifications();
//   }, [notifOpen, fetchNotifications]);

//   useEffect(() => {
//     const onDocClick = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setNotifOpen(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false);
//       }
//     };
//     const onEsc = (e) => { if (e.key === 'Escape') closeAll(); };
//     document.addEventListener('mousedown', onDocClick);
//     document.addEventListener('keydown', onEsc);
//     return () => {
//       document.removeEventListener('mousedown', onDocClick);
//       document.removeEventListener('keydown', onEsc);
//     };
//   }, []);

//   const handleMarkAllRead = async () => {
//     try {
//       const res = await authFetch('/notifications/mark-all-read/', { method: 'POST' });
//       if (res.ok) {
//         setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
//         setUnreadCount(0);
//       }
//     } catch { /* silent */ }
//   };

//   const handleNotifClick = async (notif) => {
//     if (!notif.is_read) {
//       try {
//         await authFetch(`/notifications/${notif.id}/read/`, { method: 'POST' });
//         setNotifications(prev =>
//           prev.map(n => (n.id === notif.id ? { ...n, is_read: true } : n))
//         );
//         setUnreadCount(c => Math.max(0, c - 1));
//       } catch { /* silent */ }
//     }
//     closeAll();
//     if (notif.link_page && onNavigate) onNavigate(notif.link_page);
//   };

//   const handleNotifDelete = async (e, notif) => {
//     e.stopPropagation(); // prevent triggering handleNotifClick
//     try {
//       const res = await authFetch(`/notifications/${notif.id}/delete/`, { method: 'POST' });
//       if (res.ok) {
//         setNotifications(prev => prev.filter(n => n.id !== notif.id));
//         if (!notif.is_read) setUnreadCount(c => Math.max(0, c - 1));
//       }
//     } catch { /* silent */ }
//   };

//   const handleSignOut = async () => {
//     closeAll();
//     try {
//       await authFetch('/auth/logout/', { method: 'POST' });
//     } catch { /* still clear local session */ }
//     onLogout?.();
//   };

//   return (
//     <header className="admin-topbar">
//       <div className="admin-topbar-inner">
//         <style>
// {`
// @media (max-width: 768px) {
//     [class*="-topbar"], [class*="-header-row"], [class*="-page-header"], .admin-topbar-inner {
//       flex-direction: row;
//       align-items: center !important;
//       gap: 12px;
//    }
// }
// `}
// </style>
//         {onMenuToggle && (
//           <button
//             type="button"
//             className="admin-topbar-menu-btn"
//             onClick={onMenuToggle}
//             aria-label="Open navigation menu"
//           >
//             <IcMenu />
//           </button>
//         )}
//         <div className="admin-topbar-spacer" />

//         <div className="admin-topbar-actions">
//           {/* Notifications */}
//           <div className="admin-topbar-dropdown" ref={notifRef}>
//             <button
//               type="button"
//               className={`admin-topbar-icon-btn${notifOpen ? ' active' : ''}`}
//               onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
//               aria-label="Notifications"
//               aria-expanded={notifOpen}
//             >
//               <IcBell />
//               {unreadCount > 0 && (
//                 <span className="admin-topbar-badge">
//                   {unreadCount > 99 ? '99+' : unreadCount}
//                 </span>
//               )}
//             </button>

//             <div className={`admin-panel admin-notif-panel${notifOpen ? ' open' : ''}`} role="dialog" aria-label="Notifications">
//               <div className="admin-panel-header">
//                 <div>
//                   <h3>Notifications</h3>
//                   <p>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
//                 </div>
//                 {unreadCount > 0 && (
//                   <button type="button" className="admin-panel-link" onClick={handleMarkAllRead}>
//                     Mark all read
//                   </button>
//                 )}
//               </div>

//               <div className="admin-notif-list">
//                 {loadingNotifs && notifications.length === 0 && (
//                   <div className="admin-notif-empty">Loading…</div>
//                 )}
//                 {!loadingNotifs && notifications.length === 0 && (
//                   <div className="admin-notif-empty">
//                     <span className="admin-notif-empty-icon">🔔</span>
//                     <strong>No notifications</strong>
//                     <span>You're all caught up. New alerts will appear here.</span>
//                   </div>
//                 )}
//                 {notifications.map(n => {
//                   const meta = TYPE_META[n.type] || { icon: '🔔', label: 'Alert' };
//                   return (
//                     <div key={n.id} className="admin-notif-item-wrapper">
//                       <button
//                         type="button"
//                         className={`admin-notif-item${n.is_read ? '' : ' unread'}`}
//                         onClick={() => handleNotifClick(n)}
//                       >
//                         <span className="admin-notif-item-icon">{meta.icon}</span>
//                         <span className="admin-notif-item-body">
//                           <span className="admin-notif-item-title">{n.title}</span>
//                           {n.message && <span className="admin-notif-item-msg">{n.message}</span>}
//                           <span className="admin-notif-item-meta">
//                             <span className="admin-notif-tag">{meta.label}</span>
//                             <span>{timeAgo(n.created_at)}</span>
//                           </span>
//                         </span>
//                         {!n.is_read && <span className="admin-notif-dot" aria-hidden />}
//                       </button>
//                       <button
//                         type="button"
//                         className="admin-notif-dismiss"
//                         onClick={(e) => handleNotifDelete(e, n)}
//                         aria-label="Dismiss notification"
//                         title="Dismiss"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Profile */}
//           <div className="admin-topbar-dropdown" ref={profileRef}>
//             <button
//               type="button"
//               className={`admin-topbar-profile${profileOpen ? ' active' : ''}`}
//               onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
//               aria-label="Account menu"
//               aria-expanded={profileOpen}
//             >
//               <span className="admin-topbar-avatar">
//                 {avatarPhoto
//                   ? <img src={avatarPhoto} alt="" />
//                   : avatarInitial}
//               </span>
//               <span className="admin-topbar-profile-text">
//                 <span className="admin-topbar-name">{displayName}</span>
//                 <span className="admin-topbar-role">{displayRole}</span>
//               </span>
//               <span className="admin-topbar-chevron"><IcChevron /></span>
//             </button>

//             <div className={`admin-panel admin-profile-panel${profileOpen ? ' open' : ''}`} role="menu">
//               <div className="admin-profile-head">
//                 <span className="admin-profile-avatar-lg">
//                   {avatarPhoto
//                     ? <img src={avatarPhoto} alt="" />
//                     : avatarInitial}
//                 </span>
//                 <div>
//                   <div className="admin-profile-name">{displayName}</div>
//                   <div className="admin-profile-role">{displayRole}</div>
//                 </div>
//               </div>
//               <div className="admin-profile-divider" />
//               <button
//                 type="button"
//                 className="admin-profile-menu-item"
//                 role="menuitem"
//                 onClick={() => { closeAll(); onNavigate?.('settings'); }}
//               >
//                 <span>⚙️</span> Settings
//               </button>
//               <button
//                 type="button"
//                 className="admin-profile-menu-item danger"
//                 role="menuitem"
//                 onClick={handleSignOut}
//               >
//                 <span>↪</span> Sign Out
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { authFetch } from '../../api';
import './AdminTopbar.css';

const IcBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
  </svg>
);

const IcChevron = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TYPE_META = {
  new_appointment:    { icon: '📅', label: 'Appointment' },
  appointment_reminder: { icon: '⏰', label: 'Reminder' },
  review:             { icon: '⭐', label: 'Review' },
  inventory:          { icon: '📦', label: 'Inventory' },
  financial_report:   { icon: '📊', label: 'Finance' },
  system_alert:       { icon: '🔔', label: 'System' },
  staff_update:       { icon: '👤', label: 'Staff' },
  supplier_invoice:   { icon: '🧾', label: 'Supplier' },
};

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const IcMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
  </svg>
);

export default function AdminTopbar({ user, onLogout, onNavigate, onMenuToggle }) {
  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const displayName = user?.full_name || user?.username || 'Administrator';
  const displayRole = user?.is_superuser ? 'Super Admin' : (user?.role || 'Admin');
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarPhoto = user?.photo || null;

  const closeAll = () => {
    setNotifOpen(false);
    setProfileOpen(false);
  };

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoadingNotifs(true);
    try {
      const res = await authFetch('/notifications/feed/?limit=50');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count ?? 0);
      }
    } catch { /* offline */ }
    finally { if (!silent) setLoadingNotifs(false); }
  }, []);

  const fetchUnreadOnly = useCallback(async () => {
    try {
      const res = await authFetch('/notifications/unread-count/');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unread_count ?? 0);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => fetchUnreadOnly(), 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadOnly]);

  useEffect(() => {
    if (notifOpen) fetchNotifications();
  }, [notifOpen, fetchNotifications]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onEsc = (e) => { if (e.key === 'Escape') closeAll(); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await authFetch('/notifications/mark-all-read/', { method: 'POST' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch { /* silent */ }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await authFetch(`/notifications/${notif.id}/read/`, { method: 'POST' });
        setNotifications(prev =>
          prev.map(n => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount(c => Math.max(0, c - 1));
      } catch { /* silent */ }
    }
    closeAll();
    if (notif.link_page && onNavigate) {
      // Pass item_id as second arg so the target page can highlight the record
      onNavigate(notif.link_page, notif.link_item_id || null);
    }
  };

  const handleNotifDelete = async (e, notif) => {
    e.stopPropagation(); // prevent triggering handleNotifClick
    try {
      const res = await authFetch(`/notifications/${notif.id}/delete/`, { method: 'POST' });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
        if (!notif.is_read) setUnreadCount(c => Math.max(0, c - 1));
      }
    } catch { /* silent */ }
  };

  const handleSignOut = async () => {
    closeAll();
    try {
      await authFetch('/auth/logout/', { method: 'POST' });
    } catch { /* still clear local session */ }
    onLogout?.();
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <style>
{`
@media (max-width: 768px) {
    [class*="-topbar"], [class*="-header-row"], [class*="-page-header"], .admin-topbar-inner {
      flex-direction: row;
      align-items: center !important;
      gap: 12px;
   }
}
`}
</style>
        {onMenuToggle && (
          <button
            type="button"
            className="admin-topbar-menu-btn"
            onClick={onMenuToggle}
            aria-label="Open navigation menu"
          >
            <IcMenu />
          </button>
        )}
        <div className="admin-topbar-spacer" />

        <div className="admin-topbar-actions">
          {/* Notifications */}
          <div className="admin-topbar-dropdown" ref={notifRef}>
            <button
              type="button"
              className={`admin-topbar-icon-btn${notifOpen ? ' active' : ''}`}
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
              aria-label="Notifications"
              aria-expanded={notifOpen}
            >
              <IcBell />
              {unreadCount > 0 && (
                <span className="admin-topbar-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <div className={`admin-panel admin-notif-panel${notifOpen ? ' open' : ''}`} role="dialog" aria-label="Notifications">
              <div className="admin-panel-header">
                <div>
                  <h3>Notifications</h3>
                  <p>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
                </div>
                {unreadCount > 0 && (
                  <button type="button" className="admin-panel-link" onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="admin-notif-list">
                {loadingNotifs && notifications.length === 0 && (
                  <div className="admin-notif-empty">Loading…</div>
                )}
                {!loadingNotifs && notifications.length === 0 && (
                  <div className="admin-notif-empty">
                    <span className="admin-notif-empty-icon">🔔</span>
                    <strong>No notifications</strong>
                    <span>You're all caught up. New alerts will appear here.</span>
                  </div>
                )}
                {notifications.map(n => {
                  const meta = TYPE_META[n.type] || { icon: '🔔', label: 'Alert' };
                  return (
                    <div key={n.id} className="admin-notif-item-wrapper">
                      <button
                        type="button"
                        className={`admin-notif-item${n.is_read ? '' : ' unread'}`}
                        onClick={() => handleNotifClick(n)}
                      >
                        <span className="admin-notif-item-icon">{meta.icon}</span>
                        <span className="admin-notif-item-body">
                          <span className="admin-notif-item-title">{n.title}</span>
                          {n.message && <span className="admin-notif-item-msg">{n.message}</span>}
                          <span className="admin-notif-item-meta">
                            <span className="admin-notif-tag">{meta.label}</span>
                            <span>{timeAgo(n.created_at)}</span>
                          </span>
                        </span>
                        {!n.is_read && <span className="admin-notif-dot" aria-hidden />}
                      </button>
                      <button
                        type="button"
                        className="admin-notif-dismiss"
                        onClick={(e) => handleNotifDelete(e, n)}
                        aria-label="Dismiss notification"
                        title="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="admin-topbar-dropdown" ref={profileRef}>
            <button
              type="button"
              className={`admin-topbar-profile${profileOpen ? ' active' : ''}`}
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
              aria-label="Account menu"
              aria-expanded={profileOpen}
            >
              <span className="admin-topbar-avatar">
                {avatarPhoto
                  ? <img src={avatarPhoto} alt="" />
                  : avatarInitial}
              </span>
              <span className="admin-topbar-profile-text">
                <span className="admin-topbar-name">{displayName}</span>
                <span className="admin-topbar-role">{displayRole}</span>
              </span>
              <span className="admin-topbar-chevron"><IcChevron /></span>
            </button>

            <div className={`admin-panel admin-profile-panel${profileOpen ? ' open' : ''}`} role="menu">
              <div className="admin-profile-head">
                <span className="admin-profile-avatar-lg">
                  {avatarPhoto
                    ? <img src={avatarPhoto} alt="" />
                    : avatarInitial}
                </span>
                <div>
                  <div className="admin-profile-name">{displayName}</div>
                  <div className="admin-profile-role">{displayRole}</div>
                </div>
              </div>
              <div className="admin-profile-divider" />
              <button
                type="button"
                className="admin-profile-menu-item"
                role="menuitem"
                onClick={() => { closeAll(); onNavigate?.('settings'); }}
              >
                <span>⚙️</span> Settings
              </button>
              <button
                type="button"
                className="admin-profile-menu-item danger"
                role="menuitem"
                onClick={handleSignOut}
              >
                <span>↪</span> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}