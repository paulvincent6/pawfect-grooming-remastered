
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./adminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      {/* BRAND */}
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-row">
          <div className="admin-sidebar-logo">🐾</div>
          <h2>Pawfect</h2>
        </div>

        <p>Admin Dashboard</p>
      </div>

      {/* NAVIGATION */}
      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "admin-sidebar-active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">📊</span>
          <span className="admin-sidebar-link-text">Overview</span>
        </NavLink>

        <NavLink
          to="/admin/appointments"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "admin-sidebar-active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">🗓️</span>
          <span className="admin-sidebar-link-text">Appointments</span>
        </NavLink>

        <NavLink
          to="/admin/reviews"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "admin-sidebar-active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">⭐</span>
          <span className="admin-sidebar-link-text">Reviews</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `admin-sidebar-link ${
              isActive ? "admin-sidebar-active" : ""
            }`
          }
        >
          <span className="admin-sidebar-link-icon">⚙️</span>
          <span className="admin-sidebar-link-text">Settings</span>
        </NavLink>
      </nav>

      {/* BOTTOM LINKS */}
      <div className="admin-sidebar-bottom">
        <Link to="/" className="admin-sidebar-back">
          <span>←</span>
          <span className="admin-sidebar-link-text">
            Back to Website
          </span>
        </Link>

        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          <span className="admin-sidebar-link-text">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
