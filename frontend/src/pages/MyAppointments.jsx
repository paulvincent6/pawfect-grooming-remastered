import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET LOGGED-IN USER'S APPOINTMENTS
  // ==========================================
  const getAppointments = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to view your appointments.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAppointments(data);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Failed to retrieve appointments:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD APPOINTMENTS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        <h1>My Appointments</h1>

        {/* =====================================
            STATUS MESSAGE
        ====================================== */}
        {message && <p>{message}</p>}

        {/* =====================================
            LOADING
        ====================================== */}
        {loading && <p>Loading appointments...</p>}

        {/* =====================================
            NO APPOINTMENTS
        ====================================== */}
        {!loading &&
          !message &&
          appointments.length === 0 && (
            <p>You have no appointments yet.</p>
          )}

        {/* =====================================
            APPOINTMENT LIST
        ====================================== */}
        {!loading &&
          appointments.map((appointment) => (
            <div key={appointment.appointment_id}>
              <h2>
                {appointment.pet_name} - {appointment.service_name}
              </h2>

              <p>
                <strong>Pet Type:</strong>{" "}
                {appointment.pet_type}
              </p>

              <p>
                <strong>Breed:</strong>{" "}
                {appointment.breed || "N/A"}
              </p>

              <p>
                <strong>Service:</strong>{" "}
                {appointment.service_name}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  appointment.appointment_date
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.appointment_time}
              </p>

              <p>
                <strong>Amount:</strong> ₱
                {Number(appointment.amount).toFixed(2)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {appointment.status}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {appointment.notes || "None"}
              </p>

              <hr />
            </div>
          ))}
      </main>
    </>
  );
}

export default MyAppointments;