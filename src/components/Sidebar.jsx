// import React from 'react';
// import logo from "../assets/logo.png";
 
// // ── Crisp SVG icon set — no emojis ──────────────────────────────────────────
// const Icons = {
//   dashboard: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" opacity=".9"/>
//       <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
//       <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
//       <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity=".9"/>
//     </svg>
//   ),
//   appointments: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <rect x="2" y="4" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M6 2v4M14 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//       <path d="M2 8h16" stroke="currentColor" strokeWidth="1.3"/>
//       <circle cx="6.5" cy="13" r="1.2" fill="currentColor"/>
//       <circle cx="10" cy="13" r="1.2" fill="currentColor"/>
//       <circle cx="13.5" cy="13" r="1.2" fill="currentColor"/>
//     </svg>
//   ),
//   services: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <path d="M10 2.5a6.5 6.5 0 016.5 6.5c0 2.2-1.1 4.15-2.8 5.3V17a.8.8 0 01-.8.8H7.1a.8.8 0 01-.8-.8v-2.7A6.5 6.5 0 0110 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
//       <path d="M7.5 17.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//       <path d="M10 6v3l1.8 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   patients: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <circle cx="7.5" cy="6" r="2.8" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M1.5 17.5c0-3.31 2.69-5.5 6-5.5s6 2.19 6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//       <circle cx="14.5" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
//       <path d="M14.5 12c2.1 0 4 1.4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
//     </svg>
//   ),
//   reviews: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <path d="M10 2l2.09 4.26 4.91.71-3.55 3.46.84 4.9L10 13.27l-4.29 2.06.84-4.9L3 6.97l4.91-.71L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity=".15"/>
//     </svg>
//   ),
//   beforeAfter: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <rect x="2" y="4" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
//       <rect x="11" y="4" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M4.5 10.5l1.5 1.5 2-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M13.5 9l1.5 1.5L13.5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   employees: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M2.5 18c0-3.87 3.36-6.5 7.5-6.5s7.5 2.63 7.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//     </svg>
//   ),
//   inventory: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <path d="M3 7l7-4 7 4v9l-7 4-7-4V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
//       <path d="M10 3v14" stroke="currentColor" strokeWidth="1.3"/>
//       <path d="M3 7l7 4 7-4" stroke="currentColor" strokeWidth="1.3"/>
//     </svg>
//   ),
//   suppliers: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <rect x="1.5" y="7" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M12.5 10h2.3l2.7 3.5V16h-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
//       <circle cx="5.5" cy="17.5" r="1.5" fill="currentColor"/>
//       <circle cx="15" cy="17.5" r="1.5" fill="currentColor"/>
//     </svg>
//   ),
//   expenses: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M3.5 14.5l3.5-4 3 3 3.5-5 3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   financialReport: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <rect x="2" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M5.5 7h5M5.5 10h5M5.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
//       <path d="M15 11v3.5l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//       <circle cx="15" cy="15.5" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
//     </svg>
//   ),
//   toothLogo: (
//     <svg viewBox="0 24 24" fill="none">
//       <path d="M8.5 3C6.3 3 4 5 4 8c0 1.8.7 3.2 1.8 4.2L7 19c.3 1.3.9 2 1.8 2 .9 0 1.4-.7 1.8-2.2.5-1.6.8-2.8 2.4-2.8 1.6 0 2 1.2 2.4 2.8.4 1.5.9 2.2 1.8 2.2.9 0 1.5-.7 1.8-2L20 12.2c1.1-1 1.8-2.4 1.8-4.2C21.8 5 19.5 3 17.3 3c-1.4 0-2.3.5-2.8 1C13.8 4.6 13.3 5 12 5c-1.3 0-1.8-.4-2.5-1C8.8 3.5 8 3 8.5 3z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
//     </svg>
//   ),
//   settings: (
//     <svg viewBox="0 0 20 20" fill="none">
//       <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
//       <path d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.4 4.4l1.1 1.1M14.5 14.5l1.1 1.1M4.4 15.6l1.1-1.1M14.5 5.5l1.1-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
//     </svg>
//   ),
// };
 
// const NAV_CATEGORIES = [
//   {
//     key: 'overview',
//     label: 'Overview',
//     items: [
//       { key: 'dashboard',        label: 'Dashboard',       icon: Icons.dashboard },
//     ],
//   },
//   {
//     key: 'clinical',
//     label: 'Clinical',
//     items: [
//       { key: 'appointments',     label: 'Appointments',    icon: Icons.appointments },
//       { key: 'services',         label: 'Services',        icon: Icons.services },
//       { key: 'patients',         label: 'Patients Record', icon: Icons.patients },
//       { key: 'galleryimages',     label: 'Gallery Images',  icon: Icons.beforeAfter },
//       { key: 'reviews',          label: 'Reviews',         icon: Icons.reviews },
//     ],
//   },
//   {
//     key: 'operations',
//     label: 'Operations',
//     items: [
//       { key: 'employees',        label: 'Employees',       icon: Icons.employees },
//       { key: 'inventory',        label: 'Inventory',       icon: Icons.inventory },
//       { key: 'suppliers',        label: 'Suppliers',       icon: Icons.suppliers },
//     ],
//   },
//   {
//     key: 'finance',
//     label: 'Finance',
//     items: [
//       { key: 'expenses',         label: 'Expenses',        icon: Icons.expenses },
//       { key: 'financial-report', label: 'Financial Report',icon: Icons.financialReport },
//     ],
//   },
// ];
 
 
// function Sidebar({ setPage, activePage, user }) {
//   // Clone NAV_CATEGORIES aur filter items based on user
//   const filteredNav = NAV_CATEGORIES.map(cat => {
//     const items = cat.items.filter(item => {
//       const allowedForNormal = [
//         'dashboard',
//         'appointments',
//         'services',
//         'patients',
//         'galleryimages',
//         'reviews',
//         'employees',
//         'inventory',
//         'suppliers',
//         'expenses',
//         'financial-report',
//         'settings' // 1. Yahan settings add kiya takay normal user ko bhi block na kare (optional)
//       ];
//       if (user?.is_superuser) return true;
//       return allowedForNormal.includes(item.key);
//     });
//     return { ...cat, items };
//   });

//   return (
//     <div className="dt-root">
//       <div className="dt-sidebar">

//         {/* Brand */}
//         <div className="dt-brand">
//           <div className="dt-logo">
//             <img src={logo} alt="Logo" className="dt-logo-img" />
//           </div>
//           <div>
//             <div className="dt-brand-name">Dentistree</div>
//             <div className="dt-brand-tag">{user?.is_superuser ? 'Admin Panel' : 'User Panel'}</div>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="dt-nav">
//           {filteredNav.map((cat) => (
//             <div className="dt-group" key={cat.key}>
//               <div className="dt-cat">{cat.label}</div>
//               {cat.items.map((item) => (
//                 <button
//                   key={item.key}
//                   className={`dt-item${activePage === item.key ? ' active' : ''}`}
//                   onClick={() => setPage(item.key)}
//                 >
//                   <span className="dt-icon">{item.icon}</span>
//                   <span className="dt-label">{item.label}</span>
//                 </button>
//               ))}
//             </div>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="dt-footer">
//           <div className="dt-avatar">{user?.username.charAt(0).toUpperCase()}</div>
//           <div>
//             <div className="dt-user-name">{user?.username}</div>
//             <div className="dt-user-role">{user?.is_superuser ? 'Super Admin' : 'User'}</div>
//           </div>
//           {/* 2. Yahan button par onClick aur active class add kiye hain */}
//           <button 
//             className={`dt-settings-btn${activePage === 'settings' ? ' active' : ''}`} 
//             title="Settings"
//             onClick={() => setPage('settings')}
//           >
//             {Icons.settings}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
 
// export default Sidebar;
import React from 'react';
import logo from "../assets/logo.png";

// ── Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="2" fill="currentColor" opacity=".9"/>
      <rect x="11" y="2" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
      <rect x="2" y="11" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
      <rect x="11" y="11" width="7" height="7" rx="2" fill="currentColor" opacity=".9"/>
    </svg>
  ),
  appointments: (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 2v4M14 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="6.5" cy="13" r="1.2" fill="currentColor"/>
      <circle cx="10" cy="13" r="1.2" fill="currentColor"/>
      <circle cx="13.5" cy="13" r="1.2" fill="currentColor"/>
    </svg>
  ),
  services: (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5a6.5 6.5 0 016.5 6.5c0 2.2-1.1 4.15-2.8 5.3V17a.8.8 0 01-.8.8H7.1a.8.8 0 01-.8-.8v-2.7A6.5 6.5 0 0110 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.5 17.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 6v3l1.8 1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  patients: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="7.5" cy="6" r="2.8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 17.5c0-3.31 2.69-5.5 6-5.5s6 2.19 6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14.5" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M14.5 12c2.1 0 4 1.4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  reviews: (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M10 2l2.09 4.26 4.91.71-3.55 3.46.84 4.9L10 13.27l-4.29 2.06.84-4.9L3 6.97l4.91-.71L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity=".15"/>
    </svg>
  ),
  beforeAfter: (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="4" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4.5 10.5l1.5 1.5 2-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 9l1.5 1.5L13.5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  employees: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2.5 18c0-3.87 3.36-6.5 7.5-6.5s7.5 2.63 7.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M3 7l7-4 7 4v9l-7 4-7-4V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 3v14" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M3 7l7 4 7-4" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  suppliers: (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="7" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12.5 10h2.3l2.7 3.5V16h-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="5.5" cy="17.5" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="17.5" r="1.5" fill="currentColor"/>
    </svg>
  ),
  expenses: (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3.5 14.5l3.5-4 3 3 3.5-5 3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  financialReport: (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 7h5M5.5 10h5M5.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="15" cy="15.5" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.4 4.4l1.1 1.1M14.5 14.5l1.1 1.1M4.4 15.6l1.1-1.1M14.5 5.5l1.1-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

const NAV_CATEGORIES = [
  {
    key: 'overview', label: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
    ],
  },
  {
    key: 'clinical', label: 'Clinical',
    items: [
      { key: 'appointments',  label: 'Appointments',    icon: Icons.appointments },
      { key: 'services',      label: 'Services',        icon: Icons.services },
      { key: 'patients',      label: 'Patients Record', icon: Icons.patients },
      { key: 'galleryimages', label: 'Gallery Images',  icon: Icons.beforeAfter },
      { key: 'reviews',       label: 'Reviews',         icon: Icons.reviews },
    ],
  },
  {
    key: 'operations', label: 'Operations',
    items: [
      { key: 'employees',  label: 'Employees',  icon: Icons.employees },
      { key: 'inventory',  label: 'Inventory',  icon: Icons.inventory },
      { key: 'suppliers',  label: 'Suppliers',  icon: Icons.suppliers },
    ],
  },
  {
    key: 'finance', label: 'Finance',
    items: [
      { key: 'expenses',         label: 'Expenses',        icon: Icons.expenses },
      { key: 'financial-report', label: 'Financial Report', icon: Icons.financialReport },
    ],
  },
  {
    key: 'system', label: 'System',
    items: [
      { key: 'settings', label: 'Settings', icon: Icons.settings },
    ],
  },
];

// ── SIDEBAR COMPONENT ────────────────────────────────────────────────────────
function Sidebar({ setPage, activePage, user, onLogout, mobileOpen = false, onNavigated }) {
  const goTo = (key) => {
    setPage(key);
    onNavigated?.();
  };
  const filteredNav = NAV_CATEGORIES.map(cat => {
    const allowed = [
      'dashboard','appointments','services','patients','galleryimages',
      'reviews','employees','inventory','suppliers','expenses',
      'financial-report','settings',
    ];
    const items = cat.items.filter(item =>
      user?.is_superuser ? true : allowed.includes(item.key)
    );
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="dt-root">
      <div className={`dt-sidebar${mobileOpen ? " mobile-open" : ""}`}>

        {/* Brand */}
        <div className="dt-brand">
          <div className="dt-logo">
            <img src={logo} alt="Logo" className="dt-logo-img" />
          </div>
          <div>
            <div className="dt-brand-name">Dentistree</div>
            <div className="dt-brand-tag">{user?.is_superuser ? 'Admin Panel' : 'User Panel'}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="dt-nav">
          {filteredNav.map((cat) => (
            <div className="dt-group" key={cat.key}>
              <div className="dt-cat">{cat.label}</div>
              {cat.items.map((item) => (
                <button
                  key={item.key}
                  className={`dt-item${activePage === item.key ? ' active' : ''}`}
                  onClick={() => goTo(item.key)}
                >
                  <span className="dt-icon">{item.icon}</span>
                  <span className="dt-label">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer — quick settings shortcut (profile lives in top bar) */}
        <div className="dt-footer dt-footer-compact">
          <span className="dt-footer-hint">Dentistree Admin</span>
          <button
            className={`dt-settings-btn${activePage === 'settings' ? ' active' : ''}`}
            title="Settings"
            onClick={() => goTo('settings')}
          >
            {Icons.settings}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;