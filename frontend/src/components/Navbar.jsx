
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      {/* PROMOTIONAL BANNER */}
      <div className="site-promo">
        🎉 Get 10% off your first appointment!
        Use code <strong>PAWFIRST</strong>
      </div>

      {/* NAVIGATION */}
      <nav className="site-navbar">
        <div className="site-navbar-inner">
          <Link
            to="/"
            className="site-brand"
            onClick={closeMenu}
          >
            <span className="site-brand-icon">🐾</span>
            <span className="site-brand-name">
              Pawfect
              <br />
              Grooming
            </span>
          </Link>

          <button
            type="button"
            className="site-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          <div
            className={
              menuOpen
                ? "site-nav-content site-nav-open"
                : "site-nav-content"
            }
          >
            {/* MAIN LINKS */}
            <div className="site-nav-links">
              <NavLink
                to="/"
                end
                onClick={closeMenu}
              >
                Home
              </NavLink>

              {/* PUBLIC PAGES */}
              <NavLink
                to="/services"
                onClick={closeMenu}
              >
                Services
              </NavLink>

              <NavLink
                to="/contact"
                onClick={closeMenu}
              >
                Contact Us
              </NavLink>

              {/* CUSTOMER PAGES */}
              {user && !isAdmin && (
                <>
                  <NavLink
                    to="/pets"
                    onClick={closeMenu}
                  >
                    My Pets
                  </NavLink>

                  <NavLink
                    to="/appointments"
                    onClick={closeMenu}
                  >
                    My Appointments
                  </NavLink>
                </>
              )}

              {/* BOOKING */}
              <Link
                to="/booking"
                className="site-book-btn"
                onClick={closeMenu}
              >
                Book Now
              </Link>
            </div>

            {/* ACCOUNT LINKS */}
            <div className="site-nav-account">
              {user ? (
                <>
                  <span className="site-welcome">
                    Welcome,{" "}
                    {user.full_name ||
                      user.name ||
                      "Pet Parent"}
                  </span>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="site-admin-btn"
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    type="button"
                    className="site-logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="site-register-link"
                  >
                    Register
                  </Link>

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="site-login-btn"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
