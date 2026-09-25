const db = require("../config/database");

// CREATE APPOINTMENT
const createAppointment = (req, res) => {
  const {
    pet_name,
    pet_type,
    service,
    appointment_date,
    appointment_time,
    notes,
  } = req.body;

  if (
    !pet_name ||
    !pet_type ||
    !service ||
    !appointment_date ||
    !appointment_time
  ) {
    return res.status(400).json({
      message: "Please complete all required fields.",
    });
  }

  const userId = req.user.id;

  db.query(
    `INSERT INTO appointments
    (
      user_id,
      pet_name,
      pet_type,
      service,
      appointment_date,
      appointment_time,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      pet_name,
      pet_type,
      service,
      appointment_date,
      appointment_time,
      notes || null,
    ],
    (error, result) => {
      if (error) {
        console.error(error);

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
};


// GET MY APPOINTMENTS
const getMyAppointments = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT *
     FROM appointments
     WHERE user_id = ?
     ORDER BY appointment_date ASC, appointment_time ASC`,
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Failed to retrieve appointments.",
        });
      }

      return res.json(results);
    }
  );
};


module.exports = {
  createAppointment,
  getMyAppointments,
};