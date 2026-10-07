import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

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

        setAppointments(data);
      } catch (error) {
        console.error("Dashboard error:", error);
        setMessage("Unable to connect to the server.");
      }
    };

    loadAppointments();
  }, [token]);

  // Today's local date
  const today = new Date().toLocaleDateString("en-CA");

  // Convert database date into local YYYY-MM-DD
  const getLocalDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-CA");
  };

  // Normalize status so Pending/pending both work
  const getStatus = (appointment) =>
    appointment.status?.toLowerCase();

  // TODAY'S APPOINTMENTS
  const todaysAppointments = appointments.filter(
    (appointment) =>
      getLocalDate(appointment.appointment_date) === today
  );

  // UPCOMING
  // Pending and confirmed appointments are considered upcoming
  const upcomingAppointments = appointments.filter(
    (appointment) => {
      const status = getStatus(appointment);

      return (
        status === "pending" ||
        status === "confirmed"
      );
    }
  );

  // COMPLETED
  const completedAppointments = appointments.filter(
    (appointment) =>
      getStatus(appointment) === "completed"
  );

  // REVENUE
  // Only completed appointments count toward revenue
  const revenue = completedAppointments.reduce(
    (total, appointment) =>
      total + Number(appointment.amount || 0),
    0
  );

  return (
    <>
      <AdminSidebar />

      <main>
        <h1>📊 Overview</h1>

        <p>{new Date().toLocaleDateString()}</p>

        {message && <p>{message}</p>}

        <hr />

        <h2>Dashboard Summary</h2>

        <p>
          <strong>Today's Appointments:</strong>{" "}
          {todaysAppointments.length}
        </p>

        <p>
          <strong>Upcoming:</strong>{" "}
          {upcomingAppointments.length}
        </p>

        <p>
          <strong>Completed:</strong>{" "}
          {completedAppointments.length}
        </p>

        <p>
          <strong>Revenue:</strong> ₱
          {revenue.toFixed(2)}
        </p>

        <hr />

        <h2>Today's Schedule</h2>

        {todaysAppointments.length === 0 ? (
          <p>No appointments scheduled for today.</p>
        ) : (
          todaysAppointments.map((appointment) => (
            <div key={appointment.appointment_id}>
              <h3>
                {appointment.pet_name} -{" "}
                {appointment.service_name}
              </h3>

              <p>
                <strong>Customer:</strong>{" "}
                {appointment.customer_name}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.appointment_time}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {appointment.status}
              </p>

              <hr />
            </div>
          ))
        )}
      </main>
    </>
  );
}

export default Dashboard;