import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Review form values for each appointment
  const [reviewData, setReviewData] = useState({});

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

  // ==========================================
  // UPDATE REVIEW FORM
  // ==========================================
  const handleReviewChange = (
    appointmentId,
    field,
    value
  ) => {
    setReviewData((previous) => ({
      ...previous,

      [appointmentId]: {
        rating:
          previous[appointmentId]?.rating || "5",

        comment:
          previous[appointmentId]?.comment || "",

        [field]: value,
      },
    }));
  };

  // ==========================================
  // SUBMIT REVIEW
  // ==========================================
  const submitReview = async (appointmentId) => {
    const token = localStorage.getItem("token");

    const review =
      reviewData[appointmentId] || {
        rating: "5",
        comment: "",
      };

    try {
      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            appointment_id: appointmentId,
            rating: Number(review.rating),
            comment: review.comment,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setReviewData((previous) => ({
          ...previous,

          [appointmentId]: {
            rating: "5",
            comment: "",
          },
        }));
      }
    } catch (error) {
      console.error("Submit review error:", error);

      alert("Unable to connect to the server.");
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <h1>My Appointments</h1>

        {/* STATUS MESSAGE */}
        {message && <p>{message}</p>}

        {/* LOADING */}
        {loading && <p>Loading appointments...</p>}

        {/* NO APPOINTMENTS */}
        {!loading &&
          !message &&
          appointments.length === 0 && (
            <p>You have no appointments yet.</p>
          )}

        {/* APPOINTMENT LIST */}
        {!loading &&
          appointments.map((appointment) => (
            <div key={appointment.appointment_id}>
              <h2>
                {appointment.pet_name} -{" "}
                {appointment.service_name}
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
                {Number(
                  appointment.amount
                ).toFixed(2)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {appointment.status}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {appointment.notes || "None"}
              </p>

              {/* ===============================
                  REVIEW FORM
                  Only completed appointments
              =============================== */}
              {appointment.status?.toLowerCase() === "completed" && (
                <div>
                  <h3>⭐ Leave a Review</h3>

                  <label>
                    Rating:
                  </label>

                  <br />

                  <select
                    value={
                      reviewData[
                        appointment.appointment_id
                      ]?.rating || "5"
                    }
                    onChange={(e) =>
                      handleReviewChange(
                        appointment.appointment_id,
                        "rating",
                        e.target.value
                      )
                    }
                  >
                    <option value="5">
                      5 - Excellent
                    </option>

                    <option value="4">
                      4 - Very Good
                    </option>

                    <option value="3">
                      3 - Good
                    </option>

                    <option value="2">
                      2 - Fair
                    </option>

                    <option value="1">
                      1 - Poor
                    </option>
                  </select>

                  <br />
                  <br />

                  <label>
                    Comment:
                  </label>

                  <br />

                  <textarea
                    rows="4"
                    cols="40"
                    placeholder="Tell us about your experience..."
                    value={
                      reviewData[
                        appointment.appointment_id
                      ]?.comment || ""
                    }
                    onChange={(e) =>
                      handleReviewChange(
                        appointment.appointment_id,
                        "comment",
                        e.target.value
                      )
                    }
                  />

                  <br />

                  <button
                    type="button"
                    onClick={() =>
                      submitReview(
                        appointment.appointment_id
                      )
                    }
                  >
                    Submit Review
                  </button>
                </div>
              )}

              <hr />
            </div>
          ))}
      </main>
    </>
  );
}

export default MyAppointments;