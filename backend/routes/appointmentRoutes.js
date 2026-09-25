const express = require("express");

const {
  createAppointment,
  getMyAppointments,
} = require("../controllers/appointmentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createAppointment);

router.get("/my", authenticateToken, getMyAppointments);

module.exports = router;