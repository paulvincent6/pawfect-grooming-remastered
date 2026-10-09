
const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
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


// CANCEL APPOINTMENT - CUSTOMER
router.patch(
  "/:id/cancel",
  authenticateToken,
  cancelAppointment
);


// GET ALL APPOINTMENTS - ADMIN
router.get(
  "/",
  authenticateToken,
  getAllAppointments
);


// UPDATE APPOINTMENT STATUS - ADMIN
router.put(
  "/:id/status",
  authenticateToken,
  updateAppointmentStatus
);


module.exports = router;
