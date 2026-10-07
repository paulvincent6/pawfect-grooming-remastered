const db = require("../config/database");

// ==========================================
// GET ALL REVIEWS - ADMIN
// ==========================================
const getAllReviews = (req, res) => {
  db.query(
    `SELECT
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,

        u.user_id,
        u.name AS customer_name,
        u.email AS customer_email,

        p.pet_id,
        p.name AS pet_name,
        p.pet_type,
        p.breed,

        a.appointment_id,

        s.service_id,
        s.name AS service_name

     FROM reviews r

     JOIN users u
       ON r.user_id = u.user_id

     JOIN pets p
       ON r.pet_id = p.pet_id

     JOIN appointments a
       ON r.appointment_id = a.appointment_id

     JOIN services s
       ON a.service_id = s.service_id

     ORDER BY r.created_at DESC`,
    (error, results) => {
      if (error) {
        console.error("Get reviews error:", error);

        return res.status(500).json({
          message: "Failed to retrieve reviews.",
        });
      }

      return res.status(200).json(results);
    }
  );
};


// ==========================================
// CREATE REVIEW - CUSTOMER
// ==========================================
const createReview = (req, res) => {
  const userId = req.user.id;

  const {
    appointment_id,
    rating,
    comment,
  } = req.body;

  // Check required fields
  if (!appointment_id || !rating) {
    return res.status(400).json({
      message: "Appointment and rating are required.",
    });
  }

  // Rating must be 1-5
  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5.",
    });
  }

  // Check appointment
  db.query(
    `SELECT *
     FROM appointments
     WHERE appointment_id = ?
       AND user_id = ?`,
    [appointment_id, userId],
    (appointmentError, appointmentResults) => {
      if (appointmentError) {
        console.error(
          "Review appointment check error:",
          appointmentError
        );

        return res.status(500).json({
          message: "Failed to verify appointment.",
        });
      }

      if (appointmentResults.length === 0) {
        return res.status(404).json({
          message: "Appointment not found.",
        });
      }

      const appointment = appointmentResults[0];

      // Only completed appointments can be reviewed
      if (appointment.status?.toLowerCase() !== "completed") {
        return res.status(400).json({
          message:
            "You can only review completed appointments.",
        });
      }

      // Check if this appointment already has a review
      db.query(
        `SELECT review_id
         FROM reviews
         WHERE appointment_id = ?`,
        [appointment_id],
        (reviewError, reviewResults) => {
          if (reviewError) {
            console.error(
              "Existing review check error:",
              reviewError
            );

            return res.status(500).json({
              message: "Failed to verify review.",
            });
          }

          if (reviewResults.length > 0) {
            return res.status(400).json({
              message:
                "You already reviewed this appointment.",
            });
          }

          // Create review
          db.query(
            `INSERT INTO reviews
            (
              user_id,
              pet_id,
              appointment_id,
              rating,
              comment
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
              userId,
              appointment.pet_id,
              appointment_id,
              numericRating,
              comment || null,
            ],
            (error, result) => {
              if (error) {
                console.error(
                  "Create review error:",
                  error
                );

                return res.status(500).json({
                  message: "Failed to submit review.",
                });
              }

              return res.status(201).json({
                message:
                  "Review submitted successfully!",
                reviewId: result.insertId,
              });
            }
          );
        }
      );
    }
  );
};


module.exports = {
  getAllReviews,
  createReview,
};