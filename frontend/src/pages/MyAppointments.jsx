
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./myappointments.css";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({});
  const [openReviewId, setOpenReviewId] = useState(null);

  // LOAD USER'S APPOINTMENTS
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

      if (response.ok && Array.isArray(data)) {
        setAppointments(data);
      } else {
        setMessage(data.message || "Failed to load appointments.");
      }
    } catch (error) {
      console.error("Failed to retrieve appointments:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // UPDATE REVIEW FORM
  const handleReviewChange = (appointmentId, field, value) => {
    setReviewData((previous) => ({
      ...previous,
      [appointmentId]: {
        rating: previous[appointmentId]?.rating || "5",
        comment: previous[appointmentId]?.comment || "",
        [field]: value,
      },
    }));
  };

  // SUBMIT REVIEW
  const submitReview = async (appointmentId) => {
    const token = localStorage.getItem("token");

    const review = reviewData[appointmentId] || {
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
        setOpenReviewId(null);
      }
    } catch (error) {
      console.error("Submit review error:", error);
      alert("Unable to connect to the server.");
    }
  };

  // FORMAT APPOINTMENT DATE
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  // FORMAT APPOINTMENT TIME
  const formatTime = (time) => {
    if (!time) return "N/A";

    const parts = String(time).split(":");
    const hour = Number(parts[0]);
    const minute = parts[1] || "00";

    if (Number.isNaN(hour)) return time;

    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minute} ${period}`;
  };

  // APPOINTMENT SUMMARY
  const upcomingCount = appointments.filter((appointment) => {
    const status = appointment.status?.toLowerCase();
    return status === "pending" || status === "confirmed";
  }).length;

  const totalCount = appointments.length;

  return (
    <>
      <Navbar />

      <main className="myappointments-page">
        {/* HERO */}
        <section className="myappointments-hero">
          <div className="myappointments-circle myappointments-circle-left" />
          <div className="myappointments-circle myappointments-circle-right" />

          <div className="myappointments-hero-content">
            <span className="myappointments-eyebrow">
              VISITS &amp; PAMPERING
            </span>

            <h1>My Appointments</h1>

            <p>
              View upcoming visits, revisit past grooms,
              and share how we did.
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="myappointments-content">
          <div className="myappointments-container">
            {/* SUMMARY */}
            <div className="myappointments-summary">
              <div className="myappointments-stats">
                <div className="myappointments-stat">
                  <strong className="myappointments-upcoming-number">
                    {upcomingCount}
                  </strong>
                  <span>UPCOMING</span>
                </div>

                <div className="myappointments-stat">
                  <strong className="myappointments-total-number">
                    {totalCount}
                  </strong>
                  <span>TOTAL VISITS</span>
                </div>
              </div>

              <Link
                to="/booking"
                className="myappointments-book-btn"
              >
                Book New Appointment
              </Link>
            </div>

            {/* STATUS MESSAGES */}
            {message && (
              <p className="myappointments-message" role="status">
                {message}
              </p>
            )}

            {loading && (
              <p className="myappointments-message">
                Loading appointments...
              </p>
            )}

            {!loading && !message && appointments.length === 0 && (
              <div className="myappointments-empty">
                <h2>No appointments yet!</h2>
                <p>
                  Your pet's next pampering session is just a booking away.
                </p>
                <Link to="/booking">Book an Appointment</Link>
              </div>
            )}

            {/* APPOINTMENT CARDS */}
            {!loading && (
              <div className="myappointments-list">
                {appointments.map((appointment) => {
                  const status =
                    appointment.status?.toLowerCase() || "pending";

                  const isCompleted = status === "completed";
                  const isReviewOpen =
                    openReviewId === appointment.appointment_id;

                  return (
                    <article
                      className="myappointments-card"
                      key={appointment.appointment_id}
                    >
                      {/* CARD HEADER */}
                      <div className="myappointments-card-header">
                        <div className="myappointments-pet">
                          <div className="myappointments-avatar">
                            {appointment.pet_name?.charAt(0).toUpperCase() || "🐾"}
                          </div>

                          <div className="myappointments-pet-info">
                            <span className="myappointments-service-label">
                              {appointment.service_name}
                            </span>

                            <h2>{appointment.pet_name}</h2>

                            <p>
                              {appointment.pet_type || "Pet"}
                              {" · "}
                              {appointment.breed || "Unknown breed"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`myappointments-status myappointments-status-${status}`}
                        >
                          {appointment.status || "Pending"}
                        </span>
                      </div>

                      {/* DETAILS */}
                      <div className="myappointments-details">
                        <div>
                          <span>DATE</span>
                          <strong>
                            {formatDate(appointment.appointment_date)}
                          </strong>
                        </div>

                        <div>
                          <span>TIME</span>
                          <strong>
                            {formatTime(appointment.appointment_time)}
                          </strong>
                        </div>

                        <div>
                          <span>AMOUNT</span>
                          <strong>
                            ₱{Number(appointment.amount || 0).toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      {/* NOTES */}
                      {appointment.notes && (
                        <div className="myappointments-notes">
                          <strong>Grooming notes:</strong>{" "}
                          {appointment.notes}
                        </div>
                      )}

                      {/* REVIEW BUTTON */}
                      {isCompleted && (
                        <div className="myappointments-review-area">
                          <button
                            type="button"
                            className="myappointments-review-toggle"
                            onClick={() =>
                              setOpenReviewId(
                                isReviewOpen
                                  ? null
                                  : appointment.appointment_id
                              )
                            }
                          >
                            {isReviewOpen
                              ? "Close Review"
                              : "Leave a Review"}
                          </button>

                          {/* REVIEW FORM */}
                          {isReviewOpen && (
                            <div className="myappointments-review-form">
                              <h3>⭐ Share Your Experience</h3>

                              <label htmlFor={`rating-${appointment.appointment_id}`}>
                                Rating
                              </label>

                              <select
                                id={`rating-${appointment.appointment_id}`}
                                value={
                                  reviewData[appointment.appointment_id]
                                    ?.rating || "5"
                                }
                                onChange={(e) =>
                                  handleReviewChange(
                                    appointment.appointment_id,
                                    "rating",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                              </select>

                              <label htmlFor={`comment-${appointment.appointment_id}`}>
                                Comment
                              </label>

                              <textarea
                                id={`comment-${appointment.appointment_id}`}
                                rows="4"
                                placeholder="Tell us about your experience..."
                                value={
                                  reviewData[appointment.appointment_id]
                                    ?.comment || ""
                                }
                                onChange={(e) =>
                                  handleReviewChange(
                                    appointment.appointment_id,
                                    "comment",
                                    e.target.value
                                  )
                                }
                              />

                              <button
                                type="button"
                                className="myappointments-review-submit"
                                onClick={() =>
                                  submitReview(appointment.appointment_id)
                                }
                              >
                                Submit Review
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MyAppointments;
