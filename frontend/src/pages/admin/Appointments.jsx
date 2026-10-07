import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const token = localStorage.getItem("token");

  // ==========================================
  // LOAD ALL APPOINTMENTS
  // ==========================================
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
        setMessage(data.message || "Failed to load appointments.");
        return;
      }

      setAppointments(data);

      // Set each dropdown to the appointment's current status
      const statuses = {};

      data.forEach((appointment) => {
        statuses[appointment.appointment_id] =
          appointment.status;
      });

      setSelectedStatuses(statuses);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setMessage("Unable to connect to the server.");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [token]);

  // ==========================================
  // CHANGE STATUS DROPDOWN
  // ==========================================
  const handleStatusChange = (appointmentId, newStatus) => {
    setSelectedStatuses((previousStatuses) => ({
      ...previousStatuses,
      [appointmentId]: newStatus,
    }));
  };

  // ==========================================
  // UPDATE APPOINTMENT STATUS
  // ==========================================
  const updateStatus = async (appointmentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: selectedStatuses[appointmentId],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update appointment status."
        );
        return;
      }

      setMessage("Appointment status updated successfully!");

      // Reload appointments so the latest status appears
      await loadAppointments();
    } catch (error) {
      console.error("Update status error:", error);
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <>
      <AdminSidebar />

      <main>
        <h1>Appointment Management</h1>

        {message && <p>{message}</p>}

        {appointments.length === 0 && !message ? (
          <p>No appointments found.</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.appointment_id}>
              <h2>
                {appointment.pet_name} -{" "}
                {appointment.service_name}
              </h2>

              <p>
                <strong>Customer:</strong>{" "}
                {appointment.customer_name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {appointment.customer_email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {appointment.customer_phone}
              </p>

              <p>
                <strong>Pet:</strong>{" "}
                {appointment.pet_name}
              </p>

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
                <strong>Current Status:</strong>{" "}
                {appointment.status}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {appointment.notes || "None"}
              </p>

              <div>
                <label>
                  <strong>Change Status:</strong>
                </label>

                <br />

                <select
                  value={
                    selectedStatuses[
                      appointment.appointment_id
                    ] || appointment.status
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      appointment.appointment_id,
                      e.target.value
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {" "}

                <button
                  onClick={() =>
                    updateStatus(
                      appointment.appointment_id
                    )
                  }
                >
                  Update Status
                </button>
              </div>

              <hr />
            </div>
          ))
        )}
      </main>
    </>
  );
}

export default AdminAppointments;