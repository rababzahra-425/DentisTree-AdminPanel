// import React from 'react';
// import AdminTopbar from './AdminTopbar';

// /**
//  * Wraps all authenticated admin page content with the global top bar
//  * (notifications + profile). Shown on every admin route.
//  */
// export default function AdminLayout({ user, onLogout, setPage, onMenuToggle, children }) {
//   return (
//     <div className="admin-layout">
//       <AdminTopbar
//         user={user}
//         onLogout={onLogout}
//         onNavigate={setPage}
//         onMenuToggle={onMenuToggle}
//       />
//       <div className="admin-layout-body">
//         {children}
//       </div>
//     </div>
//   );
// }






import React from 'react';
import AdminTopbar from './AdminTopbar';

/**
 * Wraps all authenticated admin page content with the global top bar.
 * Navigation (including highlight item ID) is handled in App.jsx via setPage.
 */
export default function AdminLayout({ user, onLogout, setPage, onMenuToggle, children }) {
  return (
    <div className="admin-layout">
      <AdminTopbar
        user={user}
        onLogout={onLogout}
        onNavigate={setPage}
        onMenuToggle={onMenuToggle}
      />
      <div className="admin-layout-body">
        {children}
      </div>
    </div>
  );
}