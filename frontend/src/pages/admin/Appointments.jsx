import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import "./appointments.css";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  // LOAD APPOINTMENTS
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

      if (!Array.isArray(data)) {
        setMessage("Unexpected appointment data.");
        return;
      }

      setAppointments(data);

      const statuses = {};

      data.forEach((appointment) => {
        statuses[appointment.appointment_id] =
          appointment.status;
      });

      setSelectedStatuses(statuses);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [token]);

  // UPDATE STATUS DROPDOWN
  const handleStatusChange = (appointmentId, newStatus) => {
    setSelectedStatuses((previous) => ({
      ...previous,
      [appointmentId]: newStatus,
    }));
  };

  // SAVE STATUS TO DATABASE
  const updateStatus = async (appointmentId) => {
    setUpdatingId(appointmentId);
    setMessage("");

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

      await loadAppointments();
      setMessage("Appointment status updated successfully!");
    } catch (error) {
      console.error("Update status error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setUpdatingId(null);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "N/A";

    // MySQL DATE strings are already YYYY-MM-DD.
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-CA", {
      timeZone: "UTC",
    });
  };

  // FORMAT TIME
  const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = String(time).split(":");
    const hour = Number(hours);

    if (Number.isNaN(hour)) return time;

    return `${hour % 12 || 12}:${minutes || "00"} ${
      hour >= 12 ? "PM" : "AM"
    }`;
  };

  // FILTER APPOINTMENTS
  const filteredAppointments = appointments.filter((appointment) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      [
        appointment.customer_name,
        appointment.customer_email,
        appointment.pet_name,
        appointment.service_name,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

    const matchesStatus =
      statusFilter === "all" ||
      appointment.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="admin-appointments-layout">
      <AdminSidebar />

      <main className="admin-appointments-main">
        {/* PAGE HEADER */}
        <header className="admin-appointments-header">
          <div>
            <h1>🗓️ Appointments</h1>

            <p>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="admin-appointments-admin">
            <span className="admin-appointments-admin-avatar">
              A
            </span>
            <span>Admin</span>
          </div>
        </header>

        <div className="admin-appointments-content">
          {/* SEARCH AND FILTERS */}
          <div className="admin-appointments-toolbar">
            <input
              type="search"
              className="admin-appointments-search"
              placeholder="Search owner or pet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="admin-appointments-filters">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={`admin-appointments-filter-btn ${
                    statusFilter === filter.value
                      ? "admin-appointments-filter-active"
                      : ""
                  }`}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* STATUS MESSAGE */}
          {message && (
            <p className="admin-appointments-message" role="status">
              {message}
            </p>
          )}

          {/* APPOINTMENTS TABLE */}
          <div className="admin-appointments-table-wrapper">
            <table className="admin-appointments-table">
              <thead>
                <tr>
                  <th>PET / OWNER</th>
                  <th>SERVICE</th>
                  <th>DATE &amp; TIME</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="admin-appointments-empty">
                      Loading appointments...
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-appointments-empty">
                      {appointments.length === 0
                        ? "No appointments found."
                        : "No appointments match your search or filter."}
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => {
                    const id = appointment.appointment_id;

                    const status =
                      appointment.status?.toLowerCase() || "pending";

                    const selectedStatus =
                      selectedStatuses[id] || status;

                    const isChanged =
                      selectedStatus.toLowerCase() !== status;

                    return (
                      <tr key={id}>
                        {/* PET AND OWNER */}
                        <td>
                          <div className="admin-appointments-pet-cell">
                            <span className="admin-appointments-pet-icon">
                              {appointment.pet_type?.toLowerCase() === "cat"
                                ? "🐱"
                                : "🐶"}
                            </span>

                            <div>
                              <strong>
                                {appointment.pet_name || "Pet"}
                              </strong>

                              <small>
                                {appointment.customer_name || "Customer"}
                                {" · "}
                                {appointment.breed ||
                                  appointment.pet_type ||
                                  "Pet"}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* SERVICE */}
                        <td>
                          {appointment.service_name || "N/A"}
                        </td>

                        {/* DATE AND TIME */}
                        <td>
                          <div className="admin-appointments-date">
                            <span>
                              {formatDate(appointment.appointment_date)}
                            </span>

                            <small>
                              {formatTime(appointment.appointment_time)}
                            </small>
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td>
                          ₱{Number(appointment.amount || 0).toFixed(2)}
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`admin-appointments-badge admin-appointments-${status}`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="admin-appointments-actions">
                            <select
                              aria-label={`Status for ${appointment.pet_name}`}
                              value={selectedStatus}
                              onChange={(e) =>
                                handleStatusChange(id, e.target.value)
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            {isChanged && (
                              <button
                                type="button"
                                className="admin-appointments-save"
                                onClick={() => updateStatus(id)}
                                disabled={updatingId === id}
                              >
                                {updatingId === id ? "..." : "Save"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAppointments;
