
import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <h2>🐾 Pawfect Grooming</h2>
          <p>
            Making every pet look and feel their best.
          </p>
        </div>

        <div className="site-footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/booking">Book Appointment</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Create Account</Link>
        </div>

        <div className="site-footer-contact">
          <h3>Contact Us</h3>
          <p>📞 (555) PAW-FECT</p>
          <p>✉️ hello@pawfectgrooming.com</p>
          <p>📍 123 Paw Street, Pet City</p>
        </div>
      </div>

      <div className="site-footer-bottom">
        © {new Date().getFullYear()} Pawfect Grooming.
        All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
