import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import "./review.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load reviews.");
          return;
        }

        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setMessage("Unexpected review data.");
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [token]);

  // REVIEW STATISTICS
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5
  ).length;

  const fiveStarPercentage =
    totalReviews > 0
      ? Math.round((fiveStarReviews / totalReviews) * 100)
      : 0;

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-CA");
  };

  const getInitial = (name) =>
    String(name || "Customer").trim().charAt(0).toUpperCase();

  return (
    <div className="admin-reviews-layout">
      <AdminSidebar />

      <main className="admin-reviews-main">
        {/* HEADER */}
        <header className="admin-reviews-header">
          <div>
            <h1>⭐ Reviews</h1>

            <p>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="admin-reviews-admin">
            <span className="admin-reviews-admin-avatar">A</span>
            <span>Admin</span>
          </div>
        </header>

        <div className="admin-reviews-content">
          {message && (
            <p className="admin-reviews-message" role="alert">
              {message}
            </p>
          )}

          {/* STATISTICS */}
          <section className="admin-reviews-stats">
            <div className="admin-reviews-stat-card">
              <span className="admin-reviews-stat-icon">💬</span>
              <strong>{loading ? "..." : totalReviews}</strong>
              <small>Total Reviews</small>
            </div>

            <div className="admin-reviews-stat-card">
              <span className="admin-reviews-stat-icon">⭐</span>
              <strong>{loading ? "..." : averageRating}</strong>
              <small>Average Rating</small>
            </div>

            <div className="admin-reviews-stat-card">
              <span className="admin-reviews-stat-icon">🏆</span>
              <strong>
                {loading ? "..." : `${fiveStarPercentage}%`}
              </strong>
              <small>5-Star Reviews</small>
            </div>
          </section>

          {/* REVIEW CARDS */}
          <section className="admin-reviews-list">
            {loading ? (
              <p className="admin-reviews-empty">
                Loading reviews...
              </p>
            ) : reviews.length === 0 ? (
              <p className="admin-reviews-empty">
                No reviews found.
              </p>
            ) : (
              reviews.map((review) => {
                const rating = Math.max(
                  0,
                  Math.min(5, Number(review.rating) || 0)
                );

                return (
                  <article
                    className="admin-reviews-card"
                    key={review.review_id}
                  >
                    <div className="admin-reviews-card-top">
                      <div className="admin-reviews-customer">
                        <div className="admin-reviews-customer-avatar">
                          {getInitial(review.customer_name)}
                        </div>

                        <div>
                          <h2>
                            {review.customer_name || "Customer"}
                          </h2>

                          <p>
                            Pet: {review.pet_name || "N/A"}
                            {" · "}
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>

                      <div
                        className="admin-reviews-stars"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {"★".repeat(Math.floor(rating))}
                        {"☆".repeat(5 - Math.floor(rating))}
                      </div>
                    </div>

                    <p className="admin-reviews-comment">
                      {review.comment
                        ? `"${review.comment}"`
                        : "No comment provided."}
                    </p>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Reviews;
