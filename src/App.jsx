// import React, { useState, useEffect, useRef } from "react";
// import { ThemeProvider } from "./ThemeContext";
// import Login from "./components/Logiin";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./components/Dashboard";
// import Appointments from "./components/Appointments";
// import Services from "./components/Services";
// import Patients from "./components/Patients";
// import Reviews from "./components/Reviews";
// import Employees from "./components/Employees";
// import Inventory from "./components/Inventory";
// import Suppliers from "./components/Suppliers";
// import Expenses from "./components/Expenses";
// import FinancialReport from "./components/FinancialReport";
// import GalleryImages from "./components/Galleryimages";
// import Settings from "./components/Settings";
// import AdminLayout from "./components/admin/AdminLayout";
// import { API_BASE, ensureCsrf, fetchCurrentUser } from "./api";
// import "./App.css";
// import "./theme.css";
// import "./admin-responsive.css";

// function App() {
//   const [loggedIn, setLoggedIn]   = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [user, setUser]           = useState(null);
//   const [page, setPage]           = useState("dashboard");
//   const [booting, setBooting]     = useState(true);
//   const [apptRefreshToken, setApptRefreshToken] = useState(0);
//   const [dashRefreshToken, setDashRefreshToken] = useState(0);
//   const [patientsRefreshToken, setPatientsRefreshToken] = useState(0);
//   const apptVersionRef = useRef("");
//   const dashVersionRef = useRef("");
//   const patientsVersionRef = useRef("");

//   /** Lightweight polls — refresh lists when data changes (new bookings, patients, etc.). */
//   useEffect(() => {
//     if (!loggedIn) return;

//     const poll = async () => {
//       try {
//         const [apptRes, dashRes, patRes] = await Promise.all([
//           fetch(`${API_BASE}/appointments/poll/`),
//           fetch(`${API_BASE}/dashboard/poll/`),
//           fetch(`${API_BASE}/patients/poll/`),
//         ]);

//         if (apptRes.ok) {
//           const v = (await apptRes.json()).version || "";
//           if (apptVersionRef.current && v !== apptVersionRef.current) {
//             setApptRefreshToken((t) => t + 1);
//           }
//           apptVersionRef.current = v;
//         }

//         if (dashRes.ok) {
//           const v = (await dashRes.json()).version || "";
//           if (dashVersionRef.current && v !== dashVersionRef.current) {
//             setDashRefreshToken((t) => t + 1);
//           }
//           dashVersionRef.current = v;
//         }

//         if (patRes.ok) {
//           const v = (await patRes.json()).version || "";
//           if (patientsVersionRef.current && v !== patientsVersionRef.current) {
//             setPatientsRefreshToken((t) => t + 1);
//           }
//           patientsVersionRef.current = v;
//         }
//       } catch {
//         /* server offline */
//       }
//     };

//     poll();
//     const interval = setInterval(poll, 8000);
//     return () => clearInterval(interval);
//   }, [loggedIn]);

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       await ensureCsrf();
//       const sessionUser = await fetchCurrentUser();

//       if (cancelled) return;

//       if (sessionUser) {
//         setUser(sessionUser);
//         setLoggedIn(true);
//         localStorage.setItem("dt-user", JSON.stringify(sessionUser));
//       } else {
//         localStorage.removeItem("dt-user");
//       }
//       setBooting(false);
//     })();

//     return () => { cancelled = true; };
//   }, []);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setLoggedIn(true);
//     localStorage.setItem("dt-user", JSON.stringify(userData));
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setLoggedIn(false);
//     localStorage.removeItem("dt-user");
//     setPage("dashboard");
//   };

//   const handleProfileUpdate = (updatedUser) => {
//     setUser(updatedUser);
//     localStorage.setItem("dt-user", JSON.stringify(updatedUser));
//   };

//   if (booting) {
//     return (
//       <ThemeProvider>
//         <div className="login-page-wrapper" style={{ minHeight: "100vh" }}>
//           <p style={{ textAlign: "center", color: "#64748b" }}>Loading…</p>
//         </div>
//       </ThemeProvider>
//     );
//   }

//   if (!loggedIn) {
//     return (
//       <ThemeProvider>
//         <Login onLogin={handleLogin} apiBase={API_BASE} />
//       </ThemeProvider>
//     );
//   }

//   return (
//     <ThemeProvider>
//       <div className="app-container">
//         <div
//           className={`sidebar-overlay${sidebarOpen ? " active" : ""}`}
//           onClick={() => setSidebarOpen(false)}
//           aria-hidden="true"
//         />
//         <Sidebar
//           activePage={page}
//           setPage={setPage}
//           user={user}
//           onLogout={handleLogout}
//           mobileOpen={sidebarOpen}
//           onNavigated={() => setSidebarOpen(false)}
//         />
//         <div className="main-content">
//           <AdminLayout
//             user={user}
//             onLogout={handleLogout}
//             setPage={setPage}
//             onMenuToggle={() => setSidebarOpen((o) => !o)}
//           >
//             <div
//               className="admin-page-slot"
//               style={{ display: page === "dashboard" ? "block" : "none" }}
//               aria-hidden={page !== "dashboard"}
//             >
//               <Dashboard refreshToken={dashRefreshToken} isVisible={page === "dashboard"} />
//             </div>
//             <div
//               className="admin-page-slot"
//               style={{ display: page === "appointments" ? "block" : "none" }}
//               aria-hidden={page !== "appointments"}
//             >
//               <Appointments refreshToken={apptRefreshToken} isVisible={page === "appointments"} />
//             </div>
//             {page === "services"         && <Services />}
//             <div
//               className="admin-page-slot"
//               style={{ display: page === "patients" ? "block" : "none" }}
//               aria-hidden={page !== "patients"}
//             >
//               <Patients refreshToken={patientsRefreshToken} isVisible={page === "patients"} />
//             </div>
//             {page === "galleryimages"    && <GalleryImages />}
//             {page === "reviews"          && <Reviews />}
//             {page === "employees"        && <Employees />}
//             {page === "inventory"        && <Inventory />}
//             {page === "suppliers"        && <Suppliers />}
//             {page === "expenses"         && <Expenses />}
//             {page === "financial-report" && <FinancialReport />}
//             {page === "settings"         && (
//               <Settings
//                 user={user}
//                 apiBase={API_BASE}
//                 onProfileUpdate={handleProfileUpdate}
//                 onLogout={handleLogout}
//               />
//             )}
//           </AdminLayout>
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;




import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "./ThemeContext";
import Login from "./components/Logiin";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Appointments from "./components/Appointments";
import Services from "./components/Services";
import Patients from "./components/Patients";
import Reviews from "./components/Reviews";
import Employees from "./components/Employees";
import Inventory from "./components/Inventory";
import Suppliers from "./components/Suppliers";
import Expenses from "./components/Expenses";
import FinancialReport from "./components/FinancialReport";
import GalleryImages from "./components/Galleryimages";
import Settings from "./components/Settings";
import AdminLayout from "./components/admin/AdminLayout";
import { API_BASE, ensureCsrf, fetchCurrentUser } from "./api";
import "./App.css";
import "./Theme.css";
import "./admin-responsive.css";

function App() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser]           = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [highlightId, setHighlightId] = useState(null);
  const [booting, setBooting]     = useState(true);
  const [apptRefreshToken, setApptRefreshToken] = useState(0);
  const [dashRefreshToken, setDashRefreshToken] = useState(0);
  const [patientsRefreshToken, setPatientsRefreshToken] = useState(0);
  const apptVersionRef = useRef("");
  const dashVersionRef = useRef("");
  const patientsVersionRef = useRef("");

  /** Lightweight polls — refresh lists when data changes (new bookings, patients, etc.). */
  useEffect(() => {
    if (!loggedIn) return;

    const poll = async () => {
      try {
        const [apptRes, dashRes, patRes] = await Promise.all([
          fetch(`${API_BASE}/appointments/poll/`),
          fetch(`${API_BASE}/dashboard/poll/`),
          fetch(`${API_BASE}/patients/poll/`),
        ]);

        if (apptRes.ok) {
          const v = (await apptRes.json()).version || "";
          if (apptVersionRef.current && v !== apptVersionRef.current) {
            setApptRefreshToken((t) => t + 1);
          }
          apptVersionRef.current = v;
        }

        if (dashRes.ok) {
          const v = (await dashRes.json()).version || "";
          if (dashVersionRef.current && v !== dashVersionRef.current) {
            setDashRefreshToken((t) => t + 1);
          }
          dashVersionRef.current = v;
        }

        if (patRes.ok) {
          const v = (await patRes.json()).version || "";
          if (patientsVersionRef.current && v !== patientsVersionRef.current) {
            setPatientsRefreshToken((t) => t + 1);
          }
          patientsVersionRef.current = v;
        }
      } catch {
        /* server offline */
      }
    };

    poll();
    const interval = setInterval(poll, 8000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await ensureCsrf();
      const sessionUser = await fetchCurrentUser();

      if (cancelled) return;

      if (sessionUser) {
        setUser(sessionUser);
        setLoggedIn(true);
        localStorage.setItem("dt-user", JSON.stringify(sessionUser));
      } else {
        localStorage.removeItem("dt-user");
      }
      setBooting(false);
    })();

    return () => { cancelled = true; };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
    localStorage.setItem("dt-user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem("dt-user");
    setPage("dashboard");
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("dt-user", JSON.stringify(updatedUser));
  };

  // Used by AdminTopbar — navigates to a page and optionally highlights a record
  const handleNavigate = (targetPage, itemId = null) => {
    setHighlightId(itemId);
    setPage(targetPage);
  };

  if (booting) {
    return (
      <ThemeProvider>
        <div className="login-page-wrapper" style={{ minHeight: "100vh" }}>
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading…</p>
        </div>
      </ThemeProvider>
    );
  }

  if (!loggedIn) {
    return (
      <ThemeProvider>
        <Login onLogin={handleLogin} apiBase={API_BASE} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        <div
          className={`sidebar-overlay${sidebarOpen ? " active" : ""}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <Sidebar
          activePage={page}
          setPage={setPage}
          user={user}
          onLogout={handleLogout}
          mobileOpen={sidebarOpen}
          onNavigated={() => setSidebarOpen(false)}
        />
        <div className="main-content">
          <AdminLayout
            user={user}
            onLogout={handleLogout}
            setPage={handleNavigate}
            onMenuToggle={() => setSidebarOpen((o) => !o)}
          >
            <div
              className="admin-page-slot"
              style={{ display: page === "dashboard" ? "block" : "none" }}
              aria-hidden={page !== "dashboard"}
            >
              <Dashboard refreshToken={dashRefreshToken} isVisible={page === "dashboard"} />
            </div>
            <div
              className="admin-page-slot"
              style={{ display: page === "appointments" ? "block" : "none" }}
              aria-hidden={page !== "appointments"}
            >
              <Appointments refreshToken={apptRefreshToken} isVisible={page === "appointments"} />
            </div>
            {page === "services"         && <Services />}
            <div
              className="admin-page-slot"
              style={{ display: page === "patients" ? "block" : "none" }}
              aria-hidden={page !== "patients"}
            >
              <Patients refreshToken={patientsRefreshToken} isVisible={page === "patients"} />
            </div>
            {page === "galleryimages"    && <GalleryImages />}
            {page === "reviews"          && <Reviews />}
            {page === "employees"        && <Employees />}
            {page === "inventory"        && <Inventory highlightId={highlightId} />}
            {page === "suppliers"        && <Suppliers />}
            {page === "expenses"         && <Expenses />}
            {page === "financial-report" && <FinancialReport />}
            {page === "settings"         && (
              <Settings
                user={user}
                apiBase={API_BASE}
                onProfileUpdate={handleProfileUpdate}
                onLogout={handleLogout}
              />
            )}
          </AdminLayout>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;