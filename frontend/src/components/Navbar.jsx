import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>Pawfect Grooming</h2>

      <div>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/booking">Book Appointment</Link>
        {" | "}
        <Link to="/appointments">My Appointments</Link>
        {" | "}
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;