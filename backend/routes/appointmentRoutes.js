const express = require("express");

const {
  createAppointment,
  getMyAppointments,
} = require("../controllers/appointmentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE APPOINTMENT
router.post(
  "/",
  authenticateToken,
  createAppointment
);


// GET LOGGED-IN USER'S APPOINTMENTS
router.get(
  "/my",
  authenticateToken,
  getMyAppointments
);


module.exports = router;