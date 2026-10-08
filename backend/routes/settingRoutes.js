const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// GET SETTINGS
router.get(
  "/",
  authenticateToken,
  getSettings
);


// UPDATE SETTINGS
router.put(
  "/",
  authenticateToken,
  updateSettings
);


module.exports = router;