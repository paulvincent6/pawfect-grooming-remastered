const db = require("../config/database");

// CREATE APPOINTMENT
const createAppointment = (req, res) => {
  const {
    pet_id,
    service_id,
    appointment_date,
    appointment_time,
    notes,
  } = req.body;

  const userId = req.user.id;

  // Check required fields
  if (
    !pet_id ||
    !service_id ||
    !appointment_date ||
    !appointment_time
  ) {
    return res.status(400).json({
      message: "Please complete all required fields.",
    });
  }

  // ==========================================
  // VALIDATE APPOINTMENT TIME
  // Shop hours: 9:00 AM - 6:00 PM
  // Last appointment starts at 5:00 PM
  // ==========================================
  const allowedTimes = [
    "09:00:00",
    "10:00:00",
    "11:00:00",
    "12:00:00",
    "13:00:00",
    "14:00:00",
    "15:00:00",
    "16:00:00",
    "17:00:00",
  ];

  if (!allowedTimes.includes(appointment_time)) {
    return res.status(400).json({
      message: "Please select a valid appointment time.",
    });
  }

  // Make sure the pet belongs to the logged-in user
  db.query(
    "SELECT * FROM pets WHERE pet_id = ? AND user_id = ?",
    [pet_id, userId],
    (petError, petResults) => {
      if (petError) {
        console.error("Pet check error:", petError);

        return res.status(500).json({
          message: "Failed to verify pet.",
        });
      }

      if (petResults.length === 0) {
        return res.status(404).json({
          message: "Pet not found.",
        });
      }

      // Get selected service
      db.query(
        "SELECT * FROM services WHERE service_id = ? AND status = 'active'",
        [service_id],
        (serviceError, serviceResults) => {
          if (serviceError) {
            console.error("Service check error:", serviceError);

            return res.status(500).json({
              message: "Failed to verify service.",
            });
          }

          if (serviceResults.length === 0) {
            return res.status(404).json({
              message: "Service not found.",
            });
          }

          const service = serviceResults[0];

          // Create appointment
          db.query(
            `INSERT INTO appointments
            (
              user_id,
              pet_id,
              service_id,
              appointment_date,
              appointment_time,
              amount,
              status,
              notes
            )
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
            [
              userId,
              pet_id,
              service_id,
              appointment_date,
              appointment_time,
              service.price,
              notes || null,
            ],
            (error, result) => {
              if (error) {
                console.error("Create appointment error:", error);

                return res.status(500).json({
                  message: "Failed to create appointment.",
                });
              }

              return res.status(201).json({
                message: "Appointment booked successfully!",
                appointmentId: result.insertId,
              });
            }
          );
        }
      );
    }
  );
};


// GET MY APPOINTMENTS
const getMyAppointments = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.amount,
        a.notes,

        p.pet_id,
        p.name AS pet_name,
        p.pet_type,
        p.breed,

        s.service_id,
        s.name AS service_name,
        s.description AS service_description,
        s.price,
        s.duration

     FROM appointments a

     JOIN pets p
       ON a.pet_id = p.pet_id

     JOIN services s
       ON a.service_id = s.service_id

     WHERE a.user_id = ?

     ORDER BY
       a.appointment_date ASC,
       a.appointment_time ASC`,
    [userId],
    (error, results) => {
      if (error) {
        console.error("Get appointments error:", error);

        return res.status(500).json({
          message: "Failed to retrieve appointments.",
        });
      }

      return res.status(200).json(results);
    }
  );
};

// GET ALL APPOINTMENTS - ADMIN
const getAllAppointments = (req, res) => {
  db.query(
    `SELECT
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.amount,
        a.notes,

        u.user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,

        p.pet_id,
        p.name AS pet_name,
        p.pet_type,
        p.breed,

        s.service_id,
        s.name AS service_name,
        s.price,
        s.duration

     FROM appointments a

     JOIN users u
       ON a.user_id = u.user_id

     JOIN pets p
       ON a.pet_id = p.pet_id

     JOIN services s
       ON a.service_id = s.service_id

     ORDER BY
       a.appointment_date ASC,
       a.appointment_time ASC`,
    (error, results) => {
      if (error) {
        console.error("Get all appointments error:", error);

        return res.status(500).json({
          message: "Failed to retrieve appointments.",
        });
      }

      return res.status(200).json(results);
    }
  );
};
// UPDATE APPOINTMENT STATUS - ADMIN
const updateAppointmentStatus = (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];

  // Check if status is valid
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid appointment status.",
    });
  }

  // Check if appointment exists
  db.query(
    "SELECT * FROM appointments WHERE appointment_id = ?",
    [appointmentId],
    (checkError, results) => {
      if (checkError) {
        console.error("Check appointment error:", checkError);

        return res.status(500).json({
          message: "Failed to verify appointment.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Appointment not found.",
        });
      }

      // Update status
      db.query(
        `UPDATE appointments
         SET status = ?
         WHERE appointment_id = ?`,
        [status, appointmentId],
        (error) => {
          if (error) {
            console.error("Update appointment status error:", error);

            return res.status(500).json({
              message: "Failed to update appointment status.",
            });
          }

          return res.status(200).json({
            message: "Appointment status updated successfully!",
          });
        }
      );
    }
  );
};

// CANCEL APPOINTMENT - CUSTOMER
const cancelAppointment = (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.id;

  // Validate appointment ID
  if (!/^[1-9]\d*$/.test(String(appointmentId))) {
    return res.status(400).json({
      message: "Invalid appointment ID.",
    });
  }

  // Cancel only the logged-in customer's eligible appointment
  db.query(
    `UPDATE appointments
     SET status = 'cancelled'
     WHERE appointment_id = ?
       AND user_id = ?
       AND status IN ('pending', 'confirmed')`,
    [appointmentId, userId],
    (error, result) => {
      if (error) {
        console.error("Cancel appointment error:", error);

        return res.status(500).json({
          message: "Failed to cancel appointment.",
        });
      }

      if (result.affectedRows > 0) {
        return res.status(200).json({
          message: "Appointment cancelled successfully!",
        });
      }

      // Determine why the appointment could not be cancelled
      db.query(
        `SELECT status
         FROM appointments
         WHERE appointment_id = ?
           AND user_id = ?`,
        [appointmentId, userId],
        (checkError, results) => {
          if (checkError) {
            console.error("Check appointment error:", checkError);

            return res.status(500).json({
              message: "Failed to verify appointment.",
            });
          }

          if (results.length === 0) {
            return res.status(404).json({
              message: "Appointment not found.",
            });
          }

          return res.status(400).json({
            message:
              "This appointment cannot be cancelled because it is already completed or cancelled.",
          });
        }
      );
    }
  );
};


module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};