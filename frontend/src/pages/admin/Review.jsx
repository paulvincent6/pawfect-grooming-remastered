import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

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
          setMessage(
            data.message || "Failed to load reviews."
          );
          return;
        }

        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setMessage("Unable to connect to the server.");
      }
    };

    loadReviews();
  }, [token]);

  return (
    <>
      <AdminSidebar />

      <main>
        <h1>⭐ Reviews</h1>

        {message && <p>{message}</p>}

        {reviews.length === 0 && !message ? (
          <p>No reviews found.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.review_id}>
              <h2>
                {review.customer_name} — {review.pet_name}
              </h2>

              <p>
                <strong>Rating:</strong>{" "}
                {"⭐".repeat(review.rating)} ({review.rating}/5)
              </p>

              <p>
                <strong>Comment:</strong>{" "}
                {review.comment || "No comment"}
              </p>

              <p>
                <strong>Pet:</strong> {review.pet_name}
              </p>

              <p>
                <strong>Service:</strong>{" "}
                {review.service_name}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(review.created_at).toLocaleDateString()}
              </p>

              <hr />
            </div>
          ))
        )}
      </main>
    </>
  );
}

export default Reviews;