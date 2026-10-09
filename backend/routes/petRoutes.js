const express = require("express");

const {
  addPet,
  getMyPets,
  deletePet,
  updatePet,
} = require("../controllers/petController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ADD PET
router.post("/", authenticateToken, addPet);

// GET MY PETS
router.get("/my", authenticateToken, getMyPets);

// UPDATE PET
router.put("/:id", authenticateToken, updatePet);

// DELETE PET
router.delete("/:id", authenticateToken, deletePet);

module.exports = router;
