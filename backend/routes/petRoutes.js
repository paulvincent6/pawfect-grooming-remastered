const express = require("express");

const {
  addPet,
  getMyPets,
} = require("../controllers/petController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, addPet);

router.get("/my", authenticateToken, getMyPets);

module.exports = router;