import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function Settings() {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // LOAD SETTINGS
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
    if (!time) return "";

    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <AdminSidebar />

      <main>
        <h1>⚙️ Settings</h1>

        <p>{new Date().toLocaleDateString()}</p>

        {loading && <p>Loading settings...</p>}

        {message && <p>{message}</p>}

        {!loading && settings && (
          <>
            <hr />

            {/* BUSINESS HOURS */}
            <section>
              <h2>Business Hours</h2>

              <p>
                <strong>Monday – Friday:</strong>{" "}
                {formatTime(settings.weekday_open)} –{" "}
                {formatTime(settings.weekday_close)}
              </p>

              <p>
                <strong>Saturday:</strong>{" "}
                {formatTime(settings.saturday_open)} –{" "}
                {formatTime(settings.saturday_close)}
              </p>

              <p>
                <strong>Sunday:</strong>{" "}
                {formatTime(settings.sunday_open)} –{" "}
                {formatTime(settings.sunday_close)}
              </p>
            </section>

            <hr />

            {/* CONTACT INFORMATION */}
            <section>
              <h2>Contact Information</h2>

              <p>
                <strong>Business Phone:</strong>{" "}
                {settings.business_phone}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {settings.email}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {settings.address}
              </p>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default Settings;