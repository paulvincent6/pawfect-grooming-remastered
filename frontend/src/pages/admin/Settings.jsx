
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import "./settings.css";

function Settings() {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // LOAD SETTINGS FROM DATABASE
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/settings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load settings.");
          return;
        }

        setSettings(data);
      } catch (error) {
        console.error("Load settings error:", error);
        setMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [token]);

  // FORMAT TIME
  // Example: 09:00:00 -> 9:00 AM
  const formatTime = (time) => {
    if (!time) return "Not set";

    const [hours, minutes] = String(time).split(":");
    const hour = Number(hours);

    if (Number.isNaN(hour)) return String(time);

    return `${hour % 12 || 12}:${minutes || "00"} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  return (
    <div className="admin-settings-layout">
      <AdminSidebar />

      <main className="admin-settings-main">
        {/* HEADER */}
        <header className="admin-settings-header">
          <div>
            <h1>⚙️ Settings</h1>

            <p>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="admin-settings-admin">
            <span className="admin-settings-admin-avatar">
              A
            </span>
            <span>Admin</span>
          </div>
        </header>

        {/* CONTENT */}
        <div className="admin-settings-content">
          {loading && (
            <p className="admin-settings-notice">
              Loading settings...
            </p>
          )}

          {message && (
            <p className="admin-settings-notice" role="alert">
              {message}
            </p>
          )}

          {!loading && settings && (
            <div className="admin-settings-cards">
              {/* BUSINESS HOURS */}
              <section className="admin-settings-card">
                <h2>Business Hours</h2>

                <div className="admin-settings-hours-row">
                  <span>Monday – Friday</span>
                  <span>
                    {formatTime(settings.weekday_open)}
                    {" – "}
                    {formatTime(settings.weekday_close)}
                  </span>
                </div>

                <div className="admin-settings-hours-row">
                  <span>Saturday</span>
                  <span>
                    {formatTime(settings.saturday_open)}
                    {" – "}
                    {formatTime(settings.saturday_close)}
                  </span>
                </div>

                <div className="admin-settings-hours-row">
                  <span>Sunday</span>
                  <span>
                    {formatTime(settings.sunday_open)}
                    {" – "}
                    {formatTime(settings.sunday_close)}
                  </span>
                </div>
              </section>

              {/* CONTACT INFORMATION */}
              <section className="admin-settings-card">
                <h2>Contact Information</h2>

                <div className="admin-settings-field">
                  <label htmlFor="settings-phone">
                    BUSINESS PHONE
                  </label>

                  <input
                    id="settings-phone"
                    type="text"
                    value={settings.business_phone || ""}
                    readOnly
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="settings-email">
                    EMAIL
                  </label>

                  <input
                    id="settings-email"
                    type="text"
                    value={settings.email || ""}
                    readOnly
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="settings-address">
                    ADDRESS
                  </label>

                  <input
                    id="settings-address"
                    type="text"
                    value={settings.address || ""}
                    readOnly
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Settings;
