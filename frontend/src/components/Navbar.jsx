import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav>
      <h2>Pawfect Grooming</h2>

      <div>
        <Link to="/">Home</Link>

        {/* If user is logged in */}
        {user ? (
          <>
            {" | "}
            <Link to="/booking">Book Appointment</Link>

            {" | "}
            <Link to="/appointments">My Appointments</Link>

            {" | "}
            <span>Welcome, {user.full_name}</span>

            {" | "}
            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            {" | "}
            <Link to="/login">Login</Link>

            {" | "}
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;