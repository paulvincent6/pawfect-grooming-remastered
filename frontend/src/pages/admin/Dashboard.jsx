
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import "./dashboard.css";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // LOAD APPOINTMENTS FROM DATABASE
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "Failed to load dashboard."
          );
          return;
        }

        if (Array.isArray(data)) {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        setMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [token]);

  // FORMAT LOCAL DATE
  const getLocalDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-CA");
  };

  const today = getLocalDate(new Date());

  // NORMALIZE STATUS
  const getStatus = (appointment) =>
    appointment.status?.toLowerCase() || "pending";

  // TODAY'S APPOINTMENTS
  const todaysAppointments = appointments.filter(
    (appointment) =>
      getLocalDate(appointment.appointment_date) === today
  );

  // UPCOMING APPOINTMENTS
  const upcomingAppointments = appointments.filter(
    (appointment) => {
      const status = getStatus(appointment);

      return (
        status === "pending" ||
        status === "confirmed"
      );
    }
  );

  // COMPLETED APPOINTMENTS
  const completedAppointments = appointments.filter(
    (appointment) =>
      getStatus(appointment) === "completed"
  );

  // REVENUE FROM COMPLETED APPOINTMENTS
  const revenue = completedAppointments.reduce(
    (total, appointment) =>
      total + Number(appointment.amount || 0),
    0
  );

  // FORMAT APPOINTMENT TIME
  const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = String(time).split(":");
    const hour = Number(hours);

    if (Number.isNaN(hour)) return time;

    return `${hour % 12 || 12}:${minutes || "00"} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  // SORT TODAY'S SCHEDULE BY TIME
  const sortedToday = [...todaysAppointments].sort(
    (a, b) =>
      String(a.appointment_time).localeCompare(
        String(b.appointment_time)
      )
  );

  const summaryCards = [
    {
      label: "Today's Appts",
      value: todaysAppointments.length,
      icon: "🗓️",
      color: "teal",
    },
    {
      label: "Upcoming",
      value: upcomingAppointments.length,
      icon: "⏰",
      color: "blue",
    },
    {
      label: "Revenue",
      value: `₱${revenue.toLocaleString("en-PH", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })}`,
      icon: "💰",
      color: "green",
    },
    {
      label: "Completed",
      value: completedAppointments.length,
      icon: "✅",
      color: "yellow",
    },
  ];

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />

      <main className="admin-dashboard-main">
        {/* HEADER */}
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-left">
            <h1>📊 Overview</h1>

            <p>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="admin-dashboard-admin">
            <span className="admin-dashboard-admin-avatar">
              A
            </span>
            <span>Admin</span>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="admin-dashboard-content">
          {message && (
            <p className="admin-dashboard-message" role="alert">
              {message}
            </p>
          )}

          {/* SUMMARY CARDS */}
          <section className="admin-dashboard-stats">
            {summaryCards.map((card) => (
              <article
                className="admin-dashboard-stat-card"
                key={card.label}
              >
                <span
                  className={`admin-dashboard-stat-icon admin-dashboard-icon-${card.color}`}
                >
                  {card.icon}
                </span>

                <strong className="admin-dashboard-stat-value">
                  {loading ? "..." : card.value}
                </strong>

                <span className="admin-dashboard-stat-label">
                  {card.label}
                </span>
              </article>
            ))}
          </section>

          {/* TODAY'S SCHEDULE */}
          <section className="admin-dashboard-schedule">
            <h2>Today's Schedule</h2>

            {loading ? (
              <p className="admin-dashboard-empty">
                Loading appointments...
              </p>
            ) : sortedToday.length === 0 ? (
              <p className="admin-dashboard-empty">
                No appointments scheduled for today.
              </p>
            ) : (
              <div className="admin-dashboard-schedule-list">
                {sortedToday.map((appointment) => (
                  <div
                    className="admin-dashboard-schedule-row"
                    key={appointment.appointment_id}
                  >
                    <div className="admin-dashboard-schedule-pet">
                      <span className="admin-dashboard-pet-icon">
                        {appointment.pet_type?.toLowerCase() === "cat"
                          ? "🐱"
                          : "🐶"}
                      </span>

                      <div className="admin-dashboard-pet-details">
                        <p>
                          <strong>
                            {appointment.pet_name || "Pet"}
                          </strong>

                          <span>
                            {" "}(
                            {appointment.customer_name || "Customer"}
                            )
                          </span>
                        </p>

                        <small>
                          {appointment.service_name || "Grooming"}
                          {" · "}
                          {appointment.breed ||
                            appointment.pet_type ||
                            "Pet"}
                        </small>
                      </div>
                    </div>

                    <div className="admin-dashboard-schedule-right">
                      <span className="admin-dashboard-time">
                        {formatTime(appointment.appointment_time)}
                      </span>

                      <span
                        className={`admin-dashboard-status admin-dashboard-status-${getStatus(
                          appointment
                        )}`}
                      >
                        {appointment.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
