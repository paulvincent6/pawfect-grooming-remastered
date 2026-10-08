
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./contact.css";

function Contact() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/settings"
        );

        if (!response.ok) {
          throw new Error("Failed to load settings");
        }

        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Contact settings error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const formatTime = (time) => {
    if (!time) return "Closed";

    const [hours, minutes] = time.split(":");
    const hour = Number(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;
  };

  const formatHours = (open, close) => {
    if (!open || !close) return "Closed";
    return `${formatTime(open)} – ${formatTime(close)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!settings?.email) {
      alert("Business email is currently unavailable.");
      return;
    }

    const subject = encodeURIComponent(
      `Pawfect Grooming Inquiry from ${form.name}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone || "Not provided"}\n\n` +
      `Message:\n${form.message}`
    );

    window.location.href =
      `mailto:${settings.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Navbar />

      <div className="contact-page">
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you! Reach out any time.
          </p>
        </section>

        <main className="contact-content">
          <section className="contact-information">
            <h2>Get in Touch</h2>

            {loading ? (
              <p>Loading contact information...</p>
            ) : settings ? (
              <div className="contact-details">
                <div className="contact-detail">
                  <span className="contact-detail-icon">📍</span>
                  <div>
                    <h3>Address</h3>
                    <p>
                      {settings.address ||
                        "Address not available"}
                    </p>
                  </div>
                </div>

                <div className="contact-detail">
                  <span className="contact-detail-icon">📞</span>
                  <div>
                    <h3>Phone</h3>
                    <p>
                      {settings.business_phone ||
                        "Phone number not available"}
                    </p>
                  </div>
                </div>

                <div className="contact-detail">
                  <span className="contact-detail-icon">✉️</span>
                  <div>
                    <h3>Email</h3>
                    <p>
                      {settings.email ||
                        "Email not available"}
                    </p>
                  </div>
                </div>

                <div className="contact-detail">
                  <span className="contact-detail-icon">🕒</span>
                  <div>
                    <h3>Business Hours</h3>
                    <p>
                      Mon–Fri:{" "}
                      {formatHours(
                        settings.weekday_open,
                        settings.weekday_close
                      )}
                    </p>
                    <p>
                      Saturday:{" "}
                      {formatHours(
                        settings.saturday_open,
                        settings.saturday_close
                      )}
                    </p>
                    <p>
                      Sunday:{" "}
                      {formatHours(
                        settings.sunday_open,
                        settings.sunday_close
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p>
                Contact information is currently unavailable.
              </p>
            )}

            <div className="contact-booking-note">
              <h3>🐾 Planning a Visit?</h3>
              <p>
                Book your grooming appointment in advance
                to reserve a convenient time for your pet.
              </p>
              <a href="/booking">Book an Appointment →</a>
            </div>
          </section>

          <section className="contact-form-section">
            <h2>Send a Message</h2>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <label htmlFor="contact-name">
                Your Name <span>*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="contact-email">
                Email Address <span>*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="contact-phone">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                placeholder="0912 345 6789"
                value={form.phone}
                onChange={handleChange}
              />

              <label htmlFor="contact-message">
                Message <span>*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us about your pet and how we can help..."
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
              />

              <button
                type="submit"
                className="contact-submit"
                disabled={loading || !settings?.email}
              >
                ✉️ Send Message
              </button>

              <p className="contact-form-note">
                This opens your email application to send
                the message. Please review and send it there.
              </p>
            </form>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
