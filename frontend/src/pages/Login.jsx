import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect depending on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* LEFT WELCOME PANEL */}
      <section className="login-welcome">
        <Link to="/" className="login-brand">
          <span className="login-brand-icon">🐾</span>
          <span>Pawfect Grooming</span>
        </Link>

        <div className="login-welcome-content">
          <div className="login-pet-icon">🐱</div>

          <h1>Welcome back, pet parent!</h1>

          <p>
            Sign in to manage your appointments, view your
            booking history, and keep your furry friends
            looking their best.
          </p>
        </div>

        <div className="login-welcome-footer">
          
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="login-right">
        <div className="login-form-container">
          <h2>Sign In</h2>

          <p className="login-register-text">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">
                Email Address
              </label>

              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {message && (
              <p className="login-error" role="alert">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <Link to="/" className="login-back">
            ← Back to website
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
