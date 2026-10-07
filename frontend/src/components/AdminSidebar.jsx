import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside>
      <h2>🐾 Pawfect</h2>
      <p>Admin Dashboard</p>

      <hr />

      <nav>
        <p>
          📊 <Link to="/admin">Overview</Link>
        </p>

        <p>
          📅 <Link to="/admin/appointments">Appointments</Link>
        </p>

        <p>
          ⭐ <Link to="/admin/reviews">Reviews</Link>
        </p>

        <p>
          ⚙️ <Link to="/admin/settings">Settings</Link>
        </p>
      </nav>

      <hr />

      <p>
        <Link to="/">← Back to Website</Link>
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;