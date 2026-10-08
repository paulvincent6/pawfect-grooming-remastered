import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      setMessage(data.message || (response.ok ? "Registration successful!" : "Registration failed."));

      if (response.ok) {
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          password: "",
          confirm_password: "",
        });
      }
    } catch (error) {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      {/* LEFT WELCOME PANEL */}
      <section className="register-welcome">
        <Link to="/" className="register-brand">
          <span className="register-brand-icon">🐾</span>
          <span>Pawfect Grooming</span>
        </Link>

        <div className="register-welcome-content">
          <div className="register-pet-icons">🐶 🐱</div>

          <h1>Join our pack!</h1>

          <p>
            Create your free account and enjoy easy online
            booking, appointment reminders, and convenient
            grooming services.
          </p>

          <div className="register-benefits">
            <p>✅ Free online booking</p>
            <p>✅ Easy appointment management</p>
            <p>✅ Manage your pets' information</p>
            <p>✅ Grooming history and records</p>
          </div>
        </div>

        <div className="register-welcome-footer">
          Pawfect Grooming 🐾
        </div>
      </section>

      {/* RIGHT REGISTRATION PANEL */}
      <section className="register-right">
        <div className="register-form-container">
          <h2>Create Account</h2>

          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-phone">Phone Number</label>
              <input
                id="register-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-confirm">
                Confirm Password
              </label>
              <input
                id="register-confirm"
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
              />
            </div>

            {message && (
              <p className="register-message" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <Link to="/" className="register-back">
            ← Back to website
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Register;
