import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav>
      <h2>Pawfect Admin</h2>

      <Link to="/admin">Overview</Link>
      {" | "}
      <Link to="/admin/appointments">Appointments</Link>
      {" | "}
      <Link to="/admin/customers">Customers</Link>
      {" | "}
      <Link to="/admin/services">Services</Link>
      {" | "}

      <button onClick={handleLogout}>Logout</button>

      <hr />
    </nav>
  );
}

export default AdminSidebar;